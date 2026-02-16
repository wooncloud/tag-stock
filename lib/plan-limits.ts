import type { UserPlan } from '@/types/database';

interface PlanLimit {
  iptcEnabled: boolean;
  monthlyCredits: number;
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimit> = {
  free: {
    iptcEnabled: false,
    monthlyCredits: 10,
  },
  pro: {
    iptcEnabled: true,
    monthlyCredits: 500,
  },
  max: {
    iptcEnabled: true,
    monthlyCredits: 2000,
  },
} as const;

export function getPlanLimit(plan: UserPlan): PlanLimit {
  return PLAN_LIMITS[plan];
}

export function isPro(plan: UserPlan): boolean {
  return plan === 'pro';
}

export function isPaidPlan(plan: UserPlan): boolean {
  return plan === 'pro' || plan === 'max';
}
