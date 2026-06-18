# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Trident Elanzza Vehicle Registry** — society vehicle management for 272 flats / 4 towers (A–D). Residents register cars + two-wheelers; gate security searches by plate or flat.

Current state: **v0.1 prototype**. Single-file React app, no backend, no auth. The roadmap targets v1.0 on Firebase/Supabase with real auth and per-user isolation.

## Commands

This repo currently has no build system. When scaffolding the Firebase/React project:

```bash
# Install deps
npm install

# Dev server (Create React App or Vite)
npm start          # or: npm run dev

# Build for Firebase deploy
npm run build

# Firebase deploy (after firebase init)
firebase deploy --only hosting
```

For Firebase setup (v1.0 migration):
```bash
npm install -g firebase-tools
firebase login
firebase init hosting    # point to build/ output dir
```

## Architecture

### Single-file app (`VehicleRegistry.jsx`)
All UI, state, and storage logic lives in one file. Component hierarchy:
- `App` — tab state + global index load
  - `FlatPicker` — tower A–D selector + free-text flat number
  - `FlatView` — per-flat CRUD with quota enforcement
    - `VehicleForm` — add/edit form with image compression
    - `VehicleCard` — display with edit/remove
  - `GateLookup` — plate/flat search across the full index

### Storage (`window.storage` — prototype only)
Shared artifact key-value store, text/JSON, ~5 MB/key limit, last-write-wins. Two namespaces:

| Key | Content |
|---|---|
| `registry-index` | JSON array of vehicle metadata (no image bytes) |
| `vphoto:<id>` | Compressed JPEG as base64 data-URL |

**Photos never go in the index** (D-002). All mutations do a read-modify-write: `loadIndex()` → mutate → `saveIndex()`.

For v1.0: replace `window.storage` calls behind the four helpers (`loadIndex`, `saveIndex`, `savePhoto`, `loadPhoto`) — the UI components are already decoupled from storage.

### Styling
Plain CSS in a `<style>` tag (not Tailwind). Custom palette via CSS variables (`--teal`, `--marigold`, `--ink`, etc.) in `:root`. The Indian number-plate motif uses the `Oswald` font + a blue `IND` strip with inline tricolour.

### Business rules (constants in code)
```js
TOWERS = ["A", "B", "C", "D"]
MAX_CARS = 1       // per flat
MAX_TWO  = 2       // per flat
TOTAL_FLATS = 272
```
Quota is enforced in the UI by filtering the index on `flatKey = "<tower>-<flatNo>"`.

### Image handling
`compressImage()` resizes to max 900px and encodes as JPEG at q0.6 before storing. Required — phone photos would exceed the 5 MB/key limit without this.

## Key patterns (follow; don't deviate without adding a D-00N entry to `decisions.md`)

1. **Photos out of the index** — bytes keyed by `vphoto:<id>` only.
2. **Compress before store** — always via `compressImage()`.
3. **Read-modify-write** — re-`loadIndex()` inside every mutation.
4. **Quota from live filtered records** — never cache quota state separately.
5. **`flatKey`** is always `tower + "-" + flatNo`, the canonical flat identity.

## Docs (read before making structural changes)

- `docs/architecture.md` — stack, data model, patterns
- `docs/decisions.md` — D-001–D-005, architectural decisions + discrepancy log
- `docs/roadmap.md` — v0.2 data-integrity work and v1.0 production plan
- `docs/tasks.md` — done / to-do / blocked
- `docs/ai_handoff.md` — session summary and recommended next actions
