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
lastUpdated: 2026-07-29
relatedDocs:
  - 00-architecture.md
  - docs-governance.md
  - ../standards/terminology.md
reviewCycle: when persistence or artifact ownership changes
---

# Skopos Artifact Model

Skopos distinguishes tracked project truth from rebuildable local projections.

## Changelog

- `2026-07-29`: Established tracked Plan and Task authority, portable Task
  reconstruction, and a disposable `.skopos/**` runtime tree.

## Tracked Sources

Tracked sources include:

1. `AGENTS.md`, `skopos.config.*`, and `tools/skopos/**`
2. canonical and supporting Project Memory under `docs/**`
3. Decisions, Findings, Patterns, and Plans
4. standard and high-impact Tasks under `docs/work/tasks/**`
5. optional immutable Task snapshots under `docs/work/tasks/snapshots/**`

Tracked Task Markdown contains a human-readable contract plus a machine-readable
portable state block. The block preserves Task intent, acceptance, risk, steps,
questions, recommendations, Actions, Guards, Evidence requirements, and Memory
obligations. Machine-local workspace identity and live coordination claims are not
portable.

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
