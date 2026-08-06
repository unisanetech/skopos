---
title: "Task: Prove Product UI Craft portability from packed Skopos artifacts in clean external projects"
status: complete
owner: "codex-skill-portability"
id: T-3966f1c4
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-b3402311a413f531
lastUpdated: 2026-08-04
---

# Task: Prove Product UI Craft portability from packed Skopos artifacts in clean external projects

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Prove Product UI Craft portability from packed Skopos artifacts in clean external projects

## Acceptance

- A minimal generated external fixture installs only packed Skopos artifacts and declared dependencies, then proves initialization, Skill discovery, relevant and irrelevant selection, binding, all six deterministic fixtures, module-local capabilities, host projections, exact reuse, invalidation, and artifact containment
- A sanitized temporary copy of the Billquest project proves truthful UI Task recommendation, binding, selection, and host projection without modifying the live project
- The proof rejects workspace links, source-checkout imports, NODE_PATH, source symlinks, undeclared monorepo resolution, and artifacts outside each external project
- A compact machine-readable report separates Skopos portability, project adaptation, and external-project failures and records package identities, roots, commands, results, and containment checks
- Task-selected Actions and Guards provide fresh source-bound Evidence and Readiness closes with no missing Evidence

## Non-Goals

- Do not start new Skill packs, run paid model evaluation, or create a duplicate installer or evidence authority

## Constraints

- Do not modify the live Billquest working copy
- Do not weaken exact acceptance, fixture gates, capability locality, or source identity

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `package.json`
- `packages/cli/package.json`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/benchmarks`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Prove Product UI Craft portability from packed Skopos artifacts in clean external projects" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- A minimal generated external fixture installs only packed Skopos artifacts and declared dependencies, then proves initialization, Skill discovery, relevant and irrelevant selection, binding, all six deterministic fixtures, module-local capabilities, host projections, exact reuse, invalidation, and artifact containment (closure, agent-observation)
- A sanitized temporary copy of the Billquest project proves truthful UI Task recommendation, binding, selection, and host projection without modifying the live project (closure, agent-observation)
- The proof rejects workspace links, source-checkout imports, NODE_PATH, source symlinks, undeclared monorepo resolution, and artifacts outside each external project (closure, agent-observation)
- A compact machine-readable report separates Skopos portability, project adaptation, and external-project failures and records package identities, roots, commands, results, and containment checks (closure, agent-observation)
- Task-selected Actions and Guards provide fresh source-bound Evidence and Readiness closes with no missing Evidence (closure, agent-observation)
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
  "id": "T-3966f1c4",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T21:04:28.999Z",
  "updatedAt": "2026-08-04T21:30:10.600Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Prove Product UI Craft portability from packed Skopos artifacts in clean external projects",
  "goal": "Prove Product UI Craft portability from packed Skopos artifacts in clean external projects",
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
      "A minimal generated external fixture installs only packed Skopos artifacts and declared dependencies, then proves initialization, Skill discovery, relevant and irrelevant selection, binding, all six deterministic fixtures, module-local capabilities, host projections, exact reuse, invalidation, and artifact containment",
      "A sanitized temporary copy of the Billquest project proves truthful UI Task recommendation, binding, selection, and host projection without modifying the live project",
      "The proof rejects workspace links, source-checkout imports, NODE_PATH, source symlinks, undeclared monorepo resolution, and artifacts outside each external project",
      "A compact machine-readable report separates Skopos portability, project adaptation, and external-project failures and records package identities, roots, commands, results, and containment checks",
      "Task-selected Actions and Guards provide fresh source-bound Evidence and Readiness closes with no missing Evidence"
    ],
    "nonGoals": [
      "Do not start new Skill packs, run paid model evaluation, or create a duplicate installer or evidence authority"
    ],
    "constraints": [
      "Do not modify the live Billquest working copy",
      "Do not weaken exact acceptance, fixture gates, capability locality, or source identity"
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-b3402311a413f531"
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
      "detail": "Carry out \"Prove Product UI Craft portability from packed Skopos artifacts in clean external projects\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/benchmarks",
        "packages/cli/package.json",
        "package.json"
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
      "acceptanceCriterion": "A minimal generated external fixture installs only packed Skopos artifacts and declared dependencies, then proves initialization, Skill discovery, relevant and irrelevant selection, binding, all six deterministic fixtures, module-local capabilities, host projections, exact reuse, invalidation, and artifact containment",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A sanitized temporary copy of the Billquest project proves truthful UI Task recommendation, binding, selection, and host projection without modifying the live project",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The proof rejects workspace links, source-checkout imports, NODE_PATH, source symlinks, undeclared monorepo resolution, and artifacts outside each external project",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "A compact machine-readable report separates Skopos portability, project adaptation, and external-project failures and records package identities, roots, commands, results, and containment checks",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Task-selected Actions and Guards provide fresh source-bound Evidence and Readiness closes with no missing Evidence",
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
      "resolutionReason": "Decision 040, the active Skill Finding, and the Skill Plan now record verified packed external portability while preserving real-model efficacy and independent adjudication as open risks.",
      "resolvedAt": "2026-08-04T21:26:29.160Z",
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
      "resolvedAt": "2026-08-04T21:04:48.507Z",
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
    "package.json",
    "packages/cli/package.json",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/benchmarks"
  ]
}
```
<!-- skopos:task-state:end -->
