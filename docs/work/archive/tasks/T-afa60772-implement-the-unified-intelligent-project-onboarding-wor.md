---
title: "Task: Implement the unified intelligent project onboarding workflow"
status: complete
owner: "codex-unified-onboarding"
id: T-afa60772
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-9a42c1fc42fb51d2
lastUpdated: 2026-08-12
---

# Task: Implement the unified intelligent project onboarding workflow

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Implement the unified intelligent project onboarding workflow

## Acceptance

- skopos setup, setup status, setup resume, and setup review project one resumable runtime authority
- One consolidated review covers understanding, Scopes, Memory, capabilities, Policies, Skills, instructions, and host delivery with accept, edit, defer, and reject dispositions
- Staged apply is dependency-aware, source-bound, resumable after interruption, and exposes setup-ready or setup-ready-with-deferred-options only from current lane proof
- Undocumented, chaotic, contradictory, minimal, and mixed-stack fixtures prove a human-friendly guided setup without proposal-command ceremony

## Non-Goals

- Do not add a tracked omnibus setup manifest or a parallel workflow authority

## Constraints

- Clean-refactor policy applies: remove superseded public setup and adoption ceremony in the same slices without compatibility aliases

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 3 non-workspace Scopes.

## Owned Paths

- `AGENTS.md`
- `docs/00-start-here.md`
- `docs/architecture/intelligent-project-onboarding.md`
- `docs/decisions/D-20260812-intelligent-project-onboarding-contract.md`
- `docs/guides`
- `docs/scopes/skopos-cli/overview.md`
- `package.json`
- `packages/cli/README.md`
- `packages/cli/src/__tests__`
- `packages/cli/src/cli/commands/adoption.ts`
- `packages/cli/src/cli/commands/router.ts`
- `packages/cli/src/cli/commands/setup.ts`
- `packages/cli/src/cli/help.ts`
- `packages/cli/src/cli/registry.ts`
- `packages/cli/src/cli/router.ts`
- `packages/indexer/src/application/build-diagnosis-report/build-diagnosis-report.service.ts`
- `packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts`
- `packages/indexer/src/index.ts`
- `packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts`
- `packages/model/src/contracts`
- `packages/model/src/index.ts`
- `packages/runtime/src/application/adoption/adoption.service.ts`
- `packages/runtime/src/application/init/init.service.ts`
- `packages/runtime/src/application/session/session-context.service.ts`
- `packages/runtime/src/application/setup`
- `packages/runtime/src/application/understanding/understanding.service.ts`
- `packages/runtime/src/index.ts`

## Ownership Expansions

- `2026-08-12T20:05:27.994Z` by `codex-unified-onboarding`: `packages/cli/src/cli/commands/router.ts`, `packages/cli/src/cli/registry.ts`, `packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts`, `packages/runtime/src/application/session/session-context.service.ts` — Unified setup implementation requires the actual CLI registry path, mixed-stack capability provider, setup agent packet contract, and source-bound host context receipt.
- `2026-08-12T20:05:43.375Z` by `codex-unified-onboarding`: `packages/indexer/src/index.ts`, `packages/runtime/src/application/init/init.service.ts` — These existing source owners must expose the unified setup and discovery behavior without a compatibility layer.
- `2026-08-12T20:22:23.922Z` by `codex-unified-onboarding`: `AGENTS.md`, `package.json`, `packages/cli/README.md`, `packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts` — The unified onboarding cut must update the canonical and generated agent instruction source, self-hosting setup script, and public install guidance.
- `2026-08-12T20:22:43.781Z` by `codex-unified-onboarding`: `docs/scopes/skopos-cli/overview.md`, `packages/cli/src/cli/commands/adoption.ts` — The clean-refactor onboarding cut removes the superseded public command implementation and updates its Scope Memory.
- `2026-08-12T20:32:48.992Z` by `codex-unified-onboarding`: `packages/indexer/src/application/build-diagnosis-report/build-diagnosis-report.service.ts` — Diagnosis recovery guidance must route onboarding gaps to the new unified setup authority.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Implement the unified intelligent project onboarding workflow" inside the resolved scope before widening impact to adjacent areas.
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

