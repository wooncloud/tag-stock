import { GoogleGenerativeAI } from '@google/generative-ai';

import { AIGeneratedMetadata } from '@/types/database';

import { type PlanTier, type SiteType, getPromptForSite } from './prompts';
import { STOCK_METADATA_PROMPT } from './prompts/stock-metadata';

// Gemini AI 초기화
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('GOOGLE_GEMINI_API_KEY is not set');
}
const genAI = new GoogleGenerativeAI(apiKey || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-flash-latest',
});

export interface SiteMetadataResult {
  title: string;
  keyword: string[];
}

/**
 * 스톡 사진을 위한 최적화된 메타데이터를 생성합니다.
 * Adobe Stock 및 Shutterstock 표준에 최적화되어 있습니다.
 */
export async function generateImageMetadata(
  imageBuffer: Buffer,
  mimeType: string
): Promise<AIGeneratedMetadata> {
  try {
    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([STOCK_METADATA_PROMPT, imagePart]);
    const response = await result.response;
    const text = response.text();

    // 응답에서 JSON을 추출합니다.
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const metadata = JSON.parse(jsonMatch[0]) as AIGeneratedMetadata;

    // 검증 및 정리 작업을 수행합니다.
    if (!metadata.title || !metadata.description || !metadata.keywords || !metadata.category) {
      throw new Error('Incomplete metadata generated');
    }

    // 키워드가 고유하고 제한된 개수 내에 있는지 확인합니다.
    metadata.keywords = [...new Set(metadata.keywords)].slice(0, 50);

    // 태그가 고유하고 제한된 개수 내에 있는지 확인합니다.
    metadata.tags = [...new Set(metadata.tags)].slice(0, 15);

    // 신뢰도(Confidence)가 유효한 범위 내에 있는지 확인합니다.
    metadata.confidence = Math.max(0, Math.min(1, metadata.confidence || 0.8));

    return metadata;
  } catch (error) {
    console.error('Gemini AI error:', error);
    throw new Error('Failed to generate metadata');
  }
}

/**
 * 사이트별 프롬프트를 사용하여 메타데이터를 생성합니다.
 * 크롬 익스텐션 API 프록시용 (title + keyword[] 형식)
 */
export async function generateSiteMetadata(
  imageBase64: string,
  siteType: SiteType,
  plan: PlanTier = 'free'
): Promise<SiteMetadataResult> {
  try {
    const prompt = getPromptForSite(siteType, plan);

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    const metadata = JSON.parse(jsonMatch[0]) as SiteMetadataResult;

    if (!metadata.title || !metadata.keyword) {
      throw new Error('Incomplete metadata generated');
    }

    // 키워드 중복 제거 및 플랜별 제한
    const maxKeywords = plan === 'free' ? 20 : 50;
    metadata.keyword = [...new Set(metadata.keyword)].slice(0, maxKeywords);

    // 제목 길이 제한 (200자)
    if (metadata.title.length > 200) {
      metadata.title = metadata.title.substring(0, 200);
    }

    return metadata;
  } catch (error) {
    console.error('Gemini AI error (site metadata):', error);
    throw new Error('Failed to generate site metadata');
  }
}

/**
 * 여러 이미지를 배치로 처리합니다.
 */
export async function generateBatchMetadata(
  images: Array<{ buffer: Buffer; mimeType: string; id: string }>
): Promise<Map<string, AIGeneratedMetadata>> {
  const results = new Map<string, AIGeneratedMetadata>();

  // 속도 제한(Rate Limiting)을 고려하여 병렬로 처리합니다.
  const batchSize = 5;
  for (let i = 0; i < images.length; i += batchSize) {
    const batch = images.slice(i, i + batchSize);
    const promises = batch.map(async (img) => {
      try {
        const metadata = await generateImageMetadata(img.buffer, img.mimeType);
        results.set(img.id, metadata);
      } catch (error) {
        console.error(`Failed to process image ${img.id}:`, error);
      }
    });

    await Promise.all(promises);

    // 속도 제한을 위한 지연 시간 (Rate Limiting Delay)
    if (i + batchSize < images.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}
