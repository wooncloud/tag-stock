// TagStock Content Script
// DOM 조작만 담당, UI는 Side Panel에서 처리

import { generateAIMetadata } from './aiServices/ai-metadata.js';
import { setTextareaValue } from './utils/dom-utils.js';
import { detectStockSite, getSiteConfig, isUploadPage } from './utils/site-detector.js';

/**
 * Side Panel에 로그 메시지 전송
 */
function sendLog(text, level = 'info') {
  try {
    chrome.runtime.sendMessage({ type: 'log', text, level });
  } catch (e) {
    // Side panel이 열려있지 않으면 무시
  }
}

/**
 * 사이트별 메타데이터 후처리
 */
function processMetadataForSite(aiResult, siteType) {
  const config = getSiteConfig(siteType);

  let keywords = '';

  if (Array.isArray(aiResult.keyword)) {
    keywords = aiResult.keyword.join(config.keywordSeparator);
  } else if (typeof aiResult.keyword === 'string') {
    keywords = aiResult.keyword;
  } else if (typeof aiResult.keywords === 'string') {
    keywords = aiResult.keywords;
  }

  return {
    title: aiResult.title || '',
    keywords: keywords
  };
}

/**
 * Shutterstock 키워드 입력 후 Enter 처리
 */
async function handleShutterstockKeywordInput(keywordElement) {
  try {
    keywordElement.focus();
    await new Promise(resolve => setTimeout(resolve, 100));

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

/**
 * 메타데이터 생성 및 폼 채우기
 */
async function fillMetadata(siteType) {
  const config = getSiteConfig(siteType);

  if (!config) {
    throw new Error(`Unsupported site: ${siteType}`);
  }

  const titleElement = document.querySelector(config.selectors.titleField);
  const keywordElement = document.querySelector(config.selectors.keywordField);
  const saveButton = document.querySelector(config.selectors.saveButton);

  if (!titleElement || !keywordElement) {
    throw new Error(`Form fields not found for ${config.name}`);
  }

  sendLog(`${config.name} AI metadata generation started...`);

  const aiResult = await generateAIMetadata();
  const processedResult = processMetadataForSite(aiResult, siteType);

  setTextareaValue(titleElement, processedResult.title);
  setTextareaValue(keywordElement, processedResult.keywords);

  // Shutterstock: 키워드 입력 후 Enter 처리
  if (siteType === 'shutterstock') {
    await handleShutterstockKeywordInput(keywordElement);
  }

  // 자동 저장
  if (saveButton) {
    setTimeout(() => {
      saveButton.click();
      sendLog('Changes saved', 'success');
    }, 500);
  }

  return {
    title: processedResult.title,
    keywords: processedResult.keywords
  };
}

/**
 * Side Panel에서 오는 메시지 처리
 */
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'generateMetadata') {
    const siteType = message.siteType || detectStockSite();

    fillMetadata(siteType)
      .then((result) => {
        sendResponse({
          success: true,
          title: result.title,
          keywords: result.keywords
        });
      })
      .catch((error) => {
        console.error('Metadata generation failed:', error);
        sendLog(`Error: ${error.message}`, 'error');
        sendResponse({
          success: false,
          error: error.message
        });
      });

    // 비동기 응답을 위해 true 반환
    return true;
  }

  if (message.action === 'checkStatus') {
    const siteType = detectStockSite();
    const config = getSiteConfig(siteType);
    sendResponse({
      connected: siteType !== 'unknown',
      siteType: siteType,
      siteName: config?.name || 'Unknown'
    });
    return true;
  }
});

/**
 * 키보드 단축키 처리
 */
document.addEventListener('keydown', function(event) {
  // Cmd+E (Mac) 또는 Ctrl+E (Windows/Linux)
  if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
    event.preventDefault();

    const siteType = detectStockSite();
    if (siteType === 'unknown') {
      sendLog('Unsupported site', 'error');
      return;
    }

    if (!isUploadPage(siteType)) {
      sendLog('Not on upload page', 'error');
      return;
    }

    fillMetadata(siteType)
      .then((result) => {
        sendLog(`Filled: ${result.title}`, 'success');
      })
      .catch((error) => {
        sendLog(`Error: ${error.message}`, 'error');
      });
  }
});

/**
 * 초기화
 */
function init() {
  const siteType = detectStockSite();

  if (siteType === 'unknown') {
    return;
  }

  if (!isUploadPage(siteType)) {
    return;
  }

  console.log(`TagStock content script initialized on ${siteType}`);

  // Side Panel에 상태 알림
  try {
    chrome.runtime.sendMessage({
      type: 'status',
      connected: true,
      site: getSiteConfig(siteType)?.name || siteType,
      info: 'Upload page ready'
    });
  } catch (e) {
    // Side panel이 열려있지 않으면 무시
  }
}

// DOM이 준비되면 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
