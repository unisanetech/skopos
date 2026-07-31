---
title: "Task: Make Skopos closure atomic, self-stable, compact, and proportionate"
status: complete
owner: "codex"
id: T-4cead479
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-07-31
---

# Task: Make Skopos closure atomic, self-stable, compact, and proportionate

## Changelog

- `2026-07-31`: Synchronized Task state `complete` from Skopos.

## Goal

Make Skopos closure atomic, self-stable, compact, and proportionate

## Acceptance

- A single public finish command verifies, transitions, archives, refreshes final proof state, and closes a Task without a manual multi-command sequence
- Skopos-managed Task projection creation, updates, movement, archival, and formatting never invalidate Task-bound project Action Evidence
- Action source fingerprints cover declared relevant inputs rather than unrelated broad generated or Project Memory churn
- Agent-facing CLI output defaults to compact summaries while retaining explicit detailed JSON inspection
- Light and standard Tasks require fewer manual lifecycle commands without weakening high-impact Readiness

## Non-Goals

- Preserve obsolete pre-release command behavior through compatibility aliases

## Constraints

- None declared.

## Owned Paths

- `docs/architecture`
- `docs/guides`
- `docs/standards`
- `packages`
- `tests`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make Skopos closure atomic, self-stable, compact, and proportionate" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- A single public finish command verifies, transitions, archives, refreshes final proof state, and closes a Task without a manual multi-command sequence (closure, agent-observation)
- Skopos-managed Task projection creation, updates, movement, archival, and formatting never invalidate Task-bound project Action Evidence (closure, agent-observation)
- Action source fingerprints cover declared relevant inputs rather than unrelated broad generated or Project Memory churn (closure, agent-observation)
- Agent-facing CLI output defaults to compact summaries while retaining explicit detailed JSON inspection (closure, agent-observation)
- Light and standard Tasks require fewer manual lifecycle commands without weakening high-impact Readiness (closure, agent-observation)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-4cead479",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-07-31T03:20:28.795Z",
  "updatedAt": "2026-07-31T03:42:18.108Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Make Skopos closure atomic, self-stable, compact, and proportionate",
  "goal": "Make Skopos closure atomic, self-stable, compact, and proportionate",
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
      "A single public finish command verifies, transitions, archives, refreshes final proof state, and closes a Task without a manual multi-command sequence",
      "Skopos-managed Task projection creation, updates, movement, archival, and formatting never invalidate Task-bound project Action Evidence",
      "Action source fingerprints cover declared relevant inputs rather than unrelated broad generated or Project Memory churn",
      "Agent-facing CLI output defaults to compact summaries while retaining explicit detailed JSON inspection",
      "Light and standard Tasks require fewer manual lifecycle commands without weakening high-impact Readiness"
    ],
    "nonGoals": [
      "Preserve obsolete pre-release command behavior through compatibility aliases"
    ],
    "constraints": []
  },
  "risk": "standard",
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
      "detail": "Carry out \"Make Skopos closure atomic, self-stable, compact, and proportionate\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "A single public finish command verifies, transitions, archives, refreshes final proof state, and closes a Task without a manual multi-command sequence",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Skopos-managed Task projection creation, updates, movement, archival, and formatting never invalidate Task-bound project Action Evidence",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Action source fingerprints cover declared relevant inputs rather than unrelated broad generated or Project Memory churn",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Agent-facing CLI output defaults to compact summaries while retaining explicit detailed JSON inspection",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Light and standard Tasks require fewer manual lifecycle commands without weakening high-impact Readiness",
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
      "resolvedAt": "2026-07-31T03:20:43.588Z",
      "resolvedByActorId": "codex"
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
    "docs/architecture",
    "docs/guides",
    "docs/standards",
    "packages",
    "tests"
  ]
}
```
<!-- skopos:task-state:end -->
