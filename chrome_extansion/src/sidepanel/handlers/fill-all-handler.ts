import { getAccessToken } from '../../lib/supabase/user';
import { LINKS } from '../../shared/constants';
import { sendToContentScript } from '../../shared/messenger';
import type { ContentScriptResponse, SidepanelToContentMessage } from '../../shared/types';
import { addLog } from '../components/activity-log';
import {
  setFillAllError,
  setFillAllLoading,
  setFillAllSuccess,
} from '../components/fill-all-button';
import { refreshProfile } from '../session';
import { getCurrentProfile } from '../state';
import { validateFillPrerequisites } from './fill-handler';

/**
 * Fill All Metadata 버튼 클릭 핸들러
 */
export async function handleFillAllClick(): Promise<void> {
  const currentProfile = getCurrentProfile();

  // Free 플랜 제한 (공통 검증 전에 체크)
  if (currentProfile?.plan === 'free') {
    alert(
      'Fill All Metadata is available on Pro and Max plans. Please upgrade to use this feature.'
    );
    chrome.tabs.create({ url: LINKS.PRICING });
    return;
  }

  const prereq = validateFillPrerequisites();
  if (!prereq) return;

  const { tabId, siteType } = prereq;

  setFillAllLoading(true);
  addLog('Starting batch metadata generation...');

  try {
    const accessToken = await getAccessToken();
    const message: SidepanelToContentMessage = {
      action: 'generateAllMetadata',
      siteType,
      accessToken: accessToken || undefined,
    };

    const response: ContentScriptResponse = await sendToContentScript(tabId, message);

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
