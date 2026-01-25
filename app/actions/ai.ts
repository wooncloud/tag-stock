'use server';

import { revalidatePath } from 'next/cache';

import { generateImageMetadata } from '@/services/gemini';

import { ensureAuthenticated } from '@/lib/supabase/auth';
import { deleteImageMetadata, getImageById, updateImageStatus } from '@/lib/supabase/image';
import { downloadImageFromStorage } from '@/lib/supabase/storage';

interface GenerateMetadataResult {
  success: boolean;
  error?: string;
}

export async function generateMetadata(
  imageId: string,
  options?: { force?: boolean }
): Promise<GenerateMetadataResult> {
  try {
    const { user, supabase } = await ensureAuthenticated();

    // 이미지 레코드를 가져옵니다.
    const image = await getImageById(supabase, imageId, user.id);

    if (!image) {
      return { success: false, error: 'Image not found' };
    }

    // 이미 처리가 완료되었거나 진행 중인지 확인합니다.
    if (image.status === 'completed' && !options?.force) {
      return { success: true }; // 이미 완료됨
    }

    if (image.status === 'processing' && !image.error_message) {
      // 에러 없이 'processing' 상태라면 정말로 작업 중일 가능성이 높음
      return { success: false, error: 'Image is already being processed' };
    }

    // 상태를 '처리 중'으로 업데이트합니다.
    await updateImageStatus(supabase, imageId, 'processing', null);

    try {
      // 스토리지에서 이미지를 다운로드합니다.
      const buffer = await downloadImageFromStorage(supabase, image.storage_path);

      console.log(`Starting AI metadata generation for image: ${imageId}`);
      // Gemini AI를 사용하여 메타데이터를 생성합니다.
      const aiMetadata = await generateImageMetadata(buffer, image.mime_type);
      console.log(`AI metadata generated successfully for: ${imageId}`);

      // 기존 메타데이터가 있다면 삭제합니다 (중복 방지).
      await deleteImageMetadata(supabase, imageId);

      // 데이터베이스에 메타데이터를 저장합니다.
      const { error: metadataError } = await supabase.from('metadata').insert({
        image_id: imageId,
        tags: aiMetadata.tags,
        title: aiMetadata.title,
        description: aiMetadata.description,
        keywords: aiMetadata.keywords,
        category: aiMetadata.category,
        ai_confidence: aiMetadata.confidence,
        embedded: false,
      });

      if (metadataError) {
        throw new Error('Failed to save metadata');
      }

      // 이미지 상태를 '완료'로 업데이트합니다.
      await updateImageStatus(supabase, imageId, 'completed');

      console.log(`Image ${imageId} status updated to completed`);

      revalidatePath('/dashboard');
      revalidatePath('/dashboard/images');
      return { success: true };
    } catch (processingError) {
      console.error('Processing error:', processingError);

      // 이미지 상태를 '실패'로 업데이트합니다.
      const errorMessage =
        processingError instanceof Error ? processingError.message : 'Failed to generate metadata';
      await updateImageStatus(supabase, imageId, 'failed', errorMessage);

      return { success: false, error: 'Failed to generate metadata' };
    }
  } catch (error) {
    console.error('Generate metadata error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function regenerateMetadata(imageId: string): Promise<GenerateMetadataResult> {
  try {
    const { user, profile, supabase } = await ensureAuthenticated();

    if (profile.credits_remaining <= 0 && profile.plan === 'free') {
      return { success: false, error: 'Insufficient credits. Please upgrade to Pro.' };
    }

    // 기존 메타데이터를 삭제합니다.
    await deleteImageMetadata(supabase, imageId);

    // 이미지 상태를 다시 'uploading'으로 변경하여 재처리 가능하게 합니다.
    await updateImageStatus(supabase, imageId, 'uploading', null);

    // 새로운 메타데이터를 생성합니다.
    const result = await generateMetadata(imageId, { force: true });

    if (result.success && profile.plan === 'free') {
      // 무료 사용자의 경우 크레딧을 차감합니다.
      await supabase.rpc('decrement_user_credits', {
        user_uuid: user.id,
        amount: 1,
      });
    }

    return result;
  } catch (error) {
    console.error('Regenerate metadata error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
