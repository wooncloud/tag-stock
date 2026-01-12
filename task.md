
# 🚀 Updated Prompt for Claude: Build TagStock.ai

## Context

**Project Name:** TagStock.ai (GitHub: `tag-stock`)

**Target Audience:** Global Stock Photographers (Adobe Stock, Shutterstock)

**Core Value:** AI-powered automatic tagging and metadata (IPTC) embedding.

**Tech Stack:** - **Frontend:** Next.js (App Router, Vercel Standard Convention), Tailwind CSS, Shadcn/UI

* **Backend/Database:** Supabase (PostgreSQL, Storage)
* **Auth:** Supabase Auth (OAuth ONLY: Google, Apple, X)
* **AI:** Google Gemini 3.0 Flash
* **Payments:** Stripe (Subscription model)
* **Infrastructure:** Vercel

---

## Instructions

Please act as a Senior Full-stack Engineer at Vercel. We will build this Micro-SaaS in phases. You must follow **Vercel's official Next.js folder structure and development conventions** (App Router, Server Components, Server Actions). All UI must be in **English**.

---

## Phase 1: Infrastructure & OAuth Setup

**Goal:** Initialize the environment with strict Next.js conventions and OAuth-only authentication.

1. **Initialize Next.js:** Setup a project using the latest App Router structure. Follow the standard directory layout (e.g., `app/`, `components/`, `lib/`, `hooks/`, `services/`).
2. **Supabase Auth (OAuth Only):**
* Configure Supabase Auth to support **Google, Apple, and X (Twitter)** only.
* **No Email/Password authentication.**
* Implement protected routes using Next.js Middleware.


3. **Database & Storage:**
* `profiles`: `id (uuid)`, `email`, `plan (free/pro)`, `credits_remaining`, `created_at`.
* `images`: `id`, `user_id`, `storage_path`, `status`, `created_at`.
* `metadata`: `id`, `image_id`, `tags (jsonb)`, `title`, `description`.
* Configure Supabase Storage with RLS for secure image handling.


4. **Base UI:** Create a professional landing page and dashboard shell using Shadcn/UI.

---

## Phase 2: MVP Core Feature (AI Engine & Metadata)

**Goal:** Implement the full automated tagging workflow.

1. **Image Upload (Vercel Style):**
* Build a high-performance drag-and-drop upload zone.
* Handle multi-file uploads and state management efficiently.


2. **Gemini 3.0 Flash Integration:**
* Implement Server Actions to call Gemini 3.0 Flash.
* **Prompt:** Optimize for Adobe Stock/Shutterstock metadata standards (High-relevance keywords, SEO titles).


3. **Pro Feature - Metadata Embedding:**
* Use a pure JS library to embed AI-generated metadata into the image files.
* Ensure this process is optimized for Vercel's serverless environment (avoiding timeouts).


4. **Stripe Billing:** * Set up subscription-based billing (Free vs. Pro).
* Sync subscription status via Stripe Webhooks to Supabase.



---

## Phase 3: Technical & Structural Audit Report

**Goal:** Perform a deep-dive analysis of the Phase 2 implementation.

1. **Structural Review:** Evaluate if the folder structure and component separation follow Vercel's best practices.
2. **Technical Debt & Bottlenecks:** Identify potential issues with large image processing, Vercel serverless timeouts, or API rate limits.
3. **Security Audit:** Review RLS policies, OAuth flow security, and API key management.
4. **Scaling Roadmap:** Provide a report on how to optimize the architecture for high-volume concurrent uploads and global expansion.
