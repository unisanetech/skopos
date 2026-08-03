# Skopos Internal Assets

This folder will hold Skopos-owned archetypes, policies, prompt packs, templates, evals, migrations, and failure-memory inputs.

Keep this area product-owned and generic. Project-specific mappings belong in external adapters, not in Skopos core internals.

Current active internal surface:

1. `evals/proof-phase-benchmarks.json` for the brownfield proof harness, including benchmark category and priority metadata
2. `evals/proof-phase-scorecard.ts` for the shared proof scorecard contract and scoring policy
3. `evals/proof-phase-baseline.json` for committed scorecard-baseline comparison
4. `evals/operational-reliability-baseline.json` for observed-versus-target metrics from generic reliability characterization fixtures
5. `.skopos/evidence/proof/latest-report.json` as an optional runtime-managed output written by the proof harness for the latest scorecard and baseline comparison

The operational reliability baseline is descriptive, not accepted target behavior. A
characterization test locks the reproducible current measurement while the adjacent
target records the intended zero-false-selection contract. Implementation Tasks should
move the observed metrics toward the target and update the baseline in the same proven
change.

Current proof benchmark shape now includes:

1. a high-conflict messy brownfield lane
2. a quieter legacy-structure brownfield lane
3. a stale-docs trust lane for overdue docs metadata and weak canonical docs routing
4. workflow-sensitive closure
5. approval-sensitive workflow enforcement
6. large-repo subtree slicing
7. tool-native enforcement
8. self-hosted dogfooding on a deterministic tooling-workspace fixture
9. mixed brownfield diagnosis on a repo that is structurally healthy but still missing part of the canonical root command surface
10. partial architecture drift on a library-style multi-package repo that should stay in the middle band instead of being overcalled as divergent
11. before-versus-after brownfield comparison on a repo pair where stabilization must visibly improve health and trust instead of only changing static shape
