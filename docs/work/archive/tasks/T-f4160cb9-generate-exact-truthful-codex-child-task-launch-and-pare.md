---
title: "Task: Generate exact truthful Codex child-task launch and parent-review instructions from an approved split"
status: complete
owner: "codex-launch-contract"
id: T-f4160cb9
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-4dd0396d28bc6776
lastUpdated: 2026-08-11
parentTaskId: T-9da72d55
---

# Task: Generate exact truthful Codex child-task launch and parent-review instructions from an approved split

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Generate exact truthful Codex child-task launch and parent-review instructions from an approved split

## Acceptance

- Every child assignment includes an exact bounded prompt, parent reviewer identity, host capability requirements, and a truthful manual fallback.
- The Codex adapter directs the originating agent to create real tasks only after explicit user approval, use returned thread identities for Session binding, wait for results, and review canonical child state.
- Task split tests prove the generated contract without claiming that prompt generation is host delivery.

## Non-Goals

- Embed an undocumented Codex Desktop API inside Skopos core.

## Constraints

- Keep core artifacts host-neutral and make Codex behavior an adapter capability.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 4 non-workspace Scopes.

## Owned Paths

- `packages/cli/src/__tests__/task-splitting.test.ts`
- `packages/cli/src/cli/commands/task.ts`
- `packages/instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/runtime/src/application/task/task-split.service.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?** (decision, complete) — Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Generate exact truthful Codex child-task launch and parent-review instructions from an approved split" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Every child assignment includes an exact bounded prompt, parent reviewer identity, host capability requirements, and a truthful manual fallback. (closure, agent-observation)
- The Codex adapter directs the originating agent to create real tasks only after explicit user approval, use returned thread identities for Session binding, wait for results, and review canonical child state. (closure, agent-observation)
- Task split tests prove the generated contract without claiming that prompt generation is host delivery. (closure, agent-observation)
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
  "id": "T-f4160cb9",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T06:36:54.366Z",
  "updatedAt": "2026-08-11T06:51:49.546Z",
  "planIds": [],
  "parentTaskId": "T-9da72d55",
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Generate exact truthful Codex child-task launch and parent-review instructions from an approved split",
  "goal": "Generate exact truthful Codex child-task launch and parent-review instructions from an approved split",
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
      "Every child assignment includes an exact bounded prompt, parent reviewer identity, host capability requirements, and a truthful manual fallback.",
      "The Codex adapter directs the originating agent to create real tasks only after explicit user approval, use returned thread identities for Session binding, wait for results, and review canonical child state.",
      "Task split tests prove the generated contract without claiming that prompt generation is host delivery."
    ],
    "nonGoals": [
      "Embed an undocumented Codex Desktop API inside Skopos core."
    ],
    "constraints": [
      "Keep core artifacts host-neutral and make Codex behavior an adapter capability."
    ]
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
      "ownedPathCount": 5,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-instructions",
        "skopos-model",
        "skopos-runtime"
      ],
      "impactCategories": [
        "scope-source"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-4dd0396d28bc6776"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.architecture-shift",
      "kind": "decision",
      "title": "Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "detail": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
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
      "detail": "Carry out \"Generate exact truthful Codex child-task launch and parent-review instructions from an approved split\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/runtime/src/application/task/task-split.service.ts",
        "packages/cli/src/cli/commands/task.ts",
        "packages/cli/src/__tests__/task-splitting.test.ts",
        "packages/instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.ts"
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
      "acceptanceCriterion": "Every child assignment includes an exact bounded prompt, parent reviewer identity, host capability requirements, and a truthful manual fallback.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The Codex adapter directs the originating agent to create real tasks only after explicit user approval, use returned thread identities for Session binding, wait for results, and review canonical child state.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Task split tests prove the generated contract without claiming that prompt generation is host delivery.",
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
      "resolutionReason": "Reviewed docs/architecture/00-architecture.md and agent-native-operating-model.md. The implementation preserves the documented boundary: core assignment artifacts remain host-neutral and truthfully undelivered, while only the generated Codex adapter owns task creation, returned-thread Session binding, waiting, and parent review guidance. No canonical architecture change is required.",
      "resolvedAt": "2026-08-11T06:51:11.458Z",
      "resolvedByActorId": "codex-launch-contract"
    }
  ],
  "questions": [
    {
      "id": "plan.architecture-shift",
      "category": "architecture",
      "escalation": "must-ask",
      "question": "Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "whyItMatters": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "recommendedOptionId": "preserve-current-boundaries",
      "options": [
        {
          "id": "preserve-current-boundaries",
          "label": "Preserve current boundaries",
          "rationale": "Recommended unless the goal explicitly requires a structural redesign."
        },
        {
          "id": "approve-architecture-change",
          "label": "Approve architecture change",
          "rationale": "Use this when the change should redefine package, scope, or runtime boundaries."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "preserve-current-boundaries",
      "resolvedAt": "2026-08-11T06:38:43.145Z",
      "resolvedByActorId": "codex-launch-contract",
      "disposition": {
        "kind": "answered",
        "reason": "Selected Task question option preserve-current-boundaries.",
        "actorId": "codex-launch-contract",
        "recordedAt": "2026-08-11T06:38:43.145Z",
        "target": {
          "kind": "option",
          "ref": "preserve-current-boundaries"
        }
      }
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.architecture-shift",
      "title": "Resolve: Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "summary": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.architecture-shift",
      "blocking": true,
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
    "packages/cli/src/__tests__/task-splitting.test.ts",
    "packages/cli/src/cli/commands/task.ts",
    "packages/instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/runtime/src/application/task/task-split.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
