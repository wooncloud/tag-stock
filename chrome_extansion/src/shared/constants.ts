/**
 * 사이드패널에 유지할 최대 로그 항목 수
 */
export const MAX_LOG_ENTRIES = 20;

/**
 * 타임아웃 값 (밀리초 단위)
 */
export const TIMEOUTS = {
  BUTTON_FEEDBACK: 2000,
  AUTO_SAVE_DELAY: 500,
  KEYBOARD_EVENT_DELAY: 100,
} as const;

/**
 * 사이트 감지를 위한 URL 패턴
 */
export const SITE_PATTERNS = {
  ADOBE: {
    HOSTNAME: 'adobe.com',
    UPLOAD_PATH: '/uploads',
  },
  SHUTTERSTOCK: {
    HOSTNAME: 'shutterstock.com',
    UPLOAD_PATH: '/portfolio/not_submitted/photo',
  },
} as const;

/**
 * 로컬 파일 처리 페이지 설정
 */
export const LOCAL_PAGE = {
  THUMBNAIL_SIZE: 200,
  MAX_FILE_SIZE_MB: 50,
  SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg'],
} as const;

/**
 * 외부 링크
 */
export const LINKS = {
  HOME: 'https://tagstock.app/',
  CONTACT: 'https://tagstock.app/contact',
  ADOBE_PORTFOLIO: 'https://contributor.stock.adobe.com/kr/portfolio',
  SHUTTERSTOCK_PORTFOLIO: 'https://submit.shutterstock.com/ko/portfolio/not_submitted/photo',
} as const;
