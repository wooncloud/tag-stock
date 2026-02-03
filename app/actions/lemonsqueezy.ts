'use server';

import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

import '@/lib/lemonsqueezy';
import { ensureAuthenticatedLight } from '@/lib/supabase/auth';

function getStoreId(): string {
  const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
  if (!storeId) {
    throw new Error('Lemon Squeezy Store ID is not configured');
  }
  return storeId;
}

interface CheckoutOptions {
  variantId: string;
  redirectUrl: string;
  customData?: Record<string, string>;
}

async function createLemonSqueezyCheckout(options: CheckoutOptions): Promise<string> {
  const { user } = await ensureAuthenticatedLight();
  const storeId = getStoreId();

  const { data, error } = await createCheckout(storeId, options.variantId, {
    checkoutData: {
      email: user.email,
      custom: {
        user_id: user.id,
        ...options.customData,
      },
    },
    productOptions: {
      redirectUrl: options.redirectUrl,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  const checkoutUrl = data?.data.attributes.url;
  if (!checkoutUrl) {
    throw new Error('Failed to create checkout session');
  }

  return checkoutUrl;
}

export async function createSubscriptionCheckout(variantId: string): Promise<string> {
  const checkoutUrl = await createLemonSqueezyCheckout({
    variantId,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
  });
  return checkoutUrl;
}

export async function createCreditPackCheckout(variantId: string): Promise<string> {
  const checkoutUrl = await createLemonSqueezyCheckout({
    variantId,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits_purchased=true`,
    customData: { purchase_type: 'credit_pack' },
  });
  return checkoutUrl;
}

export async function manageBilling(): Promise<string> {
  const { user, supabase } = await ensureAuthenticatedLight();

  const { data: subscription } = await supabase
    .from('profiles')
    .select('subscription_management_url')
    .eq('id', user.id)
    .single();

  if (subscription?.subscription_management_url) {
    return subscription.subscription_management_url;
  }
  return 'https://app.lemonsqueezy.com/my-orders';
}
