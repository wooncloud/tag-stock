import type { LocalImageFile } from '../../shared/types';
import { getImageById, getSelectedImageId, updateImage } from '../state';
import { hideActionButtons, showActionButtons } from './action-buttons';
import { hideEditor, renderEditor, showEditor } from './metadata-editor';

const detailPlaceholder = document.getElementById('detailPlaceholder')!;
const detailContent = document.getElementById('detailContent')!;
const detailImage = document.getElementById('detailImage') as HTMLImageElement;
const detailFileName = document.getElementById('detailFileName')!;
const detailFileSize = document.getElementById('detailFileSize')!;
const detailDimensions = document.getElementById('detailDimensions')!;

export function renderDetail(): void {
  const selectedId = getSelectedImageId();

  if (!selectedId) {
    detailPlaceholder.classList.remove('hidden');
    detailContent.classList.add('hidden');
    hideEditor();
    hideActionButtons();
    return;
  }

  const image = getImageById(selectedId);
  if (!image) return;

  detailPlaceholder.classList.add('hidden');
  detailContent.classList.remove('hidden');
  showEditor();
  showActionButtons();

  // Load full-res base64 if not yet loaded
  if (!image.originalBase64) {
    loadFullResImage(image).then(() => {
      displayImageInfo(image);
    });
  } else {
    displayImageInfo(image);
  }

  renderEditor();
}

async function loadFullResImage(image: LocalImageFile): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      updateImage(image.id, { originalBase64: base64 });
      resolve();
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(image.file);
  });
}

function displayImageInfo(image: LocalImageFile): void {
  detailImage.src = image.thumbnailDataUrl;
  detailFileName.textContent = image.file.name;
  detailFileSize.textContent = formatFileSize(image.file.size);

  // Get actual dimensions
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

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
