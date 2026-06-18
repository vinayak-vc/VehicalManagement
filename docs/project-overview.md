# Project Overview — Trident Elanzza Vehicle Registry

## Purpose
A vehicle management app for the **Trident Elanzza** residential society
(Vaishnodevi Circle, Ahmedabad North). Residents register their household
vehicles with photos and number plates so the society — and gate security —
can verify who a vehicle belongs to.

## Society facts (source of truth for limits)
- Total flats: **272** (verified via public listing, May 2024).
- Layout: **4 towers (A–D), 14 floors, 2 phases.**
- Per-flat vehicle limit (business rule set by owner): **1 car + 2 two-wheelers.**
- Registry ceiling: 272 cars + 544 two-wheelers = **816 vehicles.**

## Core user stories
1. As a resident, I select my tower + flat and add my car / two-wheelers.
2. For each vehicle I record make & model, colour, number plate, and a photo
   showing the plate.
3. The app enforces the 1-car / 2-two-wheeler quota per flat.
4. As gate security, I search by plate or flat to verify a vehicle on arrival.

## Current status
**Prototype (v0.1).** Single-file React app with shared key–value storage.
Demonstrates the full flow end-to-end but is NOT production-hardened
(no real authentication, no per-user data isolation). See ai_handoff.md.

## Out of scope (for now)
Automatic number-plate recognition (OCR), visitor/guest vehicles, payment of
parking dues, push notifications, multi-society support.
