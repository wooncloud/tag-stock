# TagStock

AI-powered automatic tagging and metadata (IPTC) embedding for stock photographers.

## Documentation

All project documentation has been moved to the [`/docs`](./docs) directory:

- [ERD (Database Schema)](./docs/erd.md)
- [Setup Guide](./docs/SETUP_GUIDE.md)
- [Testing Checklist](./docs/TESTING_CHECKLIST.md)
- [Phase 1 Completion Report](./docs/PHASE1_COMPLETE.md)
- [Phase 2 Completion Report](./docs/PHASE2_COMPLETE.md)
- [Development Tasks](./docs/task.md)

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Shadcn/UI
- **Backend:** Supabase (PostgreSQL, Storage)
- **AI:** Google Gemini 3.0 Flash
- **Payments:** Stripe

## TODO

- [x] 문의 보내기 구현 (디스코드 웹훅)
- [x] IPTC 구현
- [x] 플랜 시스템 구현 (원본 이미지 업로드, 플랜별 압축 정책)
- [x] Stripe 결제 구현
- [ ] 다중업로드 (배치 처리 필요 - [가이드](./docs/PHASE3_PLANS.md#다중-업로드-구현-가이드-phase-32))
- [ ] 랜딩 페이지 좀 더 꾸미기
- [ ] 크롬 익스텐션 개발
