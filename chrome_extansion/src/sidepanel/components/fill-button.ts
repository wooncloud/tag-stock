import { TIMEOUTS } from '../../shared/constants';

interface ButtonElements {
  button: HTMLButtonElement;
  icon: HTMLElement;
  spinner: HTMLElement;
  text: HTMLSpanElement;
}

/**
 * 버튼을 로딩/성공/에러 상태로 전환하는 공통 유틸리티
 */
export function createButtonState(
  elements: ButtonElements,
  defaultText: string,
  defaultClass: string,
  successClass: string,
  errorClass: string
) {
  function setLoading(loading: boolean): void {
    if (loading) {
      elements.icon.classList.add('hidden');
      elements.spinner.classList.remove('hidden');
      elements.text.textContent = 'Processing...';
      elements.button.disabled = true;
    } else {
      elements.icon.classList.remove('hidden');
      elements.spinner.classList.add('hidden');
      elements.text.textContent = defaultText;
      elements.button.disabled = false;
    }
  }

  function setSuccess(): void {
    elements.icon.classList.remove('hidden');
    elements.spinner.classList.add('hidden');
    elements.text.textContent = 'Done!';
    elements.button.className = elements.button.className.replace(defaultClass, successClass);

    setTimeout(() => {
      elements.text.textContent = defaultText;
      elements.button.className = elements.button.className.replace(successClass, defaultClass);
    }, TIMEOUTS.BUTTON_FEEDBACK);
  }

  function setError(): void {
    elements.icon.classList.remove('hidden');
    elements.spinner.classList.add('hidden');
    elements.text.textContent = 'Error';
    elements.button.className = elements.button.className.replace(defaultClass, errorClass);
    elements.button.disabled = false;

    setTimeout(() => {
      elements.text.textContent = defaultText;
      elements.button.className = elements.button.className.replace(errorClass, defaultClass);
    }, TIMEOUTS.BUTTON_FEEDBACK);
  }

  return { setLoading, setSuccess, setError };
}

// Fill Metadata 버튼
const fillState = createButtonState(
  {
    button: document.getElementById('fillBtn') as HTMLButtonElement,
    icon: document.getElementById('btnIcon') as HTMLElement,
    spinner: document.getElementById('btnSpinner') as HTMLElement,
    text: document.getElementById('btnText') as HTMLSpanElement,
  },
  'Fill Metadata',
  'bg-primary',
  'bg-green-600',
  'bg-red-600'
);

export const setButtonLoading = fillState.setLoading;
export const setButtonSuccess = fillState.setSuccess;
export const setButtonError = fillState.setError;
