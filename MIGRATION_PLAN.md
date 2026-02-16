# TagStock 아키텍처 전환 계획서

> **작성일**: 2026-02-16 (Updated: 2026-02-16)
> **목표**: 웹 앱 중심 → 크롬 익스텐션 중심 아키텍처로 전환
> **현재 상태**: 고객 Zero-base → 레거시 마이그레이션 부담 없이 최적 설계 가능

---

## 📌 배경 및 문제 인식

### 현재 구조의 문제점

1. **스토리지 비용 문제**
   - Pro/Max 플랜은 이미지 원본(20~50MB)을 Supabase Storage에 영구 보관
   - IPTC 임베딩 시 `-embedded` 복사본 생성 → 파일당 최대 ~100MB 사용
   - Supabase Pro ($25/월) 기준 100GB 포함, 초과분 $0.021/GB/월
   - 사용자 100명 × 100장 × 평균 20MB = **~200GB** → 월 추가 비용 발생
   - 사용자 증가에 따라 비용이 선형적으로 증가하여 **사업성 저해**

2. **API 키 노출 위험**
   - 현재 익스텐션은 Gemini API 키를 빌드 시 하드코딩 (`import.meta.env.VITE_GEMINI_API_KEY`)
   - 크롬 웹 스토어 배포 시 `.crx` 파일 압축 해제로 키 추출 가능
   - 네트워크 탭에서 API 요청 헤더에 키 노출
   - 악용 시 **Google Cloud 요금 폭탄** 위험

---

## 🎯 전환 방향

### 핵심 결정사항

| 항목 | 변경 전 | 변경 후 |
|---|---|---|
| **주 상품** | 웹 앱 (Next.js) | 크롬 익스텐션 |
| **웹 앱 역할** | 이미지 업로드/관리/다운로드 | 마케팅 + 결제 + API 프록시 허브 |
| **이미지 저장** | Supabase Storage (영구 보관) | 저장하지 않음 (zero storage) |
| **AI 분석** | 서버에서 원본 이미지로 분석 | 익스텐션에서 리사이즈 후 서버 프록시 경유 |
| **IPTC 임베딩** | 서버 ExifTool (네이티브 바이너리) | 브라우저 JS 라이브러리 (로컬 처리) |
| **API 키 관리** | 익스텐션에 하드코딩 | 서버에만 보관 (프록시 패턴) |

### 전환 후 아키텍처 다이어그램

```
┌────────────────────────────────────────────────────────────────┐
│                   Chrome Extension (주 상품)                     │
│                                                                  │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────────┐  │
│  │ 로컬 파일    │     │ 스톡 사이트   │     │ 익스텐션 전용    │  │
│  │ 선택 페이지   │     │ 자동 입력     │     │ 대시보드 페이지  │  │
│  └──────┬──────┘     └──────────────┘     └─────────────────┘  │
│         │                                                        │
│         ▼                                                        │
│  ┌──────────────────────────────────────┐                       │
│  │ 이미지 처리 파이프라인 (브라우저 내)    │                       │
│  │                                       │                       │
│  │  1. Canvas API로 리사이즈 (~200KB)    │                       │
│  │  2. 서버 프록시로 AI 분석 요청         │                       │
│  │  3. 메타데이터 결과 수신              │                       │
│  │  4. JS 라이브러리로 IPTC 로컬 삽입    │                       │
│  │  5. 로컬 다운로드 또는 폼 자동 입력    │                       │
│  └──────────────────────────────────────┘                       │
└────────────────────────────────────────────────────────────────┘
           │ (리사이즈된 작은 이미지만 전송)
           ▼
┌────────────────────────────────────────────────────────────────┐
│               Next.js Web App (허브 역할)                        │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────┐  │
│  │ 랜딩 페이지     │  │ 결제/구독 관리  │  │ API 프록시        │  │
│  │ (마케팅/SEO)    │  │ (Lemon Squeezy) │  │ /api/generate    │  │
│  └────────────────┘  └────────────────┘  │ /api/credits     │  │
│                                           └──────────────────┘  │
│  ┌────────────────┐  ┌────────────────┐                        │
│  │ 로그인/회원가입  │  │ 사용 통계      │  ❌ 이미지 업로드 제거  │
│  │ (Supabase Auth) │  │ 대시보드       │  ❌ Storage 사용 중단   │
│  └────────────────┘  └────────────────┘                        │
└────────────────────────────────────────────────────────────────┘
```

