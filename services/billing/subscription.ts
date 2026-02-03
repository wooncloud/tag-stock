import { PLAN_LIMITS } from '@/lib/plan-limits';

import { getSupabaseAdmin } from './client';
import type { UpdateSubscriptionParams } from './types';

/**
 * 구독 상태로 사용자 프로필 업데이트
 * Lemon Squeezy 웹훅에서 사용
 */
export async function updateSubscriptionStatus(params: UpdateSubscriptionParams): Promise<void> {
  const { userId, plan, status, subscriptionId, managementUrl } = params;

  const updateData: Record<string, unknown> = {
    plan,
    subscription_status: status,
  };

  // 제공업체별 구독 ID 필드
  if (subscriptionId) {
    updateData.lemon_squeezy_subscription_id = subscriptionId;
  }

  // Lemon Squeezy 전용: 관리 URL
  if (managementUrl) {
    updateData.subscription_management_url = managementUrl;
  }

  // 유료 플랜의 경우 플랜에 따라 크레딧 업데이트
  if (status === 'active' || status === 'on_trial') {
    const limits = PLAN_LIMITS[plan];
    if (limits) {
      updateData.credits_subscription = limits.monthlyCredits;
    }
  } else {
    // 구독이 활성화되지 않은 경우 무료 플랜 크레딧으로 복구
    updateData.credits_subscription = PLAN_LIMITS.free.monthlyCredits;
  }

  await getSupabaseAdmin().from('profiles').update(updateData).eq('id', userId);

  console.log(`구독 업데이트: 사용자 ${userId}, plan=${plan}, status=${status}`);
}

/**
 * 사용자 프로필을 무료 플랜으로 업데이트하여 구독 취소 처리
 */
export async function cancelSubscription(userId: string): Promise<void> {
  await getSupabaseAdmin()
    .from('profiles')
    .update({
      plan: 'free',
      subscription_status: 'cancelled',
      credits_subscription: PLAN_LIMITS.free.monthlyCredits,
    })
    .eq('id', userId);

  console.log(`구독 취소: 사용자 ${userId}`);
}

/**
 * 구독 ID로 사용자 ID 찾기
 */
export async function findUserBySubscriptionId(subscriptionId: string): Promise<string | null> {
  const { data: profile } = await getSupabaseAdmin()
    .from('profiles')
    .select('id')
    .eq('lemon_squeezy_subscription_id', subscriptionId)
    .single();

  return profile?.id || null;
}
