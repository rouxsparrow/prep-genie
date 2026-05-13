# TASK-006: Add Supabase env validation + client helpers

## Status

complete

## Phase

Phase 1: App scaffold + auth

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-005

## Requirements

- INFR-06
- REQ-001

## Objective

Add shared Supabase client helpers for browser/server usage and validate required public env vars so app fails fast with clear error when env missing.

## Read First

- `AGENTS.md`
- `.docs/PROJECT.md`
- `.docs/REQUIREMENTS.md`
- `.docs/STATE.md`
- `SETUP.md`
- `apps/web/package.json`

## Files Expected to Change

- `apps/web/package.json`
- `apps/web/src/lib/env.ts`
- `apps/web/src/lib/supabase/*`
- `apps/web/.env.example`

## Scope

In scope:
- Add `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` validation (zod).
- Add browser + server Supabase client factory helpers.
- Add `.env.example` to document required env vars.

Out of scope:
- Auth routing/guards and UI (TASK-007).

## Implementation Notes

- Use `@supabase/ssr` helpers for App Router cookie integration.
- Keep admin bypass env var default `false`.

## Acceptance Criteria

- [x] Missing required env vars throws clear error at runtime.
- [x] Browser and server Supabase clients can be created from helpers.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

## Commit Instructions

Suggested commit message:

`feat(supabase): add env + client helpers`

## Completion Summary

**Status:** in_progress  
**Commit:** 60e0f38  
**Completed At:** 2026-05-13

### What Changed

- (fill after)

### Files Changed

- (fill after)

### Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run typecheck` | Pass |
| `cd apps/web && npm run lint` | Pass |

### Follow-ups

- None
