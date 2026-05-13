# TASK-020: Draft shopping list mode + published toggle

## Status

complete

## Phase

Phase 5: Shopping list

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-019

## Requirements

- REQ-061

## Objective

Support shopping list generation from either draft (computed on fly) or published snapshot, with clear UI messaging when published snapshot unavailable.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `apps/web/src/app/app/shopping/page.tsx`

## Files Expected to Change

- `apps/web/src/app/app/shopping/page.tsx`

## Scope

In scope:
- Source selector (draft vs published).
- If published requested but plan not published, show warning and fallback to draft compute.
- Draft mode disclaimer: “may change”.

Out of scope:
- Persisting draft shopping list snapshot.

## Acceptance Criteria

- [x] User can toggle between draft and published sources.
- [x] If no snapshot exists, UI falls back to draft with warning.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

## Commit Instructions

Suggested commit message:

`feat(shopping): add draft/published toggle UX`

## Completion Summary

**Status:** complete  
**Commit:** 5a4807e  
**Completed At:** 2026-05-13

### What Changed

- Added UX messaging and fallback behavior for shopping list source toggles.

### Files Changed

- `apps/web/src/app/app/shopping/page.tsx`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

### Follow-ups

- None
