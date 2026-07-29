---
title: P1-W3 Discussion Context And Sidebar Information Architecture
status: active
owner: skopos-core
id: SKOPOS-P1-W3
scope: skopos
role: task
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
lastUpdated: 2026-04-13
relatedDocs:
  - ../../overview.md
  - ../../domains/product/vision.md
  - P-37fa9180-prototype-roadmap.md
  - P-b4e43e34-prototype-implementation-checklist.md
  - ../../archive/missing-decisions-checklist.md
  - ../../scopes/skopos-ui/overview.md
  - P-11229565-system-ui.md
  - ../../decisions/011-system-ui-navigation-and-knowledge-routing.md
  - ../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md
  - ../../decisions/025-system-ui-discussion-context-and-sidebar-information-architecture.md
  - ../../findings/archive/F-20260412-discussion-memory-compaction-gap.md
reviewCycle: per workpack
---

# P1-W3 Discussion Context And Sidebar Information Architecture

Temporary execution workpack for the first UI-planning slice that turns discussion-memory runtime artifacts into a deliberate routed-console contract. This wave stays on information architecture and execution ordering before route implementation starts.

## Changelog

- `2026-04-13`: Opened to define the discussion-context UI contract and sidebar ordering before implementation, so the next routed-console slice can follow one information architecture instead of adding a premature discussion page or route drift.

- Phase: `P1`
- Workpack: `P1-W3`
- Findings: `F-20260412-discussion-memory-compaction-gap`
- Scope Packs: `SP-discussion-context-ui-and-sidebar-ia`
- Status: `active`

## Temporary Status And Removal Rule

- Temporary execution artifact. Archive or remove it once the discussion-context UI contract is implemented and durable guidance is promoted into canonical docs.

## Candidate Scope

- discussion-context placement in `overview`
- discussion-context placement in `mission detail`
- search-dock exposure for handoffs and checkpoints
- sidebar grouping and ordering confirmation
- dedicated discussion-route gate criteria
- no phase-1 `Discussion` sidebar route

## Checklist

- [x] Confirm discussion-context UI needs a dedicated information-architecture contract
- [x] Confirm phase-1 should embed discussion context before adding a dedicated discussion route
- [x] Confirm sidebar groups should stay workflow-shaped
- [x] Add the new UI decision for discussion context and sidebar ordering
- [x] Sync the system UI plan with the new phase-1 discussion surfaces
- [x] Sync the UI scope doc with the same contract
- [x] Sync roadmap and implementation checklist surfaces
- [x] Sync the active discussion-memory finding with the UI follow-through
- [x] Close this planning slice through normal Skopos validation and mission flow

## Verification Commands

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm architecture:index:check`
- `node --import tsx packages/cli/src/cli.ts workflows run instructions.sync-mirrors . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run graph.render-local-portal . --actor agent-core --json`
