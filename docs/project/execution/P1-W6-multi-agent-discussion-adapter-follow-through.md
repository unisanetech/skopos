# P1-W6 Multi-Agent Discussion Adapter Follow-Through

Temporary execution workpack for the next discussion-memory expansion after the shared runtime lane and Claude Code hooks landed. This wave made the adapter contract explicit and landed the Codex follow-through without forking the discussion-memory model.

## Metadata

- Doc ID: `SKOPOS-P1-W6`
- Status: `complete`
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
  - `../missing-decisions-checklist.md`
  - `../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `../../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
  - `../../decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`
  - `../../findings/F-20260412-discussion-memory-compaction-gap.md`

## Changelog

- `2026-04-13`: Opened after raw journals, public `skopos discuss` commands, and Claude Code hooks landed, so the next execution wave now focuses on Codex and other hosts through one shared adapter contract instead of a growing Claude-specific path.

- Phase: `P1`
- Workpack: `P1-W6`
- Findings: `F-20260412-discussion-memory-compaction-gap`
- Scope Packs: `SP-multi-agent-discussion-adapter-follow-through`
- Status: `active`

## Temporary Status And Removal Rule

- Temporary execution artifact. Archive or remove it now that the adapter-capability matrix and Codex host integration are implemented and durable guidance has been promoted into canonical docs.

## Candidate Scope

- define the adapter capability matrix for Codex, Claude Code, and fallback hosts
- keep `skopos discuss` as the only shared runtime continuity surface
- land the Codex lifecycle mapping through a wrapper-mediated adapter
- prove resume context loads from `skopos discuss recent`
- avoid introducing host-specific memory formats or transcript replay logic
- keep discussion-route work deferred until adapter coverage and checkpoint promotion are stronger

## Checklist

- [x] Add the multi-agent adapter lifecycle decision
- [x] Link the decision from roadmap, checklist, and findings
- [x] Add an explicit adapter capability matrix to the docs or generated state
- [x] Implement the Codex adapter slice against the shared discussion commands
- [x] Prove compact resume-context loading for the Codex path
- [x] Re-evaluate finding status after the second host reaches real support

## Verification Commands

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `node --import tsx packages/cli/src/cli.ts workflows run instructions.sync-mirrors . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run quality.run-proof-phase . --actor agent-core --json`
- `node --import tsx packages/cli/src/cli.ts workflows run ui.build-console-app . --actor agent-core --json`
