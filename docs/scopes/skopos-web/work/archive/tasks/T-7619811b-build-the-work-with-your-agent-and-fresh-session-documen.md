---
title: "Task: Build the work-with-your-agent and fresh-Session documentation journey"
status: complete
owner: "codex-root"
id: T-7619811b
scope: "skopos-web"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-4bd6d9b9b5c94da4
lastUpdated: 2026-08-12
---

# Task: Build the work-with-your-agent and fresh-Session documentation journey

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Build the work-with-your-agent and fresh-Session documentation journey

## Acceptance

- The work-with-your-agent route organizes common day-to-day workflows in plain language and sends every displayed action to a truthful implemented destination.
- The fresh-Session guide accurately distinguishes native resume, handoff generation, host delivery, manual fallback, acceptance, and current Session context.
- Both routes pair conversational prompts with exact current commands, are responsive and accessible, and pass browser interaction verification.

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

- `apps/web/.gitignore`
- `apps/web/src/app/docs`
- `apps/web/src/app/globals.css`
- `apps/web/src/features/documentation`
- `apps/web/src/lib/site.ts`

## Ownership Expansions

- `2026-08-12T10:02:03.295Z` by `codex-root`: `apps/web/.gitignore` — Keep Next-generated type declarations out of the public web source proof boundary.

## Steps

- [x] **Review the current pattern in Skopos Public Web** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Build the work-with-your-agent and fresh-Session documentation journey" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The work-with-your-agent route organizes common day-to-day workflows in plain language and sends every displayed action to a truthful implemented destination. (closure, agent-observation)
- The fresh-Session guide accurately distinguishes native resume, handoff generation, host delivery, manual fallback, acceptance, and current Session context. (closure, agent-observation)
- Both routes pair conversational prompts with exact current commands, are responsive and accessible, and pass browser interaction verification. (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-7619811b",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T09:08:22.860Z",
  "updatedAt": "2026-08-12T10:03:37.702Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Build the work-with-your-agent and fresh-Session documentation journey",
  "goal": "Build the work-with-your-agent and fresh-Session documentation journey",
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
      "The work-with-your-agent route organizes common day-to-day workflows in plain language and sends every displayed action to a truthful implemented destination.",
      "The fresh-Session guide accurately distinguishes native resume, handoff generation, host delivery, manual fallback, acceptance, and current Session context.",
      "Both routes pair conversational prompts with exact current commands, are responsive and accessible, and pass browser interaction verification."
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
    "baselineId": "baseline-4bd6d9b9b5c94da4"
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
      "detail": "Carry out \"Build the work-with-your-agent and fresh-Session documentation journey\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The work-with-your-agent route organizes common day-to-day workflows in plain language and sends every displayed action to a truthful implemented destination.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The fresh-Session guide accurately distinguishes native resume, handoff generation, host delivery, manual fallback, acceptance, and current Session context.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Both routes pair conversational prompts with exact current commands, are responsive and accessible, and pass browser interaction verification.",
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
        "apps/web/.gitignore"
      ],
      "reason": "Keep Next-generated type declarations out of the public web source proof boundary.",
      "actorId": "codex-root",
      "recordedAt": "2026-08-12T10:02:03.295Z",
      "baselinePaths": [
        {
          "path": "apps/web/.gitignore",
          "digest": "af214b2bbb8a6435658a8f41f21449c1579c455dd575efc8e474af39dd363cf7"
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
    "apps/web/.gitignore",
    "apps/web/src/app/docs",
    "apps/web/src/app/globals.css",
    "apps/web/src/features/documentation",
    "apps/web/src/lib/site.ts"
  ]
}
```
<!-- skopos:task-state:end -->
