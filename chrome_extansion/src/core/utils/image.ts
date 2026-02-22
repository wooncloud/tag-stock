import { sendToBackground } from '../../shared/messenger';
import { detectStockSite, getSiteConfig } from '../sites/detector';

const RESIZE_MAX_DIMENSION = 1536;
const RESIZE_JPEG_QUALITY = 0.8;

/**
 * Base64 이미지를 AI 분석용으로 리사이즈합니다.
 * Canvas API를 사용하여 긴 변 기준으로 축소하고 JPEG로 변환합니다.
 * @param base64Data - 순수 Base64 데이터 (data: prefix 없음)
 * @returns 리사이즈된 Base64 데이터
 */
export async function resizeImageForAI(base64Data: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const { width, height } = img;

        // 이미 충분히 작으면 그대로 반환
        if (width <= RESIZE_MAX_DIMENSION && height <= RESIZE_MAX_DIMENSION) {
          resolve(base64Data);
          return;
        }

        // 비율 유지하며 리사이즈
        const scale = RESIZE_MAX_DIMENSION / Math.max(width, height);
        const newWidth = Math.round(width * scale);
        const newHeight = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64Data);
          return;
        }

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // JPEG로 변환하여 Base64 추출 (data:image/jpeg;base64, prefix 제거)
        const dataUrl = canvas.toDataURL('image/jpeg', RESIZE_JPEG_QUALITY);
        const resizedBase64 = dataUrl.split(',')[1];

        console.log(
          `[TagStock] Image resized: ${width}x${height} → ${newWidth}x${newHeight}, ` +
            `size: ${base64Data.length} → ${resizedBase64.length}`
        );

        resolve(resizedBase64);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for resize'));
    img.src = `data:image/jpeg;base64,${base64Data}`;
  });
}

/**
 * 이미지 URL을 base64 인코딩된 문자열로 변환합니다.
 */
export async function getImageAsBase64(imageUrl: string): Promise<string> {
  console.log('[TagStock] Loading image via background:', imageUrl);
  return sendToBackground<string>({ action: 'fetchImage', url: imageUrl });
}

/**
 * 사이트 유형에 따른 썸네일 이미지 엘리먼트를 가져옵니다.
 */
export function getThumbnailImage(): HTMLImageElement {
  const siteType = detectStockSite();
  const config = getSiteConfig(siteType);

  if (!config) {
    throw new Error(`Unsupported site: ${siteType}`);
  }

  let thumbnail: HTMLImageElement | null = null;

  switch (siteType) {
    case 'adobe':
      // Adobe Stock: 특정 셀렉터 사용
      thumbnail = document.querySelector('img[data-t="asset-sidebar-header-thumbnail"]');
      break;
    case 'shutterstock':
      // Shutterstock: imageElement 셀렉터 사용
      thumbnail = document.querySelector(config.selectors.imageElement || '');
      break;
    default:
      throw new Error(`Unknown site type: ${siteType}`);
  }

  if (!thumbnail || !thumbnail.src) {
    console.error(`${config.name} thumbnail image not found`, {
      siteType,
      selector:
        siteType === 'adobe'
          ? 'img[data-t="asset-sidebar-header-thumbnail"]'
          : config.selectors.imageElement,
      found: !!thumbnail,
      hasSrc: thumbnail ? !!thumbnail.src : false,
    });
    throw new Error(`${config.name} thumbnail image not found.`);
  }

  console.log(`[TagStock] Thumbnail found:`, {
    src: thumbnail.src,
    currentSrc: thumbnail.currentSrc,
    naturalWidth: thumbnail.naturalWidth,
    naturalHeight: thumbnail.naturalHeight,
  });
  return thumbnail;
}
