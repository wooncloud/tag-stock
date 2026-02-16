import { hasSufficientCredits } from '../../lib/supabase';
import { sendToContentScript } from '../../shared/messenger';
import type { ContentScriptResponse, SidepanelToContentMessage } from '../../shared/types';
import { addLog } from '../components/activity-log';
import { setButtonError, setButtonLoading, setButtonSuccess } from '../components/fill-button';
import { getCurrentSiteType } from '../components/status-badge';
import { refreshProfile } from '../session';
import { getCurrentProfile, getCurrentTabId } from '../state';

/**
 * 채우기 버튼 클릭 핸들러
 */
export async function handleFillClick(): Promise<void> {
  const currentTabId = getCurrentTabId();
  const currentProfile = getCurrentProfile();

  if (!currentTabId) {
    addLog('No valid page detected', 'error');
    return;
  }

  // 인증 및 크레딧 확인
  if (!currentProfile) {
    addLog('Please login first', 'error');
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

  setButtonLoading(true);
  addLog('Starting AI metadata generation...');

  try {
    console.log('[TagStock] Sending to tab:', currentTabId);

    const message: SidepanelToContentMessage = {
      action: 'generateMetadata',
      siteType: siteType,
    };

    console.log('[TagStock] Message:', message);
    const response: ContentScriptResponse = await sendToContentScript(currentTabId, message);
    console.log('[TagStock] Response:', response);

    setButtonLoading(false);

    if (response && response.success) {
      // 크레딧은 서버(/api/generate)에서 차감됨
      setButtonSuccess();
      addLog(`Metadata generated: "${response.title}"`, 'success');

      // 서버에서 차감된 크레딧 반영을 위해 프로필 새로고침
      await refreshProfile();
    } else {
      throw new Error(response?.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Fill error:', error);
    setButtonLoading(false);
    setButtonError();
    addLog(`Error: ${(error as Error).message}`, 'error');
  }
}
