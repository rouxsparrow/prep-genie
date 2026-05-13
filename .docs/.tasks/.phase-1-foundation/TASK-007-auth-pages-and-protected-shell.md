# TASK-007: Implement auth pages + protected app shell

## Status

complete

## Phase

Phase 1: App scaffold + auth

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-006

## Requirements

- REQ-001

## Objective

Add sign-in/sign-up pages using Supabase Auth and create authenticated `/app` shell that redirects unauthenticated users to `/sign-in`.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `apps/web/src/lib/supabase/*`
- `apps/web/SETUP.md` (repo root `SETUP.md`)

## Files Expected to Change

- `apps/web/middleware.ts`
- `apps/web/src/app/(auth)/*`
- `apps/web/src/app/app/*`
- `apps/web/src/lib/auth/*`

## Scope

In scope:
- Sign-in and sign-up forms (client) calling Supabase Auth.
- Protected `/app` route group with nav and basic dashboard.
- Middleware to refresh Supabase session cookies.

Out of scope:
- People/recipes/planner pages content (later tasks).
- Admin bypass (TASK-008).

## Implementation Notes

- Use server-side `requireUser()` in `/app` layout to enforce auth.
- Home `/` redirects to `/app` if signed in else `/sign-in`.

## Acceptance Criteria

- [x] Unauthenticated user visiting `/app` redirects to `/sign-in`.
- [x] After sign-in, user lands on `/app`.
- [x] Sign-out clears session and returns to `/sign-in`.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

## Commit Instructions

Suggested commit message:

`feat(auth): add sign-in/up + protected shell`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added auth routes, `requireUser()` helper, `/app` shell + nav, and session-refresh middleware.

### Files Changed

- `apps/web/middleware.ts`
- `apps/web/src/app/(auth)/*`
- `apps/web/src/app/app/*`
- `apps/web/src/lib/auth/*`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

### Follow-ups

- Add admin bypass + route guard (TASK-008).
