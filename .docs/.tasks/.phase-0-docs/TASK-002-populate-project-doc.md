# TASK-002: Populate `.docs/PROJECT.md` for Prep Genie

## Status

complete

## Phase

Phase 0: Docs & planning foundation

## Wave

Wave 1

## Type

documentation

## Depends On

- TASK-001

## Requirements

- INFR-02

## Objective

Replace template content in `.docs/PROJECT.md` with Prep Genie product overview, MVP milestone, stack, constraints, and linked docs so future executors have correct source of truth.

## Read First

- `AGENTS.md`
- `.docs/PROJECT.md`
- `.docs/REQUIREMENTS.md`
- `.docs/STATE.md`

## Files Expected to Change

- `.docs/PROJECT.md`

## Scope

In scope:
- Fill in Prep Genie description, core value, MVP target features.
- Record tech stack + key constraints/rules to avoid accidental scope drift.
- Fix linked docs paths to `.docs/*`.

Out of scope:
- Detailed requirements list (handled by TASK-003).

## Implementation Notes

- Keep constraints aligned to locked decisions: 80% coverage, slot ratios, rounding, draft vs publish, RLS, dev-only admin bypass.

## Acceptance Criteria

- [x] `.docs/PROJECT.md` no longer contains placeholders unrelated to Prep Genie.
- [x] Tech stack + constraints sections match agreed MVP direction.
- [x] Linked docs point to `.docs/*` files and `SETUP.md`.

## Verification

| Command | Result |
|---|---|
| `git diff --check` | Pass |

## Commit Instructions

Suggested commit message:

`docs(project): define Prep Genie MVP`

## Completion Summary

**Status:** complete  
**Commit:** 54344b7  
**Completed At:** 2026-05-13

### What Changed

- Documented Prep Genie product/MVP overview, stack, and constraints.

### Files Changed

- `.docs/PROJECT.md`

### Verification

| Command | Result |
|---|---|
| `git diff --check` | Pass |

### Follow-ups

- None
