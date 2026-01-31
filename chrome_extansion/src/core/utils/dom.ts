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
