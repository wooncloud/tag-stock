import { ADOBE_STOCK_PROMPT } from './adobe';
import { SHUTTERSTOCK_PROMPT } from './shutterstock';

export type SiteType = 'adobe' | 'shutterstock';

export function getPromptForSite(siteType: SiteType): string {
  switch (siteType) {
    case 'adobe':
      return ADOBE_STOCK_PROMPT;
    case 'shutterstock':
      return SHUTTERSTOCK_PROMPT;
  }
}
