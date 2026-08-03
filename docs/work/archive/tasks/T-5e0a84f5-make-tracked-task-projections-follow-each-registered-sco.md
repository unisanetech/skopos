---
title: "Task: Make tracked Task projections follow each registered Scope Memory root"
status: complete
owner: "codex-skopos-task-projection"
id: T-5e0a84f5
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-02
---

# Task: Make tracked Task projections follow each registered Scope Memory root

## Changelog

- `2026-08-02`: Synchronized Task state `complete` from Skopos.

## Goal

Make tracked Task projections follow each registered Scope Memory root

## Acceptance

- Standard and high-impact Tasks project to <scope-memory-root>/work/tasks
- Workspace Tasks continue to project under the workspace Memory root
- Portable reconstruction discovers tracked Tasks across declared Memory roots
- Unsafe or missing Scope Memory roots fail closed without adopter-specific fallbacks
- Focused runtime and CLI tests pass

## Non-Goals

- Add Unisane-specific paths, Scope ids, or compatibility aliases

## Constraints

- None declared.

## Owned Paths

- `docs/architecture/00-architecture.md`
- `docs/architecture/artifact-model.md`
- `docs/architecture/docs-governance.md`
- `packages/cli/src/__tests__/compact-command-output.test.ts`
- `packages/cli/src/__tests__/task-portability.test.ts`
- `packages/runtime/src/application/task/task.service.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Does this plan change authentication, authorization, privacy, or security-sensitive behavior?** (decision, complete) — Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make tracked Task projections follow each registered Scope Memory root" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Standard and high-impact Tasks project to <scope-memory-root>/work/tasks (closure, agent-observation)
- Workspace Tasks continue to project under the workspace Memory root (closure, agent-observation)
- Portable reconstruction discovers tracked Tasks across declared Memory roots (closure, agent-observation)
- Unsafe or missing Scope Memory roots fail closed without adopter-specific fallbacks (closure, agent-observation)
- Focused runtime and CLI tests pass (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/artifact-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/artifact-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes. (target: `docs/architecture/docs-governance.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-5e0a84f5",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-02T00:27:44.934Z",
  "updatedAt": "2026-08-02T00:45:29.398Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Make tracked Task projections follow each registered Scope Memory root",
  "goal": "Make tracked Task projections follow each registered Scope Memory root",
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
      "Standard and high-impact Tasks project to <scope-memory-root>/work/tasks",
      "Workspace Tasks continue to project under the workspace Memory root",
      "Portable reconstruction discovers tracked Tasks across declared Memory roots",
      "Unsafe or missing Scope Memory roots fail closed without adopter-specific fallbacks",
      "Focused runtime and CLI tests pass"
    ],
    "nonGoals": [
      "Add Unisane-specific paths, Scope ids, or compatibility aliases"
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
      "id": "decision-plan.security-privacy-change",
      "kind": "decision",
      "title": "Does this plan change authentication, authorization, privacy, or security-sensitive behavior?",
      "detail": "Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.",
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
      "detail": "Carry out \"Make tracked Task projections follow each registered Scope Memory root\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/runtime/src/application/task/task.service.ts",
        "packages/cli/src/__tests__/task-portability.test.ts",
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
      "acceptanceCriterion": "Standard and high-impact Tasks project to <scope-memory-root>/work/tasks",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Workspace Tasks continue to project under the workspace Memory root",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Portable reconstruction discovers tracked Tasks across declared Memory roots",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Unsafe or missing Scope Memory roots fail closed without adopter-specific fallbacks",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Focused runtime and CLI tests pass",
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
      "id": "memory-architecture-1e8076edb8",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/artifact-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/artifact-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical architecture for Scope-relative Task projection and cross-root reconstruction.",
      "resolvedAt": "2026-08-02T00:43:07.759Z",
      "resolvedByActorId": "codex-skopos-task-projection"
    },
    {
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical architecture for Scope-relative Task projection and cross-root reconstruction.",
      "resolvedAt": "2026-08-02T00:43:10.253Z",
      "resolvedByActorId": "codex-skopos-task-projection"
    },
    {
      "id": "memory-architecture-fbdc372589",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/docs-governance.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical architecture for Scope-relative Task projection and cross-root reconstruction.",
      "resolvedAt": "2026-08-02T00:43:10.028Z",
      "resolvedByActorId": "codex-skopos-task-projection"
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
      "resolvedAt": "2026-08-02T00:28:19.619Z",
      "resolvedByActorId": "codex-skopos-task-projection"
    },
    {
      "id": "plan.security-privacy-change",
      "category": "security",
      "escalation": "must-ask",
      "question": "Does this plan change authentication, authorization, privacy, or security-sensitive behavior?",
      "whyItMatters": "Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.",
      "recommendedOptionId": "confirm-security-policy",
      "options": [
        {
          "id": "confirm-security-policy",
          "label": "Confirm policy first",
          "rationale": "Recommended because security-sensitive changes should follow an explicit policy choice."
        },
        {
          "id": "implement-fast-path",
          "label": "Implement fast path",
          "rationale": "Use only when the required policy is already settled and documented."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "implement-fast-path",
      "resolvedAt": "2026-08-02T00:28:24.167Z",
      "resolvedByActorId": "codex-skopos-task-projection"
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
      "id": "resolve-plan.security-privacy-change",
      "title": "Resolve: Does this plan change authentication, authorization, privacy, or security-sensitive behavior?",
      "summary": "Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.security-privacy-change",
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
    "docs/architecture/00-architecture.md",
    "docs/architecture/artifact-model.md",
    "docs/architecture/docs-governance.md",
    "packages/cli/src/__tests__/compact-command-output.test.ts",
    "packages/cli/src/__tests__/task-portability.test.ts",
    "packages/runtime/src/application/task/task.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
