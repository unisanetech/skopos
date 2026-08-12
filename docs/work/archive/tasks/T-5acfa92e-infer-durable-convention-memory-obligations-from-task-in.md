---
title: "Task: Infer durable convention Memory obligations from Task intent"
status: complete
owner: "codex"
id: T-5acfa92e
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-b90df784fe3cde8c
lastUpdated: 2026-08-11
---

# Task: Infer durable convention Memory obligations from Task intent

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Infer durable convention Memory obligations from Task intent

## Acceptance

- A Task that explicitly establishes or standardizes a project-wide convention receives an open pattern or standard Memory obligation even when it owns only source paths.
- One-off fixes, polish, spacing, copy, and local implementation Tasks do not receive a false-positive convention obligation.
- Existing canonical same-role Scope Memory is selected deterministically; otherwise the obligation truthfully requires new durable Memory without inventing a document.
- Ownership expansion recomputes convention obligations from the preserved Task goal and contract.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 2 non-workspace Scopes.

## Owned Paths

- `docs/architecture/00-architecture.md`
- `docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md`
- `packages/cli/src/__tests__/task-portability.test.ts`
- `packages/runtime/src/application/task/task.service.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Infer durable convention Memory obligations from Task intent" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- A Task that explicitly establishes or standardizes a project-wide convention receives an open pattern or standard Memory obligation even when it owns only source paths. (closure, agent-observation)
- One-off fixes, polish, spacing, copy, and local implementation Tasks do not receive a false-positive convention obligation. (closure, agent-observation)
- Existing canonical same-role Scope Memory is selected deterministically; otherwise the obligation truthfully requires new durable Memory without inventing a document. (closure, agent-observation)
- Ownership expansion recomputes convention obligations from the preserved Task goal and contract. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-5acfa92e",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T02:36:14.692Z",
  "updatedAt": "2026-08-11T02:40:07.710Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Infer durable convention Memory obligations from Task intent",
  "goal": "Infer durable convention Memory obligations from Task intent",
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
      "A Task that explicitly establishes or standardizes a project-wide convention receives an open pattern or standard Memory obligation even when it owns only source paths.",
      "One-off fixes, polish, spacing, copy, and local implementation Tasks do not receive a false-positive convention obligation.",
      "Existing canonical same-role Scope Memory is selected deterministically; otherwise the obligation truthfully requires new durable Memory without inventing a document.",
      "Ownership expansion recomputes convention obligations from the preserved Task goal and contract."
    ],
    "nonGoals": [],
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
      "Declared ownership affects 2 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 4,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
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
    "baselineId": "baseline-b90df784fe3cde8c"
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
      "detail": "Carry out \"Infer durable convention Memory obligations from Task intent\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/runtime/src/application/task/task.service.ts",
        "packages/cli/src/__tests__/task-portability.test.ts"
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
      "acceptanceCriterion": "A Task that explicitly establishes or standardizes a project-wide convention receives an open pattern or standard Memory obligation even when it owns only source paths.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "One-off fixes, polish, spacing, copy, and local implementation Tasks do not receive a false-positive convention obligation.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Existing canonical same-role Scope Memory is selected deterministically; otherwise the obligation truthfully requires new durable Memory without inventing a document.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Ownership expansion recomputes convention obligations from the preserved Task goal and contract.",
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
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical architecture now defines durable convention intent classification, negative boundaries, deterministic Memory selection, and expansion recomputation.",
      "resolvedAt": "2026-08-11T02:39:09.405Z",
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
  "declaredOwnedPaths": [
    "docs/architecture/00-architecture.md",
    "docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md",
    "packages/cli/src/__tests__/task-portability.test.ts",
    "packages/runtime/src/application/task/task.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
