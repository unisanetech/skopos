---
title: "Decision: Multi-Agent Session Adapter Lifecycle Contract"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-026
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-04-13
lastUpdated: 2026-08-05
relatedDocs:
  - ../architecture/agent-native-operating-model.md
  - ../architecture/artifact-model.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - 021-discussion-memory-checkpoints-and-handoff-contract.md
  - ../work/archive/P-20260805-conversation-aware-session-continuation-plan.md
---

# Decision: Multi-Agent Session Adapter Lifecycle Contract

## Changelog

- `2026-08-05`: Verified truthful Codex task creation and prompt injection, manual
  host-neutral rendering, and the declared capability gap for Claude fresh-process
  creation and injection. Generated, accepted, and delivered remain distinct states.
- `2026-08-05`: Defined fresh-session continuation as one host-neutral Task handoff
  plus an optional truthful host delivery capability. Session creation, initial-prompt
  injection, origin messaging, and completion reporting are adapter capabilities, not
  Skopos core guarantees.
- `2026-07-29`: Rebased host adapters on stable Session identity, compact context, and
  close Readiness.

## Decision

Every host adapter projects the same lifecycle:

1. open or heartbeat a stable Session
2. inject `skopos session context`
3. bind Task start to that Session
4. report edit or command checkpoints when the host supports them
5. create a compact handoff before compaction
6. require close Readiness before stopping a current Task
7. close the Session explicitly

When the user explicitly requests a fresh continuation, the adapter lifecycle is:

1. refresh the exact Task checkpoint and enriched handoff
2. verify that running Actions, open mutations, claims, or contamination do not make
   transfer unsafe
3. use the existing Session recovery, Task claim, and disposition authorities to
   transfer or release writing ownership
4. create a receiving Session only when the host exposes that capability
5. inject a bounded initial prompt containing the verified handoff and live restore
   commands
6. make the receiving Session validate freshness before resuming the Task
7. optionally message the originating Session from canonical Task, Evidence,
   Readiness, and closure state

Each adapter reports whether it can create a Session, inject an initial prompt,
identify and message the origin, detect pre-compaction, and report completion. A
generated copy-and-paste prompt is the universal fallback. Native resume is not fresh
continuation because it may retain the bloated conversation context.

Claude Code, Codex, and manual hosts may differ in hook coverage, but they never invent
host-specific work semantics. Each adapter reports whether enforcement is observed,
cooperative, hooked, or mediated.
