---
title: "Task: Correct Product UI Craft canonical Scope applicability before the Unisane ecommerce dashboard canary"
status: cancelled
owner: "project"
id: T-93fb1c6a
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-3f2397a191d2bc7d
lastUpdated: 2026-08-05
---

# Task: Correct Product UI Craft canonical Scope applicability before the Unisane ecommerce dashboard canary

## Changelog

- `2026-08-05`: Synchronized Task state `cancelled` from Skopos.

## Goal

Correct Product UI Craft canonical Scope applicability before the Unisane ecommerce dashboard canary

## Acceptance

- Product UI Craft applicability uses only canonical Skopos Scope kinds and rejects invalid pseudo-kinds
- A canonical application Scope without frontend or product-ui aliases selects the intended module-local Product UI Craft context and capabilities
- Existing positive, negative, ambiguous, generated-output, locality, budget, and visual-restraint fixture behavior remains exact
- The exact changed pack identity is re-evaluated, re-accepted, and focused Skill tests plus typecheck pass
- Decision 040, the Skill Finding, and the Skill Plan record the verified real-canary selection gap and correction without claiming dashboard efficacy

## Non-Goals

- Build or modify the ecommerce seller dashboard in this correction Task
- Add another Skill pack or start paired model evaluation

## Constraints

