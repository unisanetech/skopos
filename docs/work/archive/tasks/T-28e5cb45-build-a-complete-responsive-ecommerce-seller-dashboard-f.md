---
title: "Task: Build a complete responsive ecommerce seller dashboard fixture with clear navigation and realistic core seller workflows"
status: complete
owner: "codex-ecommerce-dashboard-canary"
id: T-28e5cb45
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-ff9d5c6ef11e50d6
lastUpdated: 2026-08-05
---

# Task: Build a complete responsive ecommerce seller dashboard fixture with clear navigation and realistic core seller workflows

## Changelog

- `2026-08-05`: Synchronized Task state `complete` from Skopos.

## Goal

Build a complete responsive ecommerce seller dashboard fixture with clear navigation and realistic core seller workflows

## Acceptance

- A runnable seller dashboard presents overview, orders, products, inventory, customers, analytics, marketing, and settings navigation with realistic seller data
- Desktop and mobile layouts are responsive, usable, and visually coherent with no horizontal overflow
- Core workflows support searching and filtering orders, inspecting order details, managing inventory, and creating a product through interactive local UI states
- Focused local validation passes and desktop and mobile screenshots demonstrate the implemented fixture

## Non-Goals

- Change the Skopos product console or core packages

## Constraints

- Preserve all unrelated dirty-worktree changes
- Do not modify the Product UI Craft pack to improve this fixture

## Owned Paths

- `fixtures/ecommerce-seller-dashboard-canary`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Build a complete responsive ecommerce seller dashboard fixture with clear navigation and realistic core seller workflows" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- Guard `quality.focused-behavior-proof`

## Evidence And Readiness

- A runnable seller dashboard presents overview, orders, products, inventory, customers, analytics, marketing, and settings navigation with realistic seller data (closure, agent-observation)
- Desktop and mobile layouts are responsive, usable, and visually coherent with no horizontal overflow (closure, agent-observation)
- Core workflows support searching and filtering orders, inspecting order details, managing inventory, and creating a product through interactive local UI states (closure, agent-observation)
- Focused local validation passes and desktop and mobile screenshots demonstrate the implemented fixture (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-28e5cb45",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-05T21:37:07.841Z",
  "updatedAt": "2026-08-05T21:53:49.794Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Build a complete responsive ecommerce seller dashboard fixture with clear navigation and realistic core seller workflows",
  "goal": "Build a complete responsive ecommerce seller dashboard fixture with clear navigation and realistic core seller workflows",
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
      "A runnable seller dashboard presents overview, orders, products, inventory, customers, analytics, marketing, and settings navigation with realistic seller data",
      "Desktop and mobile layouts are responsive, usable, and visually coherent with no horizontal overflow",
      "Core workflows support searching and filtering orders, inspecting order details, managing inventory, and creating a product through interactive local UI states",
      "Focused local validation passes and desktop and mobile screenshots demonstrate the implemented fixture"
    ],
    "nonGoals": [
      "Change the Skopos product console or core packages"
    ],
    "constraints": [
      "Preserve all unrelated dirty-worktree changes",
      "Do not modify the Product UI Craft pack to improve this fixture"
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-ff9d5c6ef11e50d6"
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
      "detail": "Carry out \"Build a complete responsive ecommerce seller dashboard fixture with clear navigation and realistic core seller workflows\" inside the resolved scope before widening impact to adjacent areas.",
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
  "selectedGuardIds": [
    "quality.focused-behavior-proof"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "A runnable seller dashboard presents overview, orders, products, inventory, customers, analytics, marketing, and settings navigation with realistic seller data",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Desktop and mobile layouts are responsive, usable, and visually coherent with no horizontal overflow",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Core workflows support searching and filtering orders, inspecting order details, managing inventory, and creating a product through interactive local UI states",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused local validation passes and desktop and mobile screenshots demonstrate the implemented fixture",
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
      "resolvedOptionId": "narrow-scope-first",
      "resolvedAt": "2026-08-05T21:37:42.836Z",
      "resolvedByActorId": "codex-ecommerce-dashboard-canary"
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
    "fixtures/ecommerce-seller-dashboard-canary"
  ]
}
```
<!-- skopos:task-state:end -->
