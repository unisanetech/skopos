---
title: "Task: Fix installed Action artifact indexing and certify effects through a clean offline packed CLI"
status: complete
owner: "codex-skopos-packed-proof"
id: T-f1dad6f6
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Fix installed Action artifact indexing and certify effects through a clean offline packed CLI

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Fix installed Action artifact indexing and certify effects through a clean offline packed CLI

## Acceptance

- Knowledge indexing only treats valid top-level Action Run artifacts as runs and never indexes isolated JSON outputs as runs
- A fresh project outside the monorepo installs only the packed CLI tarball with offline dependency resolution
- The installed CLI runs an artifact-producing Action with an isolated stable reference, rejects undeclared workspace mutation, and reports a missing external service before command execution
- Packed proof uses the public skopos binary and declared manifests without workspace package resolution

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/decisions/031-bundled-cli-release-contract.md`
- `docs/decisions/D-20260803-action-effects-and-hermetic-execution-contract.md`
- `docs/findings/F-20260803-action-hermeticity-and-effect-classification-gap.md`
- `docs/work/archive/tasks/T-95f7d411-certify-action-effects-through-a-clean-offline-packed-cl.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__/action-hermeticity.test.ts`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/runtime/src/application/shared/knowledge-state.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Fix installed Action artifact indexing and certify effects through a clean offline packed CLI" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Knowledge indexing only treats valid top-level Action Run artifacts as runs and never indexes isolated JSON outputs as runs (closure, agent-observation)
- A fresh project outside the monorepo installs only the packed CLI tarball with offline dependency resolution (closure, agent-observation)
- The installed CLI runs an artifact-producing Action with an isolated stable reference, rejects undeclared workspace mutation, and reports a missing external service before command execution (closure, agent-observation)
- Packed proof uses the public skopos binary and declared manifests without workspace package resolution (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/031-bundled-cli-release-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/031-bundled-cli-release-contract.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-f1dad6f6",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T15:20:26.242Z",
  "updatedAt": "2026-08-03T15:25:33.498Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Fix installed Action artifact indexing and certify effects through a clean offline packed CLI",
  "goal": "Fix installed Action artifact indexing and certify effects through a clean offline packed CLI",
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
      "Knowledge indexing only treats valid top-level Action Run artifacts as runs and never indexes isolated JSON outputs as runs",
      "A fresh project outside the monorepo installs only the packed CLI tarball with offline dependency resolution",
      "The installed CLI runs an artifact-producing Action with an isolated stable reference, rejects undeclared workspace mutation, and reports a missing external service before command execution",
      "Packed proof uses the public skopos binary and declared manifests without workspace package resolution"
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
      "detail": "Carry out \"Fix installed Action artifact indexing and certify effects through a clean offline packed CLI\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/runtime/src/application/shared/knowledge-state.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/action-hermeticity.test.ts"
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
      "acceptanceCriterion": "Knowledge indexing only treats valid top-level Action Run artifacts as runs and never indexes isolated JSON outputs as runs",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A fresh project outside the monorepo installs only the packed CLI tarball with offline dependency resolution",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The installed CLI runs an artifact-producing Action with an isolated stable reference, rejects undeclared workspace mutation, and reports a missing external service before command execution",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Packed proof uses the public skopos binary and declared manifests without workspace package resolution",
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
      "id": "memory-decision-24824ea4ce",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/031-bundled-cli-release-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/031-bundled-cli-release-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "The bundled CLI release contract now requires and records installed Action effect certification through the external offline smoke.",
      "resolvedAt": "2026-08-03T15:24:19.403Z",
      "resolvedByActorId": "codex-skopos-packed-proof"
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
      "resolvedAt": "2026-08-03T15:20:37.699Z",
      "resolvedByActorId": "codex-skopos-packed-proof"
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
    "docs/decisions/031-bundled-cli-release-contract.md",
    "docs/decisions/D-20260803-action-effects-and-hermetic-execution-contract.md",
    "docs/findings/F-20260803-action-hermeticity-and-effect-classification-gap.md",
    "docs/work/archive/tasks/T-95f7d411-certify-action-effects-through-a-clean-offline-packed-cl.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/cli/src/__tests__/action-hermeticity.test.ts",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/runtime/src/application/shared/knowledge-state.ts"
  ]
}
```
<!-- skopos:task-state:end -->
