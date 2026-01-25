import imageCompression from 'browser-image-compression';

import type { UserPlan } from '@/types/database';

import { PLAN_LIMITS, type StorageType } from '@/lib/plan-limits';

interface ProcessImageOptions {
  userPlan?: UserPlan;
}

export async function processAndCompressImage(
  file: File,
  options: ProcessImageOptions = {}
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const { userPlan = 'free' } = options;
  const planLimit = PLAN_LIMITS[userPlan];

  // Pro 플랜은 압축하지 않음
  if (!planLimit.compressionEnabled) {
    return file;
  }

  const compressionOptions = {
    maxSizeMB: planLimit.compressionOptions?.maxSizeMB ?? 0.9,
    maxWidthOrHeight: planLimit.compressionOptions?.maxWidthOrHeight ?? 2048,
    useWebWorker: true,
    initialQuality: planLimit.compressionOptions?.quality ?? 0.7,
    preserveExif: true,
  };

  try {
    // 원본에서 EXIF 추출 (JPG인 경우)
    let exifData: string | null = null;
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      try {
        const piexif = (await import('piexifjs')).default;
        const reader = new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(file);
        });
        const dataUrl = await reader;
        exifData = piexif.load(dataUrl);
      } catch (e) {
        console.warn('Failed to extract EXIF:', e);
      }
    }

    const compressedBlob = await imageCompression(file, compressionOptions);
    let finalFile = new File([compressedBlob], file.name, { type: compressedBlob.type });

    // EXIF 다시 주입 (JPG인 경우)
    if (exifData && (finalFile.type === 'image/jpeg' || finalFile.type === 'image/jpg')) {
      try {
        const piexif = (await import('piexifjs')).default;
        const reader = new Promise<string>((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result as string);
          r.readAsDataURL(finalFile);
        });
        const dataUrl = await reader;
        const inserted = piexif.insert(exifData, dataUrl);

        // Base64 to Blob
        const byteString = atob(inserted.split(',')[1]);
        const mimeString = inserted.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let j = 0; j < byteString.length; j++) {
          ia[j] = byteString.charCodeAt(j);
        }
        finalFile = new File([ab], file.name, { type: mimeString });
      } catch (e) {
        console.warn('Failed to reinject EXIF:', e);
      }
    }

    return finalFile;
  } catch (error) {
    console.error('Compression error:', error);
    return file;
  }
}
