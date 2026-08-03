---
title: "Task: Certify Action effects through a clean offline packed CLI installation"
status: cancelled
owner: "project"
id: T-95f7d411
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Certify Action effects through a clean offline packed CLI installation

## Changelog

- `2026-08-03`: Synchronized Task state `cancelled` from Skopos.

## Goal

Certify Action effects through a clean offline packed CLI installation

## Acceptance

- A fresh project outside the monorepo installs only the packed CLI tarball with offline dependency resolution
- The installed CLI runs an offline artifact-producing Action and returns an isolated stable artifact reference
- The installed CLI rejects an undeclared workspace mutation and reports a required external capability as unavailable before executing its command
- Packed proof uses the public skopos binary and declared Action manifests without workspace package resolution

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/decisions/031-bundled-cli-release-contract.md`
- `docs/decisions/D-20260803-action-effects-and-hermetic-execution-contract.md`
- `docs/findings/F-20260803-action-hermeticity-and-effect-classification-gap.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [ ] **Resolve plan decisions** (implementation, pending) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [ ] **Record Task risk and detail before editing** (implementation, pending) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [ ] **Review the current pattern in Skopos Workspace** (implementation, pending) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Certify Action effects through a clean offline packed CLI installation" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [ ] **Typecheck the Skopos workspace** (action, pending) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- A fresh project outside the monorepo installs only the packed CLI tarball with offline dependency resolution (closure, agent-observation)
- The installed CLI runs an offline artifact-producing Action and returns an isolated stable artifact reference (closure, agent-observation)
- The installed CLI rejects an undeclared workspace mutation and reports a required external capability as unavailable before executing its command (closure, agent-observation)
- Packed proof uses the public skopos binary and declared Action manifests without workspace package resolution (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [open] decision: The declared Task scope owns canonical decision Memory at docs/decisions/031-bundled-cli-release-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/031-bundled-cli-release-contract.md`)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-95f7d411",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-03T15:16:31.359Z",
  "updatedAt": "2026-08-03T15:20:10.281Z",
  "planIds": [],
  "childTasks": [],
  "state": "cancelled",
  "detail": "standard",
  "title": "Certify Action effects through a clean offline packed CLI installation",
  "goal": "Certify Action effects through a clean offline packed CLI installation",
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
      "A fresh project outside the monorepo installs only the packed CLI tarball with offline dependency resolution",
      "The installed CLI runs an offline artifact-producing Action and returns an isolated stable artifact reference",
      "The installed CLI rejects an undeclared workspace mutation and reports a required external capability as unavailable before executing its command",
      "Packed proof uses the public skopos binary and declared Action manifests without workspace package resolution"
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
      "detail": "Carry out \"Certify Action effects through a clean offline packed CLI installation\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/release-install-smoke.test.ts"
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
      "acceptanceCriterion": "A fresh project outside the monorepo installs only the packed CLI tarball with offline dependency resolution",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The installed CLI runs an offline artifact-producing Action and returns an isolated stable artifact reference",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The installed CLI rejects an undeclared workspace mutation and reports a required external capability as unavailable before executing its command",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Packed proof uses the public skopos binary and declared Action manifests without workspace package resolution",
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
      "status": "open",
      "targetPath": "docs/decisions/031-bundled-cli-release-contract.md"
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
      "resolvedAt": "2026-08-03T15:16:45.356Z",
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
      "status": "open"
    }
  ],
  "disposition": {
    "kind": "cancel",
    "reason": "Packed proof exposed a runtime knowledge-index defect outside the original owned paths: isolated JSON artifacts are misread as Action Runs. Replacing this Task with an expanded exact-file Task that owns the fix and regression proof.",
    "actorId": "codex-skopos-packed-proof",
    "recordedAt": "2026-08-03T15:20:10.281Z",
    "priorState": "active",
    "nextState": "cancelled"
  },
  "declaredOwnedPaths": [
    "docs/decisions/031-bundled-cli-release-contract.md",
    "docs/decisions/D-20260803-action-effects-and-hermetic-execution-contract.md",
    "docs/findings/F-20260803-action-hermeticity-and-effect-classification-gap.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/cli/src/__tests__/release-install-smoke.test.ts"
  ]
}
```
<!-- skopos:task-state:end -->
