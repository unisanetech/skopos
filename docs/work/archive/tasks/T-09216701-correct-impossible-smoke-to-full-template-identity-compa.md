---
title: "Task: Correct impossible smoke-to-full template identity comparison"
status: complete
owner: "codex-ui-craft-full-gate-correction"
id: T-09216701
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-d7dc2945ee7a6832
lastUpdated: 2026-08-05
---

# Task: Correct impossible smoke-to-full template identity comparison

## Changelog

- `2026-08-05`: Synchronized Task state `complete` from Skopos.

## Goal

Correct impossible smoke-to-full template identity comparison

## Acceptance

- The full gate compares shared model, host, adapter, prompt, permission, toolchain, pack, binding, capability, fixture, rubric, and suite identities exactly.
- The smoke case-set, smoke budget, and smoke template digest are verified against their current smoke projections instead of being compared to the different full projections.
- A no-model full preflight with the exact successful smoke report validates the gate; stale or mismatched smoke evidence still fails closed.
- Focused tests, typecheck, immutable snapshot, and closure Readiness pass before resuming the paid full run.

## Non-Goals

- Do not change worker/reviewer prompts, cases, templates, rubric, Skill content, budgets, scoring, or promotion thresholds.
- Do not start model inference inside this correction Task.

## Constraints

- None declared.

## Owned Paths

- `packages/cli/src/__tests__/skill-evaluations.test.ts`
- `packages/cli/src/benchmarks/product-ui-craft-efficacy.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Correct impossible smoke-to-full template identity comparison" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- The full gate compares shared model, host, adapter, prompt, permission, toolchain, pack, binding, capability, fixture, rubric, and suite identities exactly. (closure, agent-observation)
- The smoke case-set, smoke budget, and smoke template digest are verified against their current smoke projections instead of being compared to the different full projections. (closure, agent-observation)
- A no-model full preflight with the exact successful smoke report validates the gate; stale or mismatched smoke evidence still fails closed. (closure, agent-observation)
- Focused tests, typecheck, immutable snapshot, and closure Readiness pass before resuming the paid full run. (closure, agent-observation)
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
  "id": "T-09216701",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-05T20:22:17.869Z",
  "updatedAt": "2026-08-05T20:24:26.763Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Correct impossible smoke-to-full template identity comparison",
  "goal": "Correct impossible smoke-to-full template identity comparison",
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
      "The full gate compares shared model, host, adapter, prompt, permission, toolchain, pack, binding, capability, fixture, rubric, and suite identities exactly.",
      "The smoke case-set, smoke budget, and smoke template digest are verified against their current smoke projections instead of being compared to the different full projections.",
      "A no-model full preflight with the exact successful smoke report validates the gate; stale or mismatched smoke evidence still fails closed.",
      "Focused tests, typecheck, immutable snapshot, and closure Readiness pass before resuming the paid full run."
    ],
    "nonGoals": [
      "Do not change worker/reviewer prompts, cases, templates, rubric, Skill content, budgets, scoring, or promotion thresholds.",
      "Do not start model inference inside this correction Task."
    ],
    "constraints": []
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-d7dc2945ee7a6832"
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
      "detail": "Carry out \"Correct impossible smoke-to-full template identity comparison\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The full gate compares shared model, host, adapter, prompt, permission, toolchain, pack, binding, capability, fixture, rubric, and suite identities exactly.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The smoke case-set, smoke budget, and smoke template digest are verified against their current smoke projections instead of being compared to the different full projections.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "A no-model full preflight with the exact successful smoke report validates the gate; stale or mismatched smoke evidence still fails closed.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused tests, typecheck, immutable snapshot, and closure Readiness pass before resuming the paid full run.",
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
      "resolutionReason": "The correction preserves the existing evaluation architecture and only repairs stage-specific identity comparison inside the canonical runner; no architecture Memory changed.",
      "resolvedAt": "2026-08-05T20:24:11.610Z",
      "resolvedByActorId": "codex-ui-craft-full-gate-correction"
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
      "resolvedAt": "2026-08-05T20:22:26.713Z",
      "resolvedByActorId": "codex-ui-craft-full-gate-correction"
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
    "packages/cli/src/__tests__/skill-evaluations.test.ts",
    "packages/cli/src/benchmarks/product-ui-craft-efficacy.ts"
  ]
}
```
<!-- skopos:task-state:end -->
