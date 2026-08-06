---
title: "Task: Archive historical Memory records left in active retrieval paths"
status: complete
owner: "codex-repository-memory-archive"
id: T-32812828
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-71960bd79af5b33b
lastUpdated: 2026-08-05
---

# Task: Archive historical Memory records left in active retrieval paths

## Changelog

- `2026-08-05`: Synchronized Task state `complete` from Skopos.

## Goal

Archive historical Memory records left in active retrieval paths

## Acceptance

- The completed continuation Plan is stored under historical work archive and all active links resolve to it
- Five resolved Skopos UI Findings are stored under the UI Scope findings archive and all active links resolve to them
- Strict document metadata and local-link validation passes with historical records excluded from default retrieval

## Non-Goals

- Do not move the continuation Finding while docs/findings/archive is owned by T-db2a2a6c

## Constraints

- Do not rewrite immutable archived Task snapshots or claim historical rationale as current truth

## Owned Paths

- `docs/architecture/agent-native-operating-model.md`
- `docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
- `docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`
- `docs/findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md`
- `docs/guides/developer-workflows.md`
- `docs/scopes/skopos-ui/decisions`
- `docs/scopes/skopos-ui/findings`
- `docs/scopes/skopos-ui/overview.md`
- `docs/scopes/skopos-ui/work/plans/P-20260804-human-first-ui-convergence.md`
- `docs/work/archive/P-20260805-conversation-aware-session-continuation-plan.md`
- `docs/work/plans/P-20260805-conversation-aware-session-continuation-plan.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Archive historical Memory records left in active retrieval paths" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The completed continuation Plan is stored under historical work archive and all active links resolve to it (closure, agent-observation)
- Five resolved Skopos UI Findings are stored under the UI Scope findings archive and all active links resolve to them (closure, agent-observation)
- Strict document metadata and local-link validation passes with historical records excluded from default retrieval (closure, agent-observation)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-32812828",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-05T10:46:16.872Z",
  "updatedAt": "2026-08-05T10:50:32.244Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Archive historical Memory records left in active retrieval paths",
  "goal": "Archive historical Memory records left in active retrieval paths",
  "scope": {
    "query": "workspace",
    "matchedBy": "default-root",
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
      "The completed continuation Plan is stored under historical work archive and all active links resolve to it",
      "Five resolved Skopos UI Findings are stored under the UI Scope findings archive and all active links resolve to them",
      "Strict document metadata and local-link validation passes with historical records excluded from default retrieval"
    ],
    "nonGoals": [
      "Do not move the continuation Finding while docs/findings/archive is owned by T-db2a2a6c"
    ],
    "constraints": [
      "Do not rewrite immutable archived Task snapshots or claim historical rationale as current truth"
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-71960bd79af5b33b"
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
      "detail": "Carry out \"Archive historical Memory records left in active retrieval paths\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The completed continuation Plan is stored under historical work archive and all active links resolve to it",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Five resolved Skopos UI Findings are stored under the UI Scope findings archive and all active links resolve to them",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Strict document metadata and local-link validation passes with historical records excluded from default retrieval",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical relationship to the archived historical owner; product semantics are unchanged.",
      "resolvedAt": "2026-08-05T10:48:13.646Z",
      "resolvedByActorId": "codex-repository-memory-archive"
    },
    {
      "id": "memory-decision-0f99f3e0a4",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical relationship to the archived historical owner; product semantics are unchanged.",
      "resolvedAt": "2026-08-05T10:48:14.212Z",
      "resolvedByActorId": "codex-repository-memory-archive"
    },
    {
      "id": "memory-decision-11a920677b",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical relationship to the archived historical owner; product semantics are unchanged.",
      "resolvedAt": "2026-08-05T10:48:14.778Z",
      "resolvedByActorId": "codex-repository-memory-archive"
    },
    {
      "id": "memory-decision-3ec637c2cc",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical relationship to the archived historical owner; product semantics are unchanged.",
      "resolvedAt": "2026-08-05T10:48:15.330Z",
      "resolvedByActorId": "codex-repository-memory-archive"
    },
    {
      "id": "memory-decision-5f0163a357",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical relationship to the archived historical owner; product semantics are unchanged.",
      "resolvedAt": "2026-08-05T10:48:15.890Z",
      "resolvedByActorId": "codex-repository-memory-archive"
    },
    {
      "id": "memory-decision-7b162a74fe",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical relationship to the archived historical owner; product semantics are unchanged.",
      "resolvedAt": "2026-08-05T10:48:16.456Z",
      "resolvedByActorId": "codex-repository-memory-archive"
    },
    {
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/developer-workflows.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical relationship to the archived historical owner; product semantics are unchanged.",
      "resolvedAt": "2026-08-05T10:48:17.023Z",
      "resolvedByActorId": "codex-repository-memory-archive"
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
      "resolvedAt": "2026-08-05T10:46:23.423Z",
      "resolvedByActorId": "codex-repository-memory-archive"
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
    "docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md",
    "docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
    "docs/findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md",
    "docs/guides/developer-workflows.md",
    "docs/scopes/skopos-ui/decisions",
    "docs/scopes/skopos-ui/findings",
    "docs/scopes/skopos-ui/overview.md",
    "docs/scopes/skopos-ui/work/plans/P-20260804-human-first-ui-convergence.md",
    "docs/work/archive/P-20260805-conversation-aware-session-continuation-plan.md",
    "docs/work/plans/P-20260805-conversation-aware-session-continuation-plan.md"
  ]
}
```
<!-- skopos:task-state:end -->
