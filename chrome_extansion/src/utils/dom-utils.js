export function setInputValue(element, value) {
  if (!element) {
    console.warn('Element not found.');
    return;
  }

  // 값 설정
  element.value = value;

  // 포커스 이벤트 발생
  element.focus();

  // input 이벤트 발생 (실시간 변경 감지)
  element.dispatchEvent(new Event('input', { bubbles: true }));

  // change 이벤트 발생 (값 변경 완료)
  element.dispatchEvent(new Event('change', { bubbles: true }));

  // React의 경우를 위한 추가 이벤트들
  element.dispatchEvent(new Event('keyup', { bubbles: true }));
  element.dispatchEvent(new Event('keydown', { bubbles: true }));

  // 포커스 해제
  element.blur();

  console.debug(`Value set complete: "${value}"`);
}

export function setTextareaValue(element, value) {
  if (!element) {
    console.warn('Textarea element not found.');
    return;
  }

  // textarea 특화 처리
  element.focus();
  element.select(); // 기존 텍스트 선택

  // 값 설정
  element.value = value;

  // 다양한 이벤트 발생
  const events = ['input', 'change', 'keyup', 'paste'];
  events.forEach(eventType => {
    element.dispatchEvent(new Event(eventType, {
      bubbles: true,
      cancelable: true
    }));
  });

  // 포커스 해제
  element.blur();

  console.debug(`Textarea value set complete: "${value}"`);
}
