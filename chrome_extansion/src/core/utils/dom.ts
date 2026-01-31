/**
 * Set the value of an input element and trigger necessary events
 */
export function setInputValue(element: HTMLInputElement, value: string): void {
    if (!element) {
        console.warn('Element not found.');
        return;
    }

    // Set value
    element.value = value;

    // Trigger focus event
    element.focus();

    // Trigger input event (real-time change detection)
    element.dispatchEvent(new Event('input', { bubbles: true }));

    // Trigger change event (value change completion)
    element.dispatchEvent(new Event('change', { bubbles: true }));

    // Additional events for React
    element.dispatchEvent(new Event('keyup', { bubbles: true }));
    element.dispatchEvent(new Event('keydown', { bubbles: true }));

    // Blur
    element.blur();

    console.debug(`Value set complete: "${value}"`);
}

/**
 * Set the value of a textarea element and trigger necessary events
 */
export function setTextareaValue(element: HTMLTextAreaElement, value: string): void {
    if (!element) {
        console.warn('Textarea element not found.');
        return;
    }

    // Textarea-specific handling
    element.focus();
    element.select(); // Select existing text

    // Set value
    element.value = value;

    // Trigger various events
    const events = ['input', 'change', 'keyup', 'paste'];
    events.forEach(eventType => {
        element.dispatchEvent(new Event(eventType, {
            bubbles: true,
            cancelable: true
        }));
    });

    // Blur
    element.blur();

    console.debug(`Textarea value set complete: "${value}"`);
}
