import type { UserProfile } from '../../shared/types';
import { getTotalCredits } from '../../lib/supabase/auth';

/**
 * Initialize and render the credit display
 */
export function initCreditDisplay(profile: UserProfile): void {
    const totalCredits = getTotalCredits(profile);

    // Update total credits display
    const creditDisplay = document.getElementById('creditDisplay');
    if (creditDisplay) {
        creditDisplay.textContent = totalCredits.toString();
    }

}

/**
 * Update credit display with new values
 */
export function updateCreditDisplay(profile: UserProfile): void {
    initCreditDisplay(profile);
}


/**
 * Show low credit warning
 */
export function showLowCreditWarning(credits: number): void {
    if (credits <= 5 && credits > 0) {
        const warning = document.getElementById('lowCreditWarning');
        if (warning) {
            warning.classList.remove('hidden');
            warning.textContent = `⚠️ Only ${credits} credits remaining`;
        }
    }
}

/**
 * Hide low credit warning
 */
export function hideLowCreditWarning(): void {
    const warning = document.getElementById('lowCreditWarning');
    if (warning) {
        warning.classList.add('hidden');
    }
}
