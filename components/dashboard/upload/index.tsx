'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AlertTriangle, Crown, RefreshCw, Upload } from 'lucide-react';

import type { UserPlan } from '@/types/database';
import { FileWithProgress } from '@/types/upload';

import { PLAN_LIMITS, isPaidPlan } from '@/lib/plan-limits';
import { processAndCompressImage } from '@/lib/utils/image-processing';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { generateMetadata } from '@/app/actions/ai';
import { uploadImage } from '@/app/actions/upload';

import { UploadItem } from './upload-item';

interface UploadWorkflowProps {
  disabled?: boolean;
  userPlan?: UserPlan;
}

export function UploadWorkflow({ disabled, userPlan = 'free' }: UploadWorkflowProps) {
  const router = useRouter();
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const planLimit = PLAN_LIMITS[userPlan];
  const canMultipleUpload = isPaidPlan(userPlan);

  // 업로드 중 페이지 이탈 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isUploading) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isUploading]);

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

  // 단일 파일 처리 함수
  const processFile = async (index: number) => {
    try {
      setFiles((prev) => {
        const next = [...prev];
        next[index].status = 'uploading';
        return next;
      });

      // 1. 이미지 처리 및 압축
      const processedFile = await processAndCompressImage(files[index].file, { userPlan });

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
        next[index].status = 'processing';
        next[index].progress = 100;
        next[index].imageId = imageId;
        return next;
      });

      // 3. AI 분석 트리거
      const aiResult = await generateMetadata(imageId);

      if (!aiResult.success) {
        throw new Error(aiResult.error || 'AI processing failed');
      }

      setFiles((prev) => {
        const next = [...prev];
        next[index].status = 'completed';
        return next;
      });
    } catch (error) {
      console.error('Upload process error:', error);
      setFiles((prev) => {
        const next = [...prev];
        next[index].status = 'error';
        next[index].error = error instanceof Error ? error.message : 'Unknown error';
        return next;
      });
    }
  };

  const startUpload = async () => {
    setIsUploading(true);

    // pending 상태인 파일들의 인덱스 수집
    const pendingIndexes = files
      .map((f, i) => (f.status === 'pending' ? i : -1))
      .filter((i) => i !== -1);

    // 동시성 제한: 최대 3개 동시 처리 (슬라이딩 윈도우)
    const CONCURRENCY = 3;
    let currentIndex = 0;
    const inProgress = new Set<Promise<void>>();

    const startNext = (): Promise<void> | null => {
      if (currentIndex >= pendingIndexes.length) return null;

      const index = pendingIndexes[currentIndex++];
      const promise = processFile(index).finally(() => {
        inProgress.delete(promise);
      });
      inProgress.add(promise);
      return promise;
    };

    // 초기 CONCURRENCY 개수만큼 시작
    for (let i = 0; i < Math.min(CONCURRENCY, pendingIndexes.length); i++) {
      startNext();
    }

    // 하나가 완료될 때마다 다음 작업 시작
    while (inProgress.size > 0) {
      await Promise.race(inProgress);
      startNext();
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

            {/* 플랜별 안내 문구 */}
            {canMultipleUpload ? (
              <div className="flex flex-col items-center gap-1">
                <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
                  <Crown className="mr-1 h-3 w-3" />
                  {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}
                </Badge>
                <p className="text-muted-foreground text-xs">
                  Original quality preserved (max {planLimit.maxFileSizeMB}MB per file)
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <p className="text-muted-foreground text-xs">
                  Images will be compressed (max {planLimit.compressionOptions?.maxWidthOrHeight}px)
                </p>
                <Link
                  href="/dashboard/pricing"
                  className="text-primary text-xs underline hover:no-underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Upgrade to Pro for original quality
                </Link>
              </div>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            multiple={canMultipleUpload}
            accept="image/*"
            onChange={onFileSelect}
            disabled={disabled || isUploading}
          />
        </label>
      )}

      {/* 업로드 중 경고 */}
      {isUploading && (
        <Alert variant="destructive" className="border-amber-500 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-600 dark:text-amber-400">
            Processing in progress. Please do not close or refresh this page until all uploads are
            complete.
          </AlertDescription>
        </Alert>
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
