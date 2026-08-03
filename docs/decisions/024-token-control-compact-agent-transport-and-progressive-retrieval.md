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

- `2026-08-03`: Replaced unbounded Task and Verify full JSON with bounded detail
  indexes. Default summaries cap identifier lists, Verify retains all blockers inline,
  and exact Task/Verification collections use the shared cursor contract.
- `2026-08-03`: Added the shared bounded collection contract. Work Queue, Impact, and
  Action catalog JSON now default to 25 entries, cap requests at 100, use
  collection-bound opaque cursors, expose totals and next cursors, and remain below a
  32 KiB representative p50/p95 compact budget.
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

Agent-facing collection transport uses one cursor grammar:

1. default page size is 25 and the hard per-page maximum is 100
2. cursors are opaque, versioned, and bound to one named collection
3. every page reports total, offset, limit, returned count, and next cursor
4. a cursor is valid only while the underlying command input remains unchanged
5. Work Queue entries, Impact changed/Guard/Action collections, and the Action catalog
   use this contract
6. the declared default compact JSON budget for representative p50 and p95 fixtures is
   32 KiB

Action catalog pages contain execution-decision fields but omit full commands and path
lists; `actions show` remains the exact one-Action retrieval surface. Impact selects
one explicit collection per page. This avoids nesting several independently unbounded
arrays in one response.

`task show --full` and `verify --full` return bounded detail indexes, not raw complete
objects. Each index contains compact next-action truth plus every available collection,
its total, and the exact follow-up command. `--collection <name> --cursor <token>` then
retrieves one page. Compact Task output caps owned paths, selected Action ids, selected
Guard ids, and open Memory obligations while reporting omitted counts. Compact Verify
caps diagnostic identifier summaries while retaining every current blocker inline.
