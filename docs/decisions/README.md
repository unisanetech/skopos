---
title: Skopos Decisions
status: active
owner: skopos-core
id: SKOPOS-DECISIONS-INDEX
scope: skopos
role: router
lifecycle: durable
authority: supporting
provenance: declared
view: current
lastUpdated: 2026-08-05
relatedDocs:
  - ../architecture/00-architecture.md
  - ../domains/product/vision.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when owning truth changes
---

# Skopos Decisions

Use this folder for durable Skopos architectural and product decisions.

## Changelog

- `2026-08-05`: Removed the stale sequential decision diary from this router and made
  metadata, not directory presence or a hand-maintained list, the retrieval authority.
  Clarified that historical or superseded decisions belong in `archive/` only after
  their still-valid truth and incoming links are reconciled.
- `2026-07-28`: Added the canonical pre-release Project Memory, Task, and coordination
  decision, archived conflicting prototype decisions, and redirected active authority
  to the canonical decision and convergence Plan.

## Rules

1. accepted current or target decisions stay in this folder only while their metadata
   and content remain truthful
2. superseded or historical decisions move to `archive/` after still-valid rules are
   promoted and links are repaired
3. decisions capture why the choice was made, not only what changed
4. new decisions use collision-resistant ids rather than one shared sequential counter
5. local indexes are compiled from metadata; this file is not a manual decision registry
6. archived and superseded decisions are excluded from default retrieval

## Current Product Authority

The canonical target is:

1. [Decision D-8d32a27b](D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md)
2. [Canonical convergence Plan](../work/plans/P-e7e888e6-canonical-product-convergence.md)

Metadata-derived indexing determines what enters normal retrieval. Directory presence
alone does not make a document current authority. Historical rationale belongs under
`archive/`, remains available for targeted inspection, and does not define current or
target product behavior.
