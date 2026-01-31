# TagStock Chrome Extension

Adobe Stock 및 Shutterstock 업로드 프로세스를 자동화하는 AI 기반 Chrome 확장 프로그램입니다.

## ✨ 주요 기능

- 🤖 **Google Gemini AI**를 사용한 메타데이터 자동 생성
- 📝 이미지 분석을 통한 제목과 키워드 자동 생성
- 🎯 Adobe Stock 및 Shutterstock 지원
- ⌨️ 키보드 단축키 지원 (`Cmd+E` / `Ctrl+E`)
- 🎨 직관적인 Side Panel UI

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. API 키 설정

`.env` 파일을 만들고 Gemini API 키를 설정하세요:

```bash
echo "VITE_GEMINI_API_KEY=your-gemini-api-key-here" > .env
```

> [!IMPORTANT]
> **보안**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다. API 키를 절대 공개 저장소에 업로드하지 마세요.

### 3. 빌드
```bash
npm run build
```

빌드가 완료되면 `dist/` 디렉토리에 다음 파일들이 생성됩니다:
- `manifest.json` - Extension 설정
- `background.js` - 백그라운드 서비스 워커
- `content.js` - 콘텐츠 스크립트
- `sidepanel/` - 사이드패널 UI (HTML, JS, CSS)
- `assets/` - 아이콘 및 리소스

### 4. Chrome에 설치

1. Chrome 주소창에 `chrome://extensions` 입력
2. 우측 상단의 **"개발자 모드"** 토글 ON
3. **"압축해제된 확장 프로그램을 로드합니다"** 클릭
4. `chrome_extansion/dist` 폴더 선택
5. ✅ TagStock 확장 프로그램 설치 완료!

> [!WARNING]
> **중요**: `chrome_extansion/dist` 폴더를 선택하세요. 루트 폴더가 아닙니다!

## 📖 사용 방법

### 지원 사이트
- **Adobe Stock**: https://contributor.stock.adobe.com/kr/uploads
- **Shutterstock**: https://submit.shutterstock.com/

### 메타데이터 자동 생성하기

1. 지원하는 사이트에서 이미지 업로드
2. 확장 프로그램 아이콘을 클릭하여 Side Panel 열기
3. 다음 두 가지 방법 중 하나로 실행:
   - **마우스**: Side Panel의 "Fill Metadata" 버튼 클릭
   - **키보드**: `Cmd+E` (Mac) 또는 `Ctrl+E` (Windows/Linux)
4. AI가 이미지를 분석하여 제목과 키워드를 자동으로 생성
5. 생성된 메타데이터가 자동으로 입력됩니다

### 단축키
- `Cmd+E` (Mac) / `Ctrl+E` (Windows/Linux): 메타데이터 생성 및 입력

## 🏗️ 기술 스택

- **TypeScript**: 타입 안정성과 코드 품질 향상
- **Vite**: 빌드 도구, TypeScript 및 환경 변수 지원
- **PostCSS + Tailwind CSS v4**: 모던 스타일링
- **Google Gemini AI**: 이미지 분석 및 메타데이터 생성

## 📁 프로젝트 구조

```
chrome_extansion/
├── src/
│   ├── background/
│   │   └── index.ts           # Service Worker
│   ├── content/
│   │   ├── index.ts           # Content Script 엔트리
│   │   ├── keyboard-handler.ts
│   │   ├── message-handler.ts
│   │   └── metadata-filler.ts
│   ├── core/
│   │   ├── ai/                # Gemini AI 서비스
│   │   ├── sites/             # 사이트별 핸들러
│   │   └── utils/             # 유틸리티 함수
│   ├── shared/
│   │   ├── constants.ts       # 상수 정의
│   │   ├── messenger.ts       # 메시지 통신
│   │   └── types.ts           # TypeScript 타입
│   └── sidepanel/
│       ├── components/        # UI 컴포넌트
│       ├── index.ts           # 사이드패널 로직
│       ├── sidepanel.html
│       └── styles.css
├── dist/                      # 빌드 출력 (Chrome 설치용)
├── manifest.json
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🔧 개발 가이드

### 환경 변수 작동 방식

Vite는 빌드 시점에 `import.meta.env.VITE_GEMINI_API_KEY`를 `.env` 파일의 값으로 치환합니다:

```typescript
// src/core/ai/gemini-client.ts
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

빌드 후에는 API 키가 JavaScript 코드에 포함됩니다. Chrome Extension은 로컬에서만 실행되므로 안전합니다.

### 코드 수정 후

1. `npm run build` 실행
2. Chrome 확장 프로그램 페이지(`chrome://extensions`)에서 새로고침 버튼 클릭

### dist 폴더 구조

빌드 후 `dist/` 폴더 구조:

```
dist/
├── manifest.json
├── background.js
├── content.js
├── sidepanel/
│   ├── sidepanel.html
│   ├── index.js
│   └── styles.css
├── assets/
│   └── icon/
└── chunks/
    └── messenger.js
```

## 📦 배포

고객에게 배포할 때:

1. `.env`에 본인의 API 키 입력
2. `npm run build` 실행
3. `dist/` 디렉토리를 ZIP으로 패키징:

```bash
cd chrome_extansion
npm run build
cd dist
zip -r ../tagstock-extension.zip .
```

생성된 `tagstock-extension.zip` 파일을 배포하세요.

**고객은 API 키를 직접 입력할 필요가 없습니다.**

## 🧪 테스트

### Adobe Stock
1. https://contributor.stock.adobe.com/kr/uploads 접속
2. 이미지 업로드
3. TagStock 아이콘 클릭 (사이드패널 열기)
4. "Fill Metadata" 버튼 클릭 또는 `Cmd+E` / `Ctrl+E`

### Shutterstock
1. https://submit.shutterstock.com/ 접속
2. 이미지 업로드
3. TagStock 사이드패널 사용

## ⚠️ 주의사항

- **Chrome에 설치**: `chrome_extansion/dist` 폴더를 선택하세요 (루트 폴더 아님)
- **API 키 필수**: 빌드 전에 `.env` 파일에 Gemini API 키를 반드시 설정하세요
- **보안**: `.env` 파일을 Git에 커밋하지 마세요 (`.gitignore`에 포함됨)

## 📄 라이선스

MIT License
