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
 * 현재 세션의 access token 가져오기
 */
export async function getAccessToken(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}
