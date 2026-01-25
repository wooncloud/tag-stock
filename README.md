# TagStock

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
- [ ] **Credit System**: Monthly credit grant via Edge Functions
- [ ] **Payment Integration**: Lemon Squeezy subscription model
- [x] **Contact Logic**: Discord webhook integration
- [x] **IPTC Embedding**: Direct metadata injection into image files
- [ ] **Batch Processing**: Multiple image upload optimization
- [ ] **Landing Page**: Enhanced design and social proofs
- [ ] **Chrome Extension**: Direct metadata capture from browser

---

## 📄 License

This project is licensed under the MIT License.
