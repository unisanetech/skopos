---
title: "Task: Create the approved Skopos brand asset suite and apply the new vector mark"
status: complete
owner: "codex-skopos-brand"
id: T-3dc9dc48
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-552ae2fca9b47d5f
lastUpdated: 2026-08-11
---

# Task: Create the approved Skopos brand asset suite and apply the new vector mark

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Create the approved Skopos brand asset suite and apply the new vector mark

## Acceptance

- The selected opposing-arrow loop is recreated as clean reusable SVG geometry in the website brand component and application icon
- One canonical brand source generates the standard logo, favicon, Apple touch, and PWA asset suite
- Focused brand tests, web typecheck, web build, and rendered header verification pass

## Non-Goals

- Redesign the wordmark, homepage layout, or broader visual system

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `apps/web/config/ui/brand.ts`
- `apps/web/public/brand`
- `apps/web/src/app/favicon.ico`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/icon.svg`
- `apps/web/src/features/brand`

## Ownership Expansions

- `2026-08-11T18:04:29.973Z` by `codex-skopos-brand`: `apps/web/src/app/globals.css` — Increase the live wordmark slot so the approved tall brand silhouette remains legible at header size.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Create the approved Skopos brand asset suite and apply the new vector mark" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The selected opposing-arrow loop is recreated as clean reusable SVG geometry in the website brand component and application icon (closure, agent-observation)
- One canonical brand source generates the standard logo, favicon, Apple touch, and PWA asset suite (closure, agent-observation)
- Focused brand tests, web typecheck, web build, and rendered header verification pass (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-3dc9dc48",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T17:58:37.039Z",
  "updatedAt": "2026-08-11T18:09:58.449Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Create the approved Skopos brand asset suite and apply the new vector mark",
  "goal": "Create the approved Skopos brand asset suite and apply the new vector mark",
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
      "The selected opposing-arrow loop is recreated as clean reusable SVG geometry in the website brand component and application icon",
      "One canonical brand source generates the standard logo, favicon, Apple touch, and PWA asset suite",
      "Focused brand tests, web typecheck, web build, and rendered header verification pass"
    ],
    "nonGoals": [
      "Redesign the wordmark, homepage layout, or broader visual system"
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
    "baselineId": "baseline-552ae2fca9b47d5f"
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
      "detail": "Carry out \"Create the approved Skopos brand asset suite and apply the new vector mark\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The selected opposing-arrow loop is recreated as clean reusable SVG geometry in the website brand component and application icon",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "One canonical brand source generates the standard logo, favicon, Apple touch, and PWA asset suite",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Focused brand tests, web typecheck, web build, and rendered header verification pass",
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
        "apps/web/src/app/globals.css"
      ],
      "reason": "Increase the live wordmark slot so the approved tall brand silhouette remains legible at header size.",
      "actorId": "codex-skopos-brand",
      "recordedAt": "2026-08-11T18:04:29.973Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/app/globals.css",
          "digest": "bcc40d018eadb190849b3a1e26670c94591d896f1be9bc081bf67767362ef1a8"
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
    "apps/web/config/ui/brand.ts",
    "apps/web/public/brand",
    "apps/web/src/app/favicon.ico",
    "apps/web/src/app/globals.css",
    "apps/web/src/app/icon.svg",
    "apps/web/src/features/brand"
  ]
}
```
<!-- skopos:task-state:end -->
