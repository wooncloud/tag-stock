# TagStock

**https://tagstock.app**

AI-powered automatic tagging and metadata embedding for stock photographers. Analyze images with Google Gemini AI to generate SEO-optimized titles, descriptions, and keywords for Adobe Stock, Shutterstock, and more.

---

## Features

- **AI Tagging** - Google Gemini Flash analyzes images and generates platform-optimized metadata (titles, keywords)
- **Chrome Extension** - Auto-fill metadata directly on Adobe Stock and Shutterstock upload pages with one click or `Cmd+E`
- **IPTC/XMP Embedding** - Embed metadata directly into JPEG image files for portable, platform-independent tagging
- **Batch Processing** - Process multiple images at once through the extension's local mode
- **Credit System** - Flexible pricing with monthly subscriptions and one-time credit packs

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Shadcn/UI |
| Auth & DB | Supabase (OAuth, PostgreSQL, Edge Functions) |
| AI | Google Gemini Flash |
| Payments | Lemon Squeezy |
| Extension | Vite 5, Manifest V3 |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- Google Gemini API key
- Lemon Squeezy account (for payments)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

### Build

```bash
# Lint + production build
npm run build

# Chrome extension build
npm run build:ce
```

---

## Project Structure

```
tag-stock/
├── app/              # Next.js App Router (pages, API routes, server actions)
├── components/       # React components (UI, landing, dashboard, blog)
├── lib/              # Core libraries (Supabase, blog, validations)
├── services/         # Business logic (Gemini AI, billing, prompts, Discord)
├── types/            # TypeScript type definitions
├── content/blog/     # MDX blog posts
├── supabase/         # Edge Functions & migrations
├── chrome_extansion/ # Chrome extension (Vite + TypeScript)
└── docs/             # Project documentation (Korean)
```

---

## Documentation

Detailed documentation is available in the [`/docs`](./docs) directory (Korean):

- [Architecture](./docs/architecture.md) - Project structure, database schema, auth system, AI pipeline, billing
- [Development Guide](./docs/development.md) - Local setup, environment variables, Supabase & Lemon Squeezy configuration
- [Chrome Extension](./docs/chrome-extension.md) - Extension architecture, build process, module breakdown

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Lint + production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run build:ce` | Build Chrome extension |

---

## License

This project is licensed under the MIT License.
