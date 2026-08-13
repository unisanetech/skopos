---
title: "Task: Make unified setup detect configured existing-project truth honestly"
status: complete
owner: "child-t-f8f2ff9a"
id: T-f8f2ff9a
scope: "skopos-indexer"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-6ecb300227d87ef5
lastUpdated: 2026-08-13
parentTaskId: T-84af6598
---

# Task: Make unified setup detect configured existing-project truth honestly

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Make unified setup detect configured existing-project truth honestly

## Acceptance

- Configured docs roots that exist are detected during fresh setup preview
- Already configured project archetype does not produce a redundant setup question
- Unconfigured projects retain material docs and archetype questions

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 2 non-workspace Scopes.
- Reason: The caller explicitly selected standard; Skopos recommended high-impact and kept both values visible.

## Owned Paths

- `packages/indexer/src/__tests__`
- `packages/indexer/src/application/build-bootstrap-questions`
- `packages/indexer/src/application/scan-repo`
- `packages/runtime/src/application/understanding`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Review the current pattern in Skopos Indexer** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make unified setup detect configured existing-project truth honestly" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Configured docs roots that exist are detected during fresh setup preview (closure, agent-observation)
- Already configured project archetype does not produce a redundant setup question (closure, agent-observation)
- Unconfigured projects retain material docs and archetype questions (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-f8f2ff9a",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T12:18:29.869Z",
  "updatedAt": "2026-08-13T12:42:20.949Z",
  "planIds": [],
  "parentTaskId": "T-84af6598",
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Make unified setup detect configured existing-project truth honestly",
  "goal": "Make unified setup detect configured existing-project truth honestly",
  "scope": {
    "query": "skopos-indexer",
    "matchedBy": "id",
    "scope": {
      "id": "skopos-indexer",
      "kind": "package",
      "title": "Skopos Indexer",
      "path": "packages/indexer",
      "aliases": [
        "@skopos/indexer"
      ],
      "summary": "Skopos Indexer (core.public-library).",
      "confidence": "high",
      "parent": "skopos",
      "ancestorIds": [
        "skopos"
      ],
      "profile": "core.public-library",
      "memoryRoot": "docs/scopes/skopos-indexer",
      "codeRoots": [
        "packages/indexer"
      ],
      "dependsOn": [
        "skopos-config",
        "skopos-model"
      ],
      "owners": [
        "skopos-core"
      ]
    }
  },
  "contract": {
    "acceptanceCriteria": [
      "Configured docs roots that exist are detected during fresh setup preview",
      "Already configured project archetype does not produce a redundant setup question",
      "Unconfigured projects retain material docs and archetype questions"
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "standard",
    "selectedDetail": "standard",
    "selectionSource": "explicit-override",
    "workflow": "tracked",
    "reasons": [
      "Declared ownership affects 2 non-workspace Scopes.",
      "The caller explicitly selected standard; Skopos recommended high-impact and kept both values visible."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 4,
      "affectedScopeIds": [
        "skopos",
        "skopos-indexer",
        "skopos-runtime"
      ],
      "impactCategories": [
        "scope-source"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-6ecb300227d87ef5"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in Skopos Indexer",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "complete"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Make unified setup detect configured existing-project truth honestly\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "complete"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "complete"
    },
    {
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck the Skopos workspace",
      "detail": "Required by Guard quality.typecheck.",
      "status": "complete"
    }
  ],
  "selectedActions": [
    {
      "id": "quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "packages/indexer/src/__tests__",
        "packages/indexer/src/application/build-bootstrap-questions",
        "packages/indexer/src/application/scan-repo",
        "packages/runtime/src/application/understanding"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Configured docs roots that exist are detected during fresh setup preview",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Already configured project archetype does not produce a redundant setup question",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Unconfigured projects retain material docs and archetype questions",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-quality.focused-behavior-proof",
      "acceptanceCriterion": "Guard quality.focused-behavior-proof: Behavior changes require focused proof",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [
        "quality.focused-behavior-proof"
      ],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-quality.typecheck",
      "acceptanceCriterion": "Guard quality.typecheck: TypeScript changes require typecheck Evidence",
      "phase": "closure",
      "actionIds": [
        "quality.typecheck"
      ],
      "guardIds": [
        "quality.typecheck"
      ],
      "evidence": "source-bound-action"
    }
  ],
  "memoryObligations": [],
  "questions": [],
  "recommendations": [
    {
      "id": "run-quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "summary": "Required by Guard quality.typecheck.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.typecheck",
      "blocking": false,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    "packages/indexer/src/__tests__",
    "packages/indexer/src/application/build-bootstrap-questions",
    "packages/indexer/src/application/scan-repo",
    "packages/runtime/src/application/understanding"
  ]
}
```
<!-- skopos:task-state:end -->