---

## 📋 구현 계획

### Phase 1: API 프록시 전환 (서버)

> Gemini API 호출을 서버 프록시로 전환하여 API 키 노출 문제 해결

#### 1-1. 서버 API 엔드포인트 생성

- [x] `app/api/generate/route.ts` 생성 (또는 기존 구조 활용)
  - Supabase JWT 인증 검증
  - 크레딧 잔여량 확인 및 차감
  - 리사이즈된 이미지(Base64) 수신
  - Gemini API 호출 (서버 환경변수의 API 키 사용)
  - 메타데이터 결과 반환
  - **이미지를 Storage에 저장하지 않음** (메모리에서만 처리)

```
POST /api/generate
Headers: Authorization: Bearer <supabase_access_token>
Body: { imageBase64: string, siteType: 'adobe' | 'shutterstock' | 'local' }
Response: { title: string, keywords: string[], description: string, ... }
```

- [x] `app/api/credits/route.ts` 생성
  - 크레딧 잔여량 조회 API
  - 익스텐션에서 실시간 크레딧 표시에 활용

#### 1-2. 프롬프트 통합

- [x] 현재 프롬프트가 2곳에 분산됨:
  - 웹 앱: `services/prompts/`
  - 익스텐션: `chrome_extansion/src/core/ai/prompts/`
- [x] 서버에 프롬프트를 통합 관리
  - 사이트별(Adobe, Shutterstock) + 로컬 파일용 프롬프트

---

### Phase 2: 익스텐션 AI 호출 구조 전환

> 익스텐션이 Gemini API를 직접 호출하지 않고,서버 프록시를 경유하도록 변경

#### 2-1. Gemini 직접 호출 제거

- [x] `chrome_extansion/src/core/ai/gemini-client.ts` 수정
  - Gemini SDK 직접 호출 → `fetch('https://tagstock.app/api/generate')` 로 변경
  - Supabase access token을 Authorization 헤더에 포함
- [x] `VITE_GEMINI_API_KEY` 환경변수 제거
- [x] `@google/genai` 패키지 제거 (익스텐션에서)

#### 2-2. 이미지 리사이즈 로직 추가

- [x] `chrome_extansion/src/core/utils/image.ts`에 리사이즈 함수 추가
  - Canvas API 사용
  - AI 분석용: 긴 변 기준 1024~2048px, JPEG 품질 0.8 → ~200KB 이하
  - 원본 이미지는 로컬 메모리에 유지 (IPTC 삽입용)

---

### Phase 3: 로컬 파일 처리 기능 (익스텐션 신규 페이지)

> 스톡 사이트에 접속하지 않고도, 로컬 이미지 파일을 직접 처리할 수 있는 전용 페이지 추가
> 단순 업로더가 아닌 **"로컬 이미지 뷰어 + 메타데이터 에디터"** 수준의 완성도를 목표로 한다.

#### 3-1. 익스텐션 전용 페이지 생성

- [ ] `chrome_extansion/src/local/` 디렉토리 생성
  - `local.html` — 로컬 파일 처리 전용 UI
  - `local.ts` — 로직 엔트리포인트
  - `local.css` — 스타일

- [ ] UI 구성 요소:
  - **파일 선택 영역**: 드래그 & 드롭 + 클릭 파일 선택
  - **이미지 썸네일 그리드**: 선택된 파일들의 미리보기 목록
  - **이미지 상세 패널**: 선택된 이미지의 확대 뷰 + 파일 정보 (크기, 해상도, 포맷)
  - **메타데이터 에디터**: AI 분석 결과를 필드별로 표시 및 수동 편집
    - Title 필드
    - Description 필드
    - Keywords 필드 (태그 형태, 개수 표시 e.g. `Keywords(28)`)
  - **액션 버튼**: AI 분석 / IPTC 임베딩 + 다운로드 / 전체 다운로드(ZIP)
  - **배치 상태 표시**: 이미지별 처리 상태 (대기 / 분석 중 / 완료 / 실패)

