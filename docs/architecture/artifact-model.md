# Artifact Model

Skopos should produce a stable, versioned local artifact family for both humans and agents.

## Metadata

- Doc ID: `SKOPOS-ARCH-ARTIFACT-MODEL`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/architecture`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per workpack`
- Related Docs:
  - `config-model.md`
  - `docs-governance.md`
  - `retrieval-and-query-strategy.md`
  - `../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`

## Changelog

- `2026-06-24`: Added authored pack source roots for policy, stack, gate, and workflow intelligence so built-in project guidance is treated as source truth separate from generated `.skopos/**` state and SDK package scopes.
- `2026-04-13`: Added `.skopos/agent/token-telemetry.json` plus the first runtime-managed workflow handoff artifact at `.skopos/discussions/handoffs/latest-workflow.json`, so budget diagnosis and cross-thread resume state now exist as separate derived runtime artifacts instead of staying implicit in prompt planning alone.
- `2026-04-12`: Expanded the `.skopos/agent/**` brief family with `.skopos/agent/prompt-brief.json`, so prompt layering and hot-path token budgets now compile into one runtime-managed projection instead of staying implicit in docs and host behavior.
- `2026-04-12`: Expanded the `.skopos/agent/**` brief family with mission-state projections under `.skopos/agent/missions/**`, so active mission routing can load compact mission state before reopening full mission artifacts on the hot path.
- `2026-04-12`: Implemented the first `.skopos/agent/**` brief family, so trust, done, program, and eval state now project into compact agent-facing summaries and index entries without becoming a second source of truth.
- `2026-04-12`: Added the planned `.skopos/program/state.json` artifact so accepted work, sequencing, and docs plus UI obligations can compile into one shared program-control surface above the mission router instead of staying spread across chat, roadmap notes, and local memory.
- `2026-04-12`: Added the planned discussion-memory artifact family under `.skopos/discussions/`, so raw turn journals, compact checkpoints, and pre-compaction handoff summaries now have explicit ownership and local-only retention policy instead of staying as undefined chat residue.
- `2026-04-12`: Updated the artifact model after `skopos eval` landed, so `.skopos/evals/*.json` is now an implemented runtime artifact family alongside `.skopos/questions.json` and `.skopos/recommendations.json`.
- `2026-04-11`: Added the planned workflow-router artifact families, so the next workflow increment now has named durable surfaces for unresolved decisions, bounded recommendations, and mission-scoped eval outputs instead of leaving those states implicit in chat or command output only.
- `2026-04-10`: Updated the artifact model to include the runtime-managed `.skopos/proof/latest-report.json` artifact so proof scorecards and committed baseline comparison stop living only in transient test output.
- `2026-04-10`: Updated the artifact model so parent mission artifacts and graphs are refreshed when linked child slice missions change state, not only when the slice is first created.
- `2026-04-10`: Updated the artifact model to reflect linked child slice metadata on plan and mission artifacts, plus `mission-slice` operational log events and parent mission graph refresh during batch decomposition.
- `2026-04-10`: Updated the artifact model to reflect that `scan` now refreshes the durable `.skopos/diagnosis.json` artifact instead of returning diagnosis as a transient-only surface.
- `2026-04-10`: Updated the artifact model to reflect actor-attributed `scan` operational log entries and index refresh, so brownfield diagnosis activity is captured in the same lifecycle record as the rest of Skopos.
- `2026-04-10`: Updated the artifact model to reflect actor-attributed `init`, `trust`, and `impact` operational log entries, so bootstrap and validation lifecycle events are no longer anonymous when actor identity is known.
- `2026-04-10`: Updated the artifact model to reflect `instructions-sync` operational log entries with optional actor attribution for shared mirror maintenance.
- `2026-04-10`: Updated the artifact model to reflect actor-attributed plan artifacts and initial mission coordination provenance at plan creation time.
- `2026-04-10`: Updated the artifact model to reflect actor-attributed workflow run artifacts for mutating workflow evidence.
- `2026-04-10`: Updated the artifact model to reflect actor-attributed override entries and explicit force-transfer protection for durable shared canonical state.
- `2026-04-10`: Updated the artifact model to reflect mission-level multi-actor coordination metadata and to keep mission artifacts local runtime state even after the first ownership model exists.
- `2026-04-09`: Updated the artifact model to reflect explicit `sourceDependencies` probes in bootstrap state and the compiled-state invalidation lane that refreshes query and trust reads when source truth changes.
- `2026-04-09`: Updated the artifact model to reflect the implemented `.skopos/index.json` content index and `.skopos/log.jsonl` operational log surfaces.
- `2026-04-09`: Updated the artifact model to reflect the implemented durable `.skopos/overrides.json` artifact and its special treatment as mutable shared truth rather than invalid generated churn.
- `2026-04-09`: Updated the artifact model to include `.skopos/enforcement.json` and generated tool-native adapter outputs under `.skopos/tooling/**`.
- `2026-04-09`: Updated the artifact model to make subtree-targeted compiled slices explicit through focus metadata on bootstrap, scopes, diagnosis, and architecture artifacts.
- `2026-04-09`: Updated the artifact model to include `.skopos/architecture.json` as the compiled current-state versus recommended-state architecture artifact.
- `2026-04-09`: Added the first explicit commit-policy and override-artifact direction for durable shared truth versus local runtime state.
- `2026-04-09`: Refined the artifact model around compiled knowledge, planned index and operational log surfaces, and explicit durable-versus-ephemeral artifact policy.
- `2026-04-09`: Updated the artifact model to include the broader init graph family for docs, commands, and scope relations.
- `2026-04-09`: Updated the artifact model to include the local portal shell at `docs/generated/skopos/index.html`.
- `2026-04-09`: Updated the artifact model to include the generated graph portal HTML under `docs/generated/skopos/graph-portal.html`.
- `2026-04-09`: Updated the artifact model to reflect the first implemented graph artifacts: workspace, mission, and impact graphs under `.skopos/graph/`.
- `2026-04-09`: Updated the artifact model to treat `.skopos/runs/*.json` as runtime-managed workflow evidence artifacts rather than immutable derived state.
- `2026-04-09`: Updated the artifact model to reflect that project-authored workflow manifests and generated workflow run evidence are now part of the implemented artifact family.
- `2026-04-09`: Updated the artifact model to distinguish mutable workflow artifacts under `.skopos/plans/` and `.skopos/missions/` from immutable derived artifacts like bootstrap and scopes-lite.
- `2026-04-09`: Updated the artifact model to reserve `.skopos/graph/*.json` for typed internal graph artifacts and scoped visual projections.
- `2026-04-09`: Updated the artifact model to include persisted plan and mission artifacts under `.skopos/plans/` and `.skopos/missions/`.
- `2026-04-09`: Updated the artifact model to include `.skopos/diagnosis.json` as the generated pattern and remediation report surface.
- `2026-04-09`: Updated the artifact model to reflect that closure now treats `.skopos/**` as generated surfaces that must be regenerated rather than hand-edited.
- `2026-04-09`: Updated the artifact model to name the first implemented generated retrieval surfaces: `.skopos/bootstrap.json` and `.skopos/scopes-lite.json`.
- `2026-04-09`: Added the initial artifact model so config, generated state, docs, and trust surfaces have clear ownership.

