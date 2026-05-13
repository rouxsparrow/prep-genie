# Requirements: Prep Genie v0.1 MVP

**Defined:** 2026-05-13  
**Last Updated:** 2026-05-13  
**Core Value:** Structured weekly meal planning that auto-calculates cooked gram portions to nutrition goals and generates shopping list from saved plan.

---

## Current Requirements (v0.1 MVP)

### Auth

- [ ] **REQ-001**: User can sign up/sign in using Supabase email/password.
- [ ] **REQ-002**: App supports multi-device sessions (default Supabase behavior).
- [ ] **REQ-003**: Dev-only admin bypass allows login with `admin/admin` only when env flag enabled.

### People (Profiles)

- [ ] **REQ-010**: User can CRUD People in account.
- [ ] **REQ-011**: Person stores daily goals (kcal/protein/carbs/fat), meals/day (2|3), optional per-category clamps.
- [ ] **REQ-012**: Coverage fixed at 80% of daily goals for all meals combined.
- [ ] **REQ-013**: Slot ratios fixed (3 meals: 20/40/40; 2 meals: 50/50).
- [ ] **REQ-014**: Portion grams rounded to nearest 5g.

### Recipes

- [ ] **REQ-020**: User can CRUD Recipes in account with normalized fields + `raw_json` snapshot.
- [ ] **REQ-021**: User can paste or upload recipe JSON; system validates strict schema; rejects invalid JSON with field-level errors; no auto-fill defaults.

### Weekly planner

- [ ] **REQ-030**: Week plan tied to real calendar week (Mon–Sun) and stores `week_start_date` Monday.
- [ ] **REQ-031**: For each Person/day/meal slot, user assigns recipe refs (protein+carb+veg required; extra optional).
- [ ] **REQ-032**: Incomplete slots allowed but flagged.

### Portion calculation + manual adjustment

- [ ] **REQ-040**: System computes cooked gram portions per slot/category to satisfy macro targets using deterministic heuristic.
- [ ] **REQ-041**: System highlights deviations vs tolerance rules (kcal ±10%, protein ±10–15%, carbs ±20%, fat ±20%).
- [ ] **REQ-042**: User can adjust grams manually; system rebalances carb+veg; respects clamps; no negative grams; clamp-applied deviations highlighted.

### Publish + shopping list

- [ ] **REQ-050**: Draft saves recipe refs only; publish saves computed portions snapshot for week.
- [ ] **REQ-060**: Shopping list aggregates ingredient totals from published snapshot; yield conversion applies only to ingredients with `is_main: true`.
- [ ] **REQ-061**: Shopping list can be derived from draft (computed on fly) or published snapshot.
- [ ] **REQ-062**: Shopping list supports grouping toggle (by ingredient vs by store category placeholder).

---

## Future Requirements

### Planner UX

- **REQ-100**: Desktop drag & drop planner interactions.

### Collaboration / accounts

- **REQ-110**: Multiple user logins per account (shared household).

### Shopping list enrichment

- **REQ-120**: Ingredient store categories (editable taxonomy) + smarter normalization.

---

## Out of Scope

| Feature | Reason |
|---|---|
| Automatic grocery delivery integrations | Not needed for MVP core workflow |
| Recipe scraping from websites | MVP is structured import/entry only |
| AI meal plan generation | MVP focuses on structured planning + portion math |
|  |  |

---

## Traceability

| Requirement | Area | Phase / Plan | Status |
|---|---|---|---|
| REQ-001 | Auth | Phase 1 / TASK-007 | Planned |
| REQ-003 | Auth | Phase 1 / TASK-008 | Planned |
| REQ-010 | People | Phase 2 / TASK-010 | Planned |
| REQ-020 | Recipes | Phase 2 / TASK-011 | Planned |
| REQ-021 | Recipes | Phase 2 / TASK-012 | Planned |
| REQ-030 | Planner | Phase 3 / TASK-013 | Planned |
| REQ-031 | Planner | Phase 3 / TASK-014 | Planned |
| REQ-040 | Solver | Phase 4 / TASK-016 | Planned |
| REQ-042 | Solver | Phase 4 / TASK-018 | Planned |
| REQ-050 | Publish | Phase 3 / TASK-015 | Planned |
| REQ-060 | Shopping | Phase 5 / TASK-019 | Planned |
| REQ-061 | Shopping | Phase 5 / TASK-020 | Planned |
| REQ-062 | Shopping | Phase 5 / TASK-021 | Planned |

---

## Coverage

| Metric | Count |
|---|---:|
| Current requirements | 16 |
| Mapped to phase / plan | 12 |
| Unmapped | 4 |
| Complete | 0 |
| Pending | 16 |

---

## Notes for Agent

- Keep requirements user-outcome focused, not implementation-detail focused.
- Use stable requirement IDs.
- Do not rename requirement IDs after implementation unless there is a strong reason.
- Move completed items to checked `[x]`, but keep them visible for traceability.
- Add future ideas under `Future Requirements`, not inside current scope.
- Keep `Out of Scope` explicit so the Agent does not “helpfully” expand the product like a raccoon with admin access.
- Update `Traceability` when a requirement is assigned to a phase, plan, or implementation task.