- [ ] `manifest.json` 업데이트
  - 새 페이지 등록 (chrome_url_overrides 또는 별도 탭 페이지)

#### 3-2. 로컬 파일 처리 파이프라인

```
[사용자 파일 선택 (드래그 & 드롭 또는 파일 다이얼로그)]
    │
    ▼
[File API로 읽기] → ArrayBuffer/Blob으로 메모리에 로드
    │
    ├─→ [Canvas API로 썸네일 생성] → 그리드에 미리보기 표시
    │
    ├─→ [Canvas API 리사이즈] → AI 분석용 작은 이미지 (~200KB)
    │       │
    │       ▼
    │   [서버 프록시 /api/generate] → Gemini AI 분석
    │       │
    │       ▼
    │   [메타데이터 결과 수신] → 에디터 패널에 실시간 표시
    │
    ├─→ [사용자 편집] → 메타데이터 수정 가능
    │
    └─→ [IPTC 임베딩 (Local-First)] → 포맷별 전략 적용 (Phase 4 참조)
            │
            ▼
        [다운로드] → File API로 사용자 로컬에 저장
```

#### 3-3. 배치 처리 흐름

- [ ] 여러 이미지를 대기열(Queue)에 넣고 순차 처리
- [ ] 이미지별 진행 상태 및 Progress Bar 표시 (대기 / 분석 중 / 완료 / 실패)
- [ ] 전체 완료 후 일괄 다운로드 (ZIP) 옵션
- [ ] 플랜별 배치 상한선 적용 (Free: 1장, Pro: 10장, Max: 50장)

---

### Phase 4: IPTC 임베딩 로컬 처리

> 서버의 ExifTool 의존성을 제거하고, 브라우저에서 직접 IPTC 메타데이터를 삽입
> **전략: "Local-First, Server-Fallback"** — 로컬에서 최대한 처리하고, 불가능한 포맷만 서버로 폴백

#### 4-1. 브라우저용 IPTC 라이브러리 선정 및 구현

- [ ] **접근 방법 A (포맷별 개별 라이브러리)**:

  | 포맷 | 메타데이터 위치 | 추천 라이브러리 | 난이도 |
  |---|---|---|---|
  | **JPEG** | APP13 / APP1 세그먼트 | `piexifjs` | 쉬움 |
  | **PNG** | eXIf / tEXt 청크 | `exifreader` (최신 버전) | 보통 |
  | **WebP** | EXIF / XMP 청크 | `exif-be-gone` 또는 WASM | 높음 |
  | **TIFF** | IFD 구조 | WASM 기반 솔루션 필요 | 매우 높음 |

- [ ] **접근 방법 B (통합 WASM 솔루션) — 권장**:
  - **Exiv2 WASM 빌드**: Exiv2 라이브러리를 WebAssembly로 포팅하면 JPEG/PNG/TIFF/WebP 모든 포맷을 하나의 솔루션으로 처리 가능
  - 장점: 포맷별 라이브러리 파편화 해소, 일관된 API
  - 단점: WASM 번들 사이즈 증가 (~수 MB), 초기 로딩 시간
  - 조사 필요: 기존 Exiv2 WASM 포팅 프로젝트 존재 여부 확인

- [ ] **기술 검증 순서**:
  1. `piexifjs`로 JPEG IPTC 삽입 테스트 (가장 쉬움, 스톡 사진의 90%+ 차지)
  2. Exiv2 WASM 빌드 가능 여부 조사
  3. 결과에 따라 접근 방법 A 또는 B 확정

#### 4-2. Local-First, Server-Fallback 전략

