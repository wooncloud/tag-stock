import { TIMEOUTS } from '../../shared/constants';

const fillAllBtn = document.getElementById('fillAllBtn') as HTMLButtonElement;
const fillAllBtnIcon = document.getElementById('fillAllBtnIcon') as HTMLElement;
const fillAllBtnText = document.getElementById('fillAllBtnText') as HTMLSpanElement;
const fillAllBtnSpinner = document.getElementById('fillAllBtnSpinner') as HTMLElement;
const fillAllProgress = document.getElementById('fillAllProgress') as HTMLElement;
const fillAllProgressText = document.getElementById('fillAllProgressText') as HTMLElement;
const fillAllProgressBar = document.getElementById('fillAllProgressBar') as HTMLElement;

/**
 * Fill All 버튼을 로딩 상태로 설정
 */
export function setFillAllLoading(loading: boolean): void {
  const fillBtn = document.getElementById('fillBtn') as HTMLButtonElement;

  if (loading) {
    fillAllBtnIcon.classList.add('hidden');
    fillAllBtnSpinner.classList.remove('hidden');
    fillAllBtnText.textContent = 'Processing...';
    fillAllBtn.disabled = true;
    fillAllProgress.classList.remove('hidden');

    // 기존 Fill Metadata 버튼도 비활성화
    if (fillBtn) fillBtn.disabled = true;
  } else {
    fillAllBtnIcon.classList.remove('hidden');
    fillAllBtnSpinner.classList.add('hidden');
    fillAllBtnText.textContent = 'Fill All Metadata';
    fillAllBtn.disabled = false;
    fillAllProgress.classList.add('hidden');

    if (fillBtn) fillBtn.disabled = false;
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

/**
 * Fill All 버튼을 성공 상태로 설정
 */
export function setFillAllSuccess(): void {
  fillAllBtnIcon.classList.remove('hidden');
  fillAllBtnSpinner.classList.add('hidden');
  fillAllBtnText.textContent = 'Done!';
  fillAllBtn.className = fillAllBtn.className.replace(
    'border-primary text-primary',
    'border-green-600 text-green-600'
  );

  setTimeout(() => {
    fillAllBtnText.textContent = 'Fill All Metadata';
    fillAllBtn.className = fillAllBtn.className.replace(
      'border-green-600 text-green-600',
      'border-primary text-primary'
    );
  }, TIMEOUTS.BUTTON_FEEDBACK);
}

/**
 * Fill All 버튼을 에러 상태로 설정
 */
export function setFillAllError(): void {
  fillAllBtnIcon.classList.remove('hidden');
  fillAllBtnSpinner.classList.add('hidden');
  fillAllBtnText.textContent = 'Error';
  fillAllBtn.className = fillAllBtn.className.replace(
    'border-primary text-primary',
    'border-red-600 text-red-600'
  );
  fillAllBtn.disabled = false;

  setTimeout(() => {
    fillAllBtnText.textContent = 'Fill All Metadata';
    fillAllBtn.className = fillAllBtn.className.replace(
      'border-red-600 text-red-600',
      'border-primary text-primary'
    );
  }, TIMEOUTS.BUTTON_FEEDBACK);
}
