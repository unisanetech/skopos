---
title: P1-W4 Discussion Context UI Slice
status: active
owner: skopos-core
id: SKOPOS-P1-W4
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
  - P-11229565-system-ui.md
  - ../../scopes/skopos-ui/overview.md
  - ../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md
  - ../../decisions/025-system-ui-discussion-context-and-sidebar-information-architecture.md
  - ../../findings/archive/F-20260412-discussion-memory-compaction-gap.md
reviewCycle: per workpack
---

# P1-W4 Discussion Context UI Slice

Temporary execution workpack for the first implementation slice under the discussion-context UI contract. This wave stays focused on projecting the latest workflow handoff into the routed console and search without adding a dedicated discussion route.

## Changelog

- `2026-04-13`: Opened for the first implementation slice after the discussion-context UI decision landed, so the routed console can now project the latest handoff into `overview`, `mission detail`, and the search dock before any dedicated discussion route is considered.

- Phase: `P1`
- Workpack: `P1-W4`
- Findings: `F-20260412-discussion-memory-compaction-gap`
- Scope Packs: `SP-discussion-context-ui-slice`
- Status: `active`

## Temporary Status And Removal Rule

- Temporary execution artifact. Archive or remove it once the first discussion-context UI slice lands and durable guidance is promoted into canonical docs.

## Candidate Scope

- project `.skopos/discussions/handoffs/latest-workflow.json` into console state
- add `Recent discussion` to `overview`
- add `Discussion context` to `mission detail`
- add discussion handoff jump targets to the search dock
- add narrow regression coverage for selectors, search, and app-state build output
- no dedicated `Discussion` route in this slice

## Checklist

- [x] Load the latest discussion handoff into console state
- [x] Add route-owned selectors for overview and mission detail discussion context
- [x] Add `Recent discussion` to `overview`
- [x] Add `Discussion context` to `mission detail`
- [x] Add search-dock support for the latest discussion handoff
- [x] Keep the sidebar unchanged in this slice
- [x] Add targeted UI regression coverage
- [x] Sync the UI and finding docs with the landed slice
- [x] Close this implementation slice through normal Skopos validation and mission flow

## Verification Commands

- `pnpm typecheck`
- `pnpm --dir ../../.. --filter @skopos/ui exec vitest run src/__tests__/discussion-selectors.test.ts src/__tests__/search-selectors.test.ts src/__tests__/build-console-app.test.ts`
- `pnpm test`
- `pnpm build`
- `node --import tsx packages/cli/src/cli.ts workflows run instructions.sync-mirrors . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run quality.run-proof-phase . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run ui.build-console-app . --actor agent-core --json`
