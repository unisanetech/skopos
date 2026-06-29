# Skopos Domain And Feature Map

This page maps Skopos product domains to the code and docs an agent should inspect first.

## Metadata

- Doc ID: `SKOPOS-PROJECT-DOMAINS`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-06-29`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `architecture.md`
  - `../00-start-here.md`

## Changelog

- `2026-06-29`: Added the durable domain map required by agent-guided project understanding.

## Main Domains

| Domain | Purpose | First code paths | First docs |
| --- | --- | --- | --- |
| Bootstrap and scan | Detect repo shape, docs, commands, packages, and config. | `packages/indexer`, `packages/runtime/src/application/init` | `docs/how-to/bootstrap-the-project.md`, `docs/architecture/config-model.md` |
| Project memory | Map durable project truth and agent communication guidance. | `packages/runtime/src/application/shared/memory-state.ts`, `packages/model/src/contracts/skopos-memory-state.ts` | `docs/decisions/033-memory-map-and-agent-workflow-intelligence-contract.md` |
| Understanding and setup review | Explain project setup, separate facts from assumptions, and now guide agent analysis. | `packages/runtime/src/application/understanding`, `packages/cli/src/cli/commands/understanding.ts`, `packages/cli/src/cli/commands/setup.ts` | `docs/decisions/034-post-init-setup-review-and-confirmed-understanding-contract.md`, `docs/decisions/035-agent-guided-project-understanding-contract.md` |
| Workflow routing | Start, continue, ask decisions, record missions, and route the next action. | `packages/runtime/src/application/start`, `next`, `workflow-router`, `program` | `docs/decisions/032-workflow-recording-preflight-guard.md` |
| Trust and proof | Decide whether project state and mission closure are reliable. | `packages/trust`, `packages/runtime/src/application/eval`, `packages/runtime/src/application/done` | `docs/architecture/trust-and-closure-model.md` |
| Policy packs and gates | Apply accepted project rules and validation recommendations. | `tools/skopos/packs`, `packages/runtime/src/application/policies`, `packages/planner` | `docs/decisions/029-policy-pack-stack-intelligence-and-memory-contract.md` |
| UI console | Show workspace state to humans in simple, routed pages. | `packages/ui` | `docs/project/system-ui-plan.md`, `docs/project/human-guidance-and-developer-experience-plan.md` |
| Release and packaging | Bundle CLI, package metadata, smoke tests, and publish readiness. | `packages/cli`, root scripts, release docs | `README.md`, `packages/cli/README.md` |

## Common Change Routing

1. New artifact field: update `@skopos/model`, runtime producer, consumers, tests, CLI/UI output when needed.
2. New command: keep parsing/output in `@skopos/cli`, behavior in `@skopos/runtime`, contracts in `@skopos/model`.
3. New trust rule: update `@skopos/trust`, CLI output expectations, docs, and any eval behavior.
4. New UI page: update state projection, route/component, search if relevant, and build-console tests.
5. New pack or gate: update pack source, policy resolution, trust/policy drift behavior, and docs.

## Known Risk Areas

1. Trust can become too strict for small projects if warnings are not proportional.
2. Generated docs and workpacks can become reading burden if not archived.
3. CLI output can become machine-heavy; keep beginner/mid-level readability.
4. Understanding must not confuse scanner-generated facts with agent-reviewed project truth.
