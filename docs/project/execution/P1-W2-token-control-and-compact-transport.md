# P1-W2 Token Control And Compact Transport

Temporary execution workpack for the first implementation slice under the token-control contract. This wave stays focused on reducing agent-context waste at the CLI transport boundary before wider agent-brief artifacts, docs filtering, or background-job orchestration land.

## Metadata

- Doc ID: `SKOPOS-P1-W2`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project/execution`
- Canonical: `no`
- Last Updated: `2026-04-13`
- Review Cycle: `per workpack`
- Related Docs:
  - `../overview.md`
  - `../vision.md`
  - `../roadmap.md`
  - `../implementation-checklist.md`
  - `../missing-decisions-checklist.md`
  - `../../architecture/retrieval-and-query-strategy.md`
  - `../../architecture/artifact-model.md`
  - `../../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
  - `../../findings/F-20260412-token-control-and-agent-transport-gap.md`

## Changelog

- `2026-04-13`: Added runtime-managed handoff and telemetry artifacts, so `.skopos/discussions/handoffs/latest-workflow.json` now captures compact workflow resume state and `.skopos/agent/token-telemetry.json` now reports budget pressure as a separate diagnosis surface instead of leaving both concerns inside the prompt brief; the remaining scope is broader command-output telemetry, cache-aware host integration, and wider lane minimization.
- `2026-04-12`: Added the first prompt-layering and token-telemetry slice, so `.skopos/agent/prompt-brief.json` now captures the stable prefix versus dynamic tail contract and budget measurements for hot-path briefs plus default resume context; the remaining scope is broader command-output telemetry, handoff artifacts, and cache-aware host integration.
- `2026-04-12`: Expanded smallest-sufficient validation lanes so workspace-scoped plans can still narrow to one package when the goal names it clearly and impact reports now do the same for explicit changed paths that stay inside one package; the remaining scope is broader lane policy and telemetry.
- `2026-04-12`: Landed the first compact background-execution slice for eval, so `skopos eval --background` now writes durable `.skopos/jobs/*.json` artifacts and `skopos jobs show ... --compact --json` provides low-noise polling instead of keeping eval attached to the active thread; the remaining scope is broader lane policy and telemetry.
- `2026-04-12`: Tightened shell-output excerpt storage for eval and workflow artifacts, so Skopos now persists compact normalized excerpts capped to a much smaller budget instead of raw 4k tails; the remaining scope is broader lane policy, background execution, and telemetry.
- `2026-04-12`: Expanded the agent brief layer with mission-state projections under `.skopos/agent/missions/**`, so active mission state can be loaded through compact mission briefs instead of reopening full mission artifacts on the hot path; the remaining scope is broader lane policy, background execution, and telemetry.
- `2026-04-12`: Expanded the first validation-lane minimization slice so explicit docs-only goals now avoid broad plan validation commands and changed-path-aware impact reports also suppress runtime validation for docs, instruction, and generated-only surfaces; the remaining scope is broader lane policy, background execution, and telemetry.
- `2026-04-12`: Landed the first smallest-sufficient validation-lane slice, so package-scoped plans now narrow `recommendedChecks` to package-local `pnpm --filter <package> <script>` commands when local scripts exist and otherwise preserve the existing workspace lane; the remaining scope is broader lane policy, background execution, and telemetry.
- `2026-04-12`: Landed the first docs lifecycle filtering slice in the routed console, so docs under nested archive directories no longer enter the default discovered docs/search lane; the remaining scope is broader lifecycle enforcement, lane minimization, background execution, and telemetry.
- `2026-04-12`: Landed the first `.skopos/agent/**` brief artifact family for trust, done, program, and eval state, with knowledge-index coverage and CLI e2e regression coverage; the remaining scope is docs filtering, lane minimization, background execution, and telemetry.
- `2026-04-12`: Landed the second CLI-boundary token-control slice, so the same high-volume commands now support `--summary` and `--fields` on top of the shared compact projection layer; the remaining scope is now the `.skopos/agent/**` brief family, docs filtering, lane minimization, and telemetry.
- `2026-04-12`: Landed the first CLI-boundary compact transport slice, so `trust`, `done`, `eval`, `program sync`, and `program next` now support `--compact` output with shared projection helpers and regression coverage while broader agent briefs, docs filtering, and lane minimization remain future slices.
- `2026-04-12`: Opened for the first runtime slice after the token-control decision landed, so compact CLI projections can reduce JSON spill before the broader `.skopos/agent/**` brief family exists.

