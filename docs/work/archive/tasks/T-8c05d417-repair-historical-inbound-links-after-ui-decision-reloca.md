---
title: "Task: Repair historical inbound links after UI Decision relocation"
status: complete
owner: "codex-ui-historical-link-repair"
id: T-8c05d417
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-adf017d7010695cc
lastUpdated: 2026-08-05
---

# Task: Repair historical inbound links after UI Decision relocation

## Changelog

- `2026-08-05`: Synchronized Task state `complete` from Skopos.

## Goal

Repair historical inbound links after UI Decision relocation

## Acceptance

- Historical Plans, Findings, and Decisions that link to relocated UI Decisions resolve to their canonical current or archived paths.
- Immutable Task snapshots remain unchanged.
- Strict documentation catalog remains free of metadata and link issues.

## Non-Goals

- Do not rewrite historical conclusions or edit immutable Task closure snapshots.

## Constraints

- None declared.

## Owned Paths

- `docs/decisions/archive/025-system-ui-discussion-context-and-sidebar-information-architecture.md`
- `docs/findings/archive/F-20260411-ui-dev-watcher-generated-churn.md`
- `docs/scopes/skopos-ui/findings/archive/F-20260804-human-supervision-projection-drift.md`
- `docs/work/archive/P-11229565-system-ui.md`
- `docs/work/archive/P1-W3-discussion-context-and-sidebar-ia.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Repair historical inbound links after UI Decision relocation" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Historical Plans, Findings, and Decisions that link to relocated UI Decisions resolve to their canonical current or archived paths. (closure, agent-observation)
- Immutable Task snapshots remain unchanged. (closure, agent-observation)
- Strict documentation catalog remains free of metadata and link issues. (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-8c05d417",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-05T11:01:01.200Z",
  "updatedAt": "2026-08-05T11:02:18.414Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Repair historical inbound links after UI Decision relocation",
  "goal": "Repair historical inbound links after UI Decision relocation",
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
      "Historical Plans, Findings, and Decisions that link to relocated UI Decisions resolve to their canonical current or archived paths.",
      "Immutable Task snapshots remain unchanged.",
      "Strict documentation catalog remains free of metadata and link issues."
    ],
    "nonGoals": [
      "Do not rewrite historical conclusions or edit immutable Task closure snapshots."
    ],
    "constraints": []
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-adf017d7010695cc"
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
      "detail": "Carry out \"Repair historical inbound links after UI Decision relocation\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Historical Plans, Findings, and Decisions that link to relocated UI Decisions resolve to their canonical current or archived paths.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Immutable Task snapshots remain unchanged.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Strict documentation catalog remains free of metadata and link issues.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [],
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
      "resolvedAt": "2026-08-05T11:01:09.588Z",
      "resolvedByActorId": "codex-ui-historical-link-repair"
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
    "docs/decisions/archive/025-system-ui-discussion-context-and-sidebar-information-architecture.md",
    "docs/findings/archive/F-20260411-ui-dev-watcher-generated-churn.md",
    "docs/scopes/skopos-ui/findings/archive/F-20260804-human-supervision-projection-drift.md",
    "docs/work/archive/P-11229565-system-ui.md",
    "docs/work/archive/P1-W3-discussion-context-and-sidebar-ia.md"
  ]
}
```
<!-- skopos:task-state:end -->
