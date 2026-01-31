import type { SiteType, SiteConfig, AIMetadataResult } from '../../shared/types';
import { generateMetadata } from './gemini-client';
import { getImageAsBase64, getThumbnailImage } from '../utils/image';
import { detectStockSite, getSiteConfig } from '../sites/detector';
import { ADOBE_STOCK_PROMPT } from './prompts/adobe';
import { SHUTTERSTOCK_PROMPT } from './prompts/shutterstock';

/**
 * Get the appropriate prompt for the given site type
 */
function getPromptForSite(siteType: SiteType): string {
    switch (siteType) {
        case 'adobe':
            return ADOBE_STOCK_PROMPT;
        case 'shutterstock':
            return SHUTTERSTOCK_PROMPT;
        default:
            console.warn(`Unknown site type: ${siteType}, using default prompt.`);
            return ADOBE_STOCK_PROMPT;
    }
}

/**
 * Filter English-only keywords from a keyword string
 */
function filterEnglishKeywords(keywords: string): string {
    return keywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => /^[a-zA-Z\s\-']+$/.test(keyword))
        .join(', ');
}

/**
 * Post-process metadata based on site-specific requirements
 */
function postProcessMetadata(
    metadata: AIMetadataResult,
    siteType: SiteType,
    siteConfig: SiteConfig
): AIMetadataResult {
    // Check title length limit
    if (metadata.title && metadata.title.length > siteConfig.maxTitleLength) {
        console.warn(`Title exceeds ${siteConfig.maxTitleLength} characters. Truncating automatically.`);
        metadata.title = metadata.title.substring(0, siteConfig.maxTitleLength);
    }

    // Site-specific processing
    switch (siteType) {
        case 'shutterstock':
            // Shutterstock only supports English, remove Korean keywords
            if (metadata.keywords) {
                metadata.keywords = filterEnglishKeywords(metadata.keywords);
            }
            break;
        case 'adobe':
            // Adobe Stock doesn't require special post-processing
            break;
    }

    return metadata;
}

/**
 * Generate AI metadata for the current site
 */
export async function generateAIMetadata(): Promise<AIMetadataResult> {
    try {
        // Detect current site
        const siteType = detectStockSite();
        const siteConfig = getSiteConfig(siteType);

        if (!siteConfig) {
            throw new Error(`Unsupported site: ${siteType}`);
        }

        console.debug(`Detected site: ${siteType} (${siteConfig.name})`);

        // Select prompt for the site
        const systemPrompt = getPromptForSite(siteType);

        console.debug('Searching for thumbnail image...');
        const thumbnail = getThumbnailImage();

        console.debug('Converting image...', thumbnail.src);
        const imageBase64 = await getImageAsBase64(thumbnail.src);

        console.debug(`${siteConfig.name} AI metadata generation in progress...`);
        const result = await generateMetadata(systemPrompt, imageBase64);

        console.debug('Generated metadata:', result);

        // Post-process metadata if needed
        return postProcessMetadata(result, siteType, siteConfig);

    } catch (error) {
        console.error('AI metadata generation failed:', error);
        throw error;
    }
}
