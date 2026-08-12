---
title: "Task: Build the plan-and-finish-one-feature documentation guide"
status: complete
owner: "codex-root"
id: T-b793f5b6
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-b7e73988a16a4776
lastUpdated: 2026-08-12
---

# Task: Build the plan-and-finish-one-feature documentation guide

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Build the plan-and-finish-one-feature documentation guide

## Acceptance

- The guide follows one checkout-recovery request through discussion, relevant Memory, bounded Task, implementation, project checks, Evidence, Readiness, Memory review, and fresh-Session continuation.
- Every stage pairs human-friendly agent prompting with accurate current Skopos commands and an explicit review responsibility.
- The guide is linked from the docs journey, responsive, accessible, interactive, and verified at desktop and mobile widths.

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

- `apps/web/src/app/docs`
- `apps/web/src/app/globals.css`
- `apps/web/src/features/documentation`
- `apps/web/src/lib/site.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Build the plan-and-finish-one-feature documentation guide" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The guide follows one checkout-recovery request through discussion, relevant Memory, bounded Task, implementation, project checks, Evidence, Readiness, Memory review, and fresh-Session continuation. (closure, agent-observation)
- Every stage pairs human-friendly agent prompting with accurate current Skopos commands and an explicit review responsibility. (closure, agent-observation)
- The guide is linked from the docs journey, responsive, accessible, interactive, and verified at desktop and mobile widths. (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-b793f5b6",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T08:16:06.905Z",
  "updatedAt": "2026-08-12T08:27:47.208Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Build the plan-and-finish-one-feature documentation guide",
  "goal": "Build the plan-and-finish-one-feature documentation guide",
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
      "The guide follows one checkout-recovery request through discussion, relevant Memory, bounded Task, implementation, project checks, Evidence, Readiness, Memory review, and fresh-Session continuation.",
      "Every stage pairs human-friendly agent prompting with accurate current Skopos commands and an explicit review responsibility.",
      "The guide is linked from the docs journey, responsive, accessible, interactive, and verified at desktop and mobile widths."
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
      "ownedPathCount": 4,
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
    "baselineId": "baseline-b7e73988a16a4776"
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
      "detail": "Carry out \"Build the plan-and-finish-one-feature documentation guide\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The guide follows one checkout-recovery request through discussion, relevant Memory, bounded Task, implementation, project checks, Evidence, Readiness, Memory review, and fresh-Session continuation.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Every stage pairs human-friendly agent prompting with accurate current Skopos commands and an explicit review responsibility.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The guide is linked from the docs journey, responsive, accessible, interactive, and verified at desktop and mobile widths.",
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
    "apps/web/src/app/docs",
    "apps/web/src/app/globals.css",
    "apps/web/src/features/documentation",
    "apps/web/src/lib/site.ts"
  ]
}
```
<!-- skopos:task-state:end -->
