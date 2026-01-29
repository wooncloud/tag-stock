# Lemon Squeezy 설정 가이드

이 문서는 **Lemon Squeezy**를 결제 플랫폼으로 사용하여 글로벌 SaaS 서비스를 운영하기 위한 설정 방법을 안내합니다.

## 1. API 키 발급 (이미 완료)
- **위치**: [Lemon Squeezy Dashboard > Settings > API](https://app.lemonsqueezy.com/settings/api)
- `LEMON_SQUEEZY_API` 항목에 해당 값을 넣습니다.

---

## 2. Store ID 확인
- **위치**: [Lemon Squeezy Dashboard > Settings > Stores](https://app.lemonsqueezy.com/settings/stores)
- 목록에 있는 본인의 Store 이름 옆에 있는 **ID**(숫자)를 확인합니다.
- `.env.local`의 `LEMON_SQUEEZY_STORE_ID`에 입력합니다.

---

## 3. Webhook 설정
- **위치**: [Lemon Squeezy Dashboard > Settings > Webhooks](https://app.lemonsqueezy.com/settings/webhooks)
- **새 Webhook 추가**:
  - **URL**: `https://tagstock.app/api/webhooks/lemonsqueezy` (로컬 테스트 시 ngrok URL 사용)
  - **Signing Secret**: 본인이 원하는 복잡한 문자열을 입력합니다. (예: `tagstock_webhook_2026`)
  - **Events**: 다음 이벤트들을 체크합니다.
    - `subscription_created`
    - `subscription_updated`
    - `subscription_cancelled`
    - `subscription_expired`
    - `order_created` (크레딧 팩 구매용)
- **환경 변수**: 입력한 `Signing Secret` 값을 `LEMON_SQUEEZY_WEBHOOK_SECRET`에 넣습니다.

---

## 4. Variant ID 확인 (Product 설정)
Lemon Squeezy에서는 **Product** 아래에 여러 개의 **Variant**(예: 월간 플랜, 연간 플랜)가 존재합니다. 각 Variant의 고유 ID를 가져와야 합니다.

### 구독 플랜 (Subscriptions)
1. [Dashboard > Products](https://app.lemonsqueezy.com/products)로 이동합니다.
2. `Pro`와 `Max` 제품을 각각 생성합니다 (Subscription 타입).
3. 각 제품 안에서 **Variants** 탭을 클릭합니다.
4. 각 요금제(Monthly/Yearly)의 **ID**(숫자)를 확인하여 다음 변수에 각각 넣습니다.
   - `NEXT_PUBLIC_LEMON_SQUEEZY_PRO_MONTHLY_VARIANT_ID`
   - `NEXT_PUBLIC_LEMON_SQUEEZY_PRO_YEARLY_VARIANT_ID`
   - `NEXT_PUBLIC_LEMON_SQUEEZY_MAX_MONTHLY_VARIANT_ID`
   - `NEXT_PUBLIC_LEMON_SQUEEZY_MAX_YEARLY_VARIANT_ID`

### 크레딧 팩 (One-time Purchases)
1. `Credit Pack S` (100 크레딧, $2)와 `Credit Pack L` (1,000 크레딧, $15) 제품을 생성합니다 (One-time 타입).
2. 각 제품의 Variant ID를 확인하여 다음 변수에 넣습니다.
   - `NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_S_VARIANT_ID`
   - `NEXT_PUBLIC_LEMON_SQUEEZY_CREDIT_PACK_L_VARIANT_ID`

---

## 💡 로컬 테스트 팁 (ngrok 사용)
Lemon Squeezy의 Webhook이 로컬 환경(`localhost`)에 도달하려면 외부 노출이 필요합니다.

1. `ngrok http 3000` 실행
2. 생성된 `https://...ngrok-free.app` 주소를 복사
3. Lemon Squeezy Webhook URL을 `https://...ngrok-free.app/api/webhooks/lemonsqueezy`로 설정

## ⚠️ 주의사항
- 모든 ID는 **숫자** 형태입니다.
- 환경 변수 변경 후에는 서버를 재시작(`npm run dev`)해야 반영됩니다.
- Lemon Squeezy의 **Store가 "Active" 상태**여야 실제 결제 페이지가 정상 작동하며, 심사 전에는 "Test Mode"를 활성화하여 테스트할 수 있습니다.
