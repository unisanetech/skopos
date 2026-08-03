---
title: "Task: Complete explicit project-integration proof subjects and certify mixed-worktree isolation"
status: complete
owner: "codex"
id: T-0c951e17
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-2601ce222e18927b
lastUpdated: 2026-08-03
---

# Task: Complete explicit project-integration proof subjects and certify mixed-worktree isolation

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Complete explicit project-integration proof subjects and certify mixed-worktree isolation

## Acceptance

- Task artifacts, verification, and Readiness name task-closure or project-integration with a stable immutable baseline identity.
- A generic dirty multi-Scope fixture proves narrow Task isolation and explicit project-integration inclusion with explainable selection.
- Generated and deleted paths retain causal attribution, and external or other-Task paths remain excluded from narrow proof.
- Every Action explicitly declares overlay-safe live-worktree execution and that declaration is source-bound Evidence.
- The canonical Decision, architecture, Plan, and Finding reflect the implemented contract, and the MUST Finding closes with focused proof.

## Non-Goals

- Implement release-provider publication workflows.

## Constraints

- Preserve the single Task, Action, Guard, Evidence, and Readiness authority.

## Owned Paths

- `docs/architecture/evidence-and-readiness-model.md`
- `docs/decisions/D-20260803-task-local-proof-and-project-integration-readiness-boundary.md`
- `docs/findings/F-20260803-task-proof-boundary-and-dirty-worktree-isolation-gap.md`
- `docs/findings/archive`
- `docs/work/archive/tasks`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__`
- `packages/cli/src/benchmarks`
- `packages/cli/src/cli`
- `packages/indexer/src/application`
- `packages/model/src/contracts`
- `packages/runtime/src/application`
- `packages/verification/src/application`
- `tools/skopos/actions`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Complete explicit project-integration proof subjects and certify mixed-worktree isolation" inside the resolved scope before widening impact to adjacent areas.
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

- Task artifacts, verification, and Readiness name task-closure or project-integration with a stable immutable baseline identity. (closure, agent-observation)
- A generic dirty multi-Scope fixture proves narrow Task isolation and explicit project-integration inclusion with explainable selection. (closure, agent-observation)
- Generated and deleted paths retain causal attribution, and external or other-Task paths remain excluded from narrow proof. (closure, agent-observation)
- Every Action explicitly declares overlay-safe live-worktree execution and that declaration is source-bound Evidence. (closure, agent-observation)
- The canonical Decision, architecture, Plan, and Finding reflect the implemented contract, and the MUST Finding closes with focused proof. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
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
  "id": "T-0c951e17",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T17:08:08.153Z",
  "updatedAt": "2026-08-03T17:35:32.499Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Complete explicit project-integration proof subjects and certify mixed-worktree isolation",
  "goal": "Complete explicit project-integration proof subjects and certify mixed-worktree isolation",
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
      "Task artifacts, verification, and Readiness name task-closure or project-integration with a stable immutable baseline identity.",
      "A generic dirty multi-Scope fixture proves narrow Task isolation and explicit project-integration inclusion with explainable selection.",
      "Generated and deleted paths retain causal attribution, and external or other-Task paths remain excluded from narrow proof.",
      "Every Action explicitly declares overlay-safe live-worktree execution and that declaration is source-bound Evidence.",
      "The canonical Decision, architecture, Plan, and Finding reflect the implemented contract, and the MUST Finding closes with focused proof."
    ],
    "nonGoals": [
      "Implement release-provider publication workflows."
    ],
    "constraints": [
      "Preserve the single Task, Action, Guard, Evidence, and Readiness authority."
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-2601ce222e18927b"
  },
  "priority": 90,
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
      "detail": "Carry out \"Complete explicit project-integration proof subjects and certify mixed-worktree isolation\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/model/src/contracts",
        "packages/verification/src/application",
        "packages/runtime/src/application",
        "packages/indexer/src/application",
        "packages/cli/src/cli",
        "packages/cli/src/__tests__",
        "packages/cli/src/benchmarks"
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
      "acceptanceCriterion": "Task artifacts, verification, and Readiness name task-closure or project-integration with a stable immutable baseline identity.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A generic dirty multi-Scope fixture proves narrow Task isolation and explicit project-integration inclusion with explainable selection.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Generated and deleted paths retain causal attribution, and external or other-Task paths remain excluded from narrow proof.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Every Action explicitly declares overlay-safe live-worktree execution and that declaration is source-bound Evidence.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "The canonical Decision, architecture, Plan, and Finding reflect the implemented contract, and the MUST Finding closes with focused proof.",
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
      "id": "memory-architecture-579535b5d3",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/evidence-and-readiness-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Synchronized the Evidence and Readiness architecture, Action extension model, accepted Decision, Plan changelog, Pattern reference, and archived Finding with the implemented proof-subject contract.",
      "resolvedAt": "2026-08-03T17:18:12.695Z",
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
      "resolvedOptionId": "narrow-scope-first",
      "resolvedAt": "2026-08-03T17:17:27.547Z",
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
    "docs/architecture/evidence-and-readiness-model.md",
    "docs/decisions/D-20260803-task-local-proof-and-project-integration-readiness-boundary.md",
    "docs/findings/F-20260803-task-proof-boundary-and-dirty-worktree-isolation-gap.md",
    "docs/findings/archive",
    "docs/work/archive/tasks",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/cli/src/__tests__",
    "packages/cli/src/benchmarks",
    "packages/cli/src/cli",
    "packages/indexer/src/application",
    "packages/model/src/contracts",
    "packages/runtime/src/application",
    "packages/verification/src/application",
    "tools/skopos/actions"
  ]
}
```
<!-- skopos:task-state:end -->
