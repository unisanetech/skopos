---
title: "Task: Complete Task-aware Skill selection and task-wide budgets"
status: complete
owner: "codex-skill-selection"
id: T-ec24d596
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-43e5418acac05f31
lastUpdated: 2026-08-04
---

# Task: Complete Task-aware Skill selection and task-wide budgets

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Complete Task-aware Skill selection and task-wide budgets

## Acceptance

- Selection builds one deterministic envelope from the full available Task contract, Scope ancestry, owned and changed paths, capabilities, Actions, Guards, lifecycle, path kinds, and accepted failure evidence.
- A module requires structured positive evidence plus relevant applicability; blocking anti-signals and ambiguous evidence suppress it with a structured explanation.
- Risk-based task-wide pack, module, and measured-token ceilings govern all accepted packs without partial module truncation, and focused fixtures prove zero-selection and capability locality.

## Non-Goals

- Do not implement exact digest caching or content-bound acceptance in this Task.
- Do not add another Skill pack or expand Product UI Craft guidance.

## Constraints

- Keep schemaVersion 1 and the unreleased clean-refactor policy; do not add compatibility fields or dual selectors.

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `packages/cli/src/__tests__/skill-packs.test.ts`
- `packages/model/src/contracts/skopos-skill-pack.ts`
- `packages/runtime/src/application/agent-native/agent-native-operating-model.service.ts`
- `packages/runtime/src/application/agent-native/compact-task-brief.ts`
- `packages/runtime/src/application/skills/skills.service.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Complete Task-aware Skill selection and task-wide budgets" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Selection builds one deterministic envelope from the full available Task contract, Scope ancestry, owned and changed paths, capabilities, Actions, Guards, lifecycle, path kinds, and accepted failure evidence. (closure, agent-observation)
- A module requires structured positive evidence plus relevant applicability; blocking anti-signals and ambiguous evidence suppress it with a structured explanation. (closure, agent-observation)
- Risk-based task-wide pack, module, and measured-token ceilings govern all accepted packs without partial module truncation, and focused fixtures prove zero-selection and capability locality. (closure, agent-observation)
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
  "id": "T-ec24d596",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T16:59:58.080Z",
  "updatedAt": "2026-08-04T17:18:12.855Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Complete Task-aware Skill selection and task-wide budgets",
  "goal": "Complete Task-aware Skill selection and task-wide budgets",
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
      "Selection builds one deterministic envelope from the full available Task contract, Scope ancestry, owned and changed paths, capabilities, Actions, Guards, lifecycle, path kinds, and accepted failure evidence.",
      "A module requires structured positive evidence plus relevant applicability; blocking anti-signals and ambiguous evidence suppress it with a structured explanation.",
      "Risk-based task-wide pack, module, and measured-token ceilings govern all accepted packs without partial module truncation, and focused fixtures prove zero-selection and capability locality."
    ],
    "nonGoals": [
      "Do not implement exact digest caching or content-bound acceptance in this Task.",
      "Do not add another Skill pack or expand Product UI Craft guidance."
    ],
    "constraints": [
      "Keep schemaVersion 1 and the unreleased clean-refactor policy; do not add compatibility fields or dual selectors."
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-43e5418acac05f31"
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
      "detail": "Carry out \"Complete Task-aware Skill selection and task-wide budgets\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/runtime/src/application/agent-native/agent-native-operating-model.service.ts",
        "packages/runtime/src/application/agent-native/compact-task-brief.ts",
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
      "acceptanceCriterion": "Selection builds one deterministic envelope from the full available Task contract, Scope ancestry, owned and changed paths, capabilities, Actions, Guards, lifecycle, path kinds, and accepted failure evidence.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A module requires structured positive evidence plus relevant applicability; blocking anti-signals and ambiguous evidence suppress it with a structured explanation.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Risk-based task-wide pack, module, and measured-token ceilings govern all accepted packs without partial module truncation, and focused fixtures prove zero-selection and capability locality.",
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
      "resolutionReason": "Decision 040 now records the deterministic Task signal envelope, structured eligibility and suppression, module-local explanations, and risk-based Task-wide Skill budgets.",
      "resolvedAt": "2026-08-04T17:16:55.246Z",
      "resolvedByActorId": "codex-skill-selection"
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
      "resolvedAt": "2026-08-04T17:00:21.386Z",
      "resolvedByActorId": "codex-skill-selection"
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
    "packages/runtime/src/application/agent-native/agent-native-operating-model.service.ts",
    "packages/runtime/src/application/agent-native/compact-task-brief.ts",
    "packages/runtime/src/application/skills/skills.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
