import type { UserProfile } from '../../shared/types';
import { createClient } from './client';
import { getProfile } from './user';

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

/**
 * 크레딧 차감 (구독 크레딧 우선 사용)
 */
export async function deductCredit(userId: string, amount: number = 1): Promise<boolean> {
  const supabase = createClient();

  // 현재 프로필 조회
  const profile = await getProfile(userId);
  if (!profile || !hasSufficientCredits(profile, amount)) {
    return false;
  }

  // 구독 크레딧 우선 차감
  const subDeduct = Math.min(profile.credits_subscription, amount);
  const purchaseDeduct = amount - subDeduct;

  const { error } = await supabase
    .from('profiles')
    // @ts-expect-error - Supabase 스키마 타입이 구성되지 않음
    .update({
      credits_subscription: profile.credits_subscription - subDeduct,
      credits_purchased: profile.credits_purchased - purchaseDeduct,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error deducting credit:', error);
    return false;
  }

  return true;
}
