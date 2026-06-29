---
title: Proof Fixtures Need Agent-Reviewed Understanding
status: active
severity: MUST
owner: skopos-core
lastUpdated: 2026-06-29
---

# Proof Fixtures Need Agent-Reviewed Understanding

## Summary

The proof-phase scorecard now fails because several benchmark fixtures still treat scanner-only onboarding as enough for readiness.

After the agent-guided understanding contract, trust correctly warns when `.skopos/understanding/agent-analysis-brief.json` exists but required durable project understanding docs are missing. The proof fixtures and proof expectations must be updated to model that new readiness rule.

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

This is the first slice in `docs/project/agentic-operating-plan.md` and should be fixed before adding broader project-mode or command-brief surfaces.

1. Update proof fixtures to include required `docs/project/*` understanding docs when the expected state is `agent-ready`.
2. Add at least one fixture that intentionally remains `brief-ready` and expects trust `needs-review`.
3. Update proof expectations so scanner-only onboarding cannot pass as full readiness.
4. Rerun `pnpm proof` and restore `20/20` passing benchmarks.

## Changelog

- 2026-06-29: Marked this as the first concrete agentic-system slice because proof/readiness correctness must be restored before broader workflow expansion.
- 2026-06-29: Opened after the project-mode docs mission ran `pnpm proof` and exposed proof fixture drift caused by the new agent-guided understanding readiness rule.
