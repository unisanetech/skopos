---
title: "Task: Make ownership expansion enforce declared Scope topology"
status: complete
owner: "codex"
id: T-cd449663
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-aa06de756c57ffa8
lastUpdated: 2026-08-11
---

# Task: Make ownership expansion enforce declared Scope topology

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Make ownership expansion enforce declared Scope topology

## Acceptance

- Expansion inside one Scope preserves authority and records its classification
- A declared dependency expansion stays coherent and auditable
- Sibling Scopes with a meaningful non-workspace ancestor rebind authority and refresh proof state
- Unrelated Scope expansion fails closed with concrete child-Task or explicit integration recovery
- Generic topology fixtures cover expansion and durable reconstruction

## Non-Goals

- Do not implement semantic goal drift classification in this Task

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 4 non-workspace Scopes.

## Owned Paths

- `docs/decisions/D-20260811-topology-aware-task-scope-authority.md`
- `docs/findings/F-20260811-topology-aware-task-scope-resolution-gap.md`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/scope-registry.test.ts`
- `packages/cli/src/__tests__/task-ownership-expansion.test.ts`
- `packages/cli/src/__tests__/task-portability.test.ts`
- `packages/model/src/contracts/skopos-scope-lite.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/query/src/application/resolve-scope/resolve-scope.service.ts`
- `packages/runtime/src/application/task/task.service.ts`

## Ownership Expansions

- `2026-08-11T02:08:17.240Z` by `codex`: `packages/cli/src/__tests__/task-ownership-expansion.test.ts` — Existing ownership-expansion fixtures are the focused behavioral proof surface for topology-aware expansion.
- `2026-08-11T02:08:26.976Z` by `codex`: `packages/model/src/contracts/skopos-scope-lite.ts` — Topology-derived Scope rebinding adds an explicit resolver match kind to the public model.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make ownership expansion enforce declared Scope topology" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Expansion inside one Scope preserves authority and records its classification (closure, agent-observation)
- A declared dependency expansion stays coherent and auditable (closure, agent-observation)
- Sibling Scopes with a meaningful non-workspace ancestor rebind authority and refresh proof state (closure, agent-observation)
- Unrelated Scope expansion fails closed with concrete child-Task or explicit integration recovery (closure, agent-observation)
- Generic topology fixtures cover expansion and durable reconstruction (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260811-topology-aware-task-scope-authority.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260811-topology-aware-task-scope-authority.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-cd449663",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T02:05:57.242Z",
  "updatedAt": "2026-08-11T02:19:32.853Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Make ownership expansion enforce declared Scope topology",
  "goal": "Make ownership expansion enforce declared Scope topology",
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
      "Expansion inside one Scope preserves authority and records its classification",
      "A declared dependency expansion stays coherent and auditable",
      "Sibling Scopes with a meaningful non-workspace ancestor rebind authority and refresh proof state",
      "Unrelated Scope expansion fails closed with concrete child-Task or explicit integration recovery",
      "Generic topology fixtures cover expansion and durable reconstruction"
    ],
    "nonGoals": [
      "Do not implement semantic goal drift classification in this Task"
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
      "Declared ownership affects 4 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 8,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-query",
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
    "baselineId": "baseline-aa06de756c57ffa8"
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
      "detail": "Carry out \"Make ownership expansion enforce declared Scope topology\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/scope-registry.test.ts",
        "packages/cli/src/__tests__/task-ownership-expansion.test.ts",
        "packages/cli/src/__tests__/task-portability.test.ts",
        "packages/model/src/contracts/skopos-scope-lite.ts",
        "packages/model/src/contracts/skopos-task.ts",
        "packages/query/src/application/resolve-scope/resolve-scope.service.ts",
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
      "acceptanceCriterion": "Expansion inside one Scope preserves authority and records its classification",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A declared dependency expansion stays coherent and auditable",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Sibling Scopes with a meaningful non-workspace ancestor rebind authority and refresh proof state",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Unrelated Scope expansion fails closed with concrete child-Task or explicit integration recovery",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Generic topology fixtures cover expansion and durable reconstruction",
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
      "id": "memory-decision-92ec6dfb32",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260811-topology-aware-task-scope-authority.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260811-topology-aware-task-scope-authority.md",
      "resolution": "memory-updated",
      "resolutionReason": "The accepted topology Decision now records operational ownership expansion, proof refresh, and safe split recovery.",
      "resolvedAt": "2026-08-11T02:16:46.921Z",
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
        "packages/cli/src/__tests__/task-ownership-expansion.test.ts"
      ],
      "reason": "Existing ownership-expansion fixtures are the focused behavioral proof surface for topology-aware expansion.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T02:08:17.240Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/__tests__/task-ownership-expansion.test.ts",
          "digest": "e5711b8b131ecec3e362de67900f3ffac8520d58cab08348d13eae74a122b4ee"
        }
      ]
    },
    {
      "paths": [
        "packages/model/src/contracts/skopos-scope-lite.ts"
      ],
      "reason": "Topology-derived Scope rebinding adds an explicit resolver match kind to the public model.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T02:08:26.976Z",
      "baselinePaths": [
        {
          "path": "packages/model/src/contracts/skopos-scope-lite.ts",
          "digest": "fae57227f26f4229a2b886acbed6d30b58868c058ea1421f994e869b7e877931"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/decisions/D-20260811-topology-aware-task-scope-authority.md",
    "docs/findings/F-20260811-topology-aware-task-scope-resolution-gap.md",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/scope-registry.test.ts",
    "packages/cli/src/__tests__/task-ownership-expansion.test.ts",
    "packages/cli/src/__tests__/task-portability.test.ts",
    "packages/model/src/contracts/skopos-scope-lite.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/query/src/application/resolve-scope/resolve-scope.service.ts",
    "packages/runtime/src/application/task/task.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
