import { hasSufficientCredits } from '../../lib/supabase';
import { LINKS } from '../../shared/constants';
import { sendToContentScript } from '../../shared/messenger';
import type { ContentScriptResponse, SidepanelToContentMessage } from '../../shared/types';
import { addLog } from '../components/activity-log';
import {
  setFillAllError,
  setFillAllLoading,
  setFillAllSuccess,
} from '../components/fill-all-button';
import { getCurrentSiteType } from '../components/status-badge';
import { refreshProfile } from '../session';
import { getCurrentProfile, getCurrentTabId } from '../state';

/**
 * Fill All Metadata 버튼 클릭 핸들러
 */
export async function handleFillAllClick(): Promise<void> {
  const currentTabId = getCurrentTabId();
  const currentProfile = getCurrentProfile();

  if (!currentTabId) {
    addLog('No valid page detected', 'error');
    return;
  }

  if (!currentProfile) {
    addLog('Please login first', 'error');
    return;
  }

  // Free 플랜 제한
  if (currentProfile.plan === 'free') {
    alert(
      'Fill All Metadata is available on Pro and Max plans. Please upgrade to use this feature.'
    );
    chrome.tabs.create({ url: LINKS.PRICING });
    return;
  }

  if (!hasSufficientCredits(currentProfile)) {
    addLog('Not enough credits.', 'error');
    return;
  }

  const siteType = getCurrentSiteType();
  if (!siteType) {
    addLog('No valid page detected', 'error');
    return;
  }

  // 실행 전 경고
  alert(
    'Fill All Metadata will now process all images.\nPlease do not interact with the page until processing is complete.'
  );

  setFillAllLoading(true);
  addLog('Starting batch metadata generation...');

  try {
    const message: SidepanelToContentMessage = {
      action: 'generateAllMetadata',
      siteType: siteType,
    };

    const response: ContentScriptResponse = await sendToContentScript(currentTabId, message);

    setFillAllLoading(false);

    if (response && response.success) {
      setFillAllSuccess();
      addLog(
        `Batch complete: ${response.totalProcessed}/${response.totalImages} images processed`,
        'success'
      );
      alert(`Done! ${response.totalProcessed} out of ${response.totalImages} images processed.`);
      await refreshProfile();
    } else {
      throw new Error(response?.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Fill all error:', error);
    setFillAllLoading(false);
    setFillAllError();
    addLog(`Batch error: ${(error as Error).message}`, 'error');
  }
}
