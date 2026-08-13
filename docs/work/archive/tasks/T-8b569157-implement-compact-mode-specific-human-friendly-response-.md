---
title: "Task: Implement compact mode-specific human-friendly response guidance"
status: complete
owner: "codex-response-guidance-implementation"
id: T-8b569157
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-ffb164ee5a6b1e9d
lastUpdated: 2026-08-12
---

# Task: Implement compact mode-specific human-friendly response guidance

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Implement compact mode-specific human-friendly response guidance

## Acceptance

- One canonical compact communication contract includes simple-English and terminology-translation rules without duplicated authorities
- Session context renders only the selected response mode and material state, including a reachable completion mode
- Claude, Codex, Copilot, and manual projections use canonical artifact paths and semantic contract proof
- Focused tests prove response shapes and compact token budgets without a per-response model judge

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 4 non-workspace Scopes.

## Owned Paths

- `.cursor/rules/project.mdc`
- `.github/copilot-instructions.md`
- `AGENTS.md`
- `CLAUDE.md`
- `docs/findings/F-20260813-clean-checkout-setup-readiness-reconstruction-gap.md`
- `docs/work/tasks/T-ec263b6a-reconstruct-clean-checkout-adoption-readiness-from-track.md`
- `packages/cli/src/__tests__/session-context-contract.test.ts`
- `packages/instructions/src/application/communication-contract`
- `packages/instructions/src/application/scaffold-project-instructions`
- `packages/instructions/src/application/sync-claude-code-hook-adapter`
- `packages/instructions/src/application/sync-codex-wrapper-adapter`
- `packages/instructions/src/application/sync-manual-host-adapter`
- `packages/model/src/contracts/skopos-discussion.ts`
- `packages/model/src/contracts/skopos-session-context.ts`
- `packages/runtime/src/application/discussion/discussion.service.ts`
- `packages/runtime/src/application/session/session-context.service.ts`
- `packages/runtime/src/application/shared/current-task-state.ts`
- `packages/runtime/src/application/shared/memory-state.ts`
- `packages/runtime/src/application/shared/token-control-constants.ts`

## Ownership Expansions

