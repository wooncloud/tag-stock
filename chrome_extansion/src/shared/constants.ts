/**
 * Gemini AI model configuration
 */
export const AI_MODEL = 'gemini-2.5-flash-lite';

/**
 * Maximum number of log entries to keep in sidepanel
 */
export const MAX_LOG_ENTRIES = 20;

/**
 * Timeout values (in milliseconds)
 */
export const TIMEOUTS = {
    BUTTON_FEEDBACK: 2000,
    AUTO_SAVE_DELAY: 500,
    KEYBOARD_EVENT_DELAY: 100,
} as const;

/**
 * Site URL patterns for detection
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
 * Chrome Storage keys
 */
export const STORAGE_KEYS = {
    API_KEY: 'geminiApiKey',
} as const;

/**
 * External links
 */
export const LINKS = {
    HOME: 'https://tagstock.app/',
    CONTACT: 'https://tagstock.app/contact',
    ADOBE_PORTFOLIO: 'https://contributor.stock.adobe.com/kr/portfolio',
    SHUTTERSTOCK_PORTFOLIO: 'https://submit.shutterstock.com/ko/portfolio/not_submitted/photo',
} as const;
