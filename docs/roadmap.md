# Roadmap

## v0.1 — Prototype (DONE)
- Tower/flat picker, per-flat vehicle slots.
- Add / edit / remove car + two-wheelers with quota enforcement.
- Photo upload with client-side compression; authentic Indian plate rendering.
- Gate lookup: search by plate or flat.
- Shared registry via `window.storage`.

## v0.2 — Data integrity (next)
- Number-plate format validation (state + RTO + series + number).
- Duplicate-plate detection across the whole registry.
- Confirm-before-remove dialog.
- Optional resident name + contact per flat.

## v1.0 — Production (requires a real backend)
- **Backend + DB** (e.g. Supabase / Firebase) replacing `window.storage`.
- **Authentication:** residents log in; can only edit their own flat.
- **Roles:** resident vs. gate-security/admin (admin sees all, residents see own).
- **Image storage** in object storage (S3/Firebase Storage), not base64.
- Admin export (CSV) of the full registry for committee records.

## Later / nice-to-have
- Number-plate OCR to auto-fill the plate from the photo.
- Visitor / guest vehicle passes.
- Notifications for unregistered vehicles flagged at the gate.

## Open product questions (confirm with owner)
- Is this a deployed app for all 272 flats, or a committee demo for now?
- Should residents self-register, or does the committee enter data?
- Are commercial / EV plates (yellow / green) in scope, or private only?
