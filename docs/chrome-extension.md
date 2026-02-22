# Chrome Extension

## 개요

TagStock Chrome Extension은 Adobe Stock과 Shutterstock 업로드 페이지에서 AI 메타데이터를 자동으로 생성하고 폼에 채워넣는 브라우저 확장 프로그램이다. 로컬 모드에서는 이미지 파일에 직접 IPTC/XMP 메타데이터를 임베딩할 수도 있다.

- **버전:** 1.1.0
- **Manifest:** V3
- **빌드 도구:** Vite 5 + TypeScript

---

## 지원 사이트

| 사이트 | URL | 기능 |
|--------|-----|------|
| Adobe Stock | `https://contributor.stock.adobe.com/*` | 제목, 키워드 자동 채우기 |
| Shutterstock | `https://submit.shutterstock.com/*` | 제목, 키워드 자동 채우기 |

---

## 아키텍처

```
chrome_extansion/src/
├── background/           # Service Worker
│   └── index.ts          # 메시지 라우팅, CORS 우회, 이미지 fetch
│
├── content/              # Content Script (스톡 사이트에 주입)
│   ├── index.ts          # 진입점
│   ├── keyboard-handler.ts   # Cmd+E / Ctrl+E 단축키
│   ├── message-handler.ts    # 익스텐션 메시지 처리
│   ├── metadata-filler.ts    # 단일 이미지 메타데이터 채우기
│   ├── batch-metadata-filler.ts  # 배치 메타데이터 채우기
│   └── overlay-blocker.ts    # 배치 처리 중 오버레이 UI
│
├── sidepanel/            # Side Panel UI
│   ├── sidepanel.html    # HTML 진입점
│   ├── index.ts          # 초기화
│   ├── session.ts        # 사용자 세션 관리
│   ├── state.ts          # UI 상태
│   ├── event-listeners.ts# 이벤트 핸들러
│   ├── components/       # UI 컴포넌트
│   │   ├── auth-screen.ts    # 로그인 화면
│   │   ├── fill-button.ts    # 단일 채우기 버튼
│   │   ├── fill-all-button.ts# 배치 채우기 버튼
│   │   ├── credit-display.ts # 크레딧 표시
│   │   ├── activity-log.ts   # 활동 로그
│   │   └── status-badge.ts   # 연결 상태
│   └── handlers/
│       ├── fill-handler.ts   # 단일 채우기 로직
│       ├── fill-all-handler.ts # 배치 채우기 로직
│       └── tab-handler.ts    # 탭 상태 감지
│
├── local/                # 로컬 모드 (오프라인/독립 실행)
│   ├── local.html        # HTML 진입점
│   ├── index.ts          # 초기화
│   ├── state.ts          # 이미지/체크 상태 관리
│   ├── event-listeners.ts# 이벤트 핸들러
│   ├── credit-display.ts # 크레딧 표시
│   ├── utils.ts          # 유틸리티
│   ├── components/       # UI 컴포넌트
│   │   ├── file-picker.ts    # 파일 선택/드래그앤드롭
│   │   ├── image-grid.ts     # 이미지 그리드 뷰
│   │   ├── detail-panel.ts   # 상세 패널 (메타데이터 편집)
│   │   ├── metadata-editor.ts# 메타데이터 에디터
│   │   ├── action-buttons.ts # 배치 분석/다운로드 버튼
│   │   ├── credit-modal.ts   # 크레딧 부족 모달
│   │   └── help-popover.ts   # 도움말
│   └── handlers/
│       ├── ai-handler.ts     # AI 분석 (단일/배치)
│       └── iptc-handler.ts   # IPTC 임베딩 & 다운로드
│
├── core/                 # 공유 핵심 로직
│   ├── ai/
│   │   ├── gemini-client.ts      # Gemini API 직접 호출
│   │   └── metadata-generator.ts # 메타데이터 생성 파이프라인
│   ├── sites/
│   │   ├── detector.ts           # 현재 사이트 감지
│   │   └── handlers/
│   │       ├── adobe.ts          # Adobe Stock 폼 조작
│   │       └── shutterstock.ts   # Shutterstock 폼 조작
│   ├── iptc/
│   │   ├── jpeg-iptc-writer.ts   # JPEG IPTC 주입
│   │   ├── xmp-writer.ts        # XMP 사이드카 생성
│   │   └── types.ts
│   └── utils/
│       ├── image.ts              # 이미지 리사이즈
│       └── dom.ts                # DOM 유틸리티
│
└── shared/               # 모듈 간 공유
    ├── constants.ts      # 상수 (링크, 타임아웃)
    ├── types.ts          # 공유 타입 정의
    ├── messenger.ts      # 메시지 패싱 유틸리티
    └── errors.ts         # 공유 에러 클래스
```

