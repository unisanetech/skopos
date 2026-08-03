---
title: Task Proof Boundary And Dirty-Worktree Isolation Gap
status: active
severity: MUST
owner: skopos-core
id: F-20260803-task-proof-boundary-and-dirty-worktree-isolation-gap
scope: skopos
role: finding
lifecycle: active
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-08-03
relatedDocs:
  - ../decisions/D-20260803-task-local-proof-and-project-integration-readiness-boundary.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../architecture/evidence-and-readiness-model.md
  - ../patterns/PAT-20260803-mixed-worktree-proof-scope-amplification.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: close when isolated Task proof and explicit Project integration proof pass the adopter matrix
---

# Task Proof Boundary And Dirty-Worktree Isolation Gap

## Finding

Skopos states that Task proof is proportional to Task-owned change and that unchanged
pre-existing dirty paths remain outside that proof boundary. The current implementation
does not preserve that contract reliably in a large shared dirty worktree. Impact and
Guard resolution can absorb unrelated live-tree changes, turning a narrow Task closure
into an implicit workspace integration or release check.

The first mitigation is implemented: verification classifies each live changed path
against declared Task ownership, the admission digest, and the latest post-admission
digest-matched coordination mutation. Only declared/current-Task paths drive impact.
Unchanged pre-existing paths, other-Task paths, and external-unattributed paths remain
visible in detailed proof artifacts and as counts in compact output. The Finding stays
open because generated/dependency attribution, immutable snapshot coverage, and the
explicit Project integration subject have not yet passed the full acceptance matrix.

## Observed Evidence

During a downstream monorepo pilot:

1. a Task owning two documentation files selected approximately nineteen Actions,
   including unrelated product, UI, and workspace checks
2. an older authorization Task acquired browser visual proof even though its accepted
   closure subject was a framework authorization boundary
3. pre-existing edits from other work remained visible to current-impact resolution
   despite being present in the admission baseline
4. unrelated failures could therefore block a Task whose owned delta did not affect
   the failing surface

The downstream repository is evidence, not part of Skopos core vocabulary. Generic
fixtures must reproduce the same shape without embedding adopter names, paths, or
commands.

The generic regression now retains the original observation and records the corrected
current result: with 64 pre-existing dirty paths, one post-admission other-Task edit,
and one Task-owned edit, Task proof contains one path, excludes one other-Task path,
ignores 63 unchanged paths, and selects one Action with zero false selections.

## Expected Contract

1. Task closure proves the Task-owned delta and only the Scope dependents causally
   affected by that delta.
2. Pre-existing, other-Task, generated, and external or unattributed changes are
   classified and reported but do not silently enter the Task proof subject.
3. A broad Project integration or release check is an explicit Readiness subject, not
   an accidental consequence of a dirty workspace.
4. Every selected Guard and Action explains the owned path, dependency edge, policy,
   or explicit adoption that caused its selection.
5. Live-tree verification is permitted only for Actions declared overlay-safe;
   otherwise verification uses an immutable Task snapshot.

## Impact

1. narrow Tasks become slow and expensive
2. unrelated failures create false blockers and encourage unsafe bypasses
3. Evidence becomes hard to attribute to one Task
4. parallel work cannot close independently with confidence
5. the user cannot distinguish Task readiness from overall repository readiness

## Acceptance

1. A fixture with a large pre-existing dirty baseline and several Scopes proves that a
   narrow Task selects only its owned delta and declared affected dependents.
2. Mutating an unrelated pre-existing or other-Task path after admission does not
   expand or invalidate the narrow Task unless contamination or a real dependency edge
   is established.
3. Selection diagnostics identify why every Guard, Action, and source path is in or out
   of the proof subject.
4. An explicit Project integration Task over the same fixture includes the intended
   cross-Task surface and cannot reuse narrow Task closure as release proof.
5. Snapshot and overlay-safe Action tests pass for clean, dirty, generated, deleted,
   and externally modified paths.
