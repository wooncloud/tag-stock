# TagStock 데이터베이스 ERD

이 문서는 Mermaid를 사용하여 TagStock의 데이터베이스 스키마를 설명합니다.

```mermaid
erDiagram
    %% Supabase Auth 스키마 (암시적)
    auth_users ||--|| profiles : "관리 (1:1)"
    
    %% Public 스키마
    profiles ||--o{ images : "업로드 (1:N)"
    images ||--|| metadata : "보유 (1:1)"

    profiles {
        uuid id PK "사용자 고유 식별자 (auth.users PK 참조)"
        text email "사용자 이메일 주소"
        user_plan plan "구독 플랜 (free, pro)"
        integer credits_remaining "잔여 크레딧 (이미지 처리 가능 횟수)"
        text stripe_customer_id "Stripe 고객 고유 식별자"
        text stripe_subscription_id "Stripe 구독 고유 식별자"
        text subscription_status "Stripe 구독 상태 (active, canceled 등)"
        timestamptz created_at "프로필 생성 일시"
    }

    images {
        uuid id PK "이미지 고유 식별자"
        uuid user_id FK "소유 사용자 ID (profiles.id 참조)"
        text storage_path "Supabase Storage 내 저장 경로"
        text original_filename "업로드된 원본 파일명"
        bigint file_size "파일 크기 (bytes)"
        text mime_type "파일 MIME 타입"
        integer width "이미지 가로 폭 (pixels)"
        integer height "이미지 세로 높이 (pixels)"
        image_status status "처리 상태 (uploading, processing, completed, failed)"
        text error_message "처리 실패 시 에러 메시지"
        timestamptz created_at "이미지 업로드 일시"
    }

    metadata {
        uuid id PK "메타데이터 고유 식별자"
        uuid image_id FK "연결된 이미지 ID (images.id 참조)"
        jsonb tags "AI 생성 태그 데이터 (JSON 형식)"
        text title "SEO 최적화 이미지 제목"
        text description "SEO 최적화 이미지 상세 설명"
        text_array keywords "AI 추출 키워드 배열"
        decimal ai_confidence "AI 분석 신뢰도 (0.00 ~ 1.00)"
        boolean embedded "이미지 파일 내 IPTC 메타데이터 삽입 여부"
        timestamptz created_at "메타데이터 생성 일시"
    }
```

## 테이블 설명

### profiles
사용자 프로필 정보, 구독 상태 및 잔여 크레딧을 저장합니다. Supabase Auth의 user 테이블과 직접 연결됩니다.

### images
업로드된 이미지 정보(저장 경로 및 현재 처리 상태 포함)를 저장합니다.

### metadata
제목, 설명, 태그를 포함하여 각 이미지에 대해 AI가 생성한 메타데이터를 저장합니다. 또한 메타데이터가 파일에 임베드되었는지 여부를 추적합니다.
