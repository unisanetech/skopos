---
title: "Task: Archive the resolved planner ask-back classification Finding"
status: complete
owner: "codex-skopos-question-archive"
id: T-613e992e
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Archive the resolved planner ask-back classification Finding

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Archive the resolved planner ask-back classification Finding

## Acceptance

- The Finding is resolved, historical, and excluded from the active Work Queue
- Every current Memory link resolves to the archived Finding

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/decisions/D-20260803-evidence-based-ask-back-classification.md`
- `docs/findings/F-20260803-planner-ask-back-classification-gap.md`
- `docs/findings/archive/F-20260803-planner-ask-back-classification-gap.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Archive the resolved planner ask-back classification Finding" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The Finding is resolved, historical, and excluded from the active Work Queue (closure, agent-observation)
- Every current Memory link resolves to the archived Finding (closure, agent-observation)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260803-evidence-based-ask-back-classification.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260803-evidence-based-ask-back-classification.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-613e992e",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T15:11:18.533Z",
  "updatedAt": "2026-08-03T15:13:18.976Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Archive the resolved planner ask-back classification Finding",
  "goal": "Archive the resolved planner ask-back classification Finding",
  "scope": {
    "query": "workspace",
    "matchedBy": "default-root",
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
      "The Finding is resolved, historical, and excluded from the active Work Queue",
      "Every current Memory link resolves to the archived Finding"
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
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
      "detail": "Carry out \"Archive the resolved planner ask-back classification Finding\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "complete"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "complete"
    }
  ],
  "selectedActions": [],
  "selectedGuardIds": [],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "The Finding is resolved, historical, and excluded from the active Work Queue",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Every current Memory link resolves to the archived Finding",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-decision-95ee267954",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260803-evidence-based-ask-back-classification.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260803-evidence-based-ask-back-classification.md",
      "resolution": "memory-updated",
      "resolutionReason": "The Decision now links to the resolved historical Finding in its archive location.",
      "resolvedAt": "2026-08-03T15:12:41.081Z",
      "resolvedByActorId": "codex-skopos-question-archive"
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
      "resolvedOptionId": "narrow-scope-first",
      "resolvedAt": "2026-08-03T15:11:30.461Z",
      "resolvedByActorId": "codex-skopos-question-archive"
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
    }
  ],
  "declaredOwnedPaths": [
    "docs/decisions/D-20260803-evidence-based-ask-back-classification.md",
    "docs/findings/F-20260803-planner-ask-back-classification-gap.md",
    "docs/findings/archive/F-20260803-planner-ask-back-classification-gap.md"
  ]
}
```
<!-- skopos:task-state:end -->
