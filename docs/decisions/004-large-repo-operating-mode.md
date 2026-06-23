# Decision 004: Large-Repo Operating Mode

Use this decision to keep Skopos practical on large brownfield workspaces without forcing full-workspace compilation on every run.

## Metadata

- Doc ID: `SKOPOS-DECISION-004`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `README.md`
  - `../architecture/00-architecture.md`
  - `../architecture/runtime-model.md`
  - `../architecture/artifact-model.md`
  - `../project/proof-phase-plan.md`
  - `../project/missing-decisions-checklist.md`

## Changelog

- `2026-04-09`: Added the large-repo operating-mode decision so Skopos treats subtree-targeted compilation and sliced artifacts as a first-class brownfield capability.

## Decision

1. Skopos will support subtree-targeted brownfield bootstrap and scan flows for large workspaces.
2. `init --subtree <path>` and `scan --subtree <path>` are the first required operating surfaces for this mode.
3. Subtree-targeted runs will:
   - keep workspace-level policy and canonical root commands
   - slice package scopes and downstream graph artifacts to the targeted subtree
   - preserve explicit metadata about the slice versus total workspace size
4. Large-repo proof coverage must verify:
   - scoped package counts
   - subtree-only scope artifacts
   - subtree-only graph slices
   - architecture interpretation on the selected slice
5. Incremental rebuilds remain planned, but subtree targeting is the first committed large-repo operating mechanism.

## Why

1. Large brownfield repos need cheaper, more local compilation loops before full incremental infrastructure exists.
2. Agents usually work in one area at a time, so subtree-targeted knowledge is often a better default than broad repo scans.
3. The slice must stay explicit so Skopos does not confuse a focused operating mode with the full workspace truth.
4. This is the smallest credible step toward large-repo reliability without drifting into premature infrastructure work.

## Consequences

1. Large-repo users can compile a bounded project slice without losing root command and policy context.
2. Sliced artifacts become part of the runtime contract and proof harness.
3. Future large-repo work should build on this with:
   - incremental invalidation
   - index/log compaction
   - richer scope-local context packs
4. The remaining open proof decisions narrow to:
   - tool-native enforcement strategy
   - eval harness and scoring contract
