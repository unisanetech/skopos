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
lastUpdated: 2026-07-30
relatedDocs:
  - package-boundaries.md
  - runtime-model.md
  - config-model.md
  - artifact-model.md
  - agent-native-operating-model.md
  - docs-governance.md
  - evidence-and-readiness-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: when owning truth changes
---

# Skopos Architecture

Skopos is a project-agnostic, repo-native operating Memory layer used by coding agents.
It does not replace the agent: the agent reasons and edits; Skopos preserves project
truth, Task continuity, deterministic constraints, coordination, and proof.

## Changelog

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
contamination, takeover, and snapshot operations. Enforcement is reported honestly:

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
