# Supabase Edge Functions 구현 가이드

## 개요

TagStock에서 구현해야 할 Edge Functions 목록:

| 함수명 | 용도 | 트리거 |
|--------|------|--------|
| `reset-monthly-credits` | 월간 크레딧 리셋 | Cron (매월 1일) |
| `process-pending-images` | 다중 업로드 배치 처리 | Cron (5분마다) 또는 DB Trigger |

---

## 사전 준비

### 1. Supabase CLI 설치

```bash
# npm
npm install -g supabase

# 또는 brew (macOS)
brew install supabase/tap/supabase
```

### 2. 프로젝트 초기화

```bash
# 프로젝트 루트에서
supabase init

# 로그인
supabase login

# 프로젝트 연결
supabase link --project-ref YOUR_PROJECT_REF
```

### 3. 환경 변수 설정

Supabase Dashboard > Project Settings > Edge Functions에서 설정:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=your-random-secret-for-cron-auth
```

---

## 함수 1: 월간 크레딧 리셋

### 디렉토리 구조

```
supabase/
└── functions/
    └── reset-monthly-credits/
        └── index.ts
```

### 코드 작성

```bash
# 함수 생성
supabase functions new reset-monthly-credits
```

**supabase/functions/reset-monthly-credits/index.ts:**

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
  const cronSecret = Deno.env.get('CRON_SECRET');

  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // 모든 사용자 조회
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, plan, credits_remaining, subscription_status');

    if (error) {
      throw error;
    }

    let processed = 0;
    const results: Array<{ userId: string; oldCredits: number; newCredits: number }> = [];

    for (const profile of profiles || []) {
      let newCredits: number;
      const oldCredits = profile.credits_remaining;

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
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ credits_remaining: newCredits })
        .eq('id', profile.id);

      if (updateError) {
        console.error(`Failed to update user ${profile.id}:`, updateError);
        continue;
      }

      // 거래 내역 기록 (credit_transactions 테이블이 있는 경우)
      await supabase.from('credit_transactions').insert({
        user_id: profile.id,
        type: 'monthly_grant',
        amount: newCredits - oldCredits,
        balance_after: newCredits,
        description: `Monthly ${profile.plan} plan credit grant`,
      });

      results.push({
        userId: profile.id,
        oldCredits,
        newCredits,
      });
      processed++;
    }

    console.log(`Monthly credit reset completed. Processed: ${processed} users`);

    return new Response(
      JSON.stringify({
        success: true,
        processed,
        timestamp: new Date().toISOString(),
        results: results.slice(0, 10), // 처음 10개만 반환
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Monthly credit reset failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

### 배포

```bash
supabase functions deploy reset-monthly-credits --no-verify-jwt
```

### Cron 설정 (pg_cron)

Supabase Dashboard > SQL Editor에서 실행:

```sql
-- pg_cron 확장 활성화 (이미 되어있을 수 있음)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 기존 작업 삭제 (있는 경우)
SELECT cron.unschedule('monthly-credit-reset');