```
[IPTC 임베딩 요청]
    │
    ├─ JPEG → piexifjs 로컬 처리 ✅ (서버 비용 $0)
    │
    ├─ PNG  → Exiv2 WASM 또는 tEXt 청크 로컬 처리 ✅
    │
    └─ TIFF/WebP/기타
        │
        ├─ Exiv2 WASM 가능 → 로컬 처리 ✅
        │
        └─ 로컬 처리 불가 → Server Fallback
             │
             ├─ 파일 ≤ 4.5MB → /api/embed 직접 전송 (메모리 처리, 저장 X)
             │
             └─ 파일 > 4.5MB → Supabase Storage TTL 버킷 (아래 4-3 참조)
```

#### 4-3. 대용량 파일 Server Fallback 처리

> Vercel Serverless 함수는 요청 바디 **4.5MB 제한**이 있어, 대용량 파일의 직접 전송이 불가

- [ ] **TTL 임시 버킷 방식** (TIFF/WebP 등 로컬 처리 불가 + 4.5MB 초과 시에만):
  1. 익스텐션에서 Supabase Storage `temp-embed` 버킷에 1회용 업로드
  2. 서버 API `/api/embed`에 storage path만 전달
  3. 서버에서 다운로드 → ExifTool로 메타데이터 삽입 → 결과를 temp 버킷에 업로드
  4. 익스텐션에서 Signed URL로 다운로드
  5. **처리 완료 즉시 삭제** (또는 TTL 10분 설정)
  - 영구 저장이 아니므로 스토리지 비용 거의 $0
  - 이 경로는 JPEG이 아닌 포맷에서만 발생하므로 트래픽 매우 적을 것

#### 4-4. IPTC 삽입 데이터 구조

현재 웹 앱의 IPTC 매핑을 그대로 활용:

```typescript
// 삽입할 IPTC/XMP 필드
{
  Headline: string;          // 제목
  'Caption-Abstract': string; // 설명
  Keywords: string[];         // 키워드 배열
  Title: string;              // XMP 제목
  Description: string;        // XMP 설명
}
```

---

### Phase 5: 웹 앱 정리 (이미지 관련 기능 제거)

> 웹 앱에서 이미지 업로드/보관/다운로드 기능을 제거하고, 허브 역할에 집중
> ⚡ **Zero-base 이점**: 현재 고객이 없으므로 레거시 데이터 마이그레이션 부담 없이 즉시 전환 가능

#### 5-1. 제거 대상

- [ ] **Server Actions 제거/수정**:
  - `app/actions/upload.ts` — 이미지 업로드 로직 제거
  - `app/actions/embed.ts` — IPTC 임베딩 로직 제거 (서버 폴백용 `/api/embed`로 이관)
  - `app/actions/ai.ts` — API 라우트로 이동 (익스텐션에서 호출 가능하도록)

- [ ] **대시보드 수정**:
  - `app/dashboard/` — 이미지 갤러리 제거
  - 사용 통계 + 크레딧 관리 + 구독 관리만 유지

- [ ] **Supabase Storage 정리**:
  - `user-images` 버킷 비활성화 또는 삭제
  - `temp-embed` 버킷 생성 (Phase 4 서버 폴백 전용, TTL 정책 적용)
  - `lib/supabase/storage.ts` — 불필요한 함수 제거, 임시 업로드/삭제 함수만 유지
  - `images` 테이블 사용 중단

- [ ] **서버 의존성 정리**:
  - `sharp` 패키지 제거 (리사이즈를 클라이언트에서 처리하므로)
  - `exiftool-vendored` — 서버 폴백용으로 유지 여부 결정
    - Exiv2 WASM으로 모든 포맷 로컬 처리 가능 시 → 제거
    - 서버 폴백 필요 시 → `/api/embed` 전용으로 유지
  - `services/metadata-embedder.ts` — 위 결정에 따라 제거 또는 API용으로 축소

#### 5-2. 유지 대상

- [ ] 랜딩 페이지 (`app/page.tsx`, `components/landing/`)
- [ ] 인증 (`app/auth/`, `lib/supabase/auth.ts`)
- [ ] 결제 (`services/billing/`, Lemon Squeezy 웹훅)
- [ ] 크레딧 관리 (`lib/supabase/credits.ts`)
- [ ] 문의 (`app/contact/`, `services/discord.ts`)
- [ ] 블로그 (`app/blog/`)
- [ ] API 프록시 엔드포인트 (신규: `/api/generate`, `/api/credits`, `/api/embed`)

