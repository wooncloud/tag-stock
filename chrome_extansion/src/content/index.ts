import { detectStockSite, getSiteConfig, isUploadPage } from '../core/sites/detector';
import { sendStatus } from '../shared/messenger';
import { setupKeyboardHandler } from './keyboard-handler';
import { setupMessageHandler } from './message-handler';

// 메시지 핸들러는 즉시 설정 (DOM 준비 여부와 무관하게 통신 가능해야 함)
setupMessageHandler();

/**
 * 콘텐츠 스크립트 초기화 (DOM 준비 후 실행)
 */
function init(): void {
  setupKeyboardHandler();

  const siteType = detectStockSite();

  if (siteType === 'unknown') {
    console.log('TagStock: Content script loaded on non-stock site.');
    return;
  }

  if (!isUploadPage(siteType)) {
    console.log('TagStock: On supported site, but not on upload page.');
    return;
  }

  console.log(`TagStock content script initialized on ${siteType}`);

  // 사이드패널에 상태 전송
  const config = getSiteConfig(siteType);
  sendStatus(true, config?.name || siteType, 'Upload page ready');
}

// DOM이 준비되었을 때 초기화 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
