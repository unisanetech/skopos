---
title: "Task: Make routine Skopos work lightweight while preserving strict high-impact readiness"
status: cancelled
owner: "project"
id: T-72dc17a2
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-78bf6ed0197ce5ec
lastUpdated: 2026-08-09
---

# Task: Make routine Skopos work lightweight while preserving strict high-impact readiness

## Changelog

- `2026-08-09`: Synchronized Task state `cancelled` from Skopos.

## Goal

Make routine Skopos work lightweight while preserving strict high-impact readiness

## Acceptance

- Task admission records an explainable automatic risk recommendation derived from goal, owned paths, affected scopes, and proof subject, while explicit risk remains an audited override
- Light Tasks use a compact fast path with a clear focused-proof next step and no tracked Task document or immutable snapshot requirement
- Impact output explains why Guards and Actions were selected and why otherwise relevant Guards were skipped
- Active Tasks identify changed workspace paths outside declared ownership and provide an exact ownership-expansion recommendation
- CLI success and failure guidance states what happened, readiness status, and the safest next command

## Non-Goals

- Build the richer interactive UI workflow in this Task
- Create project-specific semantic Guards in Skopos core

## Constraints

- Preserve current high-impact snapshot and readiness enforcement
- Do not absorb unrelated dirty-worktree changes

## Owned Paths

- `README.md`
- `docs/architecture/agent-native-operating-model.md`
- `docs/architecture/evidence-and-readiness-model.md`
- `docs/guides/developer-workflows.md`
- `packages/cli/src/__tests__`
- `packages/cli/src/cli/commands/impact.ts`
- `packages/cli/src/cli/commands/router.ts`
- `packages/cli/src/cli/help.ts`
- `packages/indexer/src/application/match-actions/match-actions.service.ts`
- `packages/model/src/contracts/skopos-impact-report.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/runtime/src/application/impact/impact.service.ts`
- `packages/runtime/src/application/start/start.service.ts`
- `packages/runtime/src/application/task/task.service.ts`
- `packages/verification/src/application/build-impact-report/build-impact-report.service.ts`

## Steps

