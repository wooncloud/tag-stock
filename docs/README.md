# TagStock

AI 기반 스톡 사진 메타데이터 자동 생성 및 관리 도구

---

## 📽️ 프로젝트 소개
TagStock은 스톡 사진작가들을 위한 AI 기반 메타데이터 생성 도구입니다. **Google Gemini 3 Flash**를 사용하여 업로드된 이미지를 인식하고, Adobe Stock 및 Shutterstock 등 주요 스톡 사이트에 최적화된 **제목, 설명, 키워드**를 자동으로 생성합니다.

---

## ✨ 핵심 기능

### 1. 🤖 AI 자동 태깅 시스템
- **Gemini 3 Flash 연동**: 최신 비전 AI 모델을 통한 정확한 이미지 분석
- **SEO 최적화**: 스톡 사진 시장의 트렌드를 반영한 가독성 높은 메타데이터 생성
- **다국어 지원**: 글로벌 시장을 겨냥한 영어 기반 메타데이터 생성

### 2. 🖼️ 이미지 관리 및 편집
- **드래그 & 드롭 업로드**: 브라우저 기반의 간편한 멀티 이미지 업로드
- **메타데이터 실시간 편집**: AI가 생성한 내용을 사용자가 즉시 수정 및 보완
- **이미지 미리보기**: 업로드된 이미지와 세부 메타데이터를 한눈에 확인

### 3. 💳 구독 및 크레딧 시스템
- **플랜별 차등 혜택**: Free (10개), Pro (500개), Max (무제한) 플랜 지원
- **Lemon Squeezy 결제**: 안전하고 간편한 글로벌 결제 솔루션 도입
- **월간 자동 리셋**: Supabase Edge Functions를 이용한 매월 1일 크레딧 자동 갱신

### 4. 🛠️ 기술적 특징
- **IPTC 메타데이터 임베딩**: 이미지 파일 자체에 정보를 직접 주입 (Phase 2/3)
- **실시간 데이터 동기화**: Supabase를 이용한 빠르고 안정적인 DB 관리
- **반응형 디자인**: Shadcn/UI 기반의 모던하고 직관적인 대시보드

---

## 🚀 시작하기

### 1. 로컬 환경 설정
의존성 패키지를 설치합니다:
```bash
npm install
```

### 2. 환경 변수 설정 (`.env.local`)
`.env.example`을 참고하여 프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your_gemini_api_key

# Lemon Squeezy
LEMON_SQUEEZY_API_KEY=your_api_key
LEMON_SQUEEZY_STORE_ID=your_store_id
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret

# Edge Function Cron Auth
CRON_SECRET=your_random_string

# Discord Webhook (Alerts)
DISCORD_WEBHOOK_URL=your_webhook_url
```

### 3. Supabase 설정
1. **Migrations**: `supabase/migrations` 폴더의 SQL 파일들을 Supabase SQL Editor에서 순서대로 실행합니다.
2. **Extensions**: `pg_cron`, `pg_net` 확장을 활성화합니다.
3. **Storage**: `user-images` 버킷을 생성합니다.

---

## 📂 프로젝트 구조

```
tag-stock/
├── app/                  # Next.js App Router (Pages, Actions, APIs)
├── components/           # UI 및 비즈니스 컴포넌트
│   ├── dashboard/        # 대시보드 전용 컴포넌트 (Gallery, Upload, Pricing)
│   ├── landing/          # 랜딩 페이지 섹션
│   └── ui/               # Shadcn/UI 기초 컴포넌트
├── lib/                  # 핵심 로직 (Supabase, Gemini, Lemon Squeezy, IPTC)
├── supabase/             
│   ├── functions/        # Edge Functions (Credit Reset 등)
│   └── migrations/       # DB 스키마 및 RLS 정책
├── types/                # TypeScript 타입 정의
└── docs/                 # 프로젝트 문서 및 가이드
```

---

## 🛠 기술 스택

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Supabase (Auth, DB, Storage, Edge Functions)
- **AI**: Google Gemini 3 Flash API
- **Payments**: Lemon Squeezy
- **Deployment**: Vercel

---

## 📈 로드맵

### ✅ Phase 1: 기반 구축 (완료)
- Next.js 및 Supabase 초기화
- OAuth 소셜 로그인 (Google, Apple) 연동
- 기본 랜딩 페이지 및 대시보드 레이아웃 구축

### ✅ Phase 2: AI 핵심 기능 (완료)
- Gemini AI 기반 자동 태그 생성 엔진 개발
- 이미지 업로드 및 메타데이터 관리 대시보드 구현
- 실시간 메타데이터 편집 기능 추가

### 🔄 Phase 3: 상용화 및 고도화 (진행 중)
- Lemon Squeezy 기반 구독 모델 구축
- 매월 크레딧 자동 리셋 자동화 (Edge Function)
- 이미지 IPTC 메타데이터 임베딩 기능 안정화
- CSV/Excel 내보내기 및 스톡 사이트 연동 최적화

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
