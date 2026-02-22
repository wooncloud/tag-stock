# 개발 가이드

## 로컬 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사하여 `.env.local` 파일을 생성한다.

```bash
cp .env.example .env.local
```

아래 표를 참고하여 모든 값을 설정한다.

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인 가능.

---

## 환경 변수

### Supabase

| 변수 | 설명 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | O |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) 키 | O |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role 키 (서버 전용) | O |

### AI

| 변수 | 설명 | 필수 |
|------|------|------|
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API 키 | O |

### 앱 설정

| 변수 | 설명 | 필수 |
|------|------|------|
| `NEXT_PUBLIC_APP_URL` | 앱 URL (로컬: `http://localhost:3000`) | O |
| `NEXT_PUBLIC_GA_ID` | Google Analytics Measurement ID | - |
| `DISCORD_WEBHOOK_URL` | Discord 알림 웹훅 URL | - |
| `CRON_SECRET` | Edge Function 인증용 시크릿 | O |

### Lemon Squeezy

| 변수 | 설명 | 필수 |
|------|------|------|
| `LEMON_SQUEEZY_API` | Lemon Squeezy API 키 | O |
| `LEMON_SQUEEZY_STORE_ID` | Store ID (숫자) | O |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | 웹훅 서명 검증 시크릿 | O |
| `NEXT_PUBLIC_LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID` | Pro 월간 구독 Variant ID | O |
| `NEXT_PUBLIC_LEMON_SQUEEZY_MAX_MONTHLY_VARIANT_ID` | Max 월간 구독 Variant ID | O |
| `NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_S_VARIANT_ID` | Credit Pack S Variant ID | O |
| `NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_L_VARIANT_ID` | Credit Pack L Variant ID | O |

---

## Supabase 설정

### 1. 마이그레이션 적용

`supabase/migrations/` 폴더의 SQL 파일들을 Supabase SQL Editor에서 순서대로 실행한다.

### 2. 확장 활성화

Supabase 대시보드에서 다음 PostgreSQL 확장을 활성화한다:

- `pg_cron` - 월간 크레딧 리셋 스케줄링
- `pg_net` - Edge Function에서 HTTP 요청

### 3. 스토리지 버킷

`user-images` 버킷을 생성한다 (이미지 업로드용).

### 4. Edge Function 배포

```bash
supabase functions deploy reset-monthly-credits
```

cron 스케줄 설정 (Supabase SQL Editor에서 실행):

```sql
select cron.schedule(
  'reset-monthly-credits',
  '0 0 1 * *',  -- 매월 1일 00:00 UTC
  $$
  select net.http_post(
    url := '<SUPABASE_URL>/functions/v1/reset-monthly-credits',
    headers := '{"Authorization": "Bearer <CRON_SECRET>"}'::jsonb
  );
  $$
);
```

---

## Lemon Squeezy 설정

### 1. API 키 발급

[Lemon Squeezy Dashboard > Settings > API](https://app.lemonsqueezy.com/settings/api)에서 API 키를 발급받는다.

### 2. Store ID 확인

[Settings > Stores](https://app.lemonsqueezy.com/settings/stores)에서 Store ID(숫자)를 확인한다.

### 3. 상품 생성

[Dashboard > Products](https://app.lemonsqueezy.com/products)에서 다음 상품들을 생성한다:

**구독 상품 (Subscription):**
- Pro ($5/월) - Variant ID를 `NEXT_PUBLIC_LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID`에 설정
- Max ($19/월) - Variant ID를 `NEXT_PUBLIC_LEMON_SQUEEZY_MAX_MONTHLY_VARIANT_ID`에 설정

**크레딧 팩 (One-time):**
- Credit Pack S (100 크레딧, $2) - Variant ID를 `NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_S_VARIANT_ID`에 설정
- Credit Pack L (1,000 크레딧, $15) - Variant ID를 `NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_L_VARIANT_ID`에 설정

### 4. 웹훅 설정

[Settings > Webhooks](https://app.lemonsqueezy.com/settings/webhooks)에서 새 웹훅을 추가한다:

- **URL:** `https://tagstock.app/api/webhooks/lemonsqueezy`
- **Signing Secret:** 복잡한 문자열 입력 후 `LEMON_SQUEEZY_WEBHOOK_SECRET`에 동일 값 설정
- **Events:**
  - `subscription_created`
  - `subscription_updated`
  - `subscription_cancelled`
  - `subscription_expired`
  - `order_created`

### 5. 로컬 테스트 (ngrok)

로컬 환경에서 웹훅을 테스트하려면 ngrok을 사용한다:

```bash
ngrok http 3000
```

생성된 URL로 Lemon Squeezy 웹훅 URL을 임시 변경한다:
`https://<ngrok-url>/api/webhooks/lemonsqueezy`

---

## 빌드 스크립트

| 스크립트 | 명령어 | 설명 |
|---------|--------|------|
| `npm run dev` | `next dev` | 개발 서버 실행 |
| `npm run build` | `eslint && next build` | ESLint 검사 후 프로덕션 빌드 |
| `npm run start` | `next start` | 프로덕션 서버 실행 |
| `npm run lint` | `eslint` | ESLint 실행 |
| `npm run format` | `prettier --write .` | 코드 포맷팅 |
| `npm run build:ce` | 크롬 익스텐션 빌드 | 별도 문서 참조 |

---

## 배포

### Vercel

`vercel.json` 설정:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

main 브랜치에 push하면 Vercel이 자동 배포한다.

### 이미지 최적화

`next.config.ts`에서 다음 외부 이미지 소스를 허용한다:
- Supabase Storage CDN (`*.supabase.co`)
- Unsplash (`images.unsplash.com`)
