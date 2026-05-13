# AGENTS.md

## Purpose

This repo uses a Markdown-based planning system for Codex agent execution.

The agent must plan and execute MVP work using the documentation structure inside `.docs/`.

The goal is to turn product requirements into well-scoped implementation tasks, grouped by phases and parallel waves, with enough context for each fresh executor to work safely without needing hidden chat history.

---

## Documentation Structure

The canonical documentation folder is:

    .docs/
      PROJECT.md
      REQUIREMENTS.md
      STATE.md
      .tasks/
        TASK-TEMPLATE.md
        .phase-1/
          TASK-001.md
          TASK-002.md
        .phase-2/
          TASK-003.md
          TASK-004.md

Use these files as the source of truth:

| File | Purpose |
|---|---|
| `.docs/PROJECT.md` | Product overview, core value, tech stack, constraints, key decisions |
| `.docs/REQUIREMENTS.md` | MVP/current requirements, future requirements, out-of-scope items, traceability |
| `.docs/STATE.md` | Current project state, current focus, progress, blockers, resume notes |
| `.docs/.tasks/TASK-TEMPLATE.md` | Required task format for implementation tasks |
| `.docs/.tasks/.phase-X/` | Phase-specific task folders |

Do not create a separate planning system unless explicitly requested.

Do not move or rename `.docs`, `.docs/.tasks`, or the core docs unless explicitly requested.

---

## Required Agent Workflow

Before planning or coding, inspect:

    .docs/PROJECT.md
    .docs/REQUIREMENTS.md
    .docs/STATE.md
    .docs/.tasks/TASK-TEMPLATE.md

Then classify the request as one of:

1. Planning only
2. Task generation
3. Implementation
4. Audit / verification
5. Documentation update

Use the lightest safe workflow.

Do not over-plan tiny changes.

Do not skip planning for MVP-building work.

---

## MVP Planning Workflow

When asked to create a plan to build the MVP, the agent must:

1. Read `.docs/PROJECT.md`
2. Read `.docs/REQUIREMENTS.md`
3. Read `.docs/STATE.md`
4. Read `.docs/.tasks/TASK-TEMPLATE.md`
5. Identify MVP scope
6. Separate requirements into implementation phases
7. Create one folder per phase under `.docs/.tasks/`
8. Create small executable task files inside each phase folder
9. Assign tasks to safe parallel waves
10. Ensure each task can be completed by a fresh executor with a 200k-token context
11. Ensure each task maps to one atomic commit
12. Update `.docs/STATE.md` with planning status
13. Update requirement traceability in `.docs/REQUIREMENTS.md` if needed

The plan must be implementation-oriented, not abstract strategy fluff.

---

## Phase Folder Rules

Each phase must have its own folder under `.docs/.tasks/`.

Use this naming pattern:

    .docs/.tasks/.phase-N/

Examples:

    .docs/.tasks/.phase-1/
    .docs/.tasks/.phase-2/
    .docs/.tasks/.phase-3/

Optional descriptive names are allowed if used consistently:

    .docs/.tasks/.phase-1-foundation/
    .docs/.tasks/.phase-2-core-workflow/
    .docs/.tasks/.phase-3-analytics/

Each phase folder should contain small task files:

    TASK-001.md
    TASK-002.md
    TASK-003.md

Task filenames may include a short slug:

    TASK-001-project-setup.md
    TASK-002-auth-shell.md
    TASK-003-database-schema.md

Keep filenames stable after creation.

---

## Phase Planning Rules

Each phase must represent a meaningful delivery slice.

Good phases:

- Foundation / setup
- Auth / access control
- Core data model
- Main user workflow
- Admin management
- Analytics / reporting
- Hardening / QA / polish

Bad phases:

- Random files grouped together
- One giant “build everything” phase
- One task per requirement with no execution order
- A phase that cannot be tested or committed meaningfully

Each phase may include a short phase overview:

    # Phase N: [Name]

    ## Goal

    ## Requirements Covered

    ## Parallel Waves

    ## Dependencies

    ## Verification Focus

---

## Parallel Wave Rules

Phases can run in parallel waves when dependencies allow.

A wave is a group of tasks that can be executed independently.

