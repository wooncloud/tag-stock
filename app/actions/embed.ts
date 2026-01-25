'use server';

import { revalidatePath } from 'next/cache';

import { embedMetadata } from '@/services/metadata-embedder';

import { ensureAuthenticated } from '@/lib/supabase/auth';
import { getImageWithMetadata, updateMetadataEmbedded } from '@/lib/supabase/image';
import {
  createSignedDownloadUrl,
  downloadImageFromStorage,
  getEmbeddedPath,
  uploadImageToStorage,
} from '@/lib/supabase/storage';

interface EmbedMetadataResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

export async function embedMetadataIntoImage(imageId: string): Promise<EmbedMetadataResult> {
  try {
    const { user, profile, supabase } = await ensureAuthenticated();

    if (profile.plan !== 'pro') {
      return { success: false, error: 'This feature is only available for Pro users' };
    }

    // 이미지와 메타데이터를 가져옵니다.
    const image = await getImageWithMetadata(supabase, imageId, user.id);

    if (!image) {
      return { success: false, error: 'Image not found' };
    }

    if (!image.metadata || image.metadata.length === 0) {
      return { success: false, error: 'No metadata found. Please generate metadata first.' };
    }

    const metadata = image.metadata[0];

    if (metadata.embedded) {
      return { success: false, error: 'Metadata already embedded' };
    }

    // 원본 이미지를 다운로드합니다.
    const originalBuffer = await downloadImageFromStorage(supabase, image.storage_path);

    // 메타데이터를 임베딩합니다.
    const embeddedBuffer = await embedMetadata(originalBuffer, metadata, image.original_filename);

    // 임베딩된 버전을 업로드합니다.
    const embeddedPath = getEmbeddedPath(image.storage_path);

    await uploadImageToStorage(supabase, embeddedPath, embeddedBuffer, image.mime_type, {
      upsert: true,
    });

    // 메타데이터 레코드를 업데이트합니다.
    await updateMetadataEmbedded(supabase, metadata.id, true);

    // 다운로드를 위한 서명된 URL을 가져옵니다. (1시간 유효)
    const downloadUrl = await createSignedDownloadUrl(supabase, embeddedPath, 3600);

    revalidatePath('/dashboard');

    return {
      success: true,
      downloadUrl,
    };
  } catch (error) {
    console.error('Embed metadata error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function downloadImage(
  imageId: string,
  embedded: boolean = false
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { user, supabase } = await ensureAuthenticated();

    // 이미지를 가져오고 소유권을 확인합니다.
    const { data: image, error: imageError } = await supabase
      .from('images')
      .select('storage_path, user_id')
      .eq('id', imageId)
      .single();

    if (imageError || !image) {
      return { success: false, error: 'Image not found' };
    }

    if (image.user_id !== user.id) {
      return { success: false, error: 'Unauthorized' };
    }

    // 경로를 결정합니다.
    const downloadPath = embedded ? getEmbeddedPath(image.storage_path) : image.storage_path;

    // 서명된 URL을 가져옵니다. (5분 유효)
    const url = await createSignedDownloadUrl(supabase, downloadPath, 300);

    return { success: true, url };
  } catch (error) {
    console.error('Download error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
