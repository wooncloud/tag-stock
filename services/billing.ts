import { createClient } from '@supabase/supabase-js';

import type { UserPlan } from '@/types/database';

import { PLAN_LIMITS } from '@/lib/plan-limits';

// Lazy initialization to avoid build-time errors
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
 * Updates user profile with subscription status
 * Used by Lemon Squeezy webhooks
 */
export async function updateSubscriptionStatus(params: UpdateSubscriptionParams): Promise<void> {
  const { userId, plan, status, subscriptionId, managementUrl } = params;

  const updateData: Record<string, unknown> = {
    plan,
    subscription_status: status,
  };

  // Provider-specific subscription ID field
  if (subscriptionId) {
    updateData.lemon_squeezy_subscription_id = subscriptionId;
  }

  // Lemon Squeezy specific: management URL
  if (managementUrl) {
    updateData.subscription_management_url = managementUrl;
  }

  // Update credits based on plan for paid plans
  if (status === 'active' || status === 'on_trial') {
    const limits = PLAN_LIMITS[plan];
    if (limits) {
      // If unlimited (-1), we still set it. Otherwise set the monthly amount.
      updateData.credits_remaining = limits.monthlyCredits;
    }
  } else {
    // Revert to free plan credits if subscription is not active
    updateData.credits_remaining = PLAN_LIMITS.free.monthlyCredits;
  }

  await getSupabaseAdmin().from('profiles').update(updateData).eq('id', userId);

  console.log(`Subscription updated for user ${userId}: plan=${plan}, status=${status}`);
}

/**
 * Cancels a subscription by updating user profile to free plan
 */
export async function cancelSubscription(userId: string): Promise<void> {
  await getSupabaseAdmin()
    .from('profiles')
    .update({
      plan: 'free',
      subscription_status: 'cancelled',
      credits_remaining: PLAN_LIMITS.free.monthlyCredits,
    })
    .eq('id', userId);

  console.log(`Subscription cancelled for user ${userId}`);
}

/**
 * Finds a user ID by their subscription ID
 */
export async function findUserBySubscriptionId(
  subscriptionId: string
): Promise<string | null> {
  const { data: profile } = await getSupabaseAdmin()
    .from('profiles')
    .select('id')
    .eq('lemon_squeezy_subscription_id', subscriptionId)
    .single();

  return profile?.id || null;
}

/**
 * Determines the plan based on Lemon Squeezy variant ID
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
