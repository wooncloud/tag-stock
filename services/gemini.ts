import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIGeneratedMetadata } from '@/types/database';

// Gemini AI 초기화
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
});

/**
 * 스톡 사진을 위한 최적화된 메타데이터를 생성합니다.
 * Adobe Stock 및 Shutterstock 표준에 최적화되어 있습니다.
 */
export async function generateImageMetadata(
  imageBuffer: Buffer,
  mimeType: string
): Promise<AIGeneratedMetadata> {
  try {
    const prompt = `You are an expert stock photography metadata generator optimized for Adobe Stock and Shutterstock.

Analyze this image and generate comprehensive, SEO-optimized metadata following these strict guidelines:

1. **Title** (50-70 characters):
   - Concise, descriptive, and keyword-rich
   - Start with the main subject
   - Include key attributes (color, style, setting)
   - Natural and readable, not keyword-stuffed

2. **Description** (150-200 characters):
   - Detailed but scannable
   - Include context, mood, and potential uses
   - Mention composition, lighting, and style
   - Target commercial and editorial use cases

3. **Keywords** (25-50 keywords):
   - Specific to broad (most relevant first)
   - Include:
     * Main subject and secondary elements
     * Colors, patterns, textures
     * Concepts, emotions, moods
     * Style, composition, technique
     * Potential uses and industries
     * Location/setting if applicable
   - Use single words and 2-3 word phrases
   - NO generic terms like "image", "photo", "picture"
   - NO redundant or repetitive keywords

4. **Category**:
   Choose ONE primary category:
   - Nature & Landscapes
   - People & Lifestyle
   - Business & Technology
   - Food & Drink
   - Travel & Places
   - Abstract & Concepts
   - Architecture & Buildings
   - Animals & Wildlife
   - Health & Medical
   - Arts & Culture
   - Sports & Recreation
   - Transportation
   - Fashion & Beauty

5. **Tags** (10-15 most relevant tags):
   - Ultra-specific tags for precise categorization
   - Technical attributes (e.g., "high-key lighting", "shallow depth of field")
   - Composition types (e.g., "rule of thirds", "symmetrical")

Return ONLY a valid JSON object in this exact format:
{
  "title": "Professional descriptive title here",
  "description": "Detailed description with context and use cases",
  "keywords": ["keyword1", "keyword2", "..."],
  "category": "Primary Category Name",
  "tags": ["tag1", "tag2", "..."],
  "confidence": 0.95
}

Confidence should be 0.0-1.0 based on image clarity and your certainty.`;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
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
