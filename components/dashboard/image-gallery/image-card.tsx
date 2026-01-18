'use client';

import { ImageWithMetadata } from '@/types/image';

import { Card } from '@/components/ui/card';

import { ImageCardActions } from './image-card-actions';
import { ImageCardInfo } from './image-card-info';
import { ImageCardPreview } from './image-card-preview';

interface ImageCardProps {
  image: ImageWithMetadata;
  isProcessing: boolean;
  isPro: boolean;
  isLoading: boolean;
  onClick: () => void;
  onDownload: (imageId: string, filename: string, embedded?: boolean) => void;
  onRegenerate: (imageId: string) => void;
  onEmbed: (imageId: string) => void;
  onDelete: (imageId: string) => void;
}

export function ImageCard({
  image,
  isProcessing,
  isPro,
  isLoading,
  onClick,
  onDownload,
  onRegenerate,
  onEmbed,
  onDelete,
}: ImageCardProps) {
  const metadata = image.metadata?.[0];

  return (
    <Card
      className="group hover:ring-primary/50 cursor-pointer overflow-hidden transition-all hover:ring-2"
      onClick={onClick}
    >
      <div className="relative">
        <ImageCardPreview
          url={image.url ?? null}
          originalFilename={image.original_filename}
          status={image.status}
          isProcessing={isProcessing}
        />

        <ImageCardActions
          image={image}
          isProcessing={isProcessing}
          isPro={isPro}
          isLoading={isLoading}
          onDownload={onDownload}
          onRegenerate={onRegenerate}
          onEmbed={onEmbed}
          onDelete={onDelete}
        />
      </div>

      <ImageCardInfo
        originalFilename={image.original_filename}
        metadata={metadata}
        isProcessing={isProcessing}
        createdAt={image.created_at}
      />
    </Card>
  );
}
