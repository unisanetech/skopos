---
title: "Task: Fix unified setup end-to-end authority and readiness flow"
status: complete
owner: "codex-root"
id: T-45ef36c9
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-e0bda436f848a46a
lastUpdated: 2026-08-12
---

# Task: Fix unified setup end-to-end authority and readiness flow

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Fix unified setup end-to-end authority and readiness flow

## Acceptance

- Existing and new project choices change real setup behavior and are regression-tested.
- Session context surfaces active setup questions, stage, and exact continuation.
- Edit creates a real revision cycle and host recovery returns an actionable bound command.
- Completed unified setup creates tracked certification that reconstructs readiness on clean checkout.
- Public copy accurately describes generated versus proposed setup outcomes.

## Non-Goals

- Do not add project-specific integrations or restore the removed public adoption command surface.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 4 non-workspace Scopes.

## Owned Paths

- `apps/web/src/features/documentation`
- `docs/architecture/intelligent-project-onboarding.md`
- `docs/decisions/D-20260812-intelligent-project-onboarding-contract.md`
- `packages/cli/src/__tests__/session-context-contract.test.ts`
- `packages/cli/src/__tests__/setup-workflow.test.ts`
- `packages/model/src/contracts/skopos-session-context.ts`
- `packages/model/src/contracts/skopos-setup.ts`
- `packages/runtime/src/application/adoption/adoption.service.ts`
- `packages/runtime/src/application/session/session-context.service.ts`
- `packages/runtime/src/application/setup`
- `packages/runtime/src/application/understanding/understanding.service.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Fix unified setup end-to-end authority and readiness flow" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Existing and new project choices change real setup behavior and are regression-tested. (closure, agent-observation)
- Session context surfaces active setup questions, stage, and exact continuation. (closure, agent-observation)
- Edit creates a real revision cycle and host recovery returns an actionable bound command. (closure, agent-observation)
- Completed unified setup creates tracked certification that reconstructs readiness on clean checkout. (closure, agent-observation)
- Public copy accurately describes generated versus proposed setup outcomes. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes. (target: `docs/architecture/intelligent-project-onboarding.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260812-intelligent-project-onboarding-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260812-intelligent-project-onboarding-contract.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-45ef36c9",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T22:30:49.881Z",
  "updatedAt": "2026-08-12T22:59:18.320Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Fix unified setup end-to-end authority and readiness flow",
  "goal": "Fix unified setup end-to-end authority and readiness flow",
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
      "Existing and new project choices change real setup behavior and are regression-tested.",
      "Session context surfaces active setup questions, stage, and exact continuation.",
      "Edit creates a real revision cycle and host recovery returns an actionable bound command.",
      "Completed unified setup creates tracked certification that reconstructs readiness on clean checkout.",
      "Public copy accurately describes generated versus proposed setup outcomes."
    ],
    "nonGoals": [
      "Do not add project-specific integrations or restore the removed public adoption command surface."
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
      "ownedPathCount": 11,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime",
        "skopos-web"
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
    "baselineId": "baseline-e0bda436f848a46a"
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
      "detail": "Carry out \"Fix unified setup end-to-end authority and readiness flow\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/runtime/src/application/setup",
        "packages/runtime/src/application/understanding/understanding.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts",
        "packages/runtime/src/application/adoption/adoption.service.ts",
        "packages/model/src/contracts/skopos-setup.ts",
        "packages/model/src/contracts/skopos-session-context.ts",
        "packages/cli/src/__tests__/setup-workflow.test.ts",
        "packages/cli/src/__tests__/session-context-contract.test.ts"
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
      "acceptanceCriterion": "Existing and new project choices change real setup behavior and are regression-tested.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Session context surfaces active setup questions, stage, and exact continuation.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Edit creates a real revision cycle and host recovery returns an actionable bound command.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Completed unified setup creates tracked certification that reconstructs readiness on clean checkout.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Public copy accurately describes generated versus proposed setup outcomes.",
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
      "id": "memory-architecture-663c7727b6",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/intelligent-project-onboarding.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented Session integration, real lifecycle behavior, revision flow, actionable host recovery, and Task/snapshot reconstruction.",
      "resolvedAt": "2026-08-12T22:56:58.261Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-c310d960b6",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260812-intelligent-project-onboarding-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260812-intelligent-project-onboarding-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Recorded the completed certification Task and snapshot as the clean-checkout authority without adding an omnibus setup manifest.",
      "resolvedAt": "2026-08-12T22:57:01.105Z",
      "resolvedByActorId": "codex-root"
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
    "apps/web/src/features/documentation",
    "docs/architecture/intelligent-project-onboarding.md",
    "docs/decisions/D-20260812-intelligent-project-onboarding-contract.md",
    "packages/cli/src/__tests__/session-context-contract.test.ts",
    "packages/cli/src/__tests__/setup-workflow.test.ts",
    "packages/model/src/contracts/skopos-session-context.ts",
    "packages/model/src/contracts/skopos-setup.ts",
    "packages/runtime/src/application/adoption/adoption.service.ts",
    "packages/runtime/src/application/session/session-context.service.ts",
    "packages/runtime/src/application/setup",
    "packages/runtime/src/application/understanding/understanding.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
