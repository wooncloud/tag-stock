# Phase 3: IPTC 메타데이터 삽입 기능

## 개요

**목표**: Pro 사용자를 위한 IPTC 메타데이터 삽입 다운로드 기능 구현

**상태**: 📋 기획 단계
**예상 소요**: TBD

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

| TagStock 필드 | IPTC 필드 | 설명 |
|--------------|-----------|------|
| `title` | `IPTC:Headline` 또는 `IPTC:ObjectName` | 스톡 사이트에서 이미지 제목으로 인식 |
| `description` | `IPTC:Caption-Abstract` | 검색 엔진 크롤링 및 상세 설명 |
| `keywords` + `tags` | `IPTC:Keywords` | **합쳐서 하나의 리스트로** (최대 50개) |

### 매핑 로직

```typescript
interface IPTCData {
  headline: string;           // title
  captionAbstract: string;    // description
  keywords: string[];         // [...keywords, ...tags] (합친 배열)
}

const mapToIPTC = (metadata: GeneratedMetadata): IPTCData => ({
  headline: metadata.title,
  captionAbstract: metadata.description,
  // Keywords를 앞에, Tags를 뒤에 배치 (SEO 최적화)
  keywords: [...metadata.keywords, ...metadata.tags]
});
```

### 주의사항

1. **Category 제외**: 스톡 사이트마다 분류 체계가 달라 메타데이터에 포함하지 않음
2. **언어**: 모든 메타데이터는 **영어**로 유지 (글로벌 스톡 사이트 표준)
3. **키워드 순서**: Keywords(핵심)를 앞에, Tags(기술적)를 뒤에 배치하여 SEO 최적화
4. **최대 개수**: Keywords + Tags 합계 50개 이하 유지

---

## 기술 구현

### 선택한 라이브러리

**piexifjs** (순수 JavaScript IPTC/EXIF 라이브러리)
- NPM: `piexifjs`
- 장점:
  - 순수 JS, 서버 의존성 없음
  - 클라이언트 사이드에서 동작
  - JPEG EXIF/IPTC 읽기/쓰기 지원
  - 번들 크기 작음

### 대안 라이브러리

| 라이브러리 | 장점 | 단점 |
|-----------|------|------|
| `piexifjs` | 순수 JS, 경량, IPTC 지원 | JPEG만 지원 |
| `exifr` | 다양한 포맷 지원, 모던 API | 쓰기 지원 제한적 |
| `exiftool-vendored` | 모든 포맷 지원 | 서버 사이드 필요 |

---

## 구현 태스크

### Phase 3.1: 기반 작업
- [ ] `piexifjs` 패키지 설치
- [ ] IPTC 유틸리티 함수 작성 (`lib/iptc.ts`)
- [ ] 메타데이터 매핑 함수 구현
- [ ] 단위 테스트 작성

### Phase 3.2: 다운로드 서비스 구현
- [ ] 다운로드 서비스 작성 (`services/download.ts`)
- [ ] Free 플랜: 압축 이미지 그대로 다운로드
- [ ] Pro 플랜: 원본 이미지 + IPTC 삽입 다운로드
- [ ] 플랜 검증 로직

### Phase 3.3: UI 통합
- [ ] 이미지 갤러리 다운로드 버튼 분기 처리
- [ ] Pro 전용 "Download with Metadata" 버튼
- [ ] Free 사용자에게 Pro 업그레이드 유도 UI
- [ ] 다운로드 완료 토스트 알림

### Phase 3.4: 테스트 & 검증
- [ ] JPEG 이미지 IPTC 삽입 테스트
- [ ] IPTC 메타데이터 검증 (ExifTool 등으로 확인)
- [ ] 스톡 사이트 업로드 테스트 (Adobe Stock, Shutterstock)
- [ ] 크로스 브라우저 테스트

---

## 파일 구조

```
lib/
└── iptc.ts                    # IPTC 유틸리티 함수

services/
└── download.ts                # 다운로드 서비스

components/
└── dashboard/
    └── download-button.tsx    # 다운로드 버튼 컴포넌트
```

---

## API 설계

### IPTC 유틸리티 (`lib/iptc.ts`)

```typescript
import piexif from 'piexifjs';

interface MetadataInput {
  title: string;
  description: string;
  keywords: string[];
  tags: string[];
}

/**
 * IPTC 메타데이터를 이미지에 삽입 (Pro 전용)
 * @param imageDataUrl - Base64 이미지 데이터 URL
 * @param metadata - 삽입할 메타데이터
 * @returns IPTC가 삽입된 이미지 데이터 URL
 */
export async function embedIPTC(
  imageDataUrl: string,
  metadata: MetadataInput
): Promise<string>;
```

### 다운로드 서비스 (`services/download.ts`)

```typescript
interface DownloadOptions {
  imageUrl: string;
  metadata?: MetadataInput;  // Pro만 사용
  isPro: boolean;
  filename: string;
}

/**
 * 이미지 다운로드
 * - Free: 압축 이미지 그대로 다운로드
 * - Pro: 원본 이미지 + IPTC 메타데이터 삽입 후 다운로드
 */
export async function downloadImage(options: DownloadOptions): Promise<void>;
```

---

## UI/UX 설계

### Free 사용자

```
┌─────────────────────────────┐
│  📥 Download                │  ← 압축 이미지 다운로드
└─────────────────────────────┘
┌─────────────────────────────┐
│  ⭐ Download with Metadata  │  ← 클릭 시 Pro 업그레이드 유도
│     Pro Feature             │
└─────────────────────────────┘
```

### Pro 사용자

```
┌─────────────────────────────┐
│  📥 Download Original       │  ← 원본 이미지 + IPTC
│     with Metadata           │
└─────────────────────────────┘
```

---

## 테스트 체크리스트

### 기능 테스트
- [ ] Free: 압축 이미지 다운로드 (IPTC 없음)
- [ ] Pro: 원본 이미지 + IPTC 다운로드
- [ ] IPTC 필드 정확성 검증
- [ ] 다운로드 파일명 정확성

### 스톡 사이트 검증
- [ ] Adobe Stock 메타데이터 인식 확인
- [ ] Shutterstock 메타데이터 인식 확인
- [ ] Getty Images 메타데이터 인식 확인

---

## 의존성

### 새로 추가할 패키지
```bash
npm install piexifjs
```

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-01-25 | 0.1 | 초기 기획 문서 작성 |
| 2026-01-25 | 0.2 | Free/Pro 플랜 차이 명확화 (Free는 IPTC 없음) |
