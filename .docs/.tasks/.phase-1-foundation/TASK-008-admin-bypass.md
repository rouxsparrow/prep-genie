# TASK-008: Add dev-only `admin/admin` bypass + admin route guard

## Status

complete

## Phase

Phase 1: App scaffold + auth

## Wave

Wave 2

## Type

implementation

## Depends On

- TASK-007

## Requirements

- REQ-003

## Objective

Implement MVP admin bypass login (`admin/admin`) gated behind env flag and protected `/admin` routes.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `SETUP.md`
- `apps/web/src/lib/env.ts`

## Files Expected to Change

- `apps/web/src/lib/admin/bypass.ts`
- `apps/web/src/app/admin/*`
- `apps/web/.env.example`

## Scope

In scope:
- `/admin/login` form that sets httpOnly cookie when correct credentials supplied.
- `/admin` route guard that requires cookie + env flag.

Out of scope:
- Actual admin screens (none defined yet).

## Implementation Notes

- `NEXT_PUBLIC_ENABLE_ADMIN_BYPASS` defaults to `false`.
- Cookie is MVP-only and not cryptographically signed; do not treat as secure auth.

## Acceptance Criteria

- [x] When env flag disabled, `/admin/*` redirects to `/app`.
- [x] When enabled, `/admin` requires successful `/admin/login`.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

## Commit Instructions

Suggested commit message:

`feat(admin): add dev-only admin bypass`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added `/admin/login` and `/admin` guarded by env flag + httpOnly cookie.

### Files Changed

- `apps/web/src/lib/admin/bypass.ts`
- `apps/web/src/app/admin/*`

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

### Follow-ups

- Add real admin screens only if requirements added.
