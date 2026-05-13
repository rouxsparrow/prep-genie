# TASK-021: Shopping list grouping toggle (ingredient vs store category)

## Status

complete

## Phase

Phase 5: Shopping list

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-020

## Requirements

- REQ-062

## Objective

Add grouping toggle for shopping list: by ingredient name or by store category. MVP store category uses simple heuristic inference (explicit taxonomy deferred).

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `apps/web/src/app/app/shopping/page.tsx`
- `apps/web/src/lib/shopping/shopping.ts`

## Files Expected to Change

- `apps/web/src/lib/shopping/shopping.ts`
- `apps/web/src/app/app/shopping/page.tsx`

## Scope

In scope:
- “Group” selector already present; implement store-category grouping.
- Add `store_category` to shopping lines via heuristic inference.

Out of scope:
- User-editable store categories (future).

## Acceptance Criteria

- [x] Group toggle changes rendering to grouped sections.
- [x] Store category grouping works without schema changes.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

## Commit Instructions

Suggested commit message:

`feat(shopping): add grouping toggle`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Implemented store-category grouping and heuristic categorization.

### Files Changed

- `apps/web/src/lib/shopping/shopping.ts`
- `apps/web/src/app/app/shopping/page.tsx`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

### Follow-ups

- Replace heuristic with user-defined taxonomy later.
