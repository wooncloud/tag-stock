/**
 * 현재 페이지의 URL을 기반으로 스톡 사이트를 감지합니다.
 * @returns {string} 'adobe', 'shutterstock', 또는 'unknown'
 */
export function detectStockSite() {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const fullUrl = window.location.href;

  console.log('🔍 Detecting site...', {
    hostname,
    pathname,
    fullUrl
  });

  if (hostname.includes('adobe.com') || hostname.includes('stock.adobe.com')) {
    console.log('✅ Adobe Stock site detected');
    return 'adobe';
  }

  if (hostname.includes('shutterstock.com')) {
    console.log('✅ Shutterstock site detected');
    return 'shutterstock';
  }

  console.warn('❌ Unknown site:', hostname);
  return 'unknown';
}

/**
 * 사이트별 설정 정보를 반환합니다.
 * @param {string} siteType - 'adobe' 또는 'shutterstock'
 * @returns {object} 사이트 설정 객체
 */
export function getSiteConfig(siteType) {
  const configs = {
    adobe: {
      name: 'Adobe Stock',
      supportsBilingual: true,
      maxTitleLength: 200,
      keywordSeparator: ', ',
      urlPatterns: ['/uploads'],
      selectors: {
        // main.js에서 사용하는 셀렉터들
        sidePanel: '.content-side-panel-wrapper--uploads',
        checkbox: 'div[data-t="asset-sidebar-submission-checkbox"]',
        // button-handler.js에서 사용하는 셀렉터들
        titleField: 'textarea[data-t="asset-title-content-tagger"]',
        keywordField: '#content-keywords-ui-textarea',
        saveButton: 'button[data-t="save-work"]',
        buttonId: 'adobe-stock-tool-button'
      }
    },
    shutterstock: {
      name: 'Shutterstock',
      supportsBilingual: false,
      maxTitleLength: 200,
      keywordSeparator: ', ',
      urlPatterns: ['/portfolio/not_submitted/photo'],
      selectors: {
        // Shutterstock은 sidePanel 대기하지 않음 - imageElement 직접 사용
        imageElement: 'div.css-rq1v45[data-testid="asset-card"] img',
        checkbox: 'button[data-testid="content_editor_buttons_delete-button"]', // 삭제 버튼 (버튼 삽입 위치)
        titleField: 'div[data-testid="description"] > textarea',
        keywordField: 'div[data-testid="keyword-input-text"] input',
        saveButton: 'button[data-testid="edit-dialog-save-button"]',
        buttonId: 'shutterstock-tool-button'
      }
    }
  };

  return configs[siteType] || null;
}

/**
 * 현재 사이트가 지원되는 스톡 사이트인지 확인합니다.
 * @returns {boolean} 지원 여부
 */
export function isSupportedSite() {
  const siteType = detectStockSite();
  return siteType !== 'unknown';
}

/**
 * 현재 페이지가 업로드 페이지인지 확인합니다.
 * @param {string} siteType - 사이트 타입
 * @returns {boolean} 업로드 페이지 여부
 */
export function isUploadPage(siteType) {
  const config = getSiteConfig(siteType);
  if (!config) return false;

  const pathname = window.location.pathname;
  const isUpload = config.urlPatterns.some(pattern => pathname.includes(pattern));

  console.log('📄 Upload page check:', {
    siteType,
    pathname,
    urlPatterns: config.urlPatterns,
    isUpload
  });

  return isUpload;
}
