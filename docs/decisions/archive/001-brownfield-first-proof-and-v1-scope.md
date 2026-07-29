---
title: "Decision 001: Brownfield-First Wedge, Proof Target, And V1 Scope"
status: superseded
owner: skopos-core
id: SKOPOS-DECISION-001
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
  - ../../domains/product/positioning.md
  - ../../work/plans/P-067e15c4-proof-and-benchmarking.md
  - ../../archive/missing-decisions-checklist.md
reviewCycle: per workpack
---

# Decision 001: Brownfield-First Wedge, Proof Target, And V1 Scope

Use this decision to keep Skopos focused on the adoption wedge that matters most during incubation.

## Changelog

- `2026-07-28`: Superseded by Decision D-8d32a27b. The first release is governed by
  one unversioned, project-agnostic proof contract.

- `2026-04-09`: Added the first durable product-scope decision so Skopos leads with a brownfield wedge and a realistic v1 ecosystem claim.

## Decision

1. Skopos will lead with a brownfield adoption wedge:
   - make coding agents safer and more reliable on existing repos
2. The first proof target will be three must-win workflows:
   - clean existing repo change
   - messy repo change with conflicting patterns
   - workflow-sensitive change with required custom scripts and closure requirements
3. Skopos v1 support will be explicit and narrow:
   - Node and TypeScript first
   - `package.json` repos first
   - `pnpm` first, with `npm` and `yarn` tolerated where detection is straightforward
4. Skopos will not claim broad multi-language support until a later adapter phase proves it.

## Why

1. Most real adoption pain is brownfield, not greenfield.
2. Generic coding agents are weakest when repos are inconsistent, poorly documented, or workflow-heavy.
3. A narrow v1 support lane prevents the product from sounding broader than the implementation really is.
4. A small must-win proof set is better than a large but vague roadmap.

## Consequences

1. Proof-phase work should favor brownfield fixtures over greenfield polish.
2. Product framing, evals, and demos should emphasize existing-repo stabilization.
3. Non-Node ecosystems remain explicitly out of scope for the first proof phase.
4. Future expansion should happen only after the brownfield wedge is proven.
