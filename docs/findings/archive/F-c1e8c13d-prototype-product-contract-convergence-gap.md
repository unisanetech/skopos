---
title: "Finding: Prototype Product Contract Convergence Gap"
status: resolved
severity: MUST
owner: skopos-core
id: F-c1e8c13d
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-07-29
opened: 2026-07-28
resolved: 2026-07-29
relatedDocs:
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
  - ../../work/archive/T-38343e31-complete-canonical-first-release-convergence-and-prove-a.md
  - ../../patterns/PAT-4e27c8a1-retired-contracts-preserved-by-tests.md
  - ../../patterns/PAT-ec3f2b2d-stale-distribution-reanimates-retired-contracts.md
---

# Finding: Prototype Product Contract Convergence Gap

Skopos previously exposed overlapping work, capability, validation, and completion
authorities. That made the first release ambiguous for coding agents and adopters.

## Resolution

The clean pre-release convergence now publishes one lifecycle:

```text
Plan (optional) -> Task -> Actions and Guards -> Evidence -> Readiness
```

Prototype work and closure authorities, compatibility readers, commands, local paths,
UI routes, tests, and generated projections were deleted. Tracked Task Markdown is the
portable execution authority; disposable local Task state reconstructs from it.

Same-checkout cooperation is owned by SQLite-backed Session leases, Task reservations,
resource and Git claims, mutation audit, contamination detection, explicit takeover,
and Task snapshots. Project-specific commands remain registered Actions rather than a
second Skopos workflow.

Brownfield adoption now separates tolerant discovery from strict activation. Authority
conflicts are Scope-aware, familiar legacy document families are classified for agent
review, restructuring requires exact approval, and activation remains fail-closed on
metadata, links, Memory roles, operation topology, and instruction parity.

## Evidence

1. workspace typecheck passed
2. 96 canonical CLI tests passed
3. 9 canonical UI tests passed
4. the full package build passed
5. 7 release checks passed, including offline packed installation into a clean project
6. clean Task reconstruction and same-directory coordination suites passed
7. Skopos self-adoption reached `agent-ready` with all standard checks passing
8. the Unisane pilot loaded 2,267 brownfield documents without false strict-metadata
   failures or authority conflicts and registered seven project Actions

## Changelog

- `2026-07-29`: Resolved and archived after canonical proof, packed-install proof,
  self-adoption, and the Unisane brownfield pilot passed.
- `2026-07-28`: Opened during the clean product-contract convergence.
