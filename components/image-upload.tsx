'use client';

import { useCallback, useState } from 'react';

import Image from 'next/image';

import { Image as ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { type FileRejection, useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // 거부된 파일 처리
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          errors.forEach((error) => {
            if (error.code === 'file-too-large') {
              alert(`${file.name} is too large. Max size is ${maxSize}MB`);
            } else if (error.code === 'file-invalid-type') {
              alert(`${file.name} is not a supported format`);
            } else {
              alert(`Error with ${file.name}: ${error.message}`);
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
          alert(`Maximum ${maxFiles} files allowed`);
          return prev;
        }
        return combined;
      });
    },
    [maxFiles, maxSize]
  );

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
      alert('Please select at least one image');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(files.map((f) => f.file));

      // 미리보기 정리 (메모리 해제)
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);

      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* 드롭 존 영역 */}
      <Card
        {...getRootProps()}
        className={`cursor-pointer border-2 border-dashed p-8 transition-all ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'} ${disabled || isUploading ? 'cursor-not-allowed opacity-50' : 'hover:border-primary hover:bg-primary/5'} `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="bg-primary/10 rounded-full p-4">
            <Upload className="text-primary h-8 w-8" />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive
                ? 'Drop your images here'
                : 'Drag & drop images here, or click to select'}
            </p>
            <p className="text-muted-foreground text-sm">
              Supports JPEG, PNG, WebP, TIFF (max {maxSize}MB per file)
            </p>
            <p className="text-muted-foreground text-xs">Up to {maxFiles} files at once</p>
          </div>
        </div>
      </Card>

      {/* 파일 목록 영역 */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                files.forEach((f) => URL.revokeObjectURL(f.preview));
                setFiles([]);
              }}
              disabled={isUploading}
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {files.map((uploadedFile) => (
              <Card key={uploadedFile.id} className="group relative overflow-hidden">
                <div className="bg-muted relative aspect-video">
                  <Image
                    src={uploadedFile.preview}
                    alt={uploadedFile.file.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />

                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => removeFile(uploadedFile.id)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-1 p-3">
                  <p className="truncate text-sm font-medium">{uploadedFile.file.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            className="w-full cursor-pointer"
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
