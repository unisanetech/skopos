---
title: "F-20260413-package-pilot-validation-command-surface-gap: Nested Package
  Pilots Stored Raw Script Bodies Instead Of Runnable Validation Commands"
status: done
owner: skopos-core
id: SKOPOS-F-20260413-PACKAGE-PILOT-VALIDATION-COMMAND-SURFACE-GAP
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-04-13
relatedDocs:
  - ../README.md
  - ../../domains/product/vision.md
  - ../../architecture/runtime-model.md
reviewCycle: per workpack
---

# F-20260413-package-pilot-validation-command-surface-gap: Nested Package Pilots Stored Raw Script Bodies Instead Of Runnable Validation Commands

## Changelog

- `2026-04-13`: Opened after the temporary pilot on `unisane/packages/modules/identity` reached `trust = high / agent-ready` but `skopos eval` still failed with exit code `127` for every validation command because the generated config stored raw script bodies like `vitest run` and `eslint src --max-warnings 0` instead of an executable package command lane.
- `2026-04-13`: Closed after scan-time command inference began storing runnable `pnpm <script>` commands, stale temporary pilot config began refreshing legacy raw command values on rerun, and the shell runner began resolving ancestor `node_modules/.bin` paths so older mission artifacts with raw script bodies no longer fail immediately in nested packages.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `nested package pilot validation surface`
- Current State: resolved. Nested package pilots now write executable `pnpm`-based command surfaces into generated config, and stale temporary pilot configs refresh away from raw script-body commands.

## Symptom

1. A package pilot could report `trust = high / agent-ready`.
2. The same pilot’s `skopos eval` then failed immediately with exit code `127` for validation commands.
3. The underlying package lanes still passed when run manually through `pnpm --dir <package> test` and `pnpm --dir <package> build`.
4. The gap was caused by storing raw script bodies in `skopos.config.yaml` instead of runnable command lanes.

## Impact

1. Pilot readiness looked better than actual closure behavior.
2. `eval` and mission closure could fail for healthy packages.
3. Users could lose trust in package-local onboarding because the first real workflow looked broken.

## Fix Plan

1. Infer executable command surfaces from package scripts as `pnpm <script>`.
2. Preserve script aliases like `check-types` when mapping `typecheck`.
3. Refresh stale bootstrap-managed package pilot configs when they still contain raw script bodies.
4. Add regression coverage for nested-package init and stale pilot refresh.

## Verification

1. Nested-package init writes `pnpm build`, `pnpm test`, `pnpm lint`, and `pnpm check-types` into the generated config when those scripts exist.
2. Rerunning a stale temporary pilot refreshes legacy raw command values in place.
3. The real `identity` pilot no longer depends on raw script-body commands in `skopos.config.yaml`.
4. Older mission artifacts with raw script bodies can still execute inside nested package pilots because local binaries now resolve through ancestor workspace bin paths.

## Linked Docs

1. `../README.md`
2. `../../domains/product/vision.md`
3. `../../architecture/runtime-model.md`
