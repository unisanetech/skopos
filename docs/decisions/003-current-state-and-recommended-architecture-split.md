---
title: "Decision 003: Current-State And Recommended Architecture Split"
status: active
owner: skopos-core
id: SKOPOS-DECISION-003
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-04-09
relatedDocs:
  - README.md
  - ../architecture/00-architecture.md
  - ../architecture/runtime-model.md
  - ../architecture/artifact-model.md
  - ../work/archive/P-067e15c4-proof-and-benchmarking.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: per convergence phase
---

# Decision 003: Current-State And Recommended Architecture Split

Use this decision to keep brownfield architecture interpretation honest and agent-usable.

## Changelog

- `2026-04-09`: Added the brownfield architecture-interpretation decision so current-state and recommended-state models stay distinct in Skopos artifacts and proof benchmarks.

## Decision

1. Skopos will keep brownfield architecture interpretation in a dedicated `.skopos/index/architecture.json` artifact.
2. The artifact will contain two distinct views:
   - current architecture
   - recommended architecture
3. The artifact will also carry:
   - `alignmentStatus`
   - unresolved human decisions
   - compact evidence for both views
4. `init` is the first required compilation path for this artifact in brownfield repos.
5. Proof-phase coverage must verify both outcomes:
   - clean repos stay aligned
   - messy repos diverge toward a clearer recommended target

## Why

1. Brownfield repos need an honest model of what exists now, not only an idealized recommendation.
2. Agents need a safer recommended target when the current repo is inconsistent.
3. Humans need to see whether Skopos thinks the repo is already aligned or still needs stabilization.
4. Keeping both views in one typed artifact is simpler than hiding the distinction in narrative docs.

## Consequences

1. Architecture interpretation becomes part of the compiled project knowledge layer, not just a docs idea.
2. Brownfield bootstrap now produces a clearer stabilization surface for both humans and agents.
3. Trust, portal, and future CI surfaces can explain whether the repo is aligned or still divergent.
4. The next proof-phase pressure should move to the remaining open decisions:
   - large-repo operating mode
   - eval scoring contract
   - tool-native enforcement strategy
