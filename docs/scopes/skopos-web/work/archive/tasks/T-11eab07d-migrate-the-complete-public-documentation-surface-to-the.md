---
title: "Task: Migrate the complete public documentation surface to the shared Tailwind layout system"
status: complete
owner: "codex-root"
id: T-11eab07d
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-62b481b74d6eb5db
lastUpdated: 2026-08-12
---

# Task: Migrate the complete public documentation surface to the shared Tailwind layout system

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Migrate the complete public documentation surface to the shared Tailwind layout system

## Acceptance

- All documentation routes use shared layout primitives and Tailwind utilities instead of route-specific global selectors
- Superseded documentation CSS is removed without visual or interaction regressions
- Documentation routes pass tests, typecheck, production build, and responsive browser verification

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `automatic`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `apps/web/.gitignore`
- `apps/web/src/app/globals.css`
- `apps/web/src/features/documentation`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Migrate the complete public documentation surface to the shared Tailwind layout system" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- All documentation routes use shared layout primitives and Tailwind utilities instead of route-specific global selectors (closure, agent-observation)
- Superseded documentation CSS is removed without visual or interaction regressions (closure, agent-observation)
- Documentation routes pass tests, typecheck, production build, and responsive browser verification (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-11eab07d",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T10:24:14.524Z",
  "updatedAt": "2026-08-12T10:45:48.616Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Migrate the complete public documentation surface to the shared Tailwind layout system",
  "goal": "Migrate the complete public documentation surface to the shared Tailwind layout system",
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
      "All documentation routes use shared layout primitives and Tailwind utilities instead of route-specific global selectors",
      "Superseded documentation CSS is removed without visual or interaction regressions",
      "Documentation routes pass tests, typecheck, production build, and responsive browser verification"
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
    "selectionSource": "automatic",
    "workflow": "tracked",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 3,
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
    "baselineId": "baseline-62b481b74d6eb5db"
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
      "detail": "Carry out \"Migrate the complete public documentation surface to the shared Tailwind layout system\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "All documentation routes use shared layout primitives and Tailwind utilities instead of route-specific global selectors",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Superseded documentation CSS is removed without visual or interaction regressions",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Documentation routes pass tests, typecheck, production build, and responsive browser verification",
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
    "apps/web/.gitignore",
    "apps/web/src/app/globals.css",
    "apps/web/src/features/documentation"
  ]
}
```
<!-- skopos:task-state:end -->
