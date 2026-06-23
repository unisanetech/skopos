# Scope: runtime

The `runtime` scope owns command orchestration and top-level use case coordination.

## Metadata

- Doc ID: `SKOPOS-SCOPE-RUNTIME`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/scopes`
- Canonical: `yes`
- Last Updated: `2026-04-10`
- Review Cycle: `per workpack`
- Related Docs:
  - `../architecture/runtime-model.md`

## Changelog

- `2026-04-10`: Updated the runtime scope doc to reflect parent mission synchronization when linked child slice missions are claimed, released, or completed.
- `2026-04-10`: Updated the runtime scope to reflect linked mission slicing, parent-child mission artifact updates, parent mission graph refresh, and batch-decomposition orchestration for self-hosted proof work.
- `2026-04-10`: Updated the runtime scope to reflect that `scan` now refreshes `.skopos/diagnosis.json` while it logs and indexes diagnosis activity.
- `2026-04-10`: Updated the runtime scope to reflect actor-attributed `scan` lifecycle events with knowledge-index refresh, so diagnosis orchestration now participates in the shared operational loop.
- `2026-04-10`: Updated the runtime scope to reflect actor-attributed `init`, `trust`, and `impact` lifecycle events, so normal bootstrap and validation orchestration now records who triggered the run when known.
- `2026-04-10`: Updated the runtime scope to reflect instruction-sync logging, knowledge-index refresh, and optional actor attribution for shared mirror maintenance.
- `2026-04-10`: Updated the runtime scope to reflect actor-attributed plan creation and initial mission provenance before explicit mission claim ownership begins.
- `2026-04-10`: Updated the runtime scope to reflect actor-attributed workflow execution for mutating workflow evidence and actor propagation into closure reporting.
- `2026-04-10`: Updated the runtime scope to reflect actor-attributed override writes and silent-takeover protection for mutable shared canonical state.
- `2026-04-10`: Updated the runtime scope to reflect actor-aware closure orchestration, so `done` can verify mission ownership instead of only mission completion.
- `2026-04-10`: Updated the runtime scope to reflect mission claim, release, and actor-aware completion orchestration for the first multi-actor mission-coordination slice.
- `2026-04-09`: Updated the runtime scope to reflect declared canonical override management through `.skopos/overrides.json` and `skopos overrides`.
- `2026-04-09`: Updated the runtime scope to reflect subtree-targeted init and scan orchestration for large workspaces.
- `2026-04-09`: Updated the runtime scope to reflect that `init` now writes `.skopos/architecture.json` alongside bootstrap, scopes-lite, and diagnosis.
- `2026-04-09`: Updated the runtime scope to reflect that `init`, `plan`, `impact`, and `done` now write typed graph artifacts under `.skopos/graph/`.
- `2026-04-09`: Updated the runtime scope to reflect that `plan`, `impact`, and `done` now consume registered workflow metadata and run evidence.
- `2026-04-09`: Updated the runtime scope to reflect implemented project-workflow listing, inspection, execution, and run-artifact writes.
- `2026-04-09`: Updated the runtime scope to reflect that it now loads and completes mission artifacts and can pass mission evidence into closure checks.
- `2026-04-09`: Updated the runtime scope to reflect that `plan` now writes `.skopos/plans/` and `.skopos/missions/` artifacts.
- `2026-04-09`: Updated the runtime scope to reflect that it now orchestrates repo diagnosis through `scan` and writes `.skopos/diagnosis.json` during bootstrap.
- `2026-04-09`: Updated the runtime scope to reflect that `impact` and `done` now support git-backed changed-path collection when the CLI is called without explicit file paths.
- `2026-04-09`: Updated the runtime scope to reflect that it now orchestrates `impact` and `done`.
- `2026-04-09`: Updated the runtime scope to reflect that it now orchestrates `plan` in addition to bootstrap, retrieval, and trust flows.
- `2026-04-09`: Updated the runtime scope to reflect that it now orchestrates `trust` in addition to `init`, `resolve`, and `context`.
- `2026-04-09`: Updated the runtime scope to reflect that it now orchestrates `resolve` and `context` in addition to `init`.
- `2026-04-09`: Updated the runtime scope to reflect that the first implemented vertical slice owns `init` orchestration and bootstrap artifact writes.
- `2026-04-09`: Added the initial `runtime` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `runtime` package currently owns:

1. `init` orchestration
2. `scan` orchestration with diagnosis-artifact refresh, operational logging, index refresh, and optional actor attribution
3. `resolve` orchestration
4. `context` orchestration
5. `plan` orchestration with optional actor-attributed plan and mission provenance
6. declared override read and write orchestration with actor attribution and explicit force-transfer protection
7. mission read, claim, release, slice, and completion orchestration
8. `impact` orchestration
9. `done` orchestration
10. `trust` orchestration
11. instructions sync orchestration with operational logging, index refresh, and optional actor attribution
12. config write decisions
13. bootstrap, scope-lite, diagnosis, architecture, override, plan, and mission artifact generation
14. registered workflow discovery, inspection, and execution orchestration
15. workflow-aware planning, impact, and closure orchestration
16. workflow run artifact writes under `.skopos/runs/` with actor attribution for mutating runs
17. graph artifact writes under `.skopos/graph/`
18. recommended next-step assembly
19. subtree-targeted bootstrap and scan orchestration for large workspaces
20. mission-level actor coordination and silent-takeover protection for mutable mission state
21. linked child mission creation, parent mission decision resolution, and parent mission graph refresh during batch decomposition
22. durable override ownership tracking for mutable shared canonical state
23. initial plan and mission provenance attribution when the planner actor is known
24. optional actor attribution for init, scan, trust, and impact lifecycle events in the shared operational log
