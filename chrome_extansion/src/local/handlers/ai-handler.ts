import { generateMetadata } from '../../core/ai/gemini-client';
import { resizeImageForAI } from '../../core/utils/image';
import { InsufficientCreditsError, isInsufficientCreditsError } from '../../shared/errors';
import { setBatchAnalyzeLoading } from '../components/action-buttons';
import { showCreditModal } from '../components/credit-modal';
import { refreshModalIfOpen } from '../components/detail-panel';
import { renderGrid } from '../components/image-grid';
import { refreshCredits } from '../credit-display';
import { getImageById, updateImage } from '../state';
import { readFileAsBase64 } from '../utils';

export { isInsufficientCreditsError };

export async function analyzeImage(imageId: string): Promise<void> {
  const image = getImageById(imageId);
  if (!image) {
    throw new Error('Image not found');
  }

  if (!image.originalBase64) {
    const base64 = await readFileAsBase64(image.file);
    updateImage(imageId, { originalBase64: base64 });
  }

  const updatedImage = getImageById(imageId);
  if (!updatedImage?.originalBase64) {
    throw new Error('Image not loaded');
  }

  updateImage(imageId, { status: 'analyzing' });
  renderGrid();

  try {
    const resizedBase64 = await resizeImageForAI(updatedImage.originalBase64);
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
    refreshModalIfOpen();
    await refreshCredits();
  } catch (error) {
    // Re-throw credit errors as InsufficientCreditsError so callers can detect them
    if (isInsufficientCreditsError(error)) {
      updateImage(imageId, { status: 'pending' });
      renderGrid();
      throw new InsufficientCreditsError();
    }

    console.error('AI analysis failed:', error);
    updateImage(imageId, {
      status: 'error',
      error: (error as Error).message,
    });
    renderGrid();
    throw error;
  }
}

export async function batchAnalyze(imageIds: string[]): Promise<void> {
  const total = imageIds.length;
  let completed = 0;

  for (const id of imageIds) {
    const image = getImageById(id);
    if (!image || image.status === 'ready' || image.status === 'completed') {
      completed++;
      continue;
    }

    setBatchAnalyzeLoading(true, `Analyzing ${completed + 1}/${total}...`);

    try {
      await analyzeImage(id);
    } catch (error) {
      if (isInsufficientCreditsError(error)) {
        const progress = `${completed}/${total} images analyzed before credits ran out.`;
        showCreditModal({ progress });
        return; // Stop the entire batch
      }
      console.error(`Failed to analyze image ${id}:`, error);
    }

    completed++;
  }
}
