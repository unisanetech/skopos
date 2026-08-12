---
title: "Task: Migrate the remaining public website to shared Tailwind layout primitives"
status: complete
owner: "codex-root"
id: T-5fa3de34
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-ddad81cb00f79053
lastUpdated: 2026-08-12
---

# Task: Migrate the remaining public website to shared Tailwind layout primitives

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Migrate the remaining public website to shared Tailwind layout primitives

## Acceptance

- Shared shell and all non-documentation public routes use Tailwind utilities and reusable page primitives for layout and responsive behavior
- Superseded route and shell selectors are removed while intentional complex homepage visual primitives remain isolated and documented
- The complete public site passes tests, typecheck, production build, responsive browser checks, and interaction checks

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
- `apps/web/src/components`
- `apps/web/src/features`
- `apps/web/src/patterns`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Migrate the remaining public website to shared Tailwind layout primitives" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Shared shell and all non-documentation public routes use Tailwind utilities and reusable page primitives for layout and responsive behavior (closure, agent-observation)
- Superseded route and shell selectors are removed while intentional complex homepage visual primitives remain isolated and documented (closure, agent-observation)
- The complete public site passes tests, typecheck, production build, responsive browser checks, and interaction checks (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-5fa3de34",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T12:07:48.875Z",
  "updatedAt": "2026-08-12T13:07:36.314Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Migrate the remaining public website to shared Tailwind layout primitives",
  "goal": "Migrate the remaining public website to shared Tailwind layout primitives",
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
      "Shared shell and all non-documentation public routes use Tailwind utilities and reusable page primitives for layout and responsive behavior",
      "Superseded route and shell selectors are removed while intentional complex homepage visual primitives remain isolated and documented",
      "The complete public site passes tests, typecheck, production build, responsive browser checks, and interaction checks"
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
      "ownedPathCount": 5,
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
    "baselineId": "baseline-ddad81cb00f79053"
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
      "detail": "Carry out \"Migrate the remaining public website to shared Tailwind layout primitives\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Shared shell and all non-documentation public routes use Tailwind utilities and reusable page primitives for layout and responsive behavior",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Superseded route and shell selectors are removed while intentional complex homepage visual primitives remain isolated and documented",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The complete public site passes tests, typecheck, production build, responsive browser checks, and interaction checks",
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
    "apps/web/src/components",
    "apps/web/src/features",
    "apps/web/src/patterns"
  ]
}
```
<!-- skopos:task-state:end -->
