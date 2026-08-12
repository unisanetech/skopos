---
title: "Task: Create and apply the new Skopos brand mark from the selected reference"
status: complete
owner: "codex-brand-mark"
id: T-5a98e099
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-32acaa4fccadb634
lastUpdated: 2026-08-11
---

# Task: Create and apply the new Skopos brand mark from the selected reference

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Create and apply the new Skopos brand mark from the selected reference

## Acceptance

- A clean vector brand mark captures the selected opposing-stroke S concept at favicon and header sizes
- The mark uses the site's signal blue and near-black palette and remains legible without blur or raster scaling
- Focused web tests, typecheck, and build pass

## Non-Goals

- Redesign the wordmark, footer, homepage layout, or broader brand system

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `apps/web/next-env.d.ts`
- `apps/web/package.json`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/icon.svg`
- `apps/web/src/features/brand`
- `apps/web/src/patterns/site/site-header.tsx`

## Ownership Expansions

- `2026-08-11T15:11:05.491Z` by `codex-brand-mark`: `apps/web/package.json` — Include the new brand feature test in the public web package's focused feature test command.
- `2026-08-11T15:18:55.704Z` by `codex-brand-mark`: `apps/web/next-env.d.ts` — Adopt the Next.js generated route type shim refreshed by the required web verification.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Create and apply the new Skopos brand mark from the selected reference" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- A clean vector brand mark captures the selected opposing-stroke S concept at favicon and header sizes (closure, agent-observation)
- The mark uses the site's signal blue and near-black palette and remains legible without blur or raster scaling (closure, agent-observation)
- Focused web tests, typecheck, and build pass (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-5a98e099",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T15:10:04.627Z",
  "updatedAt": "2026-08-11T15:19:24.431Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Create and apply the new Skopos brand mark from the selected reference",
  "goal": "Create and apply the new Skopos brand mark from the selected reference",
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
      "A clean vector brand mark captures the selected opposing-stroke S concept at favicon and header sizes",
      "The mark uses the site's signal blue and near-black palette and remains legible without blur or raster scaling",
      "Focused web tests, typecheck, and build pass"
    ],
    "nonGoals": [
      "Redesign the wordmark, footer, homepage layout, or broader brand system"
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
    "baselineId": "baseline-32acaa4fccadb634"
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
      "detail": "Carry out \"Create and apply the new Skopos brand mark from the selected reference\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "A clean vector brand mark captures the selected opposing-stroke S concept at favicon and header sizes",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The mark uses the site's signal blue and near-black palette and remains legible without blur or raster scaling",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Focused web tests, typecheck, and build pass",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because new impact categories appeared (package-manifest). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos start 'Continue Create and apply the new Skopos brand mark from the selected reference as bounded follow-up work' . --scope 'skopos-web' --own 'apps/web/next-env.d.ts' --own 'apps/web/package.json' --actor 'codex-brand-mark'",
      "ownedPaths": [
        "apps/web/next-env.d.ts",
        "apps/web/package.json"
      ],
      "scopeId": "skopos-web",
      "reason": "The Task may be drifting from its admitted subject because new impact categories appeared (package-manifest).",
      "blocking": false,
      "status": "open"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "apps/web/package.json"
      ],
      "reason": "Include the new brand feature test in the public web package's focused feature test command.",
      "actorId": "codex-brand-mark",
      "recordedAt": "2026-08-11T15:11:05.491Z",
      "baselinePaths": [
        {
          "path": "apps/web/package.json",
          "digest": "db8db6e5fe8451803ab563a0e73a3fc9c5cb8a4af9525afba3c3128d3a9585dc"
        }
      ],
      "classification": "within-scope",
      "priorScopeId": "skopos-web",
      "nextScopeId": "skopos-web",
      "affectedScopeIds": [
        "skopos-web"
      ]
    },
    {
      "paths": [
        "apps/web/next-env.d.ts"
      ],
      "reason": "Adopt the Next.js generated route type shim refreshed by the required web verification.",
      "actorId": "codex-brand-mark",
      "recordedAt": "2026-08-11T15:18:55.704Z",
      "baselinePaths": [
        {
          "path": "apps/web/next-env.d.ts",
          "digest": "b5876e075e749d492d94278d69b0da02e185fca479466578bfc2cdec8df522ae"
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
    "apps/web/next-env.d.ts",
    "apps/web/package.json",
    "apps/web/src/app/globals.css",
    "apps/web/src/app/icon.svg",
    "apps/web/src/features/brand",
    "apps/web/src/patterns/site/site-header.tsx"
  ]
}
```
<!-- skopos:task-state:end -->
