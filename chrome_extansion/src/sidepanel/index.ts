import { addLog } from './components/activity-log';
import {
  checkAuth,
  hideLoadingScreen,
  initAuthScreen,
  setOnLoginSuccess,
  showAuthScreen,
  showLoadingScreen,
} from './components/auth-screen';
import { setupEventListeners } from './event-listeners';
import { checkCurrentTab } from './handlers/tab-handler';
import { initializeUserSession } from './session';

/**
 * 사이드패널 초기화
 */
async function init(): Promise<void> {
  // 로딩 화면 먼저 표시
  showLoadingScreen();

  // 인증 화면 초기화
  initAuthScreen();

  // 로그인 성공 후 콜백 설정
  setOnLoginSuccess(async () => {
    showLoadingScreen();
    const profile = await checkAuth();
    if (profile) {
      hideLoadingScreen();
      await initializeUserSession(profile);
    } else {
      hideLoadingScreen();
      showAuthScreen();
    }
  });

  // 이벤트 리스너 설정 (인증 확인 전에 수행되어야 함)
  setupEventListeners();

  // 인증 상태 확인
  const profile = await checkAuth();

  if (profile) {
    // 사용자가 인증됨
    hideLoadingScreen();
    await initializeUserSession(profile);
  } else {
    // 사용자가 인증되지 않음
    hideLoadingScreen();
    showAuthScreen();
    addLog('Please sign in to use TagStock');
    return;
  }

  // 초기 확인
  await checkCurrentTab();
  addLog('TagStock side panel initialized');
}

// DOM이 준비되었을 때 초기화 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
