import { handleOrderCreated } from './order';
import {
  handleSubscriptionCancelled,
  handleSubscriptionCreated,
  handleSubscriptionExpired,
  handleSubscriptionPaymentSuccess,
  handleSubscriptionUpdated,
} from './subscription';
import type { WebhookHandler, WebhookPayload } from './types';

export type { WebhookHandler, WebhookPayload };

/**
 * 이벤트 이름별 핸들러 매핑
 */
const eventHandlers: Record<string, WebhookHandler> = {
  subscription_created: handleSubscriptionCreated,
  subscription_updated: handleSubscriptionUpdated,
  subscription_payment_success: handleSubscriptionPaymentSuccess,
  subscription_cancelled: handleSubscriptionCancelled,
  subscription_expired: handleSubscriptionExpired,
  order_created: handleOrderCreated,
};

/**
 * 이벤트 처리
 * @returns 처리 여부 (true: 처리됨, false: 미지원 이벤트)
 */
export async function handleWebhookEvent(
  eventName: string,
  payload: WebhookPayload
): Promise<boolean> {
  const handler = eventHandlers[eventName];

  if (!handler) {
    console.log(`처리되지 않은 이벤트 타입: ${eventName}`);
    return false;
  }

  await handler(payload);
  return true;
}
