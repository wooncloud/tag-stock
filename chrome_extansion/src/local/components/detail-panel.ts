import type { LocalImageFile } from '../../shared/types';
import { getImageById, setDetailImageId, updateImage } from '../state';
import { formatFileSize, readFileAsBase64 } from '../utils';
import { renderEditor } from './metadata-editor';

const detailModal = document.getElementById('detailModal')!;
const detailModalBackdrop = document.getElementById('detailModalBackdrop')!;
const detailModalClose = document.getElementById('detailModalClose')!;
const detailImage = document.getElementById('detailImage') as HTMLImageElement;
const detailFileName = document.getElementById('detailFileName')!;
const detailFileSize = document.getElementById('detailFileSize')!;
const detailDimensions = document.getElementById('detailDimensions')!;

let currentModalImageId: string | null = null;

export function initDetailModal(): void {
  detailModalClose.addEventListener('click', closeDetailModal);
  detailModalBackdrop.addEventListener('click', closeDetailModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentModalImageId) {
      closeDetailModal();
    }
  });
}

export async function openDetailModal(imageId: string): Promise<void> {
  currentModalImageId = imageId;
  const image = getImageById(imageId);
  if (!image) return;

  if (!image.originalBase64) {
    const base64 = await readFileAsBase64(image.file);
    updateImage(imageId, { originalBase64: base64 });
  }

  displayImageInfo(getImageById(imageId)!);
  renderEditor(imageId);

  detailModal.classList.remove('hidden');
  detailModalBackdrop.classList.remove('hidden');
}

export function closeDetailModal(): void {
  currentModalImageId = null;
  setDetailImageId(null);
  detailModal.classList.add('hidden');
  detailModalBackdrop.classList.add('hidden');
}

export function getCurrentModalImageId(): string | null {
  return currentModalImageId;
}

export function refreshModalIfOpen(): void {
  if (currentModalImageId) {
    const image = getImageById(currentModalImageId);
    if (image) {
      renderEditor(currentModalImageId);
    }
  }
}

function displayImageInfo(image: LocalImageFile): void {
  detailImage.src = image.thumbnailDataUrl;
  detailFileName.textContent = image.file.name;
  detailFileSize.textContent = formatFileSize(image.file.size);

  const img = new Image();
  img.onload = () => {
    detailDimensions.textContent = `${img.width} x ${img.height}`;
  };
  if (image.originalBase64) {
    img.src = `data:image/jpeg;base64,${image.originalBase64}`;
  } else {
    img.src = image.thumbnailDataUrl;
  }
}
