import { TIMEOUTS } from '../../shared/constants';

const btnIcon = document.getElementById('btnIcon') as HTMLElement;
const btnText = document.getElementById('btnText') as HTMLSpanElement;
const btnSpinner = document.getElementById('btnSpinner') as HTMLElement;
const fillBtn = document.getElementById('fillBtn') as HTMLButtonElement;

/**
 * Set button to loading state
 */
export function setButtonLoading(loading: boolean): void {
    if (loading) {
        btnIcon.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        btnText.textContent = 'Generating...';
        fillBtn.disabled = true;
    } else {
        btnIcon.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
        btnText.textContent = 'Fill Metadata';
        fillBtn.disabled = false;
    }
}

/**
 * Set button to success state
 */
export function setButtonSuccess(): void {
    btnIcon.classList.remove('hidden');
    btnSpinner.classList.add('hidden');
    btnText.textContent = 'Done!';
    fillBtn.className = fillBtn.className.replace('bg-primary', 'bg-green-600');

    setTimeout(() => {
        btnText.textContent = 'Fill Metadata';
        fillBtn.className = fillBtn.className.replace('bg-green-600', 'bg-primary');
    }, TIMEOUTS.BUTTON_FEEDBACK);
}

/**
 * Set button to error state
 */
export function setButtonError(): void {
    btnIcon.classList.remove('hidden');
    btnSpinner.classList.add('hidden');
    btnText.textContent = 'Error';
    fillBtn.className = fillBtn.className.replace('bg-primary', 'bg-red-600');
    fillBtn.disabled = false;

    setTimeout(() => {
        btnText.textContent = 'Fill Metadata';
        fillBtn.className = fillBtn.className.replace('bg-red-600', 'bg-primary');
    }, TIMEOUTS.BUTTON_FEEDBACK);
}
