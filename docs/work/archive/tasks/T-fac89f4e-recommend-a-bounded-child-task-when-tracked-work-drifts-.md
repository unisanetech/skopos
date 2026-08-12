---
title: "Task: Recommend a bounded child Task when tracked work drifts semantically"
status: complete
owner: "codex"
id: T-fac89f4e
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-d6765dee8c2babcd
lastUpdated: 2026-08-11
---

# Task: Recommend a bounded child Task when tracked work drifts semantically

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Recommend a bounded child Task when tracked work drifts semantically

## Acceptance

- Repeated or semantically divergent ownership expansion creates one auditable, non-blocking child-Task recommendation.
- The recommendation carries an exact project-generic start command scoped to the divergent paths.
- Coherent within-Scope expansion does not create a false-positive split recommendation.
- Later coherent expansions update or preserve recommendation state deterministically without duplication.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 3 non-workspace Scopes.

## Owned Paths

- `docs/architecture/00-architecture.md`
- `docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md`
- `docs/findings/F-20260811-topology-aware-task-scope-resolution-gap.md`
- `packages/cli/src/__tests__/task-ownership-expansion.test.ts`
- `packages/cli/src/cli/commands/task.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/runtime/src/application/task/task.service.ts`

## Ownership Expansions

- `2026-08-11T02:22:29.763Z` by `codex`: `packages/cli/src/cli/commands/task.ts` — Supported CLI and host projections must expose the actionable split recommendation, not only its count.
- `2026-08-11T02:23:02.576Z` by `codex`: `docs/architecture/00-architecture.md` — The accepted semantic-drift behavior changes durable Task operating truth and must update canonical architecture Memory.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Recommend a bounded child Task when tracked work drifts semantically" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Repeated or semantically divergent ownership expansion creates one auditable, non-blocking child-Task recommendation. (closure, agent-observation)
- The recommendation carries an exact project-generic start command scoped to the divergent paths. (closure, agent-observation)
- Coherent within-Scope expansion does not create a false-positive split recommendation. (closure, agent-observation)
- Later coherent expansions update or preserve recommendation state deterministically without duplication. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-fac89f4e",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T02:20:15.226Z",
  "updatedAt": "2026-08-11T02:26:28.723Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Recommend a bounded child Task when tracked work drifts semantically",
  "goal": "Recommend a bounded child Task when tracked work drifts semantically",
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
      "Repeated or semantically divergent ownership expansion creates one auditable, non-blocking child-Task recommendation.",
      "The recommendation carries an exact project-generic start command scoped to the divergent paths.",
      "Coherent within-Scope expansion does not create a false-positive split recommendation.",
      "Later coherent expansions update or preserve recommendation state deterministically without duplication."
    ],
    "nonGoals": [],
    "constraints": []
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
      "ownedPathCount": 5,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime"
      ],
      "impactCategories": [
        "docs",
        "scope-source"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-d6765dee8c2babcd"
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
      "detail": "Carry out \"Recommend a bounded child Task when tracked work drifts semantically\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/task-ownership-expansion.test.ts",
        "packages/cli/src/cli/commands/task.ts",
        "packages/model/src/contracts/skopos-task.ts",
        "packages/runtime/src/application/task/task.service.ts"
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
      "acceptanceCriterion": "Repeated or semantically divergent ownership expansion creates one auditable, non-blocking child-Task recommendation.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The recommendation carries an exact project-generic start command scoped to the divergent paths.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Coherent within-Scope expansion does not create a false-positive split recommendation.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Later coherent expansions update or preserve recommendation state deterministically without duplication.",
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
      "resolution": "memory-updated",
      "resolutionReason": "Canonical architecture now records topology-aware ownership and the auditable bounded-child recommendation contract.",
      "resolvedAt": "2026-08-11T02:24:49.161Z",
      "resolvedByActorId": "codex"
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
  "ownershipExpansions": [
    {
      "paths": [
        "packages/cli/src/cli/commands/task.ts"
      ],
      "reason": "Supported CLI and host projections must expose the actionable split recommendation, not only its count.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T02:22:29.763Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/cli/commands/task.ts",
          "digest": "7ee920524d397cbb4557cb2af2a3615481639dcd11cc801ad22bcc588c4d92bc"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        "docs/architecture/00-architecture.md"
      ],
      "reason": "The accepted semantic-drift behavior changes durable Task operating truth and must update canonical architecture Memory.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T02:23:02.576Z",
      "baselinePaths": [
        {
          "path": "docs/architecture/00-architecture.md",
          "digest": "069cb133cdab00231d81ed62323acf3b529febe9b45508545295b8c998a2cee5"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/00-architecture.md",
    "docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md",
    "docs/findings/F-20260811-topology-aware-task-scope-resolution-gap.md",
    "packages/cli/src/__tests__/task-ownership-expansion.test.ts",
    "packages/cli/src/cli/commands/task.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/runtime/src/application/task/task.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
