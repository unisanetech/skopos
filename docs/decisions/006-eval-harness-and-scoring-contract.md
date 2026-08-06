---
title: "Decision 006: Eval Harness And Scoring Contract"
status: active
owner: skopos-core
id: SKOPOS-DECISION-006
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-08-05
relatedDocs:
  - README.md
  - ../work/archive/P-067e15c4-proof-and-benchmarking.md
  - ../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: per convergence phase
---

# Decision 006: Eval Harness And Scoring Contract

Use this decision to keep Skopos proof work comparable, durable, and resistant to feature-led drift.

## Changelog

- `2026-08-05`: Clarified evaluation-subject locality: this scorecard governs the
  brownfield proof-phase benchmark set, while the frozen Product UI Craft paired suite
  retains its own identities, rubric, isolation, blinded adjudication, and promotion
  threshold.
- `2026-04-09`: Added the eval harness and scoring contract decision after implementing the shared proof scorecard contract, benchmark categories and priorities, and passing proof-harness coverage.

## Decision

1. Proof benchmarks are declared in `internal/evals/proof-phase-benchmarks.json`.
2. Every benchmark definition must declare:
   - `id`
   - `fixture`
   - `goal`
   - `scope`
   - `category`
   - `priority`
3. Proof scorecards are built from a shared contract rather than test-local shape assumptions.
4. Every benchmark result must report:
   - benchmark status
   - passed and failed check counts
   - weighted score and max score
   - weighted pass rate
   - failed metric ids
5. The aggregate proof scorecard must report:
   - overall status
   - passed and failed benchmark counts
   - must-win benchmark counts
   - weighted score and pass rate
   - category summaries
   - active scoring policy
6. The default proof scoring policy is:
   - `minimumWeightedPassRate = 1`
   - `failOnAnyBenchmarkFailure = true`
   - `failOnAnyMustWinBenchmarkFailure = true`
7. Metric weighting defaults to:
   - `must = 2`
   - `should = 1`
8. Before-versus-after comparisons for this same proof subject must reuse the same
   benchmark and scorecard contract rather than changing the meaning of a passing
   brownfield proof run.
9. A materially different evaluation subject may use a dedicated contract when its
   required evidence cannot be represented truthfully here. Product UI Craft efficacy
   is one such subject: it requires isolated no-Skill and Skill arms, exact run
   identities, blinded independent adjudication, subjective rubric dimensions, cost,
   supervision, invalid-case accounting, and a declared promotion threshold. It does
   not replace or silently modify the proof-phase scorecard.

## Why

1. Proof work only matters if results stay comparable across iterations.
2. Test-local scorecard logic makes it too easy to change the meaning of “passing” without noticing.
3. Benchmark category summaries make it easier to see where Skopos is improving versus where it is still weak.
4. A strict initial scoring policy is appropriate while the fixture matrix is still small and intentionally must-win.

## Consequences

1. Proof harness code should import and reuse the shared scorecard contract and scoring utility.
2. New proof benchmarks must declare category and priority before they are considered canonical.
3. Future brownfield proof baseline comparisons should layer on top of the current
   scorecard contract instead of replacing it.
4. Other evaluation suites must identify their subject and authority explicitly so
   their outcomes cannot be merged with proof-phase scores or used as substitute
   Evidence.
4. The blocker and proof-decision gate is now fully resolved; remaining proof work is expansion and hardening, not decision ambiguity.
