import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// 웹훅 핸들러에는 서비스 역할 키(Service Role Key)를 사용합니다.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;

  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  await supabaseAdmin.from('profiles').update({
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    plan: 'pro',
    credits_remaining: 999999, // Pro 플랜은 무제한 전용 수치
  }).eq('id', userId);

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;

  if (!userId) {
    // 고객 ID로 사용자를 찾으려고 시도합니다.
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!profile) {
      console.error('Could not find user for subscription');
      return;
    }

    await supabaseAdmin.from('profiles').update({
      subscription_status: subscription.status,
      plan: subscription.status === 'active' ? 'pro' : 'free',
      credits_remaining: subscription.status === 'active' ? 999999 : 10,
    }).eq('id', profile.id);
  } else {
    await supabaseAdmin.from('profiles').update({
      subscription_status: subscription.status,
      plan: subscription.status === 'active' ? 'pro' : 'free',
      credits_remaining: subscription.status === 'active' ? 999999 : 10,
    }).eq('id', userId);
  }

  console.log(`Subscription updated: ${subscription.id}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // 구독 ID로 사용자를 찾습니다.
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!profile) {
    console.error('Could not find user for subscription');
    return;
  }

  await supabaseAdmin.from('profiles').update({
    subscription_status: 'canceled',
    plan: 'free',
    credits_remaining: 10,
  }).eq('id', profile.id);

  console.log(`Subscription canceled for user ${profile.id}`);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;

  if (!userId) {
    console.error('No user_id in checkout session metadata');
    return;
  }

  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await supabaseAdmin.from('profiles').update({
      stripe_subscription_id: subscription.id,
      subscription_status: subscription.status,
      plan: 'pro',
      credits_remaining: 999999,
    }).eq('id', userId);

    console.log(`Checkout completed for user ${userId}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // 이벤트 처리
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        break;

      case 'invoice.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        // 선택사항: 사용자에게 개별 알림 전송 로직 추가 가능
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
