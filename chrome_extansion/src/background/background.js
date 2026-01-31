// Background Service Worker for TagStock

// 확장 프로그램 아이콘 클릭 시 사이드 패널 열기
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  } catch (error) {
    console.error('Failed to open side panel:', error);
  }
});

// 사이드 패널 활성화 설정
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Failed to set panel behavior:', error));

// 설치 시 초기화
chrome.runtime.onInstalled.addListener(() => {
  console.log('TagStock extension installed');
});

// 메시지 라우팅 (필요 시)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Side panel과 content script 간 메시지 중계가 필요한 경우 여기서 처리
  if (message.action === 'openSidePanel') {
    chrome.sidePanel.open({ windowId: sender.tab.windowId });
    sendResponse({ success: true });
  }
  return true;
});
