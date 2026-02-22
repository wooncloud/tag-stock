import { detectStockSite, getSiteConfig } from '../core/sites/detector';
import { onMessage, sendLog } from '../shared/messenger';
import type { ContentScriptResponse, SidepanelToContentMessage } from '../shared/types';
import { fillAllMetadata } from './batch-metadata-filler';
import { fillMetadata } from './metadata-filler';

/**
 * 사이드패널과의 통신을 위한 메시지 리스너 설정
 */
export function setupMessageHandler(): void {
  console.log('[TagStock] Message handler registered');

  onMessage((message, _sender, sendResponse) => {
    if (!('action' in message)) return false;

    const msg = message as SidepanelToContentMessage;
    console.log('[TagStock] Message received:', msg);

    if (msg.action === 'generateMetadata') {
      const siteType = msg.siteType || detectStockSite();

      fillMetadata(siteType, msg.accessToken)
        .then((result) => {
          const response: ContentScriptResponse = {
            success: true,
            title: result.title,
            keywords: result.keywords,
          };
          sendResponse(response);
        })
        .catch((error: Error) => {
          console.error('Metadata generation failed:', error);
          sendLog(`Error: ${error.message}`, 'error');
          const response: ContentScriptResponse = {
            success: false,
            error: error.message,
          };
          sendResponse(response);
        });

      // 비동기 응답을 위해 true 반환
      return true;
    }

    if (msg.action === 'generateAllMetadata') {
      const siteType = msg.siteType || detectStockSite();

      fillAllMetadata(siteType, msg.accessToken)
        .then((result) => {
          const response: ContentScriptResponse = {
            success: true,
            totalProcessed: result.totalProcessed,
            totalImages: result.totalImages,
            errors: result.errors,
          };
          sendResponse(response);
        })
        .catch((error: Error) => {
          console.error('Batch metadata generation failed:', error);
          sendLog(`Batch error: ${error.message}`, 'error');
          const response: ContentScriptResponse = {
            success: false,
            error: error.message,
          };
          sendResponse(response);
        });

      return true;
    }

    if (msg.action === 'checkStatus') {
      const siteType = detectStockSite();
      const config = getSiteConfig(siteType);
      const response: ContentScriptResponse = {
        success: true,
        connected: siteType !== 'unknown',
        siteType: siteType,
        siteName: config?.name || 'Unknown',
      };
      sendResponse(response);
      return true;
    }

    return false;
  });
}
