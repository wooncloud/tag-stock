import { detectStockSite, getSiteConfig } from '../sites/detector';

/**
 * 이미지 URL을 base64 인코딩된 문자열로 변환합니다.
 */
export async function getImageAsBase64(imageUrl: string): Promise<string> {
  try {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        resolve(base64);
      };

      img.onerror = function () {
        reject(new Error('Failed to load image.'));
      };

      img.src = imageUrl;
    });
  } catch (error) {
    console.error('Error during image conversion:', error);
    throw error;
  }
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

  console.log(`${config.name} thumbnail image found:`, thumbnail.src);
  return thumbnail;
}
