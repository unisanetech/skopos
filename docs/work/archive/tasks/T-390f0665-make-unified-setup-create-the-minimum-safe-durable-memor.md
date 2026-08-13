---
title: "Task: Make unified setup create the minimum safe durable Memory boundary in undocumented projects"
status: complete
owner: "codex-setup-memory-boundary"
id: T-390f0665
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-e34bd2e26980fadb
lastUpdated: 2026-08-12
---

# Task: Make unified setup create the minimum safe durable Memory boundary in undocumented projects

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Make unified setup create the minimum safe durable Memory boundary in undocumented projects

## Acceptance

- Setup creates a non-destructive docs router and declared workspace Memory root when an existing project has neither
- Existing project docs and declared Scope registry remain untouched
- A clean packed project can start a standard tracked Task immediately after setup

## Non-Goals

- Do not make init itself the user-facing onboarding workflow

## Constraints

- Preserve brownfield project truth and skip existing files

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 2 non-workspace Scopes.

## Owned Paths

- `docs/architecture/00-architecture.md`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/setup-workflow.test.ts`
- `packages/runtime/src/application/init/init.service.ts`
- `packages/runtime/src/application/setup/setup.service.ts`

## Ownership Expansions

- `2026-08-12T21:20:00.359Z` by `codex-setup-memory-boundary`: `docs/architecture/00-architecture.md` — Record the accepted non-destructive first-setup Memory-boundary behavior in canonical architecture.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make unified setup create the minimum safe durable Memory boundary in undocumented projects" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Setup creates a non-destructive docs router and declared workspace Memory root when an existing project has neither (closure, agent-observation)
- Existing project docs and declared Scope registry remain untouched (closure, agent-observation)
- A clean packed project can start a standard tracked Task immediately after setup (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-390f0665",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T21:14:44.880Z",
  "updatedAt": "2026-08-12T21:21:42.674Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Make unified setup create the minimum safe durable Memory boundary in undocumented projects",
  "goal": "Make unified setup create the minimum safe durable Memory boundary in undocumented projects",
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
      "Setup creates a non-destructive docs router and declared workspace Memory root when an existing project has neither",
      "Existing project docs and declared Scope registry remain untouched",
      "A clean packed project can start a standard tracked Task immediately after setup"
    ],
    "nonGoals": [
      "Do not make init itself the user-facing onboarding workflow"
    ],
    "constraints": [
      "Preserve brownfield project truth and skip existing files"
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
      "Declared ownership affects 2 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 4,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
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
    "baselineId": "baseline-e34bd2e26980fadb"
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
      "detail": "Carry out \"Make unified setup create the minimum safe durable Memory boundary in undocumented projects\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/setup-workflow.test.ts",
        "packages/runtime/src/application/init/init.service.ts",
        "packages/runtime/src/application/setup/setup.service.ts"
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
      "acceptanceCriterion": "Setup creates a non-destructive docs router and declared workspace Memory root when an existing project has neither",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Existing project docs and declared Scope registry remain untouched",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "A clean packed project can start a standard tracked Task immediately after setup",
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
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope skopos.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical architecture now records setup-only non-destructive workspace Memory-boundary scaffolding and existing-registry preservation.",
      "resolvedAt": "2026-08-12T21:20:56.534Z",
      "resolvedByActorId": "codex-setup-memory-boundary"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because new impact categories appeared (docs). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-390f0665' 'Continue Make unified setup create the minimum safe durable Memory boundary in undocumented projects as bounded follow-up work' . --scope 'skopos' --own 'docs/architecture/00-architecture.md' --reason 'The Task may be drifting from its admitted subject because new impact categories appeared (docs).' --actor 'codex-setup-memory-boundary'",
      "ownedPaths": [
        "docs/architecture/00-architecture.md"
      ],
      "scopeId": "skopos",
      "reason": "The Task may be drifting from its admitted subject because new impact categories appeared (docs).",
      "blocking": false,
      "status": "open"
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
        "docs/architecture/00-architecture.md"
      ],
      "reason": "Record the accepted non-destructive first-setup Memory-boundary behavior in canonical architecture.",
      "actorId": "codex-setup-memory-boundary",
      "recordedAt": "2026-08-12T21:20:00.359Z",
      "baselinePaths": [
        {
          "path": "docs/architecture/00-architecture.md",
          "digest": "1e2312b7e9249ae2a9ac7565b1736aac8fa69d0ac7c3935eba740a17f68b3175"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-runtime"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/00-architecture.md",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/setup-workflow.test.ts",
    "packages/runtime/src/application/init/init.service.ts",
    "packages/runtime/src/application/setup/setup.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
