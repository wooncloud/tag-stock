# TagStock.ai

AI 기반 스톡 사진 메타데이터 자동 생성 도구

## 기능

- 🤖 **AI 자동 태깅**: Google Gemini 3.0 Flash를 사용한 정확한 키워드 생성
- 📝 **메타데이터 생성**: SEO 최적화된 제목과 설명 자동 생성
- 🖼️ **IPTC 임베딩**: Pro 플랜으로 메타데이터를 이미지에 직접 임베딩 (Phase 2)
- 📤 **멀티 업로드**: 여러 이미지 일괄 처리 (Phase 2)
- 💳 **Stripe 결제**: Free/Pro 플랜 (Phase 3)

## Phase 1 완료 항목

✅ Next.js 15 프로젝트 초기화 (App Router, TypeScript, Tailwind CSS)
✅ Supabase 인증 설정 (OAuth: Google, Apple, X)
✅ 데이터베이스 스키마 및 RLS 정책
✅ 인증 미들웨어 및 보호된 라우트
✅ Shadcn/UI 컴포넌트 통합
✅ 랜딩 페이지 (Hero, Features, Pricing)
✅ 대시보드 레이아웃 및 쉘
✅ Vercel 배포 설정

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase 프로젝트 설정

#### 3.1 프로젝트 생성
1. https://supabase.com 접속
2. "New project" 생성
3. Project settings → API에서 URL과 anon key 복사

#### 3.2 데이터베이스 스키마 적용
Supabase SQL Editor에서 `supabase/migrations/20240113_initial_schema.sql` 파일의 SQL을 실행하세요.

#### 3.3 OAuth 제공자 설정

**Google OAuth:**
1. [Google Cloud Console](https://console.cloud.google.com) → 새 프로젝트 생성
2. OAuth consent screen 설정
3. Credentials → OAuth 2.0 Client ID 생성
4. Authorized redirect URIs:
   - `https://<project-ref>.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback`
5. Supabase Dashboard → Authentication → Providers → Google 활성화

**Apple OAuth:**
1. [Apple Developer](https://developer.apple.com/account) → Services IDs 생성
2. Sign in with Apple 구성
3. Return URLs 설정
4. Supabase Dashboard → Authentication → Providers → Apple 활성화

**X (Twitter) OAuth:**
1. [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard) → 앱 생성
2. OAuth 2.0 활성화
3. Callback URLs 설정
4. Supabase Dashboard → Authentication → Providers → Twitter 활성화

#### 3.4 Storage 버킷 생성
1. Supabase Dashboard → Storage → "New bucket"
2. Bucket name: `images`
3. Public: `false`
4. File size limit: `50 MB`

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 앱을 확인하세요.

### 5. 프로덕션 빌드

```bash
npm run build
npm run start
```

## Vercel 배포

### 1. Vercel에 프로젝트 연결
```bash
npm install -g vercel
vercel
```

### 2. 환경 변수 설정
Vercel Dashboard → Project Settings → Environment Variables에서 다음 변수를 추가:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (Vercel 도메인)

### 3. OAuth Redirect URIs 업데이트
각 OAuth 제공자의 설정에 Vercel 도메인 추가:
- `https://your-app.vercel.app/auth/callback`

### 4. Supabase Site URL 설정
Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `https://your-app.vercel.app`

## 프로젝트 구조

```
tag-stock/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 랜딩 페이지
│   ├── layout.tsx           # 루트 레이아웃
│   ├── auth/
│   │   └── callback/        # OAuth 콜백
│   ├── dashboard/           # 대시보드 (보호된 라우트)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/
│       └── auth/signout/    # 로그아웃 API
├── components/
│   ├── ui/                  # Shadcn/UI 컴포넌트
│   ├── auth/                # 인증 컴포넌트
│   ├── layout/              # 레이아웃 컴포넌트
│   └── dashboard/           # 대시보드 컴포넌트
├── lib/
│   ├── supabase/            # Supabase 클라이언트
│   └── utils.ts             # 유틸리티 함수
├── types/                   # TypeScript 타입 정의
├── supabase/
│   └── migrations/          # 데이터베이스 마이그레이션
└── middleware.ts            # Next.js 미들웨어
```

## 기술 스택

- **프레임워크**: Next.js 15 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS, Shadcn/UI
- **인증**: Supabase Auth (OAuth)
- **데이터베이스**: Supabase (PostgreSQL)
- **스토리지**: Supabase Storage
- **배포**: Vercel

## 다음 단계 (Phase 2)

- [ ] 이미지 업로드 기능 (드래그 & 드롭)
- [ ] Google Gemini 3.0 Flash API 연동
- [ ] AI 자동 태깅 구현
- [ ] 메타데이터 표시 및 편집
- [ ] CSV 내보내기

## 다음 단계 (Phase 3)

- [ ] Stripe 결제 연동
- [ ] Pro 플랜 업그레이드
- [ ] IPTC 메타데이터 임베딩
- [ ] 크레딧 시스템 완성

## 라이선스

MIT