---

### Phase 6: DB 스키마 조정

#### 6-1. 테이블 변경

```sql
-- images 테이블: 제거 또는 사용 이력 로그로 축소
-- 기존: 이미지 파일 관리용
-- 변경: 사용 이력 기록용 (선택사항)

-- usage_logs 테이블 (신규, 선택사항)
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,          -- 'generate', 'embed', 'download'
  site_type TEXT,                -- 'adobe', 'shutterstock', 'local'
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6-2. 크레딧 관련 (유지)

- `profiles` 테이블의 `credits_subscription`, `credits_purchased` 컬럼 유지
- 월간 크레딧 리셋 Edge Function 유지

---

## 💰 비용 구조 비교

### 변경 전 (사용자 1,000명 기준 추정)

| 항목 | 월 비용 |
|---|---|
| Supabase Pro | $25 |
| Supabase Storage 초과 (500GB+) | ~$8.40+ |
| Vercel Pro | $20 |
| Gemini API | 사용량 기반 |
| **합계** | **~$53+** (스토리지 비용 계속 증가) |

### 변경 후 (사용자 1,000명 기준 추정)

| 항목 | 월 비용 |
|---|---|
| Supabase Pro | $25 (Auth + DB만 사용) |
| Supabase Storage | **$0** |
| Vercel Pro | $20 (API 프록시 대역폭 미미) |
| Gemini API | 사용량 기반 |
| **합계** | **~$45** (스토리지 비용 고정 $0) |

### 핵심 차이

- **변경 전**: 사업 성장 → 스토리지 비용 **선형 증가** → 수익성 저해
- **변경 후**: 사업 성장 → 스토리지 비용 **$0 고정** → **수익성 확보**

---

## 🔒 보안 개선사항

| 항목 | 변경 전 | 변경 후 |
|---|---|---|
| Gemini API 키 | 익스텐션에 하드코딩 (노출 위험) | 서버 환경변수에만 존재 (안전) |
| 사용자 이미지 | 서버에 영구 보관 | 서버를 거치지 않음 (프라이버시 강화) |
| 인증 | Supabase Auth | Supabase Auth (동일) |
| 크레딧 차감 | 서버에서 처리 | 서버에서 처리 (동일) |

---

## 📅 우선순위 및 실행 순서

```
Phase 1 (API 프록시)      ██████░░░░  ← 최우선, 보안 문제 해결
Phase 2 (익스텐션 전환)    ██████░░░░  ← Phase 1 직후
Phase 3 (로컬 파일 페이지) ████████░░  ← 핵심 신규 기능
Phase 4 (IPTC 로컬 처리)  ██████████  ← 가장 기술적 난이도 높음
Phase 5 (웹 앱 정리)      ████░░░░░░  ← Phase 1~4 완료 후
Phase 6 (DB 정리)         ██░░░░░░░░  ← 마지막 정리
```

### 권장 순서

1. **Phase 1 + 2** → API 키 보안 문제 즉시 해결
2. **Phase 4** → IPTC 로컬 처리 라이브러리 검증 (기술 리스크 조기 확인)
3. **Phase 3** → 로컬 파일 처리 페이지 구현 (핵심 기능)
4. **Phase 5 + 6** → 레거시 정리

### 🔄 Phase 간 코드 리뷰 규칙 (매 Phase 완료 후 필수)

> **각 Phase가 끝나면 다음 Phase로 넘어가기 전에 반드시 아래 체크리스트를 수행한다.**

- [ ] **코드 길이 점검**: 해당 Phase에서 수정/생성한 파일 중 **100줄 이상**인 파일은 분리 가능한지 검토
- [ ] **모듈화**: 하나의 파일이 여러 책임을 가지고 있다면 기능 단위로 분리
- [ ] **컴포넌트화**: UI 관련 코드 중 반복되는 패턴이 있으면 재사용 가능한 컴포넌트로 추출
- [ ] **기존 유틸 재사용**: 새로 작성한 유틸리티 함수가 프로젝트 내에 이미 존재하는 코드와 중복되지 않는지 확인
  - `lib/utils.ts`, `lib/utils/`, `chrome_extansion/src/core/utils/` 등 기존 유틸 디렉토리 탐색
  - 중복 발견 시 기존 코드를 재사용하도록 수정
- [ ] **공통 로직 추출**: 웹 앱과 익스텐션 간에 동일한 로직이 있다면 공유 모듈로 추출 검토
- [ ] **네이밍 일관성**: 새로 추가된 함수/변수/파일명이 프로젝트의 기존 네이밍 컨벤션과 일치하는지 확인
- [ ] **타입 정리**: 새로 추가된 타입이 `types/` 디렉토리에 올바르게 정의되어 있는지 확인

---

## ⚠️ 리스크 및 대응

| 리스크 | 영향 | 대응 방안 |
|---|---|---|
| JPEG 외 포맷의 IPTC 삽입 어려움 | TIFF/WebP 사용자에게 기능 제한 | Exiv2 WASM 통합 솔루션 조사 → 불가 시 서버 폴백 |
| 크롬 웹 스토어 심사 지연 | 업데이트 배포 느림 | 정식 심사 전 자체 배포(ZIP) 병행 |
| Vercel Serverless 페이로드 제한 (4.5MB) | 대용량 파일 서버 폴백 불가 | Supabase TTL 임시 버킷으로 우회 (Phase 4-3) |
| ~~기존 Pro 사용자의 대시보드 데이터~~ | ~~이미지 갤러리 없어짐~~ | ✅ Zero-base 상태이므로 해당 없음 |
| Exiv2 WASM 번들 사이즈 | 익스텐션 로딩 시간 증가 | Lazy loading + 필요 시에만 WASM 로드 |

---

## 📣 마케팅 전략: 프라이버시를 강점으로

> 스토리지 비용 절감이라는 기술적 결정을 **강력한 보안 셀링 포인트**로 전환

### 핵심 메시지

> **"Your photos never touch our servers."**
> (당신의 사진은 우리 서버에 절대 저장되지 않습니다.)

### 근거

- 스톡 사진작가들은 고해상도 원본이 외부 서버에 남는 것을 **극도로 꺼림**
- 경쟁 서비스 대비 **"Local Processing"**은 차별화 포인트
- 실제로 원본 이미지는 사용자 브라우저 메모리에서만 처리됨
- AI 분석에 사용되는 이미지는 리사이즈된 저해상도만 전송 (원본 품질 보호)

### 랜딩 페이지 반영 사항

- [ ] Hero 섹션 또는 Features 섹션에 프라이버시 관련 카피 추가
- [ ] "How it works" 섹션에 로컬 처리 플로우 시각화
- [ ] Trust Badge: "🔒 Zero Server Storage" 뱃지

---

## 📝 참고: 현재 코드 주요 파일

### 변경 대상
- `app/actions/upload.ts` — 제거
- `app/actions/embed.ts` — `/api/embed` 서버 폴백용으로 전환 또는 제거
- `app/actions/ai.ts` — `/api/generate` 라우트로 이동
- `services/metadata-embedder.ts` — 서버 폴백 필요 시 유지, 아니면 제거
- `lib/supabase/storage.ts` — 대폭 축소 (TTL 임시 버킷 함수만 유지)
- `lib/plan-limits.ts` — storageType 관련 로직 제거
- `chrome_extansion/src/core/ai/gemini-client.ts` — 서버 프록시로 전환

### 유지 대상
- `services/gemini.ts` — 서버 프록시용으로 유지
- `services/prompts/` — 서버에서 프롬프트 관리
- `lib/supabase/auth.ts` — 인증 유지
- `lib/supabase/credits.ts` — 크레딧 관리 유지
- `services/billing/` — 결제 유지
- `chrome_extansion/src/sidepanel/` — 확장 및 개선
- `chrome_extansion/src/content/` — 유지
