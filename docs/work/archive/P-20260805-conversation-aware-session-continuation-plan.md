---
title: Conversation-Aware Fresh-Session Continuation Plan
status: complete
owner: skopos-core
id: SKOPOS-PLAN-P-20260805-CONVERSATION-AWARE-SESSION-CONTINUATION
scope: skopos
role: plan
lifecycle: historical
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-08-05
relatedDocs:
  - ../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md
  - ../../decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md
  - ../../architecture/agent-native-operating-model.md
  - ../../architecture/artifact-model.md
  - ../../findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md
reviewCycle: after every child Task closure
---

# Conversation-Aware Fresh-Session Continuation Plan

## Outcome

Allow a user to continue one long coding-agent conversation in a fresh, small-context
Session without losing the current objective, user intent, accumulated constraints,
verified progress, rejected approaches, exact stopping position, or next action.

This completes the existing Discussion Memory and Task handoff capability. It does not
introduce a new work object, transcript authority, Evidence system, closure mechanism,
or host-specific workflow.

## Product contract

The receiving Session gets one bounded continuation prompt compiled from:

```text
live Project Memory and Task truth
  + agent-authored conversation capsule
  + exact source and coordination freshness
  + safe ownership-transfer state
  + host-neutral restore instructions
```

Project Memory and live Task, Evidence, Readiness, source, and coordination state win
when remembered conversation conflicts with current truth. Raw transcripts remain
generated diagnostics and are not normal continuation input.

## Boundaries

1. Extend `.skopos/handoffs/<worktree-id>/<task-id>/handoff.json` in place under the
   existing `schemaVersion: 1` clean-refactor policy.
2. Keep the coding agent responsible for conversation interpretation and semantic
   summarization.
3. Keep Skopos responsible for Task identity, Project Memory routing, validation,
   coordination, Evidence freshness, Readiness, token budget, and handoff generation.
4. Reuse Session recovery, Task reservation, claims, mutation ledger, Action recovery,
   and Task disposition. Do not create a second transfer path.
5. Treat direct cross-chat messaging as optional delivery. Canonical Task state and an
   optional immutable closure snapshot remain sufficient to discover the outcome.
6. Require explicit user intent before creating a new host Session. Never archive or
   delete the old Session implicitly.
7. Keep Skills task-selective and advisory; no Skill owns continuation state or host
   delivery.

## Conversation capsule

The capsule contains only information that cannot be reconstructed reliably from live
Task state:

1. objective, user intent, and why the work matters
2. accumulated user constraints and corrections
3. completed work in the originating Session
4. current tactical position and exact stopping point
5. attempts and concise outcomes
6. rejected approaches and reasons
7. unresolved uncertainties
8. recommended first action
9. work that must not be repeated
10. explicit exclusions

Every material statement is classified as `user-direction`, `accepted-decision`,
`verified-fact`, `working-assumption`, `agent-recommendation`, `rejected-option`, or
`open-question`, with source references when available.

## Freshness and safety

The handoff binds workspace, worktree, Task revision, originating Session, host/thread
reference when available, branch and commit, owned-path fingerprint, current claims and
mutation state, policy identity, relevant Skill selection identity, valid Evidence,
and creation time. Acceptance classifies it as:

1. `current`: resume normally
2. `refreshable`: rebuild live facts while preserving still-valid semantic context
3. `stale`: inspect changed owned state before work
4. `conflicted`: reconcile claims, Actions, or mutations before ownership transfer
5. `invalid`: reject the mismatched Project or Task handoff

## Context economy and privacy

Target a 2,000–4,000 token continuation prompt. Preserve user direction, rejected
approaches, unresolved questions, current position, and next action before routine
command history. Replace detail with exact references rather than copying documents,
diffs, logs, or source files. Report `overBudget` rather than silently truncating
meaning.

Reject or redact secrets and sensitive values. Exclude hidden model reasoning,
unrelated conversation, raw tool output, and full transcripts. Record which content
was agent-authored and which was compiled by Skopos, and expose a human-readable review
before external host delivery.

## Host capability contract

Each adapter reports whether it can:

1. create a fresh Session
2. inject an initial prompt
3. identify the originating Session
4. message the originating Session
5. detect pre-compaction
6. report completion

Codex may automate all supported operations through its task APIs. Claude Code and
other CLI hosts may launch a fresh interactive process and use hooks or MCP where
available. IDE hosts use their declared integrations. Every host supports the manual
fallback: render and copy one reviewed continuation prompt. Generated is not delivered,
and native resume is not fresh continuation.

## Delivery sequence

### 1. Contract hard cut

- extend the existing handoff model with the bounded conversation capsule, provenance,
  freshness identity, validation outcome, and delivery state
- update all producers, consumers, tests, UI projections, and host projections together
- delete the shallow-only construction path; add no migrations, aliases, or fallback
  readers

