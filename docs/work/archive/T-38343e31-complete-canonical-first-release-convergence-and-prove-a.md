---
title: "Task: Complete canonical first-release convergence and prove adopter readiness"
status: complete
owner: "codex"
id: T-38343e31
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: transition
risk: high-impact
lastUpdated: 2026-07-29
---

# Task: Complete canonical first-release convergence and prove adopter readiness

## Changelog

- `2026-07-29`: Synchronized Task state `complete` from Skopos.

## Goal

Complete canonical first-release convergence and prove adopter readiness

## Acceptance

- No retired work or closure authority remains in production surfaces
- Tracked Tasks reconstruct after clean local-state deletion
- Focused canonical tests and final release proof pass
- Skopos can complete verified Unisane adoption

## Non-Goals

- None declared.

## Constraints

- No prototype compatibility layer or old-state migration

## Owned Paths

- `AGENTS.md`
- `README.md`
- `docs`
- `fixtures`
- `package.json`
- `packages`
- `tools`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope plans in monorepos drift faster and make trust reports less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Complete canonical first-release convergence and prove adopter readiness" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Run selected project Actions** (action, complete) — Use the registered Action surface where needed: quality.run-proof-phase
- [x] **Run proof-phase scorecard** (action, complete) — Run after changing runtime behavior, proof fixtures, scorecard contracts, or other reliability-critical Skopos surfaces.

## Actions And Guards

- Action `quality.run-proof-phase`: Run after changing runtime behavior, proof fixtures, scorecard contracts, or other reliability-critical Skopos surfaces.

## Evidence And Readiness

- No retired work or closure authority remains in production surfaces (closure)
- Tracked Tasks reconstruct after clean local-state deletion (closure)
- Focused canonical tests and final release proof pass (closure)
- Skopos can complete verified Unisane adoption (closure)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-38343e31",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-07-29T13:04:07.904Z",
  "updatedAt": "2026-07-29T14:37:48.277Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Complete canonical first-release convergence and prove adopter readiness",
  "goal": "Complete canonical first-release convergence and prove adopter readiness",
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
      "No retired work or closure authority remains in production surfaces",
      "Tracked Tasks reconstruct after clean local-state deletion",
      "Focused canonical tests and final release proof pass",
      "Skopos can complete verified Unisane adoption"
    ],
    "nonGoals": [],
    "constraints": [
      "No prototype compatibility layer or old-state migration"
    ]
  },
  "risk": "high-impact",
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.scope-confirmation",
      "kind": "decision",
      "title": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "detail": "Wide-scope plans in monorepos drift faster and make trust reports less precise.",
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
      "detail": "Carry out \"Complete canonical first-release convergence and prove adopter readiness\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "step-run-actions",
      "kind": "action",
      "title": "Run selected project Actions",
      "detail": "Use the registered Action surface where needed: quality.run-proof-phase",
      "status": "complete"
    },
    {
      "id": "action-quality.run-proof-phase",
      "kind": "action",
      "title": "Run proof-phase scorecard",
      "detail": "Run after changing runtime behavior, proof fixtures, scorecard contracts, or other reliability-critical Skopos surfaces.",
      "status": "complete"
    }
  ],
  "selectedActions": [
    {
      "id": "quality.run-proof-phase",
      "title": "Run proof-phase scorecard",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-run-proof-phase.yaml",
      "reason": "Run after changing runtime behavior, proof fixtures, scorecard contracts, or other reliability-critical Skopos surfaces.",
      "matchedPaths": [],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "No retired work or closure authority remains in production surfaces",
      "phase": "closure",
      "actionIds": [
        "quality.run-proof-phase"
      ],
      "guardIds": []
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Tracked Tasks reconstruct after clean local-state deletion",
      "phase": "closure",
      "actionIds": [
        "quality.run-proof-phase"
      ],
      "guardIds": []
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Focused canonical tests and final release proof pass",
      "phase": "closure",
      "actionIds": [
        "quality.run-proof-phase"
      ],
      "guardIds": []
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Skopos can complete verified Unisane adoption",
      "phase": "closure",
      "actionIds": [
        "quality.run-proof-phase"
      ],
      "guardIds": []
    }
  ],
  "memoryObligations": [],
  "questions": [
    {
      "id": "plan.scope-confirmation",
      "category": "scope",
      "escalation": "recommend-and-ask",
      "question": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "whyItMatters": "Wide-scope plans in monorepos drift faster and make trust reports less precise.",
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
      "resolvedAt": "2026-07-29T14:16:11.917Z",
      "resolvedByActorId": "codex"
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.scope-confirmation",
      "title": "Resolve: Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "summary": "Wide-scope plans in monorepos drift faster and make trust reports less precise.",
      "priority": "medium",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.scope-confirmation",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.run-proof-phase",
      "title": "Run proof-phase scorecard",
      "summary": "Run after changing runtime behavior, proof fixtures, scorecard contracts, or other reliability-critical Skopos surfaces.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.run-proof-phase",
      "blocking": false,
      "status": "open"
    }
  ],
  "declaredOwnedPaths": [
    "AGENTS.md",
    "README.md",
    "docs",
    "fixtures",
    "package.json",
    "packages",
    "tools"
  ]
}
```
<!-- skopos:task-state:end -->
