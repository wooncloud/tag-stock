import type { LogLevel } from '../../shared/types';
import { MAX_LOG_ENTRIES } from '../../shared/constants';

const logSection = document.getElementById('logSection') as HTMLDivElement;

/**
 * Add a log entry to the activity log
 */
export function addLog(message: string, type: LogLevel = 'info'): void {
    const entry = document.createElement('div');

    const colors: Record<LogLevel, string> = {
        info: 'text-muted-foreground',
        success: 'text-green-600',
        error: 'text-red-600'
    };

    entry.className = colors[type] || colors.info;
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logSection.appendChild(entry);
    logSection.scrollTop = logSection.scrollHeight;

    // Maintain maximum log entries
    while (logSection.children.length > MAX_LOG_ENTRIES) {
        logSection.removeChild(logSection.firstChild!);
    }
}
