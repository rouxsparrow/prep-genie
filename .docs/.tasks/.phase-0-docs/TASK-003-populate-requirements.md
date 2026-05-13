# TASK-003: Populate `.docs/REQUIREMENTS.md` with MVP requirements + traceability

## Status

complete

## Phase

Phase 0: Docs & planning foundation

## Wave

Wave 1

## Type

documentation

## Depends On

- TASK-002

## Requirements

- INFR-03

## Objective

Define stable requirement IDs for Prep Genie v0.1 MVP and map them to planned phases/tasks for traceability.

## Read First

- `AGENTS.md`
- `.docs/PROJECT.md`
- `.docs/REQUIREMENTS.md`
- `.docs/STATE.md`

## Files Expected to Change

- `.docs/REQUIREMENTS.md`

## Scope

In scope:
- Replace placeholders with real MVP requirements + future + out-of-scope.
- Add initial Traceability table mapping requirements to TASK IDs from MVP plan.

Out of scope:
- Marking tasks complete (handled by executors during implementation).

## Implementation Notes

- Keep requirement wording user-outcome focused.
- Keep IDs stable (`REQ-###`).
- If future plan changes, update traceability rows, not IDs.

## Acceptance Criteria

- [x] `.docs/REQUIREMENTS.md` contains Prep Genie MVP requirements with stable IDs.
- [x] Traceability table maps major MVP requirements to phases/tasks.

## Verification

| Command | Result |
|---|---|
| `git diff --check` | Pass |

## Commit Instructions

Suggested commit message:

`docs(requirements): define MVP requirements + traceability`

## Completion Summary

**Status:** complete  
**Commit:** d4fe95c  
**Completed At:** 2026-05-13

### What Changed

- Defined MVP requirements, future requirements, out-of-scope, and traceability mapping.

### Files Changed

- `.docs/REQUIREMENTS.md`

### Verification

| Command | Result |
|---|---|
| `git diff --check` | Pass |

### Follow-ups

- As tasks complete, update requirement checkboxes + traceability status.
