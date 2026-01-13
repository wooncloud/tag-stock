'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface ImageUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  maxSize?: number; // in MB
  disabled?: boolean;
}

const ACCEPTED_FORMATS = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/tiff': ['.tiff', '.tif'],
};

export function ImageUpload({
  onUpload,
  maxFiles = 10,
  maxSize = 50,
  disabled = false,
}: ImageUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // 거부된 파일 처리
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            toast.error(`${file.name} is too large. Max size is ${maxSize}MB`);
          } else if (error.code === 'file-invalid-type') {
            toast.error(`${file.name} is not a supported format`);
          } else {
            toast.error(`Error with ${file.name}: ${error.message}`);
          }
        });
      });
    }

    // 허용된 파일 추가
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9),
    }));

    setFiles((prev) => {
      const combined = [...prev, ...newFiles];
      if (combined.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        return prev;
      }
      return combined;
    });
  }, [maxFiles, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxSize: maxSize * 1024 * 1024,
    disabled: disabled || isUploading,
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(files.map((f) => f.file));

      // 미리보기 정리 (메모리 해제)
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);

      toast.success('Images uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* 드롭 존 영역 */}
      <Card
        {...getRootProps()}
        className={`
          border-2 border-dashed p-8 transition-all cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive
                ? 'Drop your images here'
                : 'Drag & drop images here, or click to select'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supports JPEG, PNG, WebP, TIFF (max {maxSize}MB per file)
            </p>
            <p className="text-xs text-muted-foreground">
              Up to {maxFiles} files at once
            </p>
          </div>
        </div>
      </Card>

      {/* 파일 목록 영역 */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Selected Files ({files.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                files.forEach((f) => URL.revokeObjectURL(f.preview));
                setFiles([]);
              }}
              disabled={isUploading}
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((uploadedFile) => (
              <Card key={uploadedFile.id} className="relative overflow-hidden group">
                <div className="aspect-video relative bg-muted">
                  <img
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    className="object-cover w-full h-full"
                  />

                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFile(uploadedFile.id)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload {files.length} {files.length === 1 ? 'Image' : 'Images'}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
