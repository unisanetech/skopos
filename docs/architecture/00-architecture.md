---
title: Skopos Architecture
status: active
owner: skopos-core
id: SKOPOS-ARCH-BASELINE
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-09
relatedDocs:
  - package-boundaries.md
  - runtime-model.md
  - config-model.md
  - artifact-model.md
  - agent-native-operating-model.md
  - docs-governance.md
  - evidence-and-readiness-model.md
  - policy-applicability-and-fixture-governance.md
  - public-package-content-and-provenance.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: when owning truth changes
---

# Skopos Architecture

Skopos is a project-agnostic, repo-native operating Memory layer used by coding agents.
It does not replace the agent: the agent reasons and edits; Skopos preserves project
truth, Task continuity, deterministic constraints, coordination, and proof.

## Changelog

- `2026-08-09`: Declared separate repository-source and npm-tarball release
  boundaries, exact public Skill runtime assets, private workspace tooling ownership,
  and the requirement for explicit compatible provenance before copied UI source can
  be publicly released.
- `2026-08-09`: Routed repository-family detection, evidence-based policy
  applicability, portable architecture roles, and active fixture governance to the
  canonical applicability model.
- `2026-08-02`: Made tracked Task projection Scope-relative and made reconstruction
  discover Tasks through the catalog of declared Memory roots.
- `2026-07-31`: Made Task persistence concurrency-safe through coordination-backed
  mutation transactions and added admission-time durable Memory obligations with
  explicit reviewed resolution before closure.
- `2026-07-31`: Added the atomic `finish` lifecycle, compact-default agent transport,
  and precise Action source-fingerprint exclusions.
- `2026-07-30`: Made project capability onboarding a reviewed integration: discovery
  produces local candidates, explicit digest-bound approval precedes tracked
  Action/Guard writes, and activation validates providers.
- `2026-07-29`: Promoted the clean first-release architecture built around Project
  Memory, Task, Action, Guard, Evidence, Work Queue, and Readiness.

## Package Layers

1. `model`: public schemas and contracts
2. `config`: configuration loading and validation
3. `indexer`: repository discovery and compiled project indexes
4. `query`: scoped retrieval over compiled and source truth
5. `planner`: optional durable Plans and Task recommendations
6. `docs-engine`: document catalog, metadata, adoption intake, and restructuring contract
7. `instructions`: host-neutral agent instructions and host adapters
8. `verification`: change scope, Evidence, verification, Readiness, and provenance
9. `runtime`: application use cases and orchestration
10. `cli` and `mcp`: public tool surfaces
11. `ui`: an internal projection over the same canonical model

Dependencies point inward. Tool surfaces do not own domain behavior, and runtime does
not duplicate package logic.

## Canonical Operating Loop

```text
adopt Project Memory
  -> open Session
  -> start or resume Task
  -> retrieve Scope context
  -> claim resources
  -> edit and run Actions
  -> record Evidence
  -> finish (Verify + Readiness + archive)
  -> close or hand off
```

Plan is optional durable direction across Tasks. Work Queue is compiled from tracked
Tasks, Plans, Findings, material questions, dependencies, and Readiness blockers.

## Project Memory

Tracked sources own durable truth:

1. root instructions and configuration
2. canonical and supporting documents
3. Scope registry and Scope Memory
4. Decisions, Findings, and Patterns
5. Plans and tracked Tasks
6. Action, Guard, Policy, and Skill declarations

`.skopos/**` contains only rebuildable indexes, caches, Session and coordination state,
Evidence envelopes, and UI assets. A clean clone can reconstruct Project Memory and
tracked Task projections without old local state.

Each non-light Task projects to `work/tasks/**` inside its declared Scope Memory root.
Workspace Tasks use the workspace root; child Scopes use their own registered roots.
Reconstruction discovers those portable projections through the Project Memory
catalog across all declared roots, so no project layout or domain convention is built
into Task persistence.

During pre-adoption intake, only the inferred default workspace Scope may use the
standard `docs/` Memory root before a registry exists. Once a Scope is declared, a
missing or unsafe `memoryRoot` is an invalid authority declaration and fails closed.

Task admission creates an open Memory obligation when declared ownership overlaps
existing canonical durable Memory. High-impact Tasks receive a Scope-level durable
Memory review obligation even when no Memory document is explicitly owned. Skopos
points at existing truth and blocks closure until the agent records either
`memory-updated` or `reviewed-no-change`; it never creates a duplicate Architecture,
Standard, Guide, Decision, Finding, or Pattern automatically.

## Extension Boundary

Projects contribute:

1. Scopes and Profiles
2. canonical Memory
3. Actions with explicit effects and concurrency
4. deterministic Guards
5. Policies and task-selective Skills

They do not create another Task, execution, or closure authority. Ordinary user and
system workflows remain valid domain concepts; they are not Skopos primitives.

## Coordination

The local SQLite broker serializes cooperating Session, Task, claim, mutation,
contamination, takeover, and snapshot operations. A Task mutation holds one broker
write transaction across the complete authoritative read, state transition, local
projection write, and tracked portable-document replacement. Same-process callers
queue by Task before entering SQLite, while separate processes serialize through WAL
transactions. Collision-resistant temporary files make replacement cleanup safe, but
the broker transaction—not temporary naming—is what prevents lost updates.

Enforcement is reported honestly:

1. `observed`
2. `cooperative`
3. `hooked`
4. `mediated`

Only hooked or mediated environments may claim preventive safety. The current host
baseline is cooperative and therefore reports `preventiveSafety: false`.

## Core Invariants

1. one public vocabulary and one owner for every authority
2. no prototype aliases, dual readers, or old-state migrations
3. no durable truth only under `.skopos/**`
4. no permanent brownfield mapping as the adopted end state
5. no broad command guessing; executable capabilities are declared Actions
6. no Action self-selects global closure requirements; Guards and Task acceptance do
7. no completion claim without fresh acceptance-linked Evidence
8. no adopter-specific architecture in Skopos core
9. generated artifacts never masquerade as hand-authored truth
10. retrieval is Scope- and Task-selective, not a broad documentation dump
11. detected commands remain proposals until reviewed approval creates tracked
    declarations and provider validation activates them
