---
title: Proof Harness Wall-Clock Ceiling
status: resolved
severity: MUST
owner: skopos-core
lastUpdated: 2026-07-25
---

# Proof Harness Wall-Clock Ceiling

## Summary

The proof-phase scorecard can legitimately take more than ten minutes when its
fixture commands are serialized under a busy self-hosted workspace. The former
600-second outer Vitest ceiling could expire before the harness returned, even
though the individual benchmark assertions and their budgets had not failed.

## Evidence

P1-W12 first completed the proof workflow in 402.87 seconds with:

- 21 of 21 benchmarks passing;
- a weighted pass rate of 1; and
- no failed benchmark metrics.

After the final documentation state was archived, the same proof workflow was
rerun. Vitest reported its 600-second outer timeout after 670.08 seconds of test
wall time because synchronous fixture child processes delayed timeout delivery.
That run did not persist a replacement scorecard report, and it reported no
benchmark regression before the outer container expired.

The timed-out workflow receipt is:

- `.skopos/runs/run-20260725T110818Z-quality-run-proof-phase-4d5696ff.json`

## Impact

- A healthy scorecard could fail closure because of orchestration wall time.
- The failure message could be confused with a product-performance regression.
- Agents could be tempted to loosen benchmark budgets that were not responsible.

## Resolution

The proof harness outer ceiling is now 900 seconds. This is an orchestration
allowance only:

1. all benchmark metric budgets remain unchanged;
2. source-loader calibration remains unchanged;
3. the recursive fixture-cleanup ceiling remains 180 seconds; and
4. the persisted scorecard still determines product proof success.

## Changelog

- 2026-07-25: Opened and resolved after the final P1-W12 proof rerun exceeded
  the 600-second outer container without producing a benchmark failure.
