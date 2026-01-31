# Chrome Extension 환경 설정 가이드

## API 키 설정

이 Chrome Extension은 Gemini AI API를 사용합니다. 빌드 전에 API 키를 설정해야 합니다.

### 1. .env 파일 생성

`chrome_extansion` 디렉토리에 [.env](file:///Users/woon/Documents/project/tag-stock/chrome_extansion/.env) 파일이 이미 생성되어 있습니다.

### 2. API 키 입력

`.env` 파일을 열고 실제 API 키로 교체:

```env
VITE_GEMINI_API_KEY=실제-gemini-api-키-여기-입력
```

> [!IMPORTANT]
> **보안**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다. API 키를 절대 공개 저장소에 업로드하지 마세요.

### 3. 빌드

```bash
cd chrome_extansion
npm run build
```

빌드가 완료되면 `dist/` 디렉토리에 다음 파일들이 생성됩니다:
- `background.js` - 백그라운드 서비스 워커
- `content.js` - 콘텐츠 스크립트
- `sidepanel/index.js` - 사이드패널 UI

## 빌드 시스템

- **TypeScript**: `tsconfig.json`으로 설정된 strict 모드
- **Vite**: 모던 빌드 도구, TypeScript 및 환경 변수 지원
- **PostCSS + Tailwind v4**: 스타일링 (자동으로 처리됨)

## 환경 변수 작동 방식

Vite는 빌드 시점에 `import.meta.env.VITE_GEMINI_API_KEY`를 `.env` 파일의 값으로 치환합니다.

**코드 예시**:
```typescript
// src/core/ai/gemini-client.ts
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

빌드 후에는 API 키가 JavaScript 코드에 포함됩니다. Chrome Extension은 로컬에서만 실행되므로 안전합니다.

## 배포

고객에게 배포할 때는:
1. `.env`에 본인의 API 키 입력
2. `npm run build` 실행
3. `dist/` 디렉토리와 필요 파일들을 패키징

고객은 API 키를 직접 입력할 필요가 없습니다.
