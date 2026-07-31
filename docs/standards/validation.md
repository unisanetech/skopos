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
lastUpdated: 2026-07-30
relatedDocs:
  - ../guides/developer-workflows.md
  - ../architecture/00-architecture.md
  - ../architecture/evidence-and-readiness-model.md
reviewCycle: when owning truth changes
---

# Skopos Validation Standard

This page records the project capability catalog and the rule for selecting proof.

## Changelog

- `2026-07-31`: Made `finish` the canonical closure transaction and required precise
  Action inputs with explicit exclusions for unrelated volatile descendants.
- `2026-07-30`: Added the capability-integration boundary: detected commands are
  candidates only, tracked Action/Guard declarations require digest-bound approval,
  and provider validation is mandatory before activation.
- `2026-07-30`: Removed the fixed standard/high-impact command checklist. Commands are
  project-owned capabilities exposed as Actions; deterministic Guards select the
  smallest sufficient Actions from Task impact. Verification consumes only
  Task-linked Evidence.
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

## Task Closure

For every Task:

1. inspect the Task-selected Guards and Actions
2. run only the selected Actions with `--task <task-id>`
3. record the acceptance or Guard observations the Task requests
4. optionally diagnose with `skopos verify <task-id> . --phase closure --json`
5. run `skopos finish <task-id> . --actor <actor>`

Typecheck, test, build, lint, docs checks, release checks, and project-specific gates
are not a universal sequence. They run when an applicable project Guard selects their
declared Action.

## Integrating Project Checks

Existing project scripts are discovery input, not Evidence or enforcement. Use
`skopos integrations propose|approve|apply` to review and bind a script. The proposal
must expose the exact Action and Guard fields, approval must bind their digest and
candidate ids, and application must validate every Guard provider. Missing providers,
changed proposal content, changed approval content, or declaration collisions fail
closed.

Action manifests declare the narrowest durable `inputs` that the command proves.
When an unavoidable directory input contains unrelated generated or volatile
descendants, list those descendants under `sourceExcludes`. Exclusions must never hide
source the Action actually validates.

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
Do not treat an unlinked global Action run as Task Evidence.
