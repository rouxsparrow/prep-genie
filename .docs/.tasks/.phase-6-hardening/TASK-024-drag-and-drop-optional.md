# TASK-024: Drag & drop planner interaction (optional)

## Status

deferred

## Phase

Phase 6: Hardening / QA / Polish

## Wave

Wave 1

## Type

implementation

## Depends On

- TASK-014

## Requirements

- REQ-100

## Objective

Add desktop drag & drop interactions for planner assignment without changing data model.

## Read First

- `AGENTS.md`
- `.docs/REQUIREMENTS.md`
- `apps/web/src/app/app/planner/page.tsx`

## Files Expected to Change

- `apps/web/src/app/app/planner/page.tsx`
- `apps/web/package.json` (dnd-kit deps)

## Scope

In scope:
- DnD between slots/days for same person.

Out of scope:
- Re-architect planner layout.

## Implementation Notes

- Use `@dnd-kit/*` if implemented.

## Acceptance Criteria

- [ ] User can drag recipe assignment from one slot to another and persist.

## Verification

| Command | Result |
|---|---|
| `cd apps/web && npm run lint` | (after) |

## Commit Instructions

Suggested commit message:

`feat(planner): add drag and drop`

## Completion Summary

**Status:** deferred  
**Commit:** (n/a)  
**Completed At:** (n/a)

### Blocker / Reason

- MVP already provides click-to-assign. DnD adds significant UI complexity; deferred until core workflow validated.

