---
title: Session And Task Recovery And Disposition Gap
status: resolved
severity: MUST
owner: skopos-core
id: F-20260803-session-task-recovery-and-disposition-gap
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-03
relatedDocs:
  - ../../architecture/agent-native-operating-model.md
  - ../../decisions/D-20260803-audited-stale-session-task-recovery.md
  - ../../decisions/D-20260803-explicit-task-work-disposition-state-machine.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: archived after crash, concurrency, host-parity, and disposition proof passed
---

# Session And Task Recovery And Disposition Gap

## Finding

Stale Session recovery, active Action crashes, ownership release, and Task work
disposition did not form one complete operable state machine across public hosts.

## Acceptance

1. stale recovery covers clean, contaminated, active-Action, and in-progress Git cases
2. safe recovery is auditable and never requires the stale Session to act
3. every disposition has deterministic state and Work Queue meaning
4. concurrent recovery has one winner
5. CLI, MCP, Session Context, Task projection, and UI report the same state

## Resolution

Audited stale Task recovery now transfers or releases ownership only after
contamination, mutation-ledger, and running-Action checks pass. A live actor can
recover only an expired Action lease, producing an interrupted artifact with actor,
reason, prior lease, and exact retry command; live execution remains protected.
Explicit reasoned Task dispositions remain separate from claim release. CLI and MCP
call the same Action recovery, coordination recovery, and disposition runtimes, while
the intentionally read-only UI reports the canonical disposition record. Fixtures
cover active Action, dirty open Git mutation, contamination, all dispositions,
concurrent one-winner recovery, MCP dispatch, Session resume context, and UI output.
