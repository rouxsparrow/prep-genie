# TASK-014: Planner UI (click-to-assign) + incomplete slot flags

## Status

complete

## Phase

Phase 3: Weekly planner (assign recipes)

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-013

## Requirements

- REQ-031
- REQ-032

## Objective

Provide click-to-assign UI for setting Protein/Carb/Veg/Extra recipe refs per Person/day/meal slot, and visibly flag incomplete slots.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `apps/web/src/app/app/planner/page.tsx`

## Files Expected to Change

- `apps/web/src/app/app/planner/page.tsx`

## Scope

In scope:
- Dropdowns per category with “Save” action.
- Slot-level incomplete highlight (missing protein/carb/veg).
- Person-level incomplete count summary.

Out of scope:
- Portion solver view (Phase 4).

## Implementation Notes

- Extra is optional; missing extra does not mark incomplete.

## Acceptance Criteria

- [x] User can assign recipes and persist to `plan_meals`.
- [x] Missing protein/carb/veg is flagged.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

## Commit Instructions

Suggested commit message:

`feat(planner): add assignment UI + incomplete flags`

## Completion Summary

**Status:** complete  
**Commit:** b019604  
**Completed At:** 2026-05-13

### What Changed

- Improved planner assignment UX and added incomplete indicators.

### Files Changed

- `apps/web/src/app/app/planner/page.tsx`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

### Follow-ups

- None
