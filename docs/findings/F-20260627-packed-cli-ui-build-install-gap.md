# F-20260627-packed-cli-ui-build-install-gap: Packed CLI Cannot Build The Dashboard In An Installed Project

## Metadata

- Doc ID: `SKOPOS-F-20260627-PACKED-CLI-UI-BUILD-INSTALL-GAP`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/release`
- Canonical: `yes`
- Last Updated: `2026-06-27`
- Review Cycle: `before release`
- Related Docs:
  - `registry.md`
  - `../decisions/031-bundled-cli-release-contract.md`

## Changelog

- `2026-06-27`: Opened after the external `skopos-pilot-basic` install-style pilot showed that `skopos ui build .` fails from the packed CLI tarball.

## Summary

- Severity: `MUST`
- Status: `active`
- Owner: `skopos-core`
- Target Pack: `release packaging and dashboard`
- Current State: packed CLI onboarding works for init, scan, policies, gates, trust, and instruction sync, but the installed dashboard build path cannot resolve `@skopos/ui`.

## Symptom

Running the packed CLI from an external project with:

```bash
npm exec --package /tmp/skopos-pilot-packs/skopos-cli-0.1.0.tgz -- skopos ui build . --json
```

failed with:

```text
Could not resolve the @skopos/ui package root for the Vite app.
```

## Impact

1. first-time users can initialize Skopos but cannot open the dashboard from an installed CLI
2. launch install tests are incomplete if they only exercise source-repo UI paths
3. dashboard-first developer experience is blocked for npm users

## Required Fix

1. make the bundled CLI include or resolve the dashboard app assets without depending on a monorepo-local `@skopos/ui` package path
2. add release smoke coverage that runs `skopos ui build .` from a packed CLI in a fresh external project
3. verify `skopos ui dev .` or the intended installed dashboard command works through the same packed path

## Verification

1. packed CLI can run `skopos ui build .` in a fresh external project
2. generated dashboard opens and reads the external project's `ui-state.json`
3. release smoke fails if installed UI resolution regresses

