import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDisplayName(name: string) {
  if (!name) return '';
  if (name.length > 25) {
    // Handle task runner or temporary file names
    if (name.includes('assets_task_')) {
      const parts = name.split('_');
      return parts.slice(-2).join('_'); // e.g., "img_001.png"
    }
    // General truncation
    return name.substring(0, 15) + '...' + name.substring(name.length - 8);
  }
  return name;
}
