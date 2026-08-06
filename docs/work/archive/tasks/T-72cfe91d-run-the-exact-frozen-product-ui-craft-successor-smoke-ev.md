---
title: "Task: Run the exact frozen Product UI Craft successor smoke evaluation"
status: complete
owner: "codex-ui-craft-efficacy-smoke-v2"
id: T-72cfe91d
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-df036f50f7122f90
lastUpdated: 2026-08-05
---

# Task: Run the exact frozen Product UI Craft successor smoke evaluation

## Changelog

- `2026-08-05`: Synchronized Task state `complete` from Skopos.

## Goal

Run the exact frozen Product UI Craft successor smoke evaluation

## Acceptance

- The authorized smoke executes exactly one frozen case with two isolated worker arms and one blinded reviewer against the preflight-bound accepted identity.
- The run retains an honest pass, fail, inconclusive, invalid, or aborted result with exact token, authority, containment, and command evidence without changing prompts, cases, rubric, or Skill content.
- Observed input, fresh-input, and output usage remains within the declared smoke ceilings, or execution stops and preserves partial evidence.
- Decision 040, the Skill Finding, and the Skill Plan reflect only verified smoke truth; closure Readiness passes before any full-run authorization is considered.

## Non-Goals

- Do not execute the eight-case full evaluation.
- Do not modify Product UI Craft, its frozen suite, prompts, rubric, or runner based on the smoke outcome.

## Constraints

- None declared.

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Run the exact frozen Product UI Craft successor smoke evaluation" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The authorized smoke executes exactly one frozen case with two isolated worker arms and one blinded reviewer against the preflight-bound accepted identity. (closure, agent-observation)
- The run retains an honest pass, fail, inconclusive, invalid, or aborted result with exact token, authority, containment, and command evidence without changing prompts, cases, rubric, or Skill content. (closure, agent-observation)
- Observed input, fresh-input, and output usage remains within the declared smoke ceilings, or execution stops and preserves partial evidence. (closure, agent-observation)
- Decision 040, the Skill Finding, and the Skill Plan reflect only verified smoke truth; closure Readiness passes before any full-run authorization is considered. (closure, agent-observation)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-72cfe91d",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-05T19:32:47.152Z",
  "updatedAt": "2026-08-05T19:38:18.954Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Run the exact frozen Product UI Craft successor smoke evaluation",
  "goal": "Run the exact frozen Product UI Craft successor smoke evaluation",
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
      "The authorized smoke executes exactly one frozen case with two isolated worker arms and one blinded reviewer against the preflight-bound accepted identity.",
      "The run retains an honest pass, fail, inconclusive, invalid, or aborted result with exact token, authority, containment, and command evidence without changing prompts, cases, rubric, or Skill content.",
      "Observed input, fresh-input, and output usage remains within the declared smoke ceilings, or execution stops and preserves partial evidence.",
      "Decision 040, the Skill Finding, and the Skill Plan reflect only verified smoke truth; closure Readiness passes before any full-run authorization is considered."
    ],
    "nonGoals": [
      "Do not execute the eight-case full evaluation.",
      "Do not modify Product UI Craft, its frozen suite, prompts, rubric, or runner based on the smoke outcome."
    ],
    "constraints": []
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-df036f50f7122f90"
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
      "detail": "Carry out \"Run the exact frozen Product UI Craft successor smoke evaluation\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The authorized smoke executes exactly one frozen case with two isolated worker arms and one blinded reviewer against the preflight-bound accepted identity.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The run retains an honest pass, fail, inconclusive, invalid, or aborted result with exact token, authority, containment, and command evidence without changing prompts, cases, rubric, or Skill content.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Observed input, fresh-input, and output usage remains within the declared smoke ceilings, or execution stops and preserves partial evidence.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Decision 040, the Skill Finding, and the Skill Plan reflect only verified smoke truth; closure Readiness passes before any full-run authorization is considered.",
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
      "resolutionReason": "Decision 040 now records the exact successor smoke as a valid execution pass and negative control-win efficacy observation, with no promotion or full-run authorization.",
      "resolvedAt": "2026-08-05T19:37:35.101Z",
      "resolvedByActorId": "codex-ui-craft-efficacy-smoke-v2"
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
      "resolvedAt": "2026-08-05T19:33:04.683Z",
      "resolvedByActorId": "codex-ui-craft-efficacy-smoke-v2"
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
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md"
  ]
}
```
<!-- skopos:task-state:end -->
