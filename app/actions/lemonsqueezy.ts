'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

import { createClient } from '@/lib/supabase/server';

export async function createSubscriptionCheckout(variantId: string) {
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

        const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
        if (!storeId) {
            throw new Error('Lemon Squeezy Store ID is not configured');
        }

        // Create a checkout session
        const { data, error } = await createCheckout(storeId, variantId, {
            checkoutData: {
                email: user.email,
                custom: {
                    user_id: user.id,
                },
            },
            productOptions: {
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            },
        });

        if (error) {
            throw new Error(error.message);
        }

        const checkoutUrl = data?.data.attributes.url;

        if (!checkoutUrl) {
            throw new Error('Failed to create checkout session');
        }

        // Redirect to Lemon Squeezy checkout
        redirect(checkoutUrl);
    } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
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

        const { data: subscription } = await supabase
            .from('profiles')
            .select('subscription_management_url')
            .eq('id', user.id)
            .single();

        if (subscription?.subscription_management_url) {
            redirect(subscription.subscription_management_url);
        } else {
            // Fallback
            redirect('https://app.lemonsqueezy.com/my-orders');
        }
    } catch (error) {
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error;
        console.error('Billing portal error:', error);
        throw error;
    }
}
