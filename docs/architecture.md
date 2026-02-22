# 아키텍처

## 개요

TagStock은 스톡 사진작가를 위한 AI 기반 메타데이터 자동 생성 도구이다. Google Gemini AI로 이미지를 분석하여 Adobe Stock, Shutterstock 등 주요 스톡 플랫폼에 최적화된 제목과 키워드를 생성하고, IPTC/XMP 메타데이터를 이미지 파일에 직접 임베딩할 수 있다.

**서비스 URL:** https://tagstock.app

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 언어 | TypeScript 5, React 19 |
| 스타일링 | Tailwind CSS v4, Shadcn/UI (Radix UI) |
| 인증 | Supabase Auth (Google, Apple OAuth) |
| 데이터베이스 | Supabase (PostgreSQL + RLS) |
| AI | Google Gemini Flash (`@google/generative-ai`) |
| 결제 | Lemon Squeezy (`@lemonsqueezy/lemonsqueezy.js`) |
| 배포 | Vercel (리전: iad1) |
| 크롬 익스텐션 | Vite 5 + TypeScript + Manifest V3 |
| 알림 | Discord Webhooks |
| 애널리틱스 | Google Analytics (GA4) |

---

## 디렉토리 구조

```
tag-stock/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 랜딩 페이지
│   ├── layout.tsx                # 루트 레이아웃 (GA4, 테마)
│   ├── login/                    # 로그인 페이지
│   ├── dashboard/                # 대시보드 (인증 필수)
│   ├── blog/                     # 블로그 (MDX)
│   ├── contact/                  # 문의 페이지
│   ├── privacy/, terms/          # 정적 페이지
│   ├── auth/callback/            # OAuth 콜백
│   ├── api/
│   │   ├── generate/             # AI 메타데이터 생성 API
│   │   ├── credits/              # 크레딧 조회 API
│   │   ├── auth/signout/         # 로그아웃 API
│   │   └── webhooks/lemonsqueezy/# 결제 웹훅
│   └── actions/                  # Server Actions
│       ├── auth.ts               # 로그아웃
│       ├── contact.ts            # 문의 폼 전송
│       └── lemonsqueezy.ts       # 체크아웃 생성
│
├── components/
│   ├── ui/                       # Shadcn/UI 기본 컴포넌트
│   ├── landing/                  # 랜딩 페이지 섹션
│   ├── dashboard/                # 대시보드 컴포넌트
│   │   └── pricing/              # 가격 카드, 크레딧팩
│   ├── blog/                     # 블로그 컴포넌트
│   └── layout/                   # Header, Footer
│
├── lib/                          # 핵심 라이브러리
│   ├── supabase/                 # Supabase 클라이언트 (client, server, middleware, auth)
│   ├── blog/                     # MDX 파싱, 캐싱
│   ├── plan-limits.ts            # 플랜별 크레딧/기능 제한
│   ├── lemonsqueezy.ts           # Lemon Squeezy SDK 초기화
│   └── validations/              # Zod 스키마
│
├── services/                     # 비즈니스 로직 서비스
│   ├── gemini.ts                 # Gemini AI 통합
│   ├── prompts/                  # 사이트별 AI 프롬프트
│   │   ├── adobe.ts              # Adobe Stock 최적화 프롬프트
│   │   ├── shutterstock.ts       # Shutterstock 최적화 프롬프트
│   │   └── local.ts              # 로컬/대시보드 프롬프트
│   ├── billing/                  # 결제 서비스
│   │   ├── plans.ts              # Variant ID <-> 플랜 매핑
│   │   ├── subscription.ts       # 구독 라이프사이클
│   │   ├── credits.ts            # 크레딧 부여/차감
│   │   └── webhook-events.ts     # 멱등성 추적
│   └── discord.ts                # Discord 웹훅
│
├── types/                        # TypeScript 타입 정의
│   ├── database.types.ts         # Supabase 자동 생성 타입
│   └── database.ts               # 커스텀 타입 (Profile, UsageLog 등)
│
├── content/blog/                 # MDX 블로그 게시물 (10개)
│
├── supabase/
│   ├── functions/                # Edge Functions
│   │   └── reset-monthly-credits/# 월간 크레딧 리셋
│   └── migrations/               # SQL 마이그레이션
│
├── chrome_extansion/             # 크롬 익스텐션 (별도 문서 참조)
│
├── middleware.ts                 # 인증 미들웨어 (세션 갱신)
├── .env.example                  # 환경 변수 템플릿
├── vercel.json                   # Vercel 배포 설정
└── package.json
```

