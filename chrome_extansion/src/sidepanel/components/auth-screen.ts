import { getProfile, getUser, signInWithGoogle, signOut } from '../../lib/supabase/auth';
import type { UserProfile } from '../../shared/types';

let onLoginSuccessCallback: (() => Promise<void>) | null = null;

/**
 * 로그인 성공 후 호출될 콜백 설정
 */
export function setOnLoginSuccess(callback: () => Promise<void>): void {
  onLoginSuccessCallback = callback;
}

/**
 * 인증 화면 초기화 및 렌더링
 */
export function initAuthScreen(): void {
  const authContainer = document.getElementById('authContainer');
  const loginBtn = document.getElementById('loginBtn');
  const errorMessage = document.getElementById('authError');

  if (!authContainer) {
    console.error('authContainer element not found');
    return;
  }

  if (!loginBtn) {
    console.error('loginBtn element not found');
    return;
  }

  if (!errorMessage) {
    console.error('authError element not found');
    return;
  }

  // 구글 로그인 처리
  loginBtn.addEventListener('click', async () => {
    try {
      setAuthLoading(true);
      errorMessage.textContent = '';

      await signInWithGoogle();

      // 인증 상태를 새로고침하기 위해 성공 콜백 호출
      if (onLoginSuccessCallback) {
        await onLoginSuccessCallback();
      }
    } catch (error) {
      console.error('Login error:', error);
      errorMessage.textContent = 'Failed to login. Please try again.';
      setAuthLoading(false);
    }
  });
}

/**
 * 사용자가 인증되었는지 확인하고 프로필 반환
 */
export async function checkAuth(): Promise<UserProfile | null> {
  try {
    const user = await getUser();

    if (!user) {
      return null;
    }

    const profile = await getProfile(user.id);
    return profile;
  } catch (error) {
    console.error('Auth check error:', error);
    return null;
  }
}

/**
 * 로딩 화면 표시
 */
export function showLoadingScreen(): void {
  const loadingContainer = document.getElementById('loadingContainer');
  const authContainer = document.getElementById('authContainer');
  const appContainer = document.getElementById('appContainer');

  if (loadingContainer && authContainer && appContainer) {
    loadingContainer.classList.remove('hidden');
    authContainer.classList.add('hidden');
    appContainer.classList.add('hidden');
  }
}

/**
 * 로딩 화면 숨기기
 */
export function hideLoadingScreen(): void {
  const loadingContainer = document.getElementById('loadingContainer');
  if (loadingContainer) {
    loadingContainer.classList.add('hidden');
  }
}

/**
 * 인증 화면 표시
 */
export function showAuthScreen(): void {
  const loadingContainer = document.getElementById('loadingContainer');
  const authContainer = document.getElementById('authContainer');
  const appContainer = document.getElementById('appContainer');

  if (loadingContainer && authContainer && appContainer) {
    loadingContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');

    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) signOutBtn.classList.add('hidden');
  }
}

/**
 * 인증 화면을 숨기고 앱을 표시
 */
export function hideAuthScreen(): void {
  const loadingContainer = document.getElementById('loadingContainer');
  const authContainer = document.getElementById('authContainer');
  const appContainer = document.getElementById('appContainer');

  if (loadingContainer && authContainer && appContainer) {
    loadingContainer.classList.add('hidden');
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');

    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) signOutBtn.classList.remove('hidden');
  }
}

/**
 * 인증 화면의 로딩 상태 설정
 */
function setAuthLoading(loading: boolean): void {
  const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
  const loginLoading = document.getElementById('loginLoading');

  if (loginBtn && loginLoading) {
    if (loading) {
      loginBtn.classList.add('hidden');
      loginLoading.classList.remove('hidden');
    } else {
      loginBtn.classList.remove('hidden');
      loginLoading.classList.add('hidden');
    }
  }
}

/**
 * 로그아웃 처리
 */
export async function handleSignOut(): Promise<void> {
  try {
    await signOut();

    // 인증 화면을 표시하기 전에 로딩 상태 초기화
    setAuthLoading(false);
    showAuthScreen();

    // 캐시된 데이터 모두 지우기
    const creditDisplay = document.getElementById('creditDisplay');
    if (creditDisplay) {
      creditDisplay.textContent = '--';
    }
  } catch (error) {
    console.error('Sign out error:', error);
    setAuthLoading(false); // 에러 발생 시에도 초기화
  }
}
