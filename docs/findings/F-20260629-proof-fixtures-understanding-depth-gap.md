---
title: Proof Fixtures Need Agent-Reviewed Understanding
status: active
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260629-PROOF-FIXTURES-UNDERSTANDING-DEPTH-GAP
scope: skopos
role: finding
lifecycle: active
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-07-28
---

# Proof Fixtures Need Agent-Reviewed Understanding

> Current prototype evidence. Canonical replacement proof is owned by adoption Phase 4
> and release Phase 10 of
> `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`.

## Summary

The proof-phase scorecard now fails because several benchmark fixtures still treat scanner-only onboarding as enough for readiness.

After the agent-guided understanding contract, trust correctly warns when `.skopos/index/understanding/agent-analysis-brief.json` exists but required durable project understanding docs are missing. The proof fixtures and proof expectations must be updated to model that new readiness rule.

## Evidence

`pnpm proof` on 2026-06-29 produced:

- `17/20` benchmarks passing
- `brownfield-stabilization-delta` failing because after-state trust is `medium/needs-review`
- `knowledge-index-log` failing because trust/readiness is `medium/needs-review`
- `self-hosted-dogfooding` failing because trust/readiness is `medium/needs-review`

The shared warning is `understanding-depth`: agent-reviewed project understanding docs are missing.

## Impact

- The proof suite no longer proves the current onboarding contract.
- Release confidence is blocked until proof fixtures either include agent-reviewed understanding docs or explicitly exercise the `brief-ready` state.
- The new trust behavior is correct, but the proof baseline is stale.

## Needed Fix

This gap remains a proof seed for the canonical adoption contract. It must be rewritten
against assessment-only versus standard-verified Readiness rather than repaired around
the prototype `understand` artifact family.

1. Update target proof fixtures with canonical Memory and approved restructuring when
   the expected state is `agent-ready`.
2. Add at least one assessment-only fixture that intentionally cannot reach
   `agent-ready`.
3. Ensure scanner-only discovery cannot satisfy full Readiness.
4. Rerun the clean target proof matrix; do not preserve the previous score or artifact
   schema as a compatibility requirement.

## Changelog

- 2026-07-28: Recast as a regression seed for canonical adoption and release proof.
- 2026-06-29: Marked this as the first concrete agentic-system slice because proof/readiness correctness must be restored before broader workflow expansion.
- 2026-06-29: Opened after the project-mode docs mission ran `pnpm proof` and exposed proof fixture drift caused by the new agent-guided understanding readiness rule.
