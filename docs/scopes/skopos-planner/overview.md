---
title: "Scope: planner"
status: active
owner: skopos-core
id: SKOPOS-SCOPE-PLANNER
scope: skopos-planner
role: overview
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - ../../architecture/decision-escalation-model.md
reviewCycle: when owning truth changes
---

# Scope: planner

The `planner` scope owns optional durable Plan generation. A Plan explains direction and
decomposition; it does not own execution or completion.

## Current Responsibilities

1. scope-aware Plan generation from a goal and compact project context
2. tracked Plan Markdown publication under `docs/work/plans/`
3. bounded planning questions and recommendations
4. suggested Task decomposition for work too large for one Task

Task admission, Action selection, Evidence, and Readiness belong to runtime capabilities,
not the planner.

## Changelog

- `2026-07-29`: Removed prototype work-authority responsibilities and documented the
  optional Plan-only boundary.
- `2026-07-28`: Moved this overview into its canonical Scope Memory root.
