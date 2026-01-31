import { sendLog as sendLogMessage } from '../../shared/messenger';
import type { LogLevel } from '../../shared/types';

/**
 * Send a log message to the sidepanel
 */
export function sendLog(text: string, level: LogLevel = 'info'): void {
    sendLogMessage(text, level);
}
