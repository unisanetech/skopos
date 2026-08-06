---
title: "Task: Build isolated paired Skill evaluation and blinded rubric review"
status: complete
owner: "codex-skill-evaluation"
id: T-134200b1
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-e16f02ea4140e5f6
lastUpdated: 2026-08-04
---

# Task: Build isolated paired Skill evaluation and blinded rubric review

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Build isolated paired Skill evaluation and blinded rubric review

## Acceptance

- Versioned evaluation suites declare control and candidate arms without embedding expected answers in worker inputs.
- The runtime materializes isolated arm workspaces, records exact environment and source identities, and never shares one arm output with the other.
- Review bundles randomize arm labels, expose only Task output and selected rubric dimensions, and record reviewer judgments separately from authorship.
- Generated evaluation reports measure wins, losses, ties, regressions, token cost, and authority violations without becoming Evidence or Readiness authority.

## Non-Goals

- Do not use or modify internal/evals owned by the separate adoption Task.
- Do not certify rendered Product UI behavior or external packed adoption in this Task.

## Constraints

- Keep model invocation behind an explicit Action-compatible adapter; unit proof must run without network or model access.
- Do not expose evaluator oracles, expected answers, prior conclusions, or the other arm output to workers.

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `packages/cli/src/__tests__/skill-evaluations.test.ts`
- `packages/cli/src/cli/commands/skills.ts`
- `packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts`
- `packages/model/src/contracts/skopos-skill-pack.ts`
- `packages/runtime/src/application/skills/skill-evaluations.service.ts`
- `packages/runtime/src/index.ts`
- `skill-packs/ui/product-craft/evaluations`
- `skill-packs/ui/product-craft/pack.json`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Build isolated paired Skill evaluation and blinded rubric review" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Versioned evaluation suites declare control and candidate arms without embedding expected answers in worker inputs. (closure, agent-observation)
- The runtime materializes isolated arm workspaces, records exact environment and source identities, and never shares one arm output with the other. (closure, agent-observation)
- Review bundles randomize arm labels, expose only Task output and selected rubric dimensions, and record reviewer judgments separately from authorship. (closure, agent-observation)
- Generated evaluation reports measure wins, losses, ties, regressions, token cost, and authority violations without becoming Evidence or Readiness authority. (closure, agent-observation)
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
  "id": "T-134200b1",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T18:15:17.697Z",
  "updatedAt": "2026-08-04T18:25:52.959Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Build isolated paired Skill evaluation and blinded rubric review",
  "goal": "Build isolated paired Skill evaluation and blinded rubric review",
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
      "Versioned evaluation suites declare control and candidate arms without embedding expected answers in worker inputs.",
      "The runtime materializes isolated arm workspaces, records exact environment and source identities, and never shares one arm output with the other.",
      "Review bundles randomize arm labels, expose only Task output and selected rubric dimensions, and record reviewer judgments separately from authorship.",
      "Generated evaluation reports measure wins, losses, ties, regressions, token cost, and authority violations without becoming Evidence or Readiness authority."
    ],
    "nonGoals": [
      "Do not use or modify internal/evals owned by the separate adoption Task.",
      "Do not certify rendered Product UI behavior or external packed adoption in this Task."
    ],
    "constraints": [
      "Keep model invocation behind an explicit Action-compatible adapter; unit proof must run without network or model access.",
      "Do not expose evaluator oracles, expected answers, prior conclusions, or the other arm output to workers."
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-e16f02ea4140e5f6"
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
      "detail": "Carry out \"Build isolated paired Skill evaluation and blinded rubric review\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts",
        "packages/runtime/src/application/skills/skill-evaluations.service.ts",
        "packages/runtime/src/index.ts",
        "packages/cli/src/cli/commands/skills.ts",
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
      "acceptanceCriterion": "Versioned evaluation suites declare control and candidate arms without embedding expected answers in worker inputs.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The runtime materializes isolated arm workspaces, records exact environment and source identities, and never shares one arm output with the other.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Review bundles randomize arm labels, expose only Task output and selected rubric dimensions, and record reviewer judgments separately from authorship.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Generated evaluation reports measure wins, losses, ties, regressions, token cost, and authority violations without becoming Evidence or Readiness authority.",
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
      "resolutionReason": "Decision 040 now records strict paired suites, isolated opaque arms, explicit adapters, blinded rubric review, environment identity, and generated comparison reporting.",
      "resolvedAt": "2026-08-04T18:25:16.910Z",
      "resolvedByActorId": "codex-skill-evaluation"
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
      "resolvedAt": "2026-08-04T18:15:32.460Z",
      "resolvedByActorId": "codex-skill-evaluation"
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
    "packages/cli/src/cli/commands/skills.ts",
    "packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts",
    "packages/model/src/contracts/skopos-skill-pack.ts",
    "packages/runtime/src/application/skills/skill-evaluations.service.ts",
    "packages/runtime/src/index.ts",
    "skill-packs/ui/product-craft/evaluations",
    "skill-packs/ui/product-craft/pack.json"
  ]
}
```
<!-- skopos:task-state:end -->
