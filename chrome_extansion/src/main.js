import './button-handler.js';
import { detectStockSite, getSiteConfig, isUploadPage } from './utils/site-detector.js';

async function waitForElement(selector) {
  console.log(`⏳ 요소 대기 중: ${selector}`);
  
  const existingElement = document.querySelector(selector);
  if (existingElement) {
    console.log(`✅ 요소 즉시 발견: ${selector}`);
    return existingElement;
  }
  
  const targetNode = document.body || document.documentElement;
  if (!targetNode) {
    console.warn('⚠️ DOM 루트 노드가 없음, 100ms 대기 후 재시도');
    await new Promise(resolve => setTimeout(resolve, 100));
    return waitForElement(selector);
  }
  
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        console.log(`✅ 요소 발견됨 (MutationObserver): ${selector}`);
        observer.disconnect();
        resolve(element);
      }
    });
    
    observer.observe(targetNode, {
      childList: true,
      subtree: true
    });
    
    // 10초 타임아웃 추가
    setTimeout(() => {
      console.error(`❌ 요소 대기 타임아웃: ${selector}`);
      observer.disconnect();
      resolve(null);
    }, 10000);
  });
}

/**
 * Adobe Stock 사이트 초기화
 */
async function initAdobeStock() {
  console.log('🎨 Adobe Stock 초기화 시작');
  const config = getSiteConfig('adobe');
  
  const sidePanelElement = await waitForElement(config.selectors.sidePanel);
  if (!sidePanelElement) {
    console.error('❌ Adobe Stock 사이드패널을 찾을 수 없음');
    return;
  }
  
  const checkboxElement = sidePanelElement.querySelector(config.selectors.checkbox);
  
  if (checkboxElement) {
    console.log('✅ Adobe Stock 체크박스 요소 발견');
    setTimeout(() => {
      const stillExists = document.querySelector(config.selectors.checkbox);
      if (stillExists && !document.getElementById(config.selectors.buttonId)) {
        console.log('🔲 Adobe Stock 버튼 생성 중...');
        window.createButton(stillExists, 'adobe');
      }
    }, 1000);
  } else {
    console.error('❌ Adobe Stock 체크박스를 찾을 수 없음');
  }
}

/**
 * Shutterstock 사이트 초기화
 */
async function initShutterstock() {
  console.log('📷 Shutterstock 초기화 시작');
  const config = getSiteConfig('shutterstock');
  
  console.log('Shutterstock 설정:', config);
  
  try {
    // Shutterstock은 sidePanel 대기하지 않고 삭제 버튼을 직접 찾음
    const deleteButton = await waitForElement(config.selectors.checkbox);
    
    if (deleteButton) {
      console.log('✅ Shutterstock 삭제 버튼 발견');
      setTimeout(() => {
        const stillExists = document.querySelector(config.selectors.checkbox);
        if (stillExists && !document.getElementById(config.selectors.buttonId)) {
          console.log('🔲 Shutterstock 채우기 버튼 생성 중...');
          window.createButton(stillExists, 'shutterstock');
        } else if (!stillExists) {
          console.warn('⚠️ Shutterstock 삭제 버튼이 사라짐');
        } else {
          console.log('ℹ️ Shutterstock 버튼이 이미 존재함');
        }
      }, 1000);
    } else {
      console.error('❌ Shutterstock 삭제 버튼을 찾을 수 없음');
    }
  } catch (error) {
    console.error('❌ Shutterstock 초기화 실패:', error);
  }
}

/**
 * 사이트별 초기화 실행
 */
async function init() {
  console.log('🚀 확장 프로그램 초기화 시작');
  
  const siteType = detectStockSite();
  console.log(`🔍 감지된 사이트: ${siteType}`);
  
  if (siteType === 'unknown') {
    console.warn('⚠️ 지원되지 않는 사이트입니다.');
    return;
  }
  
  if (!isUploadPage(siteType)) {
    console.log('ℹ️ 업로드 페이지가 아닙니다.');
    return;
  }
  
  console.log(`✅ ${siteType} 업로드 페이지에서 초기화 진행`);
  
  switch (siteType) {
  case 'adobe':
    await initAdobeStock();
    break;
  case 'shutterstock':
    await initShutterstock();
    break;
  default:
    console.warn(`⚠️ 지원되지 않는 사이트: ${siteType}`);
  }
}

init(); 