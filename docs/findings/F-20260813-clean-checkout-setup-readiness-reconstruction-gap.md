---
title: Clean Checkout Setup Readiness Cannot Be Reconstructed From Tracked Project Truth
status: resolved
severity: MUST
owner: skopos-core
id: F-20260813-clean-checkout-setup-readiness-reconstruction-gap
scope: skopos
role: finding
lifecycle: durable
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-08-13
relatedDocs:
  - ../architecture/intelligent-project-onboarding.md
  - ../architecture/artifact-model.md
  - ../decisions/D-20260812-intelligent-project-onboarding-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: before public release and whenever adoption readiness derivation changes
---

# Clean Checkout Setup Readiness Cannot Be Reconstructed From Tracked Project Truth

## Resolution

Resolved on `2026-08-13`. Init and Session context now reconstruct adoption from a
completed high-impact certification Task, its immutable source-bound snapshot, and
current tracked Memory, Scope, capability, instruction, and configuration owners. A
fresh standalone Pro clone reconstructed Task `T-03397e28` as `agent-ready` with all
five tracked lanes ready and without proposal replay or copied `.skopos/adoption`
state. Focused proof also confirms that a changed tracked Memory owner invalidates only
the Memory lane.

## Finding

Skopos records accepted adoption outcomes in tracked project owners, but a fresh clean
checkout derives adoption readiness only from checkout-local `.skopos/adoption/**`
artifacts. Those artifacts are intentionally ignored. The same adopted project can
therefore fall back to `agent-analysis-required` even though its tracked Memory,
Scope, Actions, Guards, instructions, completed Task, and immutable snapshot already
prove the accepted project state.

The defect was reproduced from standalone Pro checkout `5096f64`. No supported
command reconstructed readiness. Copying `.skopos`, replaying semantic adoption, or
recording observations with empty source paths would create false authority and is not
an acceptable recovery path.

## Impact

1. a new clone cannot resume the accepted coding-agent workflow without ceremony
2. onboarding appears checkout-bound rather than repository-native
3. users may be asked to approve document restructuring they already accepted
4. tracked project truth and session readiness can disagree
5. host- or environment-local verification is conflated with durable adoption state

## Required Resolution

1. reconstruct adopted project state from current tracked Memory, Scope, Actions,
   Guards, instruction owners, completed adoption Task, and source-bound snapshot
2. reverify only checkout-local host, tool, and environment lanes
3. make `init` and `session context` reach `agent-ready` without copying ignored state
   or replaying the proposal and approval lifecycle
4. invalidate only the affected readiness lanes when tracked authority drifts
5. preserve fail-closed behavior when tracked evidence is missing, stale, or
   contradictory
6. do not add a tracked omnibus setup manifest or a second adoption authority

## Acceptance Fixture

From a clean checkout of an adopted Pro project:

1. run normal Skopos initialization and session context
2. observe `agent-ready` reconstructed from tracked owners
3. confirm that no proposal replay, ignored-directory copy, or empty-path observation
   is required
4. mutate one tracked adoption owner and confirm that only its dependent readiness
   lanes become stale
5. restore the source-bound owner and confirm deterministic readiness recovery

This is a public-release blocker because repository-native continuity is a core
product promise, not an optional convenience.
