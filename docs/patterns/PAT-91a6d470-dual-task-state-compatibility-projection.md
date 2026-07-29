---
title: "Failure Pattern: Dual Task Authority Through Compatibility Projections"
status: active
owner: skopos-core
id: PAT-91a6d470
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - task-state
  - same-directory-concurrency
  - multi-agent
  - compatibility
  - workflow-routing
  - program-routing
  - session-isolation
  - handoffs
lastUpdated: 2026-07-30
relatedDocs:
  - PAT-4e27c8a1-retired-contracts-preserved-by-tests.md
  - ../architecture/agent-native-operating-model.md
  - ../architecture/artifact-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../findings/archive/F-c1e8c13d-prototype-product-contract-convergence-gap.md
reviewCycle: when Task or Session authority changes
---

# Failure Pattern: Dual Task Authority Through Compatibility Projections

## Changelog

- `2026-07-30`: Repaired the related convergence finding link after archival.
- `2026-07-28`: Recorded the canonical recovery boundary: question, recommendation,
  Program-state, and Program-brief state lives only under
  `.skopos/tasks/<worktree-id>/<task-id>/`, and the handoff lives at
  `.skopos/handoffs/<worktree-id>/<task-id>/handoff.json`; global writers,
  optional-identity readers, and fallback reads are deleted.
- `2026-07-28`: Accepted duplicate global projections beside Task-owned runtime state
  as reusable failure knowledge after Skopos closure Eval exposed the remaining
  compatibility writers and readers.
- `2026-07-28`: Extended the Pattern to broad optional-current resolvers that collapse
  missing claimant identity, ambiguity, corruption, or ownership errors into a
  project-level “no Task” view.

## Failure Shape

A system introduces Task-owned state so concurrent coding-agent Sessions can remain
isolated, but continues writing a second global artifact for compatibility. Some
consumers read the Task path while others read the global path. Both copies appear
valid, yet the global copy represents whichever Session wrote last.

Skopos instantiated this Pattern when workflow questions, recommendations, Program
state, the Program brief, and handoff had canonical Task-owned paths while runtime
services also wrote or read global `compatibility*` projections. Two agent tabs working
in the same checkout could overwrite the global copy without touching each other's
canonical Task directory.

The same dual-authority effect appears without a second file when a broad catch turns
an exact Task-resolution failure into an empty optional result. Downstream code then
publishes the Project Work Queue as though no Task existed, even though an active Task
was present but ambiguous, owned by another actor, missing its claimant, or malformed.

## Detection Signals

1. a result type exposes both an authority path and a `compatibility*` path
2. one state transition writes the same artifact to two locations
3. a loader accepts an optional Task identity and falls back to a global artifact
4. a current-Task reader selects state without a Task id
5. tests celebrate isolated authority while also expecting a last-writer-wins global
   projection
6. generated indexes or briefs link to a global “current” Task artifact
7. a current-Task adapter catches every resolver error and returns `undefined`

## Why It Fails

1. the system has two authorities for one fact
2. same-directory concurrent Sessions can observe each other's questions or next step
3. closure Evidence can be associated with the wrong Task
4. a successful compatibility read hides missing canonical Task state
5. agents cannot reason about ownership from the artifact path
6. deletion is delayed because every new consumer can choose the easier global path

## Prevention

1. give every writing Task one collision-resistant
   `.skopos/tasks/<worktree-id>/<task-id>/` directory
2. require Task identity at every Task-state load and write boundary
3. derive convenience views from explicit Task state without persisting a second
   authority
4. fail closed when Task identity or Task-owned state is missing
5. test two Sessions in the same checkout and prove neither can read or overwrite the
   other's state
6. reject compatibility fields, fallback readers, and dual writes during pre-release
   clean refactors
7. distinguish a genuine zero-Task result from identity, ownership, ambiguity, and
   corruption errors; propagate every non-empty-state failure

## Recovery

1. inventory every writer, reader, result field, index entry, UI loader, and test for
   the global path
2. choose the Task-owned artifact as the sole authority
3. delete compatibility fields and optional-identity loaders first so type errors
   reveal every consumer
4. update consumers to resolve the exact current Task identity
5. delete global artifacts and tests that assert their existence
6. rerun same-directory concurrency, workflow, Program, Trust, Eval, and closure proof
7. add focused proof that only a genuine zero-Task Session receives the Project Work
   Queue and every invalid current-Task state fails closed

## Retrieval

Retrieve this Pattern for Tasks involving multi-agent coordination, Session isolation,
workflow questions, recommendations, Program routing, Task storage, compatibility
removal, or closure Evidence. Do not inject it into unrelated feature work.
