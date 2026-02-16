import type { ImageProcessingStatus } from '../../shared/types';
import { getImages, getSelectedImageId, setSelectedImageId } from '../state';
import { escapeHtml } from '../utils';
import { renderDetail } from './detail-panel';

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
  const selectedId = getSelectedImageId();

  if (images.length === 0) {
    imageGrid.innerHTML =
      '<p class="text-muted-foreground col-span-2 py-8 text-center text-sm">No images yet</p>';
    return;
  }

  imageGrid.innerHTML = images
    .map((img) => {
      const isSelected = img.id === selectedId;
      return `
        <div class="image-card${isSelected ? ' image-card-selected' : ''}" data-id="${img.id}">
          <img src="${img.thumbnailDataUrl}" alt="${escapeHtml(img.file.name)}" class="aspect-square w-full object-cover" />
          <div class="status-badge status-${img.status}">
            ${STATUS_LABELS[img.status]}
          </div>
          <div class="p-2">
            <p class="truncate text-xs font-medium">${escapeHtml(img.file.name)}</p>
            <p class="text-muted-foreground text-xs">${formatFileSize(img.file.size)}</p>
          </div>
        </div>
      `;
    })
    .join('');

  imageGrid.querySelectorAll('.image-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id')!;
      setSelectedImageId(id);
      renderGrid();
      renderDetail();
    });
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
