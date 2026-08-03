---
title: "Task: Replace the adopter-specific Core Invariant label with a project-generic boundary"
status: complete
owner: "codex-skopos-generic-boundary"
id: T-e0129c30
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-02
---

# Task: Replace the adopter-specific Core Invariant label with a project-generic boundary

## Changelog

- `2026-08-02`: Synchronized Task state `complete` from Skopos.

## Goal

Replace the adopter-specific Core Invariant label with a project-generic boundary

## Acceptance

- The Core Invariant forbids all adopter-specific architecture without naming one adopter

## Non-Goals

- Change Task projection behavior

## Constraints

- None declared.

## Owned Paths

- `docs/architecture/00-architecture.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Does this plan require a destructive rename, removal, or migration path?** (decision, complete) — Destructive changes need an explicit cutover strategy instead of an implicit agent decision.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Replace the adopter-specific Core Invariant label with a project-generic boundary" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The Core Invariant forbids all adopter-specific architecture without naming one adopter (closure, agent-observation)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-e0129c30",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-02T00:46:57.997Z",
  "updatedAt": "2026-08-02T00:48:37.275Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Replace the adopter-specific Core Invariant label with a project-generic boundary",
  "goal": "Replace the adopter-specific Core Invariant label with a project-generic boundary",
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
      "The Core Invariant forbids all adopter-specific architecture without naming one adopter"
    ],
    "nonGoals": [
      "Change Task projection behavior"
    ],
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
      "id": "decision-plan.destructive-migration",
      "kind": "decision",
      "title": "Does this plan require a destructive rename, removal, or migration path?",
      "detail": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
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
      "detail": "Carry out \"Replace the adopter-specific Core Invariant label with a project-generic boundary\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The Core Invariant forbids all adopter-specific architecture without naming one adopter",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
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
      "resolutionReason": "Generalized the Core Invariant from one adopter name to a project-wide adopter-neutral boundary.",
      "resolvedAt": "2026-08-02T00:48:03.892Z",
      "resolvedByActorId": "codex-skopos-generic-boundary"
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
      "resolvedAt": "2026-08-02T00:47:09.005Z",
      "resolvedByActorId": "codex-skopos-generic-boundary"
    },
    {
      "id": "plan.destructive-migration",
      "category": "migration",
      "escalation": "must-ask",
      "question": "Does this plan require a destructive rename, removal, or migration path?",
      "whyItMatters": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
      "recommendedOptionId": "stage-the-change",
      "options": [
        {
          "id": "stage-the-change",
          "label": "Stage the change",
          "rationale": "Recommended because staged rollouts reduce drift and make Readiness easier to reason about."
        },
        {
          "id": "hard-cutover",
          "label": "Hard cutover",
          "rationale": "Use only when an immediate break is intentional and fully understood."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "hard-cutover",
      "resolvedAt": "2026-08-02T00:47:34.659Z",
      "resolvedByActorId": "codex-skopos-generic-boundary"
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
      "id": "resolve-plan.destructive-migration",
      "title": "Resolve: Does this plan require a destructive rename, removal, or migration path?",
      "summary": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.destructive-migration",
      "blocking": true,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/00-architecture.md"
  ]
}
```
<!-- skopos:task-state:end -->
