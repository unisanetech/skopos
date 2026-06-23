# F-20260412-cli-entrypoint-command-ownership-drift: The Skopos CLI Entrypoint Had Become A Command Bucket Instead Of A Thin Tool Surface

## Metadata

- Doc ID: `SKOPOS-F-20260412-CLI-ENTRYPOINT-COMMAND-OWNERSHIP-DRIFT`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../project/implementation-checklist.md`
  - `../project/roadmap.md`

## Changelog

- `2026-04-12`: Opened after the self-hosted `skopos` CLI reached `2288` lines in one file, with top-level routing, help text, subcommand branching, argument parsing, and execution summaries all mixed inside `packages/cli/src/cli.ts`. The first decomposition batch moved the CLI to a thin entrypoint plus command-owned modules under `packages/cli/src/cli/**`.

## Summary

- Severity: `SHOULD`
- Status: `in-progress`
- Owner: `skopos-core`
- Target Pack: `cli surface decomposition`
- Current State: partially fixed. `packages/cli/src/cli.ts` is now a thin entrypoint and top-level router logic lives in `packages/cli/src/cli/index.ts` plus `packages/cli/src/cli/registry.ts`, while command parsing and execution moved into command-owned modules under `packages/cli/src/cli/commands/**`. The remaining work is to keep future command additions on that ownership model and avoid rebuilding a single-file bucket through ad hoc growth.

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
5. Leave this finding active until the decomposed structure stays stable through the next CLI feature batches.

## Verification

1. `packages/cli/src/cli.ts` stays small and only owns entrypoint bootstrapping plus shared error handling.
2. Command registration is explicit in a registry layer rather than in one giant `switch`.
3. Parsing and execution responsibilities are split into command-owned modules under `packages/cli/src/cli/commands/**`.
4. CLI release-surface and proof-phase checks still pass after the structural split.

## Linked Docs

1. `registry.md`
2. `../project/implementation-checklist.md`
3. `../project/roadmap.md`
