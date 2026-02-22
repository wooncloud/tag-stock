import type {
  ContentScriptResponse,
  ContentToSidepanelMessage,
  FillAllProgressMessage,
  LogLevel,
  SidepanelToContentMessage,
} from './types';

/**
 * Background 서비스 워커에 메시지를 보내고 응답을 받습니다.
 * content script에서 CORS/CSP 우회를 위해 background를 프록시로 사용합니다.
 */
export function sendToBackground<T = unknown>(message: Record<string, unknown>): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message || 'Background message failed'));
        return;
      }
      if (response?.success) {
        resolve((response.data ?? response.base64) as T);
      } else {
        reject(new Error(response?.error || 'Background request failed'));
      }
    });
  });
}

/**
 * 사이드패널에 메시지를 보냅니다. (사이드패널이 닫혀 있으면 무시)
 */
function sendToSidepanel(message: ContentToSidepanelMessage | FillAllProgressMessage): void {
  try {
    chrome.runtime.sendMessage(message);
  } catch {
    // 사이드패널이 열려 있지 않음
  }
}

/**
 * 사이드패널에 로그 메시지를 보냅니다.
 */
export function sendLog(text: string, level: LogLevel = 'info'): void {
  sendToSidepanel({ type: 'log', text, level });
}

/**
 * 사이드패널에 상태 업데이트를 보냅니다.
 */
export function sendStatus(connected: boolean, site: string, info: string): void {
  sendToSidepanel({ type: 'status', connected, site, info });
}

/**
 * 사이드패널에 Fill All 진행 상황을 보냅니다.
 */
export function sendProgress(
  current: number,
  total: number,
  status: 'processing' | 'completed' | 'error',
  extra?: { title?: string; error?: string }
): void {
  sendToSidepanel({
    type: 'fillAllProgress',
    current,
    total,
    status,
    ...extra,
  });
}

/**
 * 콘텐츠 스크립트에 메시지를 보냅니다.
 * 콘텐츠 스크립트가 없으면 동적으로 주입 후 재시도합니다.
 */
export async function sendToContentScript(
  tabId: number,
  message: SidepanelToContentMessage
): Promise<ContentScriptResponse> {
  try {
    return await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    const errMsg = (error as Error).message || '';
    if (!errMsg.includes('Receiving end does not exist')) {
      throw error;
    }

    // 콘텐츠 스크립트 동적 주입 후 재시도
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js'],
    });

    // 스크립트 초기화 대기
    await new Promise((resolve) => setTimeout(resolve, 500));

    return chrome.tabs.sendMessage(tabId, message);
  }
}

/**
 * 메시지 리스너를 설정합니다.
 */
export function onMessage(
  callback: (
    message: ContentToSidepanelMessage | SidepanelToContentMessage | FillAllProgressMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: ContentScriptResponse) => void
  ) => boolean | void
): void {
  chrome.runtime.onMessage.addListener(callback);
}
