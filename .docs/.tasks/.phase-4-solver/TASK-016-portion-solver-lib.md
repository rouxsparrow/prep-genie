# TASK-016: Implement portion solver library (v1 heuristic)

## Status

complete

## Phase

Phase 4: Portion solver + manual adjust

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-014

## Requirements

- REQ-040
- REQ-014

## Objective

Implement deterministic portion solver that computes cooked grams per category per meal slot based on daily goals, coverage %, slot ratios, recipe nutrition per 100g cooked, clamps, and rounding to nearest 5g.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `apps/web/src/lib/db/types.ts`

## Files Expected to Change

- `apps/web/src/lib/solver/solver.ts`

## Scope

In scope:
- Coverage fixed at 80%.
- Slot ratios (2 meals: 50/50; 3 meals: 20/40/40).
- Protein grams solves protein target.
- Carb grams solves carbs target.
- Veg grams fills remaining calories.
- Clamp application + clamp flags.
- Rounding to nearest 5g.

Out of scope:
- Persisting manual overrides in DB (handled by publish flow / later tasks).

## Implementation Notes

- Solver returns per-slot target and achieved macros for UI display.
- Treat missing recipes as incomplete and output 0g for that category.

## Acceptance Criteria

- [x] Solver produces non-negative cooked grams.
- [x] Rounds grams to nearest 5g.
- [x] Applies clamps and sets `clamp_applied` flags.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

## Commit Instructions

Suggested commit message:

`feat(solver): add portion solver`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added solver library implementing v1 heuristic + tolerances helpers.

### Files Changed

- `apps/web/src/lib/solver/solver.ts`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

### Follow-ups

- Add unit tests (TASK-022).
