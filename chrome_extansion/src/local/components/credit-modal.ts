import { LINKS } from '../../shared/constants';

const creditModal = document.getElementById('creditModal')!;
const creditModalBackdrop = document.getElementById('creditModalBackdrop')!;
const creditModalClose = document.getElementById('creditModalClose')!;
const creditModalLink = document.getElementById('creditModalLink') as HTMLAnchorElement;
const creditModalProgress = document.getElementById('creditModalProgress')!;
const creditModalTitle = document.getElementById('creditModalTitle')!;
const creditModalDesc = document.getElementById('creditModalDesc')!;

export function initCreditModal(): void {
  creditModalLink.href = LINKS.PRICING;

  creditModalClose.addEventListener('click', closeCreditModal);
  creditModalBackdrop.addEventListener('click', closeCreditModal);
}

interface ShowModalOptions {
  title?: string;
  description?: string;
  progress?: string;
}

export function showCreditModal(options: ShowModalOptions = {}): void {
  creditModalTitle.textContent = options.title || 'Credits Exhausted';
  creditModalDesc.textContent =
    options.description ||
    'All credits have been used. Purchase more credits or upgrade your plan to continue analyzing images.';

  if (options.progress) {
    creditModalProgress.textContent = options.progress;
    creditModalProgress.classList.remove('hidden');
  } else {
    creditModalProgress.classList.add('hidden');
  }

  creditModal.classList.remove('hidden');
  creditModalBackdrop.classList.remove('hidden');
}

export function showUpgradeModal(feature: string): void {
  showCreditModal({
    title: 'Pro Feature',
    description: `${feature} is available on Pro and Max plans. Upgrade to unlock this feature.`,
  });
}

function closeCreditModal(): void {
  creditModal.classList.add('hidden');
  creditModalBackdrop.classList.add('hidden');
}
