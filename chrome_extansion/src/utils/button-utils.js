export function setButtonLoading(button, isLoading = true) {
  if (!button) return;

  if (isLoading) {
    // 버튼 비활성화
    button.disabled = true;
    button.style.cursor = 'not-allowed';
    button.style.opacity = '0.7';

    // 기존 텍스트 저장
    button.dataset.originalText = button.textContent;

    // 스피너 생성 및 표시
    const spinner = createSpinner();
    button.innerHTML = '';
    button.appendChild(spinner);
    button.appendChild(document.createTextNode(''));

  } else {
    // 버튼 활성화
    button.disabled = false;
    button.style.cursor = 'pointer';
    button.style.opacity = '1';

    // 원래 텍스트 복원
    const originalText = button.dataset.originalText || 'Fill';
    button.textContent = originalText;
  }
}

function createSpinner() {
  const spinner = document.createElement('span');
  spinner.className = 'tagstock-spinner';

  // 인라인 스타일로 스피너 구현
  spinner.style.cssText = `
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #f3f3f3;
    border-top: 2px solid #333;
    border-radius: 50%;
    animation: tagstock-spin 1s linear infinite;
    margin-right: 6px;
  `;

  // CSS 애니메이션 키프레임 추가 (한 번만)
  if (!document.querySelector('#tagstock-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'tagstock-spinner-style';
    style.textContent = `
      @keyframes tagstock-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  return spinner;
}

export function showButtonError(button, errorMessage = 'Error occurred', duration = 3000) {
  if (!button) return;

  // 기존 상태 저장
  const originalStyle = button.style.cssText;

  // 에러 상태 표시
  button.textContent = errorMessage;
  button.style.cssText = originalStyle + `
    background-color: #ff4444;
    color: white;
    cursor: not-allowed;
  `;
  button.disabled = true;

  // 일정 시간 후 원상복구
  setTimeout(() => {
    setButtonLoading(button, false);
    button.style.cssText = originalStyle;
  }, duration);
}
