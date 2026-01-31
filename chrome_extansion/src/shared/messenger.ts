import type {
    ContentToSidepanelMessage,
    SidepanelToContentMessage,
    ContentScriptResponse,
    LogLevel,
} from './types';

/**
 * Send a log message to the sidepanel
 * This will fail silently if the sidepanel is not open
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
        // Sidepanel is not open, ignore
    }
}

/**
 * Send a status update to the sidepanel
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
        // Sidepanel is not open, ignore
    }
}

/**
 * Send a message to the content script
 */
export async function sendToContentScript(
    tabId: number,
    message: SidepanelToContentMessage
): Promise<ContentScriptResponse> {
    return chrome.tabs.sendMessage(tabId, message);
}

/**
 * Set up a message listener
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
