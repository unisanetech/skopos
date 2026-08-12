---
title: "Task: Build the dedicated Skopos Use Cases page"
status: complete
owner: "codex-root"
id: T-1e0f62e4
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-1880c0c219487628
lastUpdated: 2026-08-11
---

# Task: Build the dedicated Skopos Use Cases page

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Build the dedicated Skopos Use Cases page

## Acceptance

- The /use-cases route presents the seven approved scenarios with a recognizable problem, outcome, copyable prompt, and guide
- Prompt copy controls work reliably and communicate success or failure
- The page is responsive, accessible, and verified on desktop and mobile

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `apps/web/src/app/globals.css`
- `apps/web/src/app/use-cases/page.tsx`
- `apps/web/src/features/homepage/__tests__/copy-text.test.ts`
- `apps/web/src/features/homepage/lib/copy-text.ts`
- `apps/web/src/features/homepage/sections/hero-onboarding.tsx`
- `apps/web/src/features/public-pages/public-page-content.ts`
- `apps/web/src/features/use-cases`
- `apps/web/src/lib/copy-text.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Build the dedicated Skopos Use Cases page" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The /use-cases route presents the seven approved scenarios with a recognizable problem, outcome, copyable prompt, and guide (closure, agent-observation)
- Prompt copy controls work reliably and communicate success or failure (closure, agent-observation)
- The page is responsive, accessible, and verified on desktop and mobile (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-1e0f62e4",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T21:16:24.558Z",
  "updatedAt": "2026-08-11T21:25:15.675Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Build the dedicated Skopos Use Cases page",
  "goal": "Build the dedicated Skopos Use Cases page",
  "scope": {
    "query": "skopos-web",
    "matchedBy": "id",
    "scope": {
      "id": "skopos-web",
      "kind": "application",
      "title": "Skopos Public Web",
      "path": "apps/web",
      "aliases": [
        "@skopos/web"
      ],
      "summary": "Skopos Public Web (core.application).",
      "confidence": "high",
      "parent": "skopos",
      "ancestorIds": [
        "skopos"
      ],
      "profile": "core.application",
      "memoryRoot": "docs/scopes/skopos-web",
      "codeRoots": [
        "apps/web"
      ],
      "dependsOn": [],
      "owners": [
        "skopos-core"
      ]
    }
  },
  "contract": {
    "acceptanceCriteria": [
      "The /use-cases route presents the seven approved scenarios with a recognizable problem, outcome, copyable prompt, and guide",
      "Prompt copy controls work reliably and communicate success or failure",
      "The page is responsive, accessible, and verified on desktop and mobile"
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
  "admission": {
    "recommendedRisk": "standard",
    "recommendedDetail": "standard",
    "selectedRisk": "standard",
    "selectedDetail": "standard",
    "selectionSource": "explicit-override",
    "workflow": "tracked",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 8,
      "affectedScopeIds": [
        "skopos",
        "skopos-web"
      ],
      "impactCategories": [
        "scope-source"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-1880c0c219487628"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in Skopos Public Web",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "complete"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Build the dedicated Skopos Use Cases page\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "complete"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "complete"
    }
  ],
  "selectedActions": [],
  "selectedGuardIds": [],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "The /use-cases route presents the seven approved scenarios with a recognizable problem, outcome, copyable prompt, and guide",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Prompt copy controls work reliably and communicate success or failure",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The page is responsive, accessible, and verified on desktop and mobile",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [],
  "questions": [],
  "recommendations": [],
  "declaredOwnedPaths": [
    "apps/web/src/app/globals.css",
    "apps/web/src/app/use-cases/page.tsx",
    "apps/web/src/features/homepage/__tests__/copy-text.test.ts",
    "apps/web/src/features/homepage/lib/copy-text.ts",
    "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
    "apps/web/src/features/public-pages/public-page-content.ts",
    "apps/web/src/features/use-cases",
    "apps/web/src/lib/copy-text.ts"
  ]
}
```
<!-- skopos:task-state:end -->
