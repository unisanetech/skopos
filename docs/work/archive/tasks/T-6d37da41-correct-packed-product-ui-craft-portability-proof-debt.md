---
title: "Task: Correct packed Product UI Craft portability proof debt"
status: complete
owner: "codex-skill-portability"
id: T-6d37da41
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-7e6c3437f54e7533
lastUpdated: 2026-08-04
---

# Task: Correct packed Product UI Craft portability proof debt

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Correct packed Product UI Craft portability proof debt

## Acceptance

- Billquest capability bindings never satisfy accessibility proof with a non-accessibility command and explicitly report any unresolved accessibility adaptation gap.
- The portability harness always emits a machine-readable report with result pass or fail, failed stage, project, command when applicable, classified cause, partial successful evidence, and cleanup outcome.
- Installed CLI skills context and help contracts are explicitly Task-owned, tested, and included in the immutable closure snapshot.
- Containment claims distinguish observed project-contained writes from unobservable external writes and verify temporary-root cleanup plus forbidden links, dependencies, source references, and environment assistance.
- Generated Action executable declarations match their commands, and both passing and induced-failure proof paths are tested.
- The packed minimal fixture and sanitized Billquest canary pass without modifying the live Billquest repository.

## Non-Goals

- Run real paired model evaluation or independent adjudication.
- Create or start additional Skill packs.

## Constraints

- Preserve unrelated dirty-worktree changes and do not alter Task T-db2a2a6c.

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `packages/cli/package.json`
- `packages/cli/src/__tests__/help-contract.test.ts`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/benchmarks/external-skill-portability.ts`
- `packages/cli/src/cli/commands/skills.ts`
- `packages/cli/src/cli/help.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Correct packed Product UI Craft portability proof debt" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Billquest capability bindings never satisfy accessibility proof with a non-accessibility command and explicitly report any unresolved accessibility adaptation gap. (closure, agent-observation)
- The portability harness always emits a machine-readable report with result pass or fail, failed stage, project, command when applicable, classified cause, partial successful evidence, and cleanup outcome. (closure, agent-observation)
- Installed CLI skills context and help contracts are explicitly Task-owned, tested, and included in the immutable closure snapshot. (closure, agent-observation)
- Containment claims distinguish observed project-contained writes from unobservable external writes and verify temporary-root cleanup plus forbidden links, dependencies, source references, and environment assistance. (closure, agent-observation)
- Generated Action executable declarations match their commands, and both passing and induced-failure proof paths are tested. (closure, agent-observation)
- The packed minimal fixture and sanitized Billquest canary pass without modifying the live Billquest repository. (closure, agent-observation)
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
  "id": "T-6d37da41",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T21:53:58.788Z",
  "updatedAt": "2026-08-04T22:41:13.503Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Correct packed Product UI Craft portability proof debt",
  "goal": "Correct packed Product UI Craft portability proof debt",
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
      "Billquest capability bindings never satisfy accessibility proof with a non-accessibility command and explicitly report any unresolved accessibility adaptation gap.",
      "The portability harness always emits a machine-readable report with result pass or fail, failed stage, project, command when applicable, classified cause, partial successful evidence, and cleanup outcome.",
      "Installed CLI skills context and help contracts are explicitly Task-owned, tested, and included in the immutable closure snapshot.",
      "Containment claims distinguish observed project-contained writes from unobservable external writes and verify temporary-root cleanup plus forbidden links, dependencies, source references, and environment assistance.",
      "Generated Action executable declarations match their commands, and both passing and induced-failure proof paths are tested.",
      "The packed minimal fixture and sanitized Billquest canary pass without modifying the live Billquest repository."
    ],
    "nonGoals": [
      "Run real paired model evaluation or independent adjudication.",
      "Create or start additional Skill packs."
    ],
    "constraints": [
      "Preserve unrelated dirty-worktree changes and do not alter Task T-db2a2a6c."
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-7e6c3437f54e7533"
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
      "detail": "Carry out \"Correct packed Product UI Craft portability proof debt\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/benchmarks/external-skill-portability.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/help-contract.test.ts",
        "packages/cli/src/cli/commands/skills.ts",
        "packages/cli/src/cli/help.ts",
        "packages/cli/package.json"
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
      "acceptanceCriterion": "Billquest capability bindings never satisfy accessibility proof with a non-accessibility command and explicitly report any unresolved accessibility adaptation gap.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The portability harness always emits a machine-readable report with result pass or fail, failed stage, project, command when applicable, classified cause, partial successful evidence, and cleanup outcome.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Installed CLI skills context and help contracts are explicitly Task-owned, tested, and included in the immutable closure snapshot.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Containment claims distinguish observed project-contained writes from unobservable external writes and verify temporary-root cleanup plus forbidden links, dependencies, source references, and environment assistance.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Generated Action executable declarations match their commands, and both passing and induced-failure proof paths are tested.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-6",
      "acceptanceCriterion": "The packed minimal fixture and sanitized Billquest canary pass without modifying the live Billquest repository.",
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
      "resolutionReason": "Decision 040, the active Skill Finding, and the Skill Plan now state the corrected failure-report, containment, installed-CLI provenance, and Billquest accessibility limitations.",
      "resolvedAt": "2026-08-04T22:39:13.877Z",
      "resolvedByActorId": "codex-skill-portability"
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
      "resolvedAt": "2026-08-04T21:54:11.217Z",
      "resolvedByActorId": "codex-skill-portability"
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
    "packages/cli/package.json",
    "packages/cli/src/__tests__/help-contract.test.ts",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/benchmarks/external-skill-portability.ts",
    "packages/cli/src/cli/commands/skills.ts",
    "packages/cli/src/cli/help.ts"
  ]
}
```
<!-- skopos:task-state:end -->
