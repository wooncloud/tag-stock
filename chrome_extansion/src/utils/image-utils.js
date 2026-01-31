import { detectStockSite, getSiteConfig } from './site-detector.js';

export async function getImageAsBase64(imageUrl) {
  try {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        resolve(base64);
      };

      img.onerror = function() {
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
 * 사이트별로 다른 방식으로 썸네일 이미지를 찾습니다.
 * @returns {HTMLImageElement} 썸네일 이미지 요소
 */
export function getThumbnailImage() {
  const siteType = detectStockSite();
  const config = getSiteConfig(siteType);

  if (!config) {
    throw new Error(`Unsupported site: ${siteType}`);
  }

  let thumbnail = null;

  switch (siteType) {
  case 'adobe':
    // Adobe Stock: 기존 방식
    thumbnail = document.querySelector('img[data-t="asset-sidebar-header-thumbnail"]');
    break;
  case 'shutterstock':
    // Shutterstock: imageElement 사용
    thumbnail = document.querySelector(config.selectors.imageElement);
    break;
  default:
    throw new Error(`Unknown site type: ${siteType}`);
  }

  if (!thumbnail || !thumbnail.src) {
    console.error(`${config.name} thumbnail image not found`, {
      siteType,
      selector: siteType === 'adobe' ? 'img[data-t="asset-sidebar-header-thumbnail"]' : config.selectors.imageElement,
      found: !!thumbnail,
      hasSrc: thumbnail ? !!thumbnail.src : false
    });
    throw new Error(`${config.name} thumbnail image not found.`);
  }

  console.log(`${config.name} thumbnail image found:`, thumbnail.src);
  return thumbnail;
}
