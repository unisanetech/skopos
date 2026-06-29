# Skopos Validation Gates

This page records the validation commands and when agents should use them.

## Metadata

- Doc ID: `SKOPOS-PROJECT-VALIDATION`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-06-29`
- Review Cycle: `per workpack`
- Related Docs:
  - `workflows.md`
  - `architecture.md`
  - `../architecture/trust-and-closure-model.md`

## Changelog

- `2026-06-29`: Added durable validation guidance for agent-guided Skopos understanding.

## Core Commands

| Command | Use |
| --- | --- |
| `pnpm typecheck` | Required for model/runtime/CLI/UI TypeScript changes. |
| `pnpm test` | Required when behavior, UI state, CLI formatting, trust, or runtime logic changes. |
| `pnpm build` | Required before packaging, UI bundle changes, and release readiness. |
| `pnpm instructions:sync` | Required after changing `AGENTS.md` or instruction behavior. |
| `pnpm skopos:ui` | Required after changing UI state shaping, routed UI, trust surfaces, docs projection, or console output. |
| `pnpm proof` | Use for proof/reporting flows when closure requires project proof artifacts. |

## Focused Checks

Use focused checks before full checks when iterating:

1. CLI behavior: `pnpm --filter @skopos/cli exec vitest run <test-file>`
2. UI behavior: `pnpm --filter @skopos/ui exec vitest run <test-file>`
3. Package typecheck: `pnpm --filter @skopos/<package> check-types`

Focused checks do not replace the broader lane when the change touches shared contracts or release behavior.

## Mission Closure Checks

For normal or workpack missions, closure should include:

1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm build`
4. registered workflows from the mission, such as instruction sync or UI render
5. `skopos eval . --mission <id> --actor <actor>`
6. `skopos trust . --actor <actor>`

## Release Readiness Checks

Before publishing:

1. `pnpm release:check`
2. `pnpm typecheck`
3. `pnpm release:smoke`
4. `npm pack`
5. install test in a fresh external project
6. `npx`, `pnpm dlx`, and `npm exec` command tests

## Gate Selection Rule

Choose checks by touched surface:

1. model contract touched: typecheck all affected packages and run relevant e2e tests
2. runtime workflow touched: typecheck, focused CLI/runtime tests, full test if shared behavior changed
3. trust touched: trust command, eval if closure behavior changed, tests
4. UI touched: UI tests, app build, `pnpm skopos:ui`
5. docs-only touched: docs/trust checks plus any command required by the doc area
6. release touched: release check, smoke, pack/install test

Do not claim a command passed unless it actually ran in the current workstream.
