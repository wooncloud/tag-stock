import { createClient } from './client';

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
