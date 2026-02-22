import { hasSufficientCredits } from '../../lib/supabase';
import { getAccessToken } from '../../lib/supabase/user';
import { sendToContentScript } from '../../shared/messenger';
import type {
  ContentScriptResponse,
  SidepanelToContentMessage,
  SiteType,
} from '../../shared/types';
import { addLog } from '../components/activity-log';
import { setButtonError, setButtonLoading, setButtonSuccess } from '../components/fill-button';
import { getCurrentSiteType } from '../components/status-badge';
import { refreshProfile } from '../session';
import { getCurrentProfile, getCurrentTabId } from '../state';

/**
 * Fill 핸들러 공통 사전 검증
 * 탭, 인증, 크레딧, 사이트 타입을 확인하고 유효하면 tabId와 siteType을 반환합니다.
 */
export function validateFillPrerequisites(): {
  tabId: number;
  siteType: SiteType;
} | null {
  const currentTabId = getCurrentTabId();
  if (!currentTabId) {
    addLog('No valid page detected', 'error');
    return null;
  }

  const currentProfile = getCurrentProfile();
  if (!currentProfile) {
    addLog('Please login first', 'error');
    return null;
  }

  if (!hasSufficientCredits(currentProfile)) {
    addLog('Not enough credits.', 'error');
    return null;
  }

  const siteType = getCurrentSiteType();
  if (!siteType) {
    addLog('No valid page detected', 'error');
    return null;
  }

  return { tabId: currentTabId, siteType };
}

/**
 * 채우기 버튼 클릭 핸들러
 */
export async function handleFillClick(): Promise<void> {
  const prereq = validateFillPrerequisites();
  if (!prereq) return;

  const { tabId, siteType } = prereq;

  setButtonLoading(true);
  addLog('Starting AI metadata generation...');

  try {
    const accessToken = await getAccessToken();
    const message: SidepanelToContentMessage = {
      action: 'generateMetadata',
      siteType,
      accessToken: accessToken || undefined,
    };

    const response: ContentScriptResponse = await sendToContentScript(tabId, message);

    setButtonLoading(false);

    if (response && response.success) {
      setButtonSuccess();
      addLog(`Metadata generated: "${response.title}"`, 'success');
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