## Artifact Classes

1. root config:
   - `skopos.config.yaml`
2. local override:
   - `skopos.local.yaml`
3. project-authored workflow manifests:
   - `tools/skopos/workflows/*.yaml`
4. authored intelligence pack sources:
   - `policy-packs/**`
   - `stack-packs/**`
   - `gate-packs/**`
   - `workflow-packs/**`
5. generated machine-readable state:

- `.skopos/bootstrap.json`
- `.skopos/scopes-lite.json`
- `.skopos/diagnosis.json`
- `.skopos/architecture.json`
- `.skopos/enforcement.json`
- `.skopos/index.json`
- `.skopos/log.jsonl`
- `.skopos/overrides.json`
- `.skopos/proof/latest-report.json`
- `.skopos/questions.json`
- `.skopos/recommendations.json`
- `.skopos/program/state.json`
- `.skopos/agent/trust-brief.json`
- `.skopos/agent/done-brief.json`
- `.skopos/agent/program-brief.json`
- `.skopos/agent/prompt-brief.json`
- `.skopos/agent/token-telemetry.json`
- `.skopos/agent/missions/*.json`
- `.skopos/agent/evals/*.json`
- `.skopos/plans/*.json`
- `.skopos/missions/*.json`
- `.skopos/runs/*.json`
- `.skopos/evals/*.json`
- `.skopos/discussions/index.json`
- `.skopos/discussions/checkpoints/*.json`
- `.skopos/discussions/handoffs/*.json`
- `.skopos/discussions/raw/*.jsonl`
- `.skopos/graph/workspace.json`
- `.skopos/graph/docs.json`
- `.skopos/graph/commands.json`
- `.skopos/graph/scope-relations.json`
- `.skopos/graph/impact.json`
- `.skopos/graph/<mission-id>.json`
- future `.skopos/**` artifacts

