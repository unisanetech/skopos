---
title: "Failure Pattern: Mixed-Worktree Proof Scope Amplification"
status: active
owner: skopos-core
id: PAT-20260803-mixed-worktree-proof-scope-amplification
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: observed
view: current
appliesTo:
  - task-impact
  - dirty-worktrees
  - action-selection
  - guards
  - evidence
  - readiness
  - monorepos
  - concurrent-agents
lastUpdated: 2026-08-03
relatedDocs:
  - ../findings/archive/F-20260803-task-proof-boundary-and-dirty-worktree-isolation-gap.md
  - ../decisions/D-20260803-task-local-proof-and-project-integration-readiness-boundary.md
  - ../architecture/evidence-and-readiness-model.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when Task impact or snapshot proof semantics change
---

# Failure Pattern: Mixed-Worktree Proof Scope Amplification

## Failure Shape

A Task owns a small delta in a worktree that already contains many unrelated changes.
Impact or validation selection begins from the full live-tree diff instead of the
Task's admission baseline and attributed delta. Unrelated paths expand affected Scopes,
which select more Guards and Actions, whose broad inputs then pull in still more paths.
A local closure question becomes a workspace integration check without an explicit
decision.

## Detection Signals

1. a narrow Task selects checks for Scopes untouched by its owned delta
2. adding an unrelated dirty file changes Task closure requirements
3. the same Task selects materially different proof in a clean clone and a shared
   worktree
4. selection explanations cite workspace dirt but no owned path or dependency edge
5. a Task cannot close until unrelated active work becomes green
6. broad Actions are selected because they exist at the root rather than because a
   Guard requires them for the Task subject

## Why It Fails

1. a Git worktree diff describes physical co-location, not Task ownership
2. Scope dependency impact is valid only after the originating Task delta is known
3. pre-existing and other-Task changes have different attribution and lifecycle
4. broad checks can be valid for integration while remaining irrelevant to Task
   closure
5. source-bound Evidence cannot compensate for an incorrectly defined proof subject

## Consequences

1. false blockers and unnecessary validation cost
2. Evidence linked to the wrong Task
3. unstable Readiness as unrelated edits arrive
4. pressure to bypass Guards or run unsafe blanket commands
5. poor scaling in monorepos and multi-agent workspaces

## Prevention

1. capture a content-addressed admission baseline and dirty classification
2. compute the Task-owned delta before Scope and dependent impact
3. require causal selection reasons for every Guard and Action
4. preserve pre-existing and other-Task classifications unless explicitly adopted
5. verify from an immutable Task snapshot or a certified overlay-safe Action
6. model broad integration or release proof as an explicit Task Readiness subject

## Recovery

Reconstruct the Task's admission baseline, classify every changed path, and compute the
owned delta again. Remove Guards and Actions selected only by unrelated dirt, mark any
true overlap as contamination, and create or resume an explicit integration Task for
the combined workspace proof. Do not weaken the broad integration checks; move them to
the subject they actually prove.
