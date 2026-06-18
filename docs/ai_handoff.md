# AI Handoff

## Where things stand
**v0.1 prototype is complete and runnable.** It is a single React artifact backed
by the artifact shared key–value store. Full add/edit/remove + gate-lookup flow
works. It is intentionally NOT production-ready (no auth, shared data).

## Files in this project
- `VehicleRegistry.jsx` — the entire app (UI + storage + image compression).
- `docs/project-overview.md` — what this is and the society facts.
- `docs/architecture.md` — stack, data model, patterns to follow.
- `docs/roadmap.md` — v0.2 and v1.0 plans + open product questions.
- `docs/tasks.md` — done / to-do / blocked.
- `docs/decisions.md` — architectural decisions (D-001…D-005).

## Files changed this session
- Created all of the above (greenfield project).

## How to continue (read these first)
1. `project-overview.md`, `architecture.md`, `roadmap.md`, `tasks.md`, this file.
2. Treat the **codebase as source of truth**; if docs drift, fix docs + log in
   `decisions.md`.
3. Follow existing patterns: photos out of the index, compress before store,
   read-modify-write the live index, quota constants `MAX_CARS` / `MAX_TWO`.

## Recommended next actions (in priority order)
1. **Confirm intent with the owner** — deployed app vs. committee demo. This
   decides whether v1.0 (backend + auth) starts now. (Blocked question.)
2. If proceeding to production: choose backend (Supabase suggested), migrate
   `window.storage` calls behind a small data-access layer so the UI is reused.
3. Implement v0.2 data-integrity items (plate validation, duplicate detection,
   confirm-before-remove) — low risk, high value, no backend needed.
4. Confirm the real per-tower flat-numbering scheme and tighten the picker.

## Gotchas
- `window.storage.get` throws on a missing key — helpers already swallow this.
- Shared scope means concurrent edits clobber (last-write-wins).
- Don't move photo bytes into `registry-index` (size limit). See D-002.
