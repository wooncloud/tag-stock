# TagStock

🌐 **https://tagstock.app**

AI-powered automatic tagging and metadata (IPTC) embedding for stock photographers.

---

## 📖 Documentation

Detailed project documentation is available in the [`/docs`](./docs) directory:

- [**Main README**](./docs/README.md) - Project overview, features, and setup
- [ERD (Database Schema)](./docs/erd.md)
- [Setup Guide](./docs/SETUP_GUIDE.md)
- [Testing Checklist](./docs/TESTING_CHECKLIST.md)

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15 (App Router), Tailwind CSS, Shadcn/UI
- **Backend:** Supabase (Auth, DB, Storage, Edge Functions)
- **AI:** Google Gemini 3 Flash
- **Payments:** Lemon Squeezy

---

## ✅ Progress & TODO

- [x] **AI Tagging Engine**: Google Gemini 3 Flash integration
- [x] **Auth System**: Multi-provider OAuth (Google, Apple)
- [x] **Dashboard**: Image management and metadata editing
- [x] **Credit System**: Monthly credit grant via Edge Functions
- [x] **Payment Integration**: Lemon Squeezy subscription model
- [x] **Contact Logic**: Discord webhook integration
- [x] **IPTC Embedding**: Direct metadata injection into image files
- [ ] **Batch Processing**: Multiple image upload optimization
- [x] **Landing Page**: Enhanced design and social proofs
- [x] **Chrome Extension**: Direct metadata capture from browser

- 레몬스퀴지 실제 결제 해봐야함.
- 레몬스퀴지 설정 디테일하게 해야함.
- 크레딧 없으면 사용 못하게.
- 크롬 익스텐션 셔터스톡 카테고리 자동화
- 크롬 익스텐션 셔터스톡 설명 자동화
- 크롬 익스텐션 어도비스톡 "인물, 사유물" 자동화

---

## 📄 License

This project is licensed under the MIT License.
