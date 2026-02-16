import { generateMetadata } from '../../core/ai/gemini-client';
import { resizeImageForAI } from '../../core/utils/image';
import { renderGrid } from '../components/image-grid';
import { renderEditor } from '../components/metadata-editor';
import { getImageById, updateImage } from '../state';

export async function analyzeImage(imageId: string): Promise<void> {
  const image = getImageById(imageId);
  if (!image || !image.originalBase64) {
    throw new Error('Image not loaded');
  }

  updateImage(imageId, { status: 'analyzing' });
  renderGrid();

  try {
    const resizedBase64 = await resizeImageForAI(image.originalBase64);
    const metadata = await generateMetadata('local', resizedBase64);

    updateImage(imageId, {
      metadata,
      editedMetadata: {
        title: metadata.title,
        keywords: metadata.keyword || [],
        caption: '',
      },
      status: 'ready',
    });

    renderGrid();
    renderEditor();
  } catch (error) {
    console.error('AI analysis failed:', error);
    updateImage(imageId, {
      status: 'error',
      error: (error as Error).message,
    });
    renderGrid();
    throw error;
  }
}
