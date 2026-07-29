---
title: "F-20260410-proof-comparison-transience: Proof Comparison Lived Only In
  Transient Harness Output"
status: done
owner: skopos-core
id: SKOPOS-F-20260410-PROOF-COMPARISON-TRANSIENCE
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-04-10
relatedDocs:
  - ../README.md
  - ../../architecture/artifact-model.md
  - ../../work/plans/P-067e15c4-proof-and-benchmarking.md
  - ../../work/archive/P-b4e43e34-prototype-implementation-checklist.md
reviewCycle: per workpack
---

# F-20260410-proof-comparison-transience: Proof Comparison Lived Only In Transient Harness Output

## Changelog

- `2026-04-10`: Closed after the proof harness began writing `.skopos/proof/latest-report.json` with the current scorecard and committed baseline comparison, making proof output durable for self-hosting and review.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `proof-phase batch closure`
- Current State: closed. Proof comparison now persists as a runtime-managed artifact under `.skopos/proof/latest-report.json` instead of disappearing with test output.

## Symptom

1. The proof harness computed a scorecard and baseline comparison in memory.
2. Passing proof runs exposed the result only through test assertions and console exit state.
3. Self-hosted Skopos had no durable artifact showing the latest proof status after `pnpm proof`.

## Impact

1. Before-versus-after proof state was harder to inspect after the harness finished.
2. Dogfooding produced less reusable runtime knowledge than it should.
3. Proof results were easier to forget than plan, trust, or diagnosis artifacts because they left no local machine-readable output.

## Fix Plan

1. Add a typed proof-report artifact contract for the latest scorecard and baseline comparison.
2. Make the proof harness write `.skopos/proof/latest-report.json` on each run.
3. Update artifact and proof docs so the report is part of the normal self-hosted proof loop.

## Verification

1. `pnpm proof` now writes `.skopos/proof/latest-report.json`.
2. The artifact includes both the current scorecard and committed baseline comparison.
3. The proof harness fails if the written artifact does not match the passing result it just computed.

## Linked Docs

1. `../README.md`
2. `../../architecture/artifact-model.md`
3. `../../work/plans/P-067e15c4-proof-and-benchmarking.md`
