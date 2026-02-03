import { getSupabaseAdmin } from './client';

/**
 * 사용자 프로필에 구매한 크레딧 추가
 */
export async function addPurchasedCredits(userId: string, amount: number): Promise<void> {
  // 먼저 현재 크레딧을 가져옵니다.
  const { data: profile } = await getSupabaseAdmin()
    .from('profiles')
    .select('credits_purchased')
    .eq('id', userId)
    .single();

  const currentCredits = profile?.credits_purchased || 0;

  await getSupabaseAdmin()
    .from('profiles')
    .update({
      credits_purchased: currentCredits + amount,
    })
    .eq('id', userId);

  console.log(`구매 크레딧 추가: 사용자 ${userId}에게 ${amount} 크레딧`);
}

/**
 * 구독 크레딧 추가 (월간 갱신 시 사용)
 * RPC 함수를 사용하여 원자적 연산 보장
 */
export async function addSubscriptionCredits(userId: string, amount: number): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin().rpc('add_subscription_credits', {
    user_uuid: userId,
    amount,
  });

  if (error) {
    console.error(`구독 크레딧 추가 실패 (사용자 ${userId}):`, error);
    return false;
  }

  console.log(`구독 크레딧 추가: 사용자 ${userId}에게 ${amount} 크레딧`);
  return data === true;
}