Example:

    ## Parallel Waves

    ### Wave 1

    Can run immediately:

    - TASK-001: Project setup
    - TASK-002: UI shell
    - TASK-003: Database schema draft

    ### Wave 2

    Can run after Wave 1:

    - TASK-004: Auth integration
    - TASK-005: CRUD screens

    ### Wave 3

    Can run after Wave 2:

    - TASK-006: End-to-end workflow
    - TASK-007: Verification and polish

Rules:

- Tasks in the same wave must not modify the same files unless explicitly justified.
- Tasks in the same wave must not depend on each other’s uncommitted changes.
- If two tasks may conflict, place them in different waves.
- Shared foundation work must happen in an earlier wave.
- Integration work must happen after parallel implementation tasks.
- Each task must clearly state its dependencies.
- Each task must clearly state its wave number.

Do not pretend tasks are parallel just because parallelism sounds productive. That is how merge conflicts become a lifestyle choice.

---

## Task Generation Rules

Every implementation task must be created using:

    .docs/.tasks/TASK-TEMPLATE.md

The agent must inspect the template before creating tasks.

Do not invent a new task format when the template exists.

Each task must be:

- Small
- Executable
- Independently understandable
- Assigned to one phase
- Assigned to one wave
- Linked to requirement IDs
- Clear about files likely to change
- Clear about files to read first
- Clear about acceptance criteria
- Clear about verification commands
- Suitable for one atomic commit

A task is too large if:

- It touches too many unrelated areas
- It mixes schema, UI, API, and polish without need
- It cannot be described in one clear objective
- It requires multiple unrelated commits
- It would be risky for a fresh executor to complete in one pass

Split oversized tasks.

---

## Task File Requirements

If `.docs/.tasks/TASK-TEMPLATE.md` defines a structure, follow it exactly.

The template wins over this fallback structure.

If the template is incomplete, each task file must include at minimum:

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

    - TASK-XXX

    ## Requirements

    - REQ-XXX

    ## Objective

    ## Read First

    - `.docs/PROJECT.md`
    - `.docs/REQUIREMENTS.md`
    - `.docs/STATE.md`
    - `path/to/relevant-file`

    ## Files Expected to Change

    - `path/to/file`

    ## Scope

    ## Out of Scope

    ## Implementation Notes

    ## Acceptance Criteria

    - [ ]

    ## Verification

    - `npm run lint`
    - `npm run typecheck`

    ## Commit Instructions

    Suggested commit message:

    feat(scope): short description

    ## Completion Summary

    To be filled after execution.

---

## Fresh Executor Context Rule

Each task executor starts with a fresh 200k-token context.

Every task file must include enough information for the executor to work without relying on hidden prior chat context.

Each task must explicitly include:

- Relevant requirement IDs
- Phase name
- Wave number
- Dependencies
- Required docs to read first
- Relevant source files to inspect
- Expected behavior
- Acceptance criteria
- Verification commands
- Commit expectation
- Summary/update expectation if applicable

Do not write tasks that say “continue previous work” without linking the exact files and expected state.

The executor is fresh, not psychic.

---

## Atomic Commit Rule

Each task must result in one atomic commit.

The commit should contain only the changes required for that task.

Do not mix unrelated work into the same commit.

Do not sneak in refactors, formatting sweeps, dependency upgrades, or opportunistic rewrites.

Each task file must include a suggested commit message:

    type(scope): short description

Examples:

    feat(auth): add email password login shell
    feat(import): add statement upload flow
    fix(rules): prevent invalid regex save
    docs(planning): add MVP phase task breakdown

After completing a task, the executor must report:

- Commit hash
- Files changed
- Verification commands run
- Verification result
- Any follow-up tasks or blockers

Do not claim an atomic commit exists unless the commit was actually created.

---

## Requirement Traceability Rules

Every task must map back to one or more requirement IDs from:

    .docs/REQUIREMENTS.md

If a requirement is too large, split it across multiple tasks and note that clearly.

If a task supports infrastructure or setup and has no direct user-facing requirement, use an internal requirement ID such as:

    INFR-XX

Do not create orphan tasks without requirement linkage unless explicitly justified.

When planning is complete, update the traceability section in `.docs/REQUIREMENTS.md` if it exists.

Traceability should show:

| Requirement | Phase | Task | Status |
|---|---|---|---|
| REQ-001 | Phase 1 | TASK-001 | Planned |

---

## State Update Rules

Update `.docs/STATE.md` after:

- MVP planning is created
- A phase starts
- A phase completes
- A task completes
- A blocker is discovered
- A meaningful pause happens

