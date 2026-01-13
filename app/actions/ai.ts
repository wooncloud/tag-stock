'use server';

import { createClient } from '@/lib/supabase/server';
import { generateImageMetadata } from '@/services/gemini';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

interface GenerateMetadataResult {
  success: boolean;
  error?: string;
}

export async function generateMetadata(imageId: string): Promise<GenerateMetadataResult> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // 인증된 사용자를 가져옵니다.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // 이미지 레코드를 가져옵니다.
    const { data: image, error: imageError } = await supabase
      .from('images')
      .select('*')
      .eq('id', imageId)
      .eq('user_id', user.id)
      .single();

    if (imageError || !image) {
      return { success: false, error: 'Image not found' };
    }

    if (image.status === 'processing') {
      return { success: false, error: 'Image is already being processed' };
    }

    // 상태를 '처리 중'으로 업데이트합니다.
    await supabase
      .from('images')
      .update({ status: 'processing', error_message: null })
      .eq('id', imageId);

    try {
      // 스토리지에서 이미지를 다운로드합니다.
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('user-images')
        .download(image.storage_path);

      if (downloadError || !fileData) {
        throw new Error('Failed to download image');
      }

      // 버퍼로 변환합니다.
      const arrayBuffer = await fileData.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Gemini AI를 사용하여 메타데이터를 생성합니다.
      const aiMetadata = await generateImageMetadata(buffer, image.mime_type);

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
      await supabase
        .from('images')
        .update({ status: 'completed' })
        .eq('id', imageId);

      revalidatePath('/dashboard');
      return { success: true };
    } catch (processingError) {
      console.error('Processing error:', processingError);

      // 이미지 상태를 '실패'로 업데이트합니다.
      await supabase
        .from('images')
        .update({
          status: 'failed',
          error_message:
            processingError instanceof Error
              ? processingError.message
              : 'Failed to generate metadata',
        })
        .eq('id', imageId);

      return { success: false, error: 'Failed to generate metadata' };
    }
  } catch (error) {
    console.error('Generate metadata error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function regenerateMetadata(imageId: string): Promise<GenerateMetadataResult> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // 기존 메타데이터를 삭제합니다.
    await supabase.from('metadata').delete().eq('image_id', imageId);

    // 새로운 메타데이터를 생성합니다.
    return await generateMetadata(imageId);
  } catch (error) {
    console.error('Regenerate metadata error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
