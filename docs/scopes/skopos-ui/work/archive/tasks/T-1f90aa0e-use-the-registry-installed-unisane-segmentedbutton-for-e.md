---
title: "Task: Use the registry-installed Unisane SegmentedButton for every route view selector"
status: complete
owner: "codex-skopos-unisane-segmented-button"
id: T-1f90aa0e
scope: "skopos-ui"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-d84b385ef9326e1c
lastUpdated: 2026-08-04
---

# Task: Use the registry-installed Unisane SegmentedButton for every route view selector

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Use the registry-installed Unisane SegmentedButton for every route view selector

## Acceptance

- Plans, Tasks, Docs, Decisions, and Issues use the registry-installed SegmentedButton with no Skopos class overrides and no enclosing panel border.
- The Unisane default checkmark, control outline, selected colors, spacing, focus behavior, and arrow-key behavior remain intact while selection updates the canonical URL or local document view.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `packages/ui/src/__tests__/route-filter-bar.test.tsx`
- `packages/ui/src/components/ui/segmented-button.tsx`
- `packages/ui/src/patterns/sections/content/list-primitives.tsx`
- `packages/ui/src/screens/knowledge/document-screens.tsx`
- `packages/ui/src/screens/knowledge/plan-screens.tsx`
- `packages/ui/src/screens/work/execution-screens.tsx`
- `packages/ui/src/support/ui/filter-chip.ts`

## Steps

- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos UI** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Use the registry-installed Unisane SegmentedButton for every route view selector" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.
- [x] **Build routed Skopos console app** (action, complete) — Required by Guard ui.console-build.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.build-console-app`: Required by Guard ui.console-build.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`
- Guard `ui.console-build`

## Evidence And Readiness

- Plans, Tasks, Docs, Decisions, and Issues use the registry-installed SegmentedButton with no Skopos class overrides and no enclosing panel border. (closure, agent-observation)
- The Unisane default checkmark, control outline, selected colors, spacing, focus behavior, and arrow-key behavior remain intact while selection updates the canonical URL or local document view. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)
- Guard ui.console-build: Console changes require build Evidence (closure, source-bound-action)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-1f90aa0e",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T09:50:49.231Z",
  "updatedAt": "2026-08-04T09:57:00.575Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Use the registry-installed Unisane SegmentedButton for every route view selector",
  "goal": "Use the registry-installed Unisane SegmentedButton for every route view selector",
  "scope": {
    "query": "skopos-ui",
    "matchedBy": "id",
    "scope": {
      "id": "skopos-ui",
      "kind": "application",
      "title": "Skopos UI",
      "path": "packages/ui",
      "aliases": [
        "@skopos/ui"
      ],
      "summary": "Skopos UI (core.application).",
      "confidence": "high",
      "parent": "skopos",
      "ancestorIds": [
        "skopos"
      ],
      "profile": "core.application",
      "memoryRoot": "docs/scopes/skopos-ui",
      "codeRoots": [
        "packages/ui"
      ],
      "dependsOn": [
        "skopos-model",
        "skopos-runtime"
      ],
      "owners": [
        "skopos-core"
      ]
    }
  },
  "contract": {
    "acceptanceCriteria": [
      "Plans, Tasks, Docs, Decisions, and Issues use the registry-installed SegmentedButton with no Skopos class overrides and no enclosing panel border.",
      "The Unisane default checkmark, control outline, selected colors, spacing, focus behavior, and arrow-key behavior remain intact while selection updates the canonical URL or local document view."
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-d84b385ef9326e1c"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
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
      "title": "Review the current pattern in Skopos UI",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "complete"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Use the registry-installed Unisane SegmentedButton for every route view selector\" inside the resolved scope before widening impact to adjacent areas.",
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
    },
    {
      "id": "action-ui.build-console-app",
      "kind": "action",
      "title": "Build routed Skopos console app",
      "detail": "Required by Guard ui.console-build.",
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
        "packages/ui/src/components/ui/segmented-button.tsx",
        "packages/ui/src/patterns/sections/content/list-primitives.tsx",
        "packages/ui/src/screens/knowledge/plan-screens.tsx",
        "packages/ui/src/screens/knowledge/document-screens.tsx",
        "packages/ui/src/screens/work/execution-screens.tsx",
        "packages/ui/src/support/ui/filter-chip.ts",
        "packages/ui/src/__tests__/route-filter-bar.test.tsx"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "ui.build-console-app",
      "title": "Build routed Skopos console app",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-build-console-app.yaml",
      "reason": "Required by Guard ui.console-build.",
      "matchedPaths": [
        "packages/ui/src/components/ui/segmented-button.tsx",
        "packages/ui/src/patterns/sections/content/list-primitives.tsx",
        "packages/ui/src/screens/knowledge/plan-screens.tsx",
        "packages/ui/src/screens/knowledge/document-screens.tsx",
        "packages/ui/src/screens/work/execution-screens.tsx",
        "packages/ui/src/support/ui/filter-chip.ts",
        "packages/ui/src/__tests__/route-filter-bar.test.tsx"
      ],
      "outputPaths": [
        ".skopos/ui/app"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.focused-behavior-proof",
    "quality.typecheck",
    "ui.console-build"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Plans, Tasks, Docs, Decisions, and Issues use the registry-installed SegmentedButton with no Skopos class overrides and no enclosing panel border.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The Unisane default checkmark, control outline, selected colors, spacing, focus behavior, and arrow-key behavior remain intact while selection updates the canonical URL or local document view.",
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
    },
    {
      "id": "guard-ui.console-build",
      "acceptanceCriterion": "Guard ui.console-build: Console changes require build Evidence",
      "phase": "closure",
      "actionIds": [
        "ui.build-console-app"
      ],
      "guardIds": [
        "ui.console-build"
      ],
      "evidence": "source-bound-action"
    }
  ],
  "memoryObligations": [],
  "questions": [
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
      "resolvedOptionId": "internal-only-change",
      "resolvedAt": "2026-08-04T09:51:05.259Z",
      "resolvedByActorId": "codex-skopos-unisane-segmented-button"
    }
  ],
  "recommendations": [
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
    },
    {
      "id": "run-ui.build-console-app",
      "title": "Build routed Skopos console app",
      "summary": "Required by Guard ui.console-build.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.build-console-app",
      "blocking": false,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    "packages/ui/src/__tests__/route-filter-bar.test.tsx",
    "packages/ui/src/components/ui/segmented-button.tsx",
    "packages/ui/src/patterns/sections/content/list-primitives.tsx",
    "packages/ui/src/screens/knowledge/document-screens.tsx",
    "packages/ui/src/screens/knowledge/plan-screens.tsx",
    "packages/ui/src/screens/work/execution-screens.tsx",
    "packages/ui/src/support/ui/filter-chip.ts"
  ]
}
```
<!-- skopos:task-state:end -->
