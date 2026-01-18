'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { ImageWithMetadata } from '@/types/image';

import { regenerateMetadata } from '@/app/actions/ai';
import { downloadImage, embedMetadataIntoImage } from '@/app/actions/embed';
import { deleteImage } from '@/app/actions/upload';

import { ImageCard } from './image-card';
import { ImageDetailsDialog } from './image-details-dialog';

interface ImageGalleryProps {
  images: ImageWithMetadata[];
  isPro: boolean;
}

export function ImageGallery({ images, isPro }: ImageGalleryProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<ImageWithMetadata | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingImages, setProcessingImages] = useState<Set<string>>(new Set());

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setIsLoading(true);
    const result = await deleteImage(imageId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to delete image');
    }

    setIsLoading(false);
  };

  const handleRegenerate = async (imageId: string) => {
    setProcessingImages((prev) => new Set(prev).add(imageId));

    const result = await regenerateMetadata(imageId);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to regenerate metadata');
    }

    setProcessingImages((prev) => {
      const next = new Set(prev);
      next.delete(imageId);
      return next;
    });
  };

  const handleEmbed = async (imageId: string) => {
    setIsLoading(true);
    const result = await embedMetadataIntoImage(imageId);

    if (result.success) {
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      }
      router.refresh();
    } else {
      alert(result.error || 'Failed to embed metadata');
    }

    setIsLoading(false);
  };

  const handleDownload = async (imageId: string, filename: string, embedded: boolean = false) => {
    const result = await downloadImage(imageId, embedded);

    if (result.success && result.url) {
      try {
        const response = await fetch(result.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download error:', error);
        window.open(result.url, '_blank');
      }
    } else {
      alert(result.error || 'Failed to download image');
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            isProcessing={processingImages.has(image.id) || image.status === 'processing'}
            isPro={isPro}
            isLoading={isLoading}
            onClick={() => setSelectedImage(image)}
            onDownload={handleDownload}
            onRegenerate={handleRegenerate}
            onEmbed={handleEmbed}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <ImageDetailsDialog
        image={selectedImage}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        copiedField={copiedField}
        onCopy={copyToClipboard}
      />
    </>
  );
}
