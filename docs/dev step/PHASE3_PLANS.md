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

### Phase 3.1: 업로드 정책 구현 ✅
- [x] 플랜별 압축 로직 분기 (`lib/utils/image-processing.ts` 수정)
- [x] Free: 클라이언트 압축 강제 적용
- [x] Pro: 원본 업로드 허용
- [x] 스토리지 경로 분리 (compressed/ vs original/)

### Phase 3.2: 다중 업로드 구현 (보류)
> **참고**: 다중 업로드는 배치 처리 아키텍처가 필요하여 추후 구현 예정
> 아래 "다중 업로드 구현 가이드" 섹션 참조

- [ ] Free: 파일 선택 1개 제한
- [ ] Pro: 최대 10개 파일 선택 허용
- [ ] 다중 파일 병렬 업로드 처리
- [ ] 배치 AI 처리 로직

### Phase 3.3: UI 분기 처리 ✅
- [x] 업로드 영역에 플랜별 제한 안내 문구
- [x] Pro 뱃지/마크 표시
- [ ] Free 사용자 다중 업로드 시 Pro 유도 모달 (Phase 3.2와 함께 구현)

### Phase 3.4: DB 스키마 업데이트 ✅
- [x] images 테이블에 `storage_type` 필드 추가 (compressed/original)
- [ ] 마이그레이션 스크립트 작성 (Supabase 대시보드에서 직접 추가 가능)

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

## 다중 업로드 구현 가이드 (Phase 3.2)

### 추천 아키텍처: DB 큐 + Supabase Edge Function

```
[사용자가 10장 선택]
        ↓
[각 이미지를 Storage에 업로드]
        ↓
[images 테이블에 status='pending' 으로 레코드 생성]
        ↓
[Supabase Edge Function (Cron 또는 DB Trigger)]
        ↓
[pending 상태 이미지 조회 → AI 처리 → status='completed']
        ↓
[사용자에게 완료 알림 (Realtime 또는 Polling)]
```

### 구현 단계

1. **images 테이블 상태 확장**
   ```sql
   -- status에 'pending' 상태 추가
   ALTER TABLE images
   ALTER COLUMN status TYPE text;
   -- 'pending' | 'processing' | 'completed' | 'failed'
   ```

2. **Edge Function 생성** (`supabase/functions/process-pending-images`)
   ```typescript
   // Cron: */5 * * * * (5분마다 실행)
   const { data: pendingImages } = await supabase
     .from('images')
     .select('*')
     .eq('status', 'pending')
     .limit(10);

   for (const image of pendingImages) {
     await supabase.from('images')
       .update({ status: 'processing' })
       .eq('id', image.id);

     // AI 처리
     await generateMetadataForImage(image);

     await supabase.from('images')
       .update({ status: 'completed' })
       .eq('id', image.id);
   }
   ```

3. **Realtime 구독으로 완료 알림**
   ```typescript
   supabase
     .channel('images')
     .on('postgres_changes', {
       event: 'UPDATE',
       schema: 'public',
       table: 'images',
       filter: `user_id=eq.${userId}`,
     }, (payload) => {
       if (payload.new.status === 'completed') {
         toast.success(`${payload.new.original_filename} 처리 완료!`);
       }
     })
     .subscribe();
   ```

### 대안: 클라이언트 큐 방식 (간단)

배치 서버 없이 클라이언트에서 순차 처리:

```typescript
// 10장 선택 → 2-3개씩 동시 처리
const CONCURRENT_LIMIT = 3;

for (let i = 0; i < files.length; i += CONCURRENT_LIMIT) {
  const batch = files.slice(i, i + CONCURRENT_LIMIT);
  await Promise.all(batch.map(file => processFile(file)));
}
```

**장점**: 별도 서버 불필요, 즉시 구현 가능
**단점**: 브라우저를 열어둬야 함

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-01-25 | 0.1 | 초기 기획 문서 작성 |
| 2026-01-25 | 0.2 | Phase 3.1, 3.3, 3.4 구현 완료. 다중 업로드 가이드 추가 |
