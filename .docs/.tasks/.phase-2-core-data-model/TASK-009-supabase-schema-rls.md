# TASK-009: Add Supabase schema SQL + RLS policies

## Status

complete

## Phase

Phase 2: DB schema + People + Recipes

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-008

## Requirements

- INFR-07
- REQ-010
- REQ-020
- REQ-030
- REQ-050

## Objective

Create `supabase/schema.sql` implementing MVP tables (`people`, `recipes`, `weekly_plans`, `plan_meals`, `plan_portions`) with RLS enforcing `account_id = auth.uid()`.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `SETUP.md`

## Files Expected to Change

- `supabase/schema.sql`
- `SETUP.md`

## Scope

In scope:
- SQL table definitions + constraints + indexes.
- Enable RLS for all tables + CRUD policies scoped by `auth.uid()`.
- Update `SETUP.md` to point to real schema path (remove “placeholder” note).

Out of scope:
- Triggers for `updated_at` auto-update (may add later if needed).

## Implementation Notes

- Hosted Supabase SQL Editor friendly (single file).
- Uses `pgcrypto` for `gen_random_uuid()`.

## Acceptance Criteria

- [x] `supabase/schema.sql` creates all required MVP tables.
- [x] RLS enabled for all tables with ownership policies.
- [x] `SETUP.md` no longer references schema path as placeholder.

## Verification

| Command | Result |
|---|---|
| `rg -n \"enable row level security\" supabase/schema.sql` | Pass |
| `rg -n \"create table\" supabase/schema.sql` | Pass |

## Commit Instructions

Suggested commit message:

`feat(db): add MVP schema + RLS`

## Completion Summary

**Status:** complete  
**Commit:** (fill after)  
**Completed At:** 2026-05-13

### What Changed

- Added `supabase/schema.sql` with MVP tables + RLS policies.
- Updated `SETUP.md` schema path note.

### Files Changed

- `supabase/schema.sql`
- `SETUP.md`

### Verification

| Command | Result |
|---|---|
| `rg -n \"enable row level security\" supabase/schema.sql` | Pass |
| `rg -n \"create table\" supabase/schema.sql` | Pass |

### Follow-ups

- Consider adding `updated_at` triggers if UI relies on server timestamps.
