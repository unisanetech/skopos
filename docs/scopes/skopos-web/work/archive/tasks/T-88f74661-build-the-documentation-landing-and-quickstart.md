---
title: "Task: Build the documentation landing and quickstart"
status: complete
owner: "codex-root"
id: T-88f74661
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-c7e8db7cc30cce51
lastUpdated: 2026-08-11
---

# Task: Build the documentation landing and quickstart

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Build the documentation landing and quickstart

## Acceptance

- The /docs route provides clear start routes, everyday workflows, concept and reference routers, and a dominant quickstart path without dead destinations
- The /docs/quickstart route follows the conversation-first documentation contract and provides accurate existing-project, new-project, review, verification, troubleshooting, and exact-command guidance
- Prompt and command copy controls work accessibly, and both routes are responsive and verified on desktop and mobile

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
- `apps/web/src/features/public-pages/public-page-content.ts`
- `apps/web/src/lib/site.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Build the documentation landing and quickstart" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The /docs route provides clear start routes, everyday workflows, concept and reference routers, and a dominant quickstart path without dead destinations (closure, agent-observation)
- The /docs/quickstart route follows the conversation-first documentation contract and provides accurate existing-project, new-project, review, verification, troubleshooting, and exact-command guidance (closure, agent-observation)
- Prompt and command copy controls work accessibly, and both routes are responsive and verified on desktop and mobile (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-88f74661",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T22:17:05.011Z",
  "updatedAt": "2026-08-11T22:31:45.264Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Build the documentation landing and quickstart",
  "goal": "Build the documentation landing and quickstart",
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
      "The /docs route provides clear start routes, everyday workflows, concept and reference routers, and a dominant quickstart path without dead destinations",
      "The /docs/quickstart route follows the conversation-first documentation contract and provides accurate existing-project, new-project, review, verification, troubleshooting, and exact-command guidance",
      "Prompt and command copy controls work accessibly, and both routes are responsive and verified on desktop and mobile"
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
    "baselineId": "baseline-c7e8db7cc30cce51"
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
      "detail": "Carry out \"Build the documentation landing and quickstart\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The /docs route provides clear start routes, everyday workflows, concept and reference routers, and a dominant quickstart path without dead destinations",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The /docs/quickstart route follows the conversation-first documentation contract and provides accurate existing-project, new-project, review, verification, troubleshooting, and exact-command guidance",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Prompt and command copy controls work accessibly, and both routes are responsive and verified on desktop and mobile",
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
    "apps/web/src/features/public-pages/public-page-content.ts",
    "apps/web/src/lib/site.ts"
  ]
}
```
<!-- skopos:task-state:end -->
