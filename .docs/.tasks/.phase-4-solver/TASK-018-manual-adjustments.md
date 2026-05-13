# TASK-018: Manual adjustments + rebalance (carb + veg) with clamps

## Status

complete

## Phase

Phase 4: Portion solver + manual adjust

## Wave

Wave 2

## Type

implementation

## Depends On

- TASK-015

## Requirements

- REQ-042

## Objective

Allow user to manually adjust cooked grams for protein/carb/veg per slot in Portions view, re-run solver with rebalance behavior, respect clamps, and persist overrides into published snapshot.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `apps/web/src/lib/solver/solver.ts`
- `apps/web/src/app/app/planner/portions/page.tsx`

## Files Expected to Change

- `apps/web/src/app/app/planner/portions/portions-client.tsx`
- `apps/web/src/app/app/planner/portions/page.tsx`
- `apps/web/src/lib/solver/solver.ts`

## Scope

In scope:
- Editable grams inputs (protein/carb/veg) in draft Portions view.
- Live recalculation (client-side) using solver with `manualOverrides`.
- Publish uses same overrides when writing `plan_portions`.
- Clamp-applied indicators.

Out of scope:
- Persisting draft overrides in DB before publish (MVP stores overrides in UI state only).

## Implementation Notes

- “Auto” button clears manual override for category.
- Rebalance rule: keep manual protein/carb as fixed; veg fills remaining calories.

## Acceptance Criteria

- [x] User can edit grams; totals update immediately.
- [x] Clamp applied highlights and continues to produce non-negative grams.
- [x] Publishing uses override grams and marks `plan_portions.is_manual=true` for overridden categories.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

## Commit Instructions

Suggested commit message:

`feat(solver): add manual overrides in portions view`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added client-side overrides UI and sent overrides into publish snapshot.

### Files Changed

- `apps/web/src/app/app/planner/portions/portions-client.tsx`
- `apps/web/src/app/app/planner/portions/page.tsx`
- `apps/web/src/lib/solver/solver.ts`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

### Follow-ups

- Add automated tests for manual override cases (TASK-022).