6. generated tool-native adapters:
   - `.skopos/tooling/claude-code/settings.json`
   - `.skopos/tooling/claude-code/hooks/*.mjs`
7. human-authored docs:
   - `docs/**`
8. generated human-readable views:
   - `docs/generated/**`
   - `docs/generated/skopos/index.html`
   - `docs/generated/skopos/graph-portal.html`
9. instruction mirrors:
   - `CLAUDE.md`, Cursor rules, Copilot instructions

## Core Rules

1. generated artifacts must include version and freshness metadata
2. derived generated artifacts must not be hand-edited
3. active docs must link back to their generated or machine-readable complements when applicable
4. graph artifacts must be typed, filtered, and status-aware rather than generic whole-repo diagrams
5. artifact policy must distinguish durable shared truth from ephemeral runtime state
6. the artifact family should reduce repeated reasoning, not create a giant verbose wiki
7. subtree-targeted compiled slices must declare their focus explicitly so humans and agents can distinguish partial and full-workspace state
8. bootstrap-class artifacts should carry compact source-dependency probes so hot-path commands can invalidate compiled state without broad rescans
9. mutable durable shared-truth artifacts should carry actor attribution when more than one actor can legitimately update them
10. discussion-memory artifacts must compile chat into compact working memory instead of turning raw transcripts into the default retrieval or prompt-reload surface
11. program-control artifacts should compile accepted work, sequencing, and obligations into one low-noise shared surface instead of fragmenting that state across multiple manual planning documents by default
12. agent-facing brief artifacts should project canonical truth into compact token-budgeted summaries instead of becoming a second manually authored source of truth
13. authored intelligence pack sources are product source truth and should be reviewed like docs plus schema-backed configuration, not edited through generated-state commands

## Workflow Artifact Rule

1. `.skopos/bootstrap.json`, `.skopos/scopes-lite.json`, `.skopos/diagnosis.json`, `.skopos/architecture.json`, and similar derived state should be regenerated rather than hand-edited
   - `scan` should refresh `.skopos/diagnosis.json` so the current brownfield diagnosis is durable, not only returned to the caller
2. `.skopos/overrides.json` is a durable runtime-managed shared-truth artifact and may change through `skopos overrides` commands
   - override entries should carry last-updating actor attribution
   - takeover of an existing override key should require explicit force-transfer
