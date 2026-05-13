# TASK-013: Weekly plan creation + week picker + draft persistence

## Status

complete

## Phase

Phase 3: Weekly planner (assign recipes)

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-012

## Requirements

- REQ-030

## Objective

Create/select weekly plan tied to real calendar week (Mon–Sun) and persist draft plan records in `weekly_plans` + `plan_meals`.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `supabase/schema.sql`
- `apps/web/src/lib/db/plans.ts`

## Files Expected to Change

- `apps/web/src/lib/db/plans.ts`
- `apps/web/src/lib/date/week.ts`
- `apps/web/src/app/app/planner/page.tsx`

## Scope

In scope:
- Week picker that normalizes to Monday `week_start_date`.
- `getOrCreateWeeklyPlan()` ensures one plan/week/account.
- `upsertPlanMeal()` for per-person/day/slot persistence.

Out of scope:
- Publish flow + portions snapshot (TASK-015)

## Implementation Notes

- `week_start_date` stored as ISO `YYYY-MM-DD` date string.
- Meal slots shown based on person `meals_per_day`.

## Acceptance Criteria

- [x] Visiting planner creates draft plan row for selected week.
- [x] Changing week selects/creates correct plan.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

## Commit Instructions

Suggested commit message:

`feat(planner): add weekly plan + week picker`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added weekly plan DB helpers and week normalization utilities.
- Added planner page that creates/loads weekly plan by Monday date.

### Files Changed

- `apps/web/src/lib/db/plans.ts`
- `apps/web/src/lib/date/week.ts`
- `apps/web/src/app/app/planner/page.tsx`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

### Follow-ups

- Implement publish + portions snapshot (TASK-015).
