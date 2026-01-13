'use server';

import { createClient } from '@/lib/supabase/server';
import { embedMetadata } from '@/services/metadata-embedder';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

interface EmbedMetadataResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
}

export async function embedMetadataIntoImage(imageId: string): Promise<EmbedMetadataResult> {
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

    // 사용자가 Pro 플랜인지 확인합니다.
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Profile not found' };
    }

    if (profile.plan !== 'pro') {
      return { success: false, error: 'This feature is only available for Pro users' };
    }

    // 이미지와 메타데이터를 가져옵니다.
    const { data: image, error: imageError } = await supabase
      .from('images')
      .select('*, metadata(*)')
      .eq('id', imageId)
      .eq('user_id', user.id)
      .single();

    if (imageError || !image) {
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
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('user-images')
      .download(image.storage_path);

    if (downloadError || !fileData) {
      return { success: false, error: 'Failed to download image' };
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const originalBuffer = Buffer.from(arrayBuffer);

    // 메타데이터를 임베딩합니다.
    const embeddedBuffer = await embedMetadata(
      originalBuffer,
      metadata,
      image.original_filename
    );

    // 임베딩된 버전을 업로드합니다.
    const embeddedPath = image.storage_path.replace(
      /(\.[^.]+)$/,
      '-embedded$1'
    );

    const { error: uploadError } = await supabase.storage
      .from('user-images')
      .upload(embeddedPath, embeddedBuffer, {
        contentType: image.mime_type,
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { success: false, error: 'Failed to upload embedded image' };
    }

    // 메타데이터 레코드를 업데이트합니다.
    await supabase
      .from('metadata')
      .update({ embedded: true })
      .eq('id', metadata.id);

    // 다운로드를 위한 서명된 URL을 가져옵니다. (1시간 유효)
    const { data: signedUrlData } = await supabase.storage
      .from('user-images')
      .createSignedUrl(embeddedPath, 3600); // 1 hour expiry

    revalidatePath('/dashboard');

    return {
      success: true,
      downloadUrl: signedUrlData?.signedUrl,
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
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Unauthorized' };
    }

    // 이미지를 가져옵니다.
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
    const downloadPath = embedded
      ? image.storage_path.replace(/(\.[^.]+)$/, '-embedded$1')
      : image.storage_path;

    // 서명된 URL을 가져옵니다. (5분 유효)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('user-images')
      .createSignedUrl(downloadPath, 300); // 5 minutes

    if (urlError || !signedUrlData) {
      return { success: false, error: 'Failed to generate download URL' };
    }

    return { success: true, url: signedUrlData.signedUrl };
  } catch (error) {
    console.error('Download error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
