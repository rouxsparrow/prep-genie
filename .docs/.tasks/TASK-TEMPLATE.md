# Task Template (Prep Genie)

Use this template for every task file under `.docs/.tasks/.phase-*/`.

Rules:
- Task small, executable, one atomic commit
- Task self-contained for fresh executor
- Task link to requirement IDs in `.docs/REQUIREMENTS.md`

---

# TASK-XXX: [Task Name]

## Status

planned

## Phase

Phase N: [Name]

## Wave

Wave N

## Type

planning | implementation | verification | documentation | refactor | bugfix

## Depends On

- (none)

## Requirements

- REQ-XXX
- INFR-XX (if infra-only)

## Objective

What outcome task must deliver (1-3 sentences).

## Read First

- `AGENTS.md`
- `.docs/PROJECT.md`
- `.docs/REQUIREMENTS.md`
- `.docs/STATE.md`
- `path/to/relevant-file`

## Files Expected to Change

- `path/to/file`

## Scope

In scope:
- 
- 

Out of scope:
- 
- 

## Implementation Notes

- Key rules/edge cases.
- Interfaces/types/schema to follow.
- Known pitfalls.

## Acceptance Criteria

- [ ] 
- [ ] 
- [ ] 

## Verification

| Command | Result |
|---|---|
| `npm run lint` | (fill after) |
| `npm run typecheck` | (fill after) |

## Commit Instructions

Suggested commit message:

`type(scope): short description`

## Completion Summary

**Status:** planned | in_progress | blocked | complete | skipped | deferred  
**Commit:** (fill after)  
**Completed At:** YYYY-MM-DD

### What Changed

- (fill after)

### Files Changed

- (fill after)

### Verification

| Command | Result |
|---|---|
| `npm run lint` |  |
| `npm run typecheck` |  |

### Follow-ups

- None
