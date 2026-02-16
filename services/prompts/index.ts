import { ADOBE_STOCK_PROMPT } from './adobe';
import { LOCAL_PROMPT } from './local';
import { SHUTTERSTOCK_PROMPT } from './shutterstock';

export type SiteType = 'adobe' | 'shutterstock' | 'local';

export function getPromptForSite(siteType: SiteType): string {
  switch (siteType) {
    case 'adobe':
      return ADOBE_STOCK_PROMPT;
    case 'shutterstock':
      return SHUTTERSTOCK_PROMPT;
    case 'local':
      return LOCAL_PROMPT;
  }
}
