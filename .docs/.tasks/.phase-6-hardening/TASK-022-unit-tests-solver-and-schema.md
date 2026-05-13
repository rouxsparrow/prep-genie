# TASK-022: Add unit tests for solver + recipe JSON schema

## Status

complete

## Phase

Phase 6: Hardening / QA / Polish

## Wave

Wave 1

## Type

test

## Depends On

- TASK-018

## Requirements

- REQ-040
- REQ-021

## Objective

Add unit tests covering portion solver rounding/clamps/manual overrides and recipe JSON schema strict validation.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `apps/web/src/lib/solver/solver.ts`
- `apps/web/src/lib/recipes/schema.ts`

## Files Expected to Change

- `apps/web/vitest.config.ts`
- `apps/web/src/lib/solver/solver.test.ts`
- `apps/web/src/lib/recipes/schema.test.ts`

## Scope

In scope:
- Configure Vitest for Node env + `@` alias.
- Add tests for solver invariants and schema strictness.

Out of scope:
- Full e2e tests (can add later).

## Acceptance Criteria

- [x] `npm run test` passes.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run test` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run typecheck` | Pass |

## Commit Instructions

Suggested commit message:

`test(core): add solver + schema unit tests`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added Vitest config and unit tests for solver + recipe schema.

### Files Changed

- `apps/web/vitest.config.ts`
- `apps/web/src/lib/solver/solver.test.ts`
- `apps/web/src/lib/recipes/schema.test.ts`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run test` | Pass |
| `cd apps/web && npm run lint` | Pass |
| `cd apps/web && npm run typecheck` | Pass |

### Follow-ups

- Optional: add smoke/e2e path later.
