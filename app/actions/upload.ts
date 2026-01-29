'use server';

import { revalidatePath } from 'next/cache';

import sharp from 'sharp';

import type { StorageType, UserPlan } from '@/types/database';

import { PLAN_LIMITS, getStoragePath } from '@/lib/plan-limits';
import { ensureAuthenticated } from '@/lib/supabase/auth';
import { decrementCredits, getTotalCredits } from '@/lib/supabase/credits';
import { verifyImageOwnership } from '@/lib/supabase/image';
import { deleteFromStorage } from '@/lib/supabase/storage';

interface UploadResult {
  success: boolean;
  imageId?: string;
  error?: string;
}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const { user, profile, supabase } = await ensureAuthenticated();

    const totalCredits = getTotalCredits(profile.credits_subscription, profile.credits_purchased);

    if (totalCredits <= 0) {
      return { success: false, error: 'Insufficient credits. Please upgrade or purchase more.' };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // 파일을 검증합니다.
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/tiff',
      'image/tif',
    ];
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

    // 플랜에 따른 스토리지 타입 결정
    const userPlan = profile.plan as UserPlan;
    const storageType: StorageType = PLAN_LIMITS[userPlan].storageType;

    // 고유한 파일 이름을 생성합니다.
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = getStoragePath(user.id, fileName, storageType);

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
        status: 'uploading',
      })
      .select()
      .single();

    if (imageError || !imageData) {
      // 데이터베이스 삽입에 실패하면 스토리지를 정리합니다.
      await supabase.storage.from('user-images').remove([filePath]);
      return { success: false, error: 'Failed to create image record' };
    }

    // 모든 사용자에 대해 크레딧 차감을 수행합니다.
    await decrementCredits(supabase, user.id, 1);

    revalidatePath('/dashboard');
    return { success: true, imageId: imageData.id };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteImage(imageId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { user, supabase } = await ensureAuthenticated();

    // 소유권을 확인하고 저장 경로를 가져오기 위해 이미지를 가져옵니다.
    const result = await verifyImageOwnership(supabase, imageId, user.id);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    const { image } = result;

    // 스토리지에서 삭제합니다.
    await deleteFromStorage(supabase, [image.storage_path]);

    // 데이터베이스에서 삭제합니다. (연쇄 삭제로 메타데이터도 삭제됨)
    const { error: deleteError } = await supabase.from('images').delete().eq('id', imageId);

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
