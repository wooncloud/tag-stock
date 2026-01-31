import type { LogLevel } from '../../shared/types';
import { MAX_LOG_ENTRIES } from '../../shared/constants';

/**
 * Add a log entry to the activity log
 */
export function addLog(message: string, type: LogLevel = 'info'): void {
    const logContainer = document.getElementById('activityLog');

    if (!logContainer) {
        console.warn('Activity log container not found');
        return;
    }

    // Clear placeholder if it exists
    const placeholder = logContainer.querySelector('.text-muted-foreground');
    if (placeholder && placeholder.textContent?.includes('No activity yet')) {
        logContainer.innerHTML = '';
    }

    const entry = document.createElement('div');
    entry.className = 'p-3 text-sm';

    const colors: Record<LogLevel, string> = {
        info: 'text-muted-foreground',
        success: 'text-green-600',
        error: 'text-red-600'
    };

    const colorClass = colors[type] || colors.info;
    entry.innerHTML = `<span class="${colorClass}">[${new Date().toLocaleTimeString()}] ${message}</span>`;

    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;

    // Maintain maximum log entries
    while (logContainer.children.length > MAX_LOG_ENTRIES) {
        logContainer.removeChild(logContainer.firstChild!);
    }
}

/**
 * Clear all log entries
 */
export function clearLog(): void {
    const logContainer = document.getElementById('activityLog');

    if (!logContainer) {
        console.warn('Activity log container not found');
        return;
    }

    logContainer.innerHTML = '<div class="p-3 text-sm text-muted-foreground">No activity yet</div>';
}
