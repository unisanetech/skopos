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
lastUpdated: 2026-08-05
relatedDocs:
  - ../architecture/agent-native-operating-model.md
  - ../architecture/artifact-model.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../findings/archive/F-20260805-conversation-aware-fresh-session-continuation-gap.md
  - ../work/archive/P-20260805-conversation-aware-session-continuation-plan.md
---

# Decision: Discussion Memory, Checkpoints, And Handoff Contract

## Changelog

- `2026-08-05`: Verified the schemaVersion 1 hard cut through packed minimal and
  Billquest canaries plus a real fresh Codex comprehension task. Exact `taskId`
  selection is available throughout CLI and MCP for multi-Task workspaces.
- `2026-08-05`: Extended the accepted Task-scoped handoff direction to include a
  bounded, agent-authored conversation capsule, exact freshness identity, reviewable
  provenance, and fresh-session continuation without making transcripts or host chats
  a second Memory authority.
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

For a fresh-session continuation, the same handoff additionally preserves only the
conversation-derived judgment that cannot be reconstructed reliably from Task state:

1. the current objective, user intent, and why the work matters
2. accumulated user constraints and corrections
3. work completed in the originating Session and the exact stopping position
4. attempted and rejected approaches with concise reasons
5. unresolved uncertainties, explicit exclusions, and work that must not be repeated
6. one recommended first action for the receiving Session

The coding agent authors this semantic capsule because it owns conversation and
reasoning. Skopos compiles authoritative Task and Project Memory state around it,
validates provenance, redaction, identity, and budget, and generates the handoff. Each
material statement is classified as user direction, accepted Decision, verified fact,
working assumption, agent recommendation, rejected option, or open question. Live
Project Memory, Task, source, Evidence, and coordination state override remembered
conversation when they conflict.

The handoff binds its originating Session and host reference when available, Task
revision, worktree, branch and commit, owned-path source fingerprint, policy identity,
relevant Evidence identities, and creation time. A receiving Session classifies it as
`current`, `refreshable`, `stale`, `conflicted`, or `invalid` before work resumes.

Raw journals remain generated diagnostic input. They are not normal continuation
context, durable Memory, proof, or a substitute for the bounded semantic handoff.
Skopos does not persist hidden model reasoning, inject a full transcript, or silently
truncate meaning to satisfy the handoff budget.

Task handoffs live under
`.skopos/handoffs/<worktree-id>/<task-id>/handoff.json`. Durable cross-machine
continuation uses the tracked Task and an optional pushed immutable snapshot. No
workspace-global latest-handoff alias exists.
