---
title: "Failure Pattern: File-Backed Ownership Without Atomic Compare-And-Swap"
status: active
owner: skopos-core
id: PAT-a438a365
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - task-lifecycle
  - concurrent-agents
  - same-directory-coordination
  - claims
  - leases
  - local-runtime-state
  - sqlite
  - crash-recovery
  - reliability
lastUpdated: 2026-07-30
relatedDocs:
  - ../architecture/runtime-model.md
  - ../architecture/agent-native-operating-model.md
  - ../architecture/artifact-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../findings/archive/F-c1e8c13d-prototype-product-contract-convergence-gap.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when Task claim, Session lease, or coordination recovery changes
---

# Failure Pattern: File-Backed Ownership Without Atomic Compare-And-Swap

## Changelog

- `2026-07-30`: Repaired the related convergence finding link after archival.
- `2026-07-28`: Accepted after the Task-admission repair exposed a separate
  cross-process ownership race: ordered per-file publication can keep admission
  complete without making the ownership decision atomic.

## Failure Shape

An ownership command reads a JSON artifact, checks that a Task or resource is
unclaimed, performs one or more asynchronous writes, and replaces the ownership file.
Each replacement may be atomic as a file operation, but the read, eligibility check,
dependent writes, and ownership publication are not one compare-and-swap.

Two processes can both observe the same unclaimed state, both pass validation, and both
report success. The last ownership write wins even though the losing Session already
created projections or began work.

A partial SQLite repair can reproduce the same failure in another form. Holding a
database transaction open while renaming filesystem artifacts does not make the
database and filesystem one atomic commit. A process exit or machine failure after the
filesystem rename and before the database commit can publish ownership that the
database rolled back.

## Detection Signals

1. ownership is decided from a JSON read followed later by a JSON write
2. an `await` or dependent artifact write separates the ownership check from
   publication
3. temporary-file rename is described as an ownership compare-and-swap
4. two concurrent non-force claims can both return success
5. actor identity is used where a unique live Session identity is required
6. `--force` transfers ownership without a reason, prior holder, lease state, or
   generation
7. both a JSON claim field and a database row are treated as current ownership
   authority
8. rollback depends on a catch handler restoring snapshots after filesystem writes
9. lease expiry deletes Task reservation or dirty-work attribution

## Why It Fails

1. per-file atomic replacement prevents torn content, not time-of-check/time-of-use
   races
2. actor attribution cannot distinguish two simultaneous chats or processes owned by
   the same actor
3. filesystem and SQLite commits do not share one crash-atomic transaction
4. in-memory mutexes do not coordinate separate CLI processes
5. dual ownership authorities can disagree after a crash or interrupted write
6. blind snapshot restoration can overwrite user, editor, or concurrent-agent changes
7. lease expiry identifies a stale writer; it does not prove that dirty work is safe to
   release
8. an unaudited force flag erases who owned the work and why transfer was considered
   safe

## Prevention

1. keep one local coordination authority in `.skopos/coordination.sqlite`, using WAL
   and short transactional writes
2. identify the writer by unique `sessionId`; keep actor, host, process, checkout,
   branch, and base revision as separate attribution fields
3. keep a durable Task reservation distinct from the short Session writer lease
4. enforce one writing Task per Session and one writer per claimed resource with
   database constraints
5. acquire or transfer ownership through a generation-based compare-and-swap inside a
   short `BEGIN IMMEDIATE` transaction
6. never hold the database transaction across asynchronous filesystem writes
7. use a recoverable publication state machine for Task projections:
   - transactionally reserve a generation in `preparing` state
   - write or stage exact Task projections idempotently outside the transaction
   - record their content digests
   - transactionally finalize `active` only when the generation and digests still
     match
8. make readers accept only a finalized active lease whose required projection digests
   match
9. require audited takeover fields: new Session and actor, prior Session and actor,
   non-empty reason, time, observed lease state, and generation
10. reject takeover of a live writer lease and reconcile working-tree state against the
    mutation ledger before stale takeover
11. declare the supported Node/runtime and SQLite implementation as a release contract;
    verify it through packed-install and cross-process tests
12. report `observed`, `cooperative`, `hooked`, or `mediated` enforcement honestly;
    only hooked or mediated operation promises preventive same-directory safety

## Recovery

1. heartbeat expiry marks the Session stale but preserves the Task reservation, claims,
   and dirty attribution
2. inspect an incomplete `preparing` generation and its projection digests instead of
   guessing that it committed
3. resume or supersede idempotent projection publication through a new audited
   generation; do not restore blind filesystem snapshots
4. compare claimed paths with the mutation ledger
5. allow audited takeover only when expected digests match and no live Action or Git
   lease remains
6. mark unexplained changes contaminated and block mutation, staging, verification, and
   closure until reconciled
7. record every takeover attempt and outcome even when safety checks reject it

## Retrieval

Retrieve this Pattern for Task claims, Session registration, leases, same-directory
multi-agent work, resource reservations, file-backed coordination, SQLite transaction
design, force transfer, crash recovery, mutation ledgers, or any command that decides
exclusive ownership through a read/check/write sequence. Do not inject it for
single-writer content files that do not represent ownership or exclusivity.
