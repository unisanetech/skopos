---
title: "Task: Deliver the dedicated Project Memory product page for the public website"
status: complete
owner: "codex-root"
id: T-7de15ab8
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-5a1215e4e23caae1
lastUpdated: 2026-08-11
---

# Task: Deliver the dedicated Project Memory product page for the public website

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Deliver the dedicated Project Memory product page for the public website

## Acceptance

- The page clearly differentiates Skopos from chat history, instructions files, private agent memory, and ordinary documentation
- The page explains repository ownership, relevant-context retrieval, explicit Memory review outcomes, and safe existing-project adoption without overstating automation
- The page uses a dedicated responsive composition that preserves the public site's typography, rails, borders, and black-and-white visual language
- Navigation, metadata, accessibility semantics, tests, typecheck, production build, and desktop/mobile browser checks pass

## Non-Goals

- Implement the How Skopos Works page or full documentation system

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
- `apps/web/src/app/project-memory/page.tsx`
- `apps/web/src/features/project-memory`
- `apps/web/src/features/public-pages/public-page-content.ts`

## Ownership Expansions

- `2026-08-11T20:45:57.901Z` by `codex-root`: `apps/web/src/features/public-pages/public-page-content.ts` — Remove the superseded generic Project Memory copy now that the route has a dedicated feature-owned content source

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Deliver the dedicated Project Memory product page for the public website" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The page clearly differentiates Skopos from chat history, instructions files, private agent memory, and ordinary documentation (closure, agent-observation)
- The page explains repository ownership, relevant-context retrieval, explicit Memory review outcomes, and safe existing-project adoption without overstating automation (closure, agent-observation)
- The page uses a dedicated responsive composition that preserves the public site's typography, rails, borders, and black-and-white visual language (closure, agent-observation)
- Navigation, metadata, accessibility semantics, tests, typecheck, production build, and desktop/mobile browser checks pass (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-7de15ab8",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T20:34:27.532Z",
  "updatedAt": "2026-08-11T20:49:19.507Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Deliver the dedicated Project Memory product page for the public website",
  "goal": "Deliver the dedicated Project Memory product page for the public website",
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
      "The page clearly differentiates Skopos from chat history, instructions files, private agent memory, and ordinary documentation",
      "The page explains repository ownership, relevant-context retrieval, explicit Memory review outcomes, and safe existing-project adoption without overstating automation",
      "The page uses a dedicated responsive composition that preserves the public site's typography, rails, borders, and black-and-white visual language",
      "Navigation, metadata, accessibility semantics, tests, typecheck, production build, and desktop/mobile browser checks pass"
    ],
    "nonGoals": [
      "Implement the How Skopos Works page or full documentation system"
    ],
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
    "baselineId": "baseline-5a1215e4e23caae1"
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
      "detail": "Carry out \"Deliver the dedicated Project Memory product page for the public website\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The page clearly differentiates Skopos from chat history, instructions files, private agent memory, and ordinary documentation",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The page explains repository ownership, relevant-context retrieval, explicit Memory review outcomes, and safe existing-project adoption without overstating automation",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The page uses a dedicated responsive composition that preserves the public site's typography, rails, borders, and black-and-white visual language",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Navigation, metadata, accessibility semantics, tests, typecheck, production build, and desktop/mobile browser checks pass",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [],
  "questions": [],
  "recommendations": [],
  "ownershipExpansions": [
    {
      "paths": [
        "apps/web/src/features/public-pages/public-page-content.ts"
      ],
      "reason": "Remove the superseded generic Project Memory copy now that the route has a dedicated feature-owned content source",
      "actorId": "codex-root",
      "recordedAt": "2026-08-11T20:45:57.901Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/public-pages/public-page-content.ts",
          "digest": "59d3acb63dcaabb814b8d1dc1c73ef5fc67472a65482780aef33e0cbcd4b4803"
        }
      ],
      "classification": "within-scope",
      "priorScopeId": "skopos-web",
      "nextScopeId": "skopos-web",
      "affectedScopeIds": [
        "skopos-web"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "apps/web/src/app/globals.css",
    "apps/web/src/app/project-memory/page.tsx",
    "apps/web/src/features/project-memory",
    "apps/web/src/features/public-pages/public-page-content.ts"
  ]
}
```
<!-- skopos:task-state:end -->
