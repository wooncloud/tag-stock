import { detectStockSite, getSiteConfig, isUploadPage } from '../core/sites/detector';
import { sendStatus } from '../shared/messenger';
import { setupMessageHandler } from './message-handler';
import { setupKeyboardHandler } from './keyboard-handler';

/**
 * Initialize content script
 */
function init(): void {
    const siteType = detectStockSite();

    if (siteType === 'unknown') {
        return;
    }

    if (!isUploadPage(siteType)) {
        return;
    }

    console.log(`TagStock content script initialized on ${siteType}`);

    // Setup message and keyboard handlers
    setupMessageHandler();
    setupKeyboardHandler();

    // Send status to sidepanel
    const config = getSiteConfig(siteType);
    sendStatus(true, config?.name || siteType, 'Upload page ready');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
