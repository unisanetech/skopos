---
title: "Task: Deliver real Codex child-task dispatch with the originating Session as reviewer"
status: complete
owner: "codex"
id: T-9da72d55
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-152e73885bfcbc4d
lastUpdated: 2026-08-11
---

# Task: Deliver real Codex child-task dispatch with the originating Session as reviewer

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Deliver real Codex child-task dispatch with the originating Session as reviewer

## Acceptance

- An approved split produces exact Codex child-task launch instructions whose prompts bind each host task to one Skopos child Task and Session.
- The originating Session can safely transition from writer to reviewer while children execute and back to writer only for parent review and closure.
- Real child host task identities and delivery outcomes are recorded truthfully without making host APIs part of Skopos core.
- Automated and self-hosted proof demonstrates separate Codex tasks executing bounded children while the originating task reviews their combined result.

## Non-Goals

- Expose or invent a public OpenAI Codex Desktop API from Skopos core.

## Constraints

- Require explicit user approval before host task creation.
- Keep non-Codex hosts on truthful capability-based fallback paths.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 5 non-workspace Scopes.

## Owned Paths

- `docs/architecture/00-architecture.md`
- `docs/architecture/agent-native-operating-model.md`
- `docs/work/archive/tasks/T-e42d4ebb-implement-safe-originating-session-transitions-between-w.md`
- `docs/work/archive/tasks/T-e7b197de-expose-the-reviewer-and-host-delivery-lifecycle-consiste.md`
- `docs/work/archive/tasks/T-f4160cb9-generate-exact-truthful-codex-child-task-launch-and-pare.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `docs/work/tasks/snapshots/T-e42d4ebb-S-6841dbb9f7e6.json`
- `docs/work/tasks/snapshots/T-e7b197de-S-0b8666cac089.json`
- `docs/work/tasks/snapshots/T-f4160cb9-S-b082829a5599.json`
- `packages/cli/src/__tests__/coordination-broker.test.ts`
- `packages/cli/src/__tests__/coordination-lifecycle.test.ts`
- `packages/cli/src/__tests__/task-splitting.test.ts`
- `packages/cli/src/cli/commands/coordination.ts`
- `packages/cli/src/cli/commands/task.ts`
- `packages/instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.ts`
- `packages/mcp/src/index.ts`
- `packages/model/src/contracts/skopos-coordination.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/runtime/src/application/coordination/coordination.service.ts`
- `packages/runtime/src/application/session/session-context.service.ts`
- `packages/runtime/src/application/start/start.service.ts`
- `packages/runtime/src/application/task/task-split.service.ts`

## Ownership Expansions

- `2026-08-11T06:35:58.888Z` by `codex`: `packages/model/src/contracts/skopos-coordination.ts` — Reviewer mode transitions require a typed coordination result alongside the existing reviewer mode authority.
- `2026-08-11T07:06:21.739Z` by `codex`: `docs/work/archive/tasks/T-e42d4ebb-implement-safe-originating-session-transitions-between-w.md`, `docs/work/archive/tasks/T-e7b197de-expose-the-reviewer-and-host-delivery-lifecycle-consiste.md`, `docs/work/archive/tasks/T-f4160cb9-generate-exact-truthful-codex-child-task-launch-and-pare.md`, `docs/work/tasks/snapshots/T-e42d4ebb-S-6841dbb9f7e6.json`, `docs/work/tasks/snapshots/T-e7b197de-S-0b8666cac089.json`, `docs/work/tasks/snapshots/T-f4160cb9-S-b082829a5599.json` — Adopt the completed linked-child archives and immutable snapshots reviewed by the parent as integration evidence.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Deliver real Codex child-task dispatch with the originating Session as reviewer" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- An approved split produces exact Codex child-task launch instructions whose prompts bind each host task to one Skopos child Task and Session. (closure, agent-observation)
- The originating Session can safely transition from writer to reviewer while children execute and back to writer only for parent review and closure. (closure, agent-observation)
- Real child host task identities and delivery outcomes are recorded truthfully without making host APIs part of Skopos core. (closure, agent-observation)
- Automated and self-hosted proof demonstrates separate Codex tasks executing bounded children while the originating task reviews their combined result. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-9da72d55",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T06:35:16.346Z",
  "updatedAt": "2026-08-11T07:07:54.233Z",
  "planIds": [],
  "childTasks": [
    {
      "taskId": "T-e42d4ebb",
      "title": "Implement safe originating-Session transitions between writer and reviewer modes",
      "goal": "Implement safe originating-Session transitions between writer and reviewer modes",
      "scopeId": "skopos",
      "state": "complete",
      "createdAt": "2026-08-11T06:36:54.366Z",
      "createdByActorId": "codex",
      "ownedPaths": [
        "packages/cli/src/__tests__/coordination-broker.test.ts",
        "packages/cli/src/__tests__/coordination-lifecycle.test.ts",
        "packages/cli/src/cli/commands/coordination.ts",
        "packages/model/src/contracts/skopos-coordination.ts",
        "packages/runtime/src/application/coordination/coordination.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts",
        "packages/runtime/src/application/start/start.service.ts"
      ],
      "dependencyTaskIds": [],
      "parentAcceptanceRequirementIds": [
        "acceptance-2"
      ],
      "claimedByActorId": "codex-reviewer-lifecycle"
    },
    {
      "taskId": "T-f4160cb9",
      "title": "Generate exact truthful Codex child-task launch and parent-review instructions from an approved split",
      "goal": "Generate exact truthful Codex child-task launch and parent-review instructions from an approved split",
      "scopeId": "skopos",
      "state": "complete",
      "createdAt": "2026-08-11T06:36:54.366Z",
      "createdByActorId": "codex",
      "ownedPaths": [
        "packages/cli/src/__tests__/task-splitting.test.ts",
        "packages/cli/src/cli/commands/task.ts",
        "packages/instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.ts",
        "packages/model/src/contracts/skopos-task.ts",
        "packages/runtime/src/application/task/task-split.service.ts"
      ],
      "dependencyTaskIds": [],
      "parentAcceptanceRequirementIds": [
        "acceptance-1"
      ],
      "claimedByActorId": "codex-launch-contract"
    },
    {
      "taskId": "T-e7b197de",
      "title": "Expose the reviewer and host-delivery lifecycle consistently through MCP and canonical architecture",
      "goal": "Expose the reviewer and host-delivery lifecycle consistently through MCP and canonical architecture",
      "scopeId": "skopos",
      "state": "complete",
      "createdAt": "2026-08-11T06:36:54.365Z",
      "createdByActorId": "codex",
      "ownedPaths": [
        "docs/architecture/00-architecture.md",
        "docs/architecture/agent-native-operating-model.md",
        "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
        "packages/mcp/src/index.ts"
      ],
      "dependencyTaskIds": [
        "T-e42d4ebb",
        "T-f4160cb9"
      ],
      "parentAcceptanceRequirementIds": [
        "acceptance-3"
      ],
      "claimedByActorId": "codex-host-integration"
    }
  ],
  "state": "complete",
  "detail": "detailed",
  "title": "Deliver real Codex child-task dispatch with the originating Session as reviewer",
  "goal": "Deliver real Codex child-task dispatch with the originating Session as reviewer",
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
      "An approved split produces exact Codex child-task launch instructions whose prompts bind each host task to one Skopos child Task and Session.",
      "The originating Session can safely transition from writer to reviewer while children execute and back to writer only for parent review and closure.",
      "Real child host task identities and delivery outcomes are recorded truthfully without making host APIs part of Skopos core.",
      "Automated and self-hosted proof demonstrates separate Codex tasks executing bounded children while the originating task reviews their combined result."
    ],
    "nonGoals": [
      "Expose or invent a public OpenAI Codex Desktop API from Skopos core."
    ],
    "constraints": [
      "Require explicit user approval before host task creation.",
      "Keep non-Codex hosts on truthful capability-based fallback paths."
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
      "Declared ownership affects 5 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 15,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-instructions",
        "skopos-mcp",
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
    "baselineId": "baseline-152e73885bfcbc4d"
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
      "detail": "Carry out \"Deliver real Codex child-task dispatch with the originating Session as reviewer\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/coordination-broker.test.ts",
        "packages/cli/src/__tests__/coordination-lifecycle.test.ts",
        "packages/cli/src/__tests__/task-splitting.test.ts",
        "packages/cli/src/cli/commands/coordination.ts",
        "packages/cli/src/cli/commands/task.ts",
        "packages/instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.ts",
        "packages/mcp/src/index.ts",
        "packages/model/src/contracts/skopos-coordination.ts",
        "packages/model/src/contracts/skopos-task.ts",
        "packages/runtime/src/application/coordination/coordination.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts",
        "packages/runtime/src/application/start/start.service.ts",
        "packages/runtime/src/application/task/task-split.service.ts"
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
      "acceptanceCriterion": "An approved split produces exact Codex child-task launch instructions whose prompts bind each host task to one Skopos child Task and Session.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The originating Session can safely transition from writer to reviewer while children execute and back to writer only for parent review and closure.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Real child host task identities and delivery outcomes are recorded truthfully without making host APIs part of Skopos core.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Automated and self-hosted proof demonstrates separate Codex tasks executing bounded children while the originating task reviews their combined result.",
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
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical architecture now records host-neutral split activation, real Codex adapter delivery, returned-thread Session binding, and originating reviewer authority.",
      "resolvedAt": "2026-08-11T07:06:04.264Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "The agent-native operating model now records writer-to-reviewer transitions, child host delivery, waiting, review, and truthful fallback semantics.",
      "resolvedAt": "2026-08-11T07:06:05.960Z",
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
        "packages/model/src/contracts/skopos-coordination.ts"
      ],
      "reason": "Reviewer mode transitions require a typed coordination result alongside the existing reviewer mode authority.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T06:35:58.888Z",
      "baselinePaths": [
        {
          "path": "packages/model/src/contracts/skopos-coordination.ts",
          "digest": "c86446c86ef0769074a30fbc7645eda8a3d8a26eb8635a6f9f9a6fcc7589f7e9"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-instructions",
        "skopos-mcp",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        "docs/work/archive/tasks/T-e42d4ebb-implement-safe-originating-session-transitions-between-w.md",
        "docs/work/archive/tasks/T-e7b197de-expose-the-reviewer-and-host-delivery-lifecycle-consiste.md",
        "docs/work/archive/tasks/T-f4160cb9-generate-exact-truthful-codex-child-task-launch-and-pare.md",
        "docs/work/tasks/snapshots/T-e42d4ebb-S-6841dbb9f7e6.json",
        "docs/work/tasks/snapshots/T-e7b197de-S-0b8666cac089.json",
        "docs/work/tasks/snapshots/T-f4160cb9-S-b082829a5599.json"
      ],
      "reason": "Adopt the completed linked-child archives and immutable snapshots reviewed by the parent as integration evidence.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T07:06:21.739Z",
      "baselinePaths": [
        {
          "path": "docs/work/archive/tasks/T-e42d4ebb-implement-safe-originating-session-transitions-between-w.md",
          "digest": "fd6b7ed4b4d4dad3d2e82e7650d0af09da7e8d763dfad1454b8ca6c36c45d68a"
        },
        {
          "path": "docs/work/archive/tasks/T-e7b197de-expose-the-reviewer-and-host-delivery-lifecycle-consiste.md",
          "digest": "718993244a7f1dee44417fab126d8d60dfe07efe9cac57bf7ac3ab297295980d"
        },
        {
          "path": "docs/work/archive/tasks/T-f4160cb9-generate-exact-truthful-codex-child-task-launch-and-pare.md",
          "digest": "2550695490690254387b51921a94c3b6e33e5f308c7d6e4565214028893b51a2"
        },
        {
          "path": "docs/work/tasks/snapshots/T-e42d4ebb-S-6841dbb9f7e6.json",
          "digest": "89772389a125f1760ef3c25d0dd3bbcea5ff73fe5e5417825866cc804a9e02a9"
        },
        {
          "path": "docs/work/tasks/snapshots/T-e7b197de-S-0b8666cac089.json",
          "digest": "ad1ca98059f08733c68682aab61b73b973259f5bd4a779b9cb944f9a8c843d4d"
        },
        {
          "path": "docs/work/tasks/snapshots/T-f4160cb9-S-b082829a5599.json",
          "digest": "f224f5d0e6e73d3e846102190b36ba69a41a35ce7df9717510aef56632f26476"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-instructions",
        "skopos-mcp",
        "skopos-model",
        "skopos-runtime"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/00-architecture.md",
    "docs/architecture/agent-native-operating-model.md",
    "docs/work/archive/tasks/T-e42d4ebb-implement-safe-originating-session-transitions-between-w.md",
    "docs/work/archive/tasks/T-e7b197de-expose-the-reviewer-and-host-delivery-lifecycle-consiste.md",
    "docs/work/archive/tasks/T-f4160cb9-generate-exact-truthful-codex-child-task-launch-and-pare.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "docs/work/tasks/snapshots/T-e42d4ebb-S-6841dbb9f7e6.json",
    "docs/work/tasks/snapshots/T-e7b197de-S-0b8666cac089.json",
    "docs/work/tasks/snapshots/T-f4160cb9-S-b082829a5599.json",
    "packages/cli/src/__tests__/coordination-broker.test.ts",
    "packages/cli/src/__tests__/coordination-lifecycle.test.ts",
    "packages/cli/src/__tests__/task-splitting.test.ts",
    "packages/cli/src/cli/commands/coordination.ts",
    "packages/cli/src/cli/commands/task.ts",
    "packages/instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.ts",
    "packages/mcp/src/index.ts",
    "packages/model/src/contracts/skopos-coordination.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/runtime/src/application/coordination/coordination.service.ts",
    "packages/runtime/src/application/session/session-context.service.ts",
    "packages/runtime/src/application/start/start.service.ts",
    "packages/runtime/src/application/task/task-split.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
