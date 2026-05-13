# TASK-001: Fix `.docs` task template

## Status

complete

## Phase

Phase 0: Docs & planning foundation

## Wave

Wave 1

## Type

documentation

## Depends On

- (none)

## Requirements

- INFR-01

## Objective

Replace incorrect `.docs/.tasks/TASK-TEMPLATE.md` (pointed to `.planning/*`) with correct Prep Genie task format required by `AGENTS.md`.

## Read First

- `AGENTS.md`
- `.docs/.tasks/TASK-TEMPLATE.md`

## Files Expected to Change

- `.docs/.tasks/TASK-TEMPLATE.md`

## Scope

In scope:
- Update `.docs/.tasks/TASK-TEMPLATE.md` to include required sections (status/phase/wave/type/depends/requirements/read-first/files/acceptance/verify/commit/summary).

Out of scope:
- Creating phase folders or task files (handled by other tasks).

## Implementation Notes

- Template must reference `.docs/*` files, not `.planning/*`.
- Keep status values lowercase as per `AGENTS.md`.

## Acceptance Criteria

- [x] Template references `.docs/*` docs, not `.planning/*`.
- [x] Template includes required “fresh executor” sections (Read First, Acceptance Criteria, Verification, Commit Instructions, Completion Summary).

## Verification

| Command | Result |
|---|---|
| `git diff --check` | Pass |

## Commit Instructions

Suggested commit message:

`docs(planning): fix .docs task template`

## Completion Summary

**Status:** complete  
**Commit:** 812f688  
**Completed At:** 2026-05-13

### What Changed

- Updated `.docs/.tasks/TASK-TEMPLATE.md` to match repo `AGENTS.md` workflow.

### Files Changed

- `.docs/.tasks/TASK-TEMPLATE.md`

### Verification

| Command | Result |
|---|---|
| `git diff --check` | Pass |

### Follow-ups

- None
