# TASK-023: UX polish (empty states + print)

## Status

complete

## Phase

Phase 6: Hardening / QA / Polish

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-021

## Requirements

- INFR-08

## Objective

Improve MVP usability with clearer empty states and add print/export capability for shopping list.

## Read First

- `AGENTS.md`
- `.docs/STATE.md`
- `apps/web/src/app/app/planner/page.tsx`
- `apps/web/src/app/app/shopping/page.tsx`

## Files Expected to Change

- `apps/web/src/app/app/planner/page.tsx`
- `apps/web/src/app/app/shopping/page.tsx`
- `apps/web/src/components/print-button.tsx`

## Scope

In scope:
- Empty state warnings when no recipes exist in planner.
- Print button for shopping list (`window.print()`).

Out of scope:
- Drag & drop planner interactions (TASK-024 optional).

## Acceptance Criteria

- [x] Planner clearly prompts user to add recipes when none exist.
- [x] Shopping list has print button when non-empty.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run build` | Pass |

## Commit Instructions

Suggested commit message:

`feat(ux): add empty states + print`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added print button component for shopping list.
- Improved planner empty states when recipes missing.

### Files Changed

- `apps/web/src/components/print-button.tsx`
- `apps/web/src/app/app/shopping/page.tsx`
- `apps/web/src/app/app/planner/page.tsx`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run build` | Pass |

### Follow-ups

- None
