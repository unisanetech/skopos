---
title: Skopos Validation Standard
status: active
owner: skopos-core
id: SKOPOS-PROJECT-VALIDATION
scope: skopos
role: standard
lifecycle: durable
authority: canonical
provenance: declared
view: current
appliesTo:
  - workspace
lastUpdated: 2026-07-28
relatedDocs:
  - ../guides/developer-workflows.md
  - ../architecture/00-architecture.md
  - ../architecture/evidence-and-readiness-model.md
reviewCycle: when owning truth changes
---

# Skopos Validation Standard

This page records the validation commands and when agents should use them.

## Changelog

- `2026-07-28`: Classified validation guidance as a workspace standard and repaired
  its workflow and architecture authority links.
- `2026-06-29`: Added durable validation guidance for agent-guided Skopos understanding.

## Core Commands

| Command | Use |
| --- | --- |
| `pnpm typecheck` | Required for model/runtime/CLI/UI TypeScript changes. |
| `pnpm test` | Required when behavior, UI state, CLI formatting, Readiness, or runtime logic changes. |
| `pnpm build` | Required before packaging, UI bundle changes, and release readiness. |
| `pnpm instructions:sync` | Required after changing `AGENTS.md` or instruction behavior. |
| `pnpm skopos:ui` | Required after changing UI state shaping, routed UI, Readiness surfaces, docs projection, or console output. |
| `pnpm proof` | Use for proof/reporting flows when closure requires project proof artifacts. |

## Focused Checks

Use focused checks before full checks when iterating:

1. CLI behavior: `pnpm --filter @skopos/cli exec vitest run <test-file>`
2. UI behavior: `pnpm --filter @skopos/ui exec vitest run <test-file>`
3. Package typecheck: `pnpm --filter @skopos/<package> check-types`

Focused checks do not replace the broader lane when the change touches shared contracts or release behavior.

## Task Closure Checks

For standard or high-impact Tasks, closure should include:

1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm build`
4. applicable Actions from the Task, such as instruction sync or UI render
5. `skopos verify <task-id> . --phase closure --actor <actor>`
6. `skopos readiness <task-id> . --for close --actor <actor>`

## Release Readiness Checks

Before publishing:

1. `pnpm release:check`
2. `pnpm typecheck`
3. `pnpm release:smoke`
4. `npm pack`
5. install test in a fresh external project
6. `npx`, `pnpm dlx`, and `npm exec` command tests

## Selection Rule

Choose checks by touched surface:

1. model contract touched: typecheck all affected packages and run relevant e2e tests
2. runtime Action touched: typecheck, focused CLI/runtime tests, full test if shared behavior changed
3. Readiness touched: Readiness command, Verify if closure behavior changed, tests
4. UI touched: UI tests, app build, `pnpm skopos:ui`
5. docs-only touched: document contract checks plus any Action required by the doc area
6. release touched: release check, smoke, pack/install test

Do not claim a command passed unless it actually ran in the current workstream.
