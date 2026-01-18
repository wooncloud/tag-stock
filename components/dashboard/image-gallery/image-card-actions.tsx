'use client';

import { Download, FileDown, MoreVertical, RefreshCw, Trash2 } from 'lucide-react';

import { ImageWithMetadata } from '@/types/image';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ImageCardActionsProps {
  image: ImageWithMetadata;
  isProcessing: boolean;
  isPro: boolean;
  isLoading: boolean;
  onDownload: (imageId: string, filename: string, embedded?: boolean) => void;
  onRegenerate: (imageId: string) => void;
  onEmbed: (imageId: string) => void;
  onDelete: (imageId: string) => void;
}

export function ImageCardActions({
  image,
  isProcessing,
  isPro,
  isLoading,
  onDownload,
  onRegenerate,
  onEmbed,
  onDelete,
}: ImageCardActionsProps) {
  const metadata = image.metadata?.[0];

  return (
    <div className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            disabled={isProcessing}
            className="cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(image.id, image.original_filename, false);
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
          {metadata && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onRegenerate(image.id);
                }}
                disabled={isLoading}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate Metadata
              </DropdownMenuItem>
              {isPro && !metadata.embedded && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEmbed(image.id);
                  }}
                  disabled={isLoading}
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Embed & Download
                </DropdownMenuItem>
              )}
              {metadata.embedded && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(
                      image.id,
                      image.original_filename.replace(/(\.[^.]+)$/, '-with-tags$1'),
                      true
                    );
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download with Metadata
                </DropdownMenuItem>
              )}
            </>
          )}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id);
            }}
            disabled={isLoading}
            className="cursor-pointer text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
