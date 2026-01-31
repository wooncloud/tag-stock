import { generateMetadata } from './ai-service.js';
import { getImageAsBase64, getThumbnailImage } from '../utils/image-utils.js';
import { detectStockSite, getSiteConfig } from '../utils/site-detector.js';
import { ADOBE_STOCK_PROMPT } from '../prompts/adobe-stock-prompt.js';
import { SHUTTERSTOCK_PROMPT } from '../prompts/shutterstock-prompt.js';

/**
 * 사이트별 적절한 프롬프트를 반환합니다.
 * @param {string} siteType - 'adobe' 또는 'shutterstock'
 * @returns {string} 해당 사이트용 시스템 프롬프트
 */
function getPromptForSite(siteType) {
  switch (siteType) {
  case 'adobe':
    return ADOBE_STOCK_PROMPT;
  case 'shutterstock':
    return SHUTTERSTOCK_PROMPT;
  default:
    console.warn(`알 수 없는 사이트 타입: ${siteType}, 프롬프트를 기본값으로 사용합니다.`);
    return ADOBE_STOCK_PROMPT;
  }
}

/**
 * 현재 사이트에 맞는 AI 메타데이터를 생성합니다.
 * @returns {Promise<object>} 생성된 메타데이터 (title, keywords)
 */
export async function generateAIMetadata() {
  try {
    // 현재 사이트 감지
    const siteType = detectStockSite();
    const siteConfig = getSiteConfig(siteType);
    
    console.debug(`감지된 사이트: ${siteType} (${siteConfig?.name || 'Unknown'})`);
    
    // 해당 사이트용 프롬프트 선택
    const systemPrompt = getPromptForSite(siteType);
    
    console.debug('썸네일 이미지 검색 중...');
    const thumbnail = getThumbnailImage();
    
    console.debug('이미지 변환 중...', thumbnail.src);
    const imageBase64 = await getImageAsBase64(thumbnail.src);
    
    console.debug(`${siteConfig?.name || siteType} AI 메타데이터 생성 중...`);
    const result = await generateMetadata(systemPrompt, imageBase64);
    
    console.debug('생성된 메타데이터:', result);
    
    // 사이트별 후처리 (필요한 경우)
    return postProcessMetadata(result, siteType, siteConfig);
    
  } catch (error) {
    console.error('AI 메타데이터 생성 실패:', error);
    throw error;
  }
}

/**
 * 사이트별 메타데이터 후처리를 수행합니다.
 * @param {object} metadata - 생성된 메타데이터
 * @param {string} siteType - 사이트 타입
 * @param {object} siteConfig - 사이트 설정
 * @returns {object} 후처리된 메타데이터
 */
function postProcessMetadata(metadata, siteType, siteConfig) {
  // 제목 길이 제한 확인
  if (metadata.title && metadata.title.length > siteConfig.maxTitleLength) {
    console.warn(`제목이 ${siteConfig.maxTitleLength}자를 초과합니다. 자동으로 잘립니다.`);
    metadata.title = metadata.title.substring(0, siteConfig.maxTitleLength);
  }
  
  // 사이트별 특별 처리
  switch (siteType) {
    case 'shutterstock':
      // Shutterstock은 영어만 지원하므로 한글 키워드 제거
      if (metadata.keywords) {
        metadata.keywords = filterEnglishKeywords(metadata.keywords);
      }
      break;
    case 'adobe':
      // Adobe Stock은 특별한 후처리가 필요하지 않음
      break;
  }
  
  return metadata;
}

/**
 * 키워드에서 영어 키워드만 필터링합니다.
 * @param {string} keywords - 원본 키워드 문자열
 * @returns {string} 영어 키워드만 포함된 문자열
 */
function filterEnglishKeywords(keywords) {
  return keywords
    .split(',')
    .map(keyword => keyword.trim())
    .filter(keyword => /^[a-zA-Z\s\-']+$/.test(keyword))
    .join(', ');
} 