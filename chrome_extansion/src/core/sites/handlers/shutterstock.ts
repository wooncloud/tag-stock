import { TIMEOUTS } from '../../../shared/constants';

/**
 * 엔터 키 처리를 포함한 셔터스톡 전용 키워드 입력 핸들러
 */
export async function handleShutterstockKeywordInput(
  keywordElement: HTMLInputElement
): Promise<void> {
  try {
    keywordElement.focus();
    await new Promise((resolve) => setTimeout(resolve, TIMEOUTS.KEYBOARD_EVENT_DELAY));

    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    });
    keywordElement.dispatchEvent(enterEvent);

    const enterUpEvent = new KeyboardEvent('keyup', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true,
    });
    keywordElement.dispatchEvent(enterUpEvent);
  } catch (error) {
    console.error('Shutterstock keyword Enter processing failed:', error);
  }
}
