---
title: "Task: Implement high-impact public Task-local proof attribution and dirty-worktree isolation"
status: complete
owner: "codex-skopos-proof-boundary"
id: T-402bdd68
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Implement high-impact public Task-local proof attribution and dirty-worktree isolation

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Implement high-impact public Task-local proof attribution and dirty-worktree isolation

## Acceptance

- Verification selects Actions only from Task-owned or explicitly attributed current-Task changes
- Other-Task and external-unattributed changes are reported with causal inclusion or exclusion reasons and do not silently expand Task proof
- The 64-path mixed-worktree reliability fixture reaches the recorded target without regressing clean control behavior
- Compact verification output reports attribution counts while detailed artifacts retain classified paths

## Non-Goals

- Implement project integration snapshots or release readiness in this Task

## Constraints

- Keep verification generic; coordination supplies attribution without becoming verification authority
- Do not add compatibility aliases for unreleased contracts

## Owned Paths

- `docs/architecture/evidence-and-readiness-model.md`
- `docs/decisions/D-20260803-task-local-proof-and-project-integration-readiness-boundary.md`
- `docs/findings/F-20260803-task-proof-boundary-and-dirty-worktree-isolation-gap.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `internal/evals/operational-reliability-baseline.json`
- `packages/cli/src/__tests__/compact-command-output.test.ts`
- `packages/cli/src/__tests__/operational-reliability-baseline.test.ts`
- `packages/cli/src/__tests__/task-change-scope.test.ts`
- `packages/cli/src/cli/commands/verification.ts`
- `packages/model/src/contracts/skopos-impact-report.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/model/src/contracts/skopos-verification.ts`
- `packages/runtime/src/application/verification/verification.service.ts`
- `packages/verification/src/application/build-impact-report/build-impact-report.service.ts`
- `packages/verification/src/application/task-change-scope/task-change-scope.service.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Implement high-impact public Task-local proof attribution and dirty-worktree isolation" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Verification selects Actions only from Task-owned or explicitly attributed current-Task changes (closure, agent-observation)
- Other-Task and external-unattributed changes are reported with causal inclusion or exclusion reasons and do not silently expand Task proof (closure, agent-observation)
- The 64-path mixed-worktree reliability fixture reaches the recorded target without regressing clean control behavior (closure, agent-observation)
- Compact verification output reports attribution counts while detailed artifacts retain classified paths (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/evidence-and-readiness-model.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-402bdd68",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T12:43:30.755Z",
  "updatedAt": "2026-08-03T12:51:39.512Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Implement high-impact public Task-local proof attribution and dirty-worktree isolation",
  "goal": "Implement high-impact public Task-local proof attribution and dirty-worktree isolation",
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
      "Verification selects Actions only from Task-owned or explicitly attributed current-Task changes",
      "Other-Task and external-unattributed changes are reported with causal inclusion or exclusion reasons and do not silently expand Task proof",
      "The 64-path mixed-worktree reliability fixture reaches the recorded target without regressing clean control behavior",
      "Compact verification output reports attribution counts while detailed artifacts retain classified paths"
    ],
    "nonGoals": [
      "Implement project integration snapshots or release readiness in this Task"
    ],
    "constraints": [
      "Keep verification generic; coordination supplies attribution without becoming verification authority",
      "Do not add compatibility aliases for unreleased contracts"
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
      "detail": "Carry out \"Implement high-impact public Task-local proof attribution and dirty-worktree isolation\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/model/src/contracts/skopos-impact-report.ts",
        "packages/model/src/contracts/skopos-verification.ts",
        "packages/verification/src/application/task-change-scope/task-change-scope.service.ts",
        "packages/verification/src/application/build-impact-report/build-impact-report.service.ts",
        "packages/runtime/src/application/verification/verification.service.ts",
        "packages/cli/src/cli/commands/verification.ts",
        "packages/cli/src/__tests__/task-change-scope.test.ts",
        "packages/cli/src/__tests__/operational-reliability-baseline.test.ts",
        "packages/cli/src/__tests__/compact-command-output.test.ts"
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
      "acceptanceCriterion": "Verification selects Actions only from Task-owned or explicitly attributed current-Task changes",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Other-Task and external-unattributed changes are reported with causal inclusion or exclusion reasons and do not silently expand Task proof",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The 64-path mixed-worktree reliability fixture reaches the recorded target without regressing clean control behavior",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Compact verification output reports attribution counts while detailed artifacts retain classified paths",
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
      "resolutionReason": "Documented the five-way Task-local attribution contract, digest matching, proof-subject inclusion rules, and compact versus detailed diagnostics.",
      "resolvedAt": "2026-08-03T12:50:39.390Z",
      "resolvedByActorId": "codex-skopos-proof-boundary"
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
      "resolvedAt": "2026-08-03T12:44:11.015Z",
      "resolvedByActorId": "codex-skopos-proof-boundary"
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
      "resolvedAt": "2026-08-03T12:44:16.639Z",
      "resolvedByActorId": "codex-skopos-proof-boundary"
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
    "docs/architecture/evidence-and-readiness-model.md",
    "docs/decisions/D-20260803-task-local-proof-and-project-integration-readiness-boundary.md",
    "docs/findings/F-20260803-task-proof-boundary-and-dirty-worktree-isolation-gap.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "internal/evals/operational-reliability-baseline.json",
    "packages/cli/src/__tests__/compact-command-output.test.ts",
    "packages/cli/src/__tests__/operational-reliability-baseline.test.ts",
    "packages/cli/src/__tests__/task-change-scope.test.ts",
    "packages/cli/src/cli/commands/verification.ts",
    "packages/model/src/contracts/skopos-impact-report.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/model/src/contracts/skopos-verification.ts",
    "packages/runtime/src/application/verification/verification.service.ts",
    "packages/verification/src/application/build-impact-report/build-impact-report.service.ts",
    "packages/verification/src/application/task-change-scope/task-change-scope.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
