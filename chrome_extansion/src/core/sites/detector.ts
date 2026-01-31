import { SITE_PATTERNS } from '../../shared/constants';
import type { SiteConfig, SiteType } from '../../shared/types';

/**
 * 현재 URL을 기반으로 스톡 사이트를 감지합니다.
 */
export function detectStockSite(): SiteType {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  const fullUrl = window.location.href;

  console.log('🔍 Detecting site...', {
    hostname,
    pathname,
    fullUrl,
  });

  if (hostname.includes(SITE_PATTERNS.ADOBE.HOSTNAME)) {
    console.log('✅ Adobe Stock site detected');
    return 'adobe';
  }

  if (hostname.includes(SITE_PATTERNS.SHUTTERSTOCK.HOSTNAME)) {
    console.log('✅ Shutterstock site detected');
    return 'shutterstock';
  }

  console.warn('❌ Unknown site:', hostname);
  return 'unknown';
}

/**
 * 사이트별 설정을 가져옵니다.
 */
export function getSiteConfig(siteType: SiteType): SiteConfig | null {
  const configs: Record<'adobe' | 'shutterstock', SiteConfig> = {
    adobe: {
      name: 'Adobe Stock',
      supportsBilingual: true,
      maxTitleLength: 200,
      keywordSeparator: ', ',
      urlPatterns: [SITE_PATTERNS.ADOBE.UPLOAD_PATH],
      selectors: {
        sidePanel: '.content-side-panel-wrapper--uploads',
        checkbox: 'div[data-t="asset-sidebar-submission-checkbox"]',
        titleField: 'textarea[data-t="asset-title-content-tagger"]',
        keywordField: '#content-keywords-ui-textarea',
        saveButton: 'button[data-t="save-work"]',
        buttonId: 'adobe-stock-tool-button',
      },
    },
    shutterstock: {
      name: 'Shutterstock',
      supportsBilingual: false,
      maxTitleLength: 200,
      keywordSeparator: ', ',
      urlPatterns: [SITE_PATTERNS.SHUTTERSTOCK.UPLOAD_PATH],
      selectors: {
        imageElement: 'div.css-rq1v45[data-testid="asset-card"] img',
        checkbox: 'button[data-testid="content_editor_buttons_delete-button"]',
        titleField: 'div[data-testid="description"] > textarea',
        keywordField: 'div[data-testid="keyword-input-text"] input',
        saveButton: 'button[data-testid="edit-dialog-save-button"]',
        buttonId: 'shutterstock-tool-button',
      },
    },
  };

  if (siteType === 'unknown') {
    return null;
  }

  return configs[siteType] || null;
}

/**
 * 현재 사이트가 지원되는 스톡 사이트인지 확인합니다.
 */
export function isSupportedSite(): boolean {
  const siteType = detectStockSite();
  return siteType !== 'unknown';
}

/**
 * 현재 페이지가 업로드 페이지인지 확인합니다.
 */
export function isUploadPage(siteType: SiteType): boolean {
  const config = getSiteConfig(siteType);
  if (!config) return false;

  const pathname = window.location.pathname;
  const isUpload = config.urlPatterns.some((pattern) => pathname.includes(pattern));

  console.log('📄 Upload page check:', {
    siteType,
    pathname,
    urlPatterns: config.urlPatterns,
    isUpload,
  });

  return isUpload;
}
