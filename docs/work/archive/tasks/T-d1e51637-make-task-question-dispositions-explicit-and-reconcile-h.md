---
title: "Task: Make Task question dispositions explicit and reconcile historical terminal Tasks"
status: complete
owner: "codex"
id: T-d1e51637
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-67a4f6e7b44892bf
lastUpdated: 2026-08-11
---

# Task: Make Task question dispositions explicit and reconcile historical terminal Tasks

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Make Task question dispositions explicit and reconcile historical terminal Tasks

## Acceptance

- Questions support resolved, dismissed, and promoted terminal dispositions with actor, reason, time, and optional durable target
- Cancelling or superseding a Task leaves no open questions and preserves an auditable disposition
- Completed historical Tasks with open questions are reconciled without inventing answers
- Source and packed lifecycle fixtures cover terminal and reconstructed question semantics

## Non-Goals

- Do not implement semantic drift, browser receipts, or convention Memory inference in this Task

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 3 non-workspace Scopes.

## Owned Paths

- `docs/findings/F-20260811-task-question-closure-invariant-gap.md`
- `docs/work/archive/tasks`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/task-portability.test.ts`
- `packages/cli/src/cli/commands/router.ts`
- `packages/cli/src/cli/commands/task.ts`
- `packages/cli/src/cli/help.ts`
- `packages/model/src/contracts/skopos-decide.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/runtime/src/application/decide/decide.service.ts`
- `packages/runtime/src/application/task/task.service.ts`

## Ownership Expansions

- `2026-08-11T02:03:21.033Z` by `codex`: `packages/cli/src/cli/commands/task.ts` — The public task question disposition command requires its CLI parser and router implementation.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make Task question dispositions explicit and reconcile historical terminal Tasks" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Questions support resolved, dismissed, and promoted terminal dispositions with actor, reason, time, and optional durable target (closure, agent-observation)
- Cancelling or superseding a Task leaves no open questions and preserves an auditable disposition (closure, agent-observation)
- Completed historical Tasks with open questions are reconciled without inventing answers (closure, agent-observation)
- Source and packed lifecycle fixtures cover terminal and reconstructed question semantics (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-d1e51637",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T01:43:00.356Z",
  "updatedAt": "2026-08-11T02:04:45.161Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Make Task question dispositions explicit and reconcile historical terminal Tasks",
  "goal": "Make Task question dispositions explicit and reconcile historical terminal Tasks",
  "scope": {
    "query": "skopos",
    "matchedBy": "id",
    "scope": {
      "id": "skopos",
      "kind": "workspace",
      "title": "Skopos Workspace",
      "path": ".",
      "aliases": [
        "@skopos/workspace"
      ],
      "summary": "Skopos Workspace (core.workspace).",
      "confidence": "high",
      "ancestorIds": [],
      "profile": "core.workspace",
      "memoryRoot": "docs",
      "codeRoots": [
        "."
      ],
      "dependsOn": [],
      "owners": [
        "skopos-core"
      ]
    }
  },
  "contract": {
    "acceptanceCriteria": [
      "Questions support resolved, dismissed, and promoted terminal dispositions with actor, reason, time, and optional durable target",
      "Cancelling or superseding a Task leaves no open questions and preserves an auditable disposition",
      "Completed historical Tasks with open questions are reconciled without inventing answers",
      "Source and packed lifecycle fixtures cover terminal and reconstructed question semantics"
    ],
    "nonGoals": [
      "Do not implement semantic drift, browser receipts, or convention Memory inference in this Task"
    ],
    "constraints": []
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "Declared ownership affects 3 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 10,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime"
      ],
      "impactCategories": [
        "docs",
        "scope-source"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-67a4f6e7b44892bf"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "step-record-task-risk",
      "kind": "implementation",
      "title": "Record Task risk and detail before editing",
      "detail": "Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.",
      "status": "complete"
    },
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in Skopos Workspace",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "complete"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Make Task question dispositions explicit and reconcile historical terminal Tasks\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "complete"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "complete"
    },
    {
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck the Skopos workspace",
      "detail": "Required by Guard quality.typecheck.",
      "status": "complete"
    }
  ],
  "selectedActions": [
    {
      "id": "quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/task-portability.test.ts",
        "packages/cli/src/cli/commands/router.ts",
        "packages/cli/src/cli/commands/task.ts",
        "packages/cli/src/cli/help.ts",
        "packages/model/src/contracts/skopos-decide.ts",
        "packages/model/src/contracts/skopos-task.ts",
        "packages/runtime/src/application/decide/decide.service.ts",
        "packages/runtime/src/application/task/task.service.ts"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Questions support resolved, dismissed, and promoted terminal dispositions with actor, reason, time, and optional durable target",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Cancelling or superseding a Task leaves no open questions and preserves an auditable disposition",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Completed historical Tasks with open questions are reconciled without inventing answers",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Source and packed lifecycle fixtures cover terminal and reconstructed question semantics",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-quality.focused-behavior-proof",
      "acceptanceCriterion": "Guard quality.focused-behavior-proof: Behavior changes require focused proof",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [
        "quality.focused-behavior-proof"
      ],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-quality.typecheck",
      "acceptanceCriterion": "Guard quality.typecheck: TypeScript changes require typecheck Evidence",
      "phase": "closure",
      "actionIds": [
        "quality.typecheck"
      ],
      "guardIds": [
        "quality.typecheck"
      ],
      "evidence": "source-bound-action"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope skopos.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "The existing decision-escalation and evidence/readiness architecture already defines answered, dismissed, and promoted terminal question semantics. This implementation makes that accepted architecture operational without changing the architecture router.",
      "resolvedAt": "2026-08-11T02:02:34.311Z",
      "resolvedByActorId": "codex"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "run-quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "summary": "Required by Guard quality.typecheck.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.typecheck",
      "blocking": false,
      "status": "complete"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "packages/cli/src/cli/commands/task.ts"
      ],
      "reason": "The public task question disposition command requires its CLI parser and router implementation.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T02:03:21.033Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/cli/commands/task.ts",
          "digest": "7ee920524d397cbb4557cb2af2a3615481639dcd11cc801ad22bcc588c4d92bc"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/findings/F-20260811-task-question-closure-invariant-gap.md",
    "docs/work/archive/tasks",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/task-portability.test.ts",
    "packages/cli/src/cli/commands/router.ts",
    "packages/cli/src/cli/commands/task.ts",
    "packages/cli/src/cli/help.ts",
    "packages/model/src/contracts/skopos-decide.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/runtime/src/application/decide/decide.service.ts",
    "packages/runtime/src/application/task/task.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
