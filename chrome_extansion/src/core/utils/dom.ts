/**
 * 지정된 시간 동안 대기합니다.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * DOM에 엘리먼트가 나타날 때까지 대기합니다.
 */
export function waitForElement(selector: string, timeout = 5000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(selector);
    if (existing) {
      resolve(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for ${selector}`));
    }, timeout);
  });
}

/**
 * input 엘리먼트의 값을 설정하고 필요한 이벤트를 트리거합니다.
 */
export function setInputValue(element: HTMLInputElement, value: string): void {
  if (!element) {
    console.warn('Element not found.');
    return;
  }

  // 값 설정
  element.value = value;

  // 포커스 이벤트 트리거
  element.focus();

  // input 이벤트 트리거 (실시간 변경 감지)
  element.dispatchEvent(new Event('input', { bubbles: true }));

  // change 이벤트 트리거 (값 변경 완료)
  element.dispatchEvent(new Event('change', { bubbles: true }));

  // React를 위한 추가 이벤트
  element.dispatchEvent(new Event('keyup', { bubbles: true }));
  element.dispatchEvent(new Event('keydown', { bubbles: true }));

  // 블러(포커스 해제)
  element.blur();

  console.debug(`Value set complete: "${value}"`);
}

/**
 * textarea 엘리먼트의 값을 설정하고 필요한 이벤트를 트리거합니다.
 */
export function setTextareaValue(element: HTMLTextAreaElement, value: string): void {
  if (!element) {
    console.warn('Textarea element not found.');
    return;
  }

  // textarea 전용 처리
  element.focus();
  element.select(); // 기존 텍스트 선택

  // 값 설정
  element.value = value;

  // 다양한 이벤트 트리거
  const events = ['input', 'change', 'keyup', 'paste'];
  events.forEach((eventType) => {
    element.dispatchEvent(
      new Event(eventType, {
        bubbles: true,
        cancelable: true,
      })
    );
  });

  // 블러(포커스 해제)
  element.blur();

  console.debug(`Textarea value set complete: "${value}"`);
}