- Preserve the unrelated dirty worktree and the completed T-28e5cb45 no-Skill fixture
- Use the unreleased schemaVersion 1 clean hard cut with no aliases, fallback readers, or migrations

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `packages/model/src`
- `packages/runtime/src`
- `skill-packs/ui/product-craft/fixtures/positive-hierarchy.fixture.json`
- `skill-packs/ui/product-craft/pack.json`
- `tools/skopos/skills/ui.product-craft.json`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [ ] **Resolve plan decisions** (implementation, pending) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [ ] **Record Task risk and detail before editing** (implementation, pending) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [ ] **Review the current pattern in Skopos Workspace** (implementation, pending) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Correct Product UI Craft canonical Scope applicability before the Unisane ecommerce dashboard canary" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [ ] **Refresh self-hosted knowledge state** (action, pending) — Required by Guard knowledge.refresh.
- [ ] **Typecheck the Skopos workspace** (action, pending) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `maintenance.refresh-knowledge`: Required by Guard knowledge.refresh.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `knowledge.refresh`
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Product UI Craft applicability uses only canonical Skopos Scope kinds and rejects invalid pseudo-kinds (closure, agent-observation)
- A canonical application Scope without frontend or product-ui aliases selects the intended module-local Product UI Craft context and capabilities (closure, agent-observation)
- Existing positive, negative, ambiguous, generated-output, locality, budget, and visual-restraint fixture behavior remains exact (closure, agent-observation)
- The exact changed pack identity is re-evaluated, re-accepted, and focused Skill tests plus typecheck pass (closure, agent-observation)
- Decision 040, the Skill Finding, and the Skill Plan record the verified real-canary selection gap and correction without claiming dashboard efficacy (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [open] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-93fb1c6a",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-05T22:09:47.774Z",
  "updatedAt": "2026-08-05T22:12:26.715Z",
  "planIds": [],
  "childTasks": [],
  "state": "cancelled",
  "detail": "standard",
  "title": "Correct Product UI Craft canonical Scope applicability before the Unisane ecommerce dashboard canary",
  "goal": "Correct Product UI Craft canonical Scope applicability before the Unisane ecommerce dashboard canary",
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
      "Product UI Craft applicability uses only canonical Skopos Scope kinds and rejects invalid pseudo-kinds",
      "A canonical application Scope without frontend or product-ui aliases selects the intended module-local Product UI Craft context and capabilities",
      "Existing positive, negative, ambiguous, generated-output, locality, budget, and visual-restraint fixture behavior remains exact",
      "The exact changed pack identity is re-evaluated, re-accepted, and focused Skill tests plus typecheck pass",
      "Decision 040, the Skill Finding, and the Skill Plan record the verified real-canary selection gap and correction without claiming dashboard efficacy"
    ],
    "nonGoals": [
      "Build or modify the ecommerce seller dashboard in this correction Task",
      "Add another Skill pack or start paired model evaluation"
    ],
    "constraints": [
      "Preserve the unrelated dirty worktree and the completed T-28e5cb45 no-Skill fixture",
      "Use the unreleased schemaVersion 1 clean hard cut with no aliases, fallback readers, or migrations"
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-3f2397a191d2bc7d"
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
      "status": "pending"
    },
    {
      "id": "step-record-task-risk",
      "kind": "implementation",
      "title": "Record Task risk and detail before editing",
      "detail": "Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.",
      "status": "pending"
    },
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in Skopos Workspace",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "pending"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Correct Product UI Craft canonical Scope applicability before the Unisane ecommerce dashboard canary\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "pending"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "pending"
    },
    {
      "id": "action-maintenance.refresh-knowledge",
      "kind": "action",
      "title": "Refresh self-hosted knowledge state",
      "detail": "Required by Guard knowledge.refresh.",
      "status": "pending"
    },
    {
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck the Skopos workspace",
      "detail": "Required by Guard quality.typecheck.",
      "status": "pending"
    }
  ],
  "selectedActions": [
    {
      "id": "maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
      "reason": "Required by Guard knowledge.refresh.",
      "matchedPaths": [
        "tools/skopos/skills/ui.product-craft.json"
      ],
      "outputPaths": [
        ".skopos/index"
      ],
      "requiresApproval": false
    },
    {
      "id": "quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "packages/model/src",
        "packages/runtime/src"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "knowledge.refresh",
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Product UI Craft applicability uses only canonical Skopos Scope kinds and rejects invalid pseudo-kinds",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A canonical application Scope without frontend or product-ui aliases selects the intended module-local Product UI Craft context and capabilities",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Existing positive, negative, ambiguous, generated-output, locality, budget, and visual-restraint fixture behavior remains exact",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The exact changed pack identity is re-evaluated, re-accepted, and focused Skill tests plus typecheck pass",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Decision 040, the Skill Finding, and the Skill Plan record the verified real-canary selection gap and correction without claiming dashboard efficacy",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-knowledge.refresh",
      "acceptanceCriterion": "Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge",
      "phase": "closure",
      "actionIds": [
        "maintenance.refresh-knowledge"
      ],
      "guardIds": [
        "knowledge.refresh"
      ],
      "evidence": "source-bound-action"
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
      "id": "memory-decision-5e228f0160",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes.",
      "status": "open",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md"
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
      "resolvedAt": "2026-08-05T22:09:54.901Z",
      "resolvedByActorId": "codex-ecommerce-dashboard-skill-canary"
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
    },
    {
      "id": "run-maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "summary": "Required by Guard knowledge.refresh.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "maintenance.refresh-knowledge",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "summary": "Required by Guard quality.typecheck.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.typecheck",
      "blocking": false,
      "status": "open"
    }
  ],
  "disposition": {
    "kind": "cancel",
    "reason": "Pre-implementation inspection found the canonical Scope-kind contract also requires the pack loader and focused test ownership; restart with the complete bounded ownership surface.",
    "actorId": "codex-ecommerce-dashboard-skill-canary",
    "recordedAt": "2026-08-05T22:12:26.715Z",
    "priorState": "active",
    "nextState": "cancelled"
  },
  "declaredOwnedPaths": [
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "packages/model/src",
    "packages/runtime/src",
    "skill-packs/ui/product-craft/fixtures/positive-hierarchy.fixture.json",
    "skill-packs/ui/product-craft/pack.json",
    "tools/skopos/skills/ui.product-craft.json"
  ]
}
```
<!-- skopos:task-state:end -->
