import { LINKS } from '../shared/constants';
import { onMessage } from '../shared/messenger';
import type { ContentToSidepanelMessage } from '../shared/types';
import { addLog, clearLog } from './components/activity-log';
import { handleSignOut } from './components/auth-screen';
import { updateStatus } from './components/status-badge';
import { handleFillClick } from './handlers/fill-handler';
import { checkCurrentTab } from './handlers/tab-handler';
import { setCurrentProfile } from './state';

// DOM 요소 참조
const fillBtn = document.getElementById('fillBtn') as HTMLButtonElement | null;
const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement | null;
const contactBtn = document.getElementById('contactBtn') as HTMLButtonElement | null;
const adobeBtn = document.getElementById('adobeBtn') as HTMLButtonElement | null;
const shutterstockBtn = document.getElementById('shutterstockBtn') as HTMLButtonElement | null;
const signOutBtn = document.getElementById('signOutBtn') as HTMLButtonElement | null;
const clearLogBtn = document.getElementById('clearLogBtn') as HTMLButtonElement | null;

/**
 * UI 상호작용을 위한 이벤트 리스너 설정
 */
export function setupEventListeners(): void {
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
      setCurrentProfile(null);
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
