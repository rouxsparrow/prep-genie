# TASK-015: Publish week snapshot (compute + persist portions)

## Status

complete

## Phase

Phase 3: Weekly planner (assign recipes)

## Wave

Wave 2

## Type

implementation

## Depends On

- TASK-017

## Requirements

- REQ-050
- REQ-040

## Objective

Add publish flow that locks draft plan and saves computed portion snapshot into `plan_portions` for the selected week.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `supabase/schema.sql`
- `apps/web/src/lib/db/plans.ts`
- `apps/web/src/lib/solver/solver.ts`

## Files Expected to Change

- `apps/web/src/lib/db/plans.ts`
- `apps/web/src/app/app/planner/portions/page.tsx`

## Scope

In scope:
- “Publish snapshot” button in Portions view when plan status is `draft`.
- On publish: compute solver portions for all people/days/active meal slots and store rows in `plan_portions`.
- Update `weekly_plans.status` to `published` and set `published_at`.

Out of scope:
- Republish/recompute behavior for already-published plans (MVP shows “Published” label).

## Implementation Notes

- Snapshot stored per (plan, person, date, slot, category).
- Macro fields stored per-category for audit/shopping list.

## Acceptance Criteria

- [x] Draft plan can be published.
- [x] Publishing writes `plan_portions` rows and marks `weekly_plans` published.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

## Commit Instructions

Suggested commit message:

`feat(planner): publish portion snapshot`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added `plan_portions` replace helper and publish action on Portions page.

### Files Changed

- `apps/web/src/lib/db/plans.ts`
- `apps/web/src/app/app/planner/portions/page.tsx`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

### Follow-ups

- Add manual adjustment UI and pass overrides into snapshot (TASK-018).
