import type { SidepanelToContentMessage, ContentScriptResponse } from '../shared/types';
import { onMessage } from '../shared/messenger';
import { detectStockSite, getSiteConfig } from '../core/sites/detector';
import { sendLog } from '../core/utils/logger';
import { fillMetadata } from './metadata-filler';

/**
 * Set up message listener for sidepanel communications
 */
export function setupMessageHandler(): void {
    onMessage((message: SidepanelToContentMessage, _sender, sendResponse) => {
        if (message.action === 'generateMetadata') {
            const siteType = message.siteType || detectStockSite();

            fillMetadata(siteType)
                .then((result) => {
                    const response: ContentScriptResponse = {
                        success: true,
                        title: result.title,
                        keywords: result.keywords
                    };
                    sendResponse(response);
                })
                .catch((error: Error) => {
                    console.error('Metadata generation failed:', error);
                    sendLog(`Error: ${error.message}`, 'error');
                    const response: ContentScriptResponse = {
                        success: false,
                        error: error.message
                    };
                    sendResponse(response);
                });

            // Return true for async response
            return true;
        }

        if (message.action === 'checkStatus') {
            const siteType = detectStockSite();
            const config = getSiteConfig(siteType);
            const response: ContentScriptResponse = {
                success: true,
                connected: siteType !== 'unknown',
                siteType: siteType,
                siteName: config?.name || 'Unknown'
            };
            sendResponse(response);
            return true;
        }

        return false;
    });
}
