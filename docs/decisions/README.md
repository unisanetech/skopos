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
lastUpdated: 2026-07-28
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

- `2026-07-28`: Added the canonical pre-release Project Memory, Task, and coordination
  decision, archived conflicting prototype decisions, and redirected active authority
  to the canonical decision and convergence Plan.

- `2026-07-25`: Added decision 040 for project-adapted skill packs as
  task-selective projections over the existing pack and context/action/guard system.

- `2026-07-25`: Added decision 039 for the agent-native single-control-plane,
  context/action/guard, downstream adoption, phase-separated proof, and compact
  authority-aware memory contract.

- `2026-06-27`: Added decision 033 for the Memory Map and Agent Workflow Intelligence contract that maps project truth by role before scaffolding docs and guides coding-agent communication across the full workflow.
- `2026-06-27`: Added decision 032 for the workflow-recording preflight guard that prevents non-light work from bypassing mission, decision, and finding memory.
- `2026-06-26`: Added decision 031 for the bundled CLI release contract and `npx`/`npm exec`/`pnpm dlx` install UX.
- `2026-06-24`: Added decision 030 for the human guidance and developer experience contract across CLI output, UI surfaces, workpacks, and agent answers.
- `2026-06-24`: Added decision 029 for policy-pack, stack-intelligence, and durable-memory artifact ownership.
- `2026-04-09`: Added the decision log index so durable Skopos choices have a stable home before package work begins.

## Rules

1. accepted current decisions stay in this folder
2. superseded decisions move to `archive/`
3. decisions capture why the choice was made, not only what changed
4. new decisions use collision-resistant ids rather than one shared sequential counter
5. local indexes are compiled from metadata; this file is not a manual decision registry
6. archived and superseded decisions are excluded from default retrieval

## Current Product Authority

The canonical target is:

1. [Decision D-8d32a27b](D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md)
2. [Canonical convergence Plan](../work/plans/P-e7e888e6-canonical-product-convergence.md)

Conflicting prototype decisions live under `archive/`. Their historical rationale
remains inspectable, but they are excluded from default retrieval and do not define
target or current product authority.
