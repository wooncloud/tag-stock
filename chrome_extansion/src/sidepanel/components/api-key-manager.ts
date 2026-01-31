import { setApiKey, hasApiKey } from '../../shared/storage';
import { addLog } from './activity-log';

const apiKeyInput = document.getElementById('apiKeyInput') as HTMLInputElement;
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn') as HTMLButtonElement;
const apiKeyStatus = document.getElementById('apiKeyStatus') as HTMLSpanElement;

/**
 * Initialize API key manager
 */
export async function initializeApiKeyManager(): Promise<void> {
    // Load current API key status
    await updateApiKeyStatus();

    // Save button click handler
    saveApiKeyBtn.addEventListener('click', async () => {
        const key = apiKeyInput.value.trim();

        if (!key) {
            addLog('Please enter an API key', 'error');
            return;
        }

        try {
            await setApiKey(key);
            apiKeyInput.value = '';
            await updateApiKeyStatus();
            addLog('API key saved successfully', 'success');
        } catch (error) {
            console.error('Failed to save API key:', error);
            addLog('Failed to save API key', 'error');
        }
    });
}

/**
 * Update API key status display
 */
async function updateApiKeyStatus(): Promise<void> {
    const exists = await hasApiKey();

    if (exists) {
        apiKeyStatus.className = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-600';
        apiKeyStatus.textContent = 'Configured';
    } else {
        apiKeyStatus.className = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-500/10 text-red-600';
        apiKeyStatus.textContent = 'Not Configured';
    }
}
