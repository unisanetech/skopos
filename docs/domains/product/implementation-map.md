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
lastUpdated: 2026-08-13
relatedDocs:
  - ../../architecture/00-architecture.md
  - ../../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when package ownership changes
---

# Product Implementation Map

## Changelog

- `2026-08-13`: Mapped current and planned response-guidance ownership so host
  delivery, token control, onboarding conversation, and evaluation have explicit
  implementation homes.
- `2026-07-29`: Mapped the canonical first-release capabilities to their current owners.

| Capability | Owner |
| --- | --- |
| Project and Scope contracts | `packages/model`, `packages/config` |
| Repository discovery and semantic indexes | `packages/indexer` |
| Scoped Memory retrieval | `packages/query` |
| Plans and Task recommendations | `packages/planner` |
| Document catalog and adoption restructuring | `packages/docs-engine`, `packages/runtime/src/application/adoption` |
| Agent instructions and host adapters | `packages/instructions` |
| Canonical response contract and instruction projection | `packages/instructions/src/application/communication-contract`, `packages/instructions` |
| Response-mode selection and compact Session rendering | `packages/runtime/src/application/session` |
| Generated project communication brief | `packages/runtime/src/application/shared` |
| Response and transport contract tests | `packages/cli/src/__tests__`, `packages/cli/src/benchmarks` |
| Task lifecycle and Work Queue | `packages/runtime/src/application/task`, `work-queue`, `session` |
| Actions and Guards | `packages/indexer`, `packages/runtime/src/application/actions`, `guards` |
| Evidence, verification, and Readiness | `packages/verification`, `packages/runtime/src/application/verification` |
| Same-directory coordination | `packages/runtime/src/application/coordination` |
| CLI and MCP | `packages/cli`, `packages/mcp` |
| Human projection | `packages/ui` |

## Response-Guidance Status

Current implementation generates the stable plain-language and terminology-translation
rules, selects `direct-answer`, `work-start`, `progress`, `decision`, or `completion`,
emits only the selected compact Session shape and material state, and avoids unchanged
reinjection. Claude Code, Codex-wrapper, Copilot-mirror, and manual projections use the
canonical communication-brief path and semantic contract proof. Unified setup loads
its detailed conversation layer only during the stages that need it. Focused response
shape and token-budget tests cover this contract without adding a per-response model
judge. Broader representative evaluations may expand over time, but they are not a
missing runtime owner or a second response authority.

## Release-Critical Proof

1. clean-clone reconstruction
2. brownfield restructuring and activation
3. parallel Session conflict and takeover behavior
4. acceptance-linked Evidence freshness
5. packed CLI installation
6. heterogeneous fixtures
7. Skopos self-adoption and heterogeneous external-project adoption
