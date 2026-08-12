---
title: "Task: Build the outcome-first Customize Skopos documentation journey"
status: complete
owner: "codex-root"
id: T-0aa3c469
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-0b053144bf133adf
lastUpdated: 2026-08-11
---

# Task: Build the outcome-first Customize Skopos documentation journey

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Build the outcome-first Customize Skopos documentation journey

## Acceptance

- The docs explain project tools, project rules, expert guidance, coding-agent connections, and external services in plain language before introducing Actions, Guards, Policies, Skills, adapters, or MCP.
- A concrete feature example connects user intent to Project Memory, Task boundaries, approved tools, required checks, Evidence, and continuation.
- Every Customize route is reachable from the docs landing, responsive, accessible, and contains no dead primary destination.

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
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Build the outcome-first Customize Skopos documentation journey" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The docs explain project tools, project rules, expert guidance, coding-agent connections, and external services in plain language before introducing Actions, Guards, Policies, Skills, adapters, or MCP. (closure, agent-observation)
- A concrete feature example connects user intent to Project Memory, Task boundaries, approved tools, required checks, Evidence, and continuation. (closure, agent-observation)
- Every Customize route is reachable from the docs landing, responsive, accessible, and contains no dead primary destination. (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-0aa3c469",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T23:18:16.760Z",
  "updatedAt": "2026-08-11T23:27:13.331Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Build the outcome-first Customize Skopos documentation journey",
  "goal": "Build the outcome-first Customize Skopos documentation journey",
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
      "The docs explain project tools, project rules, expert guidance, coding-agent connections, and external services in plain language before introducing Actions, Guards, Policies, Skills, adapters, or MCP.",
      "A concrete feature example connects user intent to Project Memory, Task boundaries, approved tools, required checks, Evidence, and continuation.",
      "Every Customize route is reachable from the docs landing, responsive, accessible, and contains no dead primary destination."
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
    "baselineId": "baseline-0b053144bf133adf"
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
      "detail": "Carry out \"Build the outcome-first Customize Skopos documentation journey\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The docs explain project tools, project rules, expert guidance, coding-agent connections, and external services in plain language before introducing Actions, Guards, Policies, Skills, adapters, or MCP.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A concrete feature example connects user intent to Project Memory, Task boundaries, approved tools, required checks, Evidence, and continuation.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Every Customize route is reachable from the docs landing, responsive, accessible, and contains no dead primary destination.",
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
