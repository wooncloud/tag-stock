import { NextRequest, NextResponse } from 'next/server';

import { checkAndInsertWebhookEvent } from '@/services/billing';

import { type WebhookPayload, handleWebhookEvent } from './handlers';
import { verifyWebhookSignature } from './signature';

/**
 * Lemon Squeezy 웹훅 핸들러
 *
 * 처리되는 이벤트:
 * - subscription_created: 신규 구독 생성
 * - subscription_updated: 플랜 변경
 * - subscription_payment_success: 월간 갱신 결제 성공
 * - subscription_cancelled: 사용자가 구독 취소
 * - subscription_expired: 구독 만료
 * - order_created: 일회성 크레딧 팩 구매
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 원본 본문 및 서명 읽기
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature') || '';
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '';

    // 2. 서명 검증
    const verification = verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!verification.valid) {
      console.error(verification.error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 3. 페이로드 파싱
    const payload: WebhookPayload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const eventId = payload.meta.webhook_id || payload.data.id;

    console.log(`Lemon Squeezy 이벤트 수신: ${eventName} (ID: ${eventId})`);

    // 4. 멱등성 검사
    const isNewEvent = await checkAndInsertWebhookEvent(
      eventId,
      eventName,
      'lemonsqueezy',
      payload.meta
    );

    if (!isNewEvent) {
      console.log(`이벤트 ${eventId} 이미 처리됨, 건너뛰기`);
      return NextResponse.json({ received: true, skipped: true });
    }

    // 5. 이벤트 처리
    await handleWebhookEvent(eventName, payload);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('웹훅 오류:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
