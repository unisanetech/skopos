---
title: "Task: Make the prepared Design Context comparison executable through the proven paired-evaluation pipeline"
status: complete
owner: "codex"
id: T-c7cd96b5
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-a14fdfee0dd8b8cf
lastUpdated: 2026-08-09
---

# Task: Make the prepared Design Context comparison executable through the proven paired-evaluation pipeline

## Changelog

- `2026-08-09`: Synchronized Task state `complete` from Skopos.

## Goal

Make the prepared Design Context comparison executable through the proven paired-evaluation pipeline

## Acceptance

- The generic paired-evaluation runtime supports a digest-bound comparison in which control and candidate may share core guidance while candidate receives exact additional context.
- The Product Interface Design benchmark can run no-model preflight, smoke, and full stages for the six-case Design Context matrix without changing the accepted Skill source.
- Regression tests prove comparison validation, arm-context isolation, identity binding, and unchanged legacy paired-evaluation behavior.
- The owning Plan and Finding distinguish executable preparation from unexecuted efficacy and independent human review.

## Non-Goals

- Do not execute model workers or reviewers in this Task.
- Do not change Product Interface Design guidance, Library records, acceptance identity, or release-gate result.

## Constraints

- Keep comparison configuration capability-owned and generic runtime semantics project-agnostic.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 2 non-workspace Scopes.

## Owned Paths

- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-7b4e3c12-design-context-library.md`
- `package.json`
- `packages/cli/src/__tests__/skill-context-resolution.test.ts`
- `packages/cli/src/__tests__/skill-evaluations.test.ts`
- `packages/cli/src/benchmarks/product-interface-design-efficacy.ts`
- `packages/runtime/src/application/skills/skill-context.service.ts`
- `packages/runtime/src/application/skills/skill-evaluations.service.ts`
- `tools/skopos/actions/skill-product-interface-design-context-efficacy.yaml`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make the prepared Design Context comparison executable through the proven paired-evaluation pipeline" inside the resolved scope before widening impact to adjacent areas.
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

- The generic paired-evaluation runtime supports a digest-bound comparison in which control and candidate may share core guidance while candidate receives exact additional context. (closure, agent-observation)
- The Product Interface Design benchmark can run no-model preflight, smoke, and full stages for the six-case Design Context matrix without changing the accepted Skill source. (closure, agent-observation)
- Regression tests prove comparison validation, arm-context isolation, identity binding, and unchanged legacy paired-evaluation behavior. (closure, agent-observation)
- The owning Plan and Finding distinguish executable preparation from unexecuted efficacy and independent human review. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-c7cd96b5",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T19:33:56.080Z",
  "updatedAt": "2026-08-09T19:52:35.111Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Make the prepared Design Context comparison executable through the proven paired-evaluation pipeline",
  "goal": "Make the prepared Design Context comparison executable through the proven paired-evaluation pipeline",
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
      "The generic paired-evaluation runtime supports a digest-bound comparison in which control and candidate may share core guidance while candidate receives exact additional context.",
      "The Product Interface Design benchmark can run no-model preflight, smoke, and full stages for the six-case Design Context matrix without changing the accepted Skill source.",
      "Regression tests prove comparison validation, arm-context isolation, identity binding, and unchanged legacy paired-evaluation behavior.",
      "The owning Plan and Finding distinguish executable preparation from unexecuted efficacy and independent human review."
    ],
    "nonGoals": [
      "Do not execute model workers or reviewers in this Task.",
      "Do not change Product Interface Design guidance, Library records, acceptance identity, or release-gate result."
    ],
    "constraints": [
      "Keep comparison configuration capability-owned and generic runtime semantics project-agnostic."
    ]
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "Declared ownership affects 2 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 9,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-runtime"
      ],
      "impactCategories": [
        "docs",
        "scope-source",
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-a14fdfee0dd8b8cf"
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
      "detail": "Carry out \"Make the prepared Design Context comparison executable through the proven paired-evaluation pipeline\" inside the resolved scope before widening impact to adjacent areas.",
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
        "tools/skopos/actions/skill-product-interface-design-context-efficacy.yaml"
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
        "packages/runtime/src/application/skills/skill-evaluations.service.ts",
        "packages/runtime/src/application/skills/skill-context.service.ts",
        "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
        "packages/cli/src/__tests__/skill-evaluations.test.ts",
        "packages/cli/src/__tests__/skill-context-resolution.test.ts",
        "package.json"
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
      "acceptanceCriterion": "The generic paired-evaluation runtime supports a digest-bound comparison in which control and candidate may share core guidance while candidate receives exact additional context.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The Product Interface Design benchmark can run no-model preflight, smoke, and full stages for the six-case Design Context matrix without changing the accepted Skill source.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Regression tests prove comparison validation, arm-context isolation, identity binding, and unchanged legacy paired-evaluation behavior.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The owning Plan and Finding distinguish executable preparation from unexecuted efficacy and independent human review.",
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
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope skopos.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "The architecture already defines generic core mechanics and capability-owned Design Context; this implementation follows that boundary and changes execution capability, not project architecture.",
      "resolvedAt": "2026-08-09T19:51:57.143Z",
      "resolvedByActorId": "codex"
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
      "resolvedAt": "2026-08-09T19:34:13.900Z",
      "resolvedByActorId": "codex"
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
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-7b4e3c12-design-context-library.md",
    "package.json",
    "packages/cli/src/__tests__/skill-context-resolution.test.ts",
    "packages/cli/src/__tests__/skill-evaluations.test.ts",
    "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
    "packages/runtime/src/application/skills/skill-context.service.ts",
    "packages/runtime/src/application/skills/skill-evaluations.service.ts",
    "tools/skopos/actions/skill-product-interface-design-context-efficacy.yaml"
  ]
}
```
<!-- skopos:task-state:end -->
