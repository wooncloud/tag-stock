import type { UserPlan } from '@/types/database';

export interface PlanConfig {
  plan: UserPlan;
  title: string;
  description: string;
  price: { monthly: string; yearly: string };
  features: string[];
  isPopular?: boolean;
}

export const PLANS: PlanConfig[] = [
  {
    plan: 'free',
    title: 'Free',
    description: 'Perfect for trying out TagStock',
    price: { monthly: '$0', yearly: '$0' },
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
    price: { monthly: '$5', yearly: '$50' },
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
    price: { monthly: '$19', yearly: '$190' },
    features: [
      '2,000 credits per month',
      'Priority support',
      'Early access to new features',
      'All Pro features',
    ],
  },
];

export const VARIANT_IDS = {
  pro_monthly: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID || '',
  pro_yearly: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_YEARLY_VARIANT_ID || '',
  max_monthly: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MAX_MONTHLY_VARIANT_ID || '',
  max_yearly: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MAX_YEARLY_VARIANT_ID || '',
  credit_pack_s: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_S_VARIANT_ID || '',
  credit_pack_l: process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_L_VARIANT_ID || '',
};

export function getVariantId(plan: UserPlan, billingCycle: 'monthly' | 'yearly'): string {
  if (plan === 'pro')
    return billingCycle === 'monthly' ? VARIANT_IDS.pro_monthly : VARIANT_IDS.pro_yearly;
  if (plan === 'max')
    return billingCycle === 'monthly' ? VARIANT_IDS.max_monthly : VARIANT_IDS.max_yearly;
  return '';
}
