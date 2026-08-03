---
title: "Decision: Token Control, Compact Agent Transport, And Progressive Retrieval"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-024
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-04-12
lastUpdated: 2026-08-03
relatedDocs:
  - ../architecture/retrieval-and-query-strategy.md
  - ../architecture/agent-native-operating-model.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
---

# Decision: Token Control, Compact Agent Transport, And Progressive Retrieval

## Changelog

- `2026-08-03`: Added one-call Task Evidence reuse with a bounded compact summary,
  inline unresolved outcomes, and a stable complete report reference. Verification
  remains non-mutating.
- `2026-07-29`: Consolidated compact transport into Session context and Task/Scope
  deltas.

## Decision

Agent context is progressive:

1. inject compact Session context
2. select current Task or Work Queue recommendation
3. load the relevant Scope chain and canonical Memory
4. fetch source, graph, Pattern, or history slices only when needed
5. return deltas while input digests remain unchanged

The communication brief has a bounded token budget and stable marker. Logs, raw
transcripts, full graphs, every Policy, and every document are never injected by
default. Compact output must preserve blockers, approvals, next action, and proof
status rather than hiding them for brevity.

Exact project-level Action Evidence enters a Task through one explicit batch operation,
not repeated Action calls and not a hidden Verify mutation. Compact reuse output
contains counts, every inline unresolved outcome that fits the fixed collection cap,
the number omitted from the inline slice, and a stable Task-local report path. A full
detail request means the complete data remains retrievable; it does not authorize the
default agent response to grow without a budget.
