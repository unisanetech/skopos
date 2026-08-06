---
title: "Task: Run the exact Product UI Craft v3 eight-case full efficacy comparison"
status: complete
owner: "codex-ui-craft-v3-full"
id: T-4d83ef10
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-f8717121901fbca0
lastUpdated: 2026-08-05
---

# Task: Run the exact Product UI Craft v3 eight-case full efficacy comparison

## Changelog

- `2026-08-05`: Synchronized Task state `complete` from Skopos.

## Goal

Run the exact Product UI Craft v3 eight-case full efficacy comparison

## Acceptance

- A fresh zero-model full preflight passes and the successful v3 smoke report exactly matches every required full-run identity before inference.
- Exactly sixteen isolated workers and eight blinded model reviewers run the frozen eight-case suite with no cross-arm or evaluator-oracle exposure and with durable partial evidence on failure.
- The report honestly records candidate/control wins, ties, invalid and aborted cases, authority regressions, corrections, supervision, token cost, containment, per-dimension scores, and blinded human-review bundles.
- Decision 040, the Skill Finding, and Skill Plan reflect the observed full result without post-outcome tuning; promotion remains pending independent human blind review unless every declared gate is met.
- Immutable snapshot and closure Readiness pass with no missing Evidence; no new Skill pack or continuation work starts.

## Non-Goals

- Do not alter Product UI Craft, suite, cases, prompts, rubric, runner, identities, or promotion thresholds after observing results.
- Do not claim independent human adjudication from model review or start another Skill pack.

## Constraints

- Stop at declared input, fresh-input, or output ceilings and retain the machine-readable partial report.
- Preserve unrelated dirty-worktree changes and do not modify live Billquest files.

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Run the exact Product UI Craft v3 eight-case full efficacy comparison" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- A fresh zero-model full preflight passes and the successful v3 smoke report exactly matches every required full-run identity before inference. (closure, agent-observation)
- Exactly sixteen isolated workers and eight blinded model reviewers run the frozen eight-case suite with no cross-arm or evaluator-oracle exposure and with durable partial evidence on failure. (closure, agent-observation)
- The report honestly records candidate/control wins, ties, invalid and aborted cases, authority regressions, corrections, supervision, token cost, containment, per-dimension scores, and blinded human-review bundles. (closure, agent-observation)
- Decision 040, the Skill Finding, and Skill Plan reflect the observed full result without post-outcome tuning; promotion remains pending independent human blind review unless every declared gate is met. (closure, agent-observation)
- Immutable snapshot and closure Readiness pass with no missing Evidence; no new Skill pack or continuation work starts. (closure, agent-observation)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-4d83ef10",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-05T20:20:30.460Z",
  "updatedAt": "2026-08-05T21:07:59.198Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Run the exact Product UI Craft v3 eight-case full efficacy comparison",
  "goal": "Run the exact Product UI Craft v3 eight-case full efficacy comparison",
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
      "A fresh zero-model full preflight passes and the successful v3 smoke report exactly matches every required full-run identity before inference.",
      "Exactly sixteen isolated workers and eight blinded model reviewers run the frozen eight-case suite with no cross-arm or evaluator-oracle exposure and with durable partial evidence on failure.",
      "The report honestly records candidate/control wins, ties, invalid and aborted cases, authority regressions, corrections, supervision, token cost, containment, per-dimension scores, and blinded human-review bundles.",
      "Decision 040, the Skill Finding, and Skill Plan reflect the observed full result without post-outcome tuning; promotion remains pending independent human blind review unless every declared gate is met.",
      "Immutable snapshot and closure Readiness pass with no missing Evidence; no new Skill pack or continuation work starts."
    ],
    "nonGoals": [
      "Do not alter Product UI Craft, suite, cases, prompts, rubric, runner, identities, or promotion thresholds after observing results.",
      "Do not claim independent human adjudication from model review or start another Skill pack."
    ],
    "constraints": [
      "Stop at declared input, fresh-input, or output ceilings and retain the machine-readable partial report.",
      "Preserve unrelated dirty-worktree changes and do not modify live Billquest files."
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-f8717121901fbca0"
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
      "detail": "Carry out \"Run the exact Product UI Craft v3 eight-case full efficacy comparison\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "A fresh zero-model full preflight passes and the successful v3 smoke report exactly matches every required full-run identity before inference.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Exactly sixteen isolated workers and eight blinded model reviewers run the frozen eight-case suite with no cross-arm or evaluator-oracle exposure and with durable partial evidence on failure.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The report honestly records candidate/control wins, ties, invalid and aborted cases, authority regressions, corrections, supervision, token cost, containment, per-dimension scores, and blinded human-review bundles.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Decision 040, the Skill Finding, and Skill Plan reflect the observed full result without post-outcome tuning; promotion remains pending independent human blind review unless every declared gate is met.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Immutable snapshot and closure Readiness pass with no missing Evidence; no new Skill pack or continuation work starts.",
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
      "resolutionReason": "Decision 040 now records the exact v3 full 6-2 model-reviewed result, clean containment, bounded costs, operations winner variance, and pending independent human promotion gate.",
      "resolvedAt": "2026-08-05T21:07:29.450Z",
      "resolvedByActorId": "codex-ui-craft-v3-full"
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
      "resolvedAt": "2026-08-05T20:20:44.319Z",
      "resolvedByActorId": "codex-ui-craft-v3-full"
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
