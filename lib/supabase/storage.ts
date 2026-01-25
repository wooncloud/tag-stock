import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Storage의 storage_path 배열을 받아 Signed URL이 포함된 객체 배열로 변환합니다.
 * @param supabase Supabase 클라이언트
 * @param images 이미지 데이터 배열 (storage_path 포함)
 * @param bucket 스토리지 버킷 이름 (기본값: 'user-images')
 * @param expiresIn 만료 시간 (기본값: 3600초)
 */
export async function getSignedUrls<T extends { storage_path: string }>(
  supabase: SupabaseClient,
  images: T[] | null,
  bucket: string = 'user-images',
  expiresIn: number = 3600
): Promise<(T & { url?: string })[]> {
  if (!images || images.length === 0) return [];

  const { data: signedUrls, error } = await supabase.storage.from(bucket).createSignedUrls(
    images.map((img) => img.storage_path),
    expiresIn
  );

  if (error || !signedUrls) {
    console.error('Error generating signed URLs:', error);
    return images.map((img) => ({ ...img }));
  }

  return images.map((img, index) => ({
    ...img,
    url: signedUrls[index]?.signedUrl,
  }));
}
