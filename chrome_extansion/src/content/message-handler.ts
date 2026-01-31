import { detectStockSite, getSiteConfig } from '../core/sites/detector';
import { sendLog } from '../core/utils/logger';
import { onMessage } from '../shared/messenger';
import type { ContentScriptResponse, SidepanelToContentMessage } from '../shared/types';
import { fillMetadata } from './metadata-filler';

/**
 * 사이드패널과의 통신을 위한 메시지 리스너 설정
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
