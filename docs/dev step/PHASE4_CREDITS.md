# Phase 4: 크레딧 시스템 상세 설계

## 개요

**목표**: 플랜별 월간 크레딧 제공 및 추가 크레딧 구매 시스템 구축

**상태**: 📋 기획 단계

---

## 플랜 비교표

| 기능 | Free | Pro | Max |
|------|------|-----|-----|
| **가격** | 무료 | $5/월 ($50/년) | $19/월 ($190/년) |
| **월간 크레딧** | 10 | 500 | 2,000 |
| **이미지 업로드** | 압축 이미지 | 원본 이미지 | 원본 이미지 |
| **다중 업로드** | 1장씩 | 최대 10장 | 최대 10장 |
| **IPTC 메타데이터** | X | O | O |
| **우선 지원** | X | X | O |
| **크레딧 이월** | X | X | O (최대 1,000) |

---

## 크레딧 구매 시스템

### 가격 정책

| 크레딧 팩 | 가격 | 단가 | 할인율 |
|----------|------|------|--------|
| 100 크레딧 | $1.50 | $0.015 | - |
| 500 크레딧 | $6.00 | $0.012 | 20% |
| 1,000 크레딧 | $10.00 | $0.010 | 33% |
| 5,000 크레딧 | $40.00 | $0.008 | 47% |

### 구현 아키텍처

```
[크레딧 구매 버튼 클릭]
        ↓
[Stripe Checkout Session 생성]
   - mode: 'payment' (일회성 결제)
   - line_items: 크레딧 팩 상품
        ↓
[결제 완료 → Webhook 수신]
   - checkout.session.completed
        ↓
[profiles 테이블 업데이트]
   - credits_remaining += 구매한 크레딧
        ↓
[credit_transactions 테이블에 기록]
   - type: 'purchase'
   - amount: 구매한 크레딧
```

### DB 스키마 추가

```sql
-- 크레딧 거래 내역 테이블
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'monthly_grant' | 'purchase' | 'usage' | 'refund' | 'bonus'
  amount INTEGER NOT NULL, -- 양수: 충전, 음수: 사용
  balance_after INTEGER NOT NULL, -- 거래 후 잔액
  description TEXT,
  stripe_payment_id TEXT, -- 구매 시 Stripe Payment Intent ID
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
```

### Stripe 상품 설정

```typescript
// lib/stripe.ts에 추가
export const CREDIT_PACKS = {
  pack_100: {
    name: '100 Credits',
    credits: 100,
    amount: 150, // $1.50
  },
  pack_500: {
    name: '500 Credits',
    credits: 500,
    amount: 600, // $6.00
  },
  pack_1000: {
    name: '1,000 Credits',
    credits: 1000,
    amount: 1000, // $10.00
  },
  pack_5000: {
    name: '5,000 Credits',
    credits: 5000,
    amount: 4000, // $40.00
  },
};
```

---

## 월간 크레딧 리셋 시스템

### 추천 아키텍처: Supabase Edge Function + pg_cron

```
[매월 1일 00:00 UTC]
        ↓
[pg_cron 또는 Supabase Scheduled Function]
        ↓
[활성 구독자 조회]
   - subscription_status = 'active'
        ↓
[플랜별 크레딧 리셋]
   - Free: 10
   - Pro: 500 (이월 없음)
   - Max: min(현재잔액, 1000) + 2000
        ↓
[credit_transactions에 기록]
   - type: 'monthly_grant'
```

### 구현 방법 1: Supabase Edge Function (추천)

```typescript
// supabase/functions/reset-monthly-credits/index.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const PLAN_CREDITS = {
  free: 10,
  pro: 500,
  max: 2000,
};

const MAX_CARRYOVER = 1000; // Max 플랜만 이월 가능

Deno.serve(async (req) => {
  // Cron 인증 확인
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // 모든 사용자 조회
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, plan, credits_remaining, subscription_status');

  if (error) {
    console.error('Failed to fetch profiles:', error);
    return new Response('Error', { status: 500 });
  }

  for (const profile of profiles) {
    let newCredits: number;

    if (profile.plan === 'max' && profile.subscription_status === 'active') {
      // Max 플랜: 이월 가능 (최대 1,000)
      const carryover = Math.min(profile.credits_remaining, MAX_CARRYOVER);
      newCredits = carryover + PLAN_CREDITS.max;
    } else if (profile.plan === 'pro' && profile.subscription_status === 'active') {
      // Pro 플랜: 이월 없음
      newCredits = PLAN_CREDITS.pro;
    } else {
      // Free 플랜
      newCredits = PLAN_CREDITS.free;
    }

    // 크레딧 업데이트
    await supabase
      .from('profiles')
      .update({ credits_remaining: newCredits })
      .eq('id', profile.id);

    // 거래 내역 기록
    await supabase.from('credit_transactions').insert({
      user_id: profile.id,
      type: 'monthly_grant',
      amount: newCredits - profile.credits_remaining,
      balance_after: newCredits,
      description: `Monthly ${profile.plan} plan credit grant`,
    });
  }

  return new Response(JSON.stringify({
    success: true,
    processed: profiles.length
  }));
});
```

