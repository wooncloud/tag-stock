import { GoogleGenAI, Type } from '@google/genai';
import type { AIMetadataResult } from '../../shared/types';
import { AI_MODEL } from '../../shared/constants';

/**
 * Generate metadata using Gemini AI
 * @param systemPrompt - The prompt for the AI model
 * @param imageBase64 - Base64 encoded image data
 * @returns Generated metadata with title and keywords
 */
export async function generateMetadata(
    systemPrompt: string,
    imageBase64: string
): Promise<AIMetadataResult> {
    try {
        // Get API key from environment variable (set during build time)
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey || apiKey === 'your-api-key-here' || apiKey === 'your-gemini-api-key-here') {
            throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in .env file.');
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
