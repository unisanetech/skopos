---
title: "Task: Record the first-version Skill capability hard-cut and judgment-pack roadmap"
status: complete
owner: "codex-skill-plan"
id: T-589b534c
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-f225011e46f2cf0c
lastUpdated: 2026-08-04
---

# Task: Record the first-version Skill capability hard-cut and judgment-pack roadmap

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Record the first-version Skill capability hard-cut and judgment-pack roadmap

## Acceptance

- Decision 040 records the unreleased clean hard-cut, teach-the-delta doctrine, schemaVersion 1, and first pack versions at 0.1.0 without compatibility paths.
- One canonical Plan defines selection, budgets, evaluation, pack ownership, rollout order, and completion gates.
- Current Findings represent the Skill selection/proof/portability gap and the self-hosted derived-output Evidence cycle without claiming implementation is complete.

## Non-Goals

- Implement the Skill runtime, selector, pack cutover, or Evidence-engine fix in this documentation Task.
- Close or widen the active Product UI Craft implementation Task.

## Constraints

- Do not create versioned compatibility, migration, fallback, alias, or dual-runtime paths.

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-self-hosted-derived-output-evidence-cycle.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Record the first-version Skill capability hard-cut and judgment-pack roadmap" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Decision 040 records the unreleased clean hard-cut, teach-the-delta doctrine, schemaVersion 1, and first pack versions at 0.1.0 without compatibility paths. (closure, agent-observation)
- One canonical Plan defines selection, budgets, evaluation, pack ownership, rollout order, and completion gates. (closure, agent-observation)
- Current Findings represent the Skill selection/proof/portability gap and the self-hosted derived-output Evidence cycle without claiming implementation is complete. (closure, agent-observation)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-589b534c",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T16:09:04.270Z",
  "updatedAt": "2026-08-04T16:17:59.513Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Record the first-version Skill capability hard-cut and judgment-pack roadmap",
  "goal": "Record the first-version Skill capability hard-cut and judgment-pack roadmap",
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
      "Decision 040 records the unreleased clean hard-cut, teach-the-delta doctrine, schemaVersion 1, and first pack versions at 0.1.0 without compatibility paths.",
      "One canonical Plan defines selection, budgets, evaluation, pack ownership, rollout order, and completion gates.",
      "Current Findings represent the Skill selection/proof/portability gap and the self-hosted derived-output Evidence cycle without claiming implementation is complete."
    ],
    "nonGoals": [
      "Implement the Skill runtime, selector, pack cutover, or Evidence-engine fix in this documentation Task.",
      "Close or widen the active Product UI Craft implementation Task."
    ],
    "constraints": [
      "Do not create versioned compatibility, migration, fallback, alias, or dual-runtime paths."
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-f225011e46f2cf0c"
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
      "detail": "Carry out \"Record the first-version Skill capability hard-cut and judgment-pack roadmap\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Decision 040 records the unreleased clean hard-cut, teach-the-delta doctrine, schemaVersion 1, and first pack versions at 0.1.0 without compatibility paths.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "One canonical Plan defines selection, budgets, evaluation, pack ownership, rollout order, and completion gates.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Current Findings represent the Skill selection/proof/portability gap and the self-hosted derived-output Evidence cycle without claiming implementation is complete.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-decision-5e228f0160",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
      "resolution": "memory-updated",
      "resolutionReason": "Decision 040 now records the first-version clean hard cut, teach-delta doctrine, bounded selection, evaluation, portability proof, and 0.1.0 pack policy.",
      "resolvedAt": "2026-08-04T16:16:42.261Z",
      "resolvedByActorId": "codex-skill-plan"
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
      "resolvedAt": "2026-08-04T16:09:26.991Z",
      "resolvedByActorId": "codex-skill-plan"
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
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/findings/F-20260804-self-hosted-derived-output-evidence-cycle.md",
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md"
  ]
}
```
<!-- skopos:task-state:end -->
