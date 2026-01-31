import type {
  ContentScriptResponse,
  ContentToSidepanelMessage,
  LogLevel,
  SidepanelToContentMessage,
} from './types';

/**
 * 사이드패널에 로그 메시지를 보냅니다.
 * 사이드패널이 열려 있지 않으면 아무 동작도 하지 않습니다.
 */
export function sendLog(text: string, level: LogLevel = 'info'): void {
  try {
    const message: ContentToSidepanelMessage = {
      type: 'log',
      text,
      level,
    };
    chrome.runtime.sendMessage(message);
  } catch (e) {
    // 사이드패널이 열려 있지 않음, 무시
  }
}

/**
 * 사이드패널에 상태 업데이트를 보냅니다.
 */
export function sendStatus(connected: boolean, site: string, info: string): void {
  try {
    const message: ContentToSidepanelMessage = {
      type: 'status',
      connected,
      site,
      info,
    };
    chrome.runtime.sendMessage(message);
  } catch (e) {
    // 사이드패널이 열려 있지 않음, 무시
  }
}

/**
 * 콘텐츠 스크립트에 메시지를 보냅니다.
 */
export async function sendToContentScript(
  tabId: number,
  message: SidepanelToContentMessage
): Promise<ContentScriptResponse> {
  return chrome.tabs.sendMessage(tabId, message);
}

/**
 * 메시지 리스너를 설정합니다.
 */
export function onMessage(
  callback: (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => boolean | void
): void {
  chrome.runtime.onMessage.addListener(callback);
}
