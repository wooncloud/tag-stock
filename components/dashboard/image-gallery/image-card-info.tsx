'use client';

import { getDisplayName } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';

interface ImageCardInfoProps {
  originalFilename: string;
  metadata?: {
    title?: string | null;
    tags?: string[] | null;
  };
  isProcessing: boolean;
  createdAt: string;
}

export function ImageCardInfo({
  originalFilename,
  metadata,
  isProcessing,
  createdAt,
}: ImageCardInfoProps) {
  return (
    <div className="space-y-2 p-4">
      <h3 className="truncate font-medium" title={originalFilename}>
        {getDisplayName(originalFilename)}
      </h3>

      {isProcessing ? (
        <div className="animate-pulse space-y-2">
          <div className="bg-muted h-4 w-3/4 rounded" />
          <div className="bg-muted h-3 w-full rounded" />
          <div className="bg-muted h-3 w-5/6 rounded" />
          <div className="flex gap-1 pt-1">
            <div className="bg-muted h-5 w-12 rounded" />
            <div className="bg-muted h-5 w-12 rounded" />
            <div className="bg-muted h-5 w-12 rounded" />
          </div>
        </div>
      ) : (
        metadata && (
          <>
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {metadata.title || 'No title'}
            </p>
            <div className="flex flex-wrap gap-1">
              {metadata.tags?.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {metadata.tags && metadata.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{metadata.tags.length - 3}
                </Badge>
              )}
            </div>
          </>
        )
      )}

      <p className="text-muted-foreground text-xs">
        {new Date(createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>
    </div>
  );
}
