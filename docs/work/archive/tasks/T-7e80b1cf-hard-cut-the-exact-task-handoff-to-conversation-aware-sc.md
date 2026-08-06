---
title: "Task: Hard-cut the exact Task handoff to conversation-aware schemaVersion 1 semantics"
status: complete
owner: "codex-continuation-implementation"
id: T-7e80b1cf
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-945651e221bf3fa2
lastUpdated: 2026-08-04
---

# Task: Hard-cut the exact Task handoff to conversation-aware schemaVersion 1 semantics

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Hard-cut the exact Task handoff to conversation-aware schemaVersion 1 semantics

## Acceptance

- The handoff schema requires a bounded classified agent-authored conversation capsule and compiled live-state provenance
- Create, refresh, show, verify, accept, and prompt rendering share one runtime owner with CLI and MCP parity
- Freshness, privacy, budget, and unsafe coordination outcomes are explicit and machine-readable
- No shallow handoff constructor, compatibility reader, alias, or second continuation authority remains

## Non-Goals

- Host-specific fresh task creation or delivery
- UI mutation authority

## Constraints

- Preserve schemaVersion 1 under the pre-release clean hard cut
- Reuse Task, Session, Evidence, Readiness, claim, mutation, and recovery authorities

## Owned Paths

- `packages/cli/src/__tests__/discussion-continuation.test.ts`
- `packages/cli/src/__tests__/mcp-server-contract.test.ts`
- `packages/cli/src/cli/commands/discussion.ts`
- `packages/cli/src/cli/help.ts`
- `packages/cli/src/cli/index.ts`
- `packages/mcp/src/index.ts`
- `packages/model/src/contracts/skopos-discussion-memory.ts`
- `packages/model/src/contracts/skopos-discussion.ts`
- `packages/model/src/index.ts`
- `packages/runtime/src/application/discussion/discussion.service.ts`
- `packages/runtime/src/application/shared/discussion-handoff.ts`
- `packages/runtime/src/application/shared/discussion-lifecycle.ts`
- `packages/runtime/src/index.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Hard-cut the exact Task handoff to conversation-aware schemaVersion 1 semantics" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- The handoff schema requires a bounded classified agent-authored conversation capsule and compiled live-state provenance (closure, agent-observation)
- Create, refresh, show, verify, accept, and prompt rendering share one runtime owner with CLI and MCP parity (closure, agent-observation)
- Freshness, privacy, budget, and unsafe coordination outcomes are explicit and machine-readable (closure, agent-observation)
- No shallow handoff constructor, compatibility reader, alias, or second continuation authority remains (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-7e80b1cf",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T23:11:10.942Z",
  "updatedAt": "2026-08-04T23:22:26.853Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Hard-cut the exact Task handoff to conversation-aware schemaVersion 1 semantics",
  "goal": "Hard-cut the exact Task handoff to conversation-aware schemaVersion 1 semantics",
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
      "The handoff schema requires a bounded classified agent-authored conversation capsule and compiled live-state provenance",
      "Create, refresh, show, verify, accept, and prompt rendering share one runtime owner with CLI and MCP parity",
      "Freshness, privacy, budget, and unsafe coordination outcomes are explicit and machine-readable",
      "No shallow handoff constructor, compatibility reader, alias, or second continuation authority remains"
    ],
    "nonGoals": [
      "Host-specific fresh task creation or delivery",
      "UI mutation authority"
    ],
    "constraints": [
      "Preserve schemaVersion 1 under the pre-release clean hard cut",
      "Reuse Task, Session, Evidence, Readiness, claim, mutation, and recovery authorities"
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-945651e221bf3fa2"
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
      "id": "decision-plan.public-api-change",
      "kind": "decision",
      "title": "Should this plan change a public contract, route, or SDK surface?",
      "detail": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
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
      "detail": "Carry out \"Hard-cut the exact Task handoff to conversation-aware schemaVersion 1 semantics\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/model/src/contracts/skopos-discussion-memory.ts",
        "packages/model/src/contracts/skopos-discussion.ts",
        "packages/model/src/index.ts",
        "packages/runtime/src/application/shared/discussion-handoff.ts",
        "packages/runtime/src/application/shared/discussion-lifecycle.ts",
        "packages/runtime/src/application/discussion/discussion.service.ts",
        "packages/runtime/src/index.ts",
        "packages/cli/src/cli/commands/discussion.ts",
        "packages/cli/src/cli/help.ts",
        "packages/cli/src/cli/index.ts",
        "packages/mcp/src/index.ts",
        "packages/cli/src/__tests__/discussion-continuation.test.ts",
        "packages/cli/src/__tests__/mcp-server-contract.test.ts"
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
      "acceptanceCriterion": "The handoff schema requires a bounded classified agent-authored conversation capsule and compiled live-state provenance",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Create, refresh, show, verify, accept, and prompt rendering share one runtime owner with CLI and MCP parity",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Freshness, privacy, budget, and unsafe coordination outcomes are explicit and machine-readable",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "No shallow handoff constructor, compatibility reader, alias, or second continuation authority remains",
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
  "memoryObligations": [],
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
      "resolvedAt": "2026-08-04T23:11:25.126Z",
      "resolvedByActorId": "codex-continuation-implementation"
    },
    {
      "id": "plan.public-api-change",
      "category": "public-api",
      "escalation": "must-ask",
      "question": "Should this plan change a public contract, route, or SDK surface?",
      "whyItMatters": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "recommendedOptionId": "confirm-contract-first",
      "options": [
        {
          "id": "confirm-contract-first",
          "label": "Confirm contract first",
          "rationale": "Recommended because contract decisions should be explicit before implementation starts."
        },
        {
          "id": "internal-only-change",
          "label": "Keep change internal",
          "rationale": "Use this when the goal should not affect public behavior or external consumers."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "confirm-contract-first",
      "resolvedAt": "2026-08-04T23:11:26.618Z",
      "resolvedByActorId": "codex-continuation-implementation"
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
      "id": "resolve-plan.public-api-change",
      "title": "Resolve: Should this plan change a public contract, route, or SDK surface?",
      "summary": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.public-api-change",
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
    "packages/cli/src/__tests__/discussion-continuation.test.ts",
    "packages/cli/src/__tests__/mcp-server-contract.test.ts",
    "packages/cli/src/cli/commands/discussion.ts",
    "packages/cli/src/cli/help.ts",
    "packages/cli/src/cli/index.ts",
    "packages/mcp/src/index.ts",
    "packages/model/src/contracts/skopos-discussion-memory.ts",
    "packages/model/src/contracts/skopos-discussion.ts",
    "packages/model/src/index.ts",
    "packages/runtime/src/application/discussion/discussion.service.ts",
    "packages/runtime/src/application/shared/discussion-handoff.ts",
    "packages/runtime/src/application/shared/discussion-lifecycle.ts",
    "packages/runtime/src/index.ts"
  ]
}
```
<!-- skopos:task-state:end -->
