import { detectStockSite, getSiteConfig } from '../sites/detector';

/**
 * Convert an image URL to base64 encoded string
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
 * Get thumbnail image element based on site type
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
            // Adobe Stock: specific selector
            thumbnail = document.querySelector('img[data-t="asset-sidebar-header-thumbnail"]');
            break;
        case 'shutterstock':
            // Shutterstock: use imageElement selector
            thumbnail = document.querySelector(config.selectors.imageElement || '');
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
