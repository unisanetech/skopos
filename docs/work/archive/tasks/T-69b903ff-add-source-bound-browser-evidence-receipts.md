---
title: "Task: Add source-bound browser Evidence receipts"
status: complete
owner: "codex"
id: T-69b903ff
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-786073ed72ee41e4
lastUpdated: 2026-08-11
---

# Task: Add source-bound browser Evidence receipts

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Add source-bound browser Evidence receipts

## Acceptance

- A browser receipt records URL, viewport, interaction, capture or measurement, browser/environment identity, actor, and Task source digest.
- The receipt can cover a Task acceptance requirement and becomes stale after relevant owned source changes.
- The CLI fails closed for missing or unsafe capture artifacts and malformed viewport or URL input.
- Source and packed/public command paths expose the browser receipt without relying on an agent assertion.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 3 non-workspace Scopes.

## Owned Paths

- `docs/architecture/evidence-and-readiness-model.md`
- `docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md`
- `packages/cli/src/__tests__/browser-evidence.test.ts`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/cli/commands/evidence.ts`
- `packages/cli/src/cli/help.ts`
- `packages/model/src/contracts/skopos-verification.ts`
- `packages/runtime/src/application/verification/verification.service.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Add source-bound browser Evidence receipts" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- A browser receipt records URL, viewport, interaction, capture or measurement, browser/environment identity, actor, and Task source digest. (closure, agent-observation)
- The receipt can cover a Task acceptance requirement and becomes stale after relevant owned source changes. (closure, agent-observation)
- The CLI fails closed for missing or unsafe capture artifacts and malformed viewport or URL input. (closure, agent-observation)
- Source and packed/public command paths expose the browser receipt without relying on an agent assertion. (closure, agent-observation)
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
  "id": "T-69b903ff",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T02:27:25.898Z",
  "updatedAt": "2026-08-11T02:35:35.742Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Add source-bound browser Evidence receipts",
  "goal": "Add source-bound browser Evidence receipts",
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
      "A browser receipt records URL, viewport, interaction, capture or measurement, browser/environment identity, actor, and Task source digest.",
      "The receipt can cover a Task acceptance requirement and becomes stale after relevant owned source changes.",
      "The CLI fails closed for missing or unsafe capture artifacts and malformed viewport or URL input.",
      "Source and packed/public command paths expose the browser receipt without relying on an agent assertion."
    ],
    "nonGoals": [],
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
      "Declared ownership affects 3 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 8,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
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
    "baselineId": "baseline-786073ed72ee41e4"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
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
      "detail": "Carry out \"Add source-bound browser Evidence receipts\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/model/src/contracts/skopos-verification.ts",
        "packages/runtime/src/application/verification/verification.service.ts",
        "packages/cli/src/cli/commands/evidence.ts",
        "packages/cli/src/__tests__/browser-evidence.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/cli/help.ts"
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
      "acceptanceCriterion": "A browser receipt records URL, viewport, interaction, capture or measurement, browser/environment identity, actor, and Task source digest.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The receipt can cover a Task acceptance requirement and becomes stale after relevant owned source changes.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The CLI fails closed for missing or unsafe capture artifacts and malformed viewport or URL input.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Source and packed/public command paths expose the browser receipt without relying on an agent assertion.",
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
      "resolutionReason": "The canonical Evidence model now documents the public browser receipt command, validation, source binding, and staleness semantics.",
      "resolvedAt": "2026-08-11T02:34:36.458Z",
      "resolvedByActorId": "codex"
    }
  ],
  "questions": [],
  "recommendations": [
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
    "docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md",
    "packages/cli/src/__tests__/browser-evidence.test.ts",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/cli/commands/evidence.ts",
    "packages/cli/src/cli/help.ts",
    "packages/model/src/contracts/skopos-verification.ts",
    "packages/runtime/src/application/verification/verification.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
