import { GoogleGenAI, Type } from '@google/genai';

import { AI_MODEL } from '../../shared/constants';
import type { AIMetadataResult } from '../../shared/types';

/**
 * Gemini AI를 사용하여 메타데이터를 생성합니다.
 * @param systemPrompt - AI 모델을 위한 프롬프트
 * @param imageBase64 - Base64로 인코딩된 이미지 데이터
 * @returns 제목과 키워드가 포함된 생성된 메타데이터
 */
export async function generateMetadata(
  systemPrompt: string,
  imageBase64: string
): Promise<AIMetadataResult> {
  try {
    // 환경 변수에서 API 키 가져오기 (빌드 시 설정됨)
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your-api-key-here' || apiKey === 'your-gemini-api-key-here') {
      throw new Error(
        'Gemini API key not configured. Please set VITE_GEMINI_API_KEY in .env file.'
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const config = {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        required: ['title', 'keyword'],
        properties: {
          title: {
            type: Type.STRING,
          },
          keyword: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        },
      },
    };

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: systemPrompt,
          },
          {
            inlineData: {
              data: imageBase64,
              mimeType: 'image/jpeg',
            },
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      config,
      contents,
    });

    if (!response.candidates || !response.candidates[0] || !response.candidates[0].content) {
      throw new Error('Response structure is different from expected.');
    }

    const resultText = response.candidates[0].content.parts?.[0]?.text;
    if (!resultText) {
      throw new Error('Empty response from AI model.');
    }
    return JSON.parse(resultText) as AIMetadataResult;
  } catch (error) {
    console.error('Error during AI generation:', error);
    throw error;
  }
}
