---
title: "Failure Pattern: Mutation Before Admission Validation"
status: active
owner: skopos-core
id: PAT-23c981d4
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - initialization
  - adoption
  - task-lifecycle
  - workflow-routing
  - readiness
  - state-transitions
  - configuration
  - path-containment
  - project-memory
  - instructions
  - concurrent-agents
  - security
  - reliability
lastUpdated: 2026-07-28
relatedDocs:
  - ../architecture/runtime-model.md
  - ../architecture/artifact-model.md
  - ../architecture/evidence-and-readiness-model.md
  - ../guides/bootstrap-a-project.md
  - PAT-4e27c8a1-retired-contracts-preserved-by-tests.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../findings/F-c1e8c13d-prototype-product-contract-convergence-gap.md
reviewCycle: when an admission or initialization write path changes
---

# Failure Pattern: Mutation Before Admission Validation

## Changelog

- `2026-07-28`: Extended the Pattern to Task activation after plan-to-claim proof
  exposed an active Task being published before its exact question and recommendation
  projections existed. A valid activation now materializes the complete admission
  packet first and publishes active authority last.
- `2026-07-28`: Accepted after the self-adoption e2e convergence reproduced a rejected
  nested init that mutated its target and parent before late Memory-root validation.

## Failure Shape

A command validates an admission boundary only after it starts writing. It eventually
rejects the request, but config, generated state, tracked docs, instructions, logs, or
other user files have already changed.

Skopos instantiated this Pattern when nested initialization inferred `../../docs` and
`../../AGENTS.md`. The document catalog rejected the escaped Memory root late, after
the child config and most `.skopos/**` projections were written, the parent
`AGENTS.md` was modified, and the operational log incorrectly recorded init success.

The same Pattern appeared in Task admission when the transitional plan-to-claim path
published a Mission as active and recorded claim success without materializing the
exact Task-owned `questions.json` and `recommendations.json`. Readiness then correctly
reported the claimed Task as incomplete. Treating the missing question state as an
empty question set would have hidden the incomplete admission and discarded decision
pressure already present in the linked Plan.

## Detection Signals

1. a command exits nonzero but `git status` or filesystem state changed
2. validation is called from a compiler, indexer, or refresh step after scaffold writes
3. a rejected child or Scope operation changes a parent workspace
4. a success receipt or lifecycle event exists for a failed operation
5. dry-run and normal execution discover invalid input at different phases
6. recovery would require reconstructing preexisting content or reversing append-only
   records
7. a claim succeeds and the Task becomes active, but required exact Task-state
   projections do not exist
8. the first Readiness check after activation is worse because admission state is
   unreadable rather than because a real decision is open
9. a downstream router silently converts missing Task state into an empty artifact

## Why It Fails

1. rejection no longer protects user state
2. parent projects can be modified outside the requested workspace boundary
3. generated projections and logs describe an initialization that never completed
4. retries operate on contaminated input and can produce different recommendations
5. rollback can overwrite user or concurrent-agent edits made after the first mutation
6. agents cannot distinguish preexisting state from residue left by a failed command
7. an active lifecycle label promises an admission invariant the runtime has not
   established
8. silent empty-state recovery can erase unresolved decisions and make implementation
   appear safe

## Prevention

1. define the complete admission contract before the first write
2. validate all inferred and explicit config through the same schema
3. prove every project-owned path is contained by the target workspace
4. perform semantic cross-field checks, such as keeping the docs router under the docs
   root, during preflight
5. make normal and dry-run modes share the same preflight
6. append success Evidence only after every required mutation and projection succeeds
7. test rejection by comparing both tracked and local state before and after the
   command
8. for Task activation, load and validate the linked source, then materialize explicit
   empty-or-populated question and recommendation artifacts under the exact Task
   identity before publishing active authority
9. publish the lifecycle transition and success event last; never make Readiness or a
   downstream router reinterpret missing admission state as an empty state

## Recovery

1. stop further writes as soon as late validation is discovered
2. identify every tracked, parent-owned, local, and append-only surface already touched
3. restore user-owned files only from a verified pre-operation snapshot; never guess
4. invalidate false success receipts and generated projections
5. move validation to a preflight boundary instead of expanding rollback logic
6. add zero-mutation regression proof for normal and dry-run execution
7. reconstruct incomplete Task admission from its exact linked source without falling
   back to workspace-global state
8. remove downstream missing-to-empty healing and add immediate post-claim Readiness
   proof

## Retrieval

Retrieve this Pattern for initialization, migration, scaffolding, adoption, config
loading, path containment, instruction sync, Task activation, lifecycle transitions,
workflow routing, generated-state compilation, or any operation that can reject or
publish incomplete authority after it starts writing. Do not inject it into read-only
queries that cannot mutate project state.
