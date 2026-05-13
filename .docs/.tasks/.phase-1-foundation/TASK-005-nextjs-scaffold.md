# TASK-005: Create Next.js app scaffold in `apps/web`

## Status

complete

## Phase

Phase 1: App scaffold + auth

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-004

## Requirements

- INFR-05

## Objective

Create runnable Next.js (App Router) web app under `apps/web` with TypeScript, Tailwind, ESLint, and baseline scripts (`dev`, `build`, `lint`, `typecheck`, `test`).

## Read First

- `AGENTS.md`
- `.docs/PROJECT.md`
- `.docs/REQUIREMENTS.md`
- `.docs/STATE.md`
- `SETUP.md`

## Files Expected to Change

- `apps/web/*`
- `SETUP.md` (only if needed for install/run instructions; prefer later task)

## Scope

In scope:
- Generate Next.js app skeleton in `apps/web`.
- Ensure `apps/web/package.json` includes required scripts.

Out of scope:
- Supabase integration (TASK-006)
- Auth pages/route guards (TASK-007)

## Implementation Notes

- Keep `apps/web` install/run path aligned with `SETUP.md`.
- Use npm (per `SETUP.md`).

## Acceptance Criteria

- [x] `cd apps/web && npm run dev` starts Next.js app.
- [x] Scripts exist: `lint`, `typecheck`, `test`.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

## Commit Instructions

Suggested commit message:

`feat(web): scaffold Next.js app`

## Completion Summary

**Status:** complete  
**Commit:** ed6809d  
**Completed At:** 2026-05-13

### What Changed

- Added Next.js App Router app scaffold under `apps/web`.
- Added `typecheck` and `test` scripts.

### Files Changed

- `apps/web/*`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

### Follow-ups

- None
