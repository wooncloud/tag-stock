import { generateAIMetadata } from './aiServices/ai-metadata.js';
import { setTextareaValue } from './utils/dom-utils.js';
import { setButtonLoading, showButtonError } from './utils/button-utils.js';
import { getSiteConfig } from './utils/site-detector.js';

/**
 * 사이트별 버튼 클릭 이벤트 처리
 * @param {Event} event - 클릭 이벤트
 * @param {string} siteType - 사이트 타입 ('adobe' 또는 'shutterstock')
 */
window.handleButtonClick = async function(event, siteType) {
  const button = event.target;
  const config = getSiteConfig(siteType);
  
  if (!config) {
    console.error(`지원되지 않는 사이트: ${siteType}`);
    return;
  }
  
  const titleElement = document.querySelector(config.selectors.titleField);
  const keywordElement = document.querySelector(config.selectors.keywordField);
  const saveButton = document.querySelector(config.selectors.saveButton);
  
  // 필수 요소 확인
  if (!titleElement || !keywordElement) {
    console.error(`${config.name} 폼 필드를 찾을 수 없습니다`, {
      titleField: config.selectors.titleField,
      keywordField: config.selectors.keywordField,
      titleElement: !!titleElement,
      keywordElement: !!keywordElement
    });
    showButtonError(button, '폼 필드 없음');
    return;
  }
  
  // 로딩 상태 시작
  setButtonLoading(button, true);
  
  try {
    console.log(`${config.name} AI 메타데이터 생성 시작...`);
    const aiResult = await generateAIMetadata();
    
    // 사이트별 데이터 처리
    const processedResult = processMetadataForSite(aiResult, siteType);
    
    setTextareaValue(titleElement, processedResult.title);
    setTextareaValue(keywordElement, processedResult.keywords);
    
    // 성공 시 잠깐 완료 표시
    button.textContent = '완료!';
    setTimeout(async () => {
      setButtonLoading(button, false);

      // Shutterstock 전용: 키워드 입력 후 포커스 + Enter 처리
      if (siteType === 'shutterstock') {
        await handleShutterstockKeywordInput(keywordElement);
      }
      
      // 자동 저장 (저장 버튼이 있는 경우)
      if (saveButton) {
        saveButton.click();
      }
    }, 500);
    
  } catch (error) {
    console.error(`${config.name} 버튼 클릭 처리 실패:`, error);
    showButtonError(button, '오류 발생');
  }
};

/**
 * Shutterstock 키워드 입력 후 처리 (포커스 + Enter)
 * @param {HTMLElement} keywordElement - 키워드 입력 요소
 */
async function handleShutterstockKeywordInput(keywordElement) {
  try {
    console.log('🎯 Shutterstock 키워드 입력 완료 처리 중...');
    
    // 포커스 주기
    keywordElement.focus();
    
    // 잠시 대기 (포커스가 완전히 적용될 때까지)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Enter 키 이벤트 생성 및 전송
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    
    keywordElement.dispatchEvent(enterEvent);
    
    // keyup 이벤트도 함께 전송 (일부 사이트에서 필요)
    const enterUpEvent = new KeyboardEvent('keyup', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true,
      cancelable: true
    });
    
    keywordElement.dispatchEvent(enterUpEvent);
    
    console.log('✅ Shutterstock 키워드 Enter 처리 완료');
    
  } catch (error) {
    console.error('❌ Shutterstock 키워드 Enter 처리 실패:', error);
  }
}

/**
 * 사이트별 메타데이터 후처리
 * @param {object} aiResult - AI 생성 결과
 * @param {string} siteType - 사이트 타입
 * @returns {object} 처리된 메타데이터
 */
function processMetadataForSite(aiResult, siteType) {
  const config = getSiteConfig(siteType);
  
  let keywords = '';
  
  // 키워드 형식 처리
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
 * 사이트별 버튼 생성
 * @param {Element} targetElement - 버튼을 삽입할 대상 요소
 * @param {string} siteType - 사이트 타입 ('adobe' 또는 'shutterstock')
 */
window.createButton = function(targetElement, siteType) {
  const config = getSiteConfig(siteType);
  
  if (!config) {
    console.error(`지원되지 않는 사이트: ${siteType}`);
    return;
  }
  
  const button = document.createElement('button');
  button.textContent = '채우기';
  button.id = config.selectors.buttonId;
  
  // 사이트별 스타일 적용
  const buttonStyle = getButtonStyleForSite(siteType);
  button.style.cssText = buttonStyle;
  
  // 사이트 타입을 포함한 클릭 이벤트 리스너
  button.addEventListener('click', (event) => {
    window.handleButtonClick(event, siteType);
  });
  
  targetElement.parentNode.insertBefore(button, targetElement);
  
  console.log(`${config.name} 버튼 생성 완료:`, button.id);
};

/**
 * 사이트별 버튼 스타일 반환
 * @param {string} siteType - 사이트 타입
 * @returns {string} CSS 스타일 문자열
 */
function getButtonStyleForSite(siteType) {
  const baseStyle = `
    margin-right: 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    padding: 6px 12px;
    transition: all 0.3s ease;
    font-weight: 500;
  `;
  
  switch (siteType) {
  case 'adobe':
    return baseStyle + `
      background: #fff;
      color: #000;
      border: 1px solid #000;
    `;
  case 'shutterstock':
    return baseStyle + `
      background: #ee3322;
      color: white;
      border: 1px solid #ee3322;
    `;
  default:
    return baseStyle + `
      background: #007bff;
      color: white;
      border: 1px solid #007bff;
    `;
  }
}

// 키보드 단축키 이벤트 리스너 (사이트별 처리)
document.addEventListener('keydown', function(event) {
  // Command+A (Mac) 또는 Ctrl+A (Windows/Linux) 감지
  if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
    // 현재 활성화된 버튼 찾기
    const adobeButton = document.getElementById('adobe-stock-tool-button');
    const shutterstockButton = document.getElementById('shutterstock-tool-button');
    
    let activeButton = null;
    let siteType = null;
    
    if (adobeButton && !adobeButton.disabled) {
      activeButton = adobeButton;
      siteType = 'adobe';
    } else if (shutterstockButton && !shutterstockButton.disabled) {
      activeButton = shutterstockButton;
      siteType = 'shutterstock';
    }
    
    if (activeButton && siteType) {
      event.preventDefault(); // 기본 전체 선택 동작 방지
      
      // 버튼 클릭 이벤트 시뮬레이션
      const mockEvent = { target: activeButton };
      window.handleButtonClick(mockEvent, siteType);
    }
  }
}); 