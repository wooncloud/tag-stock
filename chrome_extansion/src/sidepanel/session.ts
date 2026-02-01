import type { UserProfile } from '../shared/types';
import { addLog } from './components/activity-log';
import { checkAuth, hideAuthScreen } from './components/auth-screen';
import {
  hideLowCreditWarning,
  initCreditDisplay,
  showLowCreditWarning,
} from './components/credit-display';
import { setCurrentProfile } from './state';

// DOM 요소 참조
const userEmailEl = document.getElementById('userEmail') as HTMLDivElement | null;
const userPlanEl = document.getElementById('userPlan') as HTMLDivElement | null;

/**
 * 사용자 프로필 새로고침 및 UI 업데이트
 */
export async function refreshProfile(): Promise<void> {
  const profile = await checkAuth();

  if (profile) {
    setCurrentProfile(profile);
    initCreditDisplay(profile);

    const totalCredits = profile.credits_subscription + profile.credits_purchased;
    if (totalCredits <= 5) {
      showLowCreditWarning(totalCredits);
    } else {
      hideLowCreditWarning();
    }
  }
}

/**
 * 사용자 세션 초기화
 */
export async function initializeUserSession(profile: UserProfile): Promise<void> {
  setCurrentProfile(profile);

  // UI 업데이트
  if (userEmailEl) {
    userEmailEl.textContent = profile.email;
  }

  if (userPlanEl) {
    const planName = profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1);
    userPlanEl.textContent = `${planName} Plan`;
  }

  // 크레딧 표시 초기화
  initCreditDisplay(profile);

  // 부족한 크레딧 확인
  const totalCredits = profile.credits_subscription + profile.credits_purchased;
  if (totalCredits <= 5) {
    showLowCreditWarning(totalCredits);
  }

  // 앱 표시
  hideAuthScreen();
  addLog('Signed in successfully');
}
