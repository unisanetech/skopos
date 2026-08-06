---
title: "Task: Harden Product UI Craft from the real ecommerce dashboard audit"
status: complete
owner: "codex-ui-craft-audit-improvements"
id: T-360d395b
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-6a23c44a4ec100f7
lastUpdated: 2026-08-06
---

# Task: Harden Product UI Craft from the real ecommerce dashboard audit

## Changelog

- `2026-08-06`: Synchronized Task state `complete` from Skopos.

## Goal

Harden Product UI Craft from the real ecommerce dashboard audit

## Acceptance

- Guidance explicitly covers responsive overlay focus, local overflow, interaction-state distinction, icon weight, decision density, and product character without owning data semantics
- The Product UI rubric blocks accessibility and micro-polish failures exposed by the canary
- Deterministic fixtures and focused Skill tests pass within the existing module and token budgets
- The revised exact source identity is re-accepted and Decision 040, the Skill Finding, and the Skill Plan state that prior efficacy is historical for this identity

## Non-Goals

- Do not run paid paired model evaluation or add another Skill pack

## Constraints

- Preserve schemaVersion 1, module locality, exact acceptance, and the existing 2200-token Task budget

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `packages/cli/src/__tests__/skill-evaluations.test.ts`
- `packages/cli/src/__tests__/skill-packs.test.ts`
- `skill-packs/ui/product-craft/fixtures/visual-restraint-review.fixture.json`
- `skill-packs/ui/product-craft/guidance/anti-slop-review.md`
- `skill-packs/ui/product-craft/guidance/hierarchy-and-brand.md`
- `skill-packs/ui/product-craft/guidance/responsive-and-states.md`
- `skill-packs/ui/product-craft/guidance/visual-composition-and-polish.md`
- `skill-packs/ui/product-craft/rubrics/product-ui-review.json`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Harden Product UI Craft from the real ecommerce dashboard audit" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Guidance explicitly covers responsive overlay focus, local overflow, interaction-state distinction, icon weight, decision density, and product character without owning data semantics (closure, agent-observation)
- The Product UI rubric blocks accessibility and micro-polish failures exposed by the canary (closure, agent-observation)
- Deterministic fixtures and focused Skill tests pass within the existing module and token budgets (closure, agent-observation)
- The revised exact source identity is re-accepted and Decision 040, the Skill Finding, and the Skill Plan state that prior efficacy is historical for this identity (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-360d395b",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-06T08:28:29.438Z",
  "updatedAt": "2026-08-06T08:40:20.023Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Harden Product UI Craft from the real ecommerce dashboard audit",
  "goal": "Harden Product UI Craft from the real ecommerce dashboard audit",
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
      "Guidance explicitly covers responsive overlay focus, local overflow, interaction-state distinction, icon weight, decision density, and product character without owning data semantics",
      "The Product UI rubric blocks accessibility and micro-polish failures exposed by the canary",
      "Deterministic fixtures and focused Skill tests pass within the existing module and token budgets",
      "The revised exact source identity is re-accepted and Decision 040, the Skill Finding, and the Skill Plan state that prior efficacy is historical for this identity"
    ],
    "nonGoals": [
      "Do not run paid paired model evaluation or add another Skill pack"
    ],
    "constraints": [
      "Preserve schemaVersion 1, module locality, exact acceptance, and the existing 2200-token Task budget"
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-6a23c44a4ec100f7"
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
      "detail": "Carry out \"Harden Product UI Craft from the real ecommerce dashboard audit\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/skill-packs.test.ts",
        "packages/cli/src/__tests__/skill-evaluations.test.ts"
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
      "acceptanceCriterion": "Guidance explicitly covers responsive overlay focus, local overflow, interaction-state distinction, icon weight, decision density, and product character without owning data semantics",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The Product UI rubric blocks accessibility and micro-polish failures exposed by the canary",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Deterministic fixtures and focused Skill tests pass within the existing module and token budgets",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The revised exact source identity is re-accepted and Decision 040, the Skill Finding, and the Skill Plan state that prior efficacy is historical for this identity",
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
      "id": "memory-decision-5e228f0160",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
      "resolution": "memory-updated",
      "resolutionReason": "Decision 040 now records the audit-derived guidance/rubric hardening, exact accepted digest, deterministic budgets, and the historical status of prior efficacy for the revised source.",
      "resolvedAt": "2026-08-06T08:39:53.717Z",
      "resolvedByActorId": "codex-ui-craft-audit-improvements"
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
      "resolvedAt": "2026-08-06T08:28:44.917Z",
      "resolvedByActorId": "codex-ui-craft-audit-improvements"
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
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "packages/cli/src/__tests__/skill-evaluations.test.ts",
    "packages/cli/src/__tests__/skill-packs.test.ts",
    "skill-packs/ui/product-craft/fixtures/visual-restraint-review.fixture.json",
    "skill-packs/ui/product-craft/guidance/anti-slop-review.md",
    "skill-packs/ui/product-craft/guidance/hierarchy-and-brand.md",
    "skill-packs/ui/product-craft/guidance/responsive-and-states.md",
    "skill-packs/ui/product-craft/guidance/visual-composition-and-polish.md",
    "skill-packs/ui/product-craft/rubrics/product-ui-review.json"
  ]
}
```
<!-- skopos:task-state:end -->
