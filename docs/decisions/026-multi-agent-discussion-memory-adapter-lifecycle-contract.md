# Decision: Multi-Agent Discussion-Memory Adapter Lifecycle Contract

## Metadata

- Doc ID: `SKOPOS-DECISION-026`
- Status: `accepted`
- Date: `2026-04-13`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Related Docs:
  - `../project/roadmap.md`
  - `../project/implementation-checklist.md`
  - `../project/missing-decisions-checklist.md`
  - `../architecture/artifact-model.md`
  - `../architecture/retrieval-and-query-strategy.md`
  - `021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `024-token-control-compact-agent-transport-and-progressive-retrieval.md`
  - `../findings/archive/F-20260412-discussion-memory-compaction-gap.md`

## Changelog

- `2026-04-17`: Extended the adapter capability matrix so `.skopos/enforcement.json` and the routed adapter-support UI now show workflow-router coverage explicitly, including router-guided session start and stop-boundary enforcement.
- `2026-04-16`: Tightened the adapter contract so generated Claude Code and Codex session-start paths now merge `skopos program next --json` into compact resume context, the Claude stop hook now blocks on the router's explicit next command before falling back to `done`, and the Codex wrapper now exposes the same stop boundary through an explicit `stop` event.
- `2026-04-13`: Simplified the shipped product posture again. Codex local-session fallback remains available through `skopos discuss sync-codex`, but it is now explicitly a manual support lane rather than a default routed-UI side effect, and raw transcripts remain local support rather than a first-class app surface.
- `2026-04-13`: Added a Codex Desktop local-session fallback through `skopos discuss sync-codex`, so wrapper-mediated support no longer depends only on live wrapper events when the active desktop thread already persists raw conversation in `~/.codex/sessions/*.jsonl`. Exact-workspace sessions import directly; parent repo-root sessions now require structured workspace segmentation, and sync reconciles the nested workspace journal to the current segmented turn set.
- `2026-04-13`: Implemented the first explicit adapter capability matrix in `.skopos/enforcement.json`, generated the Codex wrapper-mediated adapter under `.skopos/tooling/codex/`, and surfaced adapter support in the routed `Overview` so support status is now product-visible instead of doc-only.
- `2026-04-13`: Added the multi-agent adapter lifecycle contract so the shipped Claude Code hook path becomes one implementation of a portable discussion-memory adapter model rather than the de facto product shape.

## Context

Skopos now has a real discussion-memory runtime lane:

1. raw local journals
2. compact checkpoints
3. compact handoffs
4. public `skopos discuss` commands

It also has one shipped host integration through generated Claude Code hooks. That is useful, but it is not enough for the product claim. Skopos is intended to work with Codex, Claude Code, and similar agent hosts. If the lifecycle model stays Claude-specific, the core continuity lane will fragment into one-off wrappers and uneven behavior across tools.

## Decision

Adopt one portable adapter lifecycle contract above the shared `skopos discuss` runtime lane.

The core runtime stays host-neutral. Agent hosts only translate their lifecycle events into the shared discussion commands and resume-context surfaces.

## Core Runtime Surface

The shared runtime contract remains:

1. `skopos discuss append-turn`
2. `skopos discuss checkpoint`
3. `skopos discuss handoff`
4. `skopos discuss recent`

These commands are the stable product surface. Host adapters are thin translation layers on top of them.

## Required Lifecycle Events

Every serious agent adapter should map, as available, into these logical events:

1. `session-start`
   - load compact resume context from `skopos discuss recent`
   - merge the current `skopos program next` recommendation so resume guidance stays on the routed workflow path
2. `user-turn`
   - append the new user turn into the raw local journal
3. `assistant-turn`
   - append the latest assistant turn into the raw local journal
4. `major-state-change`
   - refresh a compact checkpoint when workflow or discussion state changed materially
5. `pre-compact`
   - refresh the latest workflow handoff before context is collapsed

Adapters with a native or wrapper-mediated stop boundary should also check the current program-router recommendation before falling back to closure enforcement so explicit `decide`, `eval`, or `mission complete` steps do not get hidden behind a generic stop block.

If a host does not expose one of these events directly, its adapter must choose the closest safe fallback rather than inventing a separate memory system.

## Adapter Tiers

Adapters should be classified explicitly instead of pretending every host supports the same lifecycle.

### Tier 1: Native Lifecycle Adapter

The host exposes enough lifecycle hooks to automate:

1. session start
2. user turn capture
3. assistant turn capture
4. pre-compact handoff

Current status:

1. `Claude Code`: implemented

### Tier 2: Wrapper-Mediated Adapter

The host does not expose all hooks directly, but Skopos can still automate continuity through a wrapper, middleware, or app-integrated thread boundary.

Current status:

1. `Codex`: implemented through a generated wrapper manifest and entrypoint under `.skopos/tooling/codex/`, plus local-session backfill from `~/.codex/sessions/*.jsonl` when live wrapper lifecycle capture is not the active path

### Tier 3: Manual Fallback

The host exposes no reliable lifecycle hooks. Users can still use the shared runtime manually:

1. `skopos discuss append-turn`
2. `skopos discuss checkpoint`
3. `skopos discuss handoff`
4. `skopos discuss recent`

This is acceptable as a fallback, but it is not enough to claim first-class adapter support.

## Codex-Specific Follow-Through

The next Codex slice should not bypass the shared runtime. It should:

1. identify which Codex thread or app lifecycle events are actually available
2. map those events into the shared discussion commands
3. inject compact resume context from `skopos discuss recent`
4. avoid replaying raw transcripts
5. keep prompt-tail loading under the existing token budget
6. prefer local-session import for raw capture when the desktop host already persists the conversation and direct lifecycle hooks are not available
7. when the Codex session is rooted above the workspace, segment turn blocks by workspace evidence before importing any raw discussion into the nested project

The Codex adapter must not introduce a second prompt-memory or journaling format.

## Host-Neutral Rules

1. keep raw journals local-only
2. keep checkpoints compact and selective
3. keep handoffs as the default resume packet
4. never load raw journals into default prompt context
5. keep host adapters thin and deterministic
6. do not move provider- or host-specific event names into the core runtime contract

## Capability Matrix Requirement

Skopos should maintain an explicit capability matrix for adapter status:

1. host name
2. support tier
3. session-start support
4. user-turn capture support
5. assistant-turn capture support
6. pre-compact support
7. workflow-router session-start guidance support
8. workflow-router stop-boundary enforcement support
9. current implementation status
10. known gaps

This avoids vague claims such as “supports Codex and Claude Code” when the actual lifecycle coverage differs.

## Consequences

### Positive

1. Claude Code becomes one implementation of a general contract
2. Codex now lands through the same continuity system instead of a parallel memory path
3. the product claim is auditable through an adapter matrix in `.skopos/enforcement.json`
4. discussion-memory behavior stays consistent across hosts

### Costs

1. Skopos must keep adapter support surfaced explicitly in docs and routed UI
2. other hosts still need real adapter slices before they can be claimed as first-class
3. host-specific constraints may still require wrapper-mode fallbacks

## Next Action

Implement in this order:

1. keep the adapter capability matrix current as additional hosts land
2. tighten checkpoint promotion so wrapper-mediated adapters do not create noisy checkpoint churn
3. add the next real host against the same `skopos discuss` runtime
4. keep the discussion-memory finding open until adapter coverage and checkpoint discipline are both strong enough
