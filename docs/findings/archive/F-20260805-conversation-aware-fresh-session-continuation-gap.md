---
title: Conversation-Aware Fresh-Session Continuation Gap
status: closed
owner: skopos-core
id: SKOPOS-FINDING-F-20260805-CONVERSATION-AWARE-FRESH-SESSION-CONTINUATION-GAP
scope: skopos
role: finding
lifecycle: historical
authority: canonical
provenance: observed
view: current
severity: SHOULD
lastUpdated: 2026-08-05
relatedDocs:
  - ../../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md
  - ../../decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md
  - ../../architecture/agent-native-operating-model.md
  - ../../work/archive/P-20260805-conversation-aware-session-continuation-plan.md
reviewCycle: when continuation contracts or host delivery change
---

# Conversation-Aware Fresh-Session Continuation Gap

## Finding

Skopos already owns exact Task-scoped checkpoints, handoffs, raw journals,
pre-compaction hooks, and Codex, Claude Code, and manual host projections. The current
handoff compiler, however, derives its normal resume summary mainly from Task
questions, recommendations, and the next incomplete step. It does not yet preserve a
bounded, agent-authored account of the objective, user intent, corrections, rejected
approaches, Session-local progress, exact stopping position, or work that must not be
repeated.

Host adapters can refresh or inject the compact handoff, but Skopos does not yet expose
one truthful host-neutral lifecycle for starting a fresh small-context Session,
validating handoff freshness, transferring writing ownership safely, and distinguishing
prompt generation from actual host delivery and origin messaging.

## Consequence

A new coding Session can recover the formal Task while losing the working judgment
accumulated in a long conversation. Users must manually reconstruct that context, or
agents may repeat rejected work, misread intent, broaden repository discovery, or
continue from stale source and coordination state. Native host resume or transcript
replay retains context bloat and is not a portable solution.

## Required resolution

1. Enrich the existing exact Task handoff; do not create another continuation or Task
   authority.
2. Let the originating coding agent author bounded semantic conversation context while
   Skopos compiles and validates authoritative Task and Project Memory facts.
3. Bind the handoff to source, Task, Session, policy, Evidence, and coordination
   identities and classify receiving freshness explicitly.
4. Reuse existing Task claim, recovery, mutation, Evidence, Readiness, and closure
   authorities for transfer and outcome discovery.
5. Make host creation, injection, origin messaging, and completion reporting explicit
   adapter capabilities with a universal reviewed prompt fallback.
6. Prove token economy, redaction, stale/conflicted behavior, external portability,
   and no-loss continuation on real long-session scenarios.

The Finding closes only after the complete plan's acceptance and proof matrix passes.

## Resolution

Closed after Tasks `T-7e80b1cf`, `T-80f4df63`, and `T-95d0e2ba` implemented the
schemaVersion 1 hard cut and passed focused, packed external, manual-host, and real
fresh-Codex-task proof. The packed canaries are a generated minimal project and a
sanitized Billquest copy. The real Codex canary recovered objective, intent,
constraints, completed work, rejected approaches, stopping point, next action, and
exclusions without transcript replay.

The remaining Claude limitation is explicit rather than a gap in the core contract:
fresh-process creation and initial-prompt injection are not claimed, and reviewed
manual delivery remains the fallback.
