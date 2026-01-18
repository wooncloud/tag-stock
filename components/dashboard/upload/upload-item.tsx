'use client';

import { AlertCircle, Check, RefreshCw, X } from 'lucide-react';

import { FileWithProgress } from '@/types/upload';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadItemProps {
  fileWithProgress: FileWithProgress;
  isUploadingGlobal: boolean;
  onRemove: () => void;
}

export function UploadItem({ fileWithProgress, isUploadingGlobal, onRemove }: UploadItemProps) {
  const { file, progress, status, error } = fileWithProgress;

  return (
    <div className="bg-card flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="max-w-[200px] truncate text-sm font-medium">{file.name}</div>
          <div className="text-muted-foreground text-xs">
            ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === 'pending' && !isUploadingGlobal && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive h-8 w-8 cursor-pointer"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {status === 'uploading' && <RefreshCw className="text-primary h-4 w-4 animate-spin" />}
          {status === 'processing' && (
            <div className="flex items-center gap-1 text-xs font-medium text-blue-500">
              <RefreshCw className="h-3 w-3 animate-spin" />
              AI Analyzing...
            </div>
          )}
          {status === 'completed' && (
            <div className="flex items-center gap-1 text-xs font-medium text-green-500">
              <Check className="h-4 w-4" />
              Done
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-1 text-xs font-medium text-red-500">
              <AlertCircle className="h-4 w-4" />
              Failed
            </div>
          )}
        </div>
      </div>
      {(status === 'uploading' || status === 'processing') && (
        <Progress value={progress} className="h-1" />
      )}
      {status === 'error' && (
        <div className="rounded bg-red-50 p-2 text-xs text-red-500">{error}</div>
      )}
    </div>
  );
}
