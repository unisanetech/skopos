---
title: "Task: Complete explicit project-integration proof subjects and certify mixed-worktree isolation"
status: cancelled
owner: "project"
id: T-6f238739
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Complete explicit project-integration proof subjects and certify mixed-worktree isolation

## Changelog

- `2026-08-03`: Synchronized Task state `cancelled` from Skopos.

## Goal

Complete explicit project-integration proof subjects and certify mixed-worktree isolation

## Acceptance

- Task artifacts and verification name task-closure or project-integration as the proof subject with an immutable baseline identity.
- A generic dirty multi-scope fixture proves narrow Task isolation and explicit project-integration inclusion with explainable selection.
- Actions executed against a live mixed tree require an explicit overlay-safe declaration, and snapshot/dirty/generated/deleted/external-path regressions pass.
- The proof-boundary Decision and Finding reflect the implemented contract and the Finding closes with focused evidence.

## Non-Goals

- Implement release-provider publication workflows.

## Constraints

- Preserve the single Task, Action, Guard, Evidence, and Readiness authority.

## Owned Paths

- `docs/architecture/evidence-and-readiness-model.md`
- `docs/decisions/D-20260803-task-local-proof-and-project-integration-readiness-boundary.md`
- `docs/findings/F-20260803-task-proof-boundary-and-dirty-worktree-isolation-gap.md`
- `docs/findings/archive`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__/proof-boundary-readiness.test.ts`
- `packages/cli/src/__tests__/task-change-scope.test.ts`
- `packages/cli/src/cli/commands/router.ts`
- `packages/cli/src/cli/commands/verification.ts`
- `packages/cli/src/cli/help.ts`
- `packages/model/src/contracts/skopos-action.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/model/src/contracts/skopos-verification.ts`
- `packages/runtime/src/application/actions/actions.service.ts`
- `packages/runtime/src/application/start/start.service.ts`
- `packages/runtime/src/application/task/task.service.ts`
- `packages/runtime/src/application/verification/verification.service.ts`
- `tools/skopos/actions`

## Steps

- [ ] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, pending) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [ ] **Resolve plan decisions** (implementation, pending) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [ ] **Record Task risk and detail before editing** (implementation, pending) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [ ] **Review the current pattern in Skopos Workspace** (implementation, pending) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Complete explicit project-integration proof subjects and certify mixed-worktree isolation" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [ ] **Refresh self-hosted knowledge state** (action, pending) — Required by Guard knowledge.refresh.
- [ ] **Typecheck the Skopos workspace** (action, pending) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `maintenance.refresh-knowledge`: Required by Guard knowledge.refresh.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `knowledge.refresh`
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Task artifacts and verification name task-closure or project-integration as the proof subject with an immutable baseline identity. (closure, agent-observation)
- A generic dirty multi-scope fixture proves narrow Task isolation and explicit project-integration inclusion with explainable selection. (closure, agent-observation)
- Actions executed against a live mixed tree require an explicit overlay-safe declaration, and snapshot/dirty/generated/deleted/external-path regressions pass. (closure, agent-observation)
- The proof-boundary Decision and Finding reflect the implemented contract and the Finding closes with focused evidence. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [open] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/evidence-and-readiness-model.md`)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-6f238739",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-03T16:58:04.566Z",
  "updatedAt": "2026-08-03T17:06:48.036Z",
  "planIds": [],
  "childTasks": [],
  "state": "cancelled",
  "detail": "standard",
  "title": "Complete explicit project-integration proof subjects and certify mixed-worktree isolation",
  "goal": "Complete explicit project-integration proof subjects and certify mixed-worktree isolation",
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
      "Task artifacts and verification name task-closure or project-integration as the proof subject with an immutable baseline identity.",
      "A generic dirty multi-scope fixture proves narrow Task isolation and explicit project-integration inclusion with explainable selection.",
      "Actions executed against a live mixed tree require an explicit overlay-safe declaration, and snapshot/dirty/generated/deleted/external-path regressions pass.",
      "The proof-boundary Decision and Finding reflect the implemented contract and the Finding closes with focused evidence."
    ],
    "nonGoals": [
      "Implement release-provider publication workflows."
    ],
    "constraints": [
      "Preserve the single Task, Action, Guard, Evidence, and Readiness authority."
    ]
  },
  "risk": "standard",
  "priority": 90,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.scope-confirmation",
      "kind": "decision",
      "title": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "detail": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "status": "pending"
    },
    {
      "id": "step-resolve-decisions",
      "kind": "implementation",
      "title": "Resolve plan decisions",
      "detail": "Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.",
      "status": "pending"
    },
    {
      "id": "step-record-task-risk",
      "kind": "implementation",
      "title": "Record Task risk and detail before editing",
      "detail": "Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.",
      "status": "pending"
    },
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in Skopos Workspace",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "pending"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Complete explicit project-integration proof subjects and certify mixed-worktree isolation\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "pending"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "pending"
    },
    {
      "id": "action-maintenance.refresh-knowledge",
      "kind": "action",
      "title": "Refresh self-hosted knowledge state",
      "detail": "Required by Guard knowledge.refresh.",
      "status": "pending"
    },
    {
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck the Skopos workspace",
      "detail": "Required by Guard quality.typecheck.",
      "status": "pending"
    }
  ],
  "selectedActions": [
    {
      "id": "maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
      "reason": "Required by Guard knowledge.refresh.",
      "matchedPaths": [
        "tools/skopos/actions"
      ],
      "outputPaths": [
        ".skopos/index"
      ],
      "requiresApproval": false
    },
    {
      "id": "quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "packages/model/src/contracts/skopos-task.ts",
        "packages/model/src/contracts/skopos-verification.ts",
        "packages/model/src/contracts/skopos-action.ts",
        "packages/runtime/src/application/start/start.service.ts",
        "packages/runtime/src/application/task/task.service.ts",
        "packages/runtime/src/application/verification/verification.service.ts",
        "packages/runtime/src/application/actions/actions.service.ts",
        "packages/cli/src/cli/commands/router.ts",
        "packages/cli/src/cli/commands/verification.ts",
        "packages/cli/src/cli/help.ts",
        "packages/cli/src/__tests__/proof-boundary-readiness.test.ts",
        "packages/cli/src/__tests__/task-change-scope.test.ts"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "knowledge.refresh",
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Task artifacts and verification name task-closure or project-integration as the proof subject with an immutable baseline identity.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A generic dirty multi-scope fixture proves narrow Task isolation and explicit project-integration inclusion with explainable selection.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Actions executed against a live mixed tree require an explicit overlay-safe declaration, and snapshot/dirty/generated/deleted/external-path regressions pass.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The proof-boundary Decision and Finding reflect the implemented contract and the Finding closes with focused evidence.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-knowledge.refresh",
      "acceptanceCriterion": "Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge",
      "phase": "closure",
      "actionIds": [
        "maintenance.refresh-knowledge"
      ],
      "guardIds": [
        "knowledge.refresh"
      ],
      "evidence": "source-bound-action"
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
      "id": "memory-architecture-579535b5d3",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes.",
      "status": "open",
      "targetPath": "docs/architecture/evidence-and-readiness-model.md"
    }
  ],
  "questions": [
    {
      "id": "plan.scope-confirmation",
      "category": "scope",
      "escalation": "recommend-and-ask",
      "question": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "whyItMatters": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "recommendedOptionId": "narrow-scope-first",
      "options": [
        {
          "id": "narrow-scope-first",
          "label": "Narrow scope first",
          "rationale": "Recommended because one declared Scope keeps context, checks, and docs impact easier to control."
        },
        {
          "id": "keep-workspace-scope",
          "label": "Keep workspace scope",
          "rationale": "Useful when the change truly spans multiple Scopes and you intend to coordinate a cross-Scope rollout."
        }
      ],
      "blocking": false,
      "status": "open"
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.scope-confirmation",
      "title": "Resolve: Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "summary": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "priority": "medium",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.scope-confirmation",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "summary": "Required by Guard knowledge.refresh.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "maintenance.refresh-knowledge",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "summary": "Required by Guard quality.typecheck.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.typecheck",
      "blocking": false,
      "status": "open"
    }
  ],
  "disposition": {
    "kind": "cancel",
    "reason": "Replaced before verification by the explicit high-impact project-integration Task after the proof-subject contract became available.",
    "actorId": "codex",
    "recordedAt": "2026-08-03T17:06:48.036Z",
    "priorState": "active",
    "nextState": "cancelled"
  },
  "declaredOwnedPaths": [
    "docs/architecture/evidence-and-readiness-model.md",
    "docs/decisions/D-20260803-task-local-proof-and-project-integration-readiness-boundary.md",
    "docs/findings/F-20260803-task-proof-boundary-and-dirty-worktree-isolation-gap.md",
    "docs/findings/archive",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/cli/src/__tests__/proof-boundary-readiness.test.ts",
    "packages/cli/src/__tests__/task-change-scope.test.ts",
    "packages/cli/src/cli/commands/router.ts",
    "packages/cli/src/cli/commands/verification.ts",
    "packages/cli/src/cli/help.ts",
    "packages/model/src/contracts/skopos-action.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/model/src/contracts/skopos-verification.ts",
    "packages/runtime/src/application/actions/actions.service.ts",
    "packages/runtime/src/application/start/start.service.ts",
    "packages/runtime/src/application/task/task.service.ts",
    "packages/runtime/src/application/verification/verification.service.ts",
    "tools/skopos/actions"
  ]
}
```
<!-- skopos:task-state:end -->
