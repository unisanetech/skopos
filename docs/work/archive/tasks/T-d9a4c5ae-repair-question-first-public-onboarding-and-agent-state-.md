---
title: "Task: Repair question-first public onboarding and agent-state handoff"
status: complete
owner: "codex-onboarding-fix"
id: T-d9a4c5ae
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-6ea1975df57ea345
lastUpdated: 2026-08-14
---

# Task: Repair question-first public onboarding and agent-state handoff

## Changelog

- `2026-08-14`: Synchronized Task state `complete` from Skopos.

## Goal

Repair question-first public onboarding and agent-state handoff

## Acceptance

- The copied public brief names and links the exact public package and requires the generated question-first setup authority.
- When setup is questions-open, CLI and Session context inline exactly the current material question, recommendation, alternatives, and answer command and prohibit premature final-plan approval.
- Agent analysis and proposals have an explicit resumable submission path before consolidated review.
- Focused real-flow regressions prove clarification precedes review and existing 0.1.0 project state remains compatible.

## Non-Goals

- Redesign unrelated setup lanes, release automation, or the published CLI/config surface.

## Constraints

- Use clean refactoring internally while preserving the @unisane/skopos 0.1.0 compatibility boundary.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 4 non-workspace Scopes.

## Owned Paths

- `apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts`
- `apps/web/src/features/homepage/content/homepage-copy.ts`
- `apps/web/src/features/homepage/sections/hero-onboarding.tsx`
- `docs/architecture/intelligent-project-onboarding.md`
- `docs/decisions/D-20260814-clean-core-compatible-public-edge.md`
- `docs/guides/bootstrap-a-project.md`
- `packages/cli/src/__tests__/session-context-contract.test.ts`
- `packages/cli/src/__tests__/setup-workflow.test.ts`
- `packages/cli/src/cli/commands/setup.ts`
- `packages/model/src/contracts/skopos-session-context.ts`
- `packages/model/src/contracts/skopos-setup.ts`
- `packages/runtime/src/application/session/session-context.service.ts`
- `packages/runtime/src/application/setup/setup.service.ts`

## Ownership Expansions

- `2026-08-14T12:40:00.555Z` by `codex-onboarding-fix`: `apps/web/src/features/homepage/sections/hero-onboarding.tsx` — The promoted agent flow now shows the canonical five-stage question-first lifecycle and needs matching layout.
- `2026-08-14T12:42:47.065Z` by `codex-onboarding-fix`: `docs/decisions/D-20260814-clean-core-compatible-public-edge.md` — Record the user-approved post-public clean-refactor and compatibility boundary as durable authority.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Repair question-first public onboarding and agent-state handoff" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Build affected project** (action, complete) — Required by Guard quality.build.
- [x] **Test affected behavior** (action, complete) — Required by Guard quality.test.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.build`: Required by Guard quality.build.
- Action `quality.test`: Required by Guard quality.test.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.build`
- Guard `quality.focused-behavior-proof`
- Guard `quality.test`
- Guard `quality.typecheck`

## Evidence And Readiness

