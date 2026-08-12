---
title: "Task: Implement linked parent-child Tasks and host-neutral multi-Session work splitting"
status: complete
owner: "codex"
id: T-15a82539
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-9eafbc845dc64846
lastUpdated: 2026-08-11
---

# Task: Implement linked parent-child Tasks and host-neutral multi-Session work splitting

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Implement linked parent-child Tasks and host-neutral multi-Session work splitting

## Acceptance

- A user or coding agent can propose a bounded split and explicitly create linked child Tasks under one parent
- Parent and child identity, ownership, dependencies, lifecycle, Work Queue, and Readiness remain consistent across reconstruction
- CLI and MCP expose the same split and child-creation authority while the UI remains a truthful read-only projection
- Host-neutral handoff output supports assigning each child to a fresh Session without claiming unsupported automatic host launch
- Focused tests prove independent parallel children, overlap rejection, parent closure blocking, stale recovery compatibility, and portable reconstruction

## Non-Goals

- Preventive coordination across machines without a remote authority

## Constraints

- Do not silently decompose work; require explicit reviewed creation

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 5 non-workspace Scopes.

## Owned Paths

- `docs/architecture/00-architecture.md`
- `docs/architecture/agent-native-operating-model.md`
- `docs/architecture/evidence-and-readiness-model.md`
- `docs/guides/developer-workflows.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__/mcp-server-contract.test.ts`
- `packages/cli/src/__tests__/task-ownership-expansion.test.ts`
- `packages/cli/src/__tests__/task-splitting.test.ts`
- `packages/cli/src/cli/commands/task.ts`
- `packages/cli/src/cli/help.ts`
- `packages/mcp`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/runtime/src/application/start`
- `packages/runtime/src/application/task`
- `packages/runtime/src/application/verification/verification.service.ts`
- `packages/runtime/src/application/work-queue`
- `packages/runtime/src/index.ts`
- `packages/ui`

## Ownership Expansions

- `2026-08-11T03:21:43.588Z` by `codex`: `docs/architecture/evidence-and-readiness-model.md`, `docs/guides/developer-workflows.md` — Document implemented parent-child closure semantics and the reviewed split/Session assignment workflow.
- `2026-08-11T03:21:53.103Z` by `codex`: `packages/cli/src/__tests__/mcp-server-contract.test.ts`, `packages/cli/src/__tests__/task-ownership-expansion.test.ts`, `packages/cli/src/__tests__/task-splitting.test.ts`, `packages/runtime/src/application/verification/verification.service.ts`, `packages/runtime/src/index.ts` — These focused tests, Readiness owner, and runtime export are required by the linked child Task implementation.

## Steps

- [x] **Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?** (decision, complete) — Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Implement linked parent-child Tasks and host-neutral multi-Session work splitting" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- A user or coding agent can propose a bounded split and explicitly create linked child Tasks under one parent (closure, agent-observation)
- Parent and child identity, ownership, dependencies, lifecycle, Work Queue, and Readiness remain consistent across reconstruction (closure, agent-observation)
- CLI and MCP expose the same split and child-creation authority while the UI remains a truthful read-only projection (closure, agent-observation)
- Host-neutral handoff output supports assigning each child to a fresh Session without claiming unsupported automatic host launch (closure, agent-observation)
- Focused tests prove independent parallel children, overlap rejection, parent closure blocking, stale recovery compatibility, and portable reconstruction (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/evidence-and-readiness-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-15a82539",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T02:54:20.328Z",
  "updatedAt": "2026-08-11T03:34:09.118Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Implement linked parent-child Tasks and host-neutral multi-Session work splitting",
  "goal": "Implement linked parent-child Tasks and host-neutral multi-Session work splitting",
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
      "A user or coding agent can propose a bounded split and explicitly create linked child Tasks under one parent",
      "Parent and child identity, ownership, dependencies, lifecycle, Work Queue, and Readiness remain consistent across reconstruction",
      "CLI and MCP expose the same split and child-creation authority while the UI remains a truthful read-only projection",
      "Host-neutral handoff output supports assigning each child to a fresh Session without claiming unsupported automatic host launch",
      "Focused tests prove independent parallel children, overlap rejection, parent closure blocking, stale recovery compatibility, and portable reconstruction"
    ],
    "nonGoals": [
      "Preventive coordination across machines without a remote authority"
    ],
    "constraints": [
      "Do not silently decompose work; require explicit reviewed creation"
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
      "ownedPathCount": 11,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-mcp",
        "skopos-model",
        "skopos-runtime",
        "skopos-ui"
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
    "baselineId": "baseline-9eafbc845dc64846"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.architecture-shift",
      "kind": "decision",
      "title": "Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "detail": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "status": "complete"
    },
    {
      "id": "step-resolve-decisions",
      "kind": "implementation",
      "title": "Resolve plan decisions",
      "detail": "Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.",
      "status": "complete"
    },
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
      "detail": "Carry out \"Implement linked parent-child Tasks and host-neutral multi-Session work splitting\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/mcp-server-contract.test.ts",
        "packages/cli/src/__tests__/task-ownership-expansion.test.ts",
        "packages/cli/src/__tests__/task-splitting.test.ts",
        "packages/cli/src/cli/commands/task.ts",
        "packages/cli/src/cli/help.ts",
        "packages/mcp",
        "packages/model/src/contracts/skopos-task.ts",
        "packages/runtime/src/application/start",
        "packages/runtime/src/application/task",
        "packages/runtime/src/application/verification/verification.service.ts",
        "packages/runtime/src/application/work-queue",
        "packages/runtime/src/index.ts",
        "packages/ui"
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
      "acceptanceCriterion": "A user or coding agent can propose a bounded split and explicitly create linked child Tasks under one parent",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Parent and child identity, ownership, dependencies, lifecycle, Work Queue, and Readiness remain consistent across reconstruction",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "CLI and MCP expose the same split and child-creation authority while the UI remains a truthful read-only projection",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Host-neutral handoff output supports assigning each child to a fresh Session without claiming unsupported automatic host launch",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Focused tests prove independent parallel children, overlap rejection, parent closure blocking, stale recovery compatibility, and portable reconstruction",
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
      "resolutionReason": "Documented parent-child Task authority and host-neutral Session assignment boundaries.",
      "resolvedAt": "2026-08-11T03:31:04.980Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "memory-architecture-579535b5d3",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/evidence-and-readiness-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented compositional child readiness and parent acceptance Evidence semantics.",
      "resolvedAt": "2026-08-11T03:31:06.584Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented reviewed work splitting and multi-Session operating flow.",
      "resolvedAt": "2026-08-11T03:31:08.155Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/developer-workflows.md",
      "resolution": "memory-updated",
      "resolutionReason": "Added concrete split proposal, apply, assignment, and Session-context workflow.",
      "resolvedAt": "2026-08-11T03:31:09.785Z",
      "resolvedByActorId": "codex"
    }
  ],
  "questions": [
    {
      "id": "plan.architecture-shift",
      "category": "architecture",
      "escalation": "must-ask",
      "question": "Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "whyItMatters": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "recommendedOptionId": "preserve-current-boundaries",
      "options": [
        {
          "id": "preserve-current-boundaries",
          "label": "Preserve current boundaries",
          "rationale": "Recommended unless the goal explicitly requires a structural redesign."
        },
        {
          "id": "approve-architecture-change",
          "label": "Approve architecture change",
          "rationale": "Use this when the change should redefine package, scope, or runtime boundaries."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "preserve-current-boundaries",
      "resolvedAt": "2026-08-11T02:54:40.374Z",
      "resolvedByActorId": "codex",
      "disposition": {
        "kind": "answered",
        "reason": "Selected Task question option preserve-current-boundaries.",
        "actorId": "codex",
        "recordedAt": "2026-08-11T02:54:40.374Z",
        "target": {
          "kind": "option",
          "ref": "preserve-current-boundaries"
        }
      }
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.architecture-shift",
      "title": "Resolve: Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "summary": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.architecture-shift",
      "blocking": true,
      "status": "complete"
    },
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
        "docs/architecture/evidence-and-readiness-model.md",
        "docs/guides/developer-workflows.md"
      ],
      "reason": "Document implemented parent-child closure semantics and the reviewed split/Session assignment workflow.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T03:21:43.588Z",
      "baselinePaths": [
        {
          "path": "docs/architecture/evidence-and-readiness-model.md",
          "digest": "c606e4a87ca1236080c7c14713074900aa00eecd3627db4a44007cc32983debc"
        },
        {
          "path": "docs/guides/developer-workflows.md",
          "digest": "a5322e01460faf891df21ce5ffe004c626bcbb5e0defc9c5a5952515f0351de6"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-mcp",
        "skopos-model",
        "skopos-runtime",
        "skopos-ui"
      ]
    },
    {
      "paths": [
        "packages/cli/src/__tests__/mcp-server-contract.test.ts",
        "packages/cli/src/__tests__/task-ownership-expansion.test.ts",
        "packages/cli/src/__tests__/task-splitting.test.ts",
        "packages/runtime/src/application/verification/verification.service.ts",
        "packages/runtime/src/index.ts"
      ],
      "reason": "These focused tests, Readiness owner, and runtime export are required by the linked child Task implementation.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T03:21:53.103Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/__tests__/mcp-server-contract.test.ts",
          "digest": "72b315c25d480d356e5a7cb2e6c758f5eddb4d95d5ba7e449aaaebdcbcbcb39a"
        },
        {
          "path": "packages/cli/src/__tests__/task-ownership-expansion.test.ts",
          "digest": "bb8bf56dbcf4650ce0ebb161339cd2be688e2edda1a81cc9db12b620334e67f7"
        },
        {
          "path": "packages/cli/src/__tests__/task-splitting.test.ts",
          "digest": "63790ddd220c06254dcd6011974e125f7198d4fede037aaee63b4d87a6ed60a3"
        },
        {
          "path": "packages/runtime/src/application/verification/verification.service.ts",
          "digest": "75b4cb46dfd9a97fb0ceab095aace34dc3efc7a4a1ad2a336a9f6fb8e9af259d"
        },
        {
          "path": "packages/runtime/src/index.ts",
          "digest": "967abd99bd302134191bde33acc86b4c064de2c7376ef8f74906bf798055ce51"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-mcp",
        "skopos-model",
        "skopos-runtime",
        "skopos-ui"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/00-architecture.md",
    "docs/architecture/agent-native-operating-model.md",
    "docs/architecture/evidence-and-readiness-model.md",
    "docs/guides/developer-workflows.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/cli/src/__tests__/mcp-server-contract.test.ts",
    "packages/cli/src/__tests__/task-ownership-expansion.test.ts",
    "packages/cli/src/__tests__/task-splitting.test.ts",
    "packages/cli/src/cli/commands/task.ts",
    "packages/cli/src/cli/help.ts",
    "packages/mcp",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/runtime/src/application/start",
    "packages/runtime/src/application/task",
    "packages/runtime/src/application/verification/verification.service.ts",
    "packages/runtime/src/application/work-queue",
    "packages/runtime/src/index.ts",
    "packages/ui"
  ]
}
```
<!-- skopos:task-state:end -->
