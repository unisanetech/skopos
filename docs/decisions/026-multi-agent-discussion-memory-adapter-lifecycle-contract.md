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
lastUpdated: 2026-07-29
relatedDocs:
  - ../architecture/agent-native-operating-model.md
  - ../architecture/artifact-model.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
---

# Decision: Multi-Agent Session Adapter Lifecycle Contract

## Changelog

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

Claude Code, Codex, and manual hosts may differ in hook coverage, but they never invent
host-specific work semantics. Each adapter reports whether enforcement is observed,
cooperative, hooked, or mediated.
