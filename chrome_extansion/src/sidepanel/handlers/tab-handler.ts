import { addLog } from '../components/activity-log';
import { updateStatus } from '../components/status-badge';
import { setCurrentTabId } from '../state';

/**
 * 현재 탭 상태 확인
 */
export async function checkCurrentTab(): Promise<void> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.id) {
      updateStatus(false, '', '');
      return;
    }

    setCurrentTabId(tab.id);
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
