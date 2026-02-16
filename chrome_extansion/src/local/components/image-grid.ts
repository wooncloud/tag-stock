import type { ImageProcessingStatus } from '../../shared/types';
import {
  checkRange,
  getCheckedIds,
  getImages,
  getLastClickedId,
  setDetailImageId,
  toggleChecked,
} from '../state';
import { escapeHtml, formatFileSize } from '../utils';
import { updateToolbar } from './action-buttons';
import { openDetailModal } from './detail-panel';

const imageGrid = document.getElementById('imageGrid')!;

const STATUS_LABELS: Record<ImageProcessingStatus, string> = {
  pending: 'Pending',
  analyzing: 'Analyzing...',
  ready: 'Ready',
  embedding: 'Embedding...',
  completed: 'Done',
  error: 'Error',
};

export function renderGrid(): void {
  const images = getImages();
  const checkedIds = getCheckedIds();

  if (images.length === 0) {
    imageGrid.innerHTML =
      '<p class="text-muted-foreground py-12 text-center text-sm" style="grid-column:1/-1">No images yet. Click Upload to add files.</p>';
    updateToolbar();
    return;
  }

  imageGrid.innerHTML = images
    .map((img) => {
      const checked = checkedIds.has(img.id);
      return `
        <div class="image-card${checked ? ' image-card-checked' : ''}" data-id="${img.id}">
          <div class="card-checkbox-wrapper">
            <input type="checkbox" class="card-checkbox" data-check-id="${img.id}" ${checked ? 'checked' : ''} />
          </div>
          <div class="card-status-badge status-badge status-${img.status}">
            ${STATUS_LABELS[img.status]}
          </div>
          <img src="${img.thumbnailDataUrl}" alt="${escapeHtml(img.file.name)}" class="aspect-square w-full object-cover" />
          <button class="card-detail-btn" data-detail-id="${img.id}">
            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Detail
          </button>
          <div class="p-2">
            <p class="truncate text-xs font-medium">${escapeHtml(img.file.name)}</p>
            <p class="text-muted-foreground text-xs">${formatFileSize(img.file.size)}</p>
          </div>
        </div>
      `;
    })
    .join('');

  attachGridEventHandlers();
  updateToolbar();
}

function handleCheckToggle(id: string, shiftKey: boolean): void {
  if (shiftKey) {
    const lastId = getLastClickedId();
    if (lastId) {
      checkRange(lastId, id);
    } else {
      toggleChecked(id);
    }
  } else {
    toggleChecked(id);
  }
  renderGrid();
}

function attachGridEventHandlers(): void {
  imageGrid.querySelectorAll('.image-card').forEach((card) => {
    const id = card.getAttribute('data-id')!;

    card.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.card-checkbox') || target.closest('.card-detail-btn')) return;
      handleCheckToggle(id, (e as MouseEvent).shiftKey);
    });
  });

  imageGrid.querySelectorAll('.card-checkbox').forEach((checkbox) => {
    const id = (checkbox as HTMLElement).getAttribute('data-check-id')!;
    checkbox.addEventListener('click', (e) => {
      e.stopPropagation();
      handleCheckToggle(id, (e as MouseEvent).shiftKey);
    });
  });

  imageGrid.querySelectorAll('.card-detail-btn').forEach((btn) => {
    const id = (btn as HTMLElement).getAttribute('data-detail-id')!;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      setDetailImageId(id);
      openDetailModal(id);
    });
  });
}