- The copied public brief names and links the exact public package and requires the generated question-first setup authority. (closure, agent-observation)
- When setup is questions-open, CLI and Session context inline exactly the current material question, recommendation, alternatives, and answer command and prohibit premature final-plan approval. (closure, agent-observation)
- Agent analysis and proposals have an explicit resumable submission path before consolidated review. (closure, agent-observation)
- Focused real-flow regressions prove clarification precedes review and existing 0.1.0 project state remains compatible. (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes. (target: `docs/architecture/intelligent-project-onboarding.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-d9a4c5ae",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-14T12:33:29.199Z",
  "updatedAt": "2026-08-14T12:57:21.636Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Repair question-first public onboarding and agent-state handoff",
  "goal": "Repair question-first public onboarding and agent-state handoff",
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
      "The copied public brief names and links the exact public package and requires the generated question-first setup authority.",
      "When setup is questions-open, CLI and Session context inline exactly the current material question, recommendation, alternatives, and answer command and prohibit premature final-plan approval.",
      "Agent analysis and proposals have an explicit resumable submission path before consolidated review.",
      "Focused real-flow regressions prove clarification precedes review and existing 0.1.0 project state remains compatible."
    ],
    "nonGoals": [
      "Redesign unrelated setup lanes, release automation, or the published CLI/config surface."
    ],
    "constraints": [
      "Use clean refactoring internally while preserving the @unisane/skopos 0.1.0 compatibility boundary."
    ]
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
      "ownedPathCount": 11,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime",
        "skopos-web"
      ],
      "impactCategories": [
        "docs",
        "scope-source"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-6ea1975df57ea345"
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
      "detail": "Carry out \"Repair question-first public onboarding and agent-state handoff\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-quality.build",
      "kind": "action",
      "title": "Build affected project",
      "detail": "Required by Guard quality.build.",
      "status": "complete"
    },
    {
      "id": "action-quality.test",
      "kind": "action",
      "title": "Test affected behavior",
      "detail": "Required by Guard quality.test.",
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
      "id": "quality.build",
      "title": "Build affected project",
      "category": "quality-check",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/quality-build.yaml",
      "reason": "Required by Guard quality.build.",
      "matchedPaths": [
        "apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts",
        "apps/web/src/features/homepage/content/homepage-copy.ts",
        "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
        "docs/architecture/intelligent-project-onboarding.md",
        "docs/decisions/D-20260814-clean-core-compatible-public-edge.md",
        "docs/guides/bootstrap-a-project.md",
        "packages/cli/src/__tests__/session-context-contract.test.ts",
        "packages/cli/src/__tests__/setup-workflow.test.ts",
        "packages/cli/src/cli/commands/setup.ts",
        "packages/model/src/contracts/skopos-session-context.ts",
        "packages/model/src/contracts/skopos-setup.ts",
        "packages/runtime/src/application/session/session-context.service.ts",
        "packages/runtime/src/application/setup/setup.service.ts"
      ],
      "outputPaths": [],
      "requiresApproval": true
    },
    {
      "id": "quality.test",
      "title": "Test affected behavior",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-test.yaml",
      "reason": "Required by Guard quality.test.",
      "matchedPaths": [
        "apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts",
        "apps/web/src/features/homepage/content/homepage-copy.ts",
        "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
        "docs/architecture/intelligent-project-onboarding.md",
        "docs/decisions/D-20260814-clean-core-compatible-public-edge.md",
        "docs/guides/bootstrap-a-project.md",
        "packages/cli/src/__tests__/session-context-contract.test.ts",
        "packages/cli/src/__tests__/setup-workflow.test.ts",
        "packages/cli/src/cli/commands/setup.ts",
        "packages/model/src/contracts/skopos-session-context.ts",
        "packages/model/src/contracts/skopos-setup.ts",
        "packages/runtime/src/application/session/session-context.service.ts",
        "packages/runtime/src/application/setup/setup.service.ts"
      ],
      "outputPaths": [],
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
        "packages/cli/src/__tests__/setup-workflow.test.ts",
        "packages/cli/src/cli/commands/setup.ts",
        "packages/model/src/contracts/skopos-session-context.ts",
        "packages/model/src/contracts/skopos-setup.ts",
        "packages/runtime/src/application/session/session-context.service.ts",
        "packages/runtime/src/application/setup/setup.service.ts"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.build",
    "quality.focused-behavior-proof",
    "quality.test",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "The copied public brief names and links the exact public package and requires the generated question-first setup authority.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "When setup is questions-open, CLI and Session context inline exactly the current material question, recommendation, alternatives, and answer command and prohibit premature final-plan approval.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Agent analysis and proposals have an explicit resumable submission path before consolidated review.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused real-flow regressions prove clarification precedes review and existing 0.1.0 project state remains compatible.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-quality.build",
      "acceptanceCriterion": "Guard quality.build: Build affected project",
      "phase": "closure",
      "actionIds": [
        "quality.build"
      ],
      "guardIds": [
        "quality.build"
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
      "id": "guard-quality.test",
      "acceptanceCriterion": "Guard quality.test: Test affected behavior",
      "phase": "closure",
      "actionIds": [
        "quality.test"
      ],
      "guardIds": [
        "quality.test"
      ],
      "evidence": "source-bound-action"
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
      "id": "memory-architecture-663c7727b6",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/intelligent-project-onboarding.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical onboarding now defines fail-closed ask-and-wait conversation state, explicit analysis submission, and the clean-core compatible-public-edge boundary.",
      "resolvedAt": "2026-08-14T12:47:58.554Z",
      "resolvedByActorId": "codex-onboarding-fix"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "run-quality.build",
      "title": "Build affected project",
      "summary": "Required by Guard quality.build.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.build",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.test",
      "title": "Test affected behavior",
      "summary": "Required by Guard quality.test.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.test",
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
        "apps/web/src/features/homepage/sections/hero-onboarding.tsx"
      ],
      "reason": "The promoted agent flow now shows the canonical five-stage question-first lifecycle and needs matching layout.",
      "actorId": "codex-onboarding-fix",
      "recordedAt": "2026-08-14T12:40:00.555Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
          "digest": "0e969d7968897e15fcf3467562243dcc1b82fe0feca35bd366e38ade016e218d"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime",
        "skopos-web"
      ]
    },
    {
      "paths": [
        "docs/decisions/D-20260814-clean-core-compatible-public-edge.md"
      ],
      "reason": "Record the user-approved post-public clean-refactor and compatibility boundary as durable authority.",
      "actorId": "codex-onboarding-fix",
      "recordedAt": "2026-08-14T12:42:47.065Z",
      "baselinePaths": [
        {
          "path": "docs/decisions/D-20260814-clean-core-compatible-public-edge.md",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime",
        "skopos-web"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts",
    "apps/web/src/features/homepage/content/homepage-copy.ts",
    "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
    "docs/architecture/intelligent-project-onboarding.md",
    "docs/decisions/D-20260814-clean-core-compatible-public-edge.md",
    "docs/guides/bootstrap-a-project.md",
    "packages/cli/src/__tests__/session-context-contract.test.ts",
    "packages/cli/src/__tests__/setup-workflow.test.ts",
    "packages/cli/src/cli/commands/setup.ts",
    "packages/model/src/contracts/skopos-session-context.ts",
    "packages/model/src/contracts/skopos-setup.ts",
    "packages/runtime/src/application/session/session-context.service.ts",
    "packages/runtime/src/application/setup/setup.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
