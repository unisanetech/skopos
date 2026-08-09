---
title: "Task: Make Task ownership expansion and immutable snapshots truthful and ergonomic"
status: complete
owner: "codex-release-hardening"
id: T-894f5653
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-7b524cd3bba7e268
lastUpdated: 2026-08-09
---

# Task: Make Task ownership expansion and immutable snapshots truthful and ergonomic

## Changelog

- `2026-08-09`: Synchronized Task state `complete` from Skopos.

## Goal

Make Task ownership expansion and immutable snapshots truthful and ergonomic

## Acceptance

- Coordination snapshots include every declared Task-owned path even when the writer Session has no matching path claims
- Task ownership can be expanded explicitly with an actor and reason while refreshing proof requirements
- Task help documents the complete Task command family and works through skopos task --help

## Non-Goals

- Add Unisane-specific validation or Commerce rules to Skopos core

## Constraints

- None declared.

## Owned Paths

- `README.md`
- `docs/guides/developer-workflows.md`
- `packages/cli/src/__tests__/coordination-lifecycle.test.ts`
- `packages/cli/src/__tests__/help-contract.test.ts`
- `packages/cli/src/__tests__/task-ownership-expansion.test.ts`
- `packages/cli/src/cli/commands/coordination.ts`
- `packages/cli/src/cli/commands/task.ts`
- `packages/cli/src/cli/help.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/runtime/src/application/coordination/coordination.service.ts`
- `packages/runtime/src/application/task/task.service.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make Task ownership expansion and immutable snapshots truthful and ergonomic" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Coordination snapshots include every declared Task-owned path even when the writer Session has no matching path claims (closure, agent-observation)
- Task ownership can be expanded explicitly with an actor and reason while refreshing proof requirements (closure, agent-observation)
- Task help documents the complete Task command family and works through skopos task --help (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-894f5653",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T03:18:47.394Z",
  "updatedAt": "2026-08-09T03:29:16.404Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Make Task ownership expansion and immutable snapshots truthful and ergonomic",
  "goal": "Make Task ownership expansion and immutable snapshots truthful and ergonomic",
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
      "Coordination snapshots include every declared Task-owned path even when the writer Session has no matching path claims",
      "Task ownership can be expanded explicitly with an actor and reason while refreshing proof requirements",
      "Task help documents the complete Task command family and works through skopos task --help"
    ],
    "nonGoals": [
      "Add Unisane-specific validation or Commerce rules to Skopos core"
    ],
    "constraints": []
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-7b524cd3bba7e268"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.scope-confirmation",
      "kind": "decision",
      "title": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "detail": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "status": "complete"
    },
    {
      "id": "step-resolve-decisions",
      "kind": "implementation",
      "title": "Resolve plan decisions",
      "detail": "Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.",
      "status": "complete"
    },
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
      "detail": "Carry out \"Make Task ownership expansion and immutable snapshots truthful and ergonomic\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/runtime/src/application/task/task.service.ts",
        "packages/runtime/src/application/coordination/coordination.service.ts",
        "packages/cli/src/cli/commands/task.ts",
        "packages/cli/src/cli/commands/coordination.ts",
        "packages/cli/src/cli/help.ts",
        "packages/cli/src/__tests__/coordination-lifecycle.test.ts",
        "packages/cli/src/__tests__/help-contract.test.ts",
        "packages/cli/src/__tests__/task-ownership-expansion.test.ts"
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
      "acceptanceCriterion": "Coordination snapshots include every declared Task-owned path even when the writer Session has no matching path claims",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Task ownership can be expanded explicitly with an actor and reason while refreshing proof requirements",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Task help documents the complete Task command family and works through skopos task --help",
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
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/developer-workflows.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented audited ownership expansion and declared-path snapshot coverage in the canonical developer workflow.",
      "resolvedAt": "2026-08-09T03:28:31.289Z",
      "resolvedByActorId": "codex-release-hardening"
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
      "status": "resolved",
      "resolvedOptionId": "keep-workspace-scope",
      "resolvedAt": "2026-08-09T03:19:04.497Z",
      "resolvedByActorId": "codex-release-hardening"
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
      "status": "complete"
    },
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
    "README.md",
    "docs/guides/developer-workflows.md",
    "packages/cli/src/__tests__/coordination-lifecycle.test.ts",
    "packages/cli/src/__tests__/help-contract.test.ts",
    "packages/cli/src/__tests__/task-ownership-expansion.test.ts",
    "packages/cli/src/cli/commands/coordination.ts",
    "packages/cli/src/cli/commands/task.ts",
    "packages/cli/src/cli/help.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/runtime/src/application/coordination/coordination.service.ts",
    "packages/runtime/src/application/task/task.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
