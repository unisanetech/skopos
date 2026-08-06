---
title: "Task: Run a fresh isolated ecommerce canary for the revised Product UI Craft identity"
status: complete
owner: "codex-ui-craft-fresh-canary"
id: T-c88702f8
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-611c6d39a2420156
lastUpdated: 2026-08-06
---

# Task: Run a fresh isolated ecommerce canary for the revised Product UI Craft identity

## Changelog

- `2026-08-06`: Synchronized Task state `complete` from Skopos.

## Goal

Run a fresh isolated ecommerce canary for the revised Product UI Craft identity

## Acceptance

- A blank external project outside both source checkouts installs only packed current Skopos, packed Unisane UI/tokens, and ordinary declared dependencies
- One fresh worker receives exact Task-selected Product UI Craft context for combined digest sha256:796fc1c94cdd61769a0629df3d76bfb3e97ec04efa128fb3567b7881fb00494f and implements the bounded seller-dashboard brief
- Build, desktop/mobile interaction, overflow, and Axe proof run against the fresh output
- A fresh screenshot-based subjective audit reports strengths and remaining Skill, project-adaptation, or project-output gaps without overstating efficacy
- The historical ecommerce canary and live Unisane checkout remain unchanged

## Non-Goals

- Do not run the paired efficacy suite, independent adjudication, or any new Skill pack

## Constraints

- Use one fresh worker only and preserve exact Skill acceptance, module locality, and token budgets

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Run a fresh isolated ecommerce canary for the revised Product UI Craft identity" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- A blank external project outside both source checkouts installs only packed current Skopos, packed Unisane UI/tokens, and ordinary declared dependencies (closure, agent-observation)
- One fresh worker receives exact Task-selected Product UI Craft context for combined digest sha256:796fc1c94cdd61769a0629df3d76bfb3e97ec04efa128fb3567b7881fb00494f and implements the bounded seller-dashboard brief (closure, agent-observation)
- Build, desktop/mobile interaction, overflow, and Axe proof run against the fresh output (closure, agent-observation)
- A fresh screenshot-based subjective audit reports strengths and remaining Skill, project-adaptation, or project-output gaps without overstating efficacy (closure, agent-observation)
- The historical ecommerce canary and live Unisane checkout remain unchanged (closure, agent-observation)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-c88702f8",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-06T09:02:03.022Z",
  "updatedAt": "2026-08-06T09:44:25.788Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Run a fresh isolated ecommerce canary for the revised Product UI Craft identity",
  "goal": "Run a fresh isolated ecommerce canary for the revised Product UI Craft identity",
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
      "A blank external project outside both source checkouts installs only packed current Skopos, packed Unisane UI/tokens, and ordinary declared dependencies",
      "One fresh worker receives exact Task-selected Product UI Craft context for combined digest sha256:796fc1c94cdd61769a0629df3d76bfb3e97ec04efa128fb3567b7881fb00494f and implements the bounded seller-dashboard brief",
      "Build, desktop/mobile interaction, overflow, and Axe proof run against the fresh output",
      "A fresh screenshot-based subjective audit reports strengths and remaining Skill, project-adaptation, or project-output gaps without overstating efficacy",
      "The historical ecommerce canary and live Unisane checkout remain unchanged"
    ],
    "nonGoals": [
      "Do not run the paired efficacy suite, independent adjudication, or any new Skill pack"
    ],
    "constraints": [
      "Use one fresh worker only and preserve exact Skill acceptance, module locality, and token budgets"
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-611c6d39a2420156"
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
      "detail": "Carry out \"Run a fresh isolated ecommerce canary for the revised Product UI Craft identity\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "A blank external project outside both source checkouts installs only packed current Skopos, packed Unisane UI/tokens, and ordinary declared dependencies",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "One fresh worker receives exact Task-selected Product UI Craft context for combined digest sha256:796fc1c94cdd61769a0629df3d76bfb3e97ec04efa128fb3567b7881fb00494f and implements the bounded seller-dashboard brief",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Build, desktop/mobile interaction, overflow, and Axe proof run against the fresh output",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "A fresh screenshot-based subjective audit reports strengths and remaining Skill, project-adaptation, or project-output gaps without overstating efficacy",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "The historical ecommerce canary and live Unisane checkout remain unchanged",
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
      "resolutionReason": "Decision 040 now records the exact fresh packed canary, correction-loop proof, model usage, subjective limitations, and unchanged efficacy boundary.",
      "resolvedAt": "2026-08-06T09:42:26.207Z",
      "resolvedByActorId": "codex-ui-craft-fresh-canary"
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
      "resolvedAt": "2026-08-06T09:02:17.952Z",
      "resolvedByActorId": "codex-ui-craft-fresh-canary"
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