---

## 라우트 구성

### 공개 페이지

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 (Hero, Features, Pricing, Extension 소개) |
| `/login` | OAuth 로그인 (Google, Apple) |
| `/blog` | 블로그 목록 |
| `/blog/[slug]` | 개별 블로그 게시물 (MDX) |
| `/contact` | 문의 폼 + FAQ |
| `/privacy` | 개인정보처리방침 |
| `/terms` | 이용약관 |

### 인증 필요 페이지

| 경로 | 설명 |
|------|------|
| `/dashboard` | 사용자 대시보드 (크레딧 현황, 가격 플랜, 익스텐션 안내) |

### API 엔드포인트

| 엔드포인트 | 메서드 | 인증 | 설명 |
|-----------|--------|------|------|
| `/api/generate` | POST | Bearer Token | AI 메타데이터 생성 (1크레딧 소모) |
| `/api/credits` | GET | Bearer Token | 사용자 크레딧 잔액 조회 |
| `/api/auth/signout` | POST | Session | 로그아웃 및 쿠키 정리 |
| `/auth/callback` | GET | - | OAuth 콜백 핸들러 |
| `/api/webhooks/lemonsqueezy` | POST | HMAC Signature | Lemon Squeezy 결제 웹훅 |

---

## 데이터베이스 스키마

### profiles

사용자 프로필 및 구독 정보를 저장한다.

```sql
id                          uuid (PK)
email                       text
plan                        'free' | 'pro' | 'max'
credits_subscription        integer     -- 월간 구독 크레딧
credits_purchased           integer     -- 구매한 크레딧 (만료 없음)
lemon_squeezy_subscription_id  text     -- 구독 ID
subscription_management_url    text     -- 구독 관리 URL
subscription_status            text     -- active, cancelled, expired 등
created_at                  timestamp
updated_at                  timestamp
```

### images

업로드된 이미지 추적 테이블.

```sql
id              uuid (PK)
user_id         uuid (FK -> profiles)
storage_path    text
status          'pending' | 'processing' | 'completed' | 'failed'
created_at      timestamp
```

### metadata

생성된 메타데이터를 저장한다.

```sql
id              uuid (PK)
image_id        uuid (FK -> images)
tags            jsonb       -- 키워드 배열
title           text
description     text
created_at      timestamp
```

### usage_logs

크레딧 사용 이력을 기록한다.

```sql
id              uuid (PK)
user_id         uuid (FK -> profiles)
action          'generate' | 'embed' | 'download'
site_type       text        -- 'adobe' | 'shutterstock' | 'local'
credits_used    integer
created_at      timestamp
```

### webhook_events

웹훅 이벤트 멱등성 추적 테이블.

```sql
id              uuid (PK)
event_id        text (unique)
event_type      text
provider        text        -- 'lemonsqueezy'
processed_at    timestamp
payload         jsonb
```

### RPC 함수

| 함수 | 설명 |
|------|------|
| `decrement_user_credits()` | 크레딧 원자적 차감 (구독 크레딧 우선 소모) |
| `add_subscription_credits()` | 크레딧 원자적 부여 |
| `check_and_insert_webhook_event()` | 웹훅 이벤트 멱등성 체크 및 기록 |

---

## 인증 시스템

### OAuth 플로우

1. 사용자가 `/login`에서 Google/Apple 로그인 버튼 클릭
2. Supabase Auth가 OAuth 플로우 처리
3. `/auth/callback`에서 인증 코드를 세션 쿠키로 교환
4. `middleware.ts`가 모든 요청에서 세션을 자동 갱신

### 인증 방식별 클라이언트

| 컨텍스트 | 인증 방식 | 클라이언트 |
|----------|----------|-----------|
| 브라우저 | httpOnly 쿠키 | `lib/supabase/client.ts` |
| Server Component / Action | 쿠키 | `lib/supabase/server.ts` |
| API Route | Bearer Token | `lib/supabase/api-auth.ts` |
| 크롬 익스텐션 | Bearer Token | Chrome Storage에 토큰 저장 |

