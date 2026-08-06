---
title: Skopos Artifact Model
status: active
owner: skopos-core
id: SKOPOS-ARTIFACT-MODEL
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-05
relatedDocs:
  - 00-architecture.md
  - docs-governance.md
  - ../standards/terminology.md
  - ../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md
reviewCycle: when persistence or artifact ownership changes
---

# Skopos Artifact Model

Skopos distinguishes tracked project truth from rebuildable local projections.

## Changelog

- `2026-08-05`: Clarified that the exact Task handoff may contain one bounded,
  agent-authored conversation capsule plus compiled freshness identities. It remains a
  disposable generated projection; portable recovery continues to rely on the tracked
  Task and optional immutable snapshot.
- `2026-08-02`: Made tracked Task projection and clean reconstruction relative to
  each Task's declared Scope Memory root.
- `2026-07-31`: Defined inferred Memory obligations, their explicit resolution
  evidence, and transactionally serialized Task projection replacement.
- `2026-07-29`: Established tracked Plan and Task authority, portable Task
  reconstruction, and a disposable `.skopos/**` runtime tree.

## Tracked Sources

Tracked sources include:

1. `AGENTS.md`, `skopos.config.*`, and `tools/skopos/**`
2. canonical and supporting Project Memory under `docs/**`
3. Decisions, Findings, Patterns, and Plans
4. standard and high-impact Tasks under `<scope-memory-root>/work/tasks/**`
5. optional immutable Task snapshots under
   `<scope-memory-root>/work/tasks/snapshots/**`

Tracked Task Markdown contains a human-readable contract plus a machine-readable
portable state block. The block preserves Task intent, acceptance, risk, steps,
questions, recommendations, Actions, Guards, Evidence requirements, and Memory
obligations. Machine-local workspace identity and live coordination claims are not
portable.

A tracked Task is projected into the Memory root owned by its declared Scope. A
workspace-scoped Task therefore uses the workspace Memory root naturally, while a
package, product, service, or other child Scope uses its own registered root. Clean
reconstruction catalogs active Task projections across every declared Memory root;
it does not assume that Project Memory is centralized under `docs/`.

The pre-adoption exception is limited to the inferred default workspace Scope, which
uses the standard `docs/` root until a registry is activated. Declared Scopes never
receive an inferred replacement for a missing or unsafe Memory root.

Each Memory obligation records a durable role, reason, status, and optional existing
target path. Completion records one explicit resolution:

1. `memory-updated`, with the adopted canonical durable Memory target
2. `reviewed-no-change`, with the agent's reason that current truth remains sufficient

The tracked Task renders open obligations before its portable state. The same
resolution fields remain portable so reconstruction cannot erase closure blockers.
Skopos does not infer a requirement to create a new document when an existing
canonical target already owns the truth.

## Local Runtime Tree

```text
.skopos/
├── adoption/
├── cache/
├── evidence/
├── graph/
├── handoffs/<worktree-id>/<task-id>/
├── index/
├── runs/
├── tasks/<worktree-id>/<task-id>/
├── ui/
└── coordination.sqlite
```

Rules:

1. the directory is ignored and disposable
2. local artifacts use `authority: generated`
3. no accepted Decision, Plan, Policy, Pattern, or tracked Task exists only here
4. a clean clone reconstructs indexes and local Task projections from tracked sources
5. uncommitted file contents require a pushed snapshot or explicit handoff
6. Task-local questions and recommendations are projections of Task-owned portable
   state, not separate durable authorities
7. Task authority and its tracked portable projection are replaced inside one
   coordination-backed mutation transaction; collision-resistant temporary files are
   implementation detail, not concurrency authority
8. a Task handoff combines compiled Task/Memory state with a bounded agent-authored
   conversation capsule; each field records provenance and the complete artifact is
   subject to redaction, token budget, and freshness validation
9. raw discussion journals, host transcript locations, host thread ids, delivery
   outcomes, and handoff artifacts remain local generated state
10. clean reconstruction must recover durable project and Task truth without any local
    conversation capsule; cross-machine continuation may use an explicitly pushed
    immutable Task snapshot but never an ambient host transcript

## Artifact Envelope

Machine artifacts declare:

1. schema version and stable id
2. type, status, authority, and timestamps
3. workspace and Task identity when relevant
4. provenance and source digests
5. explicit relationships and applicability

Consumers fail closed on incompatible schemas. Pre-release local state is rebuilt;
there are no prototype migrations or fallback readers.

## Generated Reference

Human-facing generated reference may be tracked under
`docs/reference/generated/**` when it has durable review value. Runtime indexes, UI
assets, logs, coordination data, and Evidence envelopes remain local.

## Plans And Work Queue

Plans are tracked Markdown under `docs/work/plans/**`. The Work Queue is a generated
projection under `.skopos/index/work-queue.json`; it is never manually edited and never
becomes a second Task authority.
