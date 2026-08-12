---
title: "Task: Build the dedicated How Skopos Works product story"
status: complete
owner: "codex-root"
id: T-8902e8ab
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-d1d99462d6cab4a9
lastUpdated: 2026-08-11
---

# Task: Build the dedicated How Skopos Works product story

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Build the dedicated How Skopos Works product story

## Acceptance

- The /how-it-works route presents one continuous request-to-proof example with paired developer and Skopos responsibilities
- The page clearly explains Discuss, Understand, Bound, Work, Prove, Remember, and Continue in simple English
- The page is responsive, accessible, and verified at desktop and mobile sizes

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
- `apps/web/src/app/how-it-works/page.tsx`
- `apps/web/src/features/product-workflow`
- `apps/web/src/features/public-pages/public-page-content.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Build the dedicated How Skopos Works product story" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The /how-it-works route presents one continuous request-to-proof example with paired developer and Skopos responsibilities (closure, agent-observation)
- The page clearly explains Discuss, Understand, Bound, Work, Prove, Remember, and Continue in simple English (closure, agent-observation)
- The page is responsive, accessible, and verified at desktop and mobile sizes (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-8902e8ab",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T20:55:57.484Z",
  "updatedAt": "2026-08-11T21:05:28.199Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Build the dedicated How Skopos Works product story",
  "goal": "Build the dedicated How Skopos Works product story",
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
      "The /how-it-works route presents one continuous request-to-proof example with paired developer and Skopos responsibilities",
      "The page clearly explains Discuss, Understand, Bound, Work, Prove, Remember, and Continue in simple English",
      "The page is responsive, accessible, and verified at desktop and mobile sizes"
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
    "baselineId": "baseline-d1d99462d6cab4a9"
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
      "detail": "Carry out \"Build the dedicated How Skopos Works product story\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The /how-it-works route presents one continuous request-to-proof example with paired developer and Skopos responsibilities",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The page clearly explains Discuss, Understand, Bound, Work, Prove, Remember, and Continue in simple English",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The page is responsive, accessible, and verified at desktop and mobile sizes",
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
    "apps/web/src/app/how-it-works/page.tsx",
    "apps/web/src/features/product-workflow",
    "apps/web/src/features/public-pages/public-page-content.ts"
  ]
}
```
<!-- skopos:task-state:end -->
