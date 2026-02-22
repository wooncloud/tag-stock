import { createButtonState } from './fill-button';

const fillAllProgress = document.getElementById('fillAllProgress') as HTMLElement;
const fillAllProgressText = document.getElementById('fillAllProgressText') as HTMLElement;
const fillAllProgressBar = document.getElementById('fillAllProgressBar') as HTMLElement;

const fillAllState = createButtonState(
  {
    button: document.getElementById('fillAllBtn') as HTMLButtonElement,
    icon: document.getElementById('fillAllBtnIcon') as HTMLElement,
    spinner: document.getElementById('fillAllBtnSpinner') as HTMLElement,
    text: document.getElementById('fillAllBtnText') as HTMLSpanElement,
  },
  'Fill All Metadata',
  'border-primary text-primary',
  'border-green-600 text-green-600',
  'border-red-600 text-red-600'
);

/**
 * Fill All 버튼을 로딩 상태로 설정 (Fill Metadata 버튼도 비활성화)
 */
export function setFillAllLoading(loading: boolean): void {
  fillAllState.setLoading(loading);

  const fillBtn = document.getElementById('fillBtn') as HTMLButtonElement;
  if (fillBtn) fillBtn.disabled = loading;

  if (loading) {
    fillAllProgress.classList.remove('hidden');
  } else {
    fillAllProgress.classList.add('hidden');
  }
}

/**
 * 프로그레스 바 업데이트
 */
export function updateFillAllProgress(current: number, total: number): void {
  fillAllProgressText.textContent = `Processing ${current}/${total}...`;
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  fillAllProgressBar.style.width = `${pct}%`;
}

export const setFillAllSuccess = fillAllState.setSuccess;
export const setFillAllError = fillAllState.setError;
