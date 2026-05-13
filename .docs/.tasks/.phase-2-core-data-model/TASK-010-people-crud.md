# TASK-010: Implement People CRUD UI

## Status

complete

## Phase

Phase 2: DB schema + People + Recipes

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-009

## Requirements

- REQ-010
- REQ-011
- REQ-012
- REQ-013
- REQ-014

## Objective

Provide authenticated UI to create, view, edit, and delete People with daily goals, meals/day, and optional category clamps.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `supabase/schema.sql`
- `apps/web/src/app/app/layout.tsx`
- `apps/web/src/lib/supabase/server.ts`

## Files Expected to Change

- `apps/web/src/lib/db/people.ts`
- `apps/web/src/app/app/people/*`

## Scope

In scope:
- People list page.
- Create page.
- Detail/edit page + delete action.
- Store clamps as JSONB with optional min/max per category.

Out of scope:
- Validation UI beyond basic HTML input constraints.

## Implementation Notes

- Inserts must set `account_id = auth.uid()` so RLS accepts row.
- Use server actions for writes.

## Acceptance Criteria

- [x] User can create person with goals and meals/day.
- [x] User can edit person and save changes.
- [x] User can delete person.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

## Commit Instructions

Suggested commit message:

`feat(people): add people CRUD`

## Completion Summary

**Status:** complete  
**Commit:** bf6882f  
**Completed At:** 2026-05-13

### What Changed

- Added People pages and server-side DB helpers for CRUD.

### Files Changed

- `apps/web/src/lib/db/people.ts`
- `apps/web/src/app/app/people/*`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

### Follow-ups

- None
