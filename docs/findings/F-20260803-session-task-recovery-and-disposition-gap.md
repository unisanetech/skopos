---
title: Session And Task Recovery And Disposition Gap
status: active
severity: MUST
owner: skopos-core
id: F-20260803-session-task-recovery-and-disposition-gap
scope: skopos
role: finding
lifecycle: active
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-08-03
relatedDocs:
  - ../architecture/agent-native-operating-model.md
  - ../architecture/artifact-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../patterns/PAT-a438a365-file-backed-ownership-without-atomic-cas.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: close when stale recovery and every supported Task disposition pass crash and concurrency proof
---

# Session And Task Recovery And Disposition Gap

## Finding

Skopos correctly keeps a durable Task reservation separate from a short Session lease,
but the recovery and work-disposition commands do not yet form a complete operable
state machine. A stale writer can leave a Task reserved while the available release
operations require the stale Session to act, and Task release does not consistently
communicate whether work becomes ready, deferred, superseded, cancelled, or remains in
verification.

The stale coordination deadlock is now mitigated: a different live writer can audit
and atomically resume or release a stale reservation without the stale Session acting.
Recovery fails for contamination and open mutations, preserves recorded mutation
attribution, reports an auditable generation and ledger summary, and has one winner
under concurrent attempts.

The canonical Task work state machine is also implemented in the shared model,
runtime, CLI, projections, and Work Queue: ownership release no longer changes state;
resume, ready, defer, return-from-verification, cancel, and supersede are explicit
reasoned operations; deferred work has a distinct queue disposition; and supersession
records a validated successor id. The Finding remains open for MCP/UI mutation
surfaces, host-parity proof, active-Action crash recovery, in-progress Git recovery,
and broader concurrency fixtures.

## Observed Evidence

A downstream pilot reached a circular recovery state:

1. the stale Session could not be closed because it still reserved a Task
2. the Task reservation could not be released because the owning Session was stale
3. releasing Task ownership from a verifying state did not return the Task to an
   unambiguous queue disposition
4. old umbrella Tasks and narrower successor or child Tasks could remain visible
   together without an explicit supersession relationship

These symptoms are consistent with the already documented file-backed ownership and
recovery failure Pattern. The remaining gap is the public lifecycle and recovery
contract that makes the safe path available to an agent or maintainer.

## Expected Contract

1. Lease expiry marks a Session stale without silently discarding Task reservation,
   claims, or mutation attribution.
2. A different live Session can request audited recovery. Skopos checks ledger and
   contamination state, then resumes, transfers, or releases ownership atomically.
3. Session ownership and Task work disposition are separate operations with explicit
   results.
4. Supported dispositions have exact queue meaning and legal transitions, including
   continuing verification, returning to ready work, deferring, superseding, and
   cancelling abandoned work.
5. Parent, child, and successor Tasks cannot imply completion or supersession from
   titles or chronology; the relationship is explicit and queryable.

## Impact

1. agents and maintainers can become unable to cleanly resume or stop work
2. the Work Queue accumulates ambiguous active or verifying Tasks
3. unsafe manual edits to generated state become tempting
4. stale claims reduce concurrency and confidence
5. historical execution intent can be mistaken for current authority

## Acceptance

1. Crash fixtures cover stale Session with clean work, dirty owned work, contaminated
   work, an active Action, and an in-progress Git mutation.
2. Audited recovery succeeds only for safe cases and records prior and new Session,
   actor, generation, reason, ledger state, and outcome.
3. Every public release, defer, supersede, cancel, resume, and return-from-verification
   operation has deterministic Task state and Work Queue results.
4. No supported recovery path requires the stale Session to execute a command.
5. CLI, MCP, UI, Session context, handoff, and generated Task projections report the
   same disposition.
6. Concurrent recovery attempts prove one winner through the coordination authority.
