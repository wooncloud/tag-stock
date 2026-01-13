'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  MoreVertical,
  Trash2,
  Eye,
  RefreshCw,
  FileDown,
  Copy,
  Check,
} from 'lucide-react';
import { deleteImage } from '@/app/actions/upload';
import { regenerateMetadata } from '@/app/actions/ai';
import { embedMetadataIntoImage, downloadImage } from '@/app/actions/embed';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ImageWithMetadata {
  id: string;
  storage_path: string;
  original_filename: string;
  status: string;
  created_at: string;
  metadata: Array<{
    id: string;
    title: string;
    description: string;
    keywords: string[];
    tags: string[];
    category: string;
    embedded: boolean;
  }>;
}

interface ImageGalleryProps {
  images: ImageWithMetadata[];
  isPro: boolean;
}

export function ImageGallery({ images, isPro }: ImageGalleryProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<ImageWithMetadata | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setIsLoading(true);
    const result = await deleteImage(imageId);

    if (result.success) {
      toast.success('Image deleted successfully');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete image');
    }

    setIsLoading(false);
  };

  const handleRegenerate = async (imageId: string) => {
    setIsLoading(true);
    const result = await regenerateMetadata(imageId);

    if (result.success) {
      toast.success('Metadata regenerated successfully');
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to regenerate metadata');
    }

    setIsLoading(false);
  };

  const handleEmbed = async (imageId: string) => {
    setIsLoading(true);
    const result = await embedMetadataIntoImage(imageId);

    if (result.success) {
      toast.success('Metadata embedded successfully!');
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      }
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to embed metadata');
    }

    setIsLoading(false);
  };

  const handleDownload = async (imageId: string, embedded: boolean = false) => {
    const result = await downloadImage(imageId, embedded);

    if (result.success && result.url) {
      window.open(result.url, '_blank');
      toast.success('Download started');
    } else {
      toast.error(result.error || 'Failed to download image');
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => {
          const metadata = image.metadata?.[0];
          const statusColor =
            image.status === 'completed'
              ? 'bg-green-500'
              : image.status === 'processing'
                ? 'bg-blue-500'
                : image.status === 'failed'
                  ? 'bg-red-500'
                  : 'bg-gray-500';

          return (
            <Card key={image.id} className="overflow-hidden group">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-muted-foreground">
                    Image Preview (Storage URL)
                  </div>
                </div>

                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="gap-1">
                    <div className={`w-2 h-2 rounded-full ${statusColor}`} />
                    {image.status}
                  </Badge>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" disabled={isLoading}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedImage(image)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(image.id, false)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Original
                      </DropdownMenuItem>
                      {metadata && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleRegenerate(image.id)}
                            disabled={isLoading}
                          >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Regenerate Metadata
                          </DropdownMenuItem>
                          {isPro && !metadata.embedded && (
                            <DropdownMenuItem
                              onClick={() => handleEmbed(image.id)}
                              disabled={isLoading}
                            >
                              <FileDown className="mr-2 h-4 w-4" />
                              Embed & Download
                            </DropdownMenuItem>
                          )}
                          {metadata.embedded && (
                            <DropdownMenuItem onClick={() => handleDownload(image.id, true)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download with Metadata
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleDelete(image.id)}
                        disabled={isLoading}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-medium truncate">{image.original_filename}</h3>

                {metadata && (
                  <>
                    <p className="text-sm text-muted-foreground line-clamp-2">
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
                )}

                <p className="text-xs text-muted-foreground">
                  {new Date(image.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 이미지 상세 정보 다이얼로그 */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedImage?.original_filename}</DialogTitle>
            <DialogDescription>Image metadata and details</DialogDescription>
          </DialogHeader>

          {selectedImage?.metadata?.[0] && (
            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Title</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(selectedImage.metadata[0].title, 'title')
                    }
                  >
                    {copiedField === 'title' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm p-2 bg-muted rounded">
                  {selectedImage.metadata[0].title}
                </p>
              </div>

              {/* 설명 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Description</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(selectedImage.metadata[0].description, 'description')
                    }
                  >
                    {copiedField === 'description' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm p-2 bg-muted rounded">
                  {selectedImage.metadata[0].description}
                </p>
              </div>

              {/* 카테고리 */}
              <div>
                <label className="text-sm font-medium">Category</label>
                <p className="text-sm p-2 bg-muted rounded mt-1">
                  {selectedImage.metadata[0].category}
                </p>
              </div>

              {/* 키워드 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">
                    Keywords ({selectedImage.metadata[0].keywords?.length || 0})
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        selectedImage.metadata[0].keywords?.join(', ') || '',
                        'keywords'
                      )
                    }
                  >
                    {copiedField === 'keywords' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedImage.metadata[0].keywords?.map((keyword, i) => (
                    <Badge key={i} variant="outline">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 태그 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">
                    Tags ({selectedImage.metadata[0].tags?.length || 0})
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        selectedImage.metadata[0].tags?.join(', ') || '',
                        'tags'
                      )
                    }
                  >
                    {copiedField === 'tags' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedImage.metadata[0].tags?.map((tag, i) => (
                    <Badge key={i} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* 메타데이터 상태 */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Metadata embedded in file:
                  </span>
                  <Badge variant={selectedImage.metadata[0].embedded ? 'default' : 'secondary'}>
                    {selectedImage.metadata[0].embedded ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
