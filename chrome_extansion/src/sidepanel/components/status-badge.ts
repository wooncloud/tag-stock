import type { SiteType } from '../../shared/types';

const statusBadge = document.getElementById('statusBadge') as HTMLSpanElement;
const statusText = document.getElementById('statusText') as HTMLParagraphElement;
const fillBtn = document.getElementById('fillBtn') as HTMLButtonElement;

let currentSiteType: SiteType | null = null;

/**
 * Update the connection status badge
 */
export function updateStatus(connected: boolean, site: string, info: string = ''): void {
    if (connected) {
        statusBadge.className = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-600';
        statusBadge.textContent = site;
        statusText.textContent = info || 'Ready to fill metadata';
        fillBtn.disabled = false;
        currentSiteType = site.toLowerCase().includes('adobe') ? 'adobe' : 'shutterstock';
    } else {
        statusBadge.className = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground';
        statusBadge.textContent = 'Not Connected';
        statusText.textContent = info || 'Navigate to Adobe Stock or Shutterstock upload page';
        fillBtn.disabled = true;
        currentSiteType = null;
    }
}

/**
 * Get current site type
 */
export function getCurrentSiteType(): SiteType | null {
    return currentSiteType;
}
