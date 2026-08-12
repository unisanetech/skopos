---
title: "Task: Build the Phase 1 public web foundation with real routes, route-aware navigation, shared page shells, and production metadata"
status: complete
owner: "codex-root"
id: T-05afc623
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-6fa8ca4ba149500e
lastUpdated: 2026-08-11
---

# Task: Build the Phase 1 public web foundation with real routes, route-aware navigation, shared page shells, and production metadata

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Build the Phase 1 public web foundation with real routes, route-aware navigation, shared page shells, and production metadata

## Acceptance

- All eight approved public routes resolve with useful truthful content and no empty placeholders
- Desktop and mobile navigation use real routes, expose active state, and retain keyboard access
- Canonical metadata, robots, and sitemap derive from one configurable site URL
- The existing homepage visual composition and interactive install controls remain intact
- Focused web typecheck, tests, build, and browser interaction checks pass

## Non-Goals

- Complete the final deep copy and bespoke visual design for every product page

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `light` / `light`
- Selection source: `explicit-override`
- Reason: The work is narrow, local, and has no durable-governance or cross-Scope signal.
- Reason: The caller explicitly selected high-impact; Skopos recommended light and kept both values visible.

## Owned Paths

- `apps/web/src`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Build the Phase 1 public web foundation with real routes, route-aware navigation, shared page shells, and production metadata" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- All eight approved public routes resolve with useful truthful content and no empty placeholders (closure, agent-observation)
- Desktop and mobile navigation use real routes, expose active state, and retain keyboard access (closure, agent-observation)
- Canonical metadata, robots, and sitemap derive from one configurable site URL (closure, agent-observation)
- The existing homepage visual composition and interactive install controls remain intact (closure, agent-observation)
- Focused web typecheck, tests, build, and browser interaction checks pass (closure, agent-observation)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize durable Memory for Scope skopos-web.; resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-05afc623",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T20:13:16.531Z",
  "updatedAt": "2026-08-11T20:32:43.708Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Build the Phase 1 public web foundation with real routes, route-aware navigation, shared page shells, and production metadata",
  "goal": "Build the Phase 1 public web foundation with real routes, route-aware navigation, shared page shells, and production metadata",
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
      "All eight approved public routes resolve with useful truthful content and no empty placeholders",
      "Desktop and mobile navigation use real routes, expose active state, and retain keyboard access",
      "Canonical metadata, robots, and sitemap derive from one configurable site URL",
      "The existing homepage visual composition and interactive install controls remain intact",
      "Focused web typecheck, tests, build, and browser interaction checks pass"
    ],
    "nonGoals": [
      "Complete the final deep copy and bespoke visual design for every product page"
    ],
    "constraints": []
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "light",
    "recommendedDetail": "light",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "The work is narrow, local, and has no durable-governance or cross-Scope signal.",
      "The caller explicitly selected high-impact; Skopos recommended light and kept both values visible."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 1,
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
    "baselineId": "baseline-6fa8ca4ba149500e"
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
      "detail": "Carry out \"Build the Phase 1 public web foundation with real routes, route-aware navigation, shared page shells, and production metadata\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "All eight approved public routes resolve with useful truthful content and no empty placeholders",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Desktop and mobile navigation use real routes, expose active state, and retain keyboard access",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Canonical metadata, robots, and sitemap derive from one configurable site URL",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The existing homepage visual composition and interactive install controls remain intact",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Focused web typecheck, tests, build, and browser interaction checks pass",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-14bd2de85e",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize durable Memory for Scope skopos-web.",
      "status": "complete",
      "resolution": "reviewed-no-change",
      "resolutionReason": "The accepted public-web information-architecture Plan already owns the route map, navigation hierarchy, metadata phase, and staged content boundary implemented by this Task; no new architecture decision or durable rule was introduced.",
      "resolvedAt": "2026-08-11T20:28:15.042Z",
      "resolvedByActorId": "codex-root"
    }
  ],
  "questions": [],
  "recommendations": [],
  "declaredOwnedPaths": [
    "apps/web/src"
  ]
}
```
<!-- skopos:task-state:end -->
