import type { AIMetadataResult, SiteConfig, SiteType } from '../../shared/types';
import { detectStockSite, getSiteConfig } from '../sites/detector';
import { getImageAsBase64, getThumbnailImage, resizeImageForAI } from '../utils/image';
import { generateMetadata } from './gemini-client';

/**
 * 키워드 문자열에서 영문 키워드만 필터링합니다.
 */
function filterEnglishKeywords(keywords: string): string {
  return keywords
    .split(',')
    .map((keyword) => keyword.trim())
    .filter((keyword) => /^[a-zA-Z\s\-']+$/.test(keyword))
    .join(', ');
}

/**
 * 사이트별 요구 사항에 따라 메타데이터 후처리를 수행합니다.
 */
function postProcessMetadata(
  metadata: AIMetadataResult,
  siteType: SiteType,
  siteConfig: SiteConfig
): AIMetadataResult {
  // 제목 길이 제한 확인
  if (metadata.title && metadata.title.length > siteConfig.maxTitleLength) {
    console.warn(
      `Title exceeds ${siteConfig.maxTitleLength} characters. Truncating automatically.`
    );
    metadata.title = metadata.title.substring(0, siteConfig.maxTitleLength);
  }

  // 사이트별 처리
  switch (siteType) {
    case 'shutterstock':
      // 셔터스톡은 영어만 지원하므로 한글 키워드 제거
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
 * 현재 사이트에 대한 AI 메타데이터를 생성합니다.
 * 서버 프록시(/api/generate)를 통해 Gemini AI를 호출합니다.
 */
export async function generateAIMetadata(accessToken?: string): Promise<AIMetadataResult> {
  try {
    // 현재 사이트 감지
    const siteType = detectStockSite();
    const siteConfig = getSiteConfig(siteType);

    if (!siteConfig) {
      throw new Error(`Unsupported site: ${siteType}`);
    }

    console.debug(`Detected site: ${siteType} (${siteConfig.name})`);

    console.debug('Searching for thumbnail image...');
    const thumbnail = getThumbnailImage();

    console.debug('Converting image...', thumbnail.src);
    const rawBase64 = await getImageAsBase64(thumbnail.src);

    console.debug('Resizing image for AI analysis...');
    const imageBase64 = await resizeImageForAI(rawBase64);

    console.debug(`${siteConfig.name} AI metadata generation in progress...`);
    const result = await generateMetadata(siteType, imageBase64, accessToken);

    console.debug('Generated metadata:', result);

    // 필요한 경우 메타데이터 후처리
    return postProcessMetadata(result, siteType, siteConfig);
  } catch (error) {
    console.error('AI metadata generation failed:', error);
    throw error;
  }
}
