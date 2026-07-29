---
title: "F-20260627-packed-cli-ui-build-install-gap: Packed CLI Cannot Build The
  Dashboard In An Installed Project"
status: done
owner: skopos-core
id: SKOPOS-F-20260627-PACKED-CLI-UI-BUILD-INSTALL-GAP
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-07-27
relatedDocs:
  - ../README.md
  - ../../decisions/031-bundled-cli-release-contract.md
reviewCycle: before release
---

# F-20260627-packed-cli-ui-build-install-gap: Packed CLI Cannot Build The Dashboard In An Installed Project

## Changelog

- `2026-07-27`: Closed after installed `skopos ui dev` learned to serve the
  CLI-bundled production app when the source UI package is unavailable, the bundled
  live app began polling the existing state endpoint, release smoke proved live
  refresh in a fresh installed project, and the exact tarball passed the Unisane
  brownfield pilot.
- `2026-07-26`: Reopened the installed live-UI slice after the Unisane brownfield
  pilot reproduced `Could not resolve the @skopos/ui package root for the Vite app.`
  from the exact packed CLI with `skopos ui dev .`; the same state served correctly
  from the Skopos source checkout.
- `2026-06-27`: Resolved by packaging the built dashboard app into the CLI tarball, falling back to bundled static assets for installed `skopos ui build`, and extending release smoke plus the external `skopos-pilot-basic` pilot to cover installed dashboard generation.
- `2026-06-27`: Opened after the external `skopos-pilot-basic` install-style pilot showed that `skopos ui build .` fails from the packed CLI tarball.

## Summary

- Severity: `MUST`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `release packaging and dashboard`
- Current State: packed CLI dashboard build and live development both work from an
  installed tarball. Source checkouts retain the Vite source/HMR path; installed
  projects serve the CLI-bundled production app and refresh through the same live
  state endpoint without resolving a monorepo-local `@skopos/ui` package.

## Symptom

The original installed `ui build` failure was fixed. The Unisane pilot later reproduced
the same resolution error through the live command:

```bash
npm exec --package /tmp/skopos-unisane-pilot-v5/skopos-cli-0.1.0.tgz -- skopos ui dev .
```

failed with:

```text
Could not resolve the @skopos/ui package root for the Vite app.
```

## Impact

1. first-time users can initialize Skopos and build a snapshot, but cannot start the
   live dashboard from an installed CLI
2. launch install tests are incomplete if they only exercise source-repo UI paths
3. dashboard-first developer experience is blocked for npm users

## Required Fix

1. make the bundled CLI include or resolve the dashboard app assets without depending on a monorepo-local `@skopos/ui` package path
2. add release smoke coverage that runs `skopos ui build .` and `skopos ui dev .`
   from a packed CLI in a fresh external project
3. verify `skopos ui dev .` or the intended installed dashboard command works through the same packed path

## Verification

1. `pnpm --filter @skopos/cli release:smoke` installed the packed CLI in a fresh
   temporary project, built the snapshot UI, started installed `skopos ui dev`, and
   observed live state refresh after the project index changed.
2. `pnpm build` and
   `pnpm --filter @skopos/cli pack --pack-destination /tmp/skopos-unisane-pilot-v9`
   produced the exact pilot tarball with SHA-256
   `2aab424c93c1bddd624401571098eac4967c8b133c222749fdcafcc209e08e9b`.
3. `pnpm dlx /tmp/skopos-unisane-pilot-v9/skopos-cli-0.1.0.tgz ui dev . --host
   127.0.0.1 --port 5173 --json` served the Unisane live console from the packed app.
4. Browser proof loaded the bundled hashed app assets, rendered Unisane decisions and
   semantic document projections, filtered plans/workpacks, and reported no console
   errors.
5. Compact installed-package trust reported 26 passing checks, 2 warnings, and 0
   failures; the warnings are pre-existing Unisane policy drift and no active mission
   after its adoption-pilot mission completed.
