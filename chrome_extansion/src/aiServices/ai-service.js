import { GoogleGenAI, Type } from '@google/genai';

export async function generateMetadata(systemPrompt, imageBase64) {
  try {
    const ai = new GoogleGenAI({
      apiKey: 'AIzaSyD9U0R9Fjjav47xiKipCgNcyTQPaJPPFAs',
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

    const model = 'gemini-2.5-flash-lite';
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
      model,
      config,
      contents,
    });

    if (!response.candidates || !response.candidates[0] || !response.candidates[0].content) {
      throw new Error('Response structure is different from expected.');
    }
    const result = response.candidates[0].content.parts[0].text;
    return JSON.parse(result);
  } catch (error) {
    console.error('Error during AI generation:', error);
    throw error;
  }
}
