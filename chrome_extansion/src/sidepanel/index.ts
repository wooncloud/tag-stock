import { hasSufficientCredits } from '../lib/supabase/auth';
import { LINKS } from '../shared/constants';
import { onMessage, sendToContentScript } from '../shared/messenger';
import type {
  ContentScriptResponse,
  ContentToSidepanelMessage,
  SidepanelToContentMessage,
  UserProfile,
} from '../shared/types';
import { addLog, clearLog } from './components/activity-log';
import {
  checkAuth,
  handleSignOut,
  hideAuthScreen,
  hideLoadingScreen,
  initAuthScreen,
  setOnLoginSuccess,
  showAuthScreen,
  showLoadingScreen,
} from './components/auth-screen';
import {
  hideLowCreditWarning,
  initCreditDisplay,
  showLowCreditWarning,
} from './components/credit-display';
import { setButtonError, setButtonLoading, setButtonSuccess } from './components/fill-button';
import { getCurrentSiteType, updateStatus } from './components/status-badge';

// DOM 요소 가져오기
const fillBtn = document.getElementById('fillBtn') as HTMLButtonElement | null;
const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement | null;
const contactBtn = document.getElementById('contactBtn') as HTMLButtonElement | null;
const adobeBtn = document.getElementById('adobeBtn') as HTMLButtonElement | null;
const shutterstockBtn = document.getElementById('shutterstockBtn') as HTMLButtonElement | null;
const signOutBtn = document.getElementById('signOutBtn') as HTMLButtonElement | null;
const clearLogBtn = document.getElementById('clearLogBtn') as HTMLButtonElement | null;
const userEmailEl = document.getElementById('userEmail') as HTMLDivElement | null;
const userPlanEl = document.getElementById('userPlan') as HTMLDivElement | null;

let currentTabId: number | null = null;
let currentProfile: UserProfile | null = null;

/**
 * 현재 탭 상태 확인
 */
async function checkCurrentTab(): Promise<void> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      updateStatus(false, '', '');
      return;
    }

    currentTabId = tab.id;
    const url = tab.url || '';

    if (url.includes('contributor.stock.adobe.com') && url.includes('uploads')) {
      updateStatus(true, 'Adobe Stock', 'Upload page detected');
      addLog('Adobe Stock upload page detected');
    } else if (url.includes('submit.shutterstock.com')) {
      updateStatus(true, 'Shutterstock', 'Upload page detected');
      addLog('Shutterstock upload page detected');
    } else if (url.includes('adobe.com') || url.includes('shutterstock.com')) {
      updateStatus(false, '', 'Navigate to the upload page');
    } else {
      updateStatus(false, '', '');
    }
  } catch (error) {
    console.error('Error checking tab:', error);
    updateStatus(false, '', '');
  }
}

/**
 * 채우기 버튼 클릭 핸들러
 */
async function handleFillClick(): Promise<void> {
  if (!currentTabId) {
    addLog('No valid page detected', 'error');
    return;
  }

  // 인증 및 크레딧 확인
  if (!currentProfile) {
    addLog('Please login first', 'error');
    return;
  }

  if (!hasSufficientCredits(currentProfile)) {
    addLog('Insufficient credits. Please upgrade your plan', 'error');
    return;
  }

  const siteType = getCurrentSiteType();
  if (!siteType) {
    addLog('No valid page detected', 'error');
    return;
  }

  setButtonLoading(true);
  addLog('Starting AI metadata generation...');

  try {
    const message: SidepanelToContentMessage = {
      action: 'generateMetadata',
      siteType: siteType,
    };

    const response: ContentScriptResponse = await sendToContentScript(currentTabId, message);

    setButtonLoading(false);

    if (response && response.success) {
      setButtonSuccess();
      addLog(`Metadata generated: "${response.title}"`, 'success');

      // 크레딧 업데이트를 위해 프로필 새로고침
      await refreshProfile();
    } else {
      throw new Error(response?.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Fill error:', error);
    setButtonLoading(false);
    setButtonError();
    addLog(`Error: ${(error as Error).message}`, 'error');
  }
}

/**
 * 사용자 프로필 새로고침 및 UI 업데이트
 */
async function refreshProfile(): Promise<void> {
  const profile = await checkAuth();

  if (profile) {
    currentProfile = profile;
    initCreditDisplay(profile);

    const totalCredits = profile.credits_subscription + profile.credits_purchased;
    if (totalCredits <= 5) {
      showLowCreditWarning(totalCredits);
    } else {
      hideLowCreditWarning();
    }
  }
}

/**
 * 사용자 세션 초기화
 */
async function initializeUserSession(profile: UserProfile): Promise<void> {
  currentProfile = profile;

  // UI 업데이트
  if (userEmailEl) {
    userEmailEl.textContent = profile.email;
  }

  if (userPlanEl) {
    const planName = profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1);
    userPlanEl.textContent = `${planName} Plan`;
  }

  // 크레딧 표시 초기화
  initCreditDisplay(profile);

  // 부족한 크레딧 확인
  const totalCredits = profile.credits_subscription + profile.credits_purchased;
  if (totalCredits <= 5) {
    showLowCreditWarning(totalCredits);
  }

  // 앱 표시
  hideAuthScreen();
  addLog('Signed in successfully');
}

/**
 * UI 상호작용을 위한 이벤트 리스너 설정
 */
function setupEventListeners(): void {
  // 헤더 링크
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: LINKS.HOME });
    });
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: LINKS.CONTACT });
    });
  }

  // 퀵 링크
  if (adobeBtn) {
    adobeBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: LINKS.ADOBE_PORTFOLIO });
    });
  }

  if (shutterstockBtn) {
    shutterstockBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: LINKS.SHUTTERSTOCK_PORTFOLIO });
    });
  }

  // 채우기 버튼 클릭
  if (fillBtn) {
    fillBtn.addEventListener('click', handleFillClick);
  }

  // 로그아웃 버튼
  if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
      await handleSignOut();
      currentProfile = null;
      addLog('Signed out successfully');
    });
  }

  // 로그 지우기 버튼
  if (clearLogBtn) {
    clearLogBtn.addEventListener('click', () => {
      clearLog();
    });
  }

  // 탭 변경 리스너
  chrome.tabs.onActivated.addListener(() => {
    checkCurrentTab();
  });

  chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
    if (changeInfo.status === 'complete') {
      checkCurrentTab();
    }
  });

  // 콘텐츠 스크립트로부터의 메시지 수신
  onMessage((message: ContentToSidepanelMessage) => {
    if (message.type === 'log') {
      addLog(message.text || '', message.level || 'info');
    } else if (message.type === 'status') {
      if (message.connected) {
        updateStatus(true, message.site || '', message.info || '');
      }
    }
  });
}

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
