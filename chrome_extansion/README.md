# Adobe Stock Tool Chrome Extension

Adobe Stock 업로드 프로세스를 자동화하는 Chrome 확장 프로그램입니다.

## 기능

- Adobe Stock 및 Shutterstock 업로드 페이지에서 "채우기" 버튼 추가
- Google Gemini AI를 사용하여 메타데이터 자동 생성
- 제목과 키워드 자동 생성
- 키보드 단축키 지원 (`Cmd+E` / `Ctrl+E`)

## 사용법

### 지원 사이트
- **Adobe Stock**: https://contributor.stock.adobe.com/
- **Shutterstock**: https://www.shutterstock.com/contributor

### 채우기 버튼 사용하기

1. **Adobe Stock** 또는 **Shutterstock** 업로드 페이지로 이동
2. 이미지를 업로드하면 자동으로 "채우기" 버튼이 생성됩니다
3. 다음 두 가지 방법 중 하나로 실행:
   - **마우스**: "채우기" 버튼 클릭
   - **키보드**: `Cmd+E` (Mac) 또는 `Ctrl+E` (Windows/Linux)
4. AI가 이미지를 분석하여 제목과 키워드를 자동으로 생성합니다
5. 생성된 메타데이터가 자동으로 입력되고 저장됩니다

### 단축키
- `Cmd+E` (Mac) / `Ctrl+E` (Windows/Linux): 채우기 버튼 실행

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
생성된 `dist/content.js` 파일에서 `YOUR_GEMINI_API_KEY_HERE`를 실제 Gemini API 키로 교체하세요.

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

- `src/main.js`: 통합된 엔트리 포인트
- `src/ai-service.js`: Google Gemini AI 서비스
- `dist/content.js`: 빌드된 번들 파일
- `manifest.json`: Chrome 확장 프로그램 설정
- `popup.html/popup.js`: 확장 프로그램 팝업

## API 키 보안

실제 배포시에는 API 키를 다음과 같은 방법으로 안전하게 관리하세요:
1. Chrome storage API 사용
2. 사용자가 옵션 페이지에서 직접 입력
3. 외부 인증 서비스 사용 