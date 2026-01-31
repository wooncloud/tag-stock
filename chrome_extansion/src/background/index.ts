// TagStock을 위한 백그라운드 서비스 워커

/**
 * 확장 프로그램 아이콘을 클릭했을 때 사이드패널 열기
 */
chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  } catch (error) {
    console.error('Failed to open side panel:', error);
  }
});

/**
 * 사이드패널 동작 구성
 */
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Failed to set panel behavior:', error));

/**
 * 확장 프로그램 설치 처리
 */
chrome.runtime.onInstalled.addListener(() => {
  console.log('TagStock extension installed');
});

/**
 * 메시지 라우팅 (필요한 경우)
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 필요한 경우 사이드패널과 콘텐츠 스크립트 간의 메시지 중계
  if (message.action === 'openSidePanel' && sender.tab?.windowId) {
    chrome.sidePanel.open({ windowId: sender.tab.windowId });
    sendResponse({ success: true });
  }
  return true;
});
