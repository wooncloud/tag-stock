'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  createBillingPortalSession,
  createCheckoutSession,
  getOrCreateStripeCustomer,
} from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function createSubscriptionCheckout(priceId: string) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Stripe 고객 정보를 가져오거나 생성합니다.
    const customerId = await getOrCreateStripeCustomer(user.id, user.email!);

    // 체크아웃 세션을 생성합니다.
    const session = await createCheckoutSession(customerId, priceId, user.id);

    if (!session.url) {
      throw new Error('Failed to create checkout session');
    }

    // Stripe 체크아웃으로 리다이렉트합니다.
    redirect(session.url);
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

export async function manageBilling() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // 고객 ID를 가져옵니다.
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      throw new Error('No billing information found');
    }

    // 빌링 포털 세션을 생성합니다.
    const session = await createBillingPortalSession(profile.stripe_customer_id);

    if (!session.url) {
      throw new Error('Failed to create billing portal session');
    }

    redirect(session.url);
  } catch (error) {
    console.error('Billing portal error:', error);
    throw error;
  }
}
