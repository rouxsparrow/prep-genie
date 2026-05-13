# TASK-019: Shopping list (published snapshot) + yield conversion

## Status

complete

## Phase

Phase 5: Shopping list

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-015

## Requirements

- REQ-060

## Objective

Generate shopping list by aggregating ingredient totals across published week snapshot, applying yield conversion rules for `is_main` ingredients.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `apps/web/src/lib/shopping/shopping.ts`
- `apps/web/src/app/app/shopping/page.tsx`

## Files Expected to Change

- `apps/web/src/lib/shopping/shopping.ts`
- `apps/web/src/app/app/shopping/page.tsx`
- `apps/web/src/lib/db/plans.ts`

## Scope

In scope:
- Use `plan_portions` grams for published week.
- Aggregate ingredients across all meals/people.
- Yield conversion: cooked grams → raw main grams via `yield_factor_cooked_from_raw` for scaling.

Out of scope:
- Store category taxonomy (placeholder only).

## Implementation Notes

- MVP assumes ingredient list scales linearly from main ingredient raw grams.

## Acceptance Criteria

- [x] Shopping list page renders and aggregates ingredient totals.
- [x] Uses published snapshot when available.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

## Commit Instructions

Suggested commit message:

`feat(shopping): add shopping list`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added shopping list computation + page.

### Files Changed

- `apps/web/src/lib/shopping/shopping.ts`
- `apps/web/src/app/app/shopping/page.tsx`
- `apps/web/src/lib/db/plans.ts`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

### Follow-ups

- Add draft mode toggle and grouping toggle polish (TASK-020, TASK-021).
