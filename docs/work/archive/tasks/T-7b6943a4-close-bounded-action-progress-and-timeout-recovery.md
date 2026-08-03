---
title: "Task: Close bounded Action progress and timeout recovery"
status: complete
owner: "codex-skopos-progress"
id: T-7b6943a4
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-08-03
---

# Task: Close bounded Action progress and timeout recovery

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Close bounded Action progress and timeout recovery

## Acceptance

- Long-running Actions emit concise bounded phase progress without flooding output.
- Timed-out Actions record completed, interrupted, and remaining phases as durable run Evidence.
- Session Context points an active Task to the exact interrupted Action resume command.
- Focused runtime and CLI tests prove timeout recovery and bounded progress behavior.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/architecture/evidence-and-readiness-model.md`
- `docs/findings/F-20260627-validation-lane-progress-timeout-gap.md`
- `docs/standards/validation.md`
- `packages/cli/src/__tests__/action-progress-timeout.test.ts`
- `packages/cli/src/cli/commands/actions.ts`
- `packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts`
- `packages/indexer/src/application/load-action-manifests/load-action-manifests.service.ts`
- `packages/model/src/contracts/skopos-action.ts`
- `packages/model/src/contracts/skopos-session-context.ts`
- `packages/runtime/src/application/actions/actions.service.ts`
- `packages/runtime/src/application/session/session-context.service.ts`
- `packages/runtime/src/application/shared/execute-shell-command.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Close bounded Action progress and timeout recovery" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Long-running Actions emit concise bounded phase progress without flooding output. (closure, agent-observation)
- Timed-out Actions record completed, interrupted, and remaining phases as durable run Evidence. (closure, agent-observation)
- Session Context points an active Task to the exact interrupted Action resume command. (closure, agent-observation)
- Focused runtime and CLI tests prove timeout recovery and bounded progress behavior. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/evidence-and-readiness-model.md`); resolution: memory-updated
- [complete] standard: The declared Task scope owns canonical standard Memory at docs/standards/validation.md; review and synchronize it if project truth changes. (target: `docs/standards/validation.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-7b6943a4",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T15:51:32.964Z",
  "updatedAt": "2026-08-03T16:07:46.785Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Close bounded Action progress and timeout recovery",
  "goal": "Close bounded Action progress and timeout recovery",
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
      "Long-running Actions emit concise bounded phase progress without flooding output.",
      "Timed-out Actions record completed, interrupted, and remaining phases as durable run Evidence.",
      "Session Context points an active Task to the exact interrupted Action resume command.",
      "Focused runtime and CLI tests prove timeout recovery and bounded progress behavior."
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
      "detail": "Carry out \"Close bounded Action progress and timeout recovery\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/model/src/contracts/skopos-action.ts",
        "packages/model/src/contracts/skopos-session-context.ts",
        "packages/indexer/src/application/load-action-manifests/load-action-manifests.service.ts",
        "packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts",
        "packages/runtime/src/application/shared/execute-shell-command.ts",
        "packages/runtime/src/application/actions/actions.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts",
        "packages/cli/src/cli/commands/actions.ts",
        "packages/cli/src/__tests__/action-progress-timeout.test.ts"
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
      "acceptanceCriterion": "Long-running Actions emit concise bounded phase progress without flooding output.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Timed-out Actions record completed, interrupted, and remaining phases as durable run Evidence.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Session Context points an active Task to the exact interrupted Action resume command.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused runtime and CLI tests prove timeout recovery and bounded progress behavior.",
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
      "id": "memory-architecture-579535b5d3",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/evidence-and-readiness-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Evidence architecture now defines bounded progress, interruption phase state, and Task resume behavior.",
      "resolvedAt": "2026-08-03T16:07:21.932Z",
      "resolvedByActorId": "codex-skopos-progress"
    },
    {
      "id": "memory-standard-5f2d58a335",
      "role": "standard",
      "reason": "The declared Task scope owns canonical standard Memory at docs/standards/validation.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/standards/validation.md",
      "resolution": "memory-updated",
      "resolutionReason": "Validation standard now requires manifest timeouts, sparse progress, structured interruption Evidence, and stdout-safe JSON transport.",
      "resolvedAt": "2026-08-03T16:07:27.900Z",
      "resolvedByActorId": "codex-skopos-progress"
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
      "resolvedAt": "2026-08-03T15:52:27.414Z",
      "resolvedByActorId": "codex-skopos-progress"
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
    "docs/architecture/evidence-and-readiness-model.md",
    "docs/findings/F-20260627-validation-lane-progress-timeout-gap.md",
    "docs/standards/validation.md",
    "packages/cli/src/__tests__/action-progress-timeout.test.ts",
    "packages/cli/src/cli/commands/actions.ts",
    "packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts",
    "packages/indexer/src/application/load-action-manifests/load-action-manifests.service.ts",
    "packages/model/src/contracts/skopos-action.ts",
    "packages/model/src/contracts/skopos-session-context.ts",
    "packages/runtime/src/application/actions/actions.service.ts",
    "packages/runtime/src/application/session/session-context.service.ts",
    "packages/runtime/src/application/shared/execute-shell-command.ts"
  ]
}
```
<!-- skopos:task-state:end -->
