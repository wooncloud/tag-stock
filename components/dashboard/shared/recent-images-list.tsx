import Image from 'next/image';

import { Image as ImageIcon } from 'lucide-react';

import { Image as ImageType } from '@/types/database';

import { getDisplayName } from '@/lib/utils';

interface RecentImagesListProps {
  images: (ImageType & { url?: string })[];
}

export function RecentImagesList({ images }: RecentImagesListProps) {
  return (
    <div className="space-y-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="flex items-center justify-between border-b pb-4 last:border-0"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-muted relative flex h-12 w-12 items-center justify-center overflow-hidden rounded border">
              {image.url ? (
                <Image
                  src={image.url}
                  alt={image.original_filename}
                  fill
                  className="object-cover"
                />
              ) : (
                <ImageIcon className="text-muted-foreground h-6 w-6" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{getDisplayName(image.original_filename)}</p>
              <p className="text-muted-foreground text-xs">
                {new Date(image.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                image.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : image.status === 'processing'
                    ? 'bg-blue-100 text-blue-700'
                    : image.status === 'failed'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
              }`}
            >
              {image.status === 'completed'
                ? 'Completed'
                : image.status === 'processing'
                  ? 'Processing'
                  : image.status === 'failed'
                    ? 'Failed'
                    : 'Pending'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
