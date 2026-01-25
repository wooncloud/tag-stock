# Phase 3: IPTC 메타데이터 삽입 기능

## 개요

**목표**: Pro 사용자를 위한 IPTC 메타데이터 삽입 다운로드 기능 구현

**상태**: ✅ 구현 완료

---

## 플랜별 기능 차이

### Free 플랜
| 기능 | 상태 |
|------|------|
| 이미지 업로드 | 압축된 이미지만 (서버 용량 확보) |
| AI 메타데이터 생성 | O (크레딧 차감) |
| 이미지 다운로드 | O (압축된 이미지, IPTC 없음) |
| IPTC 메타데이터 삽입 | **X** |
| 원본 이미지 저장 | **X** |

### Pro 플랜
| 기능 | 상태 |
|------|------|
| 이미지 업로드 | **원본 이미지** (압축 없이 저장) |
| AI 메타데이터 생성 | O (무제한) |
| 이미지 다운로드 | O (원본 품질) |
| IPTC 메타데이터 삽입 | **O** |
| 원본 이미지 저장 | **O** |

---

## 구현 아키텍처

```
[다운로드 버튼 클릭]
         ↓
[플랜 확인: Free vs Pro]
         ↓
    ┌────┴────┐
    ↓         ↓
[Free]     [Pro]
    ↓         ↓
[압축 이미지  [원본 이미지
 그대로       + IPTC 삽입]
 다운로드]        ↓
    ↓       [메타데이터
    ↓        임베딩]
    ↓         ↓
    └────┬────┘
         ↓
   [파일 다운로드]
```

---

## IPTC 메타데이터 매핑 (Pro 전용)

### 매핑 테이블

| TagStock 필드 | IPTC 필드 | XMP 필드 | 설명 |
|--------------|-----------|----------|------|
| `title` | `Headline` | `Title` | 스톡 사이트에서 이미지 제목으로 인식 |
| `description` | `Caption-Abstract` | `Description` | 검색 엔진 크롤링 및 상세 설명 |
| `keywords` + `tags` | `Keywords` | `Subject` | **합쳐서 하나의 리스트로** (최대 50개) |

### 매핑 로직 (구현됨)

```typescript
// lib/iptc.ts
interface IPTCData {
  'Headline': string;
  'Caption-Abstract': string;
  'Keywords': string[];
}

const mapToIPTC = (metadata: MetadataInput): IPTCData => ({
  'Headline': metadata.title || '',
  'Caption-Abstract': metadata.description || '',
  // Keywords를 앞에, Tags를 뒤에 배치 (SEO 최적화)
  'Keywords': [...(metadata.keywords || []), ...(metadata.tags || [])].slice(0, 50)
});
```

### 주의사항

1. **Category 제외**: 스톡 사이트마다 분류 체계가 달라 메타데이터에 포함하지 않음
2. **언어**: 모든 메타데이터는 **영어**로 유지 (글로벌 스톡 사이트 표준)
3. **키워드 순서**: Keywords(핵심)를 앞에, Tags(기술적)를 뒤에 배치하여 SEO 최적화
4. **최대 개수**: Keywords + Tags 합계 50개 이하 유지
5. **XMP 동시 삽입**: IPTC와 XMP 모두에 동일 데이터 삽입하여 호환성 최대화

---

## 기술 구현

### 선택한 라이브러리

**exiftool-vendored** (서버 사이드 IPTC/EXIF/XMP 라이브러리)
- NPM: `exiftool-vendored`
- 장점:
  - 모든 이미지 포맷 지원 (JPEG, PNG, TIFF 등)
  - IPTC, EXIF, XMP 모든 메타데이터 표준 지원
  - 안정적인 메타데이터 쓰기
  - 스톡 사이트 호환성 우수

### 라이브러리 선택 사유

| 라이브러리 | 장점 | 단점 | 선택 |
|-----------|------|------|------|
| `piexifjs` | 순수 JS, 경량 | EXIF만 지원, IPTC 미지원 | ❌ |
| `exifr` | 다양한 포맷 지원, 모던 API | 쓰기 지원 제한적 | ❌ |
| `exiftool-vendored` | 모든 포맷 지원, 완벽한 IPTC 지원 | 서버 사이드 필요 | ✅ |

---

## 구현 태스크

### Phase 3.1: 기반 작업
- [x] `exiftool-vendored` 패키지 확인 (이미 설치됨)
- [x] IPTC 유틸리티 함수 작성 (`lib/iptc.ts`)
- [x] 메타데이터 매핑 함수 구현
- [ ] 단위 테스트 작성