---

## AI 태깅 시스템

### Gemini 연동

- **모델:** `gemini-flash-latest` (Google Gemini 3 Flash)
- **입력:** 이미지 base64
- **출력:** `{ title: string, keyword: string[] }`

### 사이트별 프롬프트

| 사이트 | 프롬프트 파일 | 특징 |
|--------|-------------|------|
| Adobe Stock | `services/prompts/adobe.ts` | 상업적/에디토리얼 키워드, 종/인물 특성 강조 |
| Shutterstock | `services/prompts/shutterstock.ts` | 컨셉 키워드, 라이프스타일 강조 |
| Local | `services/prompts/local.ts` | 범용 메타데이터 |

### 플랜별 제한

| 플랜 | 최대 키워드 수 | IPTC 임베딩 |
|------|--------------|------------|
| Free | 20 | 불가 |
| Pro | 50 | 가능 |
| Max | 50 | 가능 |

### 생성 파이프라인

1. 이미지 base64 인코딩
2. 사이트 타입에 맞는 프롬프트 선택
3. Gemini API 호출
4. JSON 파싱 및 키워드 중복 제거
5. 플랜 기반 키워드 수 제한 적용
6. 제목 200자 제한 적용

---

## 결제 시스템

### 플랜 구성

| 플랜 | 가격 | 월간 크레딧 | 주요 기능 |
|------|------|------------|----------|
| Free | $0 | 10 | 기본 AI 태깅 (~20 키워드), IPTC 임베딩 |
| Pro | $5/월 | 500 | 고급 AI (~50 키워드), 배치 처리, 멀티 업로드 |
| Max | $19/월 | 2,000 | 우선 지원, 신기능 조기 액세스 |

### 크레딧 팩 (1회 구매)

| 팩 | 크레딧 | 가격 |
|----|--------|------|
| Credit Pack S | 100 | $2 |
| Credit Pack L | 1,000 | $15 |

### 크레딧 정책

- 1 크레딧 = 1회 이미지 메타데이터 생성
- **소모 우선순위:** 구독 크레딧 -> 구매 크레딧
- 구독 크레딧은 매월 1일 리셋 (이월 불가, Max 플랜 제외)
- 구매 크레딧은 만료 없음
- Max 플랜: 최대 1,000 크레딧 이월 가능

### 월간 크레딧 리셋 (Edge Function)

`supabase/functions/reset-monthly-credits/index.ts`

- **트리거:** 매월 1일 cron (`CRON_SECRET`으로 인증)
- **로직:**
  - Free / 비활성 구독: 10 크레딧 (리셋)
  - Pro + active: 500 크레딧 (리셋, 이월 없음)
  - Max + active: 기존 크레딧 이월(최대 1,000) + 2,000 부여
- **알림:** Discord 웹훅으로 처리 결과 전송

### Lemon Squeezy 웹훅

처리하는 이벤트:

| 이벤트 | 처리 내용 |
|--------|----------|
| `subscription_created` | 플랜 업그레이드, 크레딧 부여 |
| `subscription_updated` | 플랜 변경 반영 |
| `subscription_payment_success` | 월간 결제 성공 시 크레딧 갱신 |
| `subscription_cancelled` | 구독 취소 처리 |
| `subscription_expired` | 구독 만료, Free로 전환 |
| `order_created` | 크레딧 팩 구매, 즉시 크레딧 부여 |

시그니처 검증: `x-signature` 헤더의 HMAC-SHA256 값 확인.

---

## 블로그 시스템

- **포맷:** MDX (Markdown + JSX)
- **위치:** `content/blog/`
- **게시물 수:** 10개
- **렌더링:** `next-mdx-remote`를 통한 서버 사이드 렌더링
- **캐싱:** 개발 환경 5초 TTL, 프로덕션은 빌드 타임 캐싱

### Frontmatter 형식

```yaml
---
title: 게시물 제목
description: 간단한 설명
author: 작성자
date: 2024-02-01
category: Tutorial
tags: [tag1, tag2]
---
```
