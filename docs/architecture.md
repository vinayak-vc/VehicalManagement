# Architecture

## Stack (current prototype)
- **UI:** Single-file React component (`VehicleRegistry.jsx`), no router, no
  external state library. All state via React hooks.
- **Styling:** Plain CSS injected via a `<style>` tag (custom design tokens).
  Not Tailwind — the design needs a custom palette and the number-plate motif.
- **Persistence:** Artifact key–value store (`window.storage`), **shared scope**
  so every viewer sees one common registry.

## Data model
Stored across two key namespaces in `window.storage` (shared = true):

| Key                | Value                                                        |
|--------------------|--------------------------------------------------------------|
| `registry-index`   | JSON array of vehicle records **without** image bytes        |
| `vphoto:<id>`      | Compressed JPEG data-URL (one key per vehicle photo)         |

Vehicle record:
```
{ id, flatKey, tower, flatNo, type: 'car'|'two_wheeler',
  make, color, plate, hasPhoto: bool, createdAt }
```
- `flatKey = "<tower>-<flatNo>"` is the identity used for quota + grouping.
- Photos are split into their own keys so the index stays small and loads fast;
  thumbnails load lazily by id.

## Key patterns (follow these; don't introduce alternatives without a decision)
1. **Photos never live in the index.** Index = metadata only; bytes keyed by id.
2. **Compress before store.** All images pass through `compressImage()`
   (max 900px, JPEG q0.6) to stay well under the 5 MB/key limit.
3. **Read-modify-write on the live index.** Mutations re-`loadIndex()` first,
   then `saveIndex()`, to reduce clobbering (last-write-wins still applies).
4. **Quota enforced in the UI** from the current flat's filtered records
   (`MAX_CARS = 1`, `MAX_TWO = 2`).

## Known constraints
- `window.storage` is text/JSON only, ~5 MB per key, last-write-wins.
- Shared scope = no access control; any viewer can edit any entry.
- These constraints are why this is a prototype, not production (see roadmap).
