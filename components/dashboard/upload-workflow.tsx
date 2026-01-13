'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/image-upload';
import { uploadImage } from '@/app/actions/upload';
import { generateMetadata } from '@/app/actions/ai';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface UploadWorkflowProps {
  disabled?: boolean;
}

export function UploadWorkflow({ disabled = false }: UploadWorkflowProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (files: File[]) => {
    setIsProcessing(true);

    try {
      const results = await Promise.allSettled(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          const uploadResult = await uploadImage(formData);

          if (!uploadResult.success || !uploadResult.imageId) {
            throw new Error(uploadResult.error || 'Upload failed');
          }

          // 자동으로 메타데이터 생성
          const metadataResult = await generateMetadata(uploadResult.imageId);

          if (!metadataResult.success) {
            throw new Error(metadataResult.error || 'Metadata generation failed');
          }

          return { filename: file.name, imageId: uploadResult.imageId };
        })
      );

      const successful = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      if (successful > 0) {
        toast.success(`${successful} ${successful === 1 ? 'image' : 'images'} uploaded successfully!`);
      }

      if (failed > 0) {
        toast.error(`${failed} ${failed === 1 ? 'image' : 'images'} failed to upload`);
      }

      // 업데이트된 데이터를 표시하기 위해 페이지 새로고침
      router.refresh();
    } catch (error) {
      console.error('Upload workflow error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return <ImageUpload onUpload={handleUpload} disabled={disabled || isProcessing} />;
}