### Phase 3.2: 다운로드 서비스 구현
- [x] 메타데이터 임베딩 서비스 업데이트 (`services/metadata-embedder.ts`)
- [x] Free 플랜: 압축 이미지 그대로 다운로드 (기존 구현 유지)
- [x] Pro 플랜: 원본 이미지 + IPTC/XMP 삽입 다운로드
- [x] 플랜 검증 로직 (기존 구현 유지)

### Phase 3.3: UI 통합
- [x] 이미지 갤러리 다운로드 버튼 분기 처리 (기존 구현 유지)
- [x] Pro 전용 "Embed & Download" 버튼 (기존 구현 유지)
- [x] Free 사용자에게 Pro 전용 표시 (기존 구현 유지)

### Phase 3.4: 테스트 & 검증
- [ ] JPEG 이미지 IPTC 삽입 테스트
- [ ] IPTC 메타데이터 검증 (ExifTool 등으로 확인)
- [ ] 스톡 사이트 업로드 테스트 (Adobe Stock, Shutterstock)
- [ ] 크로스 브라우저 테스트

---

## 파일 구조

```
lib/
└── iptc.ts                    # IPTC 유틸리티 함수 ✅

services/
└── metadata-embedder.ts       # 메타데이터 임베딩 서비스 ✅

app/actions/
└── embed.ts                   # 서버 액션 (기존 유지)

components/
└── dashboard/
    └── image-gallery/
        └── image-card-actions.tsx  # 다운로드 버튼 (기존 유지)
```

---

## API 설계

### IPTC 유틸리티 (`lib/iptc.ts`)

```typescript
interface MetadataInput {
  title?: string;
  description?: string;
  keywords?: string[];
  tags?: string[];
}

interface IPTCData {
  'Headline': string;
  'Caption-Abstract': string;
  'Keywords': string[];
}

// IPTC 형식으로 매핑
function mapToIPTC(metadata: MetadataInput): IPTCData;

// IPTC 데이터 유효성 검사
function validateIPTC(iptc: IPTCData): boolean;

// 키워드 정리 (중복 제거, 공백 제거)
function sanitizeKeywords(keywords: string[]): string[];
```

### 메타데이터 임베딩 서비스 (`services/metadata-embedder.ts`)

```typescript
/**
 * IPTC/XMP 메타데이터를 이미지에 임베딩 (Pro 전용)
 * @param imageBuffer - 원본 이미지 버퍼
 * @param metadata - 삽입할 메타데이터
 * @param originalFilename - 원본 파일명
 * @returns IPTC/XMP가 삽입된 이미지 버퍼
 */
async function embedMetadata(
  imageBuffer: Buffer,
  metadata: Metadata,
  originalFilename: string
): Promise<Buffer>;

/**
 * 이미지에서 메타데이터 추출
 */
async function extractMetadata(imageBuffer: Buffer): Promise<Record<string, unknown>>;

/**
 * ExifTool 인스턴스 종료
 */
async function closeExifTool(): Promise<void>;
```

---

## UI/UX 설계

### Free 사용자

```
┌─────────────────────────────┐
│  📥 Download                │  ← 압축 이미지 다운로드
└─────────────────────────────┘
(Pro 전용 Embed & Download 버튼은 메타데이터가 있을 때만 표시)
```

### Pro 사용자

```
┌─────────────────────────────┐
│  📥 Download                │  ← 원본 이미지 다운로드
└─────────────────────────────┘
┌─────────────────────────────┐
│  📁 Embed & Download        │  ← 메타데이터 임베딩 후 다운로드
└─────────────────────────────┘
(임베딩 완료 후)
┌─────────────────────────────┐
│  📥 Download with Metadata  │  ← 임베딩된 이미지 다운로드
└─────────────────────────────┘
```

---

## 테스트 체크리스트

### 기능 테스트
- [ ] Free: 압축 이미지 다운로드 (IPTC 없음)
- [ ] Pro: 원본 이미지 + IPTC 다운로드
- [ ] IPTC 필드 정확성 검증
- [ ] XMP 필드 정확성 검증
- [ ] 다운로드 파일명 정확성

### 스톡 사이트 검증 (개발자가 직접 검증할 내용)
- [ ] Adobe Stock 메타데이터 인식 확인
- [ ] Shutterstock 메타데이터 인식 확인

---

## 의존성

### 사용 중인 패키지
```bash
# 이미 설치됨
exiftool-vendored: ^35.0.0
```

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-01-25 | 0.1 | 초기 기획 문서 작성 |
| 2026-01-25 | 0.2 | Free/Pro 플랜 차이 명확화 (Free는 IPTC 없음) |
| 2026-01-25 | 1.0 | IPTC/XMP 메타데이터 삽입 기능 구현 완료 (exiftool-vendored 사용) |
