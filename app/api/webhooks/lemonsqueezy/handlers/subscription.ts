import {
  addSubscriptionCredits,
  cancelSubscription,
  getCreditsForPlan,
  getLemonSqueezyPlan,
  updateSubscriptionStatus,
} from '@/services/billing';

import type { WebhookPayload } from './types';

/**
 * 신규 구독 생성 이벤트 처리
 */
export async function handleSubscriptionCreated(payload: WebhookPayload): Promise<void> {
  const userId = payload.meta.custom_data?.user_id;
  const attributes = payload.data.attributes;
  const variantId = attributes.variant_id?.toString() || '';
  const status = attributes.status || 'pending';

  if (!userId) {
    console.error('webhook custom_data에 user_id 없음');
    return;
  }

  const plan = getLemonSqueezyPlan(variantId);
  const credits = getCreditsForPlan(plan);

  // 구독 상태 및 플랜 업데이트
  await updateSubscriptionStatus({
    userId,
    plan,
    status,
    subscriptionId: payload.data.id,
    managementUrl: attributes.urls?.update_payment_method,
    provider: 'lemonsqueezy',
  });

  // 신규 구독에 초기 크레딧 추가
  if (status === 'active' || status === 'on_trial') {
    await addSubscriptionCredits(userId, credits);
    console.log(`신규 구독: 사용자 ${userId}에게 ${credits} 크레딧 추가 (${plan} 플랜)`);
  }
}

/**
 * 구독 업데이트 이벤트 처리 (플랜 변경)
 */
export async function handleSubscriptionUpdated(payload: WebhookPayload): Promise<void> {
  const userId = payload.meta.custom_data?.user_id;
  const attributes = payload.data.attributes;
  const variantId = attributes.variant_id?.toString() || '';
  const status = attributes.status || 'pending';

  if (!userId) {
    console.error('webhook custom_data에 user_id 없음');
    return;
  }

  const plan = getLemonSqueezyPlan(variantId);

  // 구독 상태 업데이트 (크레딧은 결제 성공 시 처리)
  await updateSubscriptionStatus({
    userId,
    plan,
    status,
    subscriptionId: payload.data.id,
    managementUrl: attributes.urls?.update_payment_method,
    provider: 'lemonsqueezy',
  });

  console.log(`구독 업데이트: 사용자 ${userId}, plan=${plan}, status=${status}`);
}

/**
 * 월간 구독 결제 성공 이벤트 처리
 */
export async function handleSubscriptionPaymentSuccess(payload: WebhookPayload): Promise<void> {
  const userId = payload.meta.custom_data?.user_id;
  const attributes = payload.data.attributes;
  const variantId = attributes.variant_id?.toString() || '';

  if (!userId) {
    console.error('subscription_payment_success custom_data에 user_id 없음');
    return;
  }

  const plan = getLemonSqueezyPlan(variantId);
  const credits = getCreditsForPlan(plan);

  // 월간 크레딧 추가
  await addSubscriptionCredits(userId, credits);
  console.log(`월간 갱신: 사용자 ${userId}에게 ${credits} 크레딧 추가 (${plan} 플랜)`);
}

/**
 * 구독 취소 이벤트 처리
 */
export async function handleSubscriptionCancelled(payload: WebhookPayload): Promise<void> {
  const userId = payload.meta.custom_data?.user_id;

  if (!userId) {
    console.error('subscription_cancelled custom_data에 user_id 없음');
    return;
  }

  await cancelSubscription(userId);
  console.log(`구독 취소: 사용자 ${userId}`);
}

/**
 * 구독 만료 이벤트 처리
 */
export async function handleSubscriptionExpired(payload: WebhookPayload): Promise<void> {
  const userId = payload.meta.custom_data?.user_id;

  if (!userId) {
    console.error('subscription_expired custom_data에 user_id 없음');
    return;
  }

  await cancelSubscription(userId);
  console.log(`구독 만료: 사용자 ${userId}`);
}
