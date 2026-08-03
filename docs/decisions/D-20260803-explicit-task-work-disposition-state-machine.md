---
title: "Decision: Explicit Task Work Disposition State Machine"
status: accepted
owner: skopos-core
id: D-20260803-explicit-task-work-disposition-state-machine
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
  - D-20260803-audited-stale-session-task-recovery.md
  - ../architecture/agent-native-operating-model.md
  - ../findings/F-20260803-session-task-recovery-and-disposition-gap.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when Task states, claims, or Work Queue dispositions change
---

# Decision: Explicit Task Work Disposition State Machine

## Changelog

- `2026-08-03`: Accepted and implemented explicit reasoned Task work dispositions
  separate from claim ownership.

## Context

Task release previously combined two decisions: it removed an actor claim and changed
active work to ready. For verifying or abandoned work, release preserved state without
explaining whether the intent was continued verification, deferral, cancellation, or
supersession. The Work Queue therefore could not distinguish ownership from work
intent consistently.

## Decision

Task claim ownership and Task work disposition are independent contracts. Releasing a
claim never changes Task state. Work state changes only through a reasoned disposition
record containing kind, prior and next state, actor, timestamp, and optional successor.

The legal dispositions are:

| Disposition | From | To | Claim result |
| --- | --- | --- | --- |
| `ready` | active, blocked | ready | released |
| `resume` | ready, deferred | active | claimed by actor |
| `defer` | ready, active, blocked | deferred | released |
| `return-from-verification` | verifying, ready-to-integrate | active | claimed by actor |
| `cancel` | any nonterminal state | cancelled | released |
| `supersede` | any nonterminal state | superseded | released |

Supersession requires a different existing nonterminal successor Task and records its
id on the terminal Task. Titles, dates, parents, and chronology never imply the
relationship.

Deferred work remains in the Work Queue under a distinct deferred disposition.
Cancelled, completed, and superseded work are terminal and absent from the open queue.

## Rejected Alternatives

### Let claim release decide queue state

Rejected because an ownership handoff does not state whether work is ready, deferred,
still verifying, cancelled, or replaced.

### Infer supersession from a newer Task

Rejected because chronology is not an authority relationship.

### Reuse blocked for deferred work

Rejected because blocked means a known unresolved prerequisite, while deferred is an
explicit scheduling decision.

## Consequences

1. agents can hand off verifying work without resetting proof state
2. deferred work is visible without competing with ready work
3. cancellations and supersessions are auditable terminal decisions
4. invalid transitions fail rather than silently normalizing state
5. host adapters share one runtime state machine instead of inventing dispositions
