'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';
import { cookies } from 'next/headers';

interface UploadResult {
  success: boolean;
  imageId?: string;
  error?: string;
}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
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

    // 사용자의 크레딧을 확인합니다.
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits_remaining, plan')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: 'Profile not found' };
    }

    if (profile.credits_remaining <= 0 && profile.plan === 'free') {
      return { success: false, error: 'Insufficient credits. Please upgrade to Pro.' };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // 파일을 검증합니다.
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/tiff', 'image/tif'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type' };
    }

    // 최대 50MB 제한
    if (file.size > 50 * 1024 * 1024) {
      return { success: false, error: 'File too large (max 50MB)' };
    }

    // 이미지의 크기(너비, 높이)를 가져옵니다.
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let width: number | undefined;
    let height: number | undefined;

    try {
      const metadata = await sharp(buffer).metadata();
      width = metadata.width;
      height = metadata.height;
    } catch (error) {
      console.error('Error reading image metadata:', error);
    }

    // 고유한 파일 이름을 생성합니다.
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Supabase Storage에 업로드합니다.
    const { error: uploadError } = await supabase.storage
      .from('user-images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return { success: false, error: 'Failed to upload file' };
    }

    // 데이터베이스에 이미지 레코드를 생성합니다.
    const { data: imageData, error: imageError } = await supabase
      .from('images')
      .insert({
        user_id: user.id,
        storage_path: filePath,
        original_filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        width,
        height,
        status: 'processing',
      })
      .select()
      .single();

    if (imageError || !imageData) {
      // 데이터베이스 삽입에 실패하면 스토리지를 정리합니다.
      await supabase.storage.from('user-images').remove([filePath]);
      return { success: false, error: 'Failed to create image record' };
    }

    // 무료 사용자의 경우 크레딧을 차감합니다.
    if (profile.plan === 'free') {
      const { error: creditError } = await supabase.rpc('decrement_user_credits', {
        user_uuid: user.id,
        amount: 1,
      });

      if (creditError) {
        console.error('Failed to decrement credits:', creditError);
      }
    }

    revalidatePath('/dashboard');
    return { success: true, imageId: imageData.id };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteImage(imageId: string): Promise<{ success: boolean; error?: string }> {
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

    // 소유권을 확인하고 저장 경로를 가져오기 위해 이미지를 가져옵니다.
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

    // 스토리지에서 삭제합니다.
    const { error: storageError } = await supabase.storage
      .from('user-images')
      .remove([image.storage_path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
    }

    // 데이터베이스에서 삭제합니다. (연쇄 삭제로 메타데이터도 삭제됨)
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      return { success: false, error: 'Failed to delete image' };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
