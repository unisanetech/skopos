---
title: "Decision 007: Multi-Actor Mission Coordination"
status: superseded
owner: skopos-core
id: SKOPOS-DECISION-007
scope: skopos
role: decision
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
lastUpdated: 2026-07-28
relatedDocs:
  - ../D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../README.md
  - ../../architecture/artifact-model.md
  - ../../architecture/runtime-model.md
  - ../../work/plans/P-067e15c4-proof-and-benchmarking.md
  - ../../archive/missing-decisions-checklist.md
reviewCycle: per workpack
---

# Decision 007: Multi-Actor Mission Coordination

Use this decision to keep mutable mission state safe when more than one human or agent can touch the same Skopos workspace.

## Changelog

- `2026-07-28`: Superseded by Decision D-8d32a27b. Session/Task claims, leases,
  mutation attribution, Git serialization, and snapshot verification replace
  mission-only coordination.

- `2026-04-10`: Updated the decision to reflect actor-attributed `skopos plan` creation, so mission and plan provenance is visible before explicit mission claim ownership begins.
- `2026-04-10`: Added the first multi-actor coordination decision so mission ownership is explicit and silent takeover is blocked without introducing a broad workspace lock.

## Decision

1. The first multi-actor coordination surface is mission ownership, not a global workspace lock.
2. Mutable mission artifacts must carry runtime-owned coordination state:
   - current claimant
   - claim timestamp
   - last updater
3. `skopos mission claim` must require an explicit actor id.
4. `skopos mission release` and `skopos mission complete` must fail when another actor currently owns the mission unless `--force` is used.
5. Forced takeover must still record the new actor id instead of allowing anonymous override.
6. Mission coordination remains runtime-managed local state; it does not make missions durable shared truth by default.
7. `skopos plan --actor <id>` should record initial plan and mission provenance even before a mission is explicitly claimed.
8. This slice resolves mission-level ownership pressure only. It does not yet define merge behavior for every mutable artifact or a repo-wide lock strategy.

## Why

1. Plans and missions are the first mutable artifacts that agents will actively coordinate around.
2. Silent takeover is the failure mode that most directly damages trust in a multi-actor setup.
3. A narrow mission claim model improves safety without making hot-path commands or read-only flows slower.
4. Global locking would be heavier than needed for the current proof phase.
5. Initial plan provenance is useful in multi-actor work even when explicit ownership has not been claimed yet.

## Consequences

1. Mission artifacts must now include explicit coordination metadata.
2. CLI and runtime mission surfaces must expose claim, release, and completion behavior clearly.
3. CLI and runtime plan surfaces should expose initial actor provenance when a plan is created with `--actor`.
4. Proof coverage must include at least one must-win benchmark where one actor is blocked until ownership is transferred explicitly.
5. Broader concurrent-run merge behavior remains a later hardening concern after this first coordination slice.
