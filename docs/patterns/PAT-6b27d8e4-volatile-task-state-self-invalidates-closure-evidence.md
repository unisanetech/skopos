---
title: "Failure Pattern: Volatile Task State Self-Invalidates Closure Evidence"
status: active
owner: skopos-core
id: PAT-6b27d8e4
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: observed
view: current
appliesTo:
  - action-inputs
  - source-bound-evidence
  - readiness
  - docs/**
  - task-state
lastUpdated: 2026-07-29
relatedDocs:
  - ../architecture/evidence-and-readiness-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../findings/archive/F-c1e8c13d-prototype-product-contract-convergence-gap.md
reviewCycle: when Action input or Task publication semantics change
---

# Failure Pattern: Volatile Task State Self-Invalidates Closure Evidence

## Failure Shape

A closure Action declares a broad input such as the entire documentation root. That
root also contains the tracked Task document. The Action succeeds and records
source-bound Evidence, but the next verification or Readiness transition updates the
Task document. The successful Evidence becomes stale immediately, so repeating the
Action recreates the same loop.

## Detection Signals

1. an Action succeeds but Verify immediately reports its Evidence stale
2. the only changed input is a Task status, step, question, or Readiness projection
3. rerunning the Action never produces stable closure
4. an Action input includes both durable product truth and volatile execution state

## Why It Fails

Source-bound Evidence is correct to invalidate when its real inputs change. The error
is defining volatile control state as a product input to the proof. This makes
verification mutate the state it is trying to certify.

## Prevention

1. declare the narrow durable source families an Action actually proves
2. exclude tracked Task documents, handoffs, run artifacts, and Readiness projections
   unless the Action explicitly validates their representation
3. keep Action manifests and commands inside the execution-key boundary
4. run closure Actions after implementation and durable Memory changes stabilize

## Recovery

Narrow the Action input manifest to durable sources, record fresh Evidence once, and
run Verify without changing those sources. Do not weaken Evidence freshness or add a
special stale-result exception.

## Changelog

- `2026-07-31`: Added canonical active/archive Task-projection exclusion and explicit
  Action `sourceExcludes` support so the recovery is enforceable without weakening
  durable-input freshness.
- `2026-07-29`: Recorded after Skopos closure proof hashed `docs/work/tasks/**` and
  invalidated itself on the next Task transition.
