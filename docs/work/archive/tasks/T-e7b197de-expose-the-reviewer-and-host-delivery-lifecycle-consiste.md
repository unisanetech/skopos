---
title: "Task: Expose the reviewer and host-delivery lifecycle consistently through MCP and canonical architecture"
status: complete
owner: "codex-host-integration"
id: T-e7b197de
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-cb484faaddb13146
lastUpdated: 2026-08-11
parentTaskId: T-9da72d55
---

# Task: Expose the reviewer and host-delivery lifecycle consistently through MCP and canonical architecture

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Expose the reviewer and host-delivery lifecycle consistently through MCP and canonical architecture

## Acceptance

- MCP exposes the same safe reviewer transition authority as the CLI/runtime.
- Canonical architecture states that approved Codex splits open real tasks through the host adapter while the origin remains reviewer.
- Documentation distinguishes generated launch instructions, real host delivery, and manual fallbacks.

## Non-Goals

- Claim equivalent automatic launch support for hosts that do not expose task creation.

## Constraints

- Depend on the reviewer lifecycle and launch contract before documenting completion.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: architecture.

## Owned Paths

- `docs/architecture/00-architecture.md`
- `docs/architecture/agent-native-operating-model.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/mcp/src/index.ts`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?** (decision, complete) — Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Expose the reviewer and host-delivery lifecycle consistently through MCP and canonical architecture" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- MCP exposes the same safe reviewer transition authority as the CLI/runtime. (closure, agent-observation)
- Canonical architecture states that approved Codex splits open real tasks through the host adapter while the origin remains reviewer. (closure, agent-observation)
- Documentation distinguishes generated launch instructions, real host delivery, and manual fallbacks. (closure, agent-observation)
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
  "id": "T-e7b197de",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T06:36:54.365Z",
  "updatedAt": "2026-08-11T07:01:38.743Z",
  "planIds": [],
  "parentTaskId": "T-9da72d55",
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Expose the reviewer and host-delivery lifecycle consistently through MCP and canonical architecture",
  "goal": "Expose the reviewer and host-delivery lifecycle consistently through MCP and canonical architecture",
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
      "MCP exposes the same safe reviewer transition authority as the CLI/runtime.",
      "Canonical architecture states that approved Codex splits open real tasks through the host adapter while the origin remains reviewer.",
      "Documentation distinguishes generated launch instructions, real host delivery, and manual fallbacks."
    ],
    "nonGoals": [
      "Claim equivalent automatic launch support for hosts that do not expose task creation."
    ],
    "constraints": [
      "Depend on the reviewer lifecycle and launch contract before documenting completion."
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
      "The goal contains high-impact signal: architecture."
    ],
    "signals": {
      "goalSignals": [
        "architecture"
      ],
      "ownedPathCount": 4,
      "affectedScopeIds": [
        "skopos",
        "skopos-mcp"
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
    "baselineId": "baseline-cb484faaddb13146"
  },
  "priority": 0,
  "dependencyTaskIds": [
    "T-e42d4ebb",
    "T-f4160cb9"
  ],
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
      "detail": "Carry out \"Expose the reviewer and host-delivery lifecycle consistently through MCP and canonical architecture\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/mcp/src/index.ts"
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
      "acceptanceCriterion": "MCP exposes the same safe reviewer transition authority as the CLI/runtime.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Canonical architecture states that approved Codex splits open real tasks through the host adapter while the origin remains reviewer.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Documentation distinguishes generated launch instructions, real host delivery, and manual fallbacks.",
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
      "resolutionReason": "Updated canonical architecture with the implemented Codex host-delivery boundary, originating reviewer lifecycle, shared CLI/MCP transition authority, and truthful generated/delivered/manual fallback states.",
      "resolvedAt": "2026-08-11T07:00:10.258Z",
      "resolvedByActorId": "codex-host-integration"
    },
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical agent-native operating model with explicit reviewer-mode preservation, real Codex task delivery through the host adapter, returned-thread Session binding, waiting/review flow, and fail-closed writer restoration.",
      "resolvedAt": "2026-08-11T07:00:12.076Z",
      "resolvedByActorId": "codex-host-integration"
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
      "resolvedAt": "2026-08-11T06:54:00.252Z",
      "resolvedByActorId": "codex-host-integration",
      "disposition": {
        "kind": "answered",
        "reason": "Selected Task question option preserve-current-boundaries.",
        "actorId": "codex-host-integration",
        "recordedAt": "2026-08-11T06:54:00.252Z",
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
  "declaredOwnedPaths": [
    "docs/architecture/00-architecture.md",
    "docs/architecture/agent-native-operating-model.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/mcp/src/index.ts"
  ]
}
```
<!-- skopos:task-state:end -->
