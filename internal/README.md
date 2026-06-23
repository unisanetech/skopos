# Skopos Internal Assets

This folder will hold Skopos-owned archetypes, policies, prompt packs, templates, evals, migrations, and failure-memory inputs.

Keep this area product-owned and generic. Project-specific mappings belong in external adapters, not in Skopos core internals.

Current active internal surface:

1. `evals/proof-phase-benchmarks.json` for the brownfield proof harness, including benchmark category and priority metadata
2. `evals/proof-phase-scorecard.ts` for the shared proof scorecard contract and scoring policy
3. `evals/proof-phase-baseline.json` for committed scorecard-baseline comparison
4. `.skopos/proof/latest-report.json` as an optional runtime-managed output written by the proof harness for the latest scorecard and baseline comparison

Current proof benchmark shape now includes:

1. a high-conflict messy brownfield lane
2. a quieter legacy-structure brownfield lane
3. a stale-docs trust lane for overdue docs metadata and weak canonical docs routing
4. an override-canonicalization lane for declared human truth that must outrank inference
5. workflow-sensitive closure
6. approval-sensitive workflow enforcement
7. large-repo subtree slicing
8. tool-native enforcement
9. self-hosted dogfooding on a deterministic tooling-workspace fixture
10. mixed brownfield diagnosis on a repo that is structurally healthy but still missing part of the canonical root command surface
11. partial architecture drift on a library-style multi-package repo that should stay in the middle band instead of being overcalled as divergent
12. before-versus-after brownfield comparison on a repo pair where stabilization must visibly improve health and trust instead of only changing static shape
