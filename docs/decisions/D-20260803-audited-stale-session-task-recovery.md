---
title: "Decision: Audited Stale Session Task Recovery"
status: accepted
owner: skopos-core
id: D-20260803-audited-stale-session-task-recovery
scope: skopos
role: decision
lifecycle: durable
authority: supporting
provenance: accepted
view: current
date: 2026-08-03
implementationStatus: implemented
lastUpdated: 2026-08-03
relatedDocs:
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../architecture/agent-native-operating-model.md
  - ../findings/F-20260803-session-task-recovery-and-disposition-gap.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when Session leases, Task reservations, or mutation recovery changes
---

# Decision: Audited Stale Session Task Recovery

## Changelog

- `2026-08-03`: Accepted and implemented one fail-closed recovery operation with
  atomic `resume` and `release` outcomes.

## Context

A Session lease is intentionally shorter than Task ownership. Lease expiry must not
discard reservations, claims, or mutation history, but requiring the stale Session to
release them creates a circular recovery failure after a crash. Existing takeover and
owner-only release commands also split one recovery decision across multiple public
paths and allowed a forced path that could obscure unresolved mutation state.

## Decision

Skopos exposes one canonical stale Task recovery operation. A different live writer
Session requests either `resume` or `release` and supplies a reason.

Before mutation, Skopos requires:

1. an existing Task reservation owned by a stale Session
2. a live replacement writer Session
3. a clean claimed-path contamination audit
4. zero open or contaminated mutation-ledger entries

`resume` atomically transfers the reservation and resource claims. Historical mutation
entries retain their original Session and actor attribution. `release` atomically
removes the reservation and claims but does not choose a Task work disposition.

Every success records the prior and replacement Session, replacement actor, monotonic
Task recovery generation, reason, outcome, released-claim count, and ledger-state
summary. Concurrent attempts serialize through the coordination database and only one
can observe stale ownership as recoverable.

The canonical safe recovery operation has no force mode. Contamination and open
mutations require explicit reconciliation before recovery.

## Rejected Alternatives

### Require the stale Session to release itself

Rejected because a crashed or disconnected host cannot act.

### Automatically discard reservations on lease expiry

Rejected because short connectivity loss would erase durable ownership and mutation
attribution.

### Keep separate takeover and emergency release paths

Rejected because parallel recovery authorities drift and make audit outcomes
ambiguous.

### Permit forced recovery over unresolved mutations

Rejected because ownership transfer would falsely imply that the live tree matches a
known mutation boundary.

## Consequences

1. crash recovery no longer depends on the stale process
2. resume and release share one fail-closed audit contract
3. Task work disposition remains an explicit, separate lifecycle operation
4. contaminated or incomplete mutations remain visible blockers
5. recovery history is queryable by Task generation and actor
