import { TIMEOUTS } from '../../../shared/constants';

/**
 * Handle Shutterstock-specific keyword input with Enter key processing
 */
export async function handleShutterstockKeywordInput(keywordElement: HTMLInputElement): Promise<void> {
    try {
        keywordElement.focus();
        await new Promise(resolve => setTimeout(resolve, TIMEOUTS.KEYBOARD_EVENT_DELAY));

        const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        keywordElement.dispatchEvent(enterEvent);

        const enterUpEvent = new KeyboardEvent('keyup', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true
        });
        keywordElement.dispatchEvent(enterUpEvent);

    } catch (error) {
        console.error('Shutterstock keyword Enter processing failed:', error);
    }
}
