---
title: "Task: Bind Skill acceptance and selection reuse to exact source identity"
status: complete
owner: "codex-skill-identity"
id: T-5acaa61c
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-026cdfb43e9084fd
lastUpdated: 2026-08-04
---

# Task: Bind Skill acceptance and selection reuse to exact source identity

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Bind Skill acceptance and selection reuse to exact source identity

## Acceptance

- Accepted bindings record exact pack, binding, project-source, capability-catalog, and evaluation-source digests.
- Any material accepted source change fails closed until a human explicitly re-accepts the binding.
- The skill-selection artifact is the sole cache and explanation view and is reused only when algorithm, task, accepted Skill, capability, and policy digests all match.
- Focused tests prove exact cache hits, relevant invalidation, and stale-acceptance rejection without a compatibility path.

## Non-Goals

- Do not add behavioral forward-test execution or new Skill packs in this Task.

## Constraints

- Keep generated selection artifacts non-authoritative and do not introduce a parallel cache.

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `packages/cli/src/__tests__/skill-packs.test.ts`
- `packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts`
- `packages/model/src/contracts/skopos-skill-pack.ts`
- `packages/runtime/src/application/agent-native/agent-native-operating-model.service.ts`
- `packages/runtime/src/application/skills/skill-identity.service.ts`
- `packages/runtime/src/application/skills/skills.service.ts`
- `tools/skopos/skills/ui.product-craft.json`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Bind Skill acceptance and selection reuse to exact source identity" inside the resolved scope before widening impact to adjacent areas.
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

- Accepted bindings record exact pack, binding, project-source, capability-catalog, and evaluation-source digests. (closure, agent-observation)
- Any material accepted source change fails closed until a human explicitly re-accepts the binding. (closure, agent-observation)
- The skill-selection artifact is the sole cache and explanation view and is reused only when algorithm, task, accepted Skill, capability, and policy digests all match. (closure, agent-observation)
- Focused tests prove exact cache hits, relevant invalidation, and stale-acceptance rejection without a compatibility path. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
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
  "id": "T-5acaa61c",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T17:24:58.705Z",
  "updatedAt": "2026-08-04T17:44:41.404Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Bind Skill acceptance and selection reuse to exact source identity",
  "goal": "Bind Skill acceptance and selection reuse to exact source identity",
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
      "Accepted bindings record exact pack, binding, project-source, capability-catalog, and evaluation-source digests.",
      "Any material accepted source change fails closed until a human explicitly re-accepts the binding.",
      "The skill-selection artifact is the sole cache and explanation view and is reused only when algorithm, task, accepted Skill, capability, and policy digests all match.",
      "Focused tests prove exact cache hits, relevant invalidation, and stale-acceptance rejection without a compatibility path."
    ],
    "nonGoals": [
      "Do not add behavioral forward-test execution or new Skill packs in this Task."
    ],
    "constraints": [
      "Keep generated selection artifacts non-authoritative and do not introduce a parallel cache."
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-026cdfb43e9084fd"
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
      "detail": "Carry out \"Bind Skill acceptance and selection reuse to exact source identity\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/model/src/contracts/skopos-skill-pack.ts",
        "packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts",
        "packages/runtime/src/application/skills/skill-identity.service.ts",
        "packages/runtime/src/application/skills/skills.service.ts",
        "packages/runtime/src/application/agent-native/agent-native-operating-model.service.ts",
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
      "acceptanceCriterion": "Accepted bindings record exact pack, binding, project-source, capability-catalog, and evaluation-source digests.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Any material accepted source change fails closed until a human explicitly re-accepts the binding.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The skill-selection artifact is the sole cache and explanation view and is reused only when algorithm, task, accepted Skill, capability, and policy digests all match.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused tests prove exact cache hits, relevant invalidation, and stale-acceptance rejection without a compatibility path.",
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
      "status": "complete",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
      "resolution": "memory-updated",
      "resolutionReason": "Decision 040 now records exact content-bound acceptance, stale-Skill suppression, and one generated identity-keyed selection cache; the active Finding and Plan were synchronized to the same current state.",
      "resolvedAt": "2026-08-04T17:43:35.059Z",
      "resolvedByActorId": "codex-skill-identity"
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
      "resolvedAt": "2026-08-04T17:25:49.886Z",
      "resolvedByActorId": "codex-skill-identity"
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
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "packages/cli/src/__tests__/skill-packs.test.ts",
    "packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts",
    "packages/model/src/contracts/skopos-skill-pack.ts",
    "packages/runtime/src/application/agent-native/agent-native-operating-model.service.ts",
    "packages/runtime/src/application/skills/skill-identity.service.ts",
    "packages/runtime/src/application/skills/skills.service.ts",
    "tools/skopos/skills/ui.product-craft.json"
  ]
}
```
<!-- skopos:task-state:end -->
