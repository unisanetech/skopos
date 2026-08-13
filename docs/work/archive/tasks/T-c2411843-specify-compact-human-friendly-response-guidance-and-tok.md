---
title: "Task: Specify compact human-friendly response guidance and token-economy implementation"
status: complete
owner: "codex-response-guidance-docs"
id: T-c2411843
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-7f4eb2cb133abe83
lastUpdated: 2026-08-12
---

# Task: Specify compact human-friendly response guidance and token-economy implementation

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Specify compact human-friendly response guidance and token-economy implementation

## Acceptance

- Canonical docs define one selectively injected response contract with explicit token targets
- Docs separate the working response contract from planned completion-mode, onboarding, and evaluation improvements
- The implementation plan records current adapter/test inconsistencies and a clean pre-release replacement sequence
- Runtime response quality avoids a second per-response model call or unnecessary prompt repetition

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.
- Reason: The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible.

## Owned Paths

- `docs/architecture/agent-native-operating-model.md`
- `docs/architecture/intelligent-project-onboarding.md`
- `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
- `docs/decisions/D-20260812-intelligent-project-onboarding-contract.md`
- `docs/domains/product/implementation-map.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Specify compact human-friendly response guidance and token-economy implementation" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Canonical docs define one selectively injected response contract with explicit token targets (closure, agent-observation)
- Docs separate the working response contract from planned completion-mode, onboarding, and evaluation improvements (closure, agent-observation)
- The implementation plan records current adapter/test inconsistencies and a clean pre-release replacement sequence (closure, agent-observation)
- Runtime response quality avoids a second per-response model call or unnecessary prompt repetition (closure, agent-observation)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes. (target: `docs/architecture/intelligent-project-onboarding.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes. (target: `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260812-intelligent-project-onboarding-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260812-intelligent-project-onboarding-contract.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-c2411843",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T18:41:33.441Z",
  "updatedAt": "2026-08-12T18:46:42.257Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Specify compact human-friendly response guidance and token-economy implementation",
  "goal": "Specify compact human-friendly response guidance and token-economy implementation",
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
      "Canonical docs define one selectively injected response contract with explicit token targets",
      "Docs separate the working response contract from planned completion-mode, onboarding, and evaluation improvements",
      "The implementation plan records current adapter/test inconsistencies and a clean pre-release replacement sequence",
      "Runtime response quality avoids a second per-response model call or unnecessary prompt repetition"
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "standard",
    "recommendedDetail": "standard",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.",
      "The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 6,
      "affectedScopeIds": [
        "skopos"
      ],
      "impactCategories": [
        "docs"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-7f4eb2cb133abe83"
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
      "detail": "Carry out \"Specify compact human-friendly response guidance and token-economy implementation\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Canonical docs define one selectively injected response contract with explicit token targets",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Docs separate the working response contract from planned completion-mode, onboarding, and evaluation improvements",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The implementation plan records current adapter/test inconsistencies and a clean pre-release replacement sequence",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Runtime response quality avoids a second per-response model call or unnecessary prompt repetition",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-663c7727b6",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/intelligent-project-onboarding.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented selective onboarding conversation transport, staged context reuse, and offline response-quality evaluation.",
      "resolvedAt": "2026-08-12T18:46:02.389Z",
      "resolvedByActorId": "codex-response-guidance-docs"
    },
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented the canonical response layers, mode shapes, terminology translation, token targets, and evaluation boundary.",
      "resolvedAt": "2026-08-12T18:46:03.875Z",
      "resolvedByActorId": "codex-response-guidance-docs"
    },
    {
      "id": "memory-decision-7f31a96932",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
      "resolution": "memory-updated",
      "resolutionReason": "Extended the accepted token-control decision with response guidance budgets and selective host delivery.",
      "resolvedAt": "2026-08-12T18:46:05.325Z",
      "resolvedByActorId": "codex-response-guidance-docs"
    },
    {
      "id": "memory-decision-c310d960b6",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260812-intelligent-project-onboarding-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260812-intelligent-project-onboarding-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Bound intelligent onboarding communication to stage-specific retrieval without a per-response model judge.",
      "resolvedAt": "2026-08-12T18:46:06.779Z",
      "resolvedByActorId": "codex-response-guidance-docs"
    }
  ],
  "questions": [],
  "recommendations": [],
  "declaredOwnedPaths": [
    "docs/architecture/agent-native-operating-model.md",
    "docs/architecture/intelligent-project-onboarding.md",
    "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
    "docs/decisions/D-20260812-intelligent-project-onboarding-contract.md",
    "docs/domains/product/implementation-map.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md"
  ]
}
```
<!-- skopos:task-state:end -->
