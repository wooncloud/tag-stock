import { addPurchasedCredits, getCreditPackAmount } from '@/services/billing';

import type { WebhookPayload } from './types';

/**
 * 일회성 크레딧 팩 구매 이벤트 처리
 */
export async function handleOrderCreated(payload: WebhookPayload): Promise<void> {
  const userId = payload.meta.custom_data?.user_id;
  const purchaseType = payload.meta.custom_data?.purchase_type;
  const attributes = payload.data.attributes;
  const variantId = attributes.first_order_item?.variant_id?.toString();

  if (!userId) {
    console.error('order custom_data에 user_id 없음');
    return;
  }

  // 크레딧 팩 구매만 처리 (구독 제외)
  if (purchaseType === 'credit_pack' && variantId) {
    const creditAmount = getCreditPackAmount(variantId);
    if (creditAmount > 0) {
      await addPurchasedCredits(userId, creditAmount);
      console.log(`크레딧 팩 구매: 사용자 ${userId}에게 ${creditAmount} 크레딧 추가`);
    }
  }
}
