import { checkAll, getCheckedIds, getImages, uncheckAll } from '../state';
import { renderGrid } from './image-grid';

const selectAllCheckbox = document.getElementById('selectAllCheckbox') as HTMLInputElement;
const selectionCount = document.getElementById('selectionCount')!;
const batchAnalyzeBtn = document.getElementById('batchAnalyzeBtn') as HTMLButtonElement;
const batchAnalyzeBtnText = document.getElementById('batchAnalyzeBtnText')!;
const batchDownloadBtn = document.getElementById('batchDownloadBtn') as HTMLButtonElement;
const batchDownloadBtnText = document.getElementById('batchDownloadBtnText')!;

export function initActionButtons(): void {
  selectAllCheckbox.addEventListener('change', () => {
    if (selectAllCheckbox.checked) {
      checkAll();
    } else {
      uncheckAll();
    }
    renderGrid();
  });
}

export function updateToolbar(): void {
  const images = getImages();
  const checkedIds = getCheckedIds();
  const count = checkedIds.size;
  const total = images.length;

  // Selection count
  selectionCount.textContent = count > 0 ? `${count} selected` : `0 selected`;

  // Select all checkbox state
  if (total === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else if (count === total) {
    selectAllCheckbox.checked = true;
    selectAllCheckbox.indeterminate = false;
  } else if (count > 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = true;
  } else {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  }

  // Enable/disable batch buttons
  batchAnalyzeBtn.disabled = count === 0;
  batchDownloadBtn.disabled = count === 0;
}

export function setBatchAnalyzeLoading(loading: boolean, progress?: string): void {
  batchAnalyzeBtn.disabled = loading;
  batchAnalyzeBtnText.textContent = loading ? progress || 'Analyzing...' : 'AI Analyze';
  if (loading) {
    batchDownloadBtn.disabled = true;
  }
}

export function setBatchDownloadLoading(loading: boolean, progress?: string): void {
  batchDownloadBtn.disabled = loading;
  batchDownloadBtnText.textContent = loading ? progress || 'Downloading...' : 'Download';
  if (loading) {
    batchAnalyzeBtn.disabled = true;
  }
}

export function getBatchAnalyzeBtn(): HTMLButtonElement {
  return batchAnalyzeBtn;
}

export function getBatchDownloadBtn(): HTMLButtonElement {
  return batchDownloadBtn;
}

// Modal individual buttons
export function getModalAnalyzeBtn(): HTMLButtonElement {
  return document.getElementById('modalAnalyzeBtn') as HTMLButtonElement;
}

export function getModalDownloadBtn(): HTMLButtonElement {
  return document.getElementById('modalDownloadBtn') as HTMLButtonElement;
}
