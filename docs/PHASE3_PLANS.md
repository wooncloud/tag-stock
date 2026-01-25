# Phase 3: 플랜 시스템 상세 설계

## 개요

**목표**: Free/Pro 플랜의 기능 차별화 및 업로드/다운로드 정책 명확화

**상태**: 📋 기획 단계
**관련 문서**: [PHASE3_IPTC.md](./PHASE3_IPTC.md)

---

## 플랜 비교표

| 기능 | Free | Pro |
|------|------|-----|
| **가격** | 무료 | $19/월 또는 $190/년 |
| **크레딧** | 월 10회 | 무제한 |
| **이미지 업로드** | 압축 이미지만 | 원본 이미지 |
| **다중 업로드** | 1장씩 | 최대 10장 동시 |
| **AI 메타데이터 생성** | O | O |
| **이미지 다운로드** | 압축 이미지 | 원본 이미지 |
| **IPTC 메타데이터 삽입** | X | O |
| **우선 지원** | X | O |

---

## 핵심 기능 상세

### 1. 이미지 업로드 정책

#### Free 플랜
```
[원본 이미지 선택]
        ↓
[클라이언트 압축]
   - browser-image-compression 사용
   - maxWidthOrHeight: 2048px
   - quality: 0.8
   - maxSizeMB: 2
        ↓
[압축된 이미지 업로드]
        ↓
[Supabase Storage 저장]
   - 경로: user-images/{user_id}/compressed/
```

#### Pro 플랜
```
[원본 이미지 선택]
        ↓
[원본 그대로 업로드]
   - 압축 없음
   - 최대 50MB
        ↓
[Supabase Storage 저장]
   - 경로: user-images/{user_id}/original/
```

### 2. 다중 업로드

#### Free 플랜
- **1장씩만** 업로드 가능
- 다중 선택 시 "Pro 업그레이드" 유도 메시지

#### Pro 플랜
- **최대 10장** 동시 업로드
- 병렬 처리로 빠른 업로드
- 배치 AI 처리 지원

### 3. 다운로드 정책

#### Free 플랜
- 저장된 압축 이미지 그대로 다운로드
- IPTC 메타데이터 없음

#### Pro 플랜
- 원본 이미지 다운로드
- IPTC 메타데이터 삽입 옵션

---

## 구현 아키텍처

### 업로드 플로우

```
[파일 선택]
     ↓
[플랜 확인]
     ↓
┌────┴────┐
↓         ↓
[Free]  [Pro]
↓         ↓
[파일 수  [파일 수
 체크:     체크:
 1장만]   10장까지]
↓         ↓
[압축    [원본
 적용]    유지]
↓         ↓
└────┬────┘
     ↓
[Supabase Storage 업로드]
     ↓
[DB 레코드 생성]
     ↓
[AI 메타데이터 생성]
```

### 스토리지 구조

```
user-images/
└── {user_id}/
    ├── compressed/      # Free 플랜 이미지
    │   ├── img_001.jpg
    │   └── img_002.jpg
    └── original/        # Pro 플랜 이미지
        ├── img_003.jpg
        └── img_004.jpg
```

---

## 구현 태스크

### Phase 3.1: 업로드 정책 구현
- [ ] 플랜별 압축 로직 분기 (`components/image-upload.tsx` 수정)
- [ ] Free: 클라이언트 압축 강제 적용
- [ ] Pro: 원본 업로드 허용
- [ ] 스토리지 경로 분리 (compressed/ vs original/)

### Phase 3.2: 다중 업로드 구현
- [ ] Free: 파일 선택 1개 제한
- [ ] Pro: 최대 10개 파일 선택 허용
- [ ] 다중 파일 병렬 업로드 처리
- [ ] 배치 AI 처리 로직

### Phase 3.3: UI 분기 처리
- [ ] Free 사용자 다중 업로드 시 Pro 유도 모달
- [ ] 업로드 영역에 플랜별 제한 안내 문구
- [ ] Pro 뱃지/마크 표시

### Phase 3.4: DB 스키마 업데이트
- [ ] images 테이블에 `storage_type` 필드 추가 (compressed/original)
- [ ] 마이그레이션 스크립트 작성

---

## 파일 변경 목록

### 수정 필요
```
components/
├── image-upload.tsx              # 압축/다중 업로드 분기
└── dashboard/
    └── upload-workflow.tsx       # 플랜별 UI 분기

app/
└── actions/
    └── upload.ts                 # 스토리지 경로 분기

lib/
└── constants.ts                  # 플랜별 제한 상수 정의
```

### 신규 생성
```
lib/
└── plan-limits.ts                # 플랜별 제한 유틸리티

supabase/
└── migrations/
    └── 20260125_storage_type.sql # storage_type 필드 추가
```

---

## 상수 정의

```typescript
// lib/plan-limits.ts

export const PLAN_LIMITS = {
  free: {
    maxUploadCount: 1,           // 한 번에 1장
    maxFileSizeMB: 2,            // 압축 후 최대 2MB
    compressionEnabled: true,     // 압축 강제
    compressionOptions: {
      maxWidthOrHeight: 2048,
      quality: 0.8,
      maxSizeMB: 2,
    },
    iptcEnabled: false,          // IPTC 비활성
    monthlyCredits: 10,
  },
  pro: {
    maxUploadCount: 10,          // 한 번에 10장
    maxFileSizeMB: 50,           // 원본 최대 50MB
    compressionEnabled: false,   // 압축 없음
    iptcEnabled: true,           // IPTC 활성
    monthlyCredits: Infinity,    // 무제한
  },
} as const;
```

---

## UI/UX 설계

### Free 사용자 - 다중 파일 선택 시

```
┌─────────────────────────────────────────┐
│  ⭐ Upgrade to Pro                      │
│                                         │
│  You've selected 5 images.              │
│  Free plan allows 1 image at a time.    │
│                                         │
│  Pro benefits:                          │
│  • Upload up to 10 images at once       │
│  • Keep original image quality          │
│  • Download with IPTC metadata          │
│                                         │
│  ┌─────────────┐  ┌─────────────┐       │
│  │ Upload 1    │  │ Upgrade Pro │       │
│  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────┘
```

### 업로드 영역 안내 문구

**Free:**
```
Drag & drop your image here
(1 image at a time, will be compressed)
```

**Pro:**
```
Drag & drop your images here
(Up to 10 images, original quality preserved)
```

---

## 테스트 체크리스트

### 업로드 테스트
- [ ] Free: 1장 업로드 성공
- [ ] Free: 2장 이상 선택 시 제한 메시지
- [ ] Free: 이미지 압축 확인 (2048px 이하)
- [ ] Pro: 10장 동시 업로드 성공
- [ ] Pro: 원본 품질 유지 확인
- [ ] Pro: 11장 이상 선택 시 제한 메시지

### 다운로드 테스트
- [ ] Free: 압축 이미지 다운로드
- [ ] Pro: 원본 이미지 다운로드
- [ ] Pro: IPTC 포함 다운로드

### 플랜 전환 테스트
- [ ] Free → Pro 업그레이드 후 기능 활성화
- [ ] Pro → Free 다운그레이드 후 기능 제한

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-01-25 | 0.1 | 초기 기획 문서 작성 |
