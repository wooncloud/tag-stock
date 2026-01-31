// Background Service Worker for TagStock

/**
 * Open side panel when extension icon is clicked
 */
chrome.action.onClicked.addListener(async (tab) => {
    try {
        await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (error) {
        console.error('Failed to open side panel:', error);
    }
});

/**
 * Configure side panel behavior
 */
chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error('Failed to set panel behavior:', error));

/**
 * Handle extension installation
 */
chrome.runtime.onInstalled.addListener(() => {
    console.log('TagStock extension installed');
});

/**
 * Message routing (if needed)
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Relay messages between side panel and content script if needed
    if (message.action === 'openSidePanel' && sender.tab?.windowId) {
        chrome.sidePanel.open({ windowId: sender.tab.windowId });
        sendResponse({ success: true });
    }
    return true;
});
