---
title: "Task: Define the conversation-aware fresh-session continuation convergence plan"
status: complete
owner: "codex-continuation-plan"
id: T-b2f0f2b9
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-4c968f0bb4dfbae3
lastUpdated: 2026-08-04
---

# Task: Define the conversation-aware fresh-session continuation convergence plan

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Define the conversation-aware fresh-session continuation convergence plan

## Acceptance

- Existing Task-scoped handoff authority is extended rather than duplicated
- The plan preserves objective, user intent, accumulated constraints, rejected approaches, verified progress, current position, and next action within a bounded reviewable handoff
- Freshness, Session ownership transfer, host capability truthfulness, security, token economy, manual fallback, and proof requirements are explicit
- Decisions 021 and 026 plus owning architecture and developer guidance are synchronized

## Non-Goals

- Implement continuation runtime, CLI, MCP, UI, or host adapters in this Task

## Constraints

- Keep schemaVersion 1 and apply the pre-release clean-refactor policy
- Preserve Task, Session, Evidence, Readiness, and host-adapter authority boundaries

## Owned Paths

- `docs/architecture/agent-native-operating-model.md`
- `docs/architecture/artifact-model.md`
- `docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
- `docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`
- `docs/findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md`
- `docs/guides/developer-workflows.md`
- `docs/work/plans/P-20260805-conversation-aware-session-continuation-plan.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Define the conversation-aware fresh-session continuation convergence plan" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Existing Task-scoped handoff authority is extended rather than duplicated (closure, agent-observation)
- The plan preserves objective, user intent, accumulated constraints, rejected approaches, verified progress, current position, and next action within a bounded reviewable handoff (closure, agent-observation)
- Freshness, Session ownership transfer, host capability truthfulness, security, token economy, manual fallback, and proof requirements are explicit (closure, agent-observation)
- Decisions 021 and 026 plus owning architecture and developer guidance are synchronized (closure, agent-observation)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/artifact-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/artifact-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-b2f0f2b9",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T22:48:42.315Z",
  "updatedAt": "2026-08-04T23:06:01.413Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Define the conversation-aware fresh-session continuation convergence plan",
  "goal": "Define the conversation-aware fresh-session continuation convergence plan",
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
      "Existing Task-scoped handoff authority is extended rather than duplicated",
      "The plan preserves objective, user intent, accumulated constraints, rejected approaches, verified progress, current position, and next action within a bounded reviewable handoff",
      "Freshness, Session ownership transfer, host capability truthfulness, security, token economy, manual fallback, and proof requirements are explicit",
      "Decisions 021 and 026 plus owning architecture and developer guidance are synchronized"
    ],
    "nonGoals": [
      "Implement continuation runtime, CLI, MCP, UI, or host adapters in this Task"
    ],
    "constraints": [
      "Keep schemaVersion 1 and apply the pre-release clean-refactor policy",
      "Preserve Task, Session, Evidence, Readiness, and host-adapter authority boundaries"
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-4c968f0bb4dfbae3"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.scope-confirmation",
      "kind": "decision",
      "title": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "detail": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
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
      "detail": "Carry out \"Define the conversation-aware fresh-session continuation convergence plan\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Existing Task-scoped handoff authority is extended rather than duplicated",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The plan preserves objective, user intent, accumulated constraints, rejected approaches, verified progress, current position, and next action within a bounded reviewable handoff",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Freshness, Session ownership transfer, host capability truthfulness, security, token economy, manual fallback, and proof requirements are explicit",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Decisions 021 and 026 plus owning architecture and developer guidance are synchronized",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-1e8076edb8",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/artifact-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/artifact-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated artifact ownership for the enriched generated Task handoff and preserved tracked Task reconstruction authority.",
      "resolvedAt": "2026-08-04T23:02:17.588Z",
      "resolvedByActorId": "codex-continuation-plan"
    },
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical Session lifecycle with conversation-aware fresh continuation and truthful host capability boundaries.",
      "resolvedAt": "2026-08-04T23:02:23.095Z",
      "resolvedByActorId": "codex-continuation-plan"
    },
    {
      "id": "memory-decision-11a920677b",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the accepted host adapter lifecycle for fresh Session creation, delivery, fallback, and origin messaging.",
      "resolvedAt": "2026-08-04T23:02:26.739Z",
      "resolvedByActorId": "codex-continuation-plan"
    },
    {
      "id": "memory-decision-3ec637c2cc",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the accepted Task handoff contract with bounded agent-authored conversation context, provenance, freshness, and privacy rules.",
      "resolvedAt": "2026-08-04T23:02:30.587Z",
      "resolvedByActorId": "codex-continuation-plan"
    },
    {
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/developer-workflows.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented the target fresh-session workflow and the existing manual fallback while implementation remains pending.",
      "resolvedAt": "2026-08-04T23:02:35.265Z",
      "resolvedByActorId": "codex-continuation-plan"
    }
  ],
  "questions": [
    {
      "id": "plan.scope-confirmation",
      "category": "scope",
      "escalation": "recommend-and-ask",
      "question": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "whyItMatters": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "recommendedOptionId": "narrow-scope-first",
      "options": [
        {
          "id": "narrow-scope-first",
          "label": "Narrow scope first",
          "rationale": "Recommended because one declared Scope keeps context, checks, and docs impact easier to control."
        },
        {
          "id": "keep-workspace-scope",
          "label": "Keep workspace scope",
          "rationale": "Useful when the change truly spans multiple Scopes and you intend to coordinate a cross-Scope rollout."
        }
      ],
      "blocking": false,
      "status": "resolved",
      "resolvedOptionId": "keep-workspace-scope",
      "resolvedAt": "2026-08-04T22:52:47.564Z",
      "resolvedByActorId": "codex-continuation-plan"
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.scope-confirmation",
      "title": "Resolve: Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "summary": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "priority": "medium",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.scope-confirmation",
      "blocking": false,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/agent-native-operating-model.md",
    "docs/architecture/artifact-model.md",
    "docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md",
    "docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
    "docs/findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md",
    "docs/guides/developer-workflows.md",
    "docs/work/plans/P-20260805-conversation-aware-session-continuation-plan.md"
  ]
}
```
<!-- skopos:task-state:end -->
