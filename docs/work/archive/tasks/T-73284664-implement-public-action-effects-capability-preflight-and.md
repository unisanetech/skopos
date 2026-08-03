---
title: "Task: Implement public Action effects capability preflight and hermetic execution"
status: complete
owner: "codex-skopos-action-hermeticity"
id: T-73284664
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Implement public Action effects capability preflight and hermetic execution

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Implement public Action effects capability preflight and hermetic execution

## Acceptance

- Action manifests explicitly declare workspace, isolated-artifact, network, browser, tool, secret, service, and concurrency requirements
- Unavailable capabilities produce a deterministic unavailable run before command execution
- Read-only Actions reject workspace mutation and declared mutating Actions reject writes outside affects
- Artifact-producing Actions receive a unique isolated run root and concurrent runs cannot collide
- Action Evidence execution identity includes declared capabilities and effects

## Non-Goals

- Provide OS-level network sandboxing on hosts that do not expose one

## Constraints

- Certification Actions default to no network, no browser, no secrets, and no external services
- Keep capability failures distinct from product-test failures

## Owned Paths

- `docs/architecture/action-extension-model.md`
- `docs/decisions/D-20260803-action-effects-and-hermetic-execution-contract.md`
- `docs/findings/F-20260803-action-hermeticity-and-effect-classification-gap.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__/action-evidence.test.ts`
- `packages/cli/src/__tests__/action-hermeticity.test.ts`
- `packages/indexer/src/application/load-action-manifests/load-action-manifests.service.ts`
- `packages/model/src/contracts/skopos-action.ts`
- `packages/runtime/src/application/actions/actions.service.ts`
- `packages/runtime/src/application/shared/execute-shell-command.ts`
- `packages/verification/src/application/action-evidence/action-evidence.service.ts`
- `tools/skopos/actions`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Implement public Action effects capability preflight and hermetic execution" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Refresh self-hosted knowledge state** (action, complete) — Required by Guard knowledge.refresh.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `maintenance.refresh-knowledge`: Required by Guard knowledge.refresh.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `knowledge.refresh`
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Action manifests explicitly declare workspace, isolated-artifact, network, browser, tool, secret, service, and concurrency requirements (closure, agent-observation)
- Unavailable capabilities produce a deterministic unavailable run before command execution (closure, agent-observation)
- Read-only Actions reject workspace mutation and declared mutating Actions reject writes outside affects (closure, agent-observation)
- Artifact-producing Actions receive a unique isolated run root and concurrent runs cannot collide (closure, agent-observation)
- Action Evidence execution identity includes declared capabilities and effects (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/action-extension-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/action-extension-model.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-73284664",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T13:25:27.717Z",
  "updatedAt": "2026-08-03T13:48:18.015Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Implement public Action effects capability preflight and hermetic execution",
  "goal": "Implement public Action effects capability preflight and hermetic execution",
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
      "Action manifests explicitly declare workspace, isolated-artifact, network, browser, tool, secret, service, and concurrency requirements",
      "Unavailable capabilities produce a deterministic unavailable run before command execution",
      "Read-only Actions reject workspace mutation and declared mutating Actions reject writes outside affects",
      "Artifact-producing Actions receive a unique isolated run root and concurrent runs cannot collide",
      "Action Evidence execution identity includes declared capabilities and effects"
    ],
    "nonGoals": [
      "Provide OS-level network sandboxing on hosts that do not expose one"
    ],
    "constraints": [
      "Certification Actions default to no network, no browser, no secrets, and no external services",
      "Keep capability failures distinct from product-test failures"
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
      "detail": "Carry out \"Implement public Action effects capability preflight and hermetic execution\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-maintenance.refresh-knowledge",
      "kind": "action",
      "title": "Refresh self-hosted knowledge state",
      "detail": "Required by Guard knowledge.refresh.",
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
      "id": "maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
      "reason": "Required by Guard knowledge.refresh.",
      "matchedPaths": [
        "tools/skopos/actions"
      ],
      "outputPaths": [
        ".skopos/index"
      ],
      "requiresApproval": false
    },
    {
      "id": "quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "packages/model/src/contracts/skopos-action.ts",
        "packages/indexer/src/application/load-action-manifests/load-action-manifests.service.ts",
        "packages/runtime/src/application/actions/actions.service.ts",
        "packages/runtime/src/application/shared/execute-shell-command.ts",
        "packages/verification/src/application/action-evidence/action-evidence.service.ts",
        "packages/cli/src/__tests__/action-hermeticity.test.ts",
        "packages/cli/src/__tests__/action-evidence.test.ts"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "knowledge.refresh",
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Action manifests explicitly declare workspace, isolated-artifact, network, browser, tool, secret, service, and concurrency requirements",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Unavailable capabilities produce a deterministic unavailable run before command execution",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Read-only Actions reject workspace mutation and declared mutating Actions reject writes outside affects",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Artifact-producing Actions receive a unique isolated run root and concurrent runs cannot collide",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Action Evidence execution identity includes declared capabilities and effects",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-knowledge.refresh",
      "acceptanceCriterion": "Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge",
      "phase": "closure",
      "actionIds": [
        "maintenance.refresh-knowledge"
      ],
      "guardIds": [
        "knowledge.refresh"
      ],
      "evidence": "source-bound-action"
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
      "id": "memory-architecture-f171416107",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/action-extension-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/action-extension-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Synchronized the canonical Action extension architecture with required capability, effect, concurrency, preflight, artifact isolation, mutation enforcement, and Evidence identity semantics.",
      "resolvedAt": "2026-08-03T13:46:25.911Z",
      "resolvedByActorId": "codex-skopos-action-hermeticity"
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
      "resolvedAt": "2026-08-03T13:25:40.648Z",
      "resolvedByActorId": "codex-skopos-action-hermeticity"
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
      "resolvedAt": "2026-08-03T13:25:44.261Z",
      "resolvedByActorId": "codex-skopos-action-hermeticity"
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
      "id": "run-maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "summary": "Required by Guard knowledge.refresh.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "maintenance.refresh-knowledge",
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
    "docs/architecture/action-extension-model.md",
    "docs/decisions/D-20260803-action-effects-and-hermetic-execution-contract.md",
    "docs/findings/F-20260803-action-hermeticity-and-effect-classification-gap.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/cli/src/__tests__/action-evidence.test.ts",
    "packages/cli/src/__tests__/action-hermeticity.test.ts",
    "packages/indexer/src/application/load-action-manifests/load-action-manifests.service.ts",
    "packages/model/src/contracts/skopos-action.ts",
    "packages/runtime/src/application/actions/actions.service.ts",
    "packages/runtime/src/application/shared/execute-shell-command.ts",
    "packages/verification/src/application/action-evidence/action-evidence.service.ts",
    "tools/skopos/actions"
  ]
}
```
<!-- skopos:task-state:end -->
