/**
 * Supported stock photography sites
 */
export type SiteType = 'adobe' | 'shutterstock' | 'unknown';

/**
 * Log levels for activity logging
 */
export type LogLevel = 'info' | 'success' | 'error';

/**
 * Site-specific configuration
 */
export interface SiteConfig {
    name: string;
    supportsBilingual: boolean;
    maxTitleLength: number;
    keywordSeparator: string;
    urlPatterns: string[];
    selectors: {
        titleField: string;
        keywordField: string;
        saveButton: string;
        [key: string]: string;
    };
}

/**
 * AI-generated metadata result
 */
export interface AIMetadataResult {
    title: string;
    keyword?: string[];
    keywords?: string;
}

/**
 * Processed metadata ready for form filling
 */
export interface ProcessedMetadata {
    title: string;
    keywords: string;
}

/**
 * Chrome message types
 */
export type MessageAction =
    | 'generateMetadata'
    | 'checkStatus'
    | 'openSidePanel';

export type MessageType =
    | 'log'
    | 'status';

/**
 * Message from content script to sidepanel
 */
export interface ContentToSidepanelMessage {
    type: MessageType;
    text?: string;
    level?: LogLevel;
    connected?: boolean;
    site?: string;
    info?: string;
}

/**
 * Message from sidepanel to content script
 */
export interface SidepanelToContentMessage {
    action: MessageAction;
    siteType?: SiteType;
}

/**
 * Response from content script
 */
export interface ContentScriptResponse {
    success: boolean;
    title?: string;
    keywords?: string;
    error?: string;
    connected?: boolean;
    siteType?: SiteType;
    siteName?: string;
}
