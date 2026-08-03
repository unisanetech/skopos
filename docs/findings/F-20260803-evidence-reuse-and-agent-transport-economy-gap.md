---
title: Evidence Reuse And Agent Transport Economy Gap
status: active
severity: SHOULD
owner: skopos-core
id: F-20260803-evidence-reuse-and-agent-transport-economy-gap
scope: skopos
role: finding
lifecycle: active
authority: supporting
provenance: observed
view: current
lastUpdated: 2026-08-03
relatedDocs:
  - ../architecture/agent-native-operating-model.md
  - ../architecture/evidence-and-readiness-model.md
  - ../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: close when reusable Evidence linking and bounded progressive transport meet measured budgets
---

# Evidence Reuse And Agent Transport Economy Gap

## Finding

Skopos can reuse an exact Action Run when source, configuration, command, environment,
and tool identity remain valid. The operational path still makes agents perform
repetitive per-Task Action calls to create Evidence Links, while detailed JSON can
materialize very large path and proof collections in one response. Execution reuse is
therefore stronger than interaction reuse.

## Observed Evidence

During a downstream pilot:

1. a Task with many selected Actions required one explicit Action invocation per
   Action even when an identical source-state run already existed
2. the calls reused execution correctly but still consumed agent turns and response
   tokens solely to attach Task Evidence Links
3. a full verification response exceeded five hundred kilobytes because changed paths
   and detailed Evidence were emitted inline
4. compact command responses were materially better, confirming the current transport
   direction, but the escalation path from compact summary to exact detail was not
   consistently bounded or paginated

## Expected Contract

1. Reusable exact Action Runs can be linked to all attributable Task requirements in
   one bounded operation or automatically during verification.
2. Reuse never weakens source binding, requirement attribution, freshness, or Action
   identity.
3. Default agent JSON has an enforced response budget and returns counts, blockers,
   next action, and stable references rather than unbounded collections.
4. Detailed retrieval supports fields, pagination or cursors, and artifact references;
   `--full` means complete retrievability, not one unlimited payload.
5. Large path, Evidence, queue, and impact collections expose deterministic summaries
   and allow exact follow-up retrieval without re-running analysis.

## Impact

1. repeated tool traffic offsets some of the token savings from Project Memory
2. oversized responses can crowd out source and reasoning context
3. agents may skip detailed diagnostics because the retrieval cost is unpredictable
4. evidence-efficient execution appears inefficient at the user workflow level

## Acceptance

1. One operation links every valid reusable Action Run required by a Task and explains
   any link it rejects.
2. No Action process executes again when an exact reusable run is valid.
3. Session context, Task show, Verify, Readiness, Impact, Work Queue, and Action output
   meet declared compact byte and token budgets at p50 and p95 fixture sizes.
4. Detailed collections are retrievable through deterministic fields and cursors, with
   stable artifact references for payloads that exceed the inline budget.
5. Benchmarks report context bytes, tool calls, reused-run links, repeated executions,
   and time-to-next-correct-action against a plain-agent baseline.
6. Compact output retains every blocker and decision that can change the agent's next
   safe action.

## Resolution Progress

The exact-reuse interaction slice is implemented:

1. `skopos evidence reuse <task-id>` validates and links every reusable prior Run for
   the Task's selected Actions in one operation
2. the operation never invokes an Action process and reports this explicitly
3. linked and already-linked outcomes reconcile the Task Action step; stale runs,
   missing runs, and missing providers remain separate explained outcomes
4. compact output returns counts, a fixed unresolved slice, an omitted count, and a
   stable Task-local complete report path
5. Work Queue, Impact, and Action catalog collections now share versioned opaque
   cursors, a 25-entry default, a 100-entry maximum, totals, and next-cursor metadata
6. representative 50-entry and 1,000-entry fixtures keep their default pages below the
   declared 32 KiB JSON budget
7. Task and Verify compact summaries cap diagnostic identifiers, full output returns a
   bounded collection index, and exact detail is retrieved through shared cursors
8. a 1,000-item Task/Verification fixture remains below 32 KiB while Verify preserves
   every current blocker inline

This Finding remains active. Closure still requires common budget enforcement and
bounded Action run outputs, explicit Session context and Readiness budget proof, plus
the full cross-command and plain-agent benchmark matrix.
