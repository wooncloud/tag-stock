import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

const apiKey = process.env.LEMON_SQUEEZY_API || '';

lemonSqueezySetup({
    apiKey,
});

/**
 * Lemon Squeezy configuration
 */
export const LS_CONFIG = {
    storeId: process.env.LEMON_SQUEEZY_STORE_ID,
    variants: {
        pro_monthly: process.env.LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID,
        pro_yearly: process.env.LEMON_SQUEEZY_PRO_YEARLY_VARIANT_ID,
        max_monthly: process.env.LEMON_SQUEEZY_MAX_MONTHLY_VARIANT_ID,
        max_yearly: process.env.LEMON_SQUEEZY_MAX_YEARLY_VARIANT_ID,
    },
    webhookSecret: process.env.LEMON_SQUEEZY_WEBHOOK_SECRET,
};
