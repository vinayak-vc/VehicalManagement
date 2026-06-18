# Decisions

> Architectural decisions and discrepancies. Codebase is the source of truth;
> when docs and code diverge, fix the docs and log it here.

## D-001 — Use artifact `window.storage` (shared) for the prototype
**Context:** Need persistence without standing up a backend.
**Decision:** Use the shared key–value store so multiple people see one registry.
**Trade-off:** No auth, last-write-wins, 5 MB/key. Acceptable for a prototype;
must be replaced for production (see roadmap v1.0).

## D-002 — Split photos into their own keys
**Context:** Storing base64 inside the index would bloat one key past limits.
**Decision:** `registry-index` holds metadata only; each photo is `vphoto:<id>`.
**Result:** Index stays small/fast; thumbnails load lazily.

## D-003 — Compress images client-side (max 900px, JPEG q0.6)
**Context:** Phone photos are multi-MB; the per-key limit is ~5 MB.
**Decision:** Canvas-resize + re-encode before storing.

## D-004 — Free-text flat number rather than a fixed unit map
**Context:** 272 units across 4 towers don't divide evenly (≈68/tower), and the
exact per-tower numbering isn't published.
**Decision:** Capture Tower (A–D) + a free-text flat number; quota keys on the
`tower-flatNo` pair. Revisit once the real numbering scheme is confirmed.

## D-005 — Custom CSS instead of Tailwind
**Context:** Design calls for a specific civic palette and a number-plate motif.
**Decision:** Inject custom CSS via a `<style>` tag for full control.

## Discrepancies log
- _(none yet — codebase and docs are in sync as of v0.1.)_
