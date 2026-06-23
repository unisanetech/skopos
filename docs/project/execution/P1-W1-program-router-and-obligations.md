# P1-W1 Program Router And Obligation Control Plane

Temporary execution workpack for the first broad Skopos batch that defines the program-router layer above the now-implemented mission router. This wave stays focused on the control-plane contract, the first program-state artifact, explicit docs and UI obligations, and the first UI adoption path rather than widening into unrelated runtime or surface expansion.

## Metadata

- Doc ID: `SKOPOS-P1-W1`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project/execution`
- Canonical: `no`
- Last Updated: `2026-04-12`
- Review Cycle: `per workpack`
- Related Docs:
  - `../overview.md`
  - `../vision.md`
  - `../roadmap.md`
  - `../implementation-checklist.md`
  - `../system-ui-plan.md`
  - `../missing-decisions-checklist.md`
  - `../../findings/F-20260412-program-router-and-obligation-gap.md`
  - `../../decisions/020-workflow-router-questions-recommendations-and-eval-contract.md`
  - `../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `../../decisions/022-program-router-sequencing-and-obligation-contract.md`
  - `../../decisions/023-supervision-cost-and-workflow-weight-discipline.md`

## Changelog

- `2026-04-12`: Landed the first routed UI adoption slice, so `overview`, `mission detail`, `trust`, and the search dock now consume `.skopos/program/state.json` directly while the remaining workpack scope narrows to discussion-memory promotion plus richer workflow question/recommendation visibility.
- `2026-04-12`: Landed the first runtime slice, so `.skopos/program/state.json`, `skopos program sync`, and `skopos program next` are now implemented while the remaining workpack scope narrows to discussion-memory promotion plus routed UI adoption.
- `2026-04-12`: Updated the workpack with the supervision-cost and workflow-weight discipline, so the first program-router slice is now explicitly constrained to one low-noise control-plane artifact and the minimum workflow-state UX needed to reduce supervision.
- `2026-04-12`: Opened after the workflow and discussion-memory review clarified the next missing layer: Skopos needs a program router above `start` and `next`, plus typed docs and UI obligations, before agents can sequence accepted work with low supervision cost.

- Phase: `P1`
- Workpack: `P1-W1`
- Findings: `F-20260412-program-router-and-obligation-gap`
- Scope Packs: `SP-program-router-and-obligations`
- Status: `active`

## Temporary Status And Removal Rule

- Temporary execution artifact. Archive or remove it once the first program-router slice lands, the durable contract is promoted into canonical docs, and active implementation sequencing no longer depends on this workpack.

## Candidate Scope

- program-router decision and planning doctrine
- supervision-cost versus workflow-weight doctrine for control-plane additions
- `.skopos/program/state.json` artifact contract
- `skopos program sync`
- `skopos program next`
- typed docs and UI obligations
- first UI adoption path for workflow-state and program-state visibility

## Checklist

- [x] Define the program-router and obligation contract
- [x] Record the current gap as an active finding
- [x] Sync the roadmap, implementation checklist, and self-hosting read path
- [x] Add the first UI planning doctrine for workflow-state adoption
- [x] Add `.skopos/program/state.json` to the runtime artifact model
- [x] Add the supervision-cost and workflow-weight guardrail for the first program-router slice
- [x] Implement `skopos program sync`
- [x] Implement `skopos program next`
- [ ] Feed promoted discussion checkpoints into program candidates
- [x] Add the first routed UI adoption slice for `overview`, `mission detail`, `trust`, and the `search dock`

## Verification Commands

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm architecture:index:check`
- `node --import tsx packages/cli/src/cli.ts workflows run instructions.sync-mirrors . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run maintenance.refresh-knowledge . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run quality.run-proof-phase . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run ui.build-console-app . --actor agent-core --json`
