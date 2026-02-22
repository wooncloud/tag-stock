import { getSiteConfig } from '../core/sites/detector';
import { TIMEOUTS } from '../shared/constants';
import { sendLog } from '../shared/messenger';
import type { FillAllProgressMessage, SiteType } from '../shared/types';
import { fillMetadata } from './metadata-filler';

/**
 * DOM에 엘리먼트가 나타날 때까지 대기
 */
function waitForElement(selector: string, timeout = 5000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for ${selector}`));
    }, timeout);
  });
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 사이드패널에 진행 상황 전송
 */
function sendProgress(
  current: number,
  total: number,
  status: 'processing' | 'completed' | 'error',
  extra?: { title?: string; error?: string }
): void {
  try {
    const message: FillAllProgressMessage = {
      type: 'fillAllProgress',
      current,
      total,
      status,
      ...extra,
    };
    chrome.runtime.sendMessage(message);
  } catch {
    /* 사이드패널이 열려있지 않을 수 있음 */
  }
}

/**
 * 모든 이미지의 메타데이터를 순차적으로 채우기
 */
export async function fillAllMetadata(
  siteType: SiteType
): Promise<{ totalProcessed: number; totalImages: number; errors: string[] }> {
  const config = getSiteConfig(siteType);
  if (!config) throw new Error(`Unsupported site: ${siteType}`);

  const assetItemSelector = config.selectors.assetListItem;
  if (!assetItemSelector) throw new Error('Asset list item selector not configured');

  const allItems = Array.from(document.querySelectorAll(assetItemSelector));
  const total = allItems.length;

  if (total === 0) throw new Error('No images found on the page');

  sendLog(`Found ${total} images. Starting batch fill...`);
  sendProgress(0, total, 'processing');

  let processed = 0;
  const errors: string[] = [];

  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i] as HTMLElement;

    try {
      // 1. 이미지 클릭하여 선택
      item.click();
      sendLog(`Processing image ${i + 1}/${total}...`);
      sendProgress(i + 1, total, 'processing');

      // 2. 상세 패널 로드 대기
      await waitForElement(config.selectors.titleField, 5000);
      await delay(500);

      // 3. 이미 메타데이터가 있으면 스킵
      const titleField = document.querySelector<HTMLTextAreaElement>(config.selectors.titleField);
      if (titleField && titleField.value.trim().length > 0) {
        sendLog(`Image ${i + 1}/${total}: already has metadata, skipping`);
        processed++;
        continue;
      }

      // 4. 메타데이터 채우기 (기존 단일 채우기 로직 재사용)
      const result = await fillMetadata(siteType);
      sendProgress(i + 1, total, 'processing', { title: result.title });

      // 5. 저장 완료 대기
      await delay(TIMEOUTS.AUTO_SAVE_DELAY + 1000);

      processed++;
    } catch (error) {
      const errMsg = `Image ${i + 1}: ${(error as Error).message}`;
      errors.push(errMsg);
      sendLog(`Error on image ${i + 1}/${total}: ${(error as Error).message}`, 'error');

      // 크레딧 부족 시 배치 중단
      if (
        (error as Error).message.toLowerCase().includes('insufficient') ||
        (error as Error).message.toLowerCase().includes('credit')
      ) {
        sendProgress(i + 1, total, 'error', { error: 'Insufficient credits' });
        break;
      }
    }
  }

  sendProgress(total, total, 'completed');
  return { totalProcessed: processed, totalImages: total, errors };
}
