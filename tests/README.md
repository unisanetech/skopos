# Skopos Tests

Keep Skopos tests split into:

1. package-local unit and integration tests
2. repo-level e2e flows
3. regression fixtures for known failures
4. performance tests for large-repo indexing and incremental rebuilds

Current active coverage starts in `packages/cli/src/__tests__/cli.e2e.test.ts`, backed by `fixtures/repos/basic-monorepo`.

Proof-phase benchmark coverage now also lives in `packages/cli/src/__tests__/proof-phase.e2e.test.ts`, backed by:

1. `fixtures/repos/clean-service`
2. `fixtures/repos/basic-monorepo`
3. `fixtures/repos/messy-monorepo`
4. `fixtures/repos/legacy-multi-package`
5. `fixtures/repos/approval-workflow-repo`
6. `fixtures/repos/large-monorepo`
7. `fixtures/repos/stale-docs-repo`
8. `fixtures/repos/canonical-override-repo`
9. `fixtures/repos/boundary-aware-workspace`
10. `fixtures/repos/self-hosted-tooling-workspace`
11. `fixtures/repos/mixed-brownfield-monorepo`
12. `fixtures/repos/library-structure-drift`
13. `fixtures/repos/brownfield-stabilization-delta-before`
14. `fixtures/repos/brownfield-stabilization-delta-after`

The current proof scorecard now covers:

1. clean brownfield bootstrap and planning
2. messy brownfield diagnosis for a high-conflict repo
3. quieter legacy brownfield structure drift with canonical docs and instructions but weak workspace boundaries
4. workflow-sensitive closure
5. approval-sensitive workflow enforcement for destructive workflows that require explicit approval
6. stale-docs trust for weak canonical docs routing and overdue docs metadata
7. override and canonicalization behavior when human-declared truth outranks inference
8. current-state versus recommended-state architecture interpretation
9. large-repo subtree targeting and sliced compiled artifacts
10. tool-native enforcement through generated Claude Code hook execution
11. deterministic self-hosted dogfooding coverage for workflow discovery, trust readiness, and portal rendering
12. mixed brownfield diagnosis coverage for repos that should land in `needs-stabilization` without being treated as high-conflict
13. partial architecture-drift coverage for a library-style multi-package repo that should stay `partial`, not `divergent`
14. before-versus-after brownfield comparison coverage where stabilization must produce a measurable repo-health and trust delta

The proof harness now uses a shared scorecard contract with:

1. benchmark category and priority metadata
2. weighted benchmark scoring
3. must-win benchmark aggregation
4. per-category summaries

The proof harness now also compares the latest scorecard against:

1. `internal/evals/proof-phase-baseline.json`

The same proof run now also persists the latest scorecard and baseline comparison to:

1. `.skopos/proof/latest-report.json`
