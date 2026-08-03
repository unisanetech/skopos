---
title: "Task: Certify external Action receipts and capability host parity"
status: complete
owner: "codex-skopos-external-proof"
id: T-839640f9
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Certify external Action receipts and capability host parity

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Certify external Action receipts and capability host parity

## Acceptance

- Successful declared external mutation requires a valid run-owned provider receipt matching a declared service.
- Missing or invalid external receipts fail certification without creating reusable successful Evidence.
- Source and clean offline packed CLI fixtures produce identical unavailable and available capability outcomes.
- Packed proof exercises a successful provider-receipt path without exposing secret values.

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
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/cli/commands/actions.ts`
- `packages/indexer/src/application/load-action-manifests/load-action-manifests.service.ts`
- `packages/model/src/contracts/skopos-action.ts`
- `packages/runtime/src/application/actions/actions.service.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Certify external Action receipts and capability host parity" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Successful declared external mutation requires a valid run-owned provider receipt matching a declared service. (closure, agent-observation)
- Missing or invalid external receipts fail certification without creating reusable successful Evidence. (closure, agent-observation)
- Source and clean offline packed CLI fixtures produce identical unavailable and available capability outcomes. (closure, agent-observation)
- Packed proof exercises a successful provider-receipt path without exposing secret values. (closure, agent-observation)
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
  "id": "T-839640f9",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T16:17:55.331Z",
  "updatedAt": "2026-08-03T16:28:44.182Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Certify external Action receipts and capability host parity",
  "goal": "Certify external Action receipts and capability host parity",
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
      "Successful declared external mutation requires a valid run-owned provider receipt matching a declared service.",
      "Missing or invalid external receipts fail certification without creating reusable successful Evidence.",
      "Source and clean offline packed CLI fixtures produce identical unavailable and available capability outcomes.",
      "Packed proof exercises a successful provider-receipt path without exposing secret values."
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
      "detail": "Carry out \"Certify external Action receipts and capability host parity\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/indexer/src/application/load-action-manifests/load-action-manifests.service.ts",
        "packages/runtime/src/application/actions/actions.service.ts",
        "packages/cli/src/cli/commands/actions.ts",
        "packages/cli/src/__tests__/action-hermeticity.test.ts",
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
      "acceptanceCriterion": "Successful declared external mutation requires a valid run-owned provider receipt matching a declared service.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Missing or invalid external receipts fail certification without creating reusable successful Evidence.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Source and clean offline packed CLI fixtures produce identical unavailable and available capability outcomes.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Packed proof exercises a successful provider-receipt path without exposing secret values.",
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
      "resolutionReason": "Evidence architecture now binds provider receipts and preflight-before-reuse host capability semantics.",
      "resolvedAt": "2026-08-03T16:28:07.045Z",
      "resolvedByActorId": "codex-skopos-external-proof"
    },
    {
      "id": "memory-architecture-f171416107",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/action-extension-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/action-extension-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Action architecture now defines provider receipt validation and source/installed host parity.",
      "resolvedAt": "2026-08-03T16:28:13.045Z",
      "resolvedByActorId": "codex-skopos-external-proof"
    },
    {
      "id": "memory-standard-5f2d58a335",
      "role": "standard",
      "reason": "The declared Task scope owns canonical standard Memory at docs/standards/validation.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/standards/validation.md",
      "resolution": "memory-updated",
      "resolutionReason": "Validation standard now requires external receipts, packed parity, and secret non-persistence proof.",
      "resolvedAt": "2026-08-03T16:28:17.267Z",
      "resolvedByActorId": "codex-skopos-external-proof"
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
      "resolvedAt": "2026-08-03T16:18:07.573Z",
      "resolvedByActorId": "codex-skopos-external-proof"
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
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/cli/commands/actions.ts",
    "packages/indexer/src/application/load-action-manifests/load-action-manifests.service.ts",
    "packages/model/src/contracts/skopos-action.ts",
    "packages/runtime/src/application/actions/actions.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
