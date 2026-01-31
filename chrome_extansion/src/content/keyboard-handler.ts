import { detectStockSite, isUploadPage } from '../core/sites/detector';
import { sendLog } from '../shared/messenger';
import { fillMetadata } from './metadata-filler';

/**
 * 키보드 단축키 핸들러 설정 (Cmd+E / Ctrl+E)
 */
export function setupKeyboardHandler(): void {
  document.addEventListener('keydown', function (event: KeyboardEvent) {
    // Cmd+E (Mac) 또는 Ctrl+E (Windows/Linux)
    if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
      event.preventDefault();

      const siteType = detectStockSite();
      if (siteType === 'unknown') {
        sendLog('Unsupported site', 'error');
        return;
      }

      if (!isUploadPage(siteType)) {
        sendLog('Not on upload page', 'error');
        return;
      }

      fillMetadata(siteType)
        .then((result) => {
          sendLog(`Filled: ${result.title}`, 'success');
        })
        .catch((error: Error) => {
          sendLog(`Error: ${error.message}`, 'error');
        });
    }
  });
}
