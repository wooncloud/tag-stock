import { LOCAL_PAGE } from '../../shared/constants';
import type { LocalImageFile } from '../../shared/types';
import { addImage, getImages } from '../state';
import { renderGrid } from './image-grid';

const filePicker = document.getElementById('filePicker')!;
const fileInput = document.getElementById('fileInput') as HTMLInputElement;

export function initFilePicker(): void {
  filePicker.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files) {
      handleFiles(Array.from(fileInput.files));
      fileInput.value = '';
    }
  });

  filePicker.addEventListener('dragover', (e) => {
    e.preventDefault();
    filePicker.querySelector('div')?.classList.add('drag-over');
  });

  filePicker.addEventListener('dragleave', () => {
    filePicker.querySelector('div')?.classList.remove('drag-over');
  });

  filePicker.addEventListener('drop', (e) => {
    e.preventDefault();
    filePicker.querySelector('div')?.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer?.files || []);
    handleFiles(files);
  });
}

async function handleFiles(files: File[]): Promise<void> {
  const maxSize = LOCAL_PAGE.MAX_FILE_SIZE_MB * 1024 * 1024;

  const validFiles = files.filter(
    (file) =>
      LOCAL_PAGE.SUPPORTED_FORMATS.includes(
        file.type as (typeof LOCAL_PAGE.SUPPORTED_FORMATS)[number]
      ) && file.size <= maxSize
  );

  if (validFiles.length === 0) {
    return;
  }

  for (const file of validFiles) {
    const thumbnailDataUrl = await createThumbnail(file);

    const imageFile: LocalImageFile = {
      id: crypto.randomUUID(),
      file,
      thumbnailDataUrl,
      status: 'pending',
    };

    addImage(imageFile);
  }

  renderGrid();
  updateFileCount();
}

async function createThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = LOCAL_PAGE.THUMBNAIL_SIZE;
        const scale = maxDim / Math.max(img.width, img.height);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function updateFileCount(): void {
  const count = getImages().length;
  const el = document.getElementById('fileCount');
  if (el) {
    el.textContent = `${count} file${count === 1 ? '' : 's'}`;
  }
}
