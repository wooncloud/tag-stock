import { SupabaseClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'user-images';

/**
 * Downloads an image from Supabase Storage and returns it as a Buffer
 */
export async function downloadImageFromStorage(
  supabase: SupabaseClient,
  storagePath: string
): Promise<Buffer> {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).download(storagePath);

  if (error || !data) {
    throw new Error(`Failed to download image: ${error?.message || 'Unknown error'}`);
  }

  const arrayBuffer = await data.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Uploads an image buffer to Supabase Storage
 */
export async function uploadImageToStorage(
  supabase: SupabaseClient,
  path: string,
  buffer: Buffer,
  mimeType: string,
  options?: { upsert?: boolean }
): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).upload(path, buffer, {
    contentType: mimeType,
    cacheControl: '3600',
    upsert: options?.upsert ?? false,
  });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Creates a signed URL for downloading an image
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 */
export async function createSignedDownloadUrl(
  supabase: SupabaseClient,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${error?.message || 'Unknown error'}`);
  }

  return data.signedUrl;
}

/**
 * Deletes files from Supabase Storage
 */
export async function deleteFromStorage(supabase: SupabaseClient, paths: string[]): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove(paths);

  if (error) {
    console.error('Storage delete error:', error);
  }
}

/**
 * Generates the embedded version path from an original storage path
 * Example: "user123/original/image.jpg" -> "user123/original/image-embedded.jpg"
 */
export function getEmbeddedPath(originalPath: string): string {
  return originalPath.replace(/(\.[^.]+)$/, '-embedded$1');
}

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
