import type { UserPlan } from '@/types/database';

export interface PlanConfig {
  plan: UserPlan;
  title: string;
  description: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export const PLANS: PlanConfig[] = [
  {
    plan: 'free',
    title: 'Free',
    description: 'Perfect for trying out TagStock',
    price: '$0',
    features: [
      '10 credits per month',
      'Basic AI tagging (~20 keywords)',
      'IPTC/XMP metadata embedding',
      'Export metadata',
    ],
  },
  {
    plan: 'pro',
    title: 'Pro',
    description: 'For professional photographers',
    price: '$5',
    features: [
      '500 credits per month',
      'Advanced AI tagging (~50 keywords)',
      'Batch processing',
      'Multi-upload',
      'All Free features',
    ],
    isPopular: true,
  },
  {
    plan: 'max',
    title: 'Max',
    description: 'For high-volume creators',
    price: '$19',
    features: [
      '2,000 credits per month',
      'Priority support',
      'Early access to new features',
      'All Pro features',
    ],
  },
];

export interface CreditPackConfig {
  name: string;
  description: string;
  price: string;
}

export const CREDIT_PACKS: CreditPackConfig[] = [
  {
    name: 'Credit Pack S',
    description: '100 credits for one-time use',
    price: '$2',
  },
  {
    name: 'Credit Pack L',
    description: '1,000 credits for one-time use',
    price: '$15',
  },
];

export const VARIANT_IDS = {
  pro_monthly: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID || '',
  max_monthly: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MAX_MONTHLY_VARIANT_ID || '',
  credit_pack_s: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_S_VARIANT_ID || '',
  credit_pack_l: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_L_VARIANT_ID || '',
};

export function getVariantId(plan: UserPlan): string {
  if (plan === 'pro') return VARIANT_IDS.pro_monthly;
  if (plan === 'max') return VARIANT_IDS.max_monthly;
  return '';
}
