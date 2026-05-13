# TASK-011: Implement Recipes CRUD UI

## Status

complete

## Phase

Phase 2: DB schema + People + Recipes

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-010

## Requirements

- REQ-020

## Objective

Provide authenticated UI to create, view, edit, and delete Recipes with normalized fields and `raw_json` snapshot persisted alongside.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `supabase/schema.sql`
- `apps/web/src/lib/supabase/server.ts`
- `apps/web/src/app/app/layout.tsx`

## Files Expected to Change

- `apps/web/src/lib/db/recipes.ts`
- `apps/web/src/app/app/recipes/*`
- `apps/web/src/lib/db/types.ts`

## Scope

In scope:
- Recipe list page.
- Create page.
- Detail/edit page + delete action.
- Store `ingredients_g` and `steps` as JSON arrays (edited via JSON textarea in MVP).
- Populate `raw_json` snapshot based on normalized fields.

Out of scope:
- Strict schema import with field-level errors (TASK-012).

## Implementation Notes

- Inserts must set `account_id = auth.uid()` so RLS accepts row.
- Use server actions for writes; basic JSON parse errors throw for now.

## Acceptance Criteria

- [x] User can create recipe with required fields.
- [x] User can edit and save recipe.
- [x] User can delete recipe.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

## Commit Instructions

Suggested commit message:

`feat(recipes): add recipes CRUD`

## Completion Summary

**Status:** complete  
**Commit:** cff3317  
**Completed At:** 2026-05-13

### What Changed

- Added Recipes pages and DB helpers for CRUD.

### Files Changed

- `apps/web/src/lib/db/recipes.ts`
- `apps/web/src/app/app/recipes/*`
- `apps/web/src/lib/db/types.ts`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

### Follow-ups

- Implement strict JSON import UX (TASK-012).
