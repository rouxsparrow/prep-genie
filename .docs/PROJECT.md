# Prep Genie

## What This Is

Prep Genie web app for people who do weekly meal prep for themselves/family. Planner logs in, sets nutrition goals per Person, saves recipes, builds week plan (Mon–Sun), then system computes cooked gram portions per meal slot to hit macro targets (within tolerances) and generates shopping list from saved plan.

Domain constraints:
- Weekly planning anchored to real calendar week (Mon–Sun)
- Coverage fixed at 80% daily goals (meals combined)
- Slot ratios fixed by meals/day (2 meals: 50/50, 3 meals: 20/40/40)
- Portion rounding nearest 5g

---

## Core Value

Structured weekly meal planning that auto-optimizes portions to nutrition goals and outputs shopping list.

---

## Current Milestone

**Milestone:** v0.1 MVP  
**Goal:** End-to-end flow: auth → manage People/Recipes → plan week → compute portions (manual adjust) → publish snapshot → shopping list.

### Target Features

- Supabase Auth email sign-in/up
- People profiles with daily goals, meals/day, clamps
- Recipe CRUD + strict JSON import
- Weekly planner (click-to-assign) + publish snapshot
- Portion solver + manual adjustment + deviation/clamp highlight
- Shopping list with yield conversion rules

---

## Requirements Summary

### Validated

- (none yet)

### Active (v0.1 MVP)

- [ ] Auth + dev-only admin bypass
- [ ] People + Recipes + Recipe JSON import
- [ ] Weekly planner (Mon–Sun) with meal composition rules
- [ ] Portion solver + manual adjustments + clamps/tolerances UI
- [ ] Publish snapshot + shopping list (draft/published)

### Future

- Drag & drop planner UI
- Store category taxonomy + ingredient normalization rules
- Multi-user shared household (multiple logins per account)

---

## Out of Scope

| Feature | Reason |
|---|---|
|  |  |
|  |  |
|  |  |

---

## Context

### Product Context

- **Users:** 
- **Primary workflow:** 
- **Region / domain:** 
- **Currency / locale:** 
- **Known data sources:** 

### Current State

- **Shipped version:** 
- **Current milestone:** 
- **Known gaps entering this milestone:** 
- **Main risk areas:** 

---

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | Next.js (App Router) + TypeScript |
| Backend | Next.js server actions / route handlers (as needed) |
| Database | Supabase Postgres |
| Auth | Supabase Auth (email/password) |
| Hosting | Local dev + (later) Vercel |
| UI | Tailwind CSS + shadcn/ui |
| Charts | (none MVP) |
| State / URL State | React state + simple URL params where needed |
| Other | zod for validation, date-fns for week logic |

---

## Constraints

Project constraints the Agent must respect.

- Coverage fixed at 80% daily goals for meals combined.
- Slot ratios fixed by meals/day (2 meals: 50/50; 3 meals: 20/40/40).
- Meal composition requires Protein+Carb+Veg; Extra optional.
- Rounding rule: cooked grams nearest 5g.
- Draft plan stores recipe references only; publish stores computed portion snapshot.
- RLS enabled for all tables; every row scoped to `auth.uid()` (`account_id`).
- `admin/admin` bypass only behind env flag; never default-on for deploy.

Example:
- Currency is SGD only for v1.
- Manual PDF import is the current workflow.
- Do not introduce bank sync unless explicitly requested.
- Keep current role model unless milestone scope changes.

---

## Key Decisions

Only keep decisions that still affect future work.  
Put detailed historical notes elsewhere, because apparently documents are not supposed to become archaeological sites.

| Decision | Rationale | Current Status |
|---|---|---|
|  |  | Active |
|  |  | Active |
|  |  | Revisit Later |

---

## Important Rules

Reusable business or technical rules that future Agent sessions must not accidentally break.

- 
- 
- 
- 

Example:
- Rules are evaluated top-to-bottom.
- First matching rule wins.
- Card payments are excluded from spending analytics.
- Viewers can read analytics but cannot perform admin actions.

---

## Linked Docs

| Topic | File |
|---|---|
| Requirements | `.docs/REQUIREMENTS.md` |
| Current state | `.docs/STATE.md` |
| Setup | `SETUP.md` |
| Agent rules | `AGENTS.md` |

---

## Evolution Rules

Update this document only at major transition points:

- Milestone kickoff
- Milestone completion
- Major scope change
- Major technical decision
- Core product direction change

Do not update this file for:
- Tiny UI changes
- Copy changes
- Small bug fixes
- Internal refactors that do not change product behavior

When updating this document:

1. Check whether `What This Is` is still accurate.
2. Check whether `Core Value` still reflects the product.
3. Move completed milestone capabilities into `Validated`.
4. Move deferred items into `Future` or `Out of Scope`.
5. Add only important decisions to `Key Decisions`.
6. Keep details in feature docs, requirements docs, or phase summaries instead of dumping everything here like a landfill with headings.

---

*Last updated: YYYY-MM-DD*
