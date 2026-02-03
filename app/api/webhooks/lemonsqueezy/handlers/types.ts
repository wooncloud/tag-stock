/**
 * Lemon Squeezy 웹훅 페이로드 타입
 */
export interface WebhookPayload {
  meta: {
    event_name: string;
    webhook_id?: string;
    custom_data?: {
      user_id?: string;
      purchase_type?: string;
    };
  };
  data: {
    id: string;
    attributes: {
      variant_id?: number;
      status?: string;
      urls?: {
        update_payment_method?: string;
      };
      first_order_item?: {
        variant_id?: number;
      };
    };
  };
}

/**
 * 웹훅 핸들러 함수 타입
 */
export type WebhookHandler = (payload: WebhookPayload) => Promise<void>;
