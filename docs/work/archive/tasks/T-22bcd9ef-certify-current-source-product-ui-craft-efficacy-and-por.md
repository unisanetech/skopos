---
title: "Task: Certify current-source Product UI Craft efficacy and portability for release gate R2"
status: superseded
owner: "project"
id: T-22bcd9ef
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-ff7c085a4c9904b8
lastUpdated: 2026-08-09
---

# Task: Certify current-source Product UI Craft efficacy and portability for release gate R2

## Changelog

- `2026-08-09`: Synchronized Task state `superseded` from Skopos.

## Goal

Certify current-source Product UI Craft efficacy and portability for release gate R2

## Acceptance

- Freeze the exact current Product UI Craft pack, binding, fixtures, rubric, environment, capabilities, and source identity
- No-model preflight and exact-identity candidate-versus-control smoke pass before the full paired evaluation
- The complete paired evaluation and independent blind human adjudication demonstrate material improvement without authority, safety, cost, adaptation, or selection regression
- Packed external-project portability passes for the exact certified identity
- The active MUST Finding closes only when all current-source certification criteria pass

## Non-Goals

- Publish Skopos or authorize the 0.1.0 release

## Constraints

- Product UI Craft remains in the release and must not be disabled or removed
- Do not expand the broad Skill catalog during this Task

## Admission And Workflow

- Legacy Task admission; workflow derives from risk `high-impact`.

## Owned Paths

- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `packages/cli/src/benchmarks/external-skill-portability.ts`
- `packages/cli/src/benchmarks/product-ui-craft-efficacy.ts`
- `skill-packs/ui/product-craft`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Certify current-source Product UI Craft efficacy and portability for release gate R2" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Freeze the exact current Product UI Craft pack, binding, fixtures, rubric, environment, capabilities, and source identity (closure, agent-observation)
- No-model preflight and exact-identity candidate-versus-control smoke pass before the full paired evaluation (closure, agent-observation)
- The complete paired evaluation and independent blind human adjudication demonstrate material improvement without authority, safety, cost, adaptation, or selection regression (closure, agent-observation)
- Packed external-project portability passes for the exact certified identity (closure, agent-observation)
- The active MUST Finding closes only when all current-source certification criteria pass (closure, agent-observation)
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
  "id": "T-22bcd9ef",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-07T19:57:49.150Z",
  "updatedAt": "2026-08-09T09:17:23.703Z",
  "planIds": [],
  "childTasks": [],
  "state": "superseded",
  "detail": "detailed",
  "title": "Certify current-source Product UI Craft efficacy and portability for release gate R2",
  "goal": "Certify current-source Product UI Craft efficacy and portability for release gate R2",
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
      "Freeze the exact current Product UI Craft pack, binding, fixtures, rubric, environment, capabilities, and source identity",
      "No-model preflight and exact-identity candidate-versus-control smoke pass before the full paired evaluation",
      "The complete paired evaluation and independent blind human adjudication demonstrate material improvement without authority, safety, cost, adaptation, or selection regression",
      "Packed external-project portability passes for the exact certified identity",
      "The active MUST Finding closes only when all current-source certification criteria pass"
    ],
    "nonGoals": [
      "Publish Skopos or authorize the 0.1.0 release"
    ],
    "constraints": [
      "Product UI Craft remains in the release and must not be disabled or removed",
      "Do not expand the broad Skill catalog during this Task"
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-ff7c085a4c9904b8"
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
      "detail": "Carry out \"Certify current-source Product UI Craft efficacy and portability for release gate R2\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/benchmarks/product-ui-craft-efficacy.ts",
        "packages/cli/src/benchmarks/external-skill-portability.ts"
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
      "acceptanceCriterion": "Freeze the exact current Product UI Craft pack, binding, fixtures, rubric, environment, capabilities, and source identity",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "No-model preflight and exact-identity candidate-versus-control smoke pass before the full paired evaluation",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The complete paired evaluation and independent blind human adjudication demonstrate material improvement without authority, safety, cost, adaptation, or selection regression",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Packed external-project portability passes for the exact certified identity",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "The active MUST Finding closes only when all current-source certification criteria pass",
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
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope skopos.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed the canonical architecture after explicit CLI Task risk routing and the external Skill portability canary correction. Runtime remains the owner of Task risk semantics, CLI remains a public projection, and package boundaries, authority ownership, and the canonical operating loop are unchanged.",
      "resolvedAt": "2026-08-08T21:10:24.091Z",
      "resolvedByActorId": "codex-r2"
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
      "resolvedAt": "2026-08-07T19:58:27.822Z",
      "resolvedByActorId": "cursor-agent"
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
  "disposition": {
    "kind": "supersede",
    "reason": "The user replaced the pre-release Product UI Craft identity with Product Interface Design and requested a three-capability simplification; the old exact-source efficacy Task remains historical evidence and cannot certify the renamed source.",
    "actorId": "codex-interface-design",
    "recordedAt": "2026-08-09T09:17:23.703Z",
    "priorState": "active",
    "nextState": "superseded",
    "successorTaskId": "T-4b256788"
  },
  "supersededByTaskId": "T-4b256788",
  "declaredOwnedPaths": [
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "packages/cli/src/benchmarks/external-skill-portability.ts",
    "packages/cli/src/benchmarks/product-ui-craft-efficacy.ts",
    "skill-packs/ui/product-craft"
  ]
}
```
<!-- skopos:task-state:end -->
