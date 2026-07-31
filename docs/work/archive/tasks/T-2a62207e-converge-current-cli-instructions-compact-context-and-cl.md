---
title: "Task: Converge current CLI instructions compact context and closure contracts"
status: complete
owner: "codex"
id: T-2a62207e
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-07-31
---

# Task: Converge current CLI instructions compact context and closure contracts

## Changelog

- `2026-07-31`: Synchronized Task state `complete` from Skopos.

## Goal

Converge current CLI instructions compact context and closure contracts

## Acceptance

- Every command generated or documented in current Skopos guidance exists and uses its canonical arguments
- Session context and next-work JSON remain compact while exposing the current Task and next safe action
- The documented two-command verification and close flow can complete a Task with sufficient Evidence
- Focused CLI contract tests prove command parity compact output and closure transitions

## Non-Goals

- Do not implement the remaining host UI or preventive coordination roadmap

## Constraints

- Use the clean pre-release model without compatibility aliases

## Owned Paths

- `docs/architecture`
- `docs/guides`
- `packages/cli`
- `packages/instructions`
- `packages/model`
- `packages/runtime`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Converge current CLI instructions compact context and closure contracts" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Every command generated or documented in current Skopos guidance exists and uses its canonical arguments (closure, agent-observation)
- Session context and next-work JSON remain compact while exposing the current Task and next safe action (closure, agent-observation)
- The documented two-command verification and close flow can complete a Task with sufficient Evidence (closure, agent-observation)
- Focused CLI contract tests prove command parity compact output and closure transitions (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-2a62207e",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-07-31T00:25:21.998Z",
  "updatedAt": "2026-07-31T00:55:55.920Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Converge current CLI instructions compact context and closure contracts",
  "goal": "Converge current CLI instructions compact context and closure contracts",
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
      "Every command generated or documented in current Skopos guidance exists and uses its canonical arguments",
      "Session context and next-work JSON remain compact while exposing the current Task and next safe action",
      "The documented two-command verification and close flow can complete a Task with sufficient Evidence",
      "Focused CLI contract tests prove command parity compact output and closure transitions"
    ],
    "nonGoals": [
      "Do not implement the remaining host UI or preventive coordination roadmap"
    ],
    "constraints": [
      "Use the clean pre-release model without compatibility aliases"
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
      "id": "decision-plan.public-api-change",
      "kind": "decision",
      "title": "Should this plan change a public contract, route, or SDK surface?",
      "detail": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
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
      "detail": "Carry out \"Converge current CLI instructions compact context and closure contracts\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli",
        "packages/instructions",
        "packages/model",
        "packages/runtime"
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
      "acceptanceCriterion": "Every command generated or documented in current Skopos guidance exists and uses its canonical arguments",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Session context and next-work JSON remain compact while exposing the current Task and next safe action",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The documented two-command verification and close flow can complete a Task with sufficient Evidence",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused CLI contract tests prove command parity compact output and closure transitions",
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
      "resolvedAt": "2026-07-31T00:26:29.202Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "plan.public-api-change",
      "category": "public-api",
      "escalation": "must-ask",
      "question": "Should this plan change a public contract, route, or SDK surface?",
      "whyItMatters": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "recommendedOptionId": "confirm-contract-first",
      "options": [
        {
          "id": "confirm-contract-first",
          "label": "Confirm contract first",
          "rationale": "Recommended because contract decisions should be explicit before implementation starts."
        },
        {
          "id": "internal-only-change",
          "label": "Keep change internal",
          "rationale": "Use this when the goal should not affect public behavior or external consumers."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "confirm-contract-first",
      "resolvedAt": "2026-07-31T00:26:34.114Z",
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
    },
    {
      "id": "resolve-plan.public-api-change",
      "title": "Resolve: Should this plan change a public contract, route, or SDK surface?",
      "summary": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.public-api-change",
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
    "docs/architecture",
    "docs/guides",
    "packages/cli",
    "packages/instructions",
    "packages/model",
    "packages/runtime"
  ]
}
```
<!-- skopos:task-state:end -->