### Cron 설정 (Supabase Dashboard)

```sql
-- Supabase SQL Editor에서 실행
SELECT cron.schedule(
  'reset-monthly-credits',
  '0 0 1 * *', -- 매월 1일 00:00 UTC
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/reset-monthly-credits',
    headers := '{"Authorization": "Bearer YOUR_CRON_SECRET"}'::jsonb
  );
  $$
);
```

### 구현 방법 2: pg_cron 직접 사용 (간단)

```sql
-- pg_cron 확장 활성화 (Supabase 대시보드에서)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 월간 크레딧 리셋 함수
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS void AS $$
DECLARE
  profile_record RECORD;
  new_credits INTEGER;
BEGIN
  FOR profile_record IN
    SELECT id, plan, credits_remaining, subscription_status
    FROM profiles
  LOOP
    -- 플랜별 크레딧 계산
    IF profile_record.plan = 'max' AND profile_record.subscription_status = 'active' THEN
      new_credits := LEAST(profile_record.credits_remaining, 1000) + 2000;
    ELSIF profile_record.plan = 'pro' AND profile_record.subscription_status = 'active' THEN
      new_credits := 500;
    ELSE
      new_credits := 10;
    END IF;

    -- 크레딧 업데이트
    UPDATE profiles
    SET credits_remaining = new_credits
    WHERE id = profile_record.id;

    -- 거래 내역 기록
    INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
    VALUES (
      profile_record.id,
      'monthly_grant',
      new_credits - profile_record.credits_remaining,
      new_credits,
      'Monthly ' || profile_record.plan || ' plan credit grant'
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Cron 작업 등록
SELECT cron.schedule(
  'monthly-credit-reset',
  '0 0 1 * *', -- 매월 1일 00:00 UTC
  'SELECT reset_monthly_credits()'
);
```

---

## Max 플랜 구현 태스크

### Phase 4.1: DB 스키마 업데이트
- [ ] `profiles.plan`에 'max' 타입 추가
- [ ] `credit_transactions` 테이블 생성
- [ ] 마이그레이션 스크립트 작성

### Phase 4.2: Stripe 상품 설정
- [ ] Max 플랜 상품/가격 생성 (Stripe Dashboard)
- [ ] 크레딧 팩 상품 생성
- [ ] 환경 변수에 Price ID 추가

### Phase 4.3: 결제 플로우 구현
- [ ] Max 플랜 체크아웃 액션
- [ ] 크레딧 구매 체크아웃 액션
- [ ] 웹훅에서 Max 플랜 처리 추가

### Phase 4.4: UI 구현
- [ ] Pricing 페이지에 Max 플랜 추가
- [ ] 크레딧 구매 모달/페이지
- [ ] 크레딧 사용 내역 페이지

### Phase 4.5: 월간 리셋 구현
- [ ] Edge Function 또는 pg_cron 설정
- [ ] 테스트 및 모니터링

---

## 파일 변경 목록

### 수정 필요
```
lib/
├── stripe.ts              # Max 플랜, 크레딧 팩 설정 추가
└── plan-limits.ts         # Max 플랜 제한 추가

app/
├── actions/
│   └── stripe.ts          # 크레딧 구매 액션 추가
└── api/webhooks/stripe/
    └── route.ts           # Max 플랜, 크레딧 구매 처리

components/dashboard/
├── pricing/               # Max 플랜 카드 추가
└── credits/               # 크레딧 구매 UI (신규)

types/
└── database.ts            # UserPlan에 'max' 추가
```

### 신규 생성
```
supabase/
├── functions/
│   └── reset-monthly-credits/  # 월간 크레딧 리셋
└── migrations/
    └── 20260125_credit_transactions.sql
```

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-01-25 | 0.1 | 초기 기획 문서 작성 |
