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
lastUpdated: 2026-08-13
relatedDocs:
  - domains/product/vision.md
  - domains/product/positioning.md
  - decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - decisions/D-20260812-intelligent-project-onboarding-contract.md
  - decisions/D-20260813-company-ownership-and-first-release-host-support-boundary.md
  - work/plans/P-e7e888e6-canonical-product-convergence.md
  - architecture/00-architecture.md
reviewCycle: when the operating model changes
---

# Skopos Overview

Skopos turns a repository into a durable, coherent working environment for coding
agents.

## Changelog

- `2026-08-13`: Added the first-release host-support boundary and company-owned
  repository identity. Codex is certified; other host projections remain unverified.
- `2026-08-12`: Replaced the target onboarding story with one intelligent setup
  conversation that covers project understanding, Scopes, Memory, capabilities,
  Policies, Skills, agent instructions, and verified delivery.
- `2026-08-06`: Reconciled the current-status statement with the implemented canonical
  CLI and runtime. Skopos remains pre-release while the active convergence Plan,
  Skill-efficacy Finding, and release proof are open.
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

## How Setup Works

The developer runs `skopos setup .` or asks a supported coding agent to set up Skopos.
The visible journey is:

```text
Understand -> Clarify -> Review -> Apply -> Verify
```

The coding agent inspects real source, tests, configuration, CI, docs, instructions,
and permitted history. It separates facts, inferences, user-confirmed intent,
contradictions, and unknowns, then explains what it understands in plain language.

One consolidated plan covers:

1. meaningful project Scopes and ownership
2. existing Memory restructuring and missing Memory created from Evidence
3. project commands proposed as Actions selected by Guards
4. proportional Policy recommendations
5. relevant Skills with generated project bindings
6. coding-agent instructions, adapters, and delivery verification

The user may accept, edit, defer, or reject each optional recommendation. The agent
asks only when the answer changes project truth, architecture, ownership, authority,
security, public behavior, or information retention. After approval it applies only
the revised envelope and verifies readiness by lane.

New projects receive the minimum useful Memory and grow new roles only when durable
truth exists. Existing projects may begin with no docs or a chaotic tree;
`create-from-evidence` and reviewed restructuring converge both cases without treating
scanner inference as accepted truth.

Setup is a workflow over the existing canonical owners, not a new durable entity. See
[Intelligent Project Onboarding](architecture/intelligent-project-onboarding.md).

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

## Host Support

Skopos keeps one host-neutral Project, Task, Evidence, and Readiness model. Host
support is nevertheless capability-specific: a generated projection or manual prompt
does not prove delivery by the real host.

The first public release certifies Codex. Claude Code, Cursor, and GitHub Copilot
projections are available for development and verification, but remain explicitly
unverified and are not support claims. A host joins the supported matrix only after
current real-host Evidence proves the exact lifecycle and delivery capabilities named
in public copy.

## Project-Specific Needs

Skopos core stays generic. Projects contribute:

1. namespaced Profiles
2. Scope registry entries
3. Actions
4. Guards
5. Policies
6. Skills
7. optional bounded extensions

For any adopter, architecture checks, generators, package boundaries, and documentation
rules remain that project's sources. Skopos only owns the generic model that selects,
coordinates, and proves them.

## Generated Output

1. human-facing checked-in reference: `docs/reference/generated/**`
2. local Skopos runtime, UI, indexes, graphs, runs, and cache: `.skopos/**`
3. no generated Skopos application under docs
4. no durable accepted truth only under `.skopos`

## Current Status

The current source implements the canonical Project Memory, Scope, Plan, Task, Session,
Work Queue, Action, Guard, Evidence, Readiness, coordination, adoption, Skill, handoff,
CLI, MCP, and UI model without a prototype compatibility surface. Skopos remains
pre-release while the convergence Plan is active and the complete clean-clone and
packed-install release gate has not been certified from one committed candidate. Its
canonical repository identity is `https://github.com/unisanetech/skopos`; the ownership
cutover changes governance and release provenance, not the standalone product boundary.
