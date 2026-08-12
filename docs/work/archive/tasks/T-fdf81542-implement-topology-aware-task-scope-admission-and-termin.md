---
title: "Task: Implement topology-aware Task Scope admission and terminal question correctness before public release"
status: complete
owner: "codex"
id: T-fdf81542
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-0ea0f516a33fab43
lastUpdated: 2026-08-11
---

# Task: Implement topology-aware Task Scope admission and terminal question correctness before public release

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Implement topology-aware Task Scope admission and terminal question correctness before public release

## Acceptance

- Task start binds one-scope owned paths to the deepest declared project Scope across generic application, service, package, domain, infrastructure, and tool layouts.
- Ambiguous or unrelated multi-Scope ownership fails closed with an exact explicit-scope or split-Task recovery path; it never silently widens authority.
- Public presentation does not trigger public API confirmation, while real external contract changes retain an explicit decision.
- Task finish refuses every open question, including non-blocking questions, until it is resolved, dismissed, or promoted.
- Source and packed CLI fixtures preserve the same Scope, question, Evidence, and Readiness behavior.

## Non-Goals

- Implement automatic semantic child-Task splitting, browser Evidence receipts, or durable convention Memory inference in this Task.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `docs/architecture/docs-governance.md`
- `docs/decisions/D-20260811-topology-aware-task-scope-authority.md`
- `docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md`
- `docs/findings/F-20260811-task-question-closure-invariant-gap.md`
- `docs/findings/F-20260811-topology-aware-task-scope-resolution-gap.md`
- `docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__/planner-question-classification.test.ts`
- `packages/cli/src/__tests__/progressive-workflow.test.ts`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/scope-registry.test.ts`
- `packages/cli/src/__tests__/task-portability.test.ts`
- `packages/model/src/contracts/skopos-scope-lite.ts`
- `packages/planner/src/application/build-plan/build-plan.service.ts`
- `packages/query/src/application/resolve-scope/resolve-scope.service.ts`
- `packages/runtime/src/application/decide/decide.service.ts`
- `packages/runtime/src/application/start/start.service.ts`
- `packages/runtime/src/application/task/task.service.ts`
- `packages/runtime/src/application/verification/verification.service.ts`

## Ownership Expansions

- `2026-08-11T01:29:10.201Z` by `codex`: `docs/architecture/docs-governance.md`, `packages/runtime/src/application/decide/decide.service.ts` — Adopt reviewed authority and legacy decision paths required by the implemented release baseline.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Implement topology-aware Task Scope admission and terminal question correctness before public release" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Task start binds one-scope owned paths to the deepest declared project Scope across generic application, service, package, domain, infrastructure, and tool layouts. (closure, agent-observation)
- Ambiguous or unrelated multi-Scope ownership fails closed with an exact explicit-scope or split-Task recovery path; it never silently widens authority. (closure, agent-observation)
- Public presentation does not trigger public API confirmation, while real external contract changes retain an explicit decision. (closure, agent-observation)
- Task finish refuses every open question, including non-blocking questions, until it is resolved, dismissed, or promoted. (closure, agent-observation)
- Source and packed CLI fixtures preserve the same Scope, question, Evidence, and Readiness behavior. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes. (target: `docs/architecture/docs-governance.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260811-topology-aware-task-scope-authority.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260811-topology-aware-task-scope-authority.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-fdf81542",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T01:05:12.495Z",
  "updatedAt": "2026-08-11T01:32:24.396Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Implement topology-aware Task Scope admission and terminal question correctness before public release",
  "goal": "Implement topology-aware Task Scope admission and terminal question correctness before public release",
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
      "Task start binds one-scope owned paths to the deepest declared project Scope across generic application, service, package, domain, infrastructure, and tool layouts.",
      "Ambiguous or unrelated multi-Scope ownership fails closed with an exact explicit-scope or split-Task recovery path; it never silently widens authority.",
      "Public presentation does not trigger public API confirmation, while real external contract changes retain an explicit decision.",
      "Task finish refuses every open question, including non-blocking questions, until it is resolved, dismissed, or promoted.",
      "Source and packed CLI fixtures preserve the same Scope, question, Evidence, and Readiness behavior."
    ],
    "nonGoals": [
      "Implement automatic semantic child-Task splitting, browser Evidence receipts, or durable convention Memory inference in this Task."
    ],
    "constraints": []
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "The goal contains high-impact signal: release."
    ],
    "signals": {
      "goalSignals": [
        "release"
      ],
      "ownedPathCount": 17,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-planner",
        "skopos-query",
        "skopos-runtime"
      ],
      "impactCategories": [
        "docs",
        "scope-source"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-0ea0f516a33fab43"
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
      "detail": "Carry out \"Implement topology-aware Task Scope admission and terminal question correctness before public release\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/planner-question-classification.test.ts",
        "packages/cli/src/__tests__/progressive-workflow.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/scope-registry.test.ts",
        "packages/cli/src/__tests__/task-portability.test.ts",
        "packages/model/src/contracts/skopos-scope-lite.ts",
        "packages/planner/src/application/build-plan/build-plan.service.ts",
        "packages/query/src/application/resolve-scope/resolve-scope.service.ts",
        "packages/runtime/src/application/decide/decide.service.ts",
        "packages/runtime/src/application/start/start.service.ts",
        "packages/runtime/src/application/task/task.service.ts",
        "packages/runtime/src/application/verification/verification.service.ts"
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
      "acceptanceCriterion": "Task start binds one-scope owned paths to the deepest declared project Scope across generic application, service, package, domain, infrastructure, and tool layouts.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Ambiguous or unrelated multi-Scope ownership fails closed with an exact explicit-scope or split-Task recovery path; it never silently widens authority.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Public presentation does not trigger public API confirmation, while real external contract changes retain an explicit decision.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Task finish refuses every open question, including non-blocking questions, until it is resolved, dismissed, or promoted.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Source and packed CLI fixtures preserve the same Scope, question, Evidence, and Readiness behavior.",
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
      "id": "memory-architecture-fbdc372589",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/docs-governance.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated Scope authority governance to require deepest-owner resolution, fail-closed ambiguity, and operational answers.",
      "resolvedAt": "2026-08-11T01:30:14.965Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "memory-decision-92ec6dfb32",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260811-topology-aware-task-scope-authority.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260811-topology-aware-task-scope-authority.md",
      "resolution": "memory-updated",
      "resolutionReason": "Recorded the implemented release baseline and the remaining topology target work.",
      "resolvedAt": "2026-08-11T01:30:16.406Z",
      "resolvedByActorId": "codex"
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
      "resolvedAt": "2026-08-11T01:05:23.477Z",
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
      "resolvedAt": "2026-08-11T01:05:22.453Z",
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
  "ownershipExpansions": [
    {
      "paths": [
        "docs/architecture/docs-governance.md",
        "packages/runtime/src/application/decide/decide.service.ts"
      ],
      "reason": "Adopt reviewed authority and legacy decision paths required by the implemented release baseline.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T01:29:10.201Z",
      "baselinePaths": [
        {
          "path": "docs/architecture/docs-governance.md",
          "digest": "80943bad5f4dd3106f587967592ba842e18127c48288a803fbbb6522d0315b88"
        },
        {
          "path": "packages/runtime/src/application/decide/decide.service.ts",
          "digest": "edd2a7ede7035b2ba0d592a48b2124c2f472ba4e290b4ce0fb75385fc40f35ca"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/docs-governance.md",
    "docs/decisions/D-20260811-topology-aware-task-scope-authority.md",
    "docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md",
    "docs/findings/F-20260811-task-question-closure-invariant-gap.md",
    "docs/findings/F-20260811-topology-aware-task-scope-resolution-gap.md",
    "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/cli/src/__tests__/planner-question-classification.test.ts",
    "packages/cli/src/__tests__/progressive-workflow.test.ts",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/scope-registry.test.ts",
    "packages/cli/src/__tests__/task-portability.test.ts",
    "packages/model/src/contracts/skopos-scope-lite.ts",
    "packages/planner/src/application/build-plan/build-plan.service.ts",
    "packages/query/src/application/resolve-scope/resolve-scope.service.ts",
    "packages/runtime/src/application/decide/decide.service.ts",
    "packages/runtime/src/application/start/start.service.ts",
    "packages/runtime/src/application/task/task.service.ts",
    "packages/runtime/src/application/verification/verification.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
