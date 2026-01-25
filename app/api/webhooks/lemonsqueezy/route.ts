import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

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

                let plan: 'pro' | 'max' | 'free' = 'free';
                if (
                    variantId === process.env.LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID ||
                    variantId === process.env.LEMON_SQUEEZY_PRO_YEARLY_VARIANT_ID
                ) {
                    plan = 'pro';
                } else if (
                    variantId === process.env.LEMON_SQUEEZY_MAX_MONTHLY_VARIANT_ID ||
                    variantId === process.env.LEMON_SQUEEZY_MAX_YEARLY_VARIANT_ID
                ) {
                    plan = 'max';
                }

                await getSupabaseAdmin()
                    .from('profiles')
                    .update({
                        plan,
                        subscription_status: status,
                        lemon_squeezy_subscription_id: body.id,
                        subscription_management_url: attributes.urls.update_payment_method,
                    })
                    .eq('id', userId);

                break;
            }

            case 'subscription_cancelled':
            case 'subscription_expired': {
                const userId = payload.meta.custom_data?.user_id;
                if (userId) {
                    await getSupabaseAdmin()
                        .from('profiles')
                        .update({
                            plan: 'free',
                            subscription_status: 'cancelled',
                        })
                        .eq('id', userId);
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
