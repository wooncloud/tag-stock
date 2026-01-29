'use server';

import { redirect } from 'next/navigation';

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

export async function createSubscriptionCheckout(variantId: string) {
  try {
    const checkoutUrl = await createLemonSqueezyCheckout({
      variantId,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    });
    redirect(checkoutUrl);
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
    console.error('Checkout error:', error);
    throw error;
  }
}

export async function createCreditPackCheckout(variantId: string) {
  try {
    const checkoutUrl = await createLemonSqueezyCheckout({
      variantId,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits_purchased=true`,
      customData: { purchase_type: 'credit_pack' },
    });
    redirect(checkoutUrl);
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
    console.error('Credit pack checkout error:', error);
    throw error;
  }
}

export async function manageBilling() {
  try {
    const { user, supabase } = await ensureAuthenticatedLight();

    const { data: subscription } = await supabase
      .from('profiles')
      .select('subscription_management_url')
      .eq('id', user.id)
      .single();

    if (subscription?.subscription_management_url) {
      redirect(subscription.subscription_management_url);
    } else {
      redirect('https://app.lemonsqueezy.com/my-orders');
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
    console.error('Billing portal error:', error);
    throw error;
  }
}
