import { STORAGE_KEYS } from './constants';

/**
 * Retrieve the Gemini API key from Chrome Storage
 */
export async function getApiKey(): Promise<string | null> {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.API_KEY);
    return (result[STORAGE_KEYS.API_KEY] as string) || null;
}

/**
 * Store the Gemini API key in Chrome Storage
 */
export async function setApiKey(key: string): Promise<void> {
    await chrome.storage.sync.set({ [STORAGE_KEYS.API_KEY]: key });
}

/**
 * Remove the API key from Chrome Storage
 */
export async function removeApiKey(): Promise<void> {
    await chrome.storage.sync.remove(STORAGE_KEYS.API_KEY);
}

/**
 * Check if an API key exists
 */
export async function hasApiKey(): Promise<boolean> {
    const key = await getApiKey();
    return key !== null && key.length > 0;
}
