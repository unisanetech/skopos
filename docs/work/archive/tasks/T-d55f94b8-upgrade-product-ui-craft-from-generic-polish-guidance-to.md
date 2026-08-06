---
title: "Task: Upgrade Product UI Craft from generic polish guidance to archetype-aware high-quality product design judgment"
status: complete
owner: "codex-ui-craft-quality"
id: T-d55f94b8
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-c9c3b90378cb840c
lastUpdated: 2026-08-05
---

# Task: Upgrade Product UI Craft from generic polish guidance to archetype-aware high-quality product design judgment

## Changelog

- `2026-08-05`: Synchronized Task state `complete` from Skopos.

## Goal

Upgrade Product UI Craft from generic polish guidance to archetype-aware high-quality product design judgment

## Acceptance

- The pack requires task-archetype diagnosis, exact-task reference research, and project-evidence-backed art direction before visual styling.
- Color guidance uses explicit neutral, action, focus, semantic, data, and brand-expression roles instead of generic primary/secondary/tertiary palettes.
- Responsive guidance requires structural transformation decisions and truthful limitations, while review rejects generic AI visual convergence and requires equal-state rendered comparison plus subjective judgment.
- All six deterministic selection fixtures and focused Skill contract tests pass, exact acceptance is re-established for the changed source identity, and no new Skill pack or evaluation authority is created.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `packages/cli/src/__tests__/skill-packs.test.ts`
- `skill-packs/ui/product-craft/guidance/anti-slop-review.md`
- `skill-packs/ui/product-craft/guidance/hierarchy-and-brand.md`
- `skill-packs/ui/product-craft/guidance/responsive-and-states.md`
- `skill-packs/ui/product-craft/guidance/visual-composition-and-polish.md`
- `skill-packs/ui/product-craft/pack.json`
- `skill-packs/ui/product-craft/rubrics/product-ui-review.json`
- `tools/skopos/skills/ui.product-craft.json`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Upgrade Product UI Craft from generic polish guidance to archetype-aware high-quality product design judgment" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Refresh self-hosted knowledge state** (action, complete) — Required by Guard knowledge.refresh.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `maintenance.refresh-knowledge`: Required by Guard knowledge.refresh.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `knowledge.refresh`
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- The pack requires task-archetype diagnosis, exact-task reference research, and project-evidence-backed art direction before visual styling. (closure, agent-observation)
- Color guidance uses explicit neutral, action, focus, semantic, data, and brand-expression roles instead of generic primary/secondary/tertiary palettes. (closure, agent-observation)
- Responsive guidance requires structural transformation decisions and truthful limitations, while review rejects generic AI visual convergence and requires equal-state rendered comparison plus subjective judgment. (closure, agent-observation)
- All six deterministic selection fixtures and focused Skill contract tests pass, exact acceptance is re-established for the changed source identity, and no new Skill pack or evaluation authority is created. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-d55f94b8",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-05T18:53:18.319Z",
  "updatedAt": "2026-08-05T19:05:47.663Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Upgrade Product UI Craft from generic polish guidance to archetype-aware high-quality product design judgment",
  "goal": "Upgrade Product UI Craft from generic polish guidance to archetype-aware high-quality product design judgment",
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
      "The pack requires task-archetype diagnosis, exact-task reference research, and project-evidence-backed art direction before visual styling.",
      "Color guidance uses explicit neutral, action, focus, semantic, data, and brand-expression roles instead of generic primary/secondary/tertiary palettes.",
      "Responsive guidance requires structural transformation decisions and truthful limitations, while review rejects generic AI visual convergence and requires equal-state rendered comparison plus subjective judgment.",
      "All six deterministic selection fixtures and focused Skill contract tests pass, exact acceptance is re-established for the changed source identity, and no new Skill pack or evaluation authority is created."
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-c9c3b90378cb840c"
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
      "detail": "Carry out \"Upgrade Product UI Craft from generic polish guidance to archetype-aware high-quality product design judgment\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-maintenance.refresh-knowledge",
      "kind": "action",
      "title": "Refresh self-hosted knowledge state",
      "detail": "Required by Guard knowledge.refresh.",
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
        "packages/cli/src/__tests__/skill-packs.test.ts"
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
      "acceptanceCriterion": "The pack requires task-archetype diagnosis, exact-task reference research, and project-evidence-backed art direction before visual styling.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Color guidance uses explicit neutral, action, focus, semantic, data, and brand-expression roles instead of generic primary/secondary/tertiary palettes.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Responsive guidance requires structural transformation decisions and truthful limitations, while review rejects generic AI visual convergence and requires equal-state rendered comparison plus subjective judgment.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "All six deterministic selection fixtures and focused Skill contract tests pass, exact acceptance is re-established for the changed source identity, and no new Skill pack or evaluation authority is created.",
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
      "resolvedAt": "2026-08-05T18:53:55.720Z",
      "resolvedByActorId": "codex-ui-craft-quality"
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
    "packages/cli/src/__tests__/skill-packs.test.ts",
    "skill-packs/ui/product-craft/guidance/anti-slop-review.md",
    "skill-packs/ui/product-craft/guidance/hierarchy-and-brand.md",
    "skill-packs/ui/product-craft/guidance/responsive-and-states.md",
    "skill-packs/ui/product-craft/guidance/visual-composition-and-polish.md",
    "skill-packs/ui/product-craft/pack.json",
    "skill-packs/ui/product-craft/rubrics/product-ui-review.json",
    "tools/skopos/skills/ui.product-craft.json"
  ]
}
```
<!-- skopos:task-state:end -->
