import type { ContentToSidepanelMessage, SidepanelToContentMessage, ContentScriptResponse } from '../shared/types';
import { LINKS } from '../shared/constants';
import { sendToContentScript, onMessage } from '../shared/messenger';
import { updateStatus, getCurrentSiteType } from './components/status-badge';
import { setButtonLoading, setButtonSuccess, setButtonError } from './components/fill-button';
import { addLog } from './components/activity-log';

// Get DOM elements
const fillBtn = document.getElementById('fillBtn') as HTMLButtonElement;
const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement;
const contactBtn = document.getElementById('contactBtn') as HTMLButtonElement;
const adobeBtn = document.getElementById('adobeBtn') as HTMLButtonElement;
const shutterstockBtn = document.getElementById('shutterstockBtn') as HTMLButtonElement;

let currentTabId: number | null = null;

/**
 * Check current tab status
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
 * Handle fill button click
 */
async function handleFillClick(): Promise<void> {
    if (!currentTabId) {
        addLog('No valid page detected', 'error');
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
            siteType: siteType
        };

        const response: ContentScriptResponse = await sendToContentScript(currentTabId, message);

        setButtonLoading(false);

        if (response && response.success) {
            setButtonSuccess();
            addLog(`Metadata generated: "${response.title}"`, 'success');
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
 * Initialize sidepanel
 */
async function init(): Promise<void> {
    // Header links
    homeBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: LINKS.HOME });
    });

    contactBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: LINKS.CONTACT });
    });

    // Quick links
    adobeBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: LINKS.ADOBE_PORTFOLIO });
    });

    shutterstockBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: LINKS.SHUTTERSTOCK_PORTFOLIO });
    });

    // Fill button click
    fillBtn.addEventListener('click', handleFillClick);

    // Tab change listeners
    chrome.tabs.onActivated.addListener(() => {
        checkCurrentTab();
    });

    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, _tab) => {
        if (changeInfo.status === 'complete') {
            checkCurrentTab();
        }
    });

    // Listen for messages from content script
    onMessage((message: ContentToSidepanelMessage, _sender, _sendResponse) => {
        if (message.type === 'log') {
            addLog(message.text || '', message.level || 'info');
        } else if (message.type === 'status') {
            if (message.connected) {
                updateStatus(true, message.site || '', message.info || '');
            }
        }
    });

    // Initial checks
    await checkCurrentTab();
    addLog('TagStock side panel initialized');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