-- 매월 1일 00:00 UTC에 실행
SELECT cron.schedule(
  'monthly-credit-reset',
  '0 0 1 * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/reset-monthly-credits',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_CRON_SECRET',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- 등록된 작업 확인
SELECT * FROM cron.job;
```

---

## 함수 2: 다중 업로드 배치 처리

### 디렉토리 구조

```
supabase/
└── functions/
    └── process-pending-images/
        └── index.ts
```

### 코드 작성

```bash
supabase functions new process-pending-images
```

**supabase/functions/process-pending-images/index.ts:**

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.24.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const genAI = new GoogleGenerativeAI(Deno.env.get('GOOGLE_GEMINI_API_KEY')!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const BATCH_SIZE = 5; // 한 번에 처리할 이미지 수

async function generateMetadataForImage(imageUrl: string): Promise<object> {
  const prompt = `You are an expert stock photography metadata generator...`; // 기존 프롬프트 사용

  // 이미지 다운로드
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: base64,
        mimeType: response.headers.get('content-type') || 'image/jpeg',
      },
    },
  ]);

  const text = result.response.text();
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error('Invalid AI response format');
  }

  return JSON.parse(jsonMatch[0]);
}

Deno.serve(async (req) => {
  // 인증 확인
  const authHeader = req.headers.get('Authorization');
  const cronSecret = Deno.env.get('CRON_SECRET');

  if (authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // pending 상태 이미지 조회
    const { data: pendingImages, error: fetchError } = await supabase
      .from('images')
      .select('id, storage_path, user_id')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) {
      throw fetchError;
    }

    if (!pendingImages || pendingImages.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No pending images', processed: 0 }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const results: Array<{ imageId: string; status: string; error?: string }> = [];

    for (const image of pendingImages) {
      try {
        // 상태를 processing으로 변경
        await supabase
          .from('images')
          .update({ status: 'processing' })
          .eq('id', image.id);

        // Storage에서 이미지 URL 가져오기
        const { data: urlData } = await supabase.storage
          .from('user-images')
          .createSignedUrl(image.storage_path, 60);

        if (!urlData?.signedUrl) {
          throw new Error('Failed to get image URL');
        }

        // AI 메타데이터 생성
        const metadata = await generateMetadataForImage(urlData.signedUrl);

        // 메타데이터 저장
        await supabase.from('metadata').insert({
          image_id: image.id,
          ...metadata,
        });

        // 상태를 completed로 변경
        await supabase
          .from('images')
          .update({ status: 'completed' })
          .eq('id', image.id);

        // 크레딧 차감
        await supabase.rpc('decrement_credits', { user_id: image.user_id });

        results.push({ imageId: image.id, status: 'completed' });
      } catch (error) {
        console.error(`Failed to process image ${image.id}:`, error);

        // 상태를 failed로 변경
        await supabase
          .from('images')
          .update({
            status: 'failed',
            error_message: error.message,
          })
          .eq('id', image.id);

        results.push({
          imageId: image.id,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Batch processing failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

### 크레딧 차감 RPC 함수

```sql
-- Supabase SQL Editor에서 실행
CREATE OR REPLACE FUNCTION decrement_credits(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET credits_remaining = GREATEST(credits_remaining - 1, 0)
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 배포

```bash
supabase functions deploy process-pending-images --no-verify-jwt
```

### Cron 설정 (5분마다)

```sql
SELECT cron.schedule(
  'process-pending-images',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/process-pending-images',
    headers := jsonb_build_object(
      'Authorization', 'Bearer YOUR_CRON_SECRET',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

---

## 로컬 테스트

### 함수 실행

```bash
# 로컬 서버 시작
supabase functions serve

# 다른 터미널에서 테스트
curl -X POST http://localhost:54321/functions/v1/reset-monthly-credits \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

### 로그 확인

```bash
# 배포된 함수 로그 확인
supabase functions logs reset-monthly-credits --tail
```

---

## 모니터링

### Supabase Dashboard

1. **Edge Functions** > 함수 선택 > Logs 탭
2. **Database** > Logs에서 pg_cron 실행 확인

### 알림 설정 (선택사항)

실패 시 Discord/Slack 알림:

```typescript
async function sendAlert(message: string) {
  const webhookUrl = Deno.env.get('DISCORD_WEBHOOK_URL');
  if (!webhookUrl) return;

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `⚠️ Edge Function Alert: ${message}`,
    }),
  });
}
```

---

## 체크리스트

### 배포 전

- [ ] Supabase CLI 설치 및 로그인
- [ ] 환경 변수 설정 (Dashboard)
- [ ] credit_transactions 테이블 생성
- [ ] decrement_credits RPC 함수 생성
- [ ] pg_net 확장 활성화 확인

### 배포 후

- [ ] 함수 배포 확인
- [ ] Cron 작업 등록 확인
- [ ] 로컬 테스트 통과
- [ ] 로그 모니터링 설정

---

## 트러블슈팅

### pg_cron이 실행되지 않음

```sql
-- pg_net 확장 확인
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 작업 상태 확인
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;
```

### 함수가 타임아웃됨

Edge Function 기본 타임아웃: 60초

```typescript
// 배치 크기 줄이기
const BATCH_SIZE = 3;
```

### 권한 오류

Service Role Key 사용 확인:
```typescript
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // anon key 아님!
);
```

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-01-25 | 1.0 | 초기 가이드 작성 |
