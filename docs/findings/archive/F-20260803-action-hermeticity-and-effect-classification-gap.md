---
title: Action Hermeticity And Effect Classification Gap
status: resolved
severity: MUST
owner: skopos-core
id: F-20260803-action-hermeticity-and-effect-classification-gap
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-03
relatedDocs:
  - ../../architecture/evidence-and-readiness-model.md
  - ../../architecture/action-extension-model.md
  - ../../standards/validation.md
  - ../../decisions/D-20260803-action-effects-and-hermetic-execution-contract.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: archived after offline packed-install effect and host-parity proof passed
---

# Action Hermeticity And Effect Classification Gap

## Finding

Action declarations and enforcement did not make certification behavior predictable
in restricted or offline environments. Artifact writes, hidden network requirements,
external mutation, non-Git workspaces, and concurrency could be misclassified or
uncertified.

## Acceptance

1. every capability and effect is explicit and participates in execution identity
2. undeclared workspace and external effects fail certification
3. unavailable capabilities fail before command execution
4. run-owned artifacts and scheduling cannot collide
5. clean offline packed installation proves the same contract as source execution

## Resolution

Action manifests now require explicit capabilities, effects, safety, and concurrency.
Runtime preflight distinguishes unavailable infrastructure, run-owned artifact roots
isolate outputs, Git and portable snapshots enforce workspace boundaries, and
shared/exclusive leases serialize conflicting execution with bounded crash recovery.
Successful external mutation requires a normalized provider receipt matching a
declared service. Source and clean offline packed fixtures prove identical unavailable
and available network, browser, secret, tool, and service assertions; fixture secret
values do not enter run artifacts. The provider receipt is explicit verification of
the response reported by the Action, not a universal provider sandbox claim.
