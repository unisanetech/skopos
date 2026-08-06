---
title: "Task: Make Product UI Craft enforce project-bound design-system conformance without naming a UI library"
status: complete
owner: "codex-ui-system-conformance"
id: T-218971ba
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-d416a4d7d96d7c22
lastUpdated: 2026-08-06
---

# Task: Make Product UI Craft enforce project-bound design-system conformance without naming a UI library

## Changelog

- `2026-08-06`: Synchronized Task state `complete` from Skopos.

## Goal

Make Product UI Craft enforce project-bound design-system conformance without naming a UI library

## Acceptance

- Rendered UI Tasks against a bound component authority select component-reuse judgment before custom controls are authored
- Selected Skill context exposes exact project-bound component, token, Action, and Guard roles plus unresolved adaptation gaps
- Design-system conformance remains project-provided and library-neutral; bindings for different libraries and no-library projects behave truthfully
- Deterministic Skill fixtures and focused runtime tests prove selection, capability locality, and no false certification from typecheck
- Decision 040, the Skill Finding, and Skill Plan record only verified project truth

## Non-Goals

- Do not add another Skill pack or start paired model evaluation
- Do not encode Unisane, Material UI, or another library in Skopos core guidance or runtime

## Constraints

- Keep schemaVersion 1 and the unreleased hard cut; create no parallel workflow, Evidence, or closure authority
- Preserve unrelated dirty-worktree changes and do not touch the active adoption Task

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `packages/cli/src/__tests__/skill-packs.test.ts`
- `packages/model/src/contracts/skopos-skill-pack.ts`
- `packages/runtime/src/application/skills/skills.service.ts`
- `skill-packs/ui/product-craft/fixtures/design-system-conformance.fixture.json`
- `skill-packs/ui/product-craft/guidance/component-architecture-and-naming.md`
- `skill-packs/ui/product-craft/guidance/visual-composition-and-polish.md`
- `skill-packs/ui/product-craft/pack.json`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make Product UI Craft enforce project-bound design-system conformance without naming a UI library" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Rendered UI Tasks against a bound component authority select component-reuse judgment before custom controls are authored (closure, agent-observation)
- Selected Skill context exposes exact project-bound component, token, Action, and Guard roles plus unresolved adaptation gaps (closure, agent-observation)
- Design-system conformance remains project-provided and library-neutral; bindings for different libraries and no-library projects behave truthfully (closure, agent-observation)
- Deterministic Skill fixtures and focused runtime tests prove selection, capability locality, and no false certification from typecheck (closure, agent-observation)
- Decision 040, the Skill Finding, and Skill Plan record only verified project truth (closure, agent-observation)
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
  "id": "T-218971ba",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-06T10:10:11.628Z",
  "updatedAt": "2026-08-06T10:26:38.388Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Make Product UI Craft enforce project-bound design-system conformance without naming a UI library",
  "goal": "Make Product UI Craft enforce project-bound design-system conformance without naming a UI library",
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
      "Rendered UI Tasks against a bound component authority select component-reuse judgment before custom controls are authored",
      "Selected Skill context exposes exact project-bound component, token, Action, and Guard roles plus unresolved adaptation gaps",
      "Design-system conformance remains project-provided and library-neutral; bindings for different libraries and no-library projects behave truthfully",
      "Deterministic Skill fixtures and focused runtime tests prove selection, capability locality, and no false certification from typecheck",
      "Decision 040, the Skill Finding, and Skill Plan record only verified project truth"
    ],
    "nonGoals": [
      "Do not add another Skill pack or start paired model evaluation",
      "Do not encode Unisane, Material UI, or another library in Skopos core guidance or runtime"
    ],
    "constraints": [
      "Keep schemaVersion 1 and the unreleased hard cut; create no parallel workflow, Evidence, or closure authority",
      "Preserve unrelated dirty-worktree changes and do not touch the active adoption Task"
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-d416a4d7d96d7c22"
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
      "detail": "Carry out \"Make Product UI Craft enforce project-bound design-system conformance without naming a UI library\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/model/src/contracts/skopos-skill-pack.ts",
        "packages/runtime/src/application/skills/skills.service.ts",
        "packages/cli/src/__tests__/skill-packs.test.ts"
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
      "acceptanceCriterion": "Rendered UI Tasks against a bound component authority select component-reuse judgment before custom controls are authored",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Selected Skill context exposes exact project-bound component, token, Action, and Guard roles plus unresolved adaptation gaps",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Design-system conformance remains project-provided and library-neutral; bindings for different libraries and no-library projects behave truthfully",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Deterministic Skill fixtures and focused runtime tests prove selection, capability locality, and no false certification from typecheck",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Decision 040, the Skill Finding, and Skill Plan record only verified project truth",
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
      "resolutionReason": "Decision 040 now records the verified project-bound design-system adaptation contract, eight-fixture proof, exact accepted identity, and unchanged efficacy limitation.",
      "resolvedAt": "2026-08-06T10:25:19.700Z",
      "resolvedByActorId": "codex-ui-system-conformance"
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
      "resolvedAt": "2026-08-06T10:10:37.868Z",
      "resolvedByActorId": "codex-ui-system-conformance"
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
    "packages/cli/src/__tests__/skill-packs.test.ts",
    "packages/model/src/contracts/skopos-skill-pack.ts",
    "packages/runtime/src/application/skills/skills.service.ts",
    "skill-packs/ui/product-craft/fixtures/design-system-conformance.fixture.json",
    "skill-packs/ui/product-craft/guidance/component-architecture-and-naming.md",
    "skill-packs/ui/product-craft/guidance/visual-composition-and-polish.md",
    "skill-packs/ui/product-craft/pack.json"
  ]
}
```
<!-- skopos:task-state:end -->