3. `.skopos/plans/*.json` and `.skopos/missions/*.json` are runtime-managed workflow artifacts and may change through Skopos commands as execution progresses
   - plan artifacts may carry initial creator attribution when `skopos plan` is run with `--actor`
   - plan artifacts may also carry parent plan and parent mission ids when they are created as linked child slices
   - missions now also carry actor-coordination metadata for claim, release, slice, and completion ownership
   - missions may carry linked child slice metadata so wide proof batches can decompose durably
4. project workflow manifests are repo-authored sources and should be reviewed like normal code
5. built-in pack sources under `policy-packs/**`, `stack-packs/**`, `gate-packs/**`, and `workflow-packs/**` are authored product intelligence sources; generated resolved policy, recommendations, drift, and agent briefs should point back to them rather than duplicating their content
6. workflow run evidence under `.skopos/runs/*.json` is runtime-managed workflow state and should be written by Skopos, not hand-edited
   - mutating workflow runs should carry actor attribution when the evidence is meant to support trust or closure
7. unresolved workflow questions under `.skopos/questions.json` are runtime-managed decision state and should be rewritten by Skopos rather than hand-edited
   - questions should carry actor attribution and linked mission or plan ids when available
8. bounded next-action guidance under `.skopos/recommendations.json` is runtime-managed recommendation state and should be regenerated by Skopos rather than hand-edited
9. eval outputs under `.skopos/evals/*.json` are runtime-managed quality and proof artifacts and should be regenerated rather than edited directly
10. graph artifacts under `.skopos/graph/*.json` are runtime-managed relationship projections and should be rewritten by Skopos rather than edited directly
11. tool-native adapter outputs under `.skopos/tooling/**` are generated enforcement surfaces and should be regenerated from Skopos rather than hand-edited
12. proof report artifacts under `.skopos/proof/*.json` are runtime-managed evaluation outputs and should be rewritten by the proof harness rather than edited directly
13. program state under `.skopos/program/state.json` is runtime-managed shared execution-planning state and should be regenerated by Skopos rather than hand-edited
14. discussion checkpoints and handoffs under `.skopos/discussions/**` are runtime-managed local memory artifacts and should be rewritten by Skopos rather than hand-edited
15. raw turn journals under `.skopos/discussions/raw/*.jsonl` are append-only local runtime state and should not be treated as canonical shared truth
16. compact agent briefs under `.skopos/agent/**` should be runtime-managed derived projections and should be regenerated from canonical state rather than hand-edited

## Commit Policy Rule

1. commit durable shared truth under `.skopos/**` by default:
   - bootstrap
   - scopes-lite
   - diagnosis
   - architecture
   - enforcement
   - index
   - program state
   - overrides
   - plans
   - unresolved questions, because open decision state is shared execution memory rather than disposable chat context
2. keep ephemeral runtime state local-only by default:
   - runs
   - log
   - proof reports, because the latest scorecard and baseline comparison are reproducible runtime evaluation state
   - recommendations, because they are derived next-action guidance and should be reproducible from current workflow state
   - eval outputs, because they are runtime proof surfaces similar to run evidence and proof snapshots
   - discussion raw journals, checkpoints, and handoffs, because they are local continuity state rather than shared project truth
   - compact agent briefs under `.skopos/agent/**`, because they are reproducible transport projections rather than durable project truth
   - impact and mission graph state
   - missions, because actor-claim churn is runtime-specific even after the first multi-actor model exists

## Index And Log Rule

1. the content index should be content-oriented and point agents toward compact relevant knowledge first
2. the operational log should be append-oriented and record ingests, runs, lint passes, plans, trust checks, and canonical override updates
   - scan log entries should carry actor attribution when available
   - init, trust, and impact log entries should carry actor attribution when available
   - override log entries should include actor attribution and whether a transfer was forced
   - instruction-sync log entries should record mirror maintenance activity and actor attribution when available
   - mission-slice log entries should record parent-child mission linkage and narrowed scope during batch decomposition
3. both surfaces should stay compact enough for direct agent use without requiring heavy retrieval infrastructure
