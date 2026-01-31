import { createClient } from '@supabase/supabase-js';

import type { UserPlan } from '@/types/database';

import { PLAN_LIMITS } from '@/lib/plan-limits';

// 빌드 에러를 방지하기 위한 지연 초기화
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type SubscriptionProvider = 'lemonsqueezy';

interface UpdateSubscriptionParams {
  userId: string;
  plan: UserPlan;
  status: string;
  subscriptionId?: string;
  managementUrl?: string;
  provider: SubscriptionProvider;
}

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
      // 무제한(-1)인 경우에도 설정하고, 그렇지 않으면 매월 금액을 설정합니다.
      updateData.credits_subscription = limits.monthlyCredits;
    }
  } else {
    // 구독이 활성화되지 않은 경우 무료 플랜 크레딧으로 복구
    updateData.credits_subscription = PLAN_LIMITS.free.monthlyCredits;
  }

  await getSupabaseAdmin().from('profiles').update(updateData).eq('id', userId);

  console.log(`Subscription updated for user ${userId}: plan=${plan}, status=${status}`);
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

  console.log(`Subscription cancelled for user ${userId}`);
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

/**
 * Lemon Squeezy 변형(Variant) ID를 기반으로 플랜 결정
 */
export function getLemonSqueezyPlan(variantId: string): UserPlan {
  const proVariants = [
    process.env.LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID,
    process.env.LEMON_SQUEEZY_PRO_YEARLY_VARIANT_ID,
  ];

  const maxVariants = [
    process.env.LEMON_SQUEEZY_MAX_MONTHLY_VARIANT_ID,
    process.env.LEMON_SQUEEZY_MAX_YEARLY_VARIANT_ID,
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
 * 사용자 프로필에 구매한 크레딧 추가
 */
export async function addPurchasedCredits(userId: string, amount: number): Promise<void> {
  // 먼저 현재 크레딧을 가져옵니다.
  const { data: profile } = await getSupabaseAdmin()
    .from('profiles')
    .select('credits_purchased')
    .eq('id', userId)
    .single();

  const currentCredits = profile?.credits_purchased || 0;

  await getSupabaseAdmin()
    .from('profiles')
    .update({
      credits_purchased: currentCredits + amount,
    })
    .eq('id', userId);

  console.log(`Added ${amount} purchased credits for user ${userId}`);
}
