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
 * 메시지 라우팅
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 사이드패널 열기
  if (message.action === 'openSidePanel' && sender.tab?.windowId) {
    chrome.sidePanel.open({ windowId: sender.tab.windowId });
    sendResponse({ success: true });
    return true;
  }

  // 이미지 fetch (CORS 우회)
  if (message.action === 'fetchImage' && message.url) {
    fetchImageAsBase64(message.url)
      .then((base64) => sendResponse({ success: true, base64 }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  // API 프록시 (content script CSP 우회)
  if (message.action === 'proxyFetch' && message.url) {
    proxyFetch(message.url, message.options)
      .then((data) => sendResponse({ success: true, data }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true;
  }

  return true;
});

/**
 * 이미지 URL을 base64로 변환 (CORS 우회)
 */
async function fetchImageAsBase64(url: string): Promise<string> {
  console.log('[TagStock BG] Fetching image:', url);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }

  const base64 = btoa(binary);
  console.log('[TagStock BG] Image converted, length:', base64.length);

  return base64;
}

/**
 * API 프록시 (content script의 CSP 우회)
 */
async function proxyFetch(
  url: string,
  options?: { method?: string; headers?: Record<string, string>; body?: string }
): Promise<unknown> {
  console.log('[TagStock BG] Proxy fetch:', url);

  const response = await fetch(url, {
    method: options?.method || 'GET',
    headers: options?.headers,
    body: options?.body,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      (errorData as { error?: string }).error || `Server error: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
}