### 2. Runtime and CLI/MCP parity

- accept structured agent-authored context through one runtime owner
- compile Task and Project Memory facts around it
- expose create/refresh, show, verify, accept, and prompt-rendering behavior through CLI
  and MCP without duplicating logic
- make current, refreshable, stale, conflicted, invalid, sensitive, and over-budget
  results machine-readable

### 3. Safe Session transfer

- refresh the Task checkpoint and enriched handoff
- block unsafe transfer for running Actions, open mutations, contamination, or live
  conflicting claims
- reuse audited Session recovery and Task disposition for release or ownership transfer
- require the receiving Session to reload `skopos session context` and validate the
  handoff before continuing

### 4. Host-neutral delivery

- render one stable initial-prompt contract
- add explicit adapter capability reporting and delivery outcomes
- retain the manual copy-and-paste path as the universal baseline
- never make host task creation a Skopos core guarantee

### 5. Codex delivery

- create a fresh Codex task only after explicit user request
- preserve the correct project directory and inject the verified continuation prompt
- return the created task identity
- optionally report canonical completion state to the originating task
- classify creation, injection, and messaging failures without overstating success

### 6. Claude Code and manual-host delivery

- extend existing pre-compaction and Session lifecycle projections
- support fresh interactive launch where the adapter can prove it
- keep native resume distinct from fresh continuation
- prove the same handoff works without Codex-specific fields or semantics

### 7. Human-facing UI and guidance

- use the existing Discussion surface to show objective, agreements, completed work,
  stopping point, next action, exclusions, freshness, destination host, and delivery
  outcome
- provide Review handoff, Copy prompt, Start new task when supported, and Refresh stale
  handoff actions
- keep the presentation conversational and avoid a raw-record dashboard or a new
  top-level route unless usage later proves it necessary
- synchronize CLI help, developer workflows, generated host instructions, and adapter
  capability documentation

### 8. Portability and efficacy proof

Prove the complete contract through Skopos self-hosting and one external project across:

- one real long Codex conversation continued into a fresh Codex task
- one Claude Code or manual-host continuation
- a dirty worktree with unrelated changes
- current, refreshable, stale, conflicted, and invalid handoffs
- interrupted Session and running-Action recovery boundaries
- valid Evidence reuse and relevant invalidation
- secret-like input redaction or rejection
- a near-budget capsule and explicit over-budget failure
- unsupported-host manual fallback
- completed Task discovery with and without direct origin messaging
- clean reconstruction without local handoff or transcript state

## Acceptance

1. A fresh receiving Session understands the objective, user intent, corrections,
   rejected approaches, verified progress, stopping point, and next action without raw
   transcript replay.
2. Live Task and repository truth override stale remembered context.
3. No continuation path permits two conflicting Task writers.
4. Host creation, injection, delivery, and messaging claims are independently truthful.
5. CLI, MCP, host projections, and UI consume the same runtime contract.
6. Token and privacy boundaries fail explicitly and do not silently lose meaning.
7. Existing Task, Session, Memory, Evidence, Readiness, Skill, and closure authorities
   remain singular.
8. The open Finding closes only after the full portability and efficacy proof passes.

## Non-goals

- full transcript synchronization or replay
- background LLM summarization after every turn
- vector search over conversations or cross-project personal memory
- a continuation Task type, receipt system, Evidence authority, or closure workflow
- automatic new-session creation without explicit user intent
- implicit archival or deletion of the originating Session
- host-specific semantics in Skopos core
- schema V2, compatibility bridges, or deprecated readers
- guaranteed origin messaging on hosts that do not expose it
- claims that an agent-authored summary is perfectly complete

## Completion evidence

Completed through Tasks `T-7e80b1cf`, `T-80f4df63`, and high-impact integration Task
`T-95d0e2ba`. The shared runtime and schemaVersion 1 contract now serve CLI, MCP, host
projections, and the read-only UI. Every CLI and MCP handoff operation can bind an
explicit `taskId`, so a multi-Task checkout never relies on a workspace-global latest
handoff.

The packed integration report at
`.skopos/evidence/continuation/external-portability.json` passes for a minimal project
and a sanitized Billquest copy. It covers all five freshness classes, secret redaction,
near- and over-budget behavior, interrupted Action recovery, Evidence invalidation,
manual prompt rendering, and clean reconstruction. The real Codex delivery report at
`.skopos/evidence/continuation/codex-delivery.json` records successful fresh-task
creation, initial-prompt injection, and recovery of every required semantic field.

Claude fresh-process creation and automatic initial-prompt injection remain unproven
host capabilities. Its projection therefore reports hook-assisted/manual delivery;
the reviewed host-neutral prompt remains the universal fallback. No efficacy claim is
made for subjective output quality beyond the bounded comprehension receipt.
