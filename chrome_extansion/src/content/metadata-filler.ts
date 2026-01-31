import { generateAIMetadata } from '../core/ai/metadata-generator';
import { getSiteConfig } from '../core/sites/detector';
import { handleShutterstockKeywordInput } from '../core/sites/handlers/shutterstock';
import { setInputValue, setTextareaValue } from '../core/utils/dom';
import { sendLog } from '../core/utils/logger';
import { TIMEOUTS } from '../shared/constants';
import type { AIMetadataResult, ProcessedMetadata, SiteType } from '../shared/types';

/**
 * 사이트별 포맷에 맞게 AI 메타데이터 결과 처리
 */
function processMetadataForSite(aiResult: AIMetadataResult, siteType: SiteType): ProcessedMetadata {
  const config = getSiteConfig(siteType);

  if (!config) {
    throw new Error(`Unsupported site: ${siteType}`);
  }

  let keywords = '';

  if (Array.isArray(aiResult.keyword)) {
    keywords = aiResult.keyword.join(config.keywordSeparator);
  } else if (typeof aiResult.keyword === 'string') {
    keywords = aiResult.keyword;
  } else if (typeof aiResult.keywords === 'string') {
    keywords = aiResult.keywords;
  }

  return {
    title: aiResult.title || '',
    keywords: keywords,
  };
}

/**
 * 메타데이터를 폼 필드에 채우기
 */
export async function fillMetadata(siteType: SiteType): Promise<ProcessedMetadata> {
  const config = getSiteConfig(siteType);

  if (!config) {
    throw new Error(`Unsupported site: ${siteType}`);
  }

  const titleElement = document.querySelector<HTMLTextAreaElement>(config.selectors.titleField);
  const keywordElement = document.querySelector<HTMLTextAreaElement | HTMLInputElement>(
    config.selectors.keywordField
  );
  const saveButton = document.querySelector<HTMLButtonElement>(config.selectors.saveButton);

  if (!titleElement || !keywordElement) {
    throw new Error(`Form fields not found for ${config.name}`);
  }

  sendLog(`${config.name} AI metadata generation started...`);

  const aiResult = await generateAIMetadata();
  const processedResult = processMetadataForSite(aiResult, siteType);

  setTextareaValue(titleElement, processedResult.title);

  // 키워드 필드의 다양한 엘리먼트 타입 처리
  if (keywordElement instanceof HTMLTextAreaElement) {
    setTextareaValue(keywordElement, processedResult.keywords);
  } else if (keywordElement instanceof HTMLInputElement) {
    setInputValue(keywordElement, processedResult.keywords);
  }

  // 셔터스톡: 엔터 키로 키워드 입력 처리
  if (siteType === 'shutterstock' && keywordElement.tagName === 'INPUT') {
    await handleShutterstockKeywordInput(keywordElement as HTMLInputElement);
  }

  // 자동 저장
  if (saveButton) {
    setTimeout(() => {
      saveButton.click();
      sendLog('Changes saved', 'success');
    }, TIMEOUTS.AUTO_SAVE_DELAY);
  }

  return processedResult;
}
