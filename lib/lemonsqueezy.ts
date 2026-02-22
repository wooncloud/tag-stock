import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';

const apiKey = process.env.LEMON_SQUEEZY_API || '';

lemonSqueezySetup({
  apiKey,
});
