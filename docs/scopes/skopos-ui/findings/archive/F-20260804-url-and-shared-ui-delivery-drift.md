---
title: URL And Shared UI Delivery Drift
status: resolved
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260804-URL-AND-SHARED-UI-DELIVERY-DRIFT
scope: skopos-ui
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-04
relatedDocs:
  - ../../architecture/00-architecture.md
  - ../../decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md
  - ../../work/archive/P-20260804-human-first-ui-convergence.md
---

# URL And Shared UI Delivery Drift

## Summary

The human-first console used hash navigation and Skopos-only primitives after the
Unisane UI external registry had become available. The visible application therefore
did not yet match its intended URL or shared-component delivery model.

## Evidence

The 2026-08-04 source and live review found:

1. the router used `createHashHistory`
2. search and knowledge destinations generated `#/...` links
3. bootstrap logic treated the hash as the initial route authority
4. the Vite build used a relative asset base chosen for hash/static navigation
5. the Shared UI phase remained documented as deferred even though the Unisane UI
   registry and CLI source-install contract were implemented
6. visible Skopos status, card, and control patterns did not consume registry owners

## Impact

1. URLs were less readable, shareable, and consistent with a normal application
2. route behavior differed from the Unisane Ops console direction
3. Skopos duplicated low-level UI maintenance that the external registry could own
4. documentation understated the current shared UI delivery capability

## Resolution Criteria

1. canonical routes contain no application hash prefix
2. direct nested requests, reload, and browser history work in dev and built serve modes
3. generated internal destinations use pathname URLs
4. visible patterns consume registry-installed local source and managed semantic CSS
5. no Unisane UI/token runtime dependency is introduced
6. focused type, test, build, and live route proof passes

## Resolution

Task `T-fec6a29e` replaced hash history with browser history, normalized generated
destinations, retained SPA fallback in both servers, and changed the production asset
base for nested routes. The official Unisane CLI installed the neutral semantic
baseline plus Button, Badge, Card, and their transitive support into `@skopos/ui`.
Skopos patterns now compose those local owners while retaining application-specific
language and information hierarchy.

Focused proof passed on 2026-08-04: 13 UI tests, UI typecheck, production application
build, direct HTTP requests for `/overview` and `/tasks/T-fec6a29e`, and live desktop
and compact rendering. Built-server and browser-history checks complete the Task
closure evidence.

## Changelog

- `2026-08-04`: Resolved through clean URL routing, registry installation, visible
  adoption, and focused proof.
- `2026-08-04`: Opened from the post-redesign source and live-product review.
