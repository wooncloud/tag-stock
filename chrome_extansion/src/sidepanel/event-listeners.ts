import { LINKS } from '../shared/constants';
import { onMessage } from '../shared/messenger';
import type { ContentToSidepanelMessage, FillAllProgressMessage } from '../shared/types';
import { addLog, clearLog } from './components/activity-log';
import { handleSignOut } from './components/auth-screen';
import { updateFillAllProgress } from './components/fill-all-button';
import { updateStatus } from './components/status-badge';
import { handleFillAllClick } from './handlers/fill-all-handler';
import { handleFillClick } from './handlers/fill-handler';
import { checkCurrentTab } from './handlers/tab-handler';
import { setCurrentProfile } from './state';

// DOM 요소 참조
const fillBtn = document.getElementById('fillBtn') as HTMLButtonElement | null;
const fillAllBtn = document.getElementById('fillAllBtn') as HTMLButtonElement | null;
const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement | null;
const contactBtn = document.getElementById('contactBtn') as HTMLButtonElement | null;
const adobeBtn = document.getElementById('adobeBtn') as HTMLButtonElement | null;
const shutterstockBtn = document.getElementById('shutterstockBtn') as HTMLButtonElement | null;
const localFilesBtn = document.getElementById('localFilesBtn') as HTMLButtonElement | null;
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

  if (localFilesBtn) {
    localFilesBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('local/local.html') });
    });
  }

  // 채우기 버튼 클릭
  if (fillBtn) {
    fillBtn.addEventListener('click', handleFillClick);
  }

  // Fill All Metadata 버튼 클릭
  if (fillAllBtn) {
    fillAllBtn.addEventListener('click', handleFillAllClick);
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
  onMessage((message) => {
    if (!('type' in message)) return;

    if (message.type === 'log') {
      const msg = message as ContentToSidepanelMessage;
      addLog(msg.text || '', msg.level || 'info');
    } else if (message.type === 'status') {
      const msg = message as ContentToSidepanelMessage;
      if (msg.connected) {
        updateStatus(true, msg.site || '', msg.info || '');
      }
    } else if (message.type === 'fillAllProgress') {
      const prog = message as FillAllProgressMessage;
      updateFillAllProgress(prog.current, prog.total);
    }
  });
}
