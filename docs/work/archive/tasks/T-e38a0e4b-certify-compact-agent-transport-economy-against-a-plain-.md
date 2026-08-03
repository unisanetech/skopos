---
title: "Task: Certify compact agent transport economy against a plain-agent baseline"
status: complete
owner: "codex-skopos-benchmark"
id: T-e38a0e4b
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Certify compact agent transport economy against a plain-agent baseline

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Certify compact agent transport economy against a plain-agent baseline

## Acceptance

- A reproducible benchmark reports p50 and p95 context bytes, tool calls, reusable Evidence links, repeated executions, and time-to-next-correct-action across Session, Task, Verify, Readiness, Impact, Work Queue, and Action flows
- The benchmark baseline and fixture methodology are explicit and deterministic enough to compare without claiming production token telemetry
- The active transport-economy Finding is resolved only if every acceptance criterion has measured proof

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
- `docs/findings/F-20260803-evidence-reuse-and-agent-transport-economy-gap.md`
- `docs/reference/generated/agent-transport-economy-benchmark.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `package.json`
- `packages/cli/package.json`
- `packages/cli/scripts/agent-transport-economy.mjs`
- `packages/cli/src/__tests__/agent-transport-economy.test.ts`
- `packages/cli/src/benchmarks/agent-transport-economy.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Certify compact agent transport economy against a plain-agent baseline" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- A reproducible benchmark reports p50 and p95 context bytes, tool calls, reusable Evidence links, repeated executions, and time-to-next-correct-action across Session, Task, Verify, Readiness, Impact, Work Queue, and Action flows (closure, agent-observation)
- The benchmark baseline and fixture methodology are explicit and deterministic enough to compare without claiming production token telemetry (closure, agent-observation)
- The active transport-economy Finding is resolved only if every acceptance criterion has measured proof (closure, agent-observation)
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
  "id": "T-e38a0e4b",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T14:49:58.073Z",
  "updatedAt": "2026-08-03T15:00:25.535Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Certify compact agent transport economy against a plain-agent baseline",
  "goal": "Certify compact agent transport economy against a plain-agent baseline",
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
      "A reproducible benchmark reports p50 and p95 context bytes, tool calls, reusable Evidence links, repeated executions, and time-to-next-correct-action across Session, Task, Verify, Readiness, Impact, Work Queue, and Action flows",
      "The benchmark baseline and fixture methodology are explicit and deterministic enough to compare without claiming production token telemetry",
      "The active transport-economy Finding is resolved only if every acceptance criterion has measured proof"
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
      "detail": "Carry out \"Certify compact agent transport economy against a plain-agent baseline\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/benchmarks/agent-transport-economy.ts",
        "packages/cli/src/__tests__/agent-transport-economy.test.ts",
        "packages/cli/scripts/agent-transport-economy.mjs",
        "package.json",
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
      "acceptanceCriterion": "A reproducible benchmark reports p50 and p95 context bytes, tool calls, reusable Evidence links, repeated executions, and time-to-next-correct-action across Session, Task, Verify, Readiness, Impact, Work Queue, and Action flows",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The benchmark baseline and fixture methodology are explicit and deterministic enough to compare without claiming production token telemetry",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The active transport-economy Finding is resolved only if every acceptance criterion has measured proof",
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
      "resolutionReason": "Decision 024 now defines the reproducible plain-agent baseline, benchmark metrics, timing limitations, generated report authority, and regeneration command.",
      "resolvedAt": "2026-08-03T14:58:12.555Z",
      "resolvedByActorId": "codex-skopos-benchmark"
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
      "resolvedAt": "2026-08-03T14:50:07.402Z",
      "resolvedByActorId": "codex-skopos-benchmark"
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
    "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
    "docs/findings/F-20260803-evidence-reuse-and-agent-transport-economy-gap.md",
    "docs/reference/generated/agent-transport-economy-benchmark.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "package.json",
    "packages/cli/package.json",
    "packages/cli/scripts/agent-transport-economy.mjs",
    "packages/cli/src/__tests__/agent-transport-economy.test.ts",
    "packages/cli/src/benchmarks/agent-transport-economy.ts"
  ]
}
```
<!-- skopos:task-state:end -->
