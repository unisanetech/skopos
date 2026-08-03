---
title: "Decision: Task-Local Proof And Project Integration Readiness Boundary"
status: accepted
owner: skopos-core
id: D-20260803-task-local-proof-and-project-integration-readiness-boundary
scope: skopos
role: decision
lifecycle: durable
authority: supporting
provenance: accepted
view: target
date: 2026-08-03
implementationStatus: complete
lastUpdated: 2026-08-03
relatedDocs:
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../architecture/evidence-and-readiness-model.md
  - ../architecture/agent-native-operating-model.md
  - ../findings/archive/F-20260803-task-proof-boundary-and-dirty-worktree-isolation-gap.md
  - ../patterns/PAT-20260803-mixed-worktree-proof-scope-amplification.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when Task impact, snapshot verification, or integration Readiness changes
---

# Decision: Task-Local Proof And Project Integration Readiness Boundary

## Changelog

- `2026-08-03`: Completed the Decision. Task, Verification, and Readiness artifacts
  now carry an explicit proof subject and stable baseline id; project-integration
  Tasks require an owned surface and are detailed high-impact work. Selected generator
  outputs retain causal attribution, live Actions require explicit overlay-safe
  declarations, recursive directory claims enter immutable snapshots, and generic
  mixed-worktree integration proof passes.
- `2026-08-03`: Implemented Task-local path attribution and Action-selection
  isolation. Declared ownership and digest-matched current-Task mutations enter Task
  proof; unchanged admission dirt, other-Task mutations, and unattributed changes
  remain reported but excluded. Immutable snapshot and explicit Project integration
  proof remain open.
- `2026-08-03`: Accepted an explicit subject boundary between one Task's proportional
  closure proof and Project integration or release proof.

## Context

The canonical product decision already requires proportional validation, attributable
Task Evidence Links, dirty-path classification, and immutable Task snapshots. A
downstream pilot nevertheless showed an unresolved semantic ambiguity: current impact
could be derived from the mixed live worktree, causing unrelated pre-existing and
other-Task changes to select Guards and Actions for a narrow Task.

That behavior collapses two different questions:

1. Is this Task safe and complete for the change it owns?
2. Is the combined Project state safe to integrate, release, or publish?

Both questions matter. Treating every Task as a Project release candidate makes normal
work slow and falsely blocked; treating narrow Task Evidence as release proof misses
integration risk.

## Decision

Skopos Readiness always names its proof subject. Task closure and Project integration
are separate Readiness subjects over the same canonical Task, Action, Guard, Evidence,
and Readiness model. This Decision refines the canonical product contract; it does not
create a second execution authority or a new lifecycle object.

### Task Closure Subject

One Task's proof subject contains only:

1. its declared owned paths and the content delta from its admission baseline
2. paths explicitly adopted by that Task after admission
3. generated outputs causally owned by those inputs
4. declared Scope dependents reached from the owned delta through explainable impact
   edges
5. accepted policy and risk floors applicable to that subject

Pre-existing, other-Task, and external or unattributed changes are classified and
reported. They do not silently select Task Guards, Actions, or Evidence requirements.
If they overlap the Task subject, change a declared dependency, or invalidate snapshot
construction, Skopos reports contamination or a concrete impact edge rather than
absorbing the entire worktree.

### Project Integration Subject

Project integration or release proof is requested explicitly by a Task whose contract
owns the intended integration baseline and Readiness goal. It may aggregate completed
Task deltas, unresolved dirty classifications, cross-Scope dependents, publication
requirements, and release Actions. It cannot infer Project readiness from the closure
of one narrow Task.

Plans may sequence these Tasks but do not execute checks or own Evidence. Readiness
remains the only projection that answers whether the selected subject is safe to
continue, integrate, or close.

### Selection And Execution

1. Guard and Action selection starts from the named proof subject, never from an
   undifferentiated live-tree diff.
2. Every selected or excluded item exposes a stable reason: owned path, adopted path,
   dependency edge, policy, risk floor, contamination, or integration contract.
3. Closure uses an immutable Task snapshot. An Action may execute against the live
   mixed tree only when its declaration and implementation are verified overlay-safe.
4. Exact reusable Action Runs enter a Task only through attributable Task Evidence
   Links; Project integration creates its own links to the same valid runs when its
   requirements match.
5. A Task status or Session transition cannot expand the proof subject by itself.

## Rejected Alternatives

### Always verify the full live workspace

Rejected because unrelated work becomes a false Task blocker, attribution is lost,
and parallel Tasks cannot close independently.

### Ignore all changes outside declared ownership

Rejected because overlapping edits, generated outputs, real dependency impact, branch
movement, and contamination can invalidate a Task snapshot and must remain visible.

### Treat release proof as a special untracked command

Rejected because integration has intent, ownership, risk, Evidence, decisions, and
closure conditions. It is therefore a Task Readiness subject, not an escape hatch from
the Task model.

## Consequences

1. Normal Task closure becomes proportional and stable in shared dirty worktrees.
2. Release and publication retain broad proof without imposing it on every Task.
3. Impact resolution must preserve admission baseline classification and causal reason
   edges.
4. Snapshot construction and overlay-safe Action certification become release-critical.
5. Users may see a Task as closed while Project integration remains blocked; CLI, UI,
   MCP, and agent guidance must state the subject plainly.

## Implementation Requirements

1. represent the Readiness subject and baseline identity in Task verification state
2. compile the Task-owned delta before affected Scope and dependent resolution
3. keep dirty classifications stable across verification unless an attributed mutation
   changes them
4. expose compact inclusion and exclusion reasons with paginated detail
5. add generic fixtures for clean, large dirty, concurrent, generated, deleted, and
   contaminated worktrees
6. require explicit Project integration Readiness before publication or release

All requirements are implemented. Task and integration subjects share the same
canonical Task and Readiness lifecycle; high-impact closure requires a current
immutable Task snapshot, while live Action Evidence is valid only for a declaration
that explicitly records overlay-safe workspace execution.