- skopos setup, setup status, setup resume, and setup review project one resumable runtime authority (closure, agent-observation)
- One consolidated review covers understanding, Scopes, Memory, capabilities, Policies, Skills, instructions, and host delivery with accept, edit, defer, and reject dispositions (closure, agent-observation)
- Staged apply is dependency-aware, source-bound, resumable after interruption, and exposes setup-ready or setup-ready-with-deferred-options only from current lane proof (closure, agent-observation)
- Undocumented, chaotic, contradictory, minimal, and mixed-stack fixtures prove a human-friendly guided setup without proposal-command ceremony (closure, agent-observation)
- Guard instructions.source-requires-sync: Instruction source changes require synchronized mirrors (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes. (target: `docs/architecture/intelligent-project-onboarding.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260812-intelligent-project-onboarding-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260812-intelligent-project-onboarding-contract.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/semantic-guards.md; review and synchronize it if project truth changes. (target: `docs/guides/semantic-guards.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-afa60772",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T19:53:54.456Z",
  "updatedAt": "2026-08-12T20:41:37.463Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Implement the unified intelligent project onboarding workflow",
  "goal": "Implement the unified intelligent project onboarding workflow",
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
      "skopos setup, setup status, setup resume, and setup review project one resumable runtime authority",
      "One consolidated review covers understanding, Scopes, Memory, capabilities, Policies, Skills, instructions, and host delivery with accept, edit, defer, and reject dispositions",
      "Staged apply is dependency-aware, source-bound, resumable after interruption, and exposes setup-ready or setup-ready-with-deferred-options only from current lane proof",
      "Undocumented, chaotic, contradictory, minimal, and mixed-stack fixtures prove a human-friendly guided setup without proposal-command ceremony"
    ],
    "nonGoals": [
      "Do not add a tracked omnibus setup manifest or a parallel workflow authority"
    ],
    "constraints": [
      "Clean-refactor policy applies: remove superseded public setup and adoption ceremony in the same slices without compatibility aliases"
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
      "Declared ownership affects 3 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 14,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime"
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
    "baselineId": "baseline-9a42c1fc42fb51d2"
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
      "detail": "Carry out \"Implement the unified intelligent project onboarding workflow\" inside the resolved scope before widening impact to adjacent areas.",
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
        "package.json",
        "packages/cli/README.md",
        "packages/cli/src/__tests__",
        "packages/cli/src/cli/commands/adoption.ts",
        "packages/cli/src/cli/commands/router.ts",
        "packages/cli/src/cli/commands/setup.ts",
        "packages/cli/src/cli/help.ts",
        "packages/cli/src/cli/registry.ts",
        "packages/cli/src/cli/router.ts",
        "packages/indexer/src/application/build-diagnosis-report/build-diagnosis-report.service.ts",
        "packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts",
        "packages/indexer/src/index.ts",
        "packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts",
        "packages/model/src/contracts",
        "packages/model/src/index.ts",
        "packages/runtime/src/application/adoption/adoption.service.ts",
        "packages/runtime/src/application/init/init.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts",
        "packages/runtime/src/application/setup",
        "packages/runtime/src/application/understanding/understanding.service.ts",
        "packages/runtime/src/index.ts"
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
      "acceptanceCriterion": "skopos setup, setup status, setup resume, and setup review project one resumable runtime authority",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "One consolidated review covers understanding, Scopes, Memory, capabilities, Policies, Skills, instructions, and host delivery with accept, edit, defer, and reject dispositions",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Staged apply is dependency-aware, source-bound, resumable after interruption, and exposes setup-ready or setup-ready-with-deferred-options only from current lane proof",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Undocumented, chaotic, contradictory, minimal, and mixed-stack fixtures prove a human-friendly guided setup without proposal-command ceremony",
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
      "id": "memory-architecture-663c7727b6",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/intelligent-project-onboarding.md",
      "resolution": "memory-updated",
      "resolutionReason": "The architecture now records the implemented unified setup runtime, agent packet, staged application, source-bound analysis, and host proof contract.",
      "resolvedAt": "2026-08-12T20:38:42.249Z",
      "resolvedByActorId": "codex-unified-onboarding"
    },
    {
      "id": "memory-decision-c310d960b6",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260812-intelligent-project-onboarding-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260812-intelligent-project-onboarding-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "The accepted Decision now records the implemented core workflow and clean public command cut.",
      "resolvedAt": "2026-08-12T20:38:44.728Z",
      "resolvedByActorId": "codex-unified-onboarding"
    },
    {
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/developer-workflows.md",
      "resolution": "memory-updated",
      "resolutionReason": "The developer workflow guide now routes people and agents through the unified setup review and resume flow.",
      "resolvedAt": "2026-08-12T20:38:47.114Z",
      "resolvedByActorId": "codex-unified-onboarding"
    },
    {
      "id": "memory-guide-f69150206f",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/semantic-guards.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/semantic-guards.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Semantic Guard guidance remains accurate because setup composes existing Guard authority rather than changing Guard semantics.",
      "resolvedAt": "2026-08-12T20:38:56.394Z",
      "resolvedByActorId": "codex-unified-onboarding"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 5 times and new declared Scopes appeared (skopos-indexer, skopos-instructions) and new impact categories appeared (instruction-source, workspace-file). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-afa60772' 'Continue Implement the unified intelligent project onboarding workflow as bounded follow-up work' . --scope 'skopos' --own 'AGENTS.md' --own 'docs/scopes/skopos-cli/overview.md' --own 'package.json' --own 'packages/cli/README.md' --own 'packages/cli/src/cli/commands/adoption.ts' --own 'packages/cli/src/cli/commands/router.ts' --own 'packages/cli/src/cli/registry.ts' --own 'packages/indexer/src/application/build-diagnosis-report/build-diagnosis-report.service.ts' --own 'packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts' --own 'packages/indexer/src/index.ts' --own 'packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts' --own 'packages/runtime/src/application/init/init.service.ts' --own 'packages/runtime/src/application/session/session-context.service.ts' --reason 'The Task may be drifting from its admitted subject because ownership expanded 5 times and new declared Scopes appeared (skopos-indexer, skopos-instructions) and new impact categories appeared (instruction-source, workspace-file).' --actor 'codex-unified-onboarding'",
      "ownedPaths": [
        "AGENTS.md",
        "docs/scopes/skopos-cli/overview.md",
        "package.json",
        "packages/cli/README.md",
        "packages/cli/src/cli/commands/adoption.ts",
        "packages/cli/src/cli/commands/router.ts",
        "packages/cli/src/cli/registry.ts",
        "packages/indexer/src/application/build-diagnosis-report/build-diagnosis-report.service.ts",
        "packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts",
        "packages/indexer/src/index.ts",
        "packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts",
        "packages/runtime/src/application/init/init.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts"
      ],
      "scopeId": "skopos",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 5 times and new declared Scopes appeared (skopos-indexer, skopos-instructions) and new impact categories appeared (instruction-source, workspace-file).",
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
        "packages/cli/src/cli/commands/router.ts",
        "packages/cli/src/cli/registry.ts",
        "packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts"
      ],
      "reason": "Unified setup implementation requires the actual CLI registry path, mixed-stack capability provider, setup agent packet contract, and source-bound host context receipt.",
      "actorId": "codex-unified-onboarding",
      "recordedAt": "2026-08-12T20:05:27.994Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/cli/commands/router.ts",
          "digest": "c91bcdacaee17c023cb0764a6d928fd27d9765edced9dc3fd32960262c37a916"
        },
        {
          "path": "packages/cli/src/cli/registry.ts",
          "digest": "de600d79647820df25612b17a9dd2637f70a3daba33143f086e6d3352a9a729c"
        },
        {
          "path": "packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts",
          "digest": "6f0ca5972479a20672c1b2d4765c9619aabd248a8989f01dfd430538b7af68c6"
        },
        {
          "path": "packages/runtime/src/application/session/session-context.service.ts",
          "digest": "5465b0e36fbc4a8d8c995935667ee8cbd66068ac56ac713860ba4f0dc8cbe779"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-indexer",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        "packages/indexer/src/index.ts",
        "packages/runtime/src/application/init/init.service.ts"
      ],
      "reason": "These existing source owners must expose the unified setup and discovery behavior without a compatibility layer.",
      "actorId": "codex-unified-onboarding",
      "recordedAt": "2026-08-12T20:05:43.375Z",
      "baselinePaths": [
        {
          "path": "packages/indexer/src/index.ts",
          "digest": "eca95f956679d3e8f4fddaab50baa4313a4400ff905c783e2d21a508c986421d"
        },
        {
          "path": "packages/runtime/src/application/init/init.service.ts",
          "digest": "779a5541f89775132b2b4ad1d733a81fac145b543a511709e0f33c03181c5e20"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-indexer",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        "AGENTS.md",
        "package.json",
        "packages/cli/README.md",
        "packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts"
      ],
      "reason": "The unified onboarding cut must update the canonical and generated agent instruction source, self-hosting setup script, and public install guidance.",
      "actorId": "codex-unified-onboarding",
      "recordedAt": "2026-08-12T20:22:23.922Z",
      "baselinePaths": [
        {
          "path": "AGENTS.md",
          "digest": "9fccd12cda2b393e8c3c4ab3243f77174ef38d83c996546e048deee50a49f4f6"
        },
        {
          "path": "package.json",
          "digest": "b494c40bf0cd0db7aba9a74bdd24113ae598bfde73f8f2e8b7588fbb8f61f551"
        },
        {
          "path": "packages/cli/README.md",
          "digest": "9298d7f0878128ca43ec07b455708db540cfc476deb19f9756b3555c13ad7e53"
        },
        {
          "path": "packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts",
          "digest": "c80b2d5618074ea0b66b5a8f8a860a78c8c3cbde90cfc8c697463a7eb661ff6f"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-indexer",
        "skopos-instructions",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        "docs/scopes/skopos-cli/overview.md",
        "packages/cli/src/cli/commands/adoption.ts"
      ],
      "reason": "The clean-refactor onboarding cut removes the superseded public command implementation and updates its Scope Memory.",
      "actorId": "codex-unified-onboarding",
      "recordedAt": "2026-08-12T20:22:43.781Z",
      "baselinePaths": [
        {
          "path": "docs/scopes/skopos-cli/overview.md",
          "digest": "6a82458f98e8c317a1b90ea0eb4981184da270fba285dc36b907c5b79a85935b"
        },
        {
          "path": "packages/cli/src/cli/commands/adoption.ts",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-indexer",
        "skopos-instructions",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        "packages/indexer/src/application/build-diagnosis-report/build-diagnosis-report.service.ts"
      ],
      "reason": "Diagnosis recovery guidance must route onboarding gaps to the new unified setup authority.",
      "actorId": "codex-unified-onboarding",
      "recordedAt": "2026-08-12T20:32:48.992Z",
      "baselinePaths": [
        {
          "path": "packages/indexer/src/application/build-diagnosis-report/build-diagnosis-report.service.ts",
          "digest": "fbcde44dbcf724cd904345e596c31ea44d440713bc1ce87db6db13c0baa23a86"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-indexer",
        "skopos-instructions",
        "skopos-model",
        "skopos-runtime"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "AGENTS.md",
    "docs/00-start-here.md",
    "docs/architecture/intelligent-project-onboarding.md",
    "docs/decisions/D-20260812-intelligent-project-onboarding-contract.md",
    "docs/guides",
    "docs/scopes/skopos-cli/overview.md",
    "package.json",
    "packages/cli/README.md",
    "packages/cli/src/__tests__",
    "packages/cli/src/cli/commands/adoption.ts",
    "packages/cli/src/cli/commands/router.ts",
    "packages/cli/src/cli/commands/setup.ts",
    "packages/cli/src/cli/help.ts",
    "packages/cli/src/cli/registry.ts",
    "packages/cli/src/cli/router.ts",
    "packages/indexer/src/application/build-diagnosis-report/build-diagnosis-report.service.ts",
    "packages/indexer/src/application/discover-capability-candidates/discover-capability-candidates.service.ts",
    "packages/indexer/src/index.ts",
    "packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts",
    "packages/model/src/contracts",
    "packages/model/src/index.ts",
    "packages/runtime/src/application/adoption/adoption.service.ts",
    "packages/runtime/src/application/init/init.service.ts",
    "packages/runtime/src/application/session/session-context.service.ts",
    "packages/runtime/src/application/setup",
    "packages/runtime/src/application/understanding/understanding.service.ts",
    "packages/runtime/src/index.ts"
  ]
}
```
<!-- skopos:task-state:end -->
