# P1-W5 Discussion Checkpoint History UI Slice

Temporary execution workpack for the second implementation slice under the discussion-context UI contract. This wave stays focused on generating real checkpoint artifacts, projecting checkpoint history into the routed console, and explicitly deferring any dedicated discussion route until the embedded surfaces prove insufficient.

## Metadata

- Doc ID: `SKOPOS-P1-W5`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project/execution`
- Canonical: `no`
- Last Updated: `2026-04-13`
- Review Cycle: `per workpack`
- Related Docs:
  - `../overview.md`
  - `../vision.md`
  - `../roadmap.md`
  - `../implementation-checklist.md`
  - `../../project/system-ui-plan.md`
  - `../../scopes/ui.md`
  - `../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `../../decisions/025-system-ui-discussion-context-and-sidebar-information-architecture.md`
  - `../../findings/archive/F-20260412-discussion-memory-compaction-gap.md`

## Changelog

- `2026-04-13`: Opened for the checkpoint-history follow-through slice after the first handoff-only UI adoption landed, so the routed console can now consume real checkpoint artifacts and decide later whether a dedicated discussion route is justified.

- Phase: `P1`
- Workpack: `P1-W5`
- Findings: `F-20260412-discussion-memory-compaction-gap`
- Scope Packs: `SP-discussion-checkpoint-history-ui-slice`
- Status: `active`

## Temporary Status And Removal Rule

- Temporary execution artifact. Archive or remove it once the checkpoint-history slice lands and durable guidance is promoted into canonical docs.

## Candidate Scope

- generate `.skopos/discussions/checkpoints/*.json` and `.skopos/discussions/index.json`
- keep checkpoint growth tied to material workflow-state changes instead of every brief refresh
- thread checkpoint ids into the latest workflow handoff
- load recent checkpoints into routed console state
- show checkpoint history in `overview` and `mission detail`
- add checkpoint jump targets to the search dock
- keep the sidebar unchanged and do not add a dedicated discussion route in this slice

## Checklist

- [x] Add runtime checkpoint artifacts and a discussion index
- [x] Keep checkpoint creation gated by material discussion-state changes
- [x] Link the latest handoff to recent checkpoint ids
- [x] Project checkpoint history into routed console state
- [x] Surface checkpoint history in `overview`
- [x] Surface checkpoint history in `mission detail`
- [x] Add checkpoint search-dock support
- [x] Keep the sidebar unchanged in this slice
- [x] Add targeted runtime and UI regression coverage
- [x] Sync the decision, scope, UI-plan, and finding docs with the landed slice

## Verification Commands

- `pnpm typecheck`
- `pnpm --filter @skopos/cli exec -- vitest run src/__tests__/cli.e2e.test.ts -t "writes compact agent brief artifacts, handoff state, and token telemetry"`
- `pnpm --filter @skopos/ui exec vitest run src/__tests__/discussion-selectors.test.ts src/__tests__/search-selectors.test.ts src/__tests__/build-console-app.test.ts`
- `pnpm test`
- `pnpm build`
- `node --import tsx packages/cli/src/cli.ts workflows run instructions.sync-mirrors . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run quality.run-proof-phase . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run ui.build-console-app . --actor agent-core --json`
