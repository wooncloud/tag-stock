import type { User } from '@supabase/supabase-js';

import type { UserProfile } from '../../shared/types';
import { createClient } from './client';

/**
 * 현재 사용자 가져오기
 */
export async function getUser(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    // 로그인하지 않았을 때 세션이 없는 것은 예상된 상황이므로 에러로 로깅하지 않음
    if (
      error.message.includes('session_missing') ||
      error.message.includes('Auth session missing')
    ) {
      console.log('활성 세션 없음 (사용자가 로그인하지 않음)');
    } else {
      console.error('Error getting user:', error);
    }
    return null;
  }

  return user;
}

/**
 * 데이터베이스에서 사용자 프로필 가져오기
 */
export async function getProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile || error) {
    // 프로필이 없으면 생성 시도
    const user = await getUser();
    if (!user) return null;

    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      // @ts-expect-error - Supabase 스키마 타입이 구성되지 않음
      .upsert({
        id: userId,
        email: user.email || '',
        plan: 'free',
        credits_subscription: 10,
        credits_purchased: 0,
      })
      .select()
      .single();

    if (!insertError && newProfile) {
      return newProfile as UserProfile;
    }

    // 삽입 실패 시 기본값 반환
    return {
      id: userId,
      email: user.email || '',
      plan: 'free',
      credits_subscription: 0,
      credits_purchased: 0,
    };
  }

  return profile as UserProfile;
}

/**
 * Google OAuth로 로그인
 * 크롬 확장 프로그램의 적절한 OAuth 처리를 위해 chrome.identity API를 사용합니다.
 */
export async function signInWithGoogle(): Promise<void> {
  const supabase = createClient();

  // 크롬에서 리다이렉트 URL 가져오기
  const redirectUrl = chrome.identity.getRedirectURL();
  console.log('Chrome Identity Redirect URL:', redirectUrl);

  // Supabase에서 OAuth URL 가져오기
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    console.error('Error getting OAuth URL:', error);
    throw error;
  }

  if (!data?.url) {
    throw new Error('No OAuth URL returned');
  }

  console.log('Launching OAuth with URL:', data.url);

  // Chrome Identity API를 사용하여 OAuth 흐름 시작
  return new Promise((resolve, reject) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: data.url,
        interactive: true,
      },
      (responseUrl) => {
        // 에러 확인
        if (chrome.runtime.lastError) {
          console.error('Chrome identity error:', chrome.runtime.lastError);
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!responseUrl) {
          reject(new Error('No response URL received'));
          return;
        }

        console.log('OAuth Response URL:', responseUrl);

        // URL에서 토큰 추출
        try {
          const url = new URL(responseUrl);
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const errorParam = hashParams.get('error');

          if (errorParam) {
            reject(new Error(errorParam));
            return;
          }

          if (!accessToken || !refreshToken) {
            reject(new Error('No access token received'));
            return;
          }

          console.log('토큰 추출 완료, 세션 설정 중...');

          // Supabase에 세션 설정
          supabase.auth
            .setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            .then(() => {
              console.log('세션 설정 완료');
              resolve();
            })
            .catch((err) => {
              console.error('Error setting session:', err);
              reject(err);
            });
        } catch (err) {
          console.error('Error parsing OAuth response:', err);
          reject(err);
        }
      }
    );
  });
}

/**
 * 로그아웃
 */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * 사용 가능한 총 크레딧 가져오기
 */
export function getTotalCredits(profile: UserProfile): number {
  return profile.credits_subscription + profile.credits_purchased;
}

/**
 * 사용자가 충분한 크레딧을 가지고 있는지 확인
 */
export function hasSufficientCredits(profile: UserProfile, required: number = 1): boolean {
  return getTotalCredits(profile) >= required;
}
