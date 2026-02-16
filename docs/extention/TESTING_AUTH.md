# Chrome Extension Supabase Authentication - Test Guide

## 🎯 현재 구현 상태

✅ **완료된 항목:**
1. Supabase 클라이언트 설정
2. 인증 서비스 (OAuth, 프로필 관리)
3. 로그인 화면 UI
4. 크레딧 표시 컴포넌트
5. 사이드패널 인증 통합
6. 빌드 성공 (433KB sidepanel bundle)

⚠️ **테스트 필요:**
1. 로그인 플로우 (Google OAuth)
2. 크레딧 표시 및 업데이트
3. 로그아웃 기능
4. 세션 지속성

## 🧪 테스트 방법

### 1. Extension 빌드 및 설치

```bash
cd chrome_extansion
npm run build
```

Chrome에서:
1. `chrome://extensions` 접속
2. 개발자 모드 ON
3. "압축해제된 확장 프로그램 로드"
4. `chrome_extansion/dist` 폴더 선택

### 2. 로그인 테스트

1. TagStock 아이콘 클릭하여 사이드패널 열기
2. "Welcome to TagStock" 화면 확인
3. "Continue with Google" 버튼 클릭
4. Google OAuth 인증 진행

**예상 동작:**
- OAuth 창이 열림
- Google 계정 선택 후 인증
- 자동으로 사이드패널로 리다이렉트
- 사용자 이메일 및 크레딧 표시

**문제 가능성:**
- ⚠️ Chrome Extension OAuth는 특수 처리 필요
- Supabase 대시보드에서 리다이렉트 URL 설정 필요:
  - `chrome-extension://[EXTENSION_ID]/sidepanel/sidepanel.html`

### 3. 크레딧 표시 테스트

로그인 후 확인할 항목:
- [ ] 사용자 이메일 표시
- [ ] 플랜 이름 표시 (Free Plan, Starter Plan 등)
- [ ] 총 크레딧 숫자
- [ ] Subscription Credits / Purchased Credits 구분 표시
- [ ] 진행 바 (Free plan은 10 크레딧 기준)

### 4. 로그아웃 테스트

1. 우측 상단 로그아웃 버튼 클릭
2. 로그인 화면으로 돌아가는지 확인
3. 사이드패널 재오픈 시 로그인 화면 표시 확인

### 5. 세션 지속성 테스트

1. 로그인 상태에서 Chrome 재시작
2. 사이드패널 다시 열기
3. 로그인 상태 유지 확인

## 🐛 알려진 이슈 / 해결 필요

### OAuth 리다이렉트 문제

Chrome Extension에서 Supabase OAuth는 일반 웹앱과 다르게 동작합니다:

**해결 방법 1: Supabase 설정**
- Supabase Dashboard → Authentication → URL Configuration
- Redirect URLs에 추가: `chrome-extension://[YOUR_EXTENSION_ID]/sidepanel/sidepanel.html`
- Extension ID는 `chrome://extensions`에서 확인

**해결 방법 2: 대안 인증 방식**
Google OAuth가 작동하지 않으면:
- Email/Password 인증으로 전환 고려
- Magic Link 인증 구현

### 크레딧 소비 로직 미구현

현재는 로그인과 크레딧 표시만 구현되었습니다:
- [ ] Metadata 생성 시 크레딧 차감 로직 필요
- [ ] 서버 사이드 검증 필요 (Supabase Edge Functions)

## 📋 다음 단계

1. **OAuth 설정 완료**
   - Supabase에서 리다이렉트 URL 설정
   - 실제 로그인 테스트

2. **크레딧 소비 구현**
   - Content script에서 생성 전 크레딧 확인
   - Supabase Function으로 크레딧 차감
   - RPC 또는 Edge Function 사용

3. **에러 처리 개선**
   - 네트워크 오류 처리
   - 크레딧 부족 시 UI 피드백
   - OAuth 실패 시 재시도 로직

4. **사용자 경험 개선**
   - 로딩 상태 애니메이션
   - 크레딧 리프레시 버튼
   - 플랜 업그레이드 링크

## 🔐 보안 체크리스트

- [x] API 키는 환경 변수로 관리
- [x] Supabase Anon Key 사용 (RLS로 보호됨)
- [x] localStorage 세션 저장 (Extension 내부)
- [ ] Row Level Security 정책 확인 (Supabase DB)
- [ ] 크레딧 조작 방지 (서버 사이드 검증)

## 📝 테스트 결과 기록

테스트 후 아래에 결과 기록:

```
날짜: 
테스터: 
Extension ID: 

로그인: [ ] 성공 / [ ] 실패 - 사유:
크레딧 표시: [ ] 정상 / [ ] 오류 - 상세:
로그아웃: [ ] 정상 / [ ] 오류 - 상세:
세션 지속: [ ] 유지됨 / [ ] 끊김 - 상세:
```
