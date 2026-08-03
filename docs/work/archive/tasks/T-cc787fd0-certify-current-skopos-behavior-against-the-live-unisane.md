---
title: "Task: Certify current Skopos behavior against the live Unisane workspace"
status: complete
owner: "codex-skopos-unisane-report"
id: T-cc787fd0
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Certify current Skopos behavior against the live Unisane workspace

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Certify current Skopos behavior against the live Unisane workspace

## Acceptance

- A reproducible pilot measures dirty-worktree scale, Session, Work Queue, Task, Action catalog, cursor integrity, and question classification against Unisane without executing Actions or creating Tasks
- Every default agent payload stays below the declared 32 KiB budget and paged collections expose complete counts and non-overlapping cursors
- The observed operational-homonym goal creates no vendor, destructive-migration, or security question in Unisane context
- The generated report states current limitations and does not claim broader Unisane implementation or release readiness

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
- `docs/reference/generated/unisane-external-workspace-pilot.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `package.json`
- `packages/cli/package.json`
- `packages/cli/src/__tests__/external-workspace-pilot.test.ts`
- `packages/cli/src/benchmarks/external-workspace-pilot.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Certify current Skopos behavior against the live Unisane workspace" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- A reproducible pilot measures dirty-worktree scale, Session, Work Queue, Task, Action catalog, cursor integrity, and question classification against Unisane without executing Actions or creating Tasks (closure, agent-observation)
- Every default agent payload stays below the declared 32 KiB budget and paged collections expose complete counts and non-overlapping cursors (closure, agent-observation)
- The observed operational-homonym goal creates no vendor, destructive-migration, or security question in Unisane context (closure, agent-observation)
- The generated report states current limitations and does not claim broader Unisane implementation or release readiness (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes. (target: `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-cc787fd0",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T15:27:58.480Z",
  "updatedAt": "2026-08-03T15:46:56.701Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Certify current Skopos behavior against the live Unisane workspace",
  "goal": "Certify current Skopos behavior against the live Unisane workspace",
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
      "A reproducible pilot measures dirty-worktree scale, Session, Work Queue, Task, Action catalog, cursor integrity, and question classification against Unisane without executing Actions or creating Tasks",
      "Every default agent payload stays below the declared 32 KiB budget and paged collections expose complete counts and non-overlapping cursors",
      "The observed operational-homonym goal creates no vendor, destructive-migration, or security question in Unisane context",
      "The generated report states current limitations and does not claim broader Unisane implementation or release readiness"
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
      "detail": "Carry out \"Certify current Skopos behavior against the live Unisane workspace\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/benchmarks/external-workspace-pilot.ts",
        "packages/cli/src/__tests__/external-workspace-pilot.test.ts",
        "packages/cli/package.json",
        "package.json"
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
      "acceptanceCriterion": "A reproducible pilot measures dirty-worktree scale, Session, Work Queue, Task, Action catalog, cursor integrity, and question classification against Unisane without executing Actions or creating Tasks",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Every default agent payload stays below the declared 32 KiB budget and paged collections expose complete counts and non-overlapping cursors",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The observed operational-homonym goal creates no vendor, destructive-migration, or security question in Unisane context",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The generated report states current limitations and does not claim broader Unisane implementation or release readiness",
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
      "id": "memory-decision-7f31a96932",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
      "resolution": "memory-updated",
      "resolutionReason": "Decision 024 now defines the generic external-workspace pilot and records the live Unisane proof and its limits.",
      "resolvedAt": "2026-08-03T15:46:33.550Z",
      "resolvedByActorId": "codex-skopos-unisane-report"
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
      "resolvedAt": "2026-08-03T15:28:08.011Z",
      "resolvedByActorId": "codex-skopos-unisane-report"
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
    "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
    "docs/reference/generated/unisane-external-workspace-pilot.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "package.json",
    "packages/cli/package.json",
    "packages/cli/src/__tests__/external-workspace-pilot.test.ts",
    "packages/cli/src/benchmarks/external-workspace-pilot.ts"
  ]
}
```
<!-- skopos:task-state:end -->
