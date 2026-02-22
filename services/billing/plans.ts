import type { UserPlan } from '@/types/database';

import { PLAN_LIMITS } from '@/lib/plan-limits';
import { VARIANT_IDS } from '@/components/dashboard/pricing/lib/plans';

/**
 * Lemon Squeezy 변형(Variant) ID를 기반으로 플랜 결정
 */
export function getLemonSqueezyPlan(variantId: string): UserPlan {
  if (variantId === VARIANT_IDS.pro_monthly) {
    return 'pro';
  }

  if (variantId === VARIANT_IDS.max_monthly) {
    return 'max';
  }

  return 'free';
}

/**
 * 크레딧 팩 변형(Variant)에 대한 크레딧 양 가져오기
 */
export function getCreditPackAmount(variantId: string): number {
  if (variantId === VARIANT_IDS.credit_pack_s) {
    return 100;
  }

  if (variantId === VARIANT_IDS.credit_pack_l) {
    return 1000;
  }

  return 0;
}

/**
 * 플랜에 따른 크레딧 양 반환
 */
export function getCreditsForPlan(plan: UserPlan): number {
  return PLAN_LIMITS[plan].monthlyCredits;
}
