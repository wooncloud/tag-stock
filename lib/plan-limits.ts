import type { UserPlan } from '@/types/database';

export type StorageType = 'compressed' | 'original';

interface CompressionOptions {
  maxWidthOrHeight: number;
  quality: number;
  maxSizeMB: number;
}

interface PlanLimit {
  maxUploadCount: number;
  maxFileSizeMB: number;
  compressionEnabled: boolean;
  compressionOptions?: CompressionOptions;
  iptcEnabled: boolean;
  monthlyCredits: number;
  storageType: StorageType;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimit> = {
  free: {
    maxUploadCount: 1,
    maxFileSizeMB: 2,
    compressionEnabled: true,
    compressionOptions: {
      maxWidthOrHeight: 2048,
      quality: 0.8,
      maxSizeMB: 2,
    },
    iptcEnabled: false,
    monthlyCredits: 10,
    storageType: 'compressed',
  },
  pro: {
    maxUploadCount: 10,
    maxFileSizeMB: 50,
    compressionEnabled: false,
    iptcEnabled: true,
    monthlyCredits: 500,
    storageType: 'original',
  },
} as const;

export function getPlanLimit(plan: UserPlan): PlanLimit {
  return PLAN_LIMITS[plan];
}

export function getStoragePath(userId: string, fileName: string, storageType: StorageType): string {
  return `${userId}/${storageType}/${fileName}`;
}

export function isPro(plan: UserPlan): boolean {
  return plan === 'pro';
}
