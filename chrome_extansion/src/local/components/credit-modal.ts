import { LINKS } from '../../shared/constants';

const creditModal = document.getElementById('creditModal')!;
const creditModalBackdrop = document.getElementById('creditModalBackdrop')!;
const creditModalClose = document.getElementById('creditModalClose')!;
const creditModalLink = document.getElementById('creditModalLink') as HTMLAnchorElement;
const creditModalProgress = document.getElementById('creditModalProgress')!;

export function initCreditModal(): void {
  creditModalLink.href = LINKS.PRICING;

  creditModalClose.addEventListener('click', closeCreditModal);
  creditModalBackdrop.addEventListener('click', closeCreditModal);
}

export function showCreditModal(batchProgress?: string): void {
  if (batchProgress) {
    creditModalProgress.textContent = batchProgress;
    creditModalProgress.classList.remove('hidden');
  } else {
    creditModalProgress.classList.add('hidden');
  }

  creditModal.classList.remove('hidden');
  creditModalBackdrop.classList.remove('hidden');
}

function closeCreditModal(): void {
  creditModal.classList.add('hidden');
  creditModalBackdrop.classList.add('hidden');
}
