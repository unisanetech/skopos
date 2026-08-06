---
title: "Task: Rewrite the root README as a human-friendly product introduction"
status: complete
owner: "codex-readme"
id: T-27cea887
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-e8ff999b55aecb48
lastUpdated: 2026-08-06
---

# Task: Rewrite the root README as a human-friendly product introduction

## Changelog

- `2026-08-06`: Synchronized Task state `complete` from Skopos.

## Goal

Rewrite the root README as a human-friendly product introduction

## Acceptance

- A first-time developer can understand the problem, value, workflow, terminology, quick start, and honest release status without reading architecture documents first.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `README.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?** (decision, complete) — Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Rewrite the root README as a human-friendly product introduction" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- A first-time developer can understand the problem, value, workflow, terminology, quick start, and honest release status without reading architecture documents first. (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-27cea887",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-06T14:16:11.403Z",
  "updatedAt": "2026-08-06T14:20:07.632Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Rewrite the root README as a human-friendly product introduction",
  "goal": "Rewrite the root README as a human-friendly product introduction",
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
      "A first-time developer can understand the problem, value, workflow, terminology, quick start, and honest release status without reading architecture documents first."
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-e8ff999b55aecb48"
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
      "detail": "Carry out \"Rewrite the root README as a human-friendly product introduction\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "A first-time developer can understand the problem, value, workflow, terminology, quick start, and honest release status without reading architecture documents first.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [],
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
      "resolvedAt": "2026-08-06T14:17:09.521Z",
      "resolvedByActorId": "codex-readme"
    },
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
      "resolvedAt": "2026-08-06T14:17:10.473Z",
      "resolvedByActorId": "codex-readme"
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
      "id": "resolve-plan.architecture-shift",
      "title": "Resolve: Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "summary": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.architecture-shift",
      "blocking": true,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    "README.md"
  ]
}
```
<!-- skopos:task-state:end -->
