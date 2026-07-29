---
title: "Task: Coordination Lifecycle Integration"
status: complete
owner: skopos-core
id: T-7c91d2e4
scope: skopos
role: task
lifecycle: historical
authority: supporting
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../../architecture/runtime-model.md
reviewCycle: historical
---

# Task: Coordination Lifecycle Integration

## Goal

Connect host Session context and Task start to the transactional coordination broker
without claiming preventive edit safety.

## Boundaries

1. Session context idempotently opens or heartbeats one explicit host Session.
2. Task start reserves the created Task and claims declared owned paths.
3. Claude Code and Codex adapters pass stable host Session identity.
4. Completion and lease expiry do not release ownership implicitly.
5. Mutation ledger, contamination, takeover, and pre-edit blocking remain later work.
6. Closure must select proportional owner/dependent proof and must not accept skipped
   checks as complete Evidence.
7. The public project-capability surface uses Actions and Evidence; the old Workflow
   command and declaration directory are deleted without aliases.
8. The internal Action execution and Evidence core uses canonical names, artifact
   fields, and service owners without Workflow/Receipt aliases.

## Proof

1. runtime and CLI affected-package typechecks passed
2. focused coordination lifecycle and broker proof passed
3. focused Claude Code and Codex adapter projection proof passed
4. fourteen focused assertions passed across the lifecycle/adapter set
5. four focused validation-economy regression cases passed
6. six source-bound Action Evidence/receipt cases passed
7. two public Action discovery/execution/approval cases passed
8. model, indexer, trust, runtime, instructions, planner, UI, and CLI focused type
   checks passed across the renamed contract boundary
9. six focused Action Evidence cases passed against the renamed implementation

## Removal Rule

Pending only the proportional closure-evidence path. Durable behavior is promoted and
focused proof is complete, but the current eval selector expands this bounded slice to
the unrelated root validation catalog. Keep this Task active until the mission can
close without that known over-selection.

## Changelog

- `2026-07-29`: Extended only to repair the proportional closure blocker discovered by
  this Task: root documentation classification, owner-versus-dependent proof, and
  skipped-check status.
- `2026-07-29`: Proved the closure repair with four focused regressions. Root commands
  no longer appear, downstream packages receive type proof only, and skipped dry-run
  checks produce `needs-review`. The remaining 18-command transitional catalog belongs
  to the planned Actions/Evidence cutover and was not executed.
- `2026-07-29`: Began the clean Actions/Evidence cutover. Moved declarations to
  `tools/skopos/actions/**`, replaced the public CLI with
  `skopos actions list|show|run`, projected Task lanes and Evidence vocabulary, removed
  the old command without an alias, and passed eight focused Action/Evidence cases.
- `2026-07-29`: Completed the internal Action/Evidence execution-core cutover. Renamed
  the model, loader, matcher, runtime executor, run artifact, validator, adapter, and
  focused proof; generated runs now use `action-run`, `actionId`, and `evidence`.
  Task recommendation and Eval/Readiness vocabulary remains a separate convergence
  slice.
- `2026-07-29`: Kept active after `skopos done` correctly refused closure without an
  eval artifact; did not run the known over-selected root validation catalog. Archive
  after proportional focused evidence can satisfy closure.
- `2026-07-29`: Completed and archived after lifecycle, broker, and adapter proof;
  promoted the implemented behavior and remaining cooperative boundary into durable
  architecture and Decision docs.
- `2026-07-29`: Opened for the bounded coordination lifecycle integration slice.
