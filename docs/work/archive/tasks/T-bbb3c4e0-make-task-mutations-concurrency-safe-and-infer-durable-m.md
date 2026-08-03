---
title: "Task: Make Task mutations concurrency-safe and infer durable Memory obligations before implementation"
status: complete
owner: "codex"
id: T-bbb3c4e0
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-07-31
---

# Task: Make Task mutations concurrency-safe and infer durable Memory obligations before implementation

## Changelog

- `2026-07-31`: Synchronized Task state `complete` from Skopos.

## Goal

Make Task mutations concurrency-safe and infer durable Memory obligations before implementation

## Acceptance

- Concurrent Task mutations serialize without lost updates, temporary-file rename races, or corrupted portable Task documents
- Task admission infers project-generic Memory obligations from risk, changed or owned paths, Scope Memory, and accepted architecture without automatically creating duplicate documents
- Pending Memory obligations are visible before implementation and remain closure blockers until satisfied or explicitly resolved
- Focused tests cover concurrent step and Evidence writes plus positive and negative Memory-obligation inference across non-Unisane fixtures

## Non-Goals

- Remote or cross-machine coordination
- Automatically author Decisions, Findings, Plans, or Standards without agent judgment

## Constraints

- Keep Skopos core project-agnostic and preserve one Task and Readiness authority

## Owned Paths

- `docs/architecture`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages`
- `tests`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make Task mutations concurrency-safe and infer durable Memory obligations before implementation" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Concurrent Task mutations serialize without lost updates, temporary-file rename races, or corrupted portable Task documents (closure, agent-observation)
- Task admission infers project-generic Memory obligations from risk, changed or owned paths, Scope Memory, and accepted architecture without automatically creating duplicate documents (closure, agent-observation)
- Pending Memory obligations are visible before implementation and remain closure blockers until satisfied or explicitly resolved (closure, agent-observation)
- Focused tests cover concurrent step and Evidence writes plus positive and negative Memory-obligation inference across non-Unisane fixtures (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-bbb3c4e0",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-07-31T18:02:03.112Z",
  "updatedAt": "2026-07-31T18:15:51.895Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Make Task mutations concurrency-safe and infer durable Memory obligations before implementation",
  "goal": "Make Task mutations concurrency-safe and infer durable Memory obligations before implementation",
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
      "Concurrent Task mutations serialize without lost updates, temporary-file rename races, or corrupted portable Task documents",
      "Task admission infers project-generic Memory obligations from risk, changed or owned paths, Scope Memory, and accepted architecture without automatically creating duplicate documents",
      "Pending Memory obligations are visible before implementation and remain closure blockers until satisfied or explicitly resolved",
      "Focused tests cover concurrent step and Evidence writes plus positive and negative Memory-obligation inference across non-Unisane fixtures"
    ],
    "nonGoals": [
      "Remote or cross-machine coordination",
      "Automatically author Decisions, Findings, Plans, or Standards without agent judgment"
    ],
    "constraints": [
      "Keep Skopos core project-agnostic and preserve one Task and Readiness authority"
    ]
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
      "detail": "Carry out \"Make Task mutations concurrency-safe and infer durable Memory obligations before implementation\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Concurrent Task mutations serialize without lost updates, temporary-file rename races, or corrupted portable Task documents",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Task admission infers project-generic Memory obligations from risk, changed or owned paths, Scope Memory, and accepted architecture without automatically creating duplicate documents",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Pending Memory obligations are visible before implementation and remain closure blockers until satisfied or explicitly resolved",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused tests cover concurrent step and Evidence writes plus positive and negative Memory-obligation inference across non-Unisane fixtures",
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
      "resolvedAt": "2026-07-31T18:02:11.386Z",
      "resolvedByActorId": "codex"
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
    "docs/architecture",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages",
    "tests"
  ]
}
```
<!-- skopos:task-state:end -->
