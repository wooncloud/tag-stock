import type { UserPlan } from '@/types/database';

const PLAN_RANK: Record<UserPlan, number> = { free: 0, pro: 1, max: 2 };

const PLAN_LABEL: Record<UserPlan, string> = { free: 'Free', pro: 'Pro', max: 'Max' };

export type PlanAction = ReturnType<typeof getPlanAction>;

export function getPlanAction(currentPlan: UserPlan, cardPlan: UserPlan) {
  if (currentPlan === cardPlan) {
    return currentPlan === 'free'
      ? {
          text: 'Current Plan',
          action: 'none' as const,
          variant: 'outline' as const,
          disabled: true,
        }
      : {
          text: 'Manage Subscription',
          action: 'manage' as const,
          variant: 'default' as const,
          disabled: false,
        };
  }
  if (PLAN_RANK[cardPlan] > PLAN_RANK[currentPlan]) {
    return {
      text: `Upgrade to ${PLAN_LABEL[cardPlan]}`,
      action: 'checkout' as const,
      variant: 'default' as const,
      disabled: false,
    };
  }
  return {
    text: 'Manage Subscription',
    action: 'manage' as const,
    variant: 'outline' as const,
    disabled: false,
  };
}
