# F-20260412-discussion-memory-compaction-gap: Discussion Continuity Still Depends Too Much On Transient Chat Memory

## Metadata

- Doc ID: `SKOPOS-F-20260412-DISCUSSION-MEMORY-COMPACTION-GAP`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-04-13`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../project/vision.md`
  - `../project/overview.md`
  - `../architecture/artifact-model.md`
  - `../decisions/020-workflow-router-questions-recommendations-and-eval-contract.md`
  - `../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`

## Changelog

- `2026-04-13`: Simplified the shipped discussion product surface again. Raw journals and Codex session backfill remain available as local support, but the routed app no longer auto-syncs Codex during UI build or renders raw transcripts as a default product surface. That cuts workflow weight while preserving compiled continuity.
- `2026-04-13`: Narrowed the gap again after explicit checkpoint paths were switched to semantic promotion kinds, so linked-artifact churn or other derived-output-only drift no longer creates fresh checkpoints; the remaining work is broader host coverage and tuning the explicit promotion heuristics further if product usage shows noise.
- `2026-04-13`: Narrowed the gap again after checkpoint promotion was split from handoff-only refresh, so `next`, `program sync`, and `discuss handoff` no longer broaden the checkpoint lane when they only need updated resume context; the remaining work is broader host coverage and smarter promotion heuristics inside explicit checkpoint paths.
- `2026-04-13`: Narrowed the gap again after the adapter-capability matrix, generated Codex wrapper adapter, and routed `Overview` adapter-support surface landed, so the remaining work is no longer “Codex support missing”; it is smarter checkpoint promotion and broader host coverage beyond the first two real adapters.
- `2026-04-13`: Added the multi-agent adapter lifecycle decision and active follow-through workpack, so the remaining continuity gap is now explicitly routed toward Codex and broader host coverage instead of staying as an implied “later” task.
- `2026-04-13`: Narrowed the gap again after raw journals, public `skopos discuss` commands, and generated Claude Code lifecycle hooks landed, so the remaining work is no longer basic continuity capture; it is broader adapter coverage, smarter checkpoint promotion, and later route escalation only if usage justifies it.
- `2026-04-13`: Narrowed the gap again after generated checkpoints and routed checkpoint history landed, so the remaining work now centers on raw turn journals, adapter-triggered checkpoint plus handoff hooks, and only later a dedicated discussion route if real checkpoint volume justifies it.
- `2026-04-13`: Narrowed the gap again after the first routed-console adoption slice landed, so the latest workflow handoff is now visible in `overview`, `mission detail`, and the search dock; the remaining UI gap is richer checkpoint exposure and later route promotion only if the embedded surfaces prove insufficient.
- `2026-04-13`: Narrowed the open gap to UI follow-through after the information-architecture decision landed, so the remaining work now centers on projecting handoffs and checkpoints into `overview`, `mission detail`, and the search dock instead of still arguing about whether discussion memory belongs in the product at all.
- `2026-04-12`: Opened after the workflow-router review surfaced the still-missing continuity layer: Skopos can now route work after discussion, but it still lacks compact checkpoint and handoff memory across chat compaction and new-thread continuation.

## Summary

- Severity: `SHOULD`
- Status: `in-progress`
- Owner: `skopos-core`
- Target Pack: `discussion memory lane`
- Current State: open but narrower. Skopos now has generated checkpoints, a discussion index, a compact handoff, routed checkpoint history in `overview`, `mission detail`, the search dock, and the dedicated `Discussion` route, plus local raw journals, generated Claude Code lifecycle hooks, Codex wrapper support, Codex Desktop local-session backfill with parent-session workspace segmentation, and a product-visible adapter support matrix. Checkpoint promotion is now limited to explicit lifecycle paths and keyed off semantic deltas instead of every resume refresh or linked-artifact churn. Raw transcripts remain local support, not default UI workflow state. The remaining gap is broader host coverage and smarter promotion heuristics.

## Symptom

1. Users and agents can agree on a direction, but that accepted direction is not yet compiled into a dedicated discussion-memory artifact.
2. Long-running threads still risk losing rationale, rejected options, and recent execution intent when context compacts.
3. Starting a new chat still depends too much on manual restatement or broad transcript recall.
4. Saving the entire transcript would solve continuity badly by making prompts noisy and token-hungry.

## Impact

1. Long-running agent work still costs more user supervision than intended.
2. Accepted direction can drift even when workflow state is otherwise healthy.
3. Cross-chat continuity is weaker than the product vision promises.
4. The latest handoff and checkpoint history are now surfaced where users work, and both Claude Code and Codex can now map into the shared continuity lane, but other agent surfaces still need equivalent lifecycle coverage and the current checkpoint promotion path is still broader than ideal.

## Fix Plan

1. Extend lifecycle coverage beyond Claude Code and Codex Desktop so the discussion lane is not adapter-specific.
2. Keep raw turn journals local-only and non-default for retrieval.
3. Keep tightening checkpoint promotion so explicit checkpoint paths use meaningful-state heuristics instead of broad or noisy promotion.
4. Continue using compact handoff generation before compaction, thread close, or new-thread continuation.
5. Keep Codex Desktop local-session import aligned with the shared `skopos discuss` runtime instead of allowing a separate memory path to emerge.
6. Keep the parent-session segmentation contract evidence-based and reconciled so nested workspaces never import unrelated repo-root discussion wholesale or retain stale false-positive imports after the heuristic tightens.

## Verification

1. A long-running discussion can compact without losing the accepted direction.
2. A new chat can resume from the latest handoff without replaying the raw transcript.
3. Resume context stays compact instead of growing with transcript length.
4. Workflow router state and discussion-memory state stay aligned for current missions.
5. The routed console surfaces recent discussion context without loading raw chat into default prompt context.
6. The remaining gap is now broader host coverage and smarter promotion heuristics rather than missing raw journals, missing Codex integration, missing routed checkpoint visibility, or handoff-only refresh noise.

## Linked Docs

1. `registry.md`
2. `../project/vision.md`
3. `../project/overview.md`
4. `../architecture/artifact-model.md`
5. `../decisions/020-workflow-router-questions-recommendations-and-eval-contract.md`
6. `../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
7. `../decisions/025-system-ui-discussion-context-and-sidebar-information-architecture.md`
8. `../decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`
