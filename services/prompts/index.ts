import { ADOBE_STOCK_PROMPT } from './adobe';
import { LOCAL_PROMPT, LOCAL_PROMPT_FREE } from './local';
import { SHUTTERSTOCK_PROMPT } from './shutterstock';

export type SiteType = 'adobe' | 'shutterstock' | 'local';
export type PlanTier = 'free' | 'pro' | 'max';

export function getPromptForSite(siteType: SiteType, plan: PlanTier = 'free'): string {
  switch (siteType) {
    case 'adobe':
      return ADOBE_STOCK_PROMPT;
    case 'shutterstock':
      return SHUTTERSTOCK_PROMPT;
    case 'local':
      return plan === 'free' ? LOCAL_PROMPT_FREE : LOCAL_PROMPT;
  }
}
