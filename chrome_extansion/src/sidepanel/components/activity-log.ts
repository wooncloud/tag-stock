import { MAX_LOG_ENTRIES } from '../../shared/constants';
import type { LogLevel } from '../../shared/types';

/**
 * 활동 로그에 로그 항목을 추가합니다.
 */
export function addLog(message: string, type: LogLevel = 'info'): void {
  const logContainer = document.getElementById('activityLog');

  if (!logContainer) {
    console.warn('Activity log container not found');
    return;
  }

  // 플레이스홀더가 있으면 제거
  const placeholder = logContainer.querySelector('.text-muted-foreground');
  if (placeholder && placeholder.textContent?.includes('No activity yet')) {
    logContainer.innerHTML = '';
  }

  const entry = document.createElement('div');
  entry.className = 'p-3 text-sm';

  const colors: Record<LogLevel, string> = {
    info: 'text-muted-foreground',
    success: 'text-green-600',
    error: 'text-red-600',
  };

  const colorClass = colors[type] || colors.info;
  entry.innerHTML = `<span class="${colorClass}">[${new Date().toLocaleTimeString()}] ${message}</span>`;

  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight;

  // 최대 로그 항목 수 유지
  while (logContainer.children.length > MAX_LOG_ENTRIES) {
    logContainer.removeChild(logContainer.firstChild!);
  }
}

/**
 * 모든 로그 항목을 지웁니다.
 */
export function clearLog(): void {
  const logContainer = document.getElementById('activityLog');

  if (!logContainer) {
    console.warn('Activity log container not found');
    return;
  }

  logContainer.innerHTML = '<div class="p-3 text-sm text-muted-foreground">No activity yet</div>';
}
