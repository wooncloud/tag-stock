# TagStock 설정 가이드

Phase 2 구현을 위한 전체 설정 가이드입니다.

## 필수 요구 사항

- Node.js 20 이상 설치
- npm 또는 yarn 패키지 관리자
- Supabase 계정
- Google Cloud 계정 (Gemini API용)
- Stripe 계정
- Vercel 계정 (배포용)

## 단계별 설정

### 1. 클론 및 의존성 설치

```bash
# 의존성 설치
npm install

# 설치 확인
npm run dev
```

### 2. Supabase 설정

#### A. Supabase 프로젝트 생성
1. [Supabase 대시보드](https://app.supabase.com/)로 이동합니다.
2. 새 프로젝트를 생성합니다.
3. 데이터베이스 프로비저닝이 완료될 때까지 기다립니다.

#### B. 데이터베이스 마이그레이션 실행
1. Supabase 대시보드에서 SQL Editor를 엽니다.
2. `supabase/migrations/20260113_phase2_schema.sql` 내용을 복사하여 실행합니다.
3. `supabase/migrations/20260113_storage_setup.sql` 내용을 복사하여 실행합니다.
4. 테이블이 생성되었는지 확인합니다: `profiles`, `images`, `metadata`
5. 스토리지 버킷이 생성되었는지 확인합니다: `user-images`

#### C. API 키 가져오기
Settings > API로 이동하여 다음 항목을 복사합니다:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Service Role 섹션에서 확인)

