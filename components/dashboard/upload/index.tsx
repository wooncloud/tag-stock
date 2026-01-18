'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { RefreshCw, Upload } from 'lucide-react';

import { FileWithProgress } from '@/types/upload';

import { processAndCompressImage } from '@/lib/utils/image-processing';

import { Button } from '@/components/ui/button';

import { generateMetadata } from '@/app/actions/ai';
import { uploadImage } from '@/app/actions/upload';

import { UploadItem } from './upload-item';

interface UploadWorkflowProps {
  disabled?: boolean;
}

export function UploadWorkflow({ disabled }: UploadWorkflowProps) {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files).map((file) => ({
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startUpload = async () => {
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== 'pending') continue;

      try {
        setFiles((prev) => {
          const next = [...prev];
          next[i].status = 'uploading';
          return next;
        });

        // 1. 이미지 처리 및 압축
        const processedFile = await processAndCompressImage(files[i].file);

        // 2. 파일 업로드
        const formData = new FormData();
        formData.append('file', processedFile);

        const uploadResult = await uploadImage(formData);

        if (!uploadResult.success || !uploadResult.imageId) {
          throw new Error(uploadResult.error || 'Upload failed');
        }

        const imageId = uploadResult.imageId;

        setFiles((prev) => {
          const next = [...prev];
          next[i].status = 'processing';
          next[i].progress = 100;
          next[i].imageId = imageId;
          return next;
        });

        // 3. AI 분석 트리거
        const aiResult = await generateMetadata(imageId);

        if (!aiResult.success) {
          throw new Error(aiResult.error || 'AI processing failed');
        }

        setFiles((prev) => {
          const next = [...prev];
          next[i].status = 'completed';
          return next;
        });
      } catch (error) {
        console.error('Upload process error:', error);
        setFiles((prev) => {
          const next = [...prev];
          next[i].status = 'error';
          next[i].error = error instanceof Error ? error.message : 'Unknown error';
          return next;
        });
      }
    }

    setIsUploading(false);
    router.refresh();
  };

  const allCompleted =
    files.length > 0 && files.every((f) => f.status === 'completed' || f.status === 'error');

  return (
    <div className="space-y-4">
      {/* 파일 선택 영역 */}
      {files.length === 0 && (
        <label
          className={`bg-muted/50 hover:bg-muted flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="text-muted-foreground mb-3 h-10 w-10" />
            <p className="mb-2 text-sm font-semibold">
              <span className="text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-muted-foreground text-xs">Images only (max 50MB per file)</p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={onFileSelect}
            disabled={disabled || isUploading}
          />
        </label>
      )}

      {/* 파일 리스트 */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((f, i) => (
            <UploadItem
              key={i}
              fileWithProgress={f}
              isUploadingGlobal={isUploading}
              onRemove={() => removeFile(i)}
            />
          ))}

          {!allCompleted && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                disabled={isUploading}
                onClick={() => setFiles([])}
              >
                Clear All
              </Button>
              <Button
                className="flex-2 cursor-pointer"
                disabled={isUploading || files.every((f) => f.status !== 'pending')}
                onClick={startUpload}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Start Upload'
                )}
              </Button>
            </div>
          )}

          {allCompleted && (
            <Button
              className="w-full cursor-pointer"
              onClick={() => {
                setFiles([]);
                router.refresh();
              }}
            >
              Upload More
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
