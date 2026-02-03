import type { UserPlan } from '@/types/database';

/**
 * 결제 제공업체 타입
 */
export type SubscriptionProvider = 'lemonsqueezy';

/**
 * 구독 상태 업데이트 파라미터
 */
export interface UpdateSubscriptionParams {
  userId: string;
  plan: UserPlan;
  status: string;
  subscriptionId?: string;
  managementUrl?: string;
  provider: SubscriptionProvider;
}
