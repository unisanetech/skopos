---
title: Skopos Start Here
status: active
owner: skopos-core
id: SKOPOS-START-HERE
scope: skopos
role: router
lifecycle: active
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-09
relatedDocs:
  - decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - work/plans/P-e7e888e6-canonical-product-convergence.md
  - domains/product/vision.md
  - overview.md
  - domains/product/positioning.md
  - architecture/00-architecture.md
  - architecture/policy-applicability-and-fixture-governance.md
  - architecture/storage-lifecycle-and-privacy.md
  - guides/storage-and-privacy.md
  - guides/semantic-guards.md
  - work/archive/P-067e15c4-proof-and-benchmarking.md
  - findings/archive/F-c1e8c13d-prototype-product-contract-convergence-gap.md
reviewCycle: when authority or routing changes
---

# Skopos Start Here

This is the compact documentation router for humans and coding agents working on
Skopos.

## Changelog

- `2026-08-09`: Added the progressive Task workflow and semantic Guard template guide
  to the developer and verification routes.
- `2026-08-09`: Added the local storage lifecycle, cleanup safety, and privacy guide.
- `2026-08-09`: Added the canonical policy applicability, architecture-pack
  portability, and active fixture-governance route.
- `2026-07-30`: Repaired the convergence finding link after its lifecycle move to the
  findings archive.
- `2026-07-28`: Rebuilt the router around the canonical Project Memory families,
  removed archived prototype plans from the normal reading path, and added direct
  routes for standards, guides, operations, patterns, findings, and Scope Memory.
- `2026-07-28`: Replaced the historical long-form read list with a compact authority
  router. The clean pre-release decision and convergence Plan now own target truth;
  superseded prototype decisions are excluded from the default path.
- `2026-07-29`: Promoted the canonical implementation surface and removed prototype
  operating instructions from the default reading path.

## Authority

Read target truth in this order:

1. [Canonical product decision](decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md)
2. [Overview](overview.md)
3. [Vision](domains/product/vision.md)
4. [Glossary](standards/terminology.md)
5. [Canonical product convergence Plan](work/plans/P-e7e888e6-canonical-product-convergence.md)
6. [Architecture baseline](architecture/00-architecture.md)

The decision owns what the first released product is. The Plan owns how the current
prototype becomes that product.

## Implementation Boundary

The first-release model is Project, Scope, Profile, Memory, Plan, Task, Session, Work
Queue, Action, Guard, Evidence, Proof, and Readiness. Archived prototype records may
explain history but never define current behavior.

## Read By Need

### Product

1. [Overview](overview.md)
2. [Vision](domains/product/vision.md)
3. [Positioning](domains/product/positioning.md)
4. [Product implementation map](domains/product/implementation-map.md)
5. [Package map](domains/engineering/package-map.md)

### Standards And Reusable Knowledge

1. [Terminology](standards/terminology.md)
2. [Validation standard](standards/validation.md)
3. [Pattern catalog](patterns/README.md)
4. [Target standard without self-adoption](patterns/PAT-0c339ca4-target-standard-without-self-adoption.md)

### Current Architecture

1. [Architecture baseline](architecture/00-architecture.md)
2. [Runtime model](architecture/runtime-model.md)
3. [Agent-native operating model](architecture/agent-native-operating-model.md)
4. [Config model](architecture/config-model.md)
5. [Artifact model](architecture/artifact-model.md)
6. [Docs governance](architecture/docs-governance.md)
7. [Retrieval strategy](architecture/retrieval-and-query-strategy.md)
8. [Evidence and Readiness model](architecture/evidence-and-readiness-model.md)
9. [Action extension model](architecture/action-extension-model.md)
10. [Policy applicability and fixture governance](architecture/policy-applicability-and-fixture-governance.md)
11. [Storage lifecycle and privacy](architecture/storage-lifecycle-and-privacy.md)

### Work

1. current tracked Task selected by Skopos
2. [Canonical convergence Plan](work/plans/P-e7e888e6-canonical-product-convergence.md)
3. [Historical proof and benchmarking Plan](work/archive/P-067e15c4-proof-and-benchmarking.md)
4. [Findings family contract](findings/README.md)

Archived Plans, Tasks, Decisions, and Findings are history. Do not load them unless a
current artifact explicitly requires their rationale.

### Development And Operations

1. [Developer workflows](guides/developer-workflows.md)
2. [Bootstrap a project](guides/bootstrap-a-project.md)
3. [Local development](operations/local-development.md)
4. [Manage local storage and privacy](guides/storage-and-privacy.md)
5. [Configure semantic Guard templates](guides/semantic-guards.md)
6. package-specific source and tests selected by the active Task

### Scope Memory

Use the Scope selected by the current Task. Scope Memory lives under
`scopes/<stable-scope-id>/`; the declared Scope registry in
`../tools/skopos/scopes.yaml` owns stable IDs, code roots, Memory roots, and
dependencies. Do not scan every Scope by default.

## Retrieval Rules

1. start with the current Task and its declared Scope
2. load the smallest canonical Memory set that answers the Task
3. load active Plans only when they own the Task's direction or sequencing
4. load relevant patterns before repeating a known failure
5. exclude archive and generated reference material by default
6. use history only when current truth or rationale is insufficient
7. prefer compact deltas after the first context load
8. never treat generated `.skopos/**` state as durable project truth

## Command Discovery

For commands, check:

1. `AGENTS.md`
2. `skopos --help`
3. subcommand help
4. `guides/developer-workflows.md`

Source search is a fallback.
