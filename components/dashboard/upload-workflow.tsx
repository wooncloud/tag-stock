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
    const imageCompression = (await import('browser-image-compression')).default;

    try {
      const results = await Promise.allSettled(
        files.map(async (file) => {
          let fileToUpload = file;

          // 모든 이미지 파일에 대해 압축 시도
          if (file.type.startsWith('image/')) {
            const options = {
              maxSizeMB: 5, // 최대 5MB로 압축
              maxWidthOrHeight: 4096, // 최대 해상도 제한 (4K)
              useWebWorker: true,
              initialQuality: 0.8, // 초기 품질 80%
            };

            try {
              toast.info(`${file.name} 최적화 중...`);
              const compressedFile = await imageCompression(file, options);
              // 원본 파일명을 유지하기 위해 새 File 객체 생성
              fileToUpload = new File([compressedFile], file.name, {
                type: compressedFile.type,
              });
            } catch (error) {
              console.error('Compression error:', error);
              // 압축 실패 시 (예: 브라우저가 지원하지 않는 포맷) 원본 파일 사용
            }
          }

          const formData = new FormData();
          formData.append('file', fileToUpload);

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
