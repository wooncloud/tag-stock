import crypto from 'crypto';

export interface SignatureVerificationResult {
  valid: boolean;
  error?: string;
}

/**
 * Lemon Squeezy 웹훅 서명 검증
 * HMAC-SHA256 + 타이밍 안전 비교 사용
 */
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): SignatureVerificationResult {
  if (!secret) {
    return { valid: false, error: 'LEMON_SQUEEZY_WEBHOOK_SECRET이 설정되지 않음' };
  }

  if (!signature) {
    return { valid: false, error: '서명이 없음' };
  }

  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
  const signatureBuffer = Buffer.from(signature, 'utf8');

  if (signatureBuffer.length !== digest.length) {
    return { valid: false, error: '유효하지 않은 서명' };
  }

  if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
    return { valid: false, error: '유효하지 않은 서명' };
  }

  return { valid: true };
}