#### D. OAuth 제공자 구성
1. Authentication > Providers로 이동합니다.
2. Google OAuth를 활성화합니다:
   - [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 자격 증명을 생성합니다.
   - 승인된 리디렉션 URI 추가: `https://[your-project].supabase.co/auth/v1/callback`
   - 클라이언트 ID와 클라이언트 비밀번호를 Supabase에 복사합니다.
3. (선택 사항) Apple OAuth를 활성화합니다.
4. (선택 사항) X (Twitter) OAuth를 활성화합니다.

### 3. Google Gemini AI 설정

1. [Google AI Studio](https://makersuite.google.com/app/apikey)로 이동합니다.
2. 새 API 키를 생성합니다.
3. API 키를 `GOOGLE_GEMINI_API_KEY`로 복사합니다.

**참고**: 무료 티어 제한:
- 분당 60회 요청
- 하루 1,500회 요청

### 4. Stripe 설정

#### A. Stripe 계정 생성
1. [Stripe 대시보드](https://dashboard.stripe.com/)에서 회원가입합니다.
2. 비즈니스 인증을 완료합니다 (프로덕션 환경용).

#### B. 제품 및 가격 생성
1. Products > Add Product로 이동합니다.

**Pro 월간 요금제**:
- 이름: "TagStock Pro Monthly"
- 설명: "IPTC 메타데이터 임베딩이 포함된 무제한 AI 기반 이미지 태깅"
- 가격: $19.00 USD / 월
- 결제: 매월 반복
- 가격 ID 복사 → `NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID`

**Pro 연간 요금제**:
- 이름: "TagStock Pro Yearly"
- 설명: "IPTC 메타데이터 임베딩이 포함된 무제한 AI 기반 이미지 태깅"
- 가격: $190.00 USD / 년
- 결제: 매년 반복
- 가격 ID 복사 → `NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID`

#### C. API 키 가져오기
Developers > API Keys로 이동합니다:
- 공개 키(Publishable key) 복사 → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- 비밀 키(Secret key) 복사 → `STRIPE_SECRET_KEY`

#### D. 웹훅 구성
1. Developers > Webhooks로 이동합니다.
2. 엔드포인트 추가: `https://your-domain.com/api/webhooks/stripe`
3. 이벤트 선택:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. 서명 비밀 키(Signing secret) 복사 → `STRIPE_WEBHOOK_SECRET`

**로컬 개발 환경 설정**:
```bash
# Stripe CLI 설치
brew install stripe/stripe-cli/stripe

# 로그인
stripe login

# 웹훅 전달
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 터미널에서 웹훅 서명 비밀 키 복사
```

### 5. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 앱 설정
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Stripe 설정
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key

# Stripe 가격 ID
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_xxx
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_xxx
```

### 6. 애플리케이션 테스트

```bash
# 개발 서버 시작
npm run dev

# 브라우저 열기
open http://localhost:3000
```

#### 테스트 체크리스트:
- [ ] 랜딩 페이지 로드 확인
- [ ] OAuth 로그인 작동 확인 (Google/Apple/X)
- [ ] 로그인 후 대시보드 표시 확인
- [ ] 크레딧이 정확하게 표시되는지 확인 (무료 사용자의 경우 10)
- [ ] 업로드 페이지 접속 가능 확인
- [ ] 이미지 업로드 작동 확인
- [ ] 드래그 앤 드롭 기능 확인
- [ ] AI 메타데이터 생성 완료 확인
- [ ] 메타데이터가 이미지 페이지에 표시되는지 확인
- [ ] 클립보드 복사 기능 확인
- [ ] 원본 이미지 다운로드 확인
- [ ] 요금제 페이지 표시 확인
- [ ] Stripe 체크아웃 연결 확인 (테스트 모드)
- [ ] 구독 웹훅이 프로필을 업데이트하는지 확인
- [ ] 구독 후 Pro 기능이 활성화되는지 확인
- [ ] IPTC 임베딩 작동 확인 (Pro 전용)
- [ ] 메타데이터가 포함된 다운로드 확인
- [ ] 빌링 포털 접속 가능 확인
- [ ] 이미지 삭제 기능 확인

### 7. ExifTool 설치 (IPTC 임베딩용)

`exiftool-vendored` 패키지가 이를 자동으로 처리해야 하지만, 문제가 발생할 경우:

#### macOS:
```bash
brew install exiftool
```

#### Ubuntu/Debian:
```bash
sudo apt-get install libimage-exiftool-perl
```

#### Windows:
[ExifTool 웹사이트](https://exiftool.org/)에서 다운로드하세요.

### 8. 프로덕션 배포 (Vercel)

#### A. 배포 준비
```bash
# 로컬에서 프로덕션 빌드 테스트
npm run build
npm run start
```

#### B. Vercel로 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 또는 Vercel 대시보드 사용
# 1. GitHub 저장소 연결
# 2. 프로젝트 가져오기
# 3. 환경 변수 추가
# 4. 배포
```

#### C. 환경 변수 업데이트
Vercel 대시보드에 모든 `.env.local` 변수를 추가합니다:
- Settings > Environment Variables
- Production, Preview, Development 환경에 대해 추가

#### D. URL 업데이트
배포 후:
1. `NEXT_PUBLIC_APP_URL`을 Vercel URL로 업데이트합니다.
2. Supabase OAuth 리디렉션 URL을 업데이트합니다.
3. Stripe 웹훅 엔드포인트 URL을 업데이트합니다.
4. 모든 OAuth 제공자를 테스트합니다.
5. Stripe 체크아웃 흐름을 테스트합니다.

### 9. 데이터베이스 유지 관리

#### 백업 전략
```sql
-- 자동 백업 (Supabase Pro)
-- 시점 복구(Point-in-time recovery) 가능

-- 수동 백업
-- Dashboard > Database > Backups
```

#### 모니터링
```sql
-- 테이블 크기 확인
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public';

-- 스토리지 사용량 확인
SELECT * FROM storage.buckets;
```

## 문제 해결

### 이슈: OAuth 로그인 실패
**해결 방법**:
- OAuth 제공자 설정에서 리디렉션 URL을 확인합니다.
- Supabase Auth 구성을 확인합니다.
- OAuth 자격 증명이 올바른지 확인합니다.

### 이슈: 이미지 업로드 실패
**해결 방법**:
- Supabase Storage RLS 정책을 확인합니다.
- 파일 크기 제한을 확인합니다 (최대 50MB).
- 지원되는 파일 형식인지 확인합니다.
- 스토리지 버킷이 존재하는지 확인합니다.

### 이슈: AI 메타데이터 생성 실패
**해결 방법**:
- Google Gemini API 키를 확인합니다.
- API 속도 제한을 확인합니다.
- 이미지가 유효한 형식인지 확인합니다.
- 서버 로그에서 오류를 확인합니다.

### 이슈: IPTC 임베딩 실패
**해결 방법**:
- ExifTool이 설치되어 있는지 확인합니다.
- 사용자가 Pro 플랜을 사용 중인지 확인합니다.
- 메타데이터가 존재하는지 확인합니다.
- 임시 디렉토리 권한을 확인합니다.

### 이슈: Stripe 웹훅이 작동하지 않음
**해결 방법**:
- 웹훅 엔드포인트 URL을 확인합니다.
- 웹훅 서명 비밀 키를 확인합니다.
- 로컬 테스트를 위해 Stripe CLI를 사용합니다.
- Vercel 함수 로그를 확인합니다.
- Service Role 키가 설정되어 있는지 확인합니다.

### 이슈: 크레딧이 업데이트되지 않음
**해결 방법**:
- RPC 함수 `decrement_user_credits`를 확인합니다.
- 프로필 레코드가 존재하는지 확인합니다.
- 구독 웹훅 처리 로직을 확인합니다.
- 크레딧 계산을 수동으로 테스트합니다.

## 보안 체크리스트

- [ ] 모든 API 키가 환경 변수에 저장되었는가
- [ ] 모든 테이블에 RLS 정책이 활성화되었는가
- [ ] 스토리지 버킷 정책이 구성되었는가
- [ ] OAuth 제공자가 올바르게 구성되었는가
- [ ] Stripe 웹훅 서명 검증이 이루어지는가
- [ ] 모든 폼에 입력 값 검증이 있는가
- [ ] 파일 업로드 크기 제한이 적용되었는가
- [ ] Service Role 키가 비밀로 유지되는가
- [ ] CORS가 올바르게 구성되었는가
- [ ] 속도 제한(Rate Limiting)이 구현되었는가

## 성능 최적화

### 이미지 처리
- 효율적인 처리를 위해 Sharp를 사용합니다.
- 다중 업로드를 위한 배치 처리를 구현합니다.
- 대용량 파일의 경우 백그라운드 작업을 고려합니다.

### 데이터베이스
- 주요 필드에 이미 인덱스가 생성되어 있습니다.
- 특정 컬럼만 선택하는 `select()`를 사용합니다.
- 대용량 데이터셋의 경우 페이지네이션을 구현합니다.

### 캐싱
- 이미지를 위한 스토리지 CDN을 사용합니다.
- 적절한 만료 시간이 있는 서명된 URL을 사용합니다.
- 페션 데이터를 위해 Redis를 고려합니다 (향후 사양).

## 모니터링 및 분석

### Supabase 대시보드
- 데이터베이스 성능 모니터링
- 스토리지 사용량 확인
- 인증 로그 검토
- API 사용량 추적

### Stripe 대시보드
- 구독 지표 모니터링
- 매출 추적
- 실패한 결제 검토
- 이탈률(Churn rate) 확인

### Vercel 분석
- 함수 실행 시간
- 오류율
- 빌드 성능
- 트래픽 패턴

## 지원 리소스

- **Supabase 문서**: https://supabase.com/docs
- **Next.js 문서**: https://nextjs.org/docs
- **Stripe 문서**: https://stripe.com/docs
- **Google AI 문서**: https://ai.google.dev/docs
- **Shadcn/UI**: https://ui.shadcn.com/

## 다음 단계

설정을 완료한 후:
1. 모든 기능을 철저히 테스트합니다.
2. 베타 사용자를 초대합니다.
3. 피드백을 수집합니다.
4. Phase 3 (기술 감사)를 진행합니다.
5. 지표를 기반으로 최적화합니다.
6. 프로덕션에 출시합니다.

---

**도움이 필요하신가요?** 구현 세부 사항은 [PHASE2_COMPLETE.md](./PHASE2_COMPLETE.md)를 확인하세요.
