# Decision: Compiled Reference Layer And Agent Memory Baseline

## Metadata

- Doc ID: `SKOPOS-DECISION-019`
- Status: `accepted`
- Date: `2026-04-11`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Related Docs:
  - `../project/vision.md`
  - `../project/overview.md`
  - `../architecture/retrieval-and-query-strategy.md`
  - `../architecture/trust-and-closure-model.md`
  - `../architecture/artifact-model.md`
  - `018-self-hosting-workflow-contract.md`

## Context

Skopos already compiles bootstrap, scopes, diagnosis, architecture, graph, plan, mission, workflow-run, proof, and search artifacts. That is enough to make the product usable, but it is not yet enough to make frontier coding agents highly effective inside large or long-lived repos.

The biggest remaining gap is deeper compiled operating memory:

1. symbol and export reference
2. duplicate and ambiguity reference
3. contradiction reference

Without those surfaces, agents still rely too much on broad repo scans or ad hoc inference for important tasks such as exact symbol lookup, duplicate detection, conflict resolution, and higher-quality recommendations.

## Decision

Adopt a first-class compiled reference layer under `.skopos/` as the next agent-memory baseline.

The first artifact family should include:

1. `symbols`
2. `duplicates`
3. `contradictions`

These artifacts should become reusable inputs for:

1. query/context assembly
2. search
3. trust and diagnosis interpretation
4. later recommendation and decision-prompt surfaces
5. human UI artifact/detail routes

## Artifact Contract

The initial compiled reference layer should produce durable machine-readable artifacts for:

1. exported symbol inventory by package and source file
2. duplicate doc ids and other low-noise duplicate ownership conflicts
3. contradiction references derived from diagnosis conflicts and architecture divergence

These artifacts should be:

1. generated
2. versioned
3. exact-first
4. compact enough for direct agent use
5. designed as evidence inputs, not chat summaries

## Retrieval Contract

The reference layer must strengthen the existing retrieval doctrine rather than replace it.

That means:

1. exact id and exact symbol resolution first
2. canonical and active surfaces first
3. raw repo scanning only when compiled reference is missing or stale
4. semantic fallback later, not as the primary path

## UI Contract

These artifacts should be visible in the UI, but not as raw dumps by default.

The intended presentation is:

1. search and command dock use them for exact resolution
2. docs/artifact routes expose structured artifact pages
3. trust and diagnosis surfaces use them for targeted warnings
4. later dedicated routes may expose duplicates, contradictions, traces, and pattern findings

## Workflow Contract

This is a structural product change, not a small implementation detail.

For new durable artifact families like this one:

1. write the decision doc before broad code edits
2. create the Skopos plan and claim the mission
3. keep docs, findings, and runtime state aligned during implementation

Do not rely on mission artifacts alone for a new artifact-family design decision.

## Consequences

### Positive

1. Skopos gains stronger durable memory for both humans and coding agents.
2. Query, search, and trust can reuse the same evidence surfaces.
3. Recommendation and question systems can be grounded in compiled facts instead of heuristics alone.

### Costs

1. artifact generation complexity increases
2. runtime and UI integration need another structured rollout
3. duplicate and contradiction scopes must stay low-noise to remain credible

## Next Action

Implement the first slice in this order:

1. contracts for `symbols`, `duplicates`, and `contradictions`
2. generator baseline in the indexing/runtime flow
3. query/context and knowledge-index integration
4. later UI and recommendation surfaces on top of those artifacts
