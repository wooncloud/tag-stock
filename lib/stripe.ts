import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});

// Stripe 제품 및 가격 설정
export const STRIPE_CONFIG = {
  products: {
    pro: {
      name: 'TagStock Pro',
      description: 'Unlimited AI-powered image tagging with IPTC metadata embedding',
    },
  },
  prices: {
    pro_monthly: {
      amount: 1900, // $19.00
      currency: 'usd',
      interval: 'month' as const,
    },
    pro_yearly: {
      amount: 19000, // $190.00 (save $38)
      currency: 'usd',
      interval: 'year' as const,
    },
  },
};

/**
 * 사용자를 위한 Stripe 고객 정보를 생성하거나 조회합니다.
 */
export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const { createClient } = await import('@/lib/supabase/server');
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 고객이 이미 존재하는지 확인합니다.
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (profile?.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // 새로운 Stripe 고객 정보를 생성합니다.
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabase_user_id: userId,
    },
  });

  // 프로필을 고객 ID로 업데이트합니다.
  await supabase.from('profiles').update({ stripe_customer_id: customer.id }).eq('id', userId);

  return customer.id;
}

/**
 * 구독을 위한 체크아웃 세션을 생성합니다.
 */
export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  userId: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    metadata: {
      user_id: userId,
    },
  });

  return session;
}

/**
 * 빌링 포털 세션을 생성합니다.
 */
export async function createBillingPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}

/**
 * 구독을 취소합니다.
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

/**
 * 구독 상세 정보를 가져옵니다.
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription | null> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Failed to retrieve subscription:', error);
    return null;
  }
}
