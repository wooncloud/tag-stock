import type { UserPlan } from '@/types/database';

import { PLAN_LIMITS } from '@/lib/plan-limits';

/**
 * Lemon Squeezy 변형(Variant) ID를 기반으로 플랜 결정
 */
export function getLemonSqueezyPlan(variantId: string): UserPlan {
  const proVariants = [
    process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID,
    process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRO_YEARLY_VARIANT_ID,
  ];

  const maxVariants = [
    process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MAX_MONTHLY_VARIANT_ID,
    process.env.NEXT_PUBLIC_LEMON_SQUEEZY_MAX_YEARLY_VARIANT_ID,
  ];

  if (proVariants.includes(variantId)) {
    return 'pro';
  }

  if (maxVariants.includes(variantId)) {
    return 'max';
  }

  return 'free';
}

/**
 * 크레딧 팩 변형(Variant)에 대한 크레딧 양 가져오기
 */
export function getCreditPackAmount(variantId: string): number {
  const creditPackS = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_S_VARIANT_ID;
  const creditPackL = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_L_VARIANT_ID;

  if (variantId === creditPackS) {
    return 100; // Credit Pack S
  }

  if (variantId === creditPackL) {
    return 1000; // Credit Pack L
  }

  return 0;
}

/**
 * 플랜에 따른 크레딧 양 반환
 */
export function getCreditsForPlan(plan: UserPlan): number {
  return PLAN_LIMITS[plan].monthlyCredits;
}
