---
title: "Decision: Discussion Memory, Checkpoints, And Handoff Contract"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-021
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-04-12
lastUpdated: 2026-07-29
relatedDocs:
  - ../architecture/agent-native-operating-model.md
  - ../architecture/artifact-model.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
---

# Decision: Discussion Memory, Checkpoints, And Handoff Contract

## Changelog

- `2026-07-29`: Bound checkpoints and handoffs to exact Session and Task identity.

## Decision

Skopos preserves continuation state, not full chat transcripts.

A checkpoint or handoff records:

1. accepted goal, scope, and decisions
2. completed Task steps
3. remaining acceptance
4. current claims and mutation state
5. valid Evidence and invalidation
6. blockers and open material questions
7. next safe action

Task handoffs live under
`.skopos/handoffs/<worktree-id>/<task-id>/handoff.json`. Durable cross-machine
continuation uses the tracked Task and an optional pushed immutable snapshot. No
workspace-global latest-handoff alias exists.
