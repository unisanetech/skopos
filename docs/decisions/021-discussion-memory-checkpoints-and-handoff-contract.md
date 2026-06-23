# Decision: Discussion Memory, Checkpoints, And Handoff Contract

## Metadata

- Doc ID: `SKOPOS-DECISION-021`
- Status: `accepted`
- Date: `2026-04-12`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-04-13`
- Related Docs:
  - `../00-start-here.md`
  - `../project/overview.md`
  - `../project/vision.md`
  - `../project/roadmap.md`
  - `../project/implementation-checklist.md`
  - `../architecture/artifact-model.md`
  - `../architecture/retrieval-and-query-strategy.md`
  - `../architecture/decision-escalation-model.md`
  - `020-workflow-router-questions-recommendations-and-eval-contract.md`
  - `022-program-router-sequencing-and-obligation-contract.md`
  - `026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`

## Changelog

- `2026-04-13`: Simplified the product lane again. Raw journals remain local support and `skopos discuss sync-codex` remains a manual support command, but the routed UI no longer auto-syncs Codex sessions during app build and no longer treats raw transcripts as a default app surface.
- `2026-04-13`: Tightened parent-session Codex segmentation to use structured workspace evidence only, so nested workspace import now matches on workspace-touching tool cwd/path signals or direct project mention in user/assistant conversation rather than arbitrary text inside large tool-output blobs. `skopos discuss sync-codex` now reconciles the per-session raw journal to the current segmented turn set instead of leaving stale false positives behind.
- `2026-04-13`: Added Codex Desktop local-session backfill through `skopos discuss sync-codex`, so Skopos can import raw user and assistant turns from `~/.codex/sessions/*.jsonl` without spending model tokens on conversation capture. Exact-workspace sessions import directly; parent repo-root sessions must be segmented by workspace evidence before any turns are written into a nested workspace journal.
- `2026-04-13`: Made checkpoint promotion semantic instead of artifact-shaped, so explicit promotion paths now record change kinds such as mission change, direction change, accepted-decision change, open-question change, or next-command change, while linked-artifact churn alone no longer mints a new checkpoint.
- `2026-04-13`: Split checkpoint promotion from resume-artifact refresh, so `skopos next`, `skopos program sync`, and `skopos discuss handoff` now refresh only handoff plus prompt-budget surfaces while checkpoints remain limited to explicit promotion paths such as `start`, `decide`, `eval`, `discuss checkpoint`, and adapter-reported major state changes.
- `2026-04-13`: Landed raw local turn journals under `.skopos/discussions/raw/*.jsonl`, added public `skopos discuss append-turn|checkpoint|handoff|recent` commands, generated Claude Code lifecycle hooks, and generated the Codex wrapper adapter under `.skopos/tooling/codex/` so continuity now has real multi-host lifecycle paths instead of depending only on brief-refresh side effects.
- `2026-04-13`: Implemented the first generated checkpoint family under `.skopos/discussions/checkpoints/*.json` plus `.skopos/discussions/index.json`, so handoffs now link to recent checkpoint ids and routed UI surfaces can consume checkpoint history without reading raw chat.
- `2026-04-12`: Added the first-class discussion-memory contract so Skopos can preserve accepted direction, rejected options, open questions, and compact handoff state across chat compaction and new-thread continuation without treating raw transcripts as primary workflow memory.

## Context

Skopos now has a real post-discussion router through `skopos start`, `skopos next`, `skopos decide`, and `skopos eval`. That closes a large part of the supervision gap, but one critical memory problem remains:

1. planning and execution still start inside live chat discussion
2. accepted direction, rejected paths, and open rationale can disappear when chat context compacts
3. new chats still depend too much on manually restated context
4. saving whole transcripts would make the system slow, noisy, and token-hungry

The missing layer is not transcript storage as shared truth. The missing layer is a compact discussion-memory lane between transient chat and durable workflow state.

## Decision

Adopt a first-class discussion-memory lane under `.skopos/discussions/` with a strict compiled-memory model:

1. record every turn cheaply as local raw journal state
2. compile only meaningful discussion shifts into checkpoints
3. generate one compact handoff artifact before compaction, thread close, or new-thread continuation
4. never treat raw chat transcripts as default prompt memory or shared repo truth

This keeps continuity durable without making the core router or retrieval path context-hungry.

## Canonical Artifact Contract

### Raw Turn Journal

Path:

1. `.skopos/discussions/raw/<thread-id>.jsonl`

Purpose:

1. cheap append-only local audit trail
2. recovery surface for checkpoint and handoff generation
3. not a default retrieval or prompt-injection surface

Rules:

1. append one record per user or assistant turn
2. local-only by default
3. not committed
4. short-retention or rotation-friendly
5. not loaded into the default routed UI or prompt context

Each turn record should stay compact and include fields such as:

1. `threadId`
2. `id`
3. `role`
4. `recordedAt`
5. `excerpt`
6. `message`
7. `sourceEvent`
8. `sessionId`
9. `transcriptPath`
10. `activeMissionId`

### Discussion Checkpoints

Path:

1. `.skopos/discussions/checkpoints/<checkpoint-id>.json`
2. `.skopos/discussions/index.json`

Purpose:

1. durable working-memory summary for meaningful discussion shifts
2. compact continuity across long work sessions
3. searchable rationale surface for humans and agents

Rules:

1. do not create a checkpoint for every turn
2. create or refresh checkpoints only when discussion meaning changes
3. keep checkpoints structured and compact
4. checkpoints are local runtime memory by default unless promoted into canonical workflow or docs surfaces

Checkpoint trigger examples:

1. a scope changes
2. a user accepts one option
3. a user rejects one path
4. a mission or plan starts
5. a blocker or finding appears
6. the recommended next step changes materially
7. a structural constraint or non-obvious risk becomes explicit

Each checkpoint should include fields such as:

1. `id`
2. `threadId`
3. `title`
4. `topic`
5. `summary`
6. `status`
7. `goal`
8. `acceptedDecisions`
9. `rejectedOptions`
10. `openQuestions`
11. `recommendedNextStep`
12. `constraints`
13. `risks`
14. `linkedMissionId`
15. `linkedPlanId`
16. `linkedDecisionIds`
17. `linkedFindingIds`
18. `evidenceRefs`
19. `turnRange`
20. `supersedesCheckpointId`

### Handoff Artifacts

Path:

1. `.skopos/discussions/handoffs/<thread-id>.json`

Purpose:

1. compact resume packet for context compaction
2. canonical new-thread bootstrap surface for recent discussion continuity
3. bridge from discussion state into router and mission state

Rules:

1. generate automatically before compaction, thread close, or explicit resume handoff
2. use current active checkpoints plus recent raw turns to compile one compact summary
3. do not inject raw transcripts into the next context by default
4. overwrite or supersede the prior handoff for the same active thread instead of accumulating giant summaries

Each handoff should include fields such as:

1. `threadId`
2. `createdAt`
3. `goal`
4. `currentDirection`
5. `acceptedDecisions`
6. `rejectedPaths`
7. `openQuestions`
8. `recommendedNextStep`
9. `linkedMissionId`
10. `linkedPlanId`
11. `linkedCheckpointIds`
12. `recentEvidenceRefs`
13. `resumeSummary`

## Token And Retrieval Contract

Discussion memory must stay token-friendly by policy, not by hope.

### Core Rule

1. save broadly
2. load narrowly

### Required Loading Policy

Default prompt reload should include only:

1. the latest handoff
2. the active mission when present
3. active workflow questions
4. active workflow recommendations
5. at most a few active checkpoints when they add unique context

Default prompt reload must not include:

1. full raw transcript history
2. large checkpoint archives
3. superseded discussion branches unless explicitly requested

### Budget Targets

1. checkpoint artifacts should stay compact and structured rather than long prose blobs
2. a handoff should stay under roughly `600-1200` tokens
3. resume context should stay under roughly `1500` injected discussion-memory tokens by default

If a handoff exceeds that range, the system should compress it further before reuse rather than passing the overflow directly into the model context.

## Lifecycle And Adapter Contract

The host or adapter, not the model alone, must own the save triggers.

### Required Runtime Hooks

1. `append-turn`
   - called after every user and assistant turn
2. `checkpoint`
   - called when discussion meaning changes or when the router creates a major execution-state transition
3. `handoff`
   - called before compaction, thread close, or new-thread continuation

### Promotion Discipline

1. checkpoint creation must stay explicit rather than piggybacking on every resume refresh
2. `start`, `decide`, `eval`, `discuss checkpoint`, and adapter-reported `major-state-change` events are valid promotion paths
3. `next`, `program sync`, and `discuss handoff` must refresh only handoff plus budgeted resume artifacts unless they also carry an explicit checkpoint trigger
4. handoff refreshes may update linked checkpoint references, but they must not mint a new checkpoint when the accepted direction has not changed
5. explicit checkpoint paths must still classify semantic change before writing a new checkpoint
6. linked artifact path churn, regenerated brief timestamps, or other derived-output-only changes must not count as checkpoint-worthy discussion change

Promotion kinds should stay compact and focus on execution-relevant deltas such as:

1. initial state
2. active mission changed
3. current direction changed
4. accepted decisions changed
5. open questions changed
6. recommended next command changed

### Command Baseline

The first runtime surface should provide:

1. `skopos discuss append-turn`
2. `skopos discuss checkpoint`
3. `skopos discuss handoff`
4. `skopos discuss recent`

These should remain lower-level discussion-memory commands. They complement the workflow router rather than replace `start`, `next`, `decide`, or `eval`.

### Adapter Responsibilities

Tool adapters for Codex, Claude Code, and similar environments should:

1. append raw turns automatically
2. trigger checkpoint proposals when router state or discussion state changes materially
3. trigger handoff generation before compaction or thread switching
4. bootstrap a resumed thread from the latest handoff instead of replaying raw discussion

The current shipped adapter baseline is:

1. Claude Code native hooks:
   - `SessionStart` loads compact additional context from `skopos discuss recent`
   - `UserPromptSubmit` appends the user turn into the raw journal
   - `PreCompact` refreshes the latest workflow handoff before compaction
   - `Stop` appends the assistant turn, refreshes a checkpoint, then runs the existing closure gate
2. Codex wrapper-mediated adapter:
   - `session-start` forwards `skopos discuss recent --json`
   - `user-turn` and `assistant-turn` append raw turns through `skopos discuss append-turn`
   - `major-state-change` refreshes checkpoints through `skopos discuss checkpoint`
   - `pre-compact` refreshes the latest handoff through `skopos discuss handoff`
   - when direct wrapper lifecycle events are unavailable, `skopos discuss sync-codex` may backfill the latest matching raw journal from the local Codex Desktop session log under `~/.codex/sessions/*.jsonl`
   - this is a manual support lane, not a default hot-path side effect during UI rendering or normal route builds
   - exact-workspace sessions may import directly
   - parent repo-root sessions may import only after turn-block segmentation proves the block is relevant to the nested workspace through structured workspace evidence
   - valid parent-session evidence is limited to workspace-touching tool cwd/path signals or direct project mention in user/assistant conversation, not arbitrary text inside tool-output blobs
   - parent-session segmentation must never import unrelated repo-root chat wholesale into the nested workspace journal
   - sync must reconcile the journal for that session to the current segmented turn set so tightened heuristics remove stale false positives instead of only blocking new imports

## Workflow-Router Integration

Discussion memory should feed workflow state, not compete with it.

1. `skopos start` may open the first checkpoint for a new goal
2. promoted discussion checkpoints may become program-router candidates before a new mission is started
3. `skopos next` should be able to read the current accepted direction and recent checkpoint rationale
4. `skopos decide` should update both workflow question state and discussion checkpoint state when a decision closes a thread of discussion
5. `skopos eval` should be able to report whether the evaluated work satisfied the discussion-defined objective, not only whether checks passed

Promote durable discussion outcomes into canonical surfaces when appropriate:

1. plans
2. missions
3. questions
4. recommendations
5. decision docs
6. findings

Do not keep all durable meaning trapped in discussion artifacts forever.

## UI Contract

The routed UI should expose discussion memory selectively.

Primary surfaces:

1. search and command dock
   - recent discussion checkpoints
   - latest handoff
   - open discussion-derived questions
2. mission detail
   - latest accepted direction
   - why the mission exists
   - recent checkpoint changes
3. future discussion route or panel
   - recent checkpoints
   - superseded directions
   - current handoff summary

The UI should not default to showing raw turn logs as the main surface.

## Commit And Retention Policy

1. raw turn journals are local-only by default
2. checkpoints are local runtime memory by default unless explicitly promoted
3. handoffs are local runtime memory by default
4. promoted outcomes should move into shared truth surfaces such as decisions, findings, plans, missions, questions, or recommendations
5. old raw journals and superseded handoffs should be eligible for rotation or cleanup without harming canonical workflow state

## Consequences

### Positive

1. accepted direction survives context compaction and new-chat continuation
2. users do not need to keep restating recent decisions manually
3. agents can resume with compact grounded memory instead of broad transcript replay
4. discussion continuity becomes part of the Skopos artifact model instead of staying in chat-only memory

### Costs

1. adapters need lifecycle-hook integration
2. the runtime gains another local artifact family
3. checkpoint quality must stay disciplined to avoid recreating transcript bloat in JSON form

## Next Action

Implement in this order:

1. artifact model update for raw turns, checkpoints, handoffs, and index state
2. runtime contracts and low-level `skopos discuss` commands
3. compaction and new-thread handoff hooks in agent adapters
4. search and mission-detail exposure for recent checkpoints and handoffs
5. later promotion and cleanup policies once the first memory lane is stable
