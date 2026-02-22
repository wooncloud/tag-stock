import { getSiteConfig } from '../core/sites/detector';
import { delay, waitForElement } from '../core/utils/dom';
import { TIMEOUTS } from '../shared/constants';
import { isInsufficientCreditsError } from '../shared/errors';
import { sendLog, sendProgress } from '../shared/messenger';
import type { SiteType } from '../shared/types';
import { fillMetadata } from './metadata-filler';
import { hideOverlay, onCancelClick, showOverlay, updateOverlay } from './overlay-blocker';

/**
 * 모든 이미지의 메타데이터를 순차적으로 채우기
 */
export async function fillAllMetadata(
  siteType: SiteType,
  accessToken?: string
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

  // 오버레이 표시 및 취소 플래그 설정
  showOverlay(total);
  let cancelled = false;
  onCancelClick(() => {
    cancelled = true;
  });

  let processed = 0;
  const errors: string[] = [];

  try {
    for (let i = 0; i < allItems.length; i++) {
      if (cancelled) {
        sendLog('Batch processing cancelled by user.');
        break;
      }

      const item = allItems[i] as HTMLElement;

      try {
        // 1. 이미지 클릭하여 선택
        item.click();
        sendLog(`Processing image ${i + 1}/${total}...`);
        sendProgress(i + 1, total, 'processing');
        updateOverlay(i + 1, total);

        // 2. 상세 패널 로드 대기
        await waitForElement(config.selectors.titleField, 5000);
        await delay(500);

        // 3. 이미 메타데이터가 있으면 스킵
        const titleField = document.querySelector<HTMLTextAreaElement>(config.selectors.titleField);
        if (titleField && titleField.value.trim().length > 0) {
          sendLog(`Image ${i + 1}/${total}: already has metadata, skipping`);
          updateOverlay(i + 1, total, titleField.value.trim());
          processed++;
          continue;
        }

        // 4. 메타데이터 채우기 (기존 단일 채우기 로직 재사용)
        const result = await fillMetadata(siteType, accessToken);
        sendProgress(i + 1, total, 'processing', { title: result.title });
        updateOverlay(i + 1, total, result.title);

        // 5. 저장 완료 대기
        await delay(TIMEOUTS.AUTO_SAVE_DELAY + 1000);

        processed++;
      } catch (error) {
        const errMsg = `Image ${i + 1}: ${(error as Error).message}`;
        errors.push(errMsg);
        sendLog(`Error on image ${i + 1}/${total}: ${(error as Error).message}`, 'error');

        // 크레딧 부족 시 배치 중단
        if (isInsufficientCreditsError(error)) {
          sendProgress(i + 1, total, 'error', { error: 'Insufficient credits' });
          break;
        }
      }
    }
  } finally {
    hideOverlay();
  }

  sendProgress(total, total, 'completed');
  return { totalProcessed: processed, totalImages: total, errors };
}
