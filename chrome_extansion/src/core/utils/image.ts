import { detectStockSite, getSiteConfig } from '../sites/detector';

/**
 * 이미지 URL을 base64 인코딩된 문자열로 변환합니다.
 */
export async function getImageAsBase64(imageUrl: string): Promise<string> {
  console.log('[TagStock] Loading image via background:', imageUrl);

  // Background script를 통해 이미지 fetch (CORS 우회)
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'fetchImage', url: imageUrl }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[TagStock] Background fetch error:', chrome.runtime.lastError);
        reject(new Error(chrome.runtime.lastError.message || 'Background fetch failed'));
        return;
      }

      if (response?.success && response.base64) {
        console.log('[TagStock] Image fetched via background, length:', response.base64.length);
        resolve(response.base64);
      } else {
        console.error('[TagStock] Background fetch failed:', response?.error);
        reject(new Error(response?.error || 'Failed to fetch image'));
      }
    });
  });
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
