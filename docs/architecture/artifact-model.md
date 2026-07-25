# Artifact Model

Skopos should produce a stable, versioned local artifact family for both humans and agents.

## Metadata

- Doc ID: `SKOPOS-ARCH-ARTIFACT-MODEL`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/architecture`
- Canonical: `yes`
- Last Updated: `2026-07-25`
- Review Cycle: `per workpack`
- Related Docs:
  - `config-model.md`
  - `docs-governance.md`
  - `retrieval-and-query-strategy.md`
  - `../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`

## Changelog

- `2026-07-25`: Implemented the staged compact artifact lifecycle projection at
  `.skopos/project.json`, current task/brief projections under `.skopos/current/`, and
  source-bound receipt projections under `.skopos/receipts/`. Existing workflow
  artifacts remain authoritative until cross-project migration and recovery proof pass.

- `2026-07-25`: Recorded the host-neutral projection model inside
  `.skopos/enforcement.json`; host instruction and adapter files remain generated views
  of that existing authority.

- `2026-07-25`: Upgraded existing workflow-run artifacts with source-bound receipt
  state, exact-command execution keys, stable-output hashes, and expiring execution
  ownership; no second receipt artifact family was added.

- `2026-07-25`: Added the compact target artifact model: task/worktree-aware current
  state, source-bound proof receipts, authority-aware project knowledge, and disposable
  high-churn cache. Existing artifact families remain current compatibility surfaces
  until the P1-W11 convergence and migration proof retire overlap.

- `2026-06-24`: Added the implemented `.skopos/policies/role-mapping.json` artifact so accepted packs can persist local folder-to-role mappings for brownfield projects instead of treating different good structures as drift.
- `2026-06-24`: Added `.skopos/policies/role-mapping-decisions.json` so users can confirm, ignore, or manually set local role mappings without editing generated mapping output.
- `2026-06-24`: Added the implemented `.skopos/policies/overrides.json` artifact and `skopos policies overrides` flow for explicit accepted-policy drift exceptions.
- `2026-06-24`: Added the implemented `.skopos/drift/report.json` artifact for accepted-policy drift detection and trust posture.
- `2026-06-24`: Added the implemented accepted-policy artifact family: `.skopos/policies/recommendations.json`, `.skopos/policies/resolved.json`, `.skopos/agent/policy-brief.json`, and the bounded AGENTS.md generated policy section.
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
- `.skopos/policies/recommendations.json`
- `.skopos/policies/resolved.json`
- `.skopos/policies/role-mapping.json`
- `.skopos/policies/role-mapping-decisions.json`
- `.skopos/policies/overrides.json`
- `.skopos/drift/report.json`
- `.skopos/questions.json`
- `.skopos/recommendations.json`
- `.skopos/program/state.json`
- `.skopos/agent/policy-brief.json`
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
14. active task artifacts must be task-, branch-, and worktree-aware rather than one
    mutable workspace-global current state
15. proof receipts must bind exact action identity to relevant source, configuration,
    provider, environment, and freshness inputs
16. derived high-churn projections should live in disposable cache unless they have a
    distinct durable authority or recovery purpose
17. inferred and proposed memory cannot self-promote into declared or accepted project
    truth

## Compact Target State

P1-W11 converges the default artifact experience toward:

```text
.skopos/
├── project.json
├── index.json
├── current/
│   ├── brief.json
│   └── task.json
├── receipts/
└── cache/
```

This is a target ownership model, not permission to delete current public artifacts
without migration proof. Existing plans, missions, questions, recommendations, evals,
discussion state, graphs, and agent briefs should either:

1. compile into the compact project/task/receipt model
2. remain an explicitly justified advanced artifact with distinct lifecycle
3. move to disposable cache
4. retire after compatibility and recovery proof

The first migration stage is additive:

1. `init` generates `.skopos/project.json` as a lifecycle map, not a second project or
   workflow authority
2. `.skopos/current/task.json` and `.skopos/current/brief.json` point to the active
   task/worktree mission authority and may be regenerated at any time
3. `.skopos/receipts/<execution-key>.json` points to the authoritative
   `.skopos/runs/<run-id>.json`; it does not replace run history yet
4. existing compatibility and advanced-history paths remain readable and writable by
   their current commands
5. agent briefs, discussions, graphs, proof snapshots, recommendations, and the
   operational log are classified as disposable cache candidates, but are not moved
   until all readers use a lifecycle-aware resolver and regeneration proof passes
6. each retained or cache-candidate family carries an explicit removal condition so a
   later clean-refactor cannot convert “compact” into silent data loss

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
   - `.skopos/policies/recommendations.json` is generated assessment state and should be refreshed by `skopos policies recommend`
   - `.skopos/policies/resolved.json` is runtime-managed accepted project policy and should be updated by `skopos policies apply`, not hand-edited
   - `.skopos/policies/role-mapping.json` is generated local role-mapping state and should be refreshed by `skopos policies apply`; it records which local paths satisfy accepted pack roles
   - `.skopos/policies/role-mapping-decisions.json` is runtime-managed local role-mapping decision state and should be updated by `skopos policies mappings`, not hand-edited
   - `.skopos/policies/overrides.json` is runtime-managed local policy exception state and should be updated by `skopos policies overrides`, not hand-edited
   - policy overrides must carry a reason and may carry owner, expiry, rule, pack, source path, or finding matchers; they suppress or downgrade matching drift findings but do not change pack source truth
   - `.skopos/drift/report.json` is generated accepted-policy drift state and should be refreshed by `skopos policies drift`
   - `.skopos/agent/policy-brief.json` is a compact prompt-layer projection of resolved policy and should not become a second source of truth
   - the bounded Skopos policy section in `AGENTS.md` is generated from resolved policy so host agents can load current policy without opening full pack docs
6. workflow run evidence under `.skopos/runs/*.json` is runtime-managed workflow state and should be written by Skopos, not hand-edited
   - mutating workflow runs should carry actor attribution when the evidence is meant to support trust or closure
   - new executions first persist `running` ownership, then finalize the same artifact
     as `succeeded` or `failed`
   - source-bound receipts hash the exact action/command, declared input state,
     workflow/config sources, non-secret environment identity, and stable outputs
   - legacy run artifacts remain readable, but only a valid source-bound receipt can be
     reused to skip an exact duplicate execution
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
