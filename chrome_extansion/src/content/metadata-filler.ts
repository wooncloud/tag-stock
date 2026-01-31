import type { SiteType, ProcessedMetadata, AIMetadataResult } from '../shared/types';
import { TIMEOUTS } from '../shared/constants';
import { generateAIMetadata } from '../core/ai/metadata-generator';
import { setTextareaValue } from '../core/utils/dom';
import { getSiteConfig } from '../core/sites/detector';
import { sendLog } from '../core/utils/logger';
import { handleShutterstockKeywordInput } from '../core/sites/handlers/shutterstock';

/**
 * Process AI metadata result for site-specific formatting
 */
function processMetadataForSite(aiResult: AIMetadataResult, siteType: SiteType): ProcessedMetadata {
    const config = getSiteConfig(siteType);

    if (!config) {
        throw new Error(`Unsupported site: ${siteType}`);
    }

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
 * Fill metadata into the form fields
 */
export async function fillMetadata(siteType: SiteType): Promise<ProcessedMetadata> {
    const config = getSiteConfig(siteType);

    if (!config) {
        throw new Error(`Unsupported site: ${siteType}`);
    }

    const titleElement = document.querySelector<HTMLTextAreaElement>(config.selectors.titleField);
    const keywordElement = document.querySelector<HTMLTextAreaElement | HTMLInputElement>(
        config.selectors.keywordField
    );
    const saveButton = document.querySelector<HTMLButtonElement>(config.selectors.saveButton);

    if (!titleElement || !keywordElement) {
        throw new Error(`Form fields not found for ${config.name}`);
    }

    sendLog(`${config.name} AI metadata generation started...`);

    const aiResult = await generateAIMetadata();
    const processedResult = processMetadataForSite(aiResult, siteType);

    setTextareaValue(titleElement, processedResult.title);

    // Handle different element types for keywords
    if (keywordElement.tagName === 'TEXTAREA') {
        setTextareaValue(keywordElement as HTMLTextAreaElement, processedResult.keywords);
    } else {
        setTextareaValue(keywordElement as any, processedResult.keywords);
    }

    // Shutterstock: Process keyword input with Enter key
    if (siteType === 'shutterstock' && keywordElement.tagName === 'INPUT') {
        await handleShutterstockKeywordInput(keywordElement as HTMLInputElement);
    }

    // Auto-save
    if (saveButton) {
        setTimeout(() => {
            saveButton.click();
            sendLog('Changes saved', 'success');
        }, TIMEOUTS.AUTO_SAVE_DELAY);
    }

    return processedResult;
}
