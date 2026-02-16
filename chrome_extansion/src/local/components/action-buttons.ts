const actionButtons = document.getElementById('actionButtons')!;
const analyzeBtn = document.getElementById('analyzeBtn') as HTMLButtonElement;
const analyzeBtnText = document.getElementById('analyzeBtnText')!;
const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
const downloadBtnText = document.getElementById('downloadBtnText')!;

export function showActionButtons(): void {
  actionButtons.classList.remove('hidden');
}

export function hideActionButtons(): void {
  actionButtons.classList.add('hidden');
}

export function setAnalyzeLoading(loading: boolean): void {
  analyzeBtn.disabled = loading;
  analyzeBtnText.textContent = loading ? 'Analyzing...' : 'AI Analyze';
}

export function setDownloadLoading(loading: boolean): void {
  downloadBtn.disabled = loading;
  downloadBtnText.textContent = loading ? 'Embedding...' : 'Embed & Download';
}

export function getAnalyzeBtn(): HTMLButtonElement {
  return analyzeBtn;
}

export function getDownloadBtn(): HTMLButtonElement {
  return downloadBtn;
}
