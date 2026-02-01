import type { UserProfile } from '../shared/types';

/**
 * 사이드패널 전역 상태
 */
let currentTabId: number | null = null;
let currentProfile: UserProfile | null = null;

export function getCurrentTabId(): number | null {
  return currentTabId;
}

export function setCurrentTabId(tabId: number | null): void {
  currentTabId = tabId;
}

export function getCurrentProfile(): UserProfile | null {
  return currentProfile;
}

export function setCurrentProfile(profile: UserProfile | null): void {
  currentProfile = profile;
}
