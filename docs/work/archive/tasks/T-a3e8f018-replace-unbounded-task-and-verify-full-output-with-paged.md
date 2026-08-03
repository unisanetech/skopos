---
title: "Task: Replace unbounded Task and Verify full output with paged detail collections"
status: complete
owner: "codex-skopos-diagnostic-transport"
id: T-a3e8f018
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Replace unbounded Task and Verify full output with paged detail collections

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Replace unbounded Task and Verify full output with paged detail collections

## Acceptance

- Task show and Verify default JSON cap every identifier summary collection
- Task and Verify detail collections are retrievable with collection-bound cursors
- Full output returns a bounded detail index with exact follow-up commands rather than an unlimited payload
- Blockers remain inline in compact Verify output and representative p95 payloads stay below 32 KiB

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
- `docs/findings/F-20260803-evidence-reuse-and-agent-transport-economy-gap.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__/bounded-task-verification-output.test.ts`
- `packages/cli/src/cli/commands/task.ts`
- `packages/cli/src/cli/commands/verification.ts`
- `packages/cli/src/cli/help.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Does this plan require a destructive rename, removal, or migration path?** (decision, complete) — Destructive changes need an explicit cutover strategy instead of an implicit agent decision.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Replace unbounded Task and Verify full output with paged detail collections" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Task show and Verify default JSON cap every identifier summary collection (closure, agent-observation)
- Task and Verify detail collections are retrievable with collection-bound cursors (closure, agent-observation)
- Full output returns a bounded detail index with exact follow-up commands rather than an unlimited payload (closure, agent-observation)
- Blockers remain inline in compact Verify output and representative p95 payloads stay below 32 KiB (closure, agent-observation)
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
  "id": "T-a3e8f018",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T14:25:44.486Z",
  "updatedAt": "2026-08-03T14:32:28.210Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Replace unbounded Task and Verify full output with paged detail collections",
  "goal": "Replace unbounded Task and Verify full output with paged detail collections",
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
      "Task show and Verify default JSON cap every identifier summary collection",
      "Task and Verify detail collections are retrievable with collection-bound cursors",
      "Full output returns a bounded detail index with exact follow-up commands rather than an unlimited payload",
      "Blockers remain inline in compact Verify output and representative p95 payloads stay below 32 KiB"
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
      "id": "decision-plan.destructive-migration",
      "kind": "decision",
      "title": "Does this plan require a destructive rename, removal, or migration path?",
      "detail": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
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
      "detail": "Carry out \"Replace unbounded Task and Verify full output with paged detail collections\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/cli/commands/task.ts",
        "packages/cli/src/cli/commands/verification.ts",
        "packages/cli/src/cli/help.ts",
        "packages/cli/src/__tests__/bounded-task-verification-output.test.ts"
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
      "acceptanceCriterion": "Task show and Verify default JSON cap every identifier summary collection",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Task and Verify detail collections are retrievable with collection-bound cursors",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Full output returns a bounded detail index with exact follow-up commands rather than an unlimited payload",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Blockers remain inline in compact Verify output and representative p95 payloads stay below 32 KiB",
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
      "resolutionReason": "Updated the compact transport Decision with bounded Task/Verify detail indexes, capped diagnostic summaries, shared cursor retrieval, and inline blocker preservation.",
      "resolvedAt": "2026-08-03T14:31:34.902Z",
      "resolvedByActorId": "codex-skopos-diagnostic-transport"
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
      "resolvedAt": "2026-08-03T14:25:59.351Z",
      "resolvedByActorId": "codex-skopos-diagnostic-transport"
    },
    {
      "id": "plan.destructive-migration",
      "category": "migration",
      "escalation": "must-ask",
      "question": "Does this plan require a destructive rename, removal, or migration path?",
      "whyItMatters": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
      "recommendedOptionId": "stage-the-change",
      "options": [
        {
          "id": "stage-the-change",
          "label": "Stage the change",
          "rationale": "Recommended because staged rollouts reduce drift and make Readiness easier to reason about."
        },
        {
          "id": "hard-cutover",
          "label": "Hard cutover",
          "rationale": "Use only when an immediate break is intentional and fully understood."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "hard-cutover",
      "resolvedAt": "2026-08-03T14:32:03.676Z",
      "resolvedByActorId": "codex-skopos-diagnostic-transport"
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
      "id": "resolve-plan.destructive-migration",
      "title": "Resolve: Does this plan require a destructive rename, removal, or migration path?",
      "summary": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.destructive-migration",
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
    "packages/cli/src/__tests__/bounded-task-verification-output.test.ts",
    "packages/cli/src/cli/commands/task.ts",
    "packages/cli/src/cli/commands/verification.ts",
    "packages/cli/src/cli/help.ts"
  ]
}
```
<!-- skopos:task-state:end -->