- Phase: `P1`
- Workpack: `P1-W2`
- Findings: `F-20260412-token-control-and-agent-transport-gap`
- Scope Packs: `SP-token-control-and-compact-transport`
- Status: `active`

## Temporary Status And Removal Rule

- Temporary execution artifact. Archive or remove it once the first compact transport slice lands, durable guidance is promoted into canonical docs, and active sequencing no longer depends on this workpack.

## Candidate Scope

- compact CLI output projections for the highest-volume workflow commands
- summary-only output for the same high-volume workflow commands
- explicit field-filtered JSON projections for the same high-volume workflow commands
- first agent-safe transport shape for `trust`, `done`, `eval`, and `program next`
- first runtime-managed `.skopos/agent/**` brief artifacts for trust, done, program, and eval state
- first runtime-managed mission brief artifacts under `.skopos/agent/missions/**`
- first docs lifecycle filtering for nested archive paths in the routed console docs and search lane
- first package-script-aware smallest-sufficient validation lane for package-scoped plans
- first docs-only smallest-sufficient validation lane for explicit docs goals and docs-only impact surfaces
- low-noise plain-text compact mode for the same commands
- compact shell-output storage for eval and workflow artifacts
- first compact background execution lane for eval jobs
- first workspace-goal and impact-driven single-package validation lane inference
- first prompt-layering and token-telemetry artifact under `.skopos/agent/prompt-brief.json`
- first runtime-managed workflow handoff artifact under `.skopos/discussions/handoffs/latest-workflow.json`
- first standalone token telemetry diagnosis artifact under `.skopos/agent/token-telemetry.json`
- regression coverage for compact transport behavior
- no docs lifecycle filtering or lane minimization implementation in this slice

## Checklist

- [x] Create the first compact transport workpack
- [x] Add shared compact projection helpers in the CLI layer
- [x] Add `--compact` support to `trust`
- [x] Add `--compact` support to `done`
- [x] Add `--compact` support to `eval`
- [x] Add `--compact` support to `program next`
- [x] Add `--compact` support to `program sync`
- [x] Add `--summary` support to the first compact transport commands
- [x] Add `--fields` support to the first compact transport commands
- [x] Add the first `.skopos/agent/**` brief artifacts for trust, done, program, and eval state
- [x] Add compact mission-state brief artifacts under `.skopos/agent/missions/**`
- [x] Exclude nested archive docs from the default routed console docs and search lane
- [x] Narrow package-scoped plan validation checks when compatible local package scripts exist
- [x] Suppress broad validation commands for explicit docs-only plans and docs-only impact surfaces
- [x] Cap persisted shell-output excerpts for eval and workflow artifacts
- [x] Add the first compact background execution lane for eval jobs
- [x] Narrow validation lanes when workspace goals or impact surfaces point at one package unambiguously
- [x] Add the first prompt-layering and token-telemetry artifact for hot-path brief budgeting
- [x] Add the first runtime-managed workflow handoff artifact for compact cross-thread resume state
- [x] Add the first standalone token telemetry diagnosis artifact
- [x] Cover compact transport with regression tests
- [x] Sync the decision and active finding with the first landed slice

## Verification Commands

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm architecture:index:check`
- `node --import tsx packages/cli/src/cli.ts workflows run instructions.sync-mirrors . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run graph.render-local-portal . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run maintenance.refresh-knowledge . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run quality.run-proof-phase . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run ui.build-console-app . --actor agent-core --json`
