import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import {
  cancelSubscription,
  getLemonSqueezyPlan,
  updateSubscriptionStatus,
} from '@/services/billing';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';

    if (!webhookSecret) {
      console.error('LEMON_SQUEEZY_WEBHOOK_SECRET is not set');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    const hmac = crypto.createHmac('sha256', webhookSecret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (
      signatureBuffer.length !== digest.length ||
      !crypto.timingSafeEqual(digest, signatureBuffer)
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const body = payload.data;

    console.log(`Received Lemon Squeezy event: ${eventName}`);

    switch (eventName) {
      case 'subscription_created':
      case 'subscription_updated': {
        const userId = payload.meta.custom_data?.user_id;
        const attributes = body.attributes;
        const variantId = attributes.variant_id.toString();
        const status = attributes.status;

        if (!userId) {
          console.error('No user_id in webhook custom_data');
          break;
        }

        const plan = getLemonSqueezyPlan(variantId);

        await updateSubscriptionStatus({
          userId,
          plan,
          status,
          subscriptionId: body.id,
          managementUrl: attributes.urls.update_payment_method,
          provider: 'lemonsqueezy',
        });

        break;
      }

      case 'subscription_cancelled':
      case 'subscription_expired': {
        const userId = payload.meta.custom_data?.user_id;
        if (userId) {
          await cancelSubscription(userId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
