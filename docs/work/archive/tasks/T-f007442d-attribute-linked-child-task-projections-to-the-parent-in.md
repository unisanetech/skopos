---
title: "Task: Attribute linked child Task projections to the parent integration proof automatically"
status: complete
owner: "codex"
id: T-f007442d
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-6d1d521e03aee556
lastUpdated: 2026-08-11
---

# Task: Attribute linked child Task projections to the parent integration proof automatically

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Attribute linked child Task projections to the parent integration proof automatically

## Acceptance

- A parent Task automatically attributes each linked child tracked document and immutable snapshot without manual ownership expansion.
- Unrelated Task projections remain excluded or unattributed according to their existing ownership and mutation evidence.
- Workflow assessment, observation Evidence, operating briefs, and closure verification use the same linked-child attribution rule.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 4 non-workspace Scopes.

## Owned Paths

- `docs/architecture/agent-native-operating-model.md`
- `packages/cli/src/__tests__/task-change-scope.test.ts`
- `packages/cli/src/__tests__/task-splitting.test.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/runtime/src/application/agent-native/agent-native-operating-model.service.ts`
- `packages/runtime/src/application/task/task.service.ts`
- `packages/runtime/src/application/verification/verification.service.ts`
- `packages/verification/src/application/task-change-scope/task-change-scope.service.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Attribute linked child Task projections to the parent integration proof automatically" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- A parent Task automatically attributes each linked child tracked document and immutable snapshot without manual ownership expansion. (closure, agent-observation)
- Unrelated Task projections remain excluded or unattributed according to their existing ownership and mutation evidence. (closure, agent-observation)
- Workflow assessment, observation Evidence, operating briefs, and closure verification use the same linked-child attribution rule. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-f007442d",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T11:08:04.065Z",
  "updatedAt": "2026-08-11T11:14:48.754Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Attribute linked child Task projections to the parent integration proof automatically",
  "goal": "Attribute linked child Task projections to the parent integration proof automatically",
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
      "A parent Task automatically attributes each linked child tracked document and immutable snapshot without manual ownership expansion.",
      "Unrelated Task projections remain excluded or unattributed according to their existing ownership and mutation evidence.",
      "Workflow assessment, observation Evidence, operating briefs, and closure verification use the same linked-child attribution rule."
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
      "Declared ownership affects 4 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 8,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime",
        "skopos-verification"
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
    "baselineId": "baseline-6d1d521e03aee556"
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
      "detail": "Carry out \"Attribute linked child Task projections to the parent integration proof automatically\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/model/src/contracts/skopos-task.ts",
        "packages/verification/src/application/task-change-scope/task-change-scope.service.ts",
        "packages/runtime/src/application/task/task.service.ts",
        "packages/runtime/src/application/verification/verification.service.ts",
        "packages/runtime/src/application/agent-native/agent-native-operating-model.service.ts",
        "packages/cli/src/__tests__/task-change-scope.test.ts",
        "packages/cli/src/__tests__/task-splitting.test.ts"
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
      "acceptanceCriterion": "A parent Task automatically attributes each linked child tracked document and immutable snapshot without manual ownership expansion.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Unrelated Task projections remain excluded or unattributed according to their existing ownership and mutation evidence.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Workflow assessment, observation Evidence, operating briefs, and closure verification use the same linked-child attribution rule.",
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
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "The operating model now states that exact linked-child tracked documents and immutable snapshots enter parent integration proof automatically while unrelated Task artifacts remain outside.",
      "resolvedAt": "2026-08-11T11:14:14.902Z",
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
    "docs/architecture/agent-native-operating-model.md",
    "packages/cli/src/__tests__/task-change-scope.test.ts",
    "packages/cli/src/__tests__/task-splitting.test.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/runtime/src/application/agent-native/agent-native-operating-model.service.ts",
    "packages/runtime/src/application/task/task.service.ts",
    "packages/runtime/src/application/verification/verification.service.ts",
    "packages/verification/src/application/task-change-scope/task-change-scope.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