---

## 모듈별 역할

### Background Service Worker

- 아이콘 클릭 시 Side Panel 열기
- CORS 우회를 위한 이미지 fetch 프록시 (`fetchImageAsBase64`)
- CSP 우회를 위한 API 요청 프록시 (`proxyFetch`)
- 모듈 간 메시지 라우팅

### Content Script

스톡 사이트 페이지에 자동 주입되어 동작한다.

- 업로드 페이지의 이미지를 감지하고 base64로 변환
- AI API를 호출하여 메타데이터 생성
- 생성된 메타데이터를 폼 필드에 자동 입력
- `Cmd+E` / `Ctrl+E` 단축키로 빠른 실행
- 배치 모드: 페이지의 모든 이미지를 순차적으로 처리

### Side Panel

브라우저 우측에 열리는 UI 패널.

- 사용자 로그인/로그아웃
- 크레딧 잔액 표시
- 메타데이터 생성 버튼 (단일/배치)
- 활동 로그 표시
- 현재 탭의 사이트 감지 상태 표시
- 외부 링크 (홈, 문의, Adobe Portfolio, Shutterstock Portfolio)

### Local 모드

스톡 사이트 없이 독립적으로 동작하는 모드.

- 로컬 이미지 파일 업로드 (드래그앤드롭)
- AI 분석으로 메타데이터 생성
- 메타데이터 수동 편집
- IPTC/XMP 메타데이터 임베딩 후 다운로드
- 배치 분석/다운로드 지원

### AI 생성 모드

| 모드 | 설명 | 인증 |
|------|------|------|
| API 모드 | `/api/generate` 엔드포인트 호출 | Supabase Bearer Token |
| Local 모드 | Gemini API 직접 호출 | 내장 API 키 |

---

## 빌드

### 의존성 설치

```bash
cd chrome_extansion
npm install
```

### 빌드 실행

```bash
npm run build
```

이 명령은 다음을 순서대로 실행한다:
1. 부모 디렉토리에서 `npm run format` (Prettier)
2. `tsc --noEmit` (타입 체크)
3. `vite build` (메인 빌드: background, sidepanel, local)
4. `BUILD_TARGET=content vite build` (content script 빌드)

빌드 결과물은 `chrome_extansion/dist/`에 생성된다.

### 루트에서 빌드

```bash
npm run build:ce
```

### 타입 체크만 실행

```bash
cd chrome_extansion
npm run type-check
```

---

## Chrome에 로드하기

1. Chrome에서 `chrome://extensions/` 접속
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `chrome_extansion/dist/` 폴더 선택

---

## 권한

```json
{
  "permissions": ["activeTab", "sidePanel", "tabs", "storage", "identity", "downloads", "scripting"],
  "host_permissions": [
    "https://tagstock.app/*",
    "http://localhost:3000/*",
    "https://contributor.stock.adobe.com/*",
    "https://submit.shutterstock.com/*",
    "https://cdn.shutterstock.com/*",
    "https://*.ftcdn.net/*"
  ]
}
```

| 권한 | 용도 |
|------|------|
| `activeTab` | 현재 탭 접근 |
| `sidePanel` | Side Panel API 사용 |
| `tabs` | 탭 URL 감지 |
| `storage` | 인증 토큰 저장 |
| `identity` | OAuth 지원 |
| `downloads` | IPTC 임베딩 파일 다운로드 |
| `scripting` | 동적 스크립트 주입 |