- `2026-08-12T19:02:31.296Z` by `codex-response-guidance-implementation`: `packages/runtime/src/application/shared/current-task-state.ts` — Completion mode requires exact lookup of the latest completed Task for the current actor or Session.
- `2026-08-12T19:03:58.352Z` by `codex-response-guidance-implementation`: `.cursor/rules/project.mdc`, `.github/copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`, `packages/runtime/src/application/shared/token-control-constants.ts` — The canonical communication contract owns the generated brief path and must refresh every declared self-hosted instruction projection.
- `2026-08-12T19:07:50.906Z` by `codex-response-guidance-implementation`: `packages/model/src/contracts/skopos-discussion.ts`, `packages/runtime/src/application/discussion/discussion.service.ts` — Completion guidance is pending only while a completed Task is newer than the latest recorded assistant turn, avoiding stale completion mode in later Sessions.
- `2026-08-12T19:18:33.065Z` by `codex-response-guidance-implementation`: `docs/findings/F-20260813-clean-checkout-setup-readiness-reconstruction-gap.md`, `docs/work/tasks/T-ec263b6a-reconstruct-clean-checkout-adoption-readiness-from-track.md` — Record the separately scoped MUST finding and its dependency-gated follow-up Task discovered during this work without adopting that future implementation.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Implement compact mode-specific human-friendly response guidance" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Sync self-hosted instruction mirrors** (action, complete) — Required by Guard instructions.source-requires-sync.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `instructions.sync-mirrors`: Required by Guard instructions.source-requires-sync.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `instructions.source-requires-sync`
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- One canonical compact communication contract includes simple-English and terminology-translation rules without duplicated authorities (closure, agent-observation)
- Session context renders only the selected response mode and material state, including a reachable completion mode (closure, agent-observation)
- Claude, Codex, Copilot, and manual projections use canonical artifact paths and semantic contract proof (closure, agent-observation)
- Focused tests prove response shapes and compact token budgets without a per-response model judge (closure, agent-observation)
- Guard instructions.source-requires-sync: Instruction source changes require synchronized mirrors (closure, source-bound-action)
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
  "id": "T-8b569157",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T18:55:02.706Z",
  "updatedAt": "2026-08-12T19:21:47.221Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Implement compact mode-specific human-friendly response guidance",
  "goal": "Implement compact mode-specific human-friendly response guidance",
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
      "One canonical compact communication contract includes simple-English and terminology-translation rules without duplicated authorities",
      "Session context renders only the selected response mode and material state, including a reachable completion mode",
      "Claude, Codex, Copilot, and manual projections use canonical artifact paths and semantic contract proof",
      "Focused tests prove response shapes and compact token budgets without a per-response model judge"
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "Declared ownership affects 4 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 9,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-instructions",
        "skopos-model",
        "skopos-runtime"
      ],
      "impactCategories": [
        "scope-source"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-ffb164ee5a6b1e9d"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
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
      "detail": "Carry out \"Implement compact mode-specific human-friendly response guidance\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-instructions.sync-mirrors",
      "kind": "action",
      "title": "Sync self-hosted instruction mirrors",
      "detail": "Required by Guard instructions.source-requires-sync.",
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
      "id": "instructions.sync-mirrors",
      "title": "Sync self-hosted instruction mirrors",
      "category": "docs-generator",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/instructions-sync-mirrors.yaml",
      "reason": "Required by Guard instructions.source-requires-sync.",
      "matchedPaths": [
        "AGENTS.md"
      ],
      "outputPaths": [
        "AGENTS.md",
        "CLAUDE.md",
        ".cursor/rules/project.mdc",
        ".github/copilot-instructions.md"
      ],
      "requiresApproval": false
    },
    {
      "id": "quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "packages/cli/src/__tests__/session-context-contract.test.ts",
        "packages/instructions/src/application/communication-contract",
        "packages/instructions/src/application/scaffold-project-instructions",
        "packages/instructions/src/application/sync-claude-code-hook-adapter",
        "packages/instructions/src/application/sync-codex-wrapper-adapter",
        "packages/instructions/src/application/sync-manual-host-adapter",
        "packages/model/src/contracts/skopos-discussion.ts",
        "packages/model/src/contracts/skopos-session-context.ts",
        "packages/runtime/src/application/discussion/discussion.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts",
        "packages/runtime/src/application/shared/current-task-state.ts",
        "packages/runtime/src/application/shared/memory-state.ts",
        "packages/runtime/src/application/shared/token-control-constants.ts"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "instructions.source-requires-sync",
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "One canonical compact communication contract includes simple-English and terminology-translation rules without duplicated authorities",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Session context renders only the selected response mode and material state, including a reachable completion mode",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Claude, Codex, Copilot, and manual projections use canonical artifact paths and semantic contract proof",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused tests prove response shapes and compact token budgets without a per-response model judge",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-instructions.source-requires-sync",
      "acceptanceCriterion": "Guard instructions.source-requires-sync: Instruction source changes require synchronized mirrors",
      "phase": "closure",
      "actionIds": [
        "instructions.sync-mirrors"
      ],
      "guardIds": [
        "instructions.source-requires-sync"
      ],
      "evidence": "source-bound-action"
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
      "resolutionReason": "Canonical response transport and token targets are already recorded in Decision 024 and the agent-native operating model; the root architecture router needs no duplicate implementation detail.",
      "resolvedAt": "2026-08-12T19:19:23.258Z",
      "resolvedByActorId": "codex-response-guidance-implementation"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 4 times and new impact categories appeared (instruction-mirror, instruction-source, docs). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-8b569157' 'Continue Implement compact mode-specific human-friendly response guidance as bounded follow-up work' . --scope 'skopos' --own '.cursor/rules/project.mdc' --own '.github/copilot-instructions.md' --own 'AGENTS.md' --own 'CLAUDE.md' --own 'docs/findings/F-20260813-clean-checkout-setup-readiness-reconstruction-gap.md' --own 'docs/work/tasks/T-ec263b6a-reconstruct-clean-checkout-adoption-readiness-from-track.md' --own 'packages/model/src/contracts/skopos-discussion.ts' --own 'packages/runtime/src/application/discussion/discussion.service.ts' --own 'packages/runtime/src/application/shared/current-task-state.ts' --own 'packages/runtime/src/application/shared/token-control-constants.ts' --reason 'The Task may be drifting from its admitted subject because ownership expanded 4 times and new impact categories appeared (instruction-mirror, instruction-source, docs).' --actor 'codex-response-guidance-implementation'",
      "ownedPaths": [
        ".cursor/rules/project.mdc",
        ".github/copilot-instructions.md",
        "AGENTS.md",
        "CLAUDE.md",
        "docs/findings/F-20260813-clean-checkout-setup-readiness-reconstruction-gap.md",
        "docs/work/tasks/T-ec263b6a-reconstruct-clean-checkout-adoption-readiness-from-track.md",
        "packages/model/src/contracts/skopos-discussion.ts",
        "packages/runtime/src/application/discussion/discussion.service.ts",
        "packages/runtime/src/application/shared/current-task-state.ts",
        "packages/runtime/src/application/shared/token-control-constants.ts"
      ],
      "scopeId": "skopos",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 4 times and new impact categories appeared (instruction-mirror, instruction-source, docs).",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-instructions.sync-mirrors",
      "title": "Sync self-hosted instruction mirrors",
      "summary": "Required by Guard instructions.source-requires-sync.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "instructions.sync-mirrors",
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
  "ownershipExpansions": [
    {
      "paths": [
        "packages/runtime/src/application/shared/current-task-state.ts"
      ],
      "reason": "Completion mode requires exact lookup of the latest completed Task for the current actor or Session.",
      "actorId": "codex-response-guidance-implementation",
      "recordedAt": "2026-08-12T19:02:31.296Z",
      "baselinePaths": [
        {
          "path": "packages/runtime/src/application/shared/current-task-state.ts",
          "digest": "e72c6da8aeeb0df7e6fe5f09a4949e5c3bc9c231845c1754fd57f8a6cadba1b6"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos-cli",
        "skopos-instructions",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        ".cursor/rules/project.mdc",
        ".github/copilot-instructions.md",
        "AGENTS.md",
        "CLAUDE.md",
        "packages/runtime/src/application/shared/token-control-constants.ts"
      ],
      "reason": "The canonical communication contract owns the generated brief path and must refresh every declared self-hosted instruction projection.",
      "actorId": "codex-response-guidance-implementation",
      "recordedAt": "2026-08-12T19:03:58.352Z",
      "baselinePaths": [
        {
          "path": ".cursor/rules/project.mdc",
          "digest": "9f633ef8ddf03928e6f70ee4c831c471c5a4a95716fa2a7c076bf087a586161d"
        },
        {
          "path": ".github/copilot-instructions.md",
          "digest": "b549f7b31276eb76d960fc908107cb9ef5c8ae58c0134a69cf4fbc8174437522"
        },
        {
          "path": "AGENTS.md",
          "digest": "a80c7164554e47b18e572c811c860e73c5deaee1b3f6d3aa1be5e39f4b9267b3"
        },
        {
          "path": "CLAUDE.md",
          "digest": "9a08eeaa32e4b4abfb9a6534fc3edaeff2dbe25d77cf8563c748ee5b15b5f0ea"
        },
        {
          "path": "packages/runtime/src/application/shared/token-control-constants.ts",
          "digest": "a1ad0eaf5df82c1b91b77e600eb48dd38fe4b25d7c98649866d3607cc209bef8"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-instructions",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        "packages/model/src/contracts/skopos-discussion.ts",
        "packages/runtime/src/application/discussion/discussion.service.ts"
      ],
      "reason": "Completion guidance is pending only while a completed Task is newer than the latest recorded assistant turn, avoiding stale completion mode in later Sessions.",
      "actorId": "codex-response-guidance-implementation",
      "recordedAt": "2026-08-12T19:07:50.906Z",
      "baselinePaths": [
        {
          "path": "packages/model/src/contracts/skopos-discussion.ts",
          "digest": "db9b4401c82d6b8a0a1a6b8cd1ea99f05c03a3548d26296bebaefc9c6c12bb1d"
        },
        {
          "path": "packages/runtime/src/application/discussion/discussion.service.ts",
          "digest": "4c415172237c5066ca28cab77dd1274df76e6bc557d09219fc901b79265a8a54"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-instructions",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        "docs/findings/F-20260813-clean-checkout-setup-readiness-reconstruction-gap.md",
        "docs/work/tasks/T-ec263b6a-reconstruct-clean-checkout-adoption-readiness-from-track.md"
      ],
      "reason": "Record the separately scoped MUST finding and its dependency-gated follow-up Task discovered during this work without adopting that future implementation.",
      "actorId": "codex-response-guidance-implementation",
      "recordedAt": "2026-08-12T19:18:33.065Z",
      "baselinePaths": [
        {
          "path": "docs/findings/F-20260813-clean-checkout-setup-readiness-reconstruction-gap.md",
          "digest": "37db4a14ece7d3b4aad1792ee545ab20e20fb1a4b20c46691d0fdfc10d197b51"
        },
        {
          "path": "docs/work/tasks/T-ec263b6a-reconstruct-clean-checkout-adoption-readiness-from-track.md",
          "digest": "c19d8cef1ce828b8f6e5d9400ef84d9d16c4013e06ba360ae7b4cf225c2a77f0"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-instructions",
        "skopos-model",
        "skopos-runtime"
      ]
    }
  ],
  "declaredOwnedPaths": [
    ".cursor/rules/project.mdc",
    ".github/copilot-instructions.md",
    "AGENTS.md",
    "CLAUDE.md",
    "docs/findings/F-20260813-clean-checkout-setup-readiness-reconstruction-gap.md",
    "docs/work/tasks/T-ec263b6a-reconstruct-clean-checkout-adoption-readiness-from-track.md",
    "packages/cli/src/__tests__/session-context-contract.test.ts",
    "packages/instructions/src/application/communication-contract",
    "packages/instructions/src/application/scaffold-project-instructions",
    "packages/instructions/src/application/sync-claude-code-hook-adapter",
    "packages/instructions/src/application/sync-codex-wrapper-adapter",
    "packages/instructions/src/application/sync-manual-host-adapter",
    "packages/model/src/contracts/skopos-discussion.ts",
    "packages/model/src/contracts/skopos-session-context.ts",
    "packages/runtime/src/application/discussion/discussion.service.ts",
    "packages/runtime/src/application/session/session-context.service.ts",
    "packages/runtime/src/application/shared/current-task-state.ts",
    "packages/runtime/src/application/shared/memory-state.ts",
    "packages/runtime/src/application/shared/token-control-constants.ts"
  ]
}
```
<!-- skopos:task-state:end -->
