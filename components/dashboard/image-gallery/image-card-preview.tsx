'use client';

import Image from 'next/image';

import { ImageIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface ImageCardPreviewProps {
  url: string | null;
  originalFilename: string;
  status: string;
  isProcessing: boolean;
}

export function ImageCardPreview({
  url,
  originalFilename,
  status,
  isProcessing,
}: ImageCardPreviewProps) {
  const statusColor = isProcessing
    ? 'bg-blue-500'
    : status === 'completed'
      ? 'bg-green-500'
      : status === 'failed'
        ? 'bg-red-500'
        : 'bg-gray-500';

  return (
    <div className="bg-muted relative aspect-video">
      <div className="absolute inset-0 flex items-center justify-center">
        {url ? (
          <Image src={url} alt={originalFilename} fill className="object-cover" />
        ) : (
          <div className="text-muted-foreground flex flex-col items-center gap-2">
            <ImageIcon className="h-8 w-8 opacity-20" />
            <span className="text-xs">No Preview</span>
          </div>
        )}
      </div>

      <div className="absolute top-2 left-2">
        <Badge variant="secondary" className="gap-1">
          <div className={`h-2 w-2 rounded-full ${statusColor}`} />
          {isProcessing ? 'processing' : status}
        </Badge>
      </div>
    </div>
  );
}
