---
title: "Scope: runtime"
status: active
owner: skopos-core
id: SKOPOS-SCOPE-RUNTIME
scope: skopos-runtime
role: overview
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - ../../architecture/runtime-model.md
reviewCycle: when owning truth changes
---

# Scope: runtime

The `runtime` scope owns application orchestration over the portable Skopos model.

## Current Responsibilities

1. project initialization, scanning, retrieval, and instruction projection
2. Plan creation and tracked Task admission
3. Work Queue and Session context assembly
4. Task-scoped questions, recommendations, decisions, and handoffs
5. Action execution and source-bound Evidence recording
6. Guard evaluation, Task verification, and Readiness projection
7. same-checkout Session leases, Task reservations, resource claims, mutation audit,
   snapshots, and explicit takeover
8. project adoption assessment, proposal, approval, verification, and activation
9. operational logging and generated knowledge refresh

The runtime coordinates these capabilities but does not create another work or closure
authority beside Task, Evidence, and Readiness.

## Changelog

- `2026-07-29`: Replaced prototype-era responsibilities with the canonical
  Plan, Task, Action, Guard, Evidence, Readiness, coordination, and adoption model.
- `2026-07-28`: Moved this overview into its canonical Scope Memory root.
