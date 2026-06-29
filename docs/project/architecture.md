# Skopos Project Architecture

Skopos is a TypeScript monorepo that compiles project signals into agent-usable memory, workflow state, and trust reports.

## Metadata

- Doc ID: `SKOPOS-PROJECT-ARCHITECTURE`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-06-29`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `vision.md`
  - `../architecture/00-architecture.md`
  - `../decisions/035-agent-guided-project-understanding-contract.md`

## Changelog

- `2026-06-29`: Added the project-level architecture map so agent-guided understanding has durable human-readable memory instead of relying only on generated scanner artifacts.

## Runtime Shape

Skopos is organized as packages with clear responsibilities:

1. `@skopos/model` owns shared artifact contracts and TypeScript types.
2. `@skopos/indexer` scans repo signals and builds bootstrap, scope, docs, command, graph, policy-pack, and reference artifacts.
3. `@skopos/config` loads, reconciles, and writes root configuration.
4. `@skopos/instructions` scaffolds and syncs agent instruction files and tool adapters.
5. `@skopos/runtime` orchestrates application workflows such as init, understand, setup review, mission routing, policies, UI rendering, and knowledge refresh.
6. `@skopos/trust` evaluates readiness, drift, mission coverage, memory completeness, proof, and closure risk.
7. `@skopos/planner` builds plans and validation lanes.
8. `@skopos/query` loads compact query state for CLI and runtime flows.
9. `@skopos/ui` renders the routed human console.
10. `@skopos/cli` is the thin command surface that parses arguments and formats user-facing output.

## Data Flow

The main flow is:

```text
source repo -> scan/bootstrap -> .skopos artifacts -> runtime workflows -> trust/eval/UI/CLI -> memory updates
```

Important artifact families:

1. `.skopos/bootstrap.json` and `.skopos/scopes-lite.json` describe detected setup and routeable project areas.
2. `.skopos/memory/state.json` maps durable project truth by responsibility.
3. `.skopos/understanding/*` stores compact understanding, setup review, and agent-analysis brief artifacts.
4. `.skopos/plans`, `.skopos/missions`, `.skopos/questions`, and `.skopos/recommendations` track work execution.
5. `.skopos/proof`, `.skopos/evals`, and trust reports record closure evidence.
6. `docs/generated/skopos/*` contains generated UI snapshots and must not be hand-edited.

## Boundaries

1. Model contracts should stay pure and not import runtime behavior.
2. Runtime may orchestrate packages but should not own CLI presentation details.
3. CLI should remain a thin command and output layer.
4. Trust should report readiness and risk; it should not perform broad project mutation.
5. UI should render compiled state; it should not invent workflow truth.
6. Human docs and decisions hold durable product rules; workpacks and generated artifacts hold execution state.

## Agent Rule

Before changing architecture behavior, inspect the owning package, shared model contract, runtime caller, CLI output, trust impact, UI projection, and tests together. Most Skopos features cross at least two of these layers.
