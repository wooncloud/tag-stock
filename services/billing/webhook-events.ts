import { getSupabaseAdmin } from './client';

/**
 * 웹훅 이벤트 중복 확인 및 등록 (멱등성 보장)
 * @returns 새 이벤트면 true 반환하고 삽입, 이미 처리됐으면 false 반환
 */
export async function checkAndInsertWebhookEvent(
  eventId: string,
  eventType: string,
  provider: string = 'lemonsqueezy',
  payload?: unknown
): Promise<boolean> {
  const { data, error } = await getSupabaseAdmin().rpc('check_and_insert_webhook_event', {
    p_event_id: eventId,
    p_event_type: eventType,
    p_provider: provider,
    p_payload: payload ? JSON.stringify(payload) : null,
  });

  if (error) {
    console.error(`웹훅 이벤트 확인 실패 (${eventId}):`, error);
    // 오류 시 이벤트 누락 방지를 위해 새 이벤트로 간주
    return true;
  }

  return data === true;
}
