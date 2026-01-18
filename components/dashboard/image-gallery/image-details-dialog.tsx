'use client';

import Image from 'next/image';

import { ImageWithMetadata } from '@/types/image';

import { getDisplayName } from '@/lib/utils';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { EmptyMetadataState } from './empty-metadata-state';
import { MetadataBadgeList } from './metadata-badge-list';
import { MetadataDetailItem } from './metadata-detail-item';

interface ImageDetailsDialogProps {
  image: ImageWithMetadata | null;
  isOpen: boolean;
  onClose: () => void;
  copiedField: string | null;
  onCopy: (text: string, field: string) => void;
}

export function ImageDetailsDialog({
  image,
  isOpen,
  onClose,
  copiedField,
  onCopy,
}: ImageDetailsDialogProps) {
  if (!image) return null;

  const metadata = image.metadata?.[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDisplayName(image.original_filename)}</DialogTitle>
          <DialogDescription>Image metadata and details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg border">
            {image.url ? (
              <Image
                src={image.url}
                alt={image.original_filename}
                fill
                className="object-contain"
              />
            ) : (
              <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                No preview available
              </div>
            )}
          </div>

          {metadata ? (
            <div className="space-y-4">
              <MetadataDetailItem
                label="Title"
                value={metadata.title}
                copied={copiedField === 'title'}
                onCopy={() => onCopy(metadata.title, 'title')}
              />
              <MetadataDetailItem
                label="Description"
                value={metadata.description}
                copied={copiedField === 'description'}
                onCopy={() => onCopy(metadata.description, 'description')}
              />
              <div>
                <label className="text-sm font-medium">Category</label>
                <p className="bg-muted mt-1 rounded p-2 text-sm">{metadata.category}</p>
              </div>
              <MetadataBadgeList
                label={`Keywords (${metadata.keywords?.length || 0})`}
                items={metadata.keywords}
                onCopy={() => onCopy(metadata.keywords?.join(', ') || '', 'keywords')}
                copied={copiedField === 'keywords'}
                variant="outline"
              />
              <MetadataBadgeList
                label={`Tags (${metadata.tags?.length || 0})`}
                items={metadata.tags}
                onCopy={() => onCopy(metadata.tags?.join(', ') || '', 'tags')}
                copied={copiedField === 'tags'}
                variant="secondary"
              />
            </div>
          ) : (
            <EmptyMetadataState />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
