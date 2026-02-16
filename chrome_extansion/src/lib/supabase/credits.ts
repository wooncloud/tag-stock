import type { UserProfile } from '../../shared/types';

/**
 * 사용 가능한 총 크레딧 가져오기
 */
export function getTotalCredits(profile: UserProfile): number {
  return profile.credits_subscription + profile.credits_purchased;
}

/**
 * 사용자가 충분한 크레딧을 가지고 있는지 확인
 */
export function hasSufficientCredits(profile: UserProfile, required: number = 1): boolean {
  return getTotalCredits(profile) >= required;
}
