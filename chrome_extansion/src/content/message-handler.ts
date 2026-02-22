import { detectStockSite, getSiteConfig } from '../core/sites/detector';
import { onMessage, sendLog } from '../shared/messenger';
import type { ContentScriptResponse } from '../shared/types';
import { fillAllMetadata } from './batch-metadata-filler';
import { fillMetadata } from './metadata-filler';

/**
 * 사이드패널과의 통신을 위한 메시지 리스너 설정
 */
export function setupMessageHandler(): void {
  console.log('[TagStock] Message handler registered');

  onMessage((message: any, _sender, sendResponse) => {
    console.log('[TagStock] Message received:', message);
    if (message.action === 'generateMetadata') {
      const siteType = message.siteType || detectStockSite();

      fillMetadata(siteType)
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

    if (message.action === 'generateAllMetadata') {
      const siteType = message.siteType || detectStockSite();

      fillAllMetadata(siteType)
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

    if (message.action === 'checkStatus') {
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
