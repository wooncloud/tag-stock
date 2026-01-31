import { sendLog as sendLogMessage } from '../../shared/messenger';
import type { LogLevel } from '../../shared/types';

/**
 * 사이드패널에 로그 메시지를 보냅니다.
 */
export function sendLog(text: string, level: LogLevel = 'info'): void {
  sendLogMessage(text, level);
}
