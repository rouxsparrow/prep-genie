# TASK-017: Add “Portions” view with live macro calculation (draft)

## Status

complete

## Phase

Phase 4: Portion solver + manual adjust

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-016

## Requirements

- REQ-040
- REQ-041

## Objective

Add a “Portions” view that shows computed cooked grams and macro totals vs targets with tolerance badges for the selected draft week.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `apps/web/src/lib/solver/solver.ts`
- `apps/web/src/app/app/planner/page.tsx`

## Files Expected to Change

- `apps/web/src/app/app/planner/portions/page.tsx`
- `apps/web/src/app/app/planner/page.tsx`

## Scope

In scope:
- Server-render portions using solver (no persistence yet).
- Highlight incomplete recipe selections.
- Show macro achieved vs target with tolerance status.

Out of scope:
- Manual adjustment inputs (TASK-018).

## Implementation Notes

- Week param normalized to Monday.

## Acceptance Criteria

- [x] Portions page renders for week and shows grams for each category.
- [x] Deviations and incomplete selections visibly indicated.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

## Commit Instructions

Suggested commit message:

`feat(planner): add portions view`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added `/app/planner/portions` page using solver to display grams + macro deltas.
- Linked from main planner page.

### Files Changed

- `apps/web/src/app/app/planner/portions/page.tsx`
- `apps/web/src/app/app/planner/page.tsx`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run build` | Pass |

### Follow-ups

- Add manual adjustments and rebalance behavior (TASK-018).
