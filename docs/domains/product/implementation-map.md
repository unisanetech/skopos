---
title: Product Implementation Map
status: active
owner: skopos-core
id: SKOPOS-PRODUCT-IMPLEMENTATION-MAP
scope: skopos
role: domain
lifecycle: durable
authority: supporting
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - ../../architecture/00-architecture.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when package ownership changes
---

# Product Implementation Map

## Changelog

- `2026-07-29`: Mapped the canonical first-release capabilities to their current owners.

| Capability | Owner |
| --- | --- |
| Project and Scope contracts | `packages/model`, `packages/config` |
| Repository discovery and semantic indexes | `packages/indexer` |
| Scoped Memory retrieval | `packages/query` |
| Plans and Task recommendations | `packages/planner` |
| Document catalog and adoption restructuring | `packages/docs-engine`, `packages/runtime/src/application/adoption` |
| Agent instructions and host adapters | `packages/instructions` |
| Task lifecycle and Work Queue | `packages/runtime/src/application/task`, `work-queue`, `session` |
| Actions and Guards | `packages/indexer`, `packages/runtime/src/application/actions`, `guards` |
| Evidence, verification, and Readiness | `packages/verification`, `packages/runtime/src/application/verification` |
| Same-directory coordination | `packages/runtime/src/application/coordination` |
| CLI and MCP | `packages/cli`, `packages/mcp` |
| Human projection | `packages/ui` |

## Release-Critical Proof

1. clean-clone reconstruction
2. brownfield restructuring and activation
3. parallel Session conflict and takeover behavior
4. acceptance-linked Evidence freshness
5. packed CLI installation
6. heterogeneous fixtures
7. Skopos self-adoption and Unisane adoption
