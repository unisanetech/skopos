---
title: "Task: Bound Work Queue Impact and Action catalog transport with deterministic cursors"
status: complete
owner: "codex-skopos-bounded-transport"
id: T-b6ac9cb9
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Bound Work Queue Impact and Action catalog transport with deterministic cursors

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Bound Work Queue Impact and Action catalog transport with deterministic cursors

## Acceptance

- Work Queue Impact and Action list default JSON never emits an unbounded collection
- Opaque deterministic cursors retrieve every entry without duplication or loss
- Page limits are validated capped and reported with total and next cursor
- Representative p50 and p95 compact payloads remain below the declared 32 KiB budget

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
- `docs/findings/F-20260803-evidence-reuse-and-agent-transport-economy-gap.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__/bounded-collection-output.test.ts`
- `packages/cli/src/cli/commands/actions.ts`
- `packages/cli/src/cli/commands/impact.ts`
- `packages/cli/src/cli/commands/work.ts`
- `packages/cli/src/cli/help.ts`
- `packages/cli/src/cli/shared/pagination.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Does this plan require choosing or replacing a provider or vendor integration?** (decision, complete) — Provider choices carry cost, lock-in, and operational tradeoffs that the agent should not invent.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Bound Work Queue Impact and Action catalog transport with deterministic cursors" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Work Queue Impact and Action list default JSON never emits an unbounded collection (closure, agent-observation)
- Opaque deterministic cursors retrieve every entry without duplication or loss (closure, agent-observation)
- Page limits are validated capped and reported with total and next cursor (closure, agent-observation)
- Representative p50 and p95 compact payloads remain below the declared 32 KiB budget (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes. (target: `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-b6ac9cb9",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T14:17:08.845Z",
  "updatedAt": "2026-08-03T14:24:47.855Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Bound Work Queue Impact and Action catalog transport with deterministic cursors",
  "goal": "Bound Work Queue Impact and Action catalog transport with deterministic cursors",
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
      "Work Queue Impact and Action list default JSON never emits an unbounded collection",
      "Opaque deterministic cursors retrieve every entry without duplication or loss",
      "Page limits are validated capped and reported with total and next cursor",
      "Representative p50 and p95 compact payloads remain below the declared 32 KiB budget"
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
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
      "id": "decision-plan.vendor-choice",
      "kind": "decision",
      "title": "Does this plan require choosing or replacing a provider or vendor integration?",
      "detail": "Provider choices carry cost, lock-in, and operational tradeoffs that the agent should not invent.",
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
      "detail": "Carry out \"Bound Work Queue Impact and Action catalog transport with deterministic cursors\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/cli/shared/pagination.ts",
        "packages/cli/src/cli/commands/work.ts",
        "packages/cli/src/cli/commands/impact.ts",
        "packages/cli/src/cli/commands/actions.ts",
        "packages/cli/src/cli/help.ts",
        "packages/cli/src/__tests__/bounded-collection-output.test.ts"
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
      "acceptanceCriterion": "Work Queue Impact and Action list default JSON never emits an unbounded collection",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Opaque deterministic cursors retrieve every entry without duplication or loss",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Page limits are validated capped and reported with total and next cursor",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Representative p50 and p95 compact payloads remain below the declared 32 KiB budget",
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
      "id": "memory-decision-7f31a96932",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the compact transport Decision with the shared page size, hard cap, opaque collection-bound cursor grammar, stable page metadata, and 32 KiB p50/p95 budget.",
      "resolvedAt": "2026-08-03T14:23:57.455Z",
      "resolvedByActorId": "codex-skopos-bounded-transport"
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
      "resolvedOptionId": "narrow-scope-first",
      "resolvedAt": "2026-08-03T14:17:19.796Z",
      "resolvedByActorId": "codex-skopos-bounded-transport"
    },
    {
      "id": "plan.vendor-choice",
      "category": "provider",
      "escalation": "must-ask",
      "question": "Does this plan require choosing or replacing a provider or vendor integration?",
      "whyItMatters": "Provider choices carry cost, lock-in, and operational tradeoffs that the agent should not invent.",
      "recommendedOptionId": "stay-with-current-provider",
      "options": [
        {
          "id": "stay-with-current-provider",
          "label": "Stay with current provider",
          "rationale": "Recommended unless there is a clear user decision to switch providers."
        },
        {
          "id": "approve-provider-change",
          "label": "Approve provider change",
          "rationale": "Use when the migration is intentional and the tradeoffs are accepted."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "stay-with-current-provider",
      "resolvedAt": "2026-08-03T14:24:26.540Z",
      "resolvedByActorId": "codex-skopos-bounded-transport"
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
      "id": "resolve-plan.vendor-choice",
      "title": "Resolve: Does this plan require choosing or replacing a provider or vendor integration?",
      "summary": "Provider choices carry cost, lock-in, and operational tradeoffs that the agent should not invent.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.vendor-choice",
      "blocking": true,
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
    "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
    "docs/findings/F-20260803-evidence-reuse-and-agent-transport-economy-gap.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/cli/src/__tests__/bounded-collection-output.test.ts",
    "packages/cli/src/cli/commands/actions.ts",
    "packages/cli/src/cli/commands/impact.ts",
    "packages/cli/src/cli/commands/work.ts",
    "packages/cli/src/cli/help.ts",
    "packages/cli/src/cli/shared/pagination.ts"
  ]
}
```
<!-- skopos:task-state:end -->
