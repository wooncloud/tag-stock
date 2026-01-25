import { NextRequest, NextResponse } from 'next/server';

import Stripe from 'stripe';

import {
  cancelSubscription,
  findUserBySubscriptionId,
  updateSubscriptionStatus,
} from '@/services/billing';

import { stripe } from '@/lib/stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.user_id;

  if (!userId) {
    console.error('No user_id in subscription metadata');
    return;
  }

  await updateSubscriptionStatus({
    userId,
    plan: 'pro',
    status: subscription.status,
    subscriptionId: subscription.id,
    provider: 'stripe',
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  let userId = subscription.metadata.user_id;

  if (!userId) {
    // 구독 ID로 사용자를 찾으려고 시도합니다.
    userId = (await findUserBySubscriptionId(subscription.id, 'stripe')) || '';

    if (!userId) {
      console.error('Could not find user for subscription');
      return;
    }
  }

  await updateSubscriptionStatus({
    userId,
    plan: subscription.status === 'active' ? 'pro' : 'free',
    status: subscription.status,
    provider: 'stripe',
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // 구독 ID로 사용자를 찾습니다.
  const userId = await findUserBySubscriptionId(subscription.id, 'stripe');

  if (!userId) {
    console.error('Could not find user for subscription');
    return;
  }

  await cancelSubscription(userId);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;

  if (!userId) {
    console.error('No user_id in checkout session metadata');
    return;
  }

  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

    await updateSubscriptionStatus({
      userId,
      plan: 'pro',
      status: subscription.status,
      subscriptionId: subscription.id,
      provider: 'stripe',
    });
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
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
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
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
