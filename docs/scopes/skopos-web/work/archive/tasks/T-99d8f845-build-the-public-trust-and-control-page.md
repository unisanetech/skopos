---
title: "Task: Build the public Trust and Control page"
status: complete
owner: "codex-root"
id: T-99d8f845
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-6bef631b23e5aed2
lastUpdated: 2026-08-11
---

# Task: Build the public Trust and Control page

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Build the public Trust and Control page

## Acceptance

- The /trust route explains repository ownership, write boundaries, approvals, enforcement, Evidence freshness, Readiness, coordination, and capability limits in plain English
- The page distinguishes advisory instructions, deterministic Guards, governed Actions, and cooperative coordination without overstating security or automation
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
- `apps/web/src/app/trust/page.tsx`
- `apps/web/src/features/public-pages/public-page-content.ts`
- `apps/web/src/features/trust-control`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Build the public Trust and Control page" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The /trust route explains repository ownership, write boundaries, approvals, enforcement, Evidence freshness, Readiness, coordination, and capability limits in plain English (closure, agent-observation)
- The page distinguishes advisory instructions, deterministic Guards, governed Actions, and cooperative coordination without overstating security or automation (closure, agent-observation)
- The page is responsive, accessible, and verified on desktop and mobile (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-99d8f845",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T21:56:04.909Z",
  "updatedAt": "2026-08-11T22:04:59.089Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Build the public Trust and Control page",
  "goal": "Build the public Trust and Control page",
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
      "The /trust route explains repository ownership, write boundaries, approvals, enforcement, Evidence freshness, Readiness, coordination, and capability limits in plain English",
      "The page distinguishes advisory instructions, deterministic Guards, governed Actions, and cooperative coordination without overstating security or automation",
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
    "baselineId": "baseline-6bef631b23e5aed2"
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
      "detail": "Carry out \"Build the public Trust and Control page\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The /trust route explains repository ownership, write boundaries, approvals, enforcement, Evidence freshness, Readiness, coordination, and capability limits in plain English",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The page distinguishes advisory instructions, deterministic Guards, governed Actions, and cooperative coordination without overstating security or automation",
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
    "apps/web/src/app/trust/page.tsx",
    "apps/web/src/features/public-pages/public-page-content.ts",
    "apps/web/src/features/trust-control"
  ]
}
```
<!-- skopos:task-state:end -->
