import { SupabaseClient } from '@supabase/supabase-js';

import type { Image, ImageStatus, Metadata } from '@/types/database';

export type ImageWithMetadataArray = Image & { metadata: Metadata[] };

/**
 * Fetches an image by ID with ownership verification
 */
export async function getImageById(
  supabase: SupabaseClient,
  imageId: string,
  userId: string
): Promise<Image | null> {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('id', imageId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Image;
}

/**
 * Fetches an image with its metadata by ID with ownership verification
 */
export async function getImageWithMetadata(
  supabase: SupabaseClient,
  imageId: string,
  userId: string
): Promise<ImageWithMetadataArray | null> {
  const { data, error } = await supabase
    .from('images')
    .select('*, metadata(*)')
    .eq('id', imageId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as ImageWithMetadataArray;
}

/**
 * Updates the status of an image
 */
export async function updateImageStatus(
  supabase: SupabaseClient,
  imageId: string,
  status: ImageStatus,
  errorMessage?: string | null
): Promise<void> {
  const updateData: { status: ImageStatus; error_message?: string | null } = { status };

  if (errorMessage !== undefined) {
    updateData.error_message = errorMessage;
  }

  await supabase.from('images').update(updateData).eq('id', imageId);
}

/**
 * Verifies image ownership and returns the image if authorized
 */
export async function verifyImageOwnership(
  supabase: SupabaseClient,
  imageId: string,
  userId: string
): Promise<{ success: true; image: Image } | { success: false; error: string }> {
  const { data: image, error } = await supabase
    .from('images')
    .select('*')
    .eq('id', imageId)
    .single();

  if (error || !image) {
    return { success: false, error: 'Image not found' };
  }

  if (image.user_id !== userId) {
    return { success: false, error: 'Unauthorized' };
  }

  return { success: true, image: image as Image };
}

/**
 * Deletes existing metadata for an image
 */
export async function deleteImageMetadata(
  supabase: SupabaseClient,
  imageId: string
): Promise<void> {
  await supabase.from('metadata').delete().eq('image_id', imageId);
}

/**
 * Updates metadata embedded status
 */
export async function updateMetadataEmbedded(
  supabase: SupabaseClient,
  metadataId: string,
  embedded: boolean
): Promise<void> {
  await supabase.from('metadata').update({ embedded }).eq('id', metadataId);
}
