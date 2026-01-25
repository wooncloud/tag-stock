import { createClient } from '@supabase/supabase-js';

import type { UserPlan } from '@/types/database';

import { STRIPE_CONFIG } from '@/lib/stripe';

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

export type SubscriptionProvider = 'stripe' | 'lemonsqueezy';

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
 * Used by both Stripe and Lemon Squeezy webhooks
 */
export async function updateSubscriptionStatus(params: UpdateSubscriptionParams): Promise<void> {
  const { userId, plan, status, subscriptionId, managementUrl, provider } = params;

  const updateData: Record<string, unknown> = {
    plan,
    subscription_status: status,
  };

  // Provider-specific subscription ID field
  if (subscriptionId) {
    if (provider === 'stripe') {
      updateData.stripe_subscription_id = subscriptionId;
    } else {
      updateData.lemon_squeezy_subscription_id = subscriptionId;
    }
  }

  // Lemon Squeezy specific: management URL
  if (managementUrl && provider === 'lemonsqueezy') {
    updateData.subscription_management_url = managementUrl;
  }

  // Update credits based on plan (only for Stripe, as it manages credits differently)
  if (provider === 'stripe') {
    updateData.credits_remaining =
      status === 'active'
        ? STRIPE_CONFIG.credits[plan as keyof typeof STRIPE_CONFIG.credits] ||
          STRIPE_CONFIG.credits.free
        : STRIPE_CONFIG.credits.free;
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
      credits_remaining: STRIPE_CONFIG.credits.free,
    })
    .eq('id', userId);

  console.log(`Subscription cancelled for user ${userId}`);
}

/**
 * Finds a user ID by their subscription ID
 * Useful when webhook doesn't include user_id in metadata
 */
export async function findUserBySubscriptionId(
  subscriptionId: string,
  provider: SubscriptionProvider
): Promise<string | null> {
  const field =
    provider === 'stripe' ? 'stripe_subscription_id' : 'lemon_squeezy_subscription_id';

  const { data: profile } = await getSupabaseAdmin()
    .from('profiles')
    .select('id')
    .eq(field, subscriptionId)
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
