---
title: Completed Tasks Can Retain Open Questions
status: resolved
severity: MUST
owner: skopos-core
id: F-20260811-task-question-closure-invariant-gap
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-11
relatedDocs:
  - ../architecture/decision-escalation-model.md
  - ../architecture/evidence-and-readiness-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
  - ../work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md
reviewCycle: before public release and whenever Task closure changes
---

# Completed Tasks Can Retain Open Questions

## Progress

- `2026-08-11`: Workflow, verification transition, Readiness, and `finish` now reject
  every open question at closure, including non-blocking ask-backs, and return exact
  question ids with the `skopos decide` recovery. Non-blocking questions still allow
  implementation steps to proceed. Source and packed npm lifecycle fixtures prove that
  closure blocks while open and succeeds after resolution.
- `2026-08-11`: Questions now carry an auditable terminal disposition: answered,
  dismissed with a reason, or promoted to canonical Decision, Finding, Plan, or
  successor-Task authority. Cancelling dismisses every remaining open question;
  superseding promotes each one to the successor Task. Repeated disposition is safe,
  and legacy Tasks without newer proof metadata can be re-rendered during review.
- `2026-08-11`: Reviewed reconciliation found thirteen historical terminal Tasks with
  the obsolete non-blocking Scope confirmation: ten completed and three cancelled.
  Each was explicitly dismissed because its terminal outcome made the suggestion
  inapplicable; no answer was inferred. A full tracked-state scan now reports zero
  terminal Tasks with `status: open` questions.
- `2026-08-11`: Source portability fixtures cover answered, dismissed, promoted,
  cancelled, superseded, and cleanly reconstructed question states. The focused
  packed npm lifecycle installs the built artifact, dismisses an open question through
  the public CLI, and then closes successfully.

## Finding

The self-hosted homepage audit found completed Tasks whose portable question state
still contains `status: open`. Six completed Tasks retained an open non-blocking Scope
question even though their decision step and closure verification passed.

Non-blocking should mean that a question does not stop implementation. It must not
mean that terminal Task state can preserve an unresolved question without an explicit
disposition.

## Impact

1. Task state, tracked Memory, Verify, and Readiness disagree
2. a future agent cannot tell whether the question was answered, dismissed, superseded,
   or forgotten
3. release checks that require no open Task questions cannot rely on Task completion
4. users can receive a false sense of closure
5. the defect weakens the central Evidence-and-Readiness trust contract

## Required Resolution

1. terminal Task state permits no Task question with `status: open`
2. closure requires every question to be resolved, explicitly dismissed with reason,
   or promoted to a durable Finding, Decision, or Plan obligation
3. non-blocking questions may allow implementation to continue but must receive a
   terminal disposition before `finish`
4. Verify and Readiness expose exact question ids and the required recovery command
5. source and packed fixtures cover blocking, non-blocking, resolved, dismissed,
   promoted, cancelled, superseded, and reconstructed Tasks
6. existing completed Tasks with open questions receive a reviewed reconciliation

This is a public-release blocker because Skopos must not certify internally
contradictory Task state.

## Resolution

The terminal-state invariant and historical reconciliation are complete. Future
question kinds can extend the disposition target vocabulary, but no Task may enter or
remain in a terminal state with an open question.
