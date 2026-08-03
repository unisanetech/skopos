---
title: "Task: Enforce portable Action mutations and exclusive scheduling"
status: complete
owner: "codex-skopos-hermeticity"
id: T-ed13f50d
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Enforce portable Action mutations and exclusive scheduling

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Enforce portable Action mutations and exclusive scheduling

## Acceptance

- Non-Git workspaces reject undeclared mutation and mutation outside declared affects paths.
- Shared Actions may overlap while exclusive Actions fail closed against active shared or exclusive owners.
- Scheduling leases are run-owned, expire after bounded interruption, and are released after success or failure.
- Focused concurrency and non-Git fixtures pass without weakening packed Git enforcement.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/architecture/action-extension-model.md`
- `docs/architecture/evidence-and-readiness-model.md`
- `docs/decisions/D-20260803-action-effects-and-hermetic-execution-contract.md`
- `docs/findings/F-20260803-action-hermeticity-and-effect-classification-gap.md`
- `docs/standards/validation.md`
- `packages/cli/src/__tests__/action-hermeticity.test.ts`
- `packages/cli/src/__tests__/action-scheduling.test.ts`
- `packages/runtime/src/application/actions/actions.service.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Enforce portable Action mutations and exclusive scheduling" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Non-Git workspaces reject undeclared mutation and mutation outside declared affects paths. (closure, agent-observation)
- Shared Actions may overlap while exclusive Actions fail closed against active shared or exclusive owners. (closure, agent-observation)
- Scheduling leases are run-owned, expire after bounded interruption, and are released after success or failure. (closure, agent-observation)
- Focused concurrency and non-Git fixtures pass without weakening packed Git enforcement. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/evidence-and-readiness-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/action-extension-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/action-extension-model.md`); resolution: memory-updated
- [complete] standard: The declared Task scope owns canonical standard Memory at docs/standards/validation.md; review and synchronize it if project truth changes. (target: `docs/standards/validation.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-ed13f50d",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T16:09:44.014Z",
  "updatedAt": "2026-08-03T16:15:56.015Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Enforce portable Action mutations and exclusive scheduling",
  "goal": "Enforce portable Action mutations and exclusive scheduling",
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
      "Non-Git workspaces reject undeclared mutation and mutation outside declared affects paths.",
      "Shared Actions may overlap while exclusive Actions fail closed against active shared or exclusive owners.",
      "Scheduling leases are run-owned, expire after bounded interruption, and are released after success or failure.",
      "Focused concurrency and non-Git fixtures pass without weakening packed Git enforcement."
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
      "detail": "Carry out \"Enforce portable Action mutations and exclusive scheduling\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/runtime/src/application/actions/actions.service.ts",
        "packages/cli/src/__tests__/action-hermeticity.test.ts",
        "packages/cli/src/__tests__/action-scheduling.test.ts"
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
      "acceptanceCriterion": "Non-Git workspaces reject undeclared mutation and mutation outside declared affects paths.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Shared Actions may overlap while exclusive Actions fail closed against active shared or exclusive owners.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Scheduling leases are run-owned, expire after bounded interruption, and are released after success or failure.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused concurrency and non-Git fixtures pass without weakening packed Git enforcement.",
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
      "id": "memory-architecture-579535b5d3",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/evidence-and-readiness-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Evidence architecture now defines portable mutation snapshots and run-owned shared/exclusive leases.",
      "resolvedAt": "2026-08-03T16:15:25.792Z",
      "resolvedByActorId": "codex-skopos-hermeticity"
    },
    {
      "id": "memory-architecture-f171416107",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/action-extension-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/action-extension-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Action architecture now defines non-Git effect enforcement and atomic scheduling semantics.",
      "resolvedAt": "2026-08-03T16:15:29.793Z",
      "resolvedByActorId": "codex-skopos-hermeticity"
    },
    {
      "id": "memory-standard-5f2d58a335",
      "role": "standard",
      "reason": "The declared Task scope owns canonical standard Memory at docs/standards/validation.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/standards/validation.md",
      "resolution": "memory-updated",
      "resolutionReason": "Validation standard now requires portable affects boundaries and lease-governed exclusive execution.",
      "resolvedAt": "2026-08-03T16:15:33.516Z",
      "resolvedByActorId": "codex-skopos-hermeticity"
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
      "resolvedAt": "2026-08-03T16:09:53.539Z",
      "resolvedByActorId": "codex-skopos-hermeticity"
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
    "docs/architecture/action-extension-model.md",
    "docs/architecture/evidence-and-readiness-model.md",
    "docs/decisions/D-20260803-action-effects-and-hermetic-execution-contract.md",
    "docs/findings/F-20260803-action-hermeticity-and-effect-classification-gap.md",
    "docs/standards/validation.md",
    "packages/cli/src/__tests__/action-hermeticity.test.ts",
    "packages/cli/src/__tests__/action-scheduling.test.ts",
    "packages/runtime/src/application/actions/actions.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
