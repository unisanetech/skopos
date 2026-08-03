---
title: "Task: Complete Session recovery and Task disposition parity"
status: complete
owner: "codex-skopos-recovery"
id: T-93c7a3fc
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Complete Session recovery and Task disposition parity

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Complete Session recovery and Task disposition parity

## Acceptance

- A live actor can recover an expired running Action into an interrupted resumable artifact, while active execution remains protected.
- Stale Session Task recovery fails closed until every running Action for that Task is reconciled.
- CLI and MCP expose the same Action recovery, coordination recovery, and Task disposition runtime authorities.
- The read-only UI reports exact disposition kind, reason, actor, time, and successor without adding a second mutation path.
- Crash, Git mutation, concurrency, MCP, Session Context, and UI fixtures pass.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/architecture/agent-native-operating-model.md`
- `docs/decisions/D-20260803-audited-stale-session-task-recovery.md`
- `docs/decisions/D-20260803-explicit-task-work-disposition-state-machine.md`
- `docs/findings/F-20260803-session-task-recovery-and-disposition-gap.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `packages/cli/src/__tests__/action-crash-recovery.test.ts`
- `packages/cli/src/__tests__/coordination-broker.test.ts`
- `packages/cli/src/__tests__/mcp-server-contract.test.ts`
- `packages/cli/src/__tests__/task-disposition.test.ts`
- `packages/cli/src/cli/commands/actions.ts`
- `packages/cli/src/cli/help.ts`
- `packages/mcp/src/index.ts`
- `packages/model/src/contracts/skopos-action.ts`
- `packages/runtime/src/application/actions/actions.service.ts`
- `packages/runtime/src/application/coordination/coordination.service.ts`
- `packages/ui/src/__tests__/console-app.test.tsx`
- `packages/ui/src/features/work/task-detail/content.tsx`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Complete Session recovery and Task disposition parity" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.
- [x] **Build routed Skopos console app** (action, complete) — Required by Guard ui.console-build.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.build-console-app`: Required by Guard ui.console-build.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`
- Guard `ui.console-build`

## Evidence And Readiness

- A live actor can recover an expired running Action into an interrupted resumable artifact, while active execution remains protected. (closure, agent-observation)
- Stale Session Task recovery fails closed until every running Action for that Task is reconciled. (closure, agent-observation)
- CLI and MCP expose the same Action recovery, coordination recovery, and Task disposition runtime authorities. (closure, agent-observation)
- The read-only UI reports exact disposition kind, reason, actor, time, and successor without adding a second mutation path. (closure, agent-observation)
- Crash, Git mutation, concurrency, MCP, Session Context, and UI fixtures pass. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)
- Guard ui.console-build: Console changes require build Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-93c7a3fc",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T16:38:05.579Z",
  "updatedAt": "2026-08-03T16:52:39.472Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Complete Session recovery and Task disposition parity",
  "goal": "Complete Session recovery and Task disposition parity",
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
      "A live actor can recover an expired running Action into an interrupted resumable artifact, while active execution remains protected.",
      "Stale Session Task recovery fails closed until every running Action for that Task is reconciled.",
      "CLI and MCP expose the same Action recovery, coordination recovery, and Task disposition runtime authorities.",
      "The read-only UI reports exact disposition kind, reason, actor, time, and successor without adding a second mutation path.",
      "Crash, Git mutation, concurrency, MCP, Session Context, and UI fixtures pass."
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
      "detail": "Carry out \"Complete Session recovery and Task disposition parity\" inside the resolved scope before widening impact to adjacent areas.",
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
    },
    {
      "id": "action-ui.build-console-app",
      "kind": "action",
      "title": "Build routed Skopos console app",
      "detail": "Required by Guard ui.console-build.",
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
        "packages/model/src/contracts/skopos-action.ts",
        "packages/runtime/src/application/actions/actions.service.ts",
        "packages/runtime/src/application/coordination/coordination.service.ts",
        "packages/cli/src/cli/commands/actions.ts",
        "packages/cli/src/cli/help.ts",
        "packages/mcp/src/index.ts",
        "packages/ui/src/features/work/task-detail/content.tsx",
        "packages/cli/src/__tests__/action-crash-recovery.test.ts",
        "packages/cli/src/__tests__/coordination-broker.test.ts",
        "packages/cli/src/__tests__/task-disposition.test.ts",
        "packages/cli/src/__tests__/mcp-server-contract.test.ts",
        "packages/ui/src/__tests__/console-app.test.tsx"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "ui.build-console-app",
      "title": "Build routed Skopos console app",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-build-console-app.yaml",
      "reason": "Required by Guard ui.console-build.",
      "matchedPaths": [
        "packages/ui/src/features/work/task-detail/content.tsx",
        "packages/ui/src/__tests__/console-app.test.tsx"
      ],
      "outputPaths": [
        ".skopos/ui/app"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.focused-behavior-proof",
    "quality.typecheck",
    "ui.console-build"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "A live actor can recover an expired running Action into an interrupted resumable artifact, while active execution remains protected.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Stale Session Task recovery fails closed until every running Action for that Task is reconciled.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "CLI and MCP expose the same Action recovery, coordination recovery, and Task disposition runtime authorities.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The read-only UI reports exact disposition kind, reason, actor, time, and successor without adding a second mutation path.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Crash, Git mutation, concurrency, MCP, Session Context, and UI fixtures pass.",
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
    },
    {
      "id": "guard-ui.console-build",
      "acceptanceCriterion": "Guard ui.console-build: Console changes require build Evidence",
      "phase": "closure",
      "actionIds": [
        "ui.build-console-app"
      ],
      "guardIds": [
        "ui.console-build"
      ],
      "evidence": "source-bound-action"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Agent operating model now defines expired Action reconciliation, Task recovery blocking, CLI/MCP parity, and read-only UI disposition reporting.",
      "resolvedAt": "2026-08-03T16:52:10.411Z",
      "resolvedByActorId": "codex-skopos-recovery"
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
      "resolvedAt": "2026-08-03T16:38:15.991Z",
      "resolvedByActorId": "codex-skopos-recovery"
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
    },
    {
      "id": "run-ui.build-console-app",
      "title": "Build routed Skopos console app",
      "summary": "Required by Guard ui.console-build.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.build-console-app",
      "blocking": false,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/agent-native-operating-model.md",
    "docs/decisions/D-20260803-audited-stale-session-task-recovery.md",
    "docs/decisions/D-20260803-explicit-task-work-disposition-state-machine.md",
    "docs/findings/F-20260803-session-task-recovery-and-disposition-gap.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "packages/cli/src/__tests__/action-crash-recovery.test.ts",
    "packages/cli/src/__tests__/coordination-broker.test.ts",
    "packages/cli/src/__tests__/mcp-server-contract.test.ts",
    "packages/cli/src/__tests__/task-disposition.test.ts",
    "packages/cli/src/cli/commands/actions.ts",
    "packages/cli/src/cli/help.ts",
    "packages/mcp/src/index.ts",
    "packages/model/src/contracts/skopos-action.ts",
    "packages/runtime/src/application/actions/actions.service.ts",
    "packages/runtime/src/application/coordination/coordination.service.ts",
    "packages/ui/src/__tests__/console-app.test.tsx",
    "packages/ui/src/features/work/task-detail/content.tsx"
  ]
}
```
<!-- skopos:task-state:end -->
