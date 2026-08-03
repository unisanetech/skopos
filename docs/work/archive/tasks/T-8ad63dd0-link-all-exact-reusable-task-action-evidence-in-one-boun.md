---
title: "Task: Link all exact reusable Task Action Evidence in one bounded operation"
status: complete
owner: "codex-skopos-evidence-reuse"
id: T-8ad63dd0
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Link all exact reusable Task Action Evidence in one bounded operation

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Link all exact reusable Task Action Evidence in one bounded operation

## Acceptance

- One evidence reuse command links every valid required Action run without executing an Action process
- Already linked missing stale and contract-mismatched outcomes are deterministic and explainable
- Compact JSON returns counts unresolved blockers and a stable full report reference
- Linked Actions satisfy the Task's exact selected Action steps and remain source-bound

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/architecture/evidence-and-readiness-model.md`
- `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
- `docs/findings/F-20260803-evidence-reuse-and-agent-transport-economy-gap.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__/action-evidence-reuse.test.ts`
- `packages/cli/src/cli/commands/evidence.ts`
- `packages/cli/src/cli/help.ts`
- `packages/model/src/contracts/skopos-action.ts`
- `packages/runtime/src/application/actions/actions.service.ts`
- `packages/runtime/src/application/evidence/evidence-reuse.service.ts`
- `packages/runtime/src/index.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Link all exact reusable Task Action Evidence in one bounded operation" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- One evidence reuse command links every valid required Action run without executing an Action process (closure, agent-observation)
- Already linked missing stale and contract-mismatched outcomes are deterministic and explainable (closure, agent-observation)
- Compact JSON returns counts unresolved blockers and a stable full report reference (closure, agent-observation)
- Linked Actions satisfy the Task's exact selected Action steps and remain source-bound (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/evidence-and-readiness-model.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes. (target: `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-8ad63dd0",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T14:05:08.183Z",
  "updatedAt": "2026-08-03T14:14:55.766Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Link all exact reusable Task Action Evidence in one bounded operation",
  "goal": "Link all exact reusable Task Action Evidence in one bounded operation",
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
      "One evidence reuse command links every valid required Action run without executing an Action process",
      "Already linked missing stale and contract-mismatched outcomes are deterministic and explainable",
      "Compact JSON returns counts unresolved blockers and a stable full report reference",
      "Linked Actions satisfy the Task's exact selected Action steps and remain source-bound"
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
      "detail": "Carry out \"Link all exact reusable Task Action Evidence in one bounded operation\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/model/src/contracts/skopos-action.ts",
        "packages/runtime/src/application/actions/actions.service.ts",
        "packages/runtime/src/application/evidence/evidence-reuse.service.ts",
        "packages/runtime/src/index.ts",
        "packages/cli/src/cli/commands/evidence.ts",
        "packages/cli/src/cli/help.ts",
        "packages/cli/src/__tests__/action-evidence-reuse.test.ts"
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
      "acceptanceCriterion": "One evidence reuse command links every valid required Action run without executing an Action process",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Already linked missing stale and contract-mismatched outcomes are deterministic and explainable",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Compact JSON returns counts unresolved blockers and a stable full report reference",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Linked Actions satisfy the Task's exact selected Action steps and remain source-bound",
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
      "resolutionReason": "Updated canonical Evidence architecture with explicit one-call reuse outcomes, non-execution behavior, Task-step reconciliation, and bounded report transport.",
      "resolvedAt": "2026-08-03T14:14:26.320Z",
      "resolvedByActorId": "codex-skopos-evidence-reuse"
    },
    {
      "id": "memory-decision-7f31a96932",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the accepted compact transport decision with explicit batch reuse, inline unresolved caps, and stable detail references.",
      "resolvedAt": "2026-08-03T14:14:30.186Z",
      "resolvedByActorId": "codex-skopos-evidence-reuse"
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
      "resolvedAt": "2026-08-03T14:05:18.254Z",
      "resolvedByActorId": "codex-skopos-evidence-reuse"
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
    "docs/architecture/evidence-and-readiness-model.md",
    "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
    "docs/findings/F-20260803-evidence-reuse-and-agent-transport-economy-gap.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/cli/src/__tests__/action-evidence-reuse.test.ts",
    "packages/cli/src/cli/commands/evidence.ts",
    "packages/cli/src/cli/help.ts",
    "packages/model/src/contracts/skopos-action.ts",
    "packages/runtime/src/application/actions/actions.service.ts",
    "packages/runtime/src/application/evidence/evidence-reuse.service.ts",
    "packages/runtime/src/index.ts"
  ]
}
```
<!-- skopos:task-state:end -->
