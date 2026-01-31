import { getTotalCredits } from '../../lib/supabase/auth';
import type { UserProfile } from '../../shared/types';

/**
 * 크레딧 표시를 초기화하고 렌더링합니다.
 */
export function initCreditDisplay(profile: UserProfile): void {
  const totalCredits = getTotalCredits(profile);

  // 총 크레딧 표시 업데이트
  const creditDisplay = document.getElementById('creditDisplay');
  if (creditDisplay) {
    creditDisplay.textContent = totalCredits.toString();
  }
}

/**
 * 새로운 값으로 크레딧 표시를 업데이트합니다.
 */
export function updateCreditDisplay(profile: UserProfile): void {
  initCreditDisplay(profile);
}

/**
 * 부족한 크레딧 경고를 표시합니다.
 */
export function showLowCreditWarning(credits: number): void {
  if (credits <= 5 && credits > 0) {
    const warning = document.getElementById('lowCreditWarning');
    if (warning) {
      warning.classList.remove('hidden');
      warning.textContent = `⚠️ Only ${credits} credits remaining`;
    }
  }
}

/**
 * 부족한 크레딧 경고를 숨깁니다.
 */
export function hideLowCreditWarning(): void {
  const warning = document.getElementById('lowCreditWarning');
  if (warning) {
    warning.classList.add('hidden');
  }
}
