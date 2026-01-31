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
        reject(new Error('이미지를 로드할 수 없습니다.'));
      };
      
      img.src = imageUrl;
    });
  } catch (error) {
    console.error('이미지 변환 중 오류:', error);
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
    throw new Error(`지원되지 않는 사이트: ${siteType}`);
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
    throw new Error(`알 수 없는 사이트 타입: ${siteType}`);
  }
  
  if (!thumbnail || !thumbnail.src) {
    console.error(`${config.name} 썸네일 이미지를 찾을 수 없습니다`, {
      siteType,
      selector: siteType === 'adobe' ? 'img[data-t="asset-sidebar-header-thumbnail"]' : config.selectors.imageElement,
      found: !!thumbnail,
      hasSrc: thumbnail ? !!thumbnail.src : false
    });
    throw new Error(`${config.name} 썸네일 이미지를 찾을 수 없습니다.`);
  }
  
  console.log(`${config.name} 썸네일 이미지 찾음:`, thumbnail.src);
  return thumbnail;
} 