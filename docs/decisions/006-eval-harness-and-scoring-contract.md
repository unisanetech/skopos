# Decision 006: Eval Harness And Scoring Contract

Use this decision to keep Skopos proof work comparable, durable, and resistant to feature-led drift.

## Metadata

- Doc ID: `SKOPOS-DECISION-006`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `README.md`
  - `../project/proof-phase-plan.md`
  - `../project/missing-decisions-checklist.md`
  - `../project/implementation-checklist.md`

## Changelog

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
8. Future before-versus-after comparisons must reuse the same benchmark and scorecard contract rather than inventing a second evaluation format.

## Why

1. Proof work only matters if results stay comparable across iterations.
2. Test-local scorecard logic makes it too easy to change the meaning of “passing” without noticing.
3. Benchmark category summaries make it easier to see where Skopos is improving versus where it is still weak.
4. A strict initial scoring policy is appropriate while the fixture matrix is still small and intentionally must-win.

## Consequences

1. Proof harness code should import and reuse the shared scorecard contract and scoring utility.
2. New proof benchmarks must declare category and priority before they are considered canonical.
3. Future baseline-comparison work should layer on top of the current scorecard contract instead of replacing it.
4. The blocker and proof-decision gate is now fully resolved; remaining proof work is expansion and hardening, not decision ambiguity.
