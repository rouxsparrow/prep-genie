# TASK-025: Support batch recipe JSON import (array) + upsert by name

## Status

complete

## Phase

Phase 2: DB schema + People + Recipes

## Wave

Wave 2

## Type

implementation

## Depends On

- TASK-012

## Requirements

- REQ-021
- INFR-09

## Objective

Extend recipe import to accept JSON array of v1 recipe objects, validate all first (all-or-nothing), then upsert into `recipes` by `(account_id, name)` so repeat imports overwrite same-name recipes.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `.docs/STATE.md`
- `supabase/schema.sql`
- `src/app/app/recipes/import/submit/route.ts`
- `src/app/app/recipes/import/recipe-import-form.tsx`
- `src/lib/recipes/schema.ts`

## Files Expected to Change

- `supabase/schema.sql`
- `src/app/app/recipes/import/submit/route.ts`
- `src/app/app/recipes/import/recipe-import-form.tsx`
- `src/app/app/recipes/import/page.tsx`
- `src/lib/recipes/schema.test.ts`

## Scope

In scope:
- Input format: array only (`[{...},{...}]`).
- Validation: strict schema; if any item invalid, import none.
- Errors: return per-index/field error keys for UX.
- Upsert: conflict key `(account_id, name)`.

Out of scope:
- NDJSON / mixed single-object-or-array support.
- Name normalization / case-insensitive matching.

## Implementation Notes

- DB must enforce uniqueness for upsert: unique index on `(account_id, name)`.
- Migration risk: if DB already contains duplicates by `(account_id, name)`, unique index creation will fail. Cleanup duplicates before applying schema.

Pre-check query (run in Supabase SQL editor):

```sql
select account_id, name, count(*)
from public.recipes
group by account_id, name
having count(*) > 1;
```

## Acceptance Criteria

- [x] Paste JSON array imports multiple recipes and shows list of links.
- [x] If one item invalid, no recipes imported and errors show with item index.
- [x] Re-import same-name recipe updates existing row (via upsert).

## Verification

| Command | Result |
|---|---|
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run test` | Pass |

## Commit Instructions

Suggested commit message:

`feat(recipes): support batch JSON import`

## Completion Summary

**Status:** complete  
**Commit:** 525469d  
**Completed At:** 2026-05-14

### What Changed

- Added `(account_id, name)` unique index for recipes.
- Updated import endpoint to accept array + validate all-or-nothing.
- Updated import UI to show multi-result list.
- Added unit test covering batch rejection on invalid item.

### Files Changed

- `supabase/schema.sql`
- `src/app/app/recipes/import/submit/route.ts`
- `src/app/app/recipes/import/recipe-import-form.tsx`
- `src/lib/recipes/schema.test.ts`

### Verification

| Command | Result |
|---|---|
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run test` | Pass |

### Follow-ups

- Optional: add partial-import mode later.
