import type { ContentToSidepanelMessage, SidepanelToContentMessage, ContentScriptResponse, UserProfile } from '../shared/types';
import { LINKS } from '../shared/constants';
import { sendToContentScript, onMessage } from '../shared/messenger';
import { updateStatus, getCurrentSiteType } from './components/status-badge';
import { setButtonLoading, setButtonSuccess, setButtonError } from './components/fill-button';
import { addLog, clearLog } from './components/activity-log';
import { initAuthScreen, checkAuth, showAuthScreen, hideAuthScreen, handleSignOut, showLoadingScreen, hideLoadingScreen, setOnLoginSuccess } from './components/auth-screen';
import { initCreditDisplay, showLowCreditWarning, hideLowCreditWarning } from './components/credit-display';
import { hasSufficientCredits } from '../lib/supabase/auth';

// Get DOM elements
const fillBtn = document.getElementById('fillBtn') as HTMLButtonElement | null;
const homeBtn = document.getElementById('homeBtn') as HTMLButtonElement | null;
const contactBtn = document.getElementById('contactBtn') as HTMLButtonElement | null;
const adobeBtn = document.getElementById('adobeBtn') as HTMLButtonElement | null;
const shutterstockBtn = document.getElementById('shutterstockBtn') as HTMLButtonElement | null;
const signOutBtn = document.getElementById('signOutBtn') as HTMLButtonElement | null;
const clearLogBtn = document.getElementById('clearLogBtn') as HTMLButtonElement | null;
const userEmailEl = document.getElementById('userEmail') as HTMLDivElement | null;
const userPlanEl = document.getElementById('userPlan') as HTMLDivElement | null;

let currentTabId: number | null = null;
let currentProfile: UserProfile | null = null;

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

    // Check auth and credits
    if (!currentProfile) {
        addLog('Please login first', 'error');
        return;
    }

    if (!hasSufficientCredits(currentProfile)) {
        addLog('Insufficient credits. Please upgrade your plan', 'error');
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

            // Refresh profile to update credits
            await refreshProfile();
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
 * Refresh user profile and update UI
 */
async function refreshProfile(): Promise<void> {
    const profile = await checkAuth();

    if (profile) {
        currentProfile = profile;
        initCreditDisplay(profile);

        const totalCredits = profile.credits_subscription + profile.credits_purchased;
        if (totalCredits <= 5) {
            showLowCreditWarning(totalCredits);
        } else {
            hideLowCreditWarning();
        }
    }
}

/**
 * Initialize user session
 */
async function initializeUserSession(profile: UserProfile): Promise<void> {
    currentProfile = profile;

    // Update UI
    if (userEmailEl) {
        userEmailEl.textContent = profile.email;
    }

    if (userPlanEl) {
        const planName = profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1);
        userPlanEl.textContent = `${planName} Plan`;
    }

    // Initialize credit display
    initCreditDisplay(profile);

    // Check for low credits
    const totalCredits = profile.credits_subscription + profile.credits_purchased;
    if (totalCredits <= 5) {
        showLowCreditWarning(totalCredits);
    }

    // Show app
    hideAuthScreen();
    addLog('Signed in successfully');
}

/**
 * Initialize sidepanel
 */
async function init(): Promise<void> {
    // Show loading screen first
    showLoadingScreen();

    // Initialize auth screen
    initAuthScreen();

    // Set callback for after successful login
    setOnLoginSuccess(async () => {
        showLoadingScreen();
        const profile = await checkAuth();
        if (profile) {
            hideLoadingScreen();
            await initializeUserSession(profile);
        } else {
            hideLoadingScreen();
            showAuthScreen();
        }
    });

    // Check auth status
    const profile = await checkAuth();

    if (profile) {
        // User is authenticated
        hideLoadingScreen();
        await initializeUserSession(profile);
    } else {
        // User is not authenticated
        hideLoadingScreen();
        showAuthScreen();
        addLog('Please sign in to use TagStock');
        return;
    }

    // Header links
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

    // Quick links
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

    // Fill button click
    if (fillBtn) {
        fillBtn.addEventListener('click', handleFillClick);
    }

    // Sign out button
    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            await handleSignOut();
            currentProfile = null;
            addLog('Signed out successfully');
        });
    }

    // Clear log button
    if (clearLogBtn) {
        clearLogBtn.addEventListener('click', () => {
            clearLog();
        });
    }

    // Tab change listeners
    chrome.tabs.onActivated.addListener(() => {
        checkCurrentTab();
    });

    chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
        if (changeInfo.status === 'complete') {
            checkCurrentTab();
        }
    });

    // Listen for messages from content script
    onMessage((message: ContentToSidepanelMessage) => {
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
