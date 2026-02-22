const OVERLAY_ID = 'tagstock-batch-overlay';

let cancelCallback: (() => void) | null = null;

function createOverlayHTML(total: number): string {
  return `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      background: white;
      border-radius: 16px;
      padding: 40px 48px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.25);
      max-width: 420px;
      width: 90%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-size: 40px; line-height: 1;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
          <path d="M20 3v4"/>
          <path d="M22 5h-4"/>
        </svg>
      </div>

      <div style="text-align: center;">
        <div style="font-size: 20px; font-weight: 700; color: #1e1e2e;">
          Processing Metadata
        </div>
        <div id="tagstock-overlay-subtitle" style="font-size: 14px; color: #6b7280; margin-top: 4px;">
          Preparing...
        </div>
      </div>

      <div style="width: 100%;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span id="tagstock-overlay-progress-text" style="font-size: 13px; color: #4b5563;">
            0 / ${total}
          </span>
          <span id="tagstock-overlay-percent" style="font-size: 13px; font-weight: 600; color: #6366f1;">
            0%
          </span>
        </div>
        <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 999px; overflow: hidden;">
          <div id="tagstock-overlay-bar" style="
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
            border-radius: 999px;
            transition: width 0.3s ease;
          "></div>
        </div>
      </div>

      <div id="tagstock-overlay-title" style="
        font-size: 13px;
        color: #9ca3af;
        font-style: italic;
        min-height: 20px;
        text-align: center;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      "></div>

      <div style="
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: #fef3c7;
        border-radius: 8px;
        font-size: 13px;
        color: #92400e;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
          <path d="M12 9v4"/>
          <path d="M12 17h.01"/>
        </svg>
        Please do not interact with the page
      </div>

      <button id="tagstock-overlay-cancel" style="
        padding: 10px 32px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #374151;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
      " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='white'">
        Cancel
      </button>
    </div>
  `;
}

/**
 * 오버레이를 페이지에 표시합니다.
 */
export function showOverlay(total: number): void {
  hideOverlay();

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    backdrop-filter: blur(2px);
  `;
  overlay.innerHTML = createOverlayHTML(total);

  const cancelBtn = overlay.querySelector('#tagstock-overlay-cancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (cancelCallback) cancelCallback();
    });
  }

  document.body.appendChild(overlay);
}

/**
 * 오버레이 진행 상황을 업데이트합니다.
 */
export function updateOverlay(current: number, total: number, title?: string): void {
  const overlay = document.getElementById(OVERLAY_ID);
  if (!overlay) return;

  const percent = Math.round((current / total) * 100);

  const bar = overlay.querySelector<HTMLElement>('#tagstock-overlay-bar');
  if (bar) bar.style.width = `${percent}%`;

  const progressText = overlay.querySelector('#tagstock-overlay-progress-text');
  if (progressText) progressText.textContent = `${current} / ${total}`;

  const percentText = overlay.querySelector('#tagstock-overlay-percent');
  if (percentText) percentText.textContent = `${percent}%`;

  const subtitle = overlay.querySelector('#tagstock-overlay-subtitle');
  if (subtitle) subtitle.textContent = `Processing image ${current} of ${total}...`;

  const titleEl = overlay.querySelector('#tagstock-overlay-title');
  if (titleEl) titleEl.textContent = title ? `"${title}"` : '';
}

/**
 * 오버레이를 제거합니다.
 */
export function hideOverlay(): void {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.remove();
  cancelCallback = null;
}

/**
 * 취소 버튼 클릭 콜백을 등록합니다.
 */
export function onCancelClick(callback: () => void): void {
  cancelCallback = callback;
}