- [ ] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, pending) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [ ] **Resolve plan decisions** (implementation, pending) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [ ] **Record Task risk and detail before editing** (implementation, pending) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [ ] **Review the current pattern in Skopos Workspace** (implementation, pending) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Make routine Skopos work lightweight while preserving strict high-impact readiness" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [ ] **Typecheck the Skopos workspace** (action, pending) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Task admission records an explainable automatic risk recommendation derived from goal, owned paths, affected scopes, and proof subject, while explicit risk remains an audited override (closure, agent-observation)
- Light Tasks use a compact fast path with a clear focused-proof next step and no tracked Task document or immutable snapshot requirement (closure, agent-observation)
- Impact output explains why Guards and Actions were selected and why otherwise relevant Guards were skipped (closure, agent-observation)
- Active Tasks identify changed workspace paths outside declared ownership and provide an exact ownership-expansion recommendation (closure, agent-observation)
- CLI success and failure guidance states what happened, readiness status, and the safest next command (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [open] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/evidence-and-readiness-model.md`)
- [open] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`)
- [open] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-72dc17a2",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-09T03:56:26.977Z",
  "updatedAt": "2026-08-09T03:56:59.833Z",
  "planIds": [],
  "childTasks": [],
  "state": "cancelled",
  "detail": "detailed",
  "title": "Make routine Skopos work lightweight while preserving strict high-impact readiness",
  "goal": "Make routine Skopos work lightweight while preserving strict high-impact readiness",
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
      "Task admission records an explainable automatic risk recommendation derived from goal, owned paths, affected scopes, and proof subject, while explicit risk remains an audited override",
      "Light Tasks use a compact fast path with a clear focused-proof next step and no tracked Task document or immutable snapshot requirement",
      "Impact output explains why Guards and Actions were selected and why otherwise relevant Guards were skipped",
      "Active Tasks identify changed workspace paths outside declared ownership and provide an exact ownership-expansion recommendation",
      "CLI success and failure guidance states what happened, readiness status, and the safest next command"
    ],
    "nonGoals": [
      "Build the richer interactive UI workflow in this Task",
      "Create project-specific semantic Guards in Skopos core"
    ],
    "constraints": [
      "Preserve current high-impact snapshot and readiness enforcement",
      "Do not absorb unrelated dirty-worktree changes"
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-78bf6ed0197ce5ec"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.scope-confirmation",
      "kind": "decision",
      "title": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "detail": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "status": "pending"
    },
    {
      "id": "step-resolve-decisions",
      "kind": "implementation",
      "title": "Resolve plan decisions",
      "detail": "Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.",
      "status": "pending"
    },
    {
      "id": "step-record-task-risk",
      "kind": "implementation",
      "title": "Record Task risk and detail before editing",
      "detail": "Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.",
      "status": "pending"
    },
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in Skopos Workspace",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "pending"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Make routine Skopos work lightweight while preserving strict high-impact readiness\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "pending"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "pending"
    },
    {
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck the Skopos workspace",
      "detail": "Required by Guard quality.typecheck.",
      "status": "pending"
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
        "packages/indexer/src/application/match-actions/match-actions.service.ts",
        "packages/verification/src/application/build-impact-report/build-impact-report.service.ts",
        "packages/runtime/src/application/start/start.service.ts",
        "packages/runtime/src/application/task/task.service.ts",
        "packages/runtime/src/application/impact/impact.service.ts",
        "packages/cli/src/cli/commands/router.ts",
        "packages/cli/src/cli/commands/impact.ts",
        "packages/cli/src/cli/help.ts",
        "packages/cli/src/__tests__"
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
      "acceptanceCriterion": "Task admission records an explainable automatic risk recommendation derived from goal, owned paths, affected scopes, and proof subject, while explicit risk remains an audited override",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Light Tasks use a compact fast path with a clear focused-proof next step and no tracked Task document or immutable snapshot requirement",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Impact output explains why Guards and Actions were selected and why otherwise relevant Guards were skipped",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Active Tasks identify changed workspace paths outside declared ownership and provide an exact ownership-expansion recommendation",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "CLI success and failure guidance states what happened, readiness status, and the safest next command",
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
      "status": "open",
      "targetPath": "docs/architecture/evidence-and-readiness-model.md"
    },
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "open",
      "targetPath": "docs/architecture/agent-native-operating-model.md"
    },
    {
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "open",
      "targetPath": "docs/guides/developer-workflows.md"
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
      "status": "open"
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
      "status": "open"
    },
    {
      "id": "run-quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "summary": "Required by Guard quality.typecheck.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.typecheck",
      "blocking": false,
      "status": "open"
    }
  ],
  "disposition": {
    "kind": "cancel",
    "reason": "User expanded the implementation to include the UI workflow, semantic Guard templates, and real-project evaluations, which contradicts this untouched Task's explicit non-goals.",
    "actorId": "codex-progressive-work",
    "recordedAt": "2026-08-09T03:56:59.833Z",
    "priorState": "active",
    "nextState": "cancelled"
  },
  "declaredOwnedPaths": [
    "README.md",
    "docs/architecture/agent-native-operating-model.md",
    "docs/architecture/evidence-and-readiness-model.md",
    "docs/guides/developer-workflows.md",
    "packages/cli/src/__tests__",
    "packages/cli/src/cli/commands/impact.ts",
    "packages/cli/src/cli/commands/router.ts",
    "packages/cli/src/cli/help.ts",
    "packages/indexer/src/application/match-actions/match-actions.service.ts",
    "packages/model/src/contracts/skopos-impact-report.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/runtime/src/application/impact/impact.service.ts",
    "packages/runtime/src/application/start/start.service.ts",
    "packages/runtime/src/application/task/task.service.ts",
    "packages/verification/src/application/build-impact-report/build-impact-report.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
