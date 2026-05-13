# TASK-012: Implement strict Recipe JSON import (v1)

## Status

complete

## Phase

Phase 2: DB schema + People + Recipes

## Wave

Wave 2

## Type

implementation

## Depends On

- TASK-011

## Requirements

- REQ-021

## Objective

Allow user to paste recipe JSON (v1) and import it into `recipes` table with strict schema validation and field-level errors; no defaults auto-filled.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `supabase/schema.sql`
- `apps/web/src/lib/db/recipes.ts`

## Files Expected to Change

- `apps/web/src/lib/recipes/schema.ts`
- `apps/web/src/app/app/recipes/import/*`
- `apps/web/src/lib/db/recipes.ts`
- `apps/web/src/app/app/recipes/page.tsx`

## Scope

In scope:
- Strict zod schema for recipe JSON v1 using `.strict()`.
- Import page (`/app/recipes/import`) with paste JSON textarea.
- Server handler validates JSON and returns field-level errors.
- On success, creates recipe row and stores `raw_json` snapshot.

Out of scope:
- File upload parsing (optional later).

## Implementation Notes

- Reject invalid JSON early.
- Reject missing/extra keys via strict schema.
- Return `zod` flattened `fieldErrors` to UI for display.

## Acceptance Criteria

- [x] Invalid JSON rejected with clear error.
- [x] Schema violations rejected with field-level errors.
- [x] Valid JSON imports to `recipes` with normalized fields + `raw_json`.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

## Commit Instructions

Suggested commit message:

`feat(recipes): add JSON import`

## Completion Summary

**Status:** complete  
**Commit:** d5576fd  
**Completed At:** 2026-05-13

### What Changed

- Added strict v1 recipe JSON schema + import route/page.

### Files Changed

- `apps/web/src/lib/recipes/schema.ts`
- `apps/web/src/app/app/recipes/import/*`
- `apps/web/src/lib/db/recipes.ts`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

### Follow-ups

- Optional: support upload `.json` file.
