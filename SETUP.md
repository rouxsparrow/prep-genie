# Prep Genie — Setup Checklist (MVP)

This checklist gets the app running locally using a **hosted Supabase** project (no Supabase CLI required for MVP).

---

## 1) Prerequisites

- [ ] Install **Node.js 20+**
- [ ] Confirm npm works: `node -v` and `npm -v`
- [ ] Create accounts:
  - [ ] Supabase (required)
  - [ ] Vercel (optional; for later deployment)

---

## 2) Clone + Install

- [ ] Clone repo:
  - `git clone <YOUR_REPO_URL>`
- [ ] Enter repo:
  - `cd /Users/rouxsparrow/Code/prep-genie`
- [ ] Install web app deps:
  - `cd apps/web`
  - `npm install`

---

## 3) Create Supabase Project (Hosted)

- [ ] Create a new Supabase project in the Supabase Dashboard.
- [ ] In your project settings, locate and record:
  - [ ] **Project URL**
  - [ ] **Anon (public) key**
  - [ ] **Service role key** (server-only; never expose to the browser)

Security note:
- Treat the **service role key** like a password. Never put it in any `NEXT_PUBLIC_*` env var and never commit it.

---

## 4) Configure Supabase Auth

- [ ] Go to **Authentication → Providers**
  - [ ] Enable **Email** (email + password)
- [ ] Go to **Authentication → URL Configuration**
  - [ ] Set **Site URL** to `http://localhost:3000`
  - [ ] Add redirect URLs as needed for local dev, at minimum:
    - [ ] `http://localhost:3000`
- [ ] Recommended for local dev (MVP):
  - [ ] Disable email confirmations (or set to a mode that allows immediate sign-in), so you can iterate quickly.

---

## 5) Set Up Database (Hosted)

For MVP, run the schema using Supabase **Dashboard → SQL Editor**.

- [ ] Open Supabase Dashboard → **SQL Editor**
- [ ] Run the project schema SQL file:
  - [ ] `supabase/schema.sql`
- [ ] Verify tables exist and RLS is configured appropriately.

Minimum RLS expectations (high-level):
- [ ] Users can only read/write their own rows (typically via `auth.uid()` checks).
- [ ] Any admin-only tables/routes should be locked down (MVP may use a local bypass, but DB rules still matter).

---

## 6) Configure Environment Variables (Local)

Create a local env file (never commit it):

- [ ] Create `apps/web/.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://<YOUR_PROJECT_REF>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<YOUR_SUPABASE_ANON_KEY>"

# Only add if/when the app needs server-only Supabase admin operations:
# SUPABASE_SERVICE_ROLE_KEY="<YOUR_SUPABASE_SERVICE_ROLE_KEY>"
```

Security notes:
- [ ] Do not commit `.env*` files (repo ignores them).
- [ ] If a key is leaked, rotate it in Supabase immediately.

---

## 7) Run the App

- [ ] Start dev server:
  - `cd apps/web`
  - `npm run dev`
- [ ] Open:
  - `http://localhost:3000`

---

## 8) MVP Admin Bypass (When Implemented)

MVP includes a **dev-only** bypass login:

- Username: `admin`
- Password: `admin`

Checklist (once implemented):
- [ ] Identify the admin login page/route.
- [ ] Confirm it only grants access to admin screens and is clearly marked **NOT production-safe**.

---

## 9) Troubleshooting

- [ ] Blank page / runtime error:
  - [ ] Check `apps/web/.env.local` exists and values are correct.
  - [ ] Restart `npm run dev` after changing env vars.
- [ ] Supabase sign-in fails:
  - [ ] Confirm Email provider is enabled.
  - [ ] Confirm Site URL / redirect URLs include `http://localhost:3000`.
  - [ ] Check Supabase Auth logs for errors.
- [ ] “Permission denied” / no data returned:
  - [ ] RLS policies may be blocking reads/writes.
  - [ ] Confirm policies use `auth.uid()` and match your table ownership columns.
- [ ] Port already in use:
  - [ ] Stop the other process using 3000, or run Next on a different port (e.g. `npm run dev -- -p 3001`).