`.docs/STATE.md` should remain concise.

It should answer:

1. Where are we now?
2. What was completed?
3. What is next?
4. What is blocked?
5. Which files should the next executor read first?

Do not dump full task history into `STATE.md`.

Use task files, task summaries, and commits for detailed history.

---

## Planning Output Rules

When generating MVP planning, the agent must create or update:

    .docs/STATE.md
    .docs/REQUIREMENTS.md
    .docs/.tasks/.phase-N/
    .docs/.tasks/.phase-N/TASK-XXX.md

The agent may update:

    .docs/PROJECT.md

Only update `.docs/PROJECT.md` when the product overview, core value, constraints, milestone, or key decisions change.

Do not update `.docs/PROJECT.md` for small task-level details.

---

## Implementation Rules

Before implementation, the executor must:

1. Read the assigned task file
2. Read `.docs/PROJECT.md`
3. Read `.docs/REQUIREMENTS.md`
4. Read `.docs/STATE.md`
5. Read all files listed under `Read First`
6. Confirm dependencies are complete
7. Implement only the task scope
8. Run verification commands
9. Create one atomic commit
10. Update task completion summary
11. Update `.docs/STATE.md`
12. Report commit hash, files changed, and verification results

The executor must not:

- Implement future requirements
- Change unrelated files
- Refactor unrelated code
- Rename requirement IDs
- Modify phase structure without reason
- Skip verification silently
- Claim tests passed if they were not run
- Create multiple commits for one task unless the task explicitly allows it

---

## Verification Rules

Each task must define its own verification commands.

Preferred verification examples:

    npm run lint
    npm run typecheck
    npm run build
    npm test
    npx tsc --noEmit

Use the actual project scripts.

Do not invent commands that do not exist.

If a command fails because the project lacks that script, report it clearly and use an appropriate available command.

If verification cannot be completed, the executor must state:

- What was attempted
- Why it failed
- Whether the implementation is still safe
- What follow-up is needed

No “looks good” based on vibes. Vibes are not CI.

---

## Documentation Update Rules

Update docs only when the task changes reusable project knowledge.

Update `.docs/PROJECT.md` for:

- Product direction changes
- Core value changes
- Tech stack changes
- Constraints
- Major decisions

Update `.docs/REQUIREMENTS.md` for:

- Requirement status changes
- New requirements
- Deferred requirements
- Traceability changes

Update `.docs/STATE.md` for:

- Current progress
- Resume context
- Blockers
- Last completed task
- Next task

Update task files for:

- Status
- Completion notes
- Commit hash
- Verification result
- Known follow-up

Do not document tiny implementation details unless they affect future work.

---

## Status Values

Use consistent lowercase status values:

    planned
    in_progress
    blocked
    complete
    skipped
    deferred

Use the same lowercase format across task files and `.docs/STATE.md`.

---

## Task Status Lifecycle

Each task should move through:

    planned -> in_progress -> complete

Or:

    planned -> blocked
    planned -> deferred
    planned -> skipped

When blocking a task, include:

- Blocker
- Impact
- Required decision or dependency
- Suggested next step

---

## Parallel Execution Safety

For parallel task waves:

- Avoid overlapping file ownership.
- Put shared foundation work in earlier waves.
- Put integration work after parallel implementation tasks.
- Use atomic commits to reduce merge complexity.
- Rebase or merge latest main before starting a task if needed.
- Re-run verification after resolving conflicts.

If two tasks need the same file, the phase planner should either:

1. Put them in separate waves, or
2. Split out the shared change into an earlier foundation task.

Do not create parallel tasks that fight over the same component.

---

## Commit Message Rules

Use conventional commit style where possible:

    feat(scope): description
    fix(scope): description
    docs(scope): description
    refactor(scope): description
    test(scope): description
    chore(scope): description

Examples:

    docs(planning): add MVP task breakdown
    feat(auth): implement login page
    feat(import): parse statement transactions
    fix(categories): exclude card payments from dashboard stats

Each task must include its expected commit message.

---

## Summary Rules

After each task completes, create or update a completion summary in the task file.

Minimum summary:

    ## Completion Summary

    **Status:** complete
    **Commit:** abc1234
    **Completed At:** YYYY-MM-DD

    ### What Changed

    -

    ### Files Changed

    -

    ### Verification

    | Command | Result |
    |---|---|
    | `npm run lint` | Pass |

    ### Follow-ups

    - None

