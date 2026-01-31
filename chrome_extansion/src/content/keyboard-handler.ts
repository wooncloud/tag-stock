import { detectStockSite, isUploadPage } from '../core/sites/detector';
import { sendLog } from '../core/utils/logger';
import { fillMetadata } from './metadata-filler';

/**
 * Set up keyboard shortcut handler (Cmd+E / Ctrl+E)
 */
export function setupKeyboardHandler(): void {
    document.addEventListener('keydown', function (event: KeyboardEvent) {
        // Cmd+E (Mac) or Ctrl+E (Windows/Linux)
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
