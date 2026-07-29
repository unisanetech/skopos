---
title: Proof Hot-Path Budget Flakiness
status: resolved
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260630-PROOF-HOT-PATH-BUDGET-FLAKINESS
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-07-25
---

# Proof Hot-Path Budget Flakiness

## Summary

The proof-phase scorecard previously mixed source TypeScript-loader startup with
compiled-state command work. That made unrelated serialized runs fail hot-path budgets
even when `resolve`, `context`, `plan`, `trust`, and `impact` had not regressed.

## Evidence

`skopos workflows run quality.run-proof-phase /Users/bhaskarbarma/Desktop/TOP/skopos --actor codex` on 2026-06-30 failed with one benchmark failure:

- benchmark: `hot-path-performance`
- scorecard status: `fail`
- weighted pass rate: `0.9781021897810219`
- failed metric ids: `resolve-budget`, `context-budget`, `plan-budget`

The failing metric notes were:

- `resolve duration/scope: 1746ms/@fixture/api`
- `context duration/scope: 1811ms/@fixture/api`
- `plan duration/scope: 2265ms/@fixture/api`

The batch-level metric still passed:

- `hot-path-batch-budget`: `total hot-path duration: 7617ms`

The finding recurred on 2026-07-25 while validating P1-W11. The runtime change affected
`start` and `next`, not the measured `resolve`, `context`, `plan`, `trust`, or `impact`
commands. The serialized scorecard reported:

- scorecard status: `fail`
- weighted pass rate: `0.9635036496350365`
- failed benchmark: `hot-path-performance`
- failed metric ids: `resolve-budget`, `context-budget`, `trust-budget`,
  `impact-budget`, `hot-path-batch-budget`
- total hot-path duration/budget: `12685ms/8000ms`
- workflow receipt:
  `.skopos/runs/run-20260724T223332Z-quality-run-proof-phase.json`

## Impact

- Proof can block closure for work that did not affect hot-path runtime behavior.
- Developers and agents cannot tell quickly whether a proof failure is a real regression or local timing noise.
- The proof scorecard becomes harder to trust as a release gate.

## Needed Fix

Resolved on 2026-07-25.

1. Make hot-path proof measurement stable enough for release gating.
2. Keep strict budgets for real regressions, but reduce noise from single-run per-command spikes.
3. Consider median-of-N, warmup runs, calibrated local budgets, or requiring both per-command and batch-level failure before the benchmark fails.
4. Preserve the current report detail so agents can see which command exceeded budget.

## Resolution

The hot-path benchmark now:

1. measures a median source-loader startup baseline using the same Node and `tsx`
   process boundary as the source CLI;
2. subtracts only that shared startup baseline from each command duration;
3. keeps the original per-command and total-batch budgets unchanged;
4. preserves both raw and adjusted durations in every metric note; and
5. accepts bounded per-command overage only when the adjusted total batch still passes.

The proof test and recursive cleanup also have explicit bounded timeouts, so slow
fixture removal no longer appears as a product assertion failure.

Proof after the fix:

- command: `skopos workflows run quality.run-proof-phase /Users/bhaskarbarma/Desktop/TOP/skopos --actor codex`
- workflow receipt: `.skopos/runs/run-20260724T230227Z-quality-run-proof-phase.json`
- scorecard status: `pass`
- failed benchmarks: `0`
- weighted pass rate: `1`
- source-loader startup baseline: `1941ms`
- adjusted hot-path total/budget: `965ms/8000ms`

## Changelog

- 2026-07-25: Resolved the recurrence by calibrating out median source-loader startup,
  retaining unchanged runtime budgets and raw timing notes, bounding test/cleanup time,
  and restoring a 20/20 passing proof scorecard.
- 2026-07-25: Reopened after a serialized P1-W11 proof run failed the unrelated
  hot-path benchmark at both command and total-batch budgets.
- 2026-07-01: Resolved after the hot-path benchmark gained bounded per-command overage tolerance gated by a passing batch budget and `pnpm proof` returned a passing scorecard.
- 2026-06-30: Opened after the command-discovery mission ran proof and hit a single `hot-path-performance` failure while focused tests, typecheck, full test, and build all passed.
