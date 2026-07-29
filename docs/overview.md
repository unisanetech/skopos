---
title: Skopos Overview
status: active
owner: skopos-core
id: SKOPOS-PROJECT-OVERVIEW
scope: skopos
role: overview
lifecycle: durable
authority: canonical
provenance: accepted
view: target
appliesTo:
  - workspace
lastUpdated: 2026-07-28
relatedDocs:
  - domains/product/vision.md
  - domains/product/positioning.md
  - decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - work/plans/P-e7e888e6-canonical-product-convergence.md
  - architecture/00-architecture.md
reviewCycle: when the operating model changes
---

# Skopos Overview

Skopos turns a repository into a durable, agent-ready working environment.

## Changelog

- `2026-07-28`: Added first-class preferred and failure Patterns to the Memory model
  and clarified that relevant Plans, Tasks, Findings, Decisions, and other roles reach
  agent context through Scope-aware retrieval.
- `2026-07-28`: Moved the universal workspace overview to the canonical Memory root
  and declared its semantic role, lifecycle, authority, and provenance.
- `2026-07-28`: Replaced the prototype control-plane overview with the canonical
  Project, Scope, Memory, Plan, Task, Session, Work Queue, Action, Guard, Evidence, and
  Readiness model.

## Product Boundary

The coding agent:

1. reasons
2. explores
3. proposes
4. asks questions
5. edits
6. uses tools
7. recovers from failure

Skopos:

1. supplies authoritative Project and Scope Memory
2. protects Task intent
3. exposes project Actions
4. enforces Guards
5. coordinates local Sessions
6. records source-bound Evidence
7. reports Readiness
8. preserves compact continuation state

## Canonical Model

```text
Project
├── Scopes + Profiles
├── Memory
│   ├── architecture, standards, and domains
│   ├── Decisions and Findings
│   ├── preferred and failure Patterns
│   └── Plans and tracked Tasks
├── Actions + Guards + Policies
└── local runtime
    ├── Sessions + claims
    ├── Task projections + Work Queue
    ├── Evidence + handoffs
    └── indexes + cache
```

Tracked sources own durable truth. `.skopos/**` compiles disposable local state.

## How Adoption Works

### Existing Project

1. discover the project without changing human docs
2. have the coding agent analyze real source and documentation
3. separate facts, inference, assumptions, contradictions, and questions
4. propose the target Memory structure
5. show keep/move/merge/split/rewrite/archive/delete operations
6. obtain approval
7. restructure docs and instructions
8. verify the standard
9. activate full agent Readiness

Mapping an arbitrary tree is an intake mechanism. A project that declines
restructuring may use assessment output, but it is not reported as fully adopted.

### New Project

1. create the minimum workspace Memory
2. ask only material product questions
3. add Scope Memory as real areas appear
4. add Plans, Decisions, Findings, Patterns, and Policies only when durable truth exists

## How Work Operates

1. a Plan describes direction across several Tasks
2. one Task owns one executable outcome
3. a Session starts or resumes that Task
4. Skopos loads the Task, Scope chain, and targeted Memory
5. Guards select required Actions and Evidence
6. the agent implements
7. iteration uses focused feedback
8. closure verifies an immutable Task snapshot
9. Readiness explains remaining blockers
10. `done` closes only when acceptance is covered
11. durable Memory changes are promoted
12. Work Queue derives the next ready work

## Multi-Session Operation

Several agent tabs can work on the same branch and in the same directory when their
Tasks and claims do not conflict.

Skopos coordinates:

1. Session identity and heartbeat
2. file and semantic claims
3. before/after mutation digests
4. external-change contamination
5. Action output locks
6. global Git mutation
7. immutable snapshot verification
8. crash recovery and explicit takeover

Worktrees remain useful stronger isolation for broad work, but are not the normal
product assumption.

## Project-Specific Needs

Skopos core stays generic. Projects contribute:

1. namespaced Profiles
2. Scope registry entries
3. Actions
4. Guards
5. Policies
6. Skills
7. optional bounded extensions

For Unisane, its architecture checks, generators, package boundaries, and docs rules
remain Unisane project sources. Skopos only owns the generic model that selects,
coordinates, and proves them.

## Generated Output

1. human-facing checked-in reference: `docs/reference/generated/**`
2. local Skopos runtime, UI, indexes, graphs, runs, and cache: `.skopos/**`
3. no generated Skopos application under docs
4. no durable accepted truth only under `.skopos`

## Current Status

The accepted decision and convergence Plan describe target truth. The current source
still implements prototype concepts. Each implementation phase must update current
architecture docs only after the corresponding code lands.