If the task template defines a different summary format, use the template.

---

## Agent Planning Checklist

When asked to plan the MVP, complete this checklist:

- [ ] Read `.docs/PROJECT.md`
- [ ] Read `.docs/REQUIREMENTS.md`
- [ ] Read `.docs/STATE.md`
- [ ] Read `.docs/.tasks/TASK-TEMPLATE.md`
- [ ] Identify MVP requirements
- [ ] Group requirements into phases
- [ ] Assign phase dependencies
- [ ] Assign parallel waves
- [ ] Create phase folders
- [ ] Create task files from the template
- [ ] Ensure every task has requirement traceability
- [ ] Ensure every task has read-first context
- [ ] Ensure every task has acceptance criteria
- [ ] Ensure every task has verification commands
- [ ] Ensure every task maps to one atomic commit
- [ ] Update `.docs/STATE.md`
- [ ] Update `.docs/REQUIREMENTS.md` traceability if needed

---

## Agent Execution Checklist

When executing a task, complete this checklist:

- [ ] Read assigned task file
- [ ] Read `.docs/PROJECT.md`
- [ ] Read `.docs/REQUIREMENTS.md`
- [ ] Read `.docs/STATE.md`
- [ ] Read all `Read First` files
- [ ] Confirm dependencies are complete
- [ ] Implement only the scoped change
- [ ] Run verification commands
- [ ] Fix issues caused by the task
- [ ] Create one atomic commit
- [ ] Update task completion summary
- [ ] Update `.docs/STATE.md`
- [ ] Report commit hash, files changed, and verification results

---

## Non-Negotiables

- Use `.docs` as the planning root.
- Use `.docs/.tasks/TASK-TEMPLATE.md` for all task files.
- Divide MVP requirements into phases.
- Put each phase in its own folder.
- Break phases into small executable tasks.
- Assign tasks to parallel waves where safe.
- Each executor gets fresh context, so each task must be self-contained.
- Each task maps to one atomic commit.
- Do not skip verification.
- Do not claim success without evidence.
- Do not expand scope without updating requirements.
- Do not create unnecessary docs.
- Prefer updating existing docs over scattering new files.

---

## Suggested MVP Planning Behavior

When the user says something like:

    Create MVP planning
    Plan the MVP
    Generate tasks from requirements
    Break this into phases

The agent should:

1. Inspect the `.docs` files.
2. Generate a phase plan.
3. Create phase folders under `.docs/.tasks/`.
4. Create task files using `.docs/.tasks/TASK-TEMPLATE.md`.
5. Update `.docs/STATE.md`.
6. Update `.docs/REQUIREMENTS.md` traceability.
7. Report what was created and what the first executable task is.

Do not ask for confirmation unless a blocking ambiguity would cause the wrong MVP to be planned.

---

## Recommended Phase Structure

Use this only as a default. Adjust based on `.docs/REQUIREMENTS.md`.

    Phase 1: Foundation
    Phase 2: Core Data Model
    Phase 3: Primary User Workflow
    Phase 4: Management / Admin UX
    Phase 5: Analytics / Reporting
    Phase 6: Hardening / QA / Polish

Example:

    .docs/.tasks/.phase-1-foundation/
      TASK-001-project-setup.md
      TASK-002-layout-and-navigation.md
      TASK-003-auth-foundation.md

    .docs/.tasks/.phase-2-core-data-model/
      TASK-004-database-schema.md
      TASK-005-seed-data.md
      TASK-006-data-access-layer.md

---

## Minimal Final Report Format

After planning:

    ## MVP Planning Created

    ### Phase Folders

    - `.docs/.tasks/.phase-1-foundation/`
    - `.docs/.tasks/.phase-2-core-workflow/`

    ### Tasks Created

    - `TASK-001: ...`
    - `TASK-002: ...`

    ### Requirements Covered

    - `REQ-001`
    - `REQ-002`

    ### Updated Docs

    - `.docs/STATE.md`
    - `.docs/REQUIREMENTS.md`

    ### First Task

    Start with:
    `TASK-001: [name]`

After execution:

    ## Task Complete

    **Task:** TASK-XXX
    **Commit:** abc1234

    ### Changed

    -

    ### Verification

    - `npm run lint`: Pass
    - `npm run typecheck`: Pass

    ### Follow-up

    - None