---
title: "Task: Implement safe originating-Session transitions between writer and reviewer modes"
status: complete
owner: "codex-reviewer-lifecycle"
id: T-e42d4ebb
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-106abde5676da389
lastUpdated: 2026-08-11
parentTaskId: T-9da72d55
---

# Task: Implement safe originating-Session transitions between writer and reviewer modes

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Implement safe originating-Session transitions between writer and reviewer modes

## Acceptance

- A live Session can explicitly transition writer to reviewer only after releasing writing authority.
- A reviewer Session can return to writer only through an audited safe transition.
- Session context preserves and explains reviewer mode without silently reopening it as a writer.

## Non-Goals

- Create or call host-specific chat APIs.

## Constraints

- Fail closed when reservations, claims, mutations, actor identity, or Session state make a transition unsafe.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 3 non-workspace Scopes.

## Owned Paths

- `packages/cli/src/__tests__/coordination-broker.test.ts`
- `packages/cli/src/__tests__/coordination-lifecycle.test.ts`
- `packages/cli/src/cli/commands/coordination.ts`
- `packages/model/src/contracts/skopos-coordination.ts`
- `packages/runtime/src/application/coordination/coordination.service.ts`
- `packages/runtime/src/application/session/session-context.service.ts`
- `packages/runtime/src/application/start/start.service.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Implement safe originating-Session transitions between writer and reviewer modes" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- A live Session can explicitly transition writer to reviewer only after releasing writing authority. (closure, agent-observation)
- A reviewer Session can return to writer only through an audited safe transition. (closure, agent-observation)
- Session context preserves and explains reviewer mode without silently reopening it as a writer. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-e42d4ebb",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T06:36:54.366Z",
  "updatedAt": "2026-08-11T06:52:04.393Z",
  "planIds": [],
  "parentTaskId": "T-9da72d55",
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Implement safe originating-Session transitions between writer and reviewer modes",
  "goal": "Implement safe originating-Session transitions between writer and reviewer modes",
  "scope": {
    "query": "skopos",
    "matchedBy": "id",
    "scope": {
      "id": "skopos",
      "kind": "workspace",
      "title": "Skopos Workspace",
      "path": ".",
      "aliases": [
        "@skopos/workspace"
      ],
      "summary": "Skopos Workspace (core.workspace).",
      "confidence": "high",
      "ancestorIds": [],
      "profile": "core.workspace",
      "memoryRoot": "docs",
      "codeRoots": [
        "."
      ],
      "dependsOn": [],
      "owners": [
        "skopos-core"
      ]
    }
  },
  "contract": {
    "acceptanceCriteria": [
      "A live Session can explicitly transition writer to reviewer only after releasing writing authority.",
      "A reviewer Session can return to writer only through an audited safe transition.",
      "Session context preserves and explains reviewer mode without silently reopening it as a writer."
    ],
    "nonGoals": [
      "Create or call host-specific chat APIs."
    ],
    "constraints": [
      "Fail closed when reservations, claims, mutations, actor identity, or Session state make a transition unsafe."
    ]
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "Declared ownership affects 3 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 7,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
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
    "baselineId": "baseline-106abde5676da389"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "step-record-task-risk",
      "kind": "implementation",
      "title": "Record Task risk and detail before editing",
      "detail": "Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.",
      "status": "complete"
    },
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in Skopos Workspace",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "complete"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Implement safe originating-Session transitions between writer and reviewer modes\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/model/src/contracts/skopos-coordination.ts",
        "packages/runtime/src/application/coordination/coordination.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts",
        "packages/runtime/src/application/start/start.service.ts",
        "packages/cli/src/cli/commands/coordination.ts",
        "packages/cli/src/__tests__/coordination-broker.test.ts",
        "packages/cli/src/__tests__/coordination-lifecycle.test.ts"
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
      "acceptanceCriterion": "A live Session can explicitly transition writer to reviewer only after releasing writing authority.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A reviewer Session can return to writer only through an audited safe transition.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Session context preserves and explains reviewer mode without silently reopening it as a writer.",
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
  "memoryObligations": [
    {
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope skopos.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed docs/architecture/00-architecture.md and the linked agent-native operating model. They already define the durable Session/Task coordination invariants: the broker serializes Session lifecycle, only writer Sessions hold writing authority, transitions are audited, and cooperative enforcement fails closed. This Task implements that existing architecture without changing its durable boundary, so no unowned architecture edit is required.",
      "resolvedAt": "2026-08-11T06:50:39.117Z",
      "resolvedByActorId": "codex-reviewer-lifecycle"
    }
  ],
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
    "packages/cli/src/__tests__/coordination-broker.test.ts",
    "packages/cli/src/__tests__/coordination-lifecycle.test.ts",
    "packages/cli/src/cli/commands/coordination.ts",
    "packages/model/src/contracts/skopos-coordination.ts",
    "packages/runtime/src/application/coordination/coordination.service.ts",
    "packages/runtime/src/application/session/session-context.service.ts",
    "packages/runtime/src/application/start/start.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
