---
title: "F-20260412-cli-entrypoint-command-ownership-drift: The Skopos CLI
  Entrypoint Had Become A Command Bucket Instead Of A Thin Tool Surface"
status: done
owner: skopos-core
id: SKOPOS-F-20260412-CLI-ENTRYPOINT-COMMAND-OWNERSHIP-DRIFT
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-06-25
relatedDocs:
  - ../README.md
  - ../../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../../work/archive/P-37fa9180-prototype-roadmap.md
reviewCycle: per workpack
---

# F-20260412-cli-entrypoint-command-ownership-drift: The Skopos CLI Entrypoint Had Become A Command Bucket Instead Of A Thin Tool Surface

## Changelog

- `2026-06-25`: Closed after the CLI entrypoint, router, and registry stayed decomposed and `package-boundaries.test.ts` gained regression coverage that keeps `cli.ts`, `cli/index.ts`, and `cli/registry.ts` thin.
- `2026-04-12`: Opened after the self-hosted `skopos` CLI reached `2288` lines in one file, with top-level routing, help text, subcommand branching, argument parsing, and execution summaries all mixed inside `packages/cli/src/cli.ts`. The first decomposition batch moved the CLI to a thin entrypoint plus command-owned modules under `packages/cli/src/cli/**`.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `cli surface decomposition`
- Current State: closed. `packages/cli/src/cli.ts` is a thin process entrypoint, top-level router logic lives in `packages/cli/src/cli/index.ts`, command registration lives in `packages/cli/src/cli/registry.ts`, and command parsing/execution lives in command-owned modules under `packages/cli/src/cli/commands/**`. Regression coverage now blocks the entrypoint, router, or registry from becoming a command bucket again.

## Symptom

1. `packages/cli/src/cli.ts` had grown into a `2288`-line file.
2. One file owned command dispatch, help output, argument parsing, subcommand branching, and command execution summaries for nearly the whole CLI surface.
3. New router commands such as `start`, `decide`, `next`, and `eval` were landing in the same file instead of in command-owned modules.
4. Package-level ownership was no longer obvious from the source tree, even though the CLI is supposed to stay a thin tool surface.

## Impact

1. The public `skopos` tool surface became harder to review and extend safely.
2. Small command changes risked creating merge friction in the same shared bucket file.
3. The Skopos CLI violated the product’s own doctrine that `cli`, `mcp`, and `ui` must stay thin.
4. The file shape pushed future work toward copy-paste parser growth instead of explicit command ownership.

## Fix Plan

1. Keep `packages/cli/src/cli.ts` as the bin entrypoint only.
2. Keep top-level dispatch and help in a dedicated `cli/` router layer instead of the bin file.
3. Keep command parsing and execution in command-owned modules under `packages/cli/src/cli/commands/**`.
4. Keep future command additions routed through the registry instead of appending new `run*Command` and `parse*Args` buckets back into the entrypoint.
5. Keep the boundary regression test active so future command batches do not rebuild the old single-file bucket.

## Verification

1. `packages/cli/src/cli.ts` stays small and only owns entrypoint bootstrapping plus shared error handling.
2. Command registration is explicit in a registry layer rather than in one giant `switch`.
3. Parsing and execution responsibilities are split into command-owned modules under `packages/cli/src/cli/commands/**`.
4. CLI release-surface and proof-phase checks still pass after the structural split.
5. `package-boundaries.test.ts` checks the CLI entrypoint, router, and registry size/ownership contract.

## Linked Docs

1. `../README.md`
2. `../../work/archive/P-b4e43e34-prototype-implementation-checklist.md`
3. `../../work/archive/P-37fa9180-prototype-roadmap.md`
