# TagStock Chrome Extension

Adobe Stock 및 Shutterstock 업로드 프로세스를 자동화하는 Chrome 확장 프로그램입니다.

## 기능

- Side Panel을 통한 직관적인 UI
- Google Gemini AI를 사용하여 메타데이터 자동 생성
- 제목과 키워드 자동 생성
- 키보드 단축키 지원 (`Cmd+E` / `Ctrl+E`)

## 사용법

### 지원 사이트
- **Adobe Stock**: https://contributor.stock.adobe.com/
- **Shutterstock**: https://www.shutterstock.com/contributor

### Side Panel 사용하기

1. 확장 프로그램 아이콘을 클릭하여 Side Panel 열기
2. **Adobe Stock** 또는 **Shutterstock** 업로드 페이지로 이동
3. 이미지를 업로드한 후 다음 두 가지 방법 중 하나로 실행:
   - **마우스**: Side Panel의 "Fill Metadata" 버튼 클릭
   - **키보드**: `Cmd+E` (Mac) 또는 `Ctrl+E` (Windows/Linux)
4. AI가 이미지를 분석하여 제목과 키워드를 자동으로 생성합니다
5. 생성된 메타데이터가 자동으로 입력되고 저장됩니다

### 단축키
- `Cmd+E` (Mac) / `Ctrl+E` (Windows/Linux): 메타데이터 채우기 실행

## 설치 및 사용법

### 1. 의존성 설치
```bash
npm install
```

### 2. 빌드
```bash
npm run build
```

### 3. API 키 설정
`src/aiServices/ai-service.js` 파일에서 Gemini API 키를 설정하세요.

### 4. Chrome 확장 프로그램 로드
1. Chrome에서 `chrome://extensions/` 접속
2. "개발자 모드" 활성화
3. "압축 해제된 확장 프로그램을 로드합니다" 클릭
4. 프로젝트 폴더 선택

## 개발

### 개발 모드 (watch mode)
```bash
npm run dev
```

### 린트 확인
```bash
npm run lint
```

### 패키징
```bash
npm run package
```

## 구조

```
src/
├── main.js                 # Content Script (DOM 조작)
├── background/
│   └── background.js       # Service Worker
├── sidepanel/
│   ├── sidepanel.html      # Side Panel UI
│   └── sidepanel.js        # Side Panel 로직
├── aiServices/
│   ├── ai-service.js       # Gemini AI 서비스
│   └── ai-metadata.js      # 메타데이터 생성
├── utils/                  # 유틸리티 함수들
└── prompts/                # AI 프롬프트

dist/
├── content.js              # 빌드된 Content Script
└── background.js           # 빌드된 Service Worker
```

## API 키 보안

실제 배포시에는 API 키를 다음과 같은 방법으로 안전하게 관리하세요:
1. Chrome storage API 사용
2. 사용자가 옵션 페이지에서 직접 입력
3. 외부 인증 서비스 사용
