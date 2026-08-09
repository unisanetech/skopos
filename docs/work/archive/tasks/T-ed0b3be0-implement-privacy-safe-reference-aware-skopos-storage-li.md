---
title: "Task: Implement privacy-safe reference-aware Skopos storage lifecycle and cleanup"
status: complete
owner: "codex-storage-release"
id: T-ed0b3be0
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-3794fffa9184ce89
lastUpdated: 2026-08-09
---

# Task: Implement privacy-safe reference-aware Skopos storage lifecycle and cleanup

## Changelog

- `2026-08-09`: Synchronized Task state `complete` from Skopos.

## Goal

Implement privacy-safe reference-aware Skopos storage lifecycle and cleanup

## Acceptance

- Storage status classifies temporary, cache, diagnostic, Task evidence, release evidence, and user-pinned material with privacy and size warnings
- Pruning is dry-run by default and apply deletes only expired or pressure-selected unreferenced material
- Open Task references, project-integration/release references, active runs, and explicit pins are protected
- Retention periods and soft/hard size limits are configurable with conservative defaults
- Cleanup receipts record paths, classes, sizes, reasons, and outcomes without deleted content
- Packed CLI exposes working storage status, inspect, prune, pin, unpin, and policy commands

## Non-Goals

- Do not implement content-addressed deduplication in this release

## Constraints

- Never delete protected material or prune without explicit --apply
- Do not modify files owned by active Product UI Craft R2 adjudication

## Owned Paths

- `docs/00-start-here.md`
- `docs/architecture/artifact-model.md`
- `docs/architecture/storage-lifecycle-and-privacy.md`
- `docs/guides/storage-and-privacy.md`
- `package.json`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/storage-lifecycle.test.ts`
- `packages/cli/src/cli/commands/storage.ts`
- `packages/cli/src/cli/index.ts`
- `packages/cli/src/cli/registry.ts`
- `packages/config/src/application/create-default-config/create-default-config.service.ts`
- `packages/config/src/contracts/skopos-root-config.schema.ts`
- `packages/model/src/contracts/skopos-root-config.ts`
- `packages/runtime/src/application/storage`
- `packages/runtime/src/index.ts`
- `skopos.config.yaml`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Does this plan change authentication, authorization, privacy, or security-sensitive behavior?** (decision, complete) — Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Implement privacy-safe reference-aware Skopos storage lifecycle and cleanup" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Refresh self-hosted knowledge state** (action, complete) — Required by Guard knowledge.refresh.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `maintenance.refresh-knowledge`: Required by Guard knowledge.refresh.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `knowledge.refresh`
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Storage status classifies temporary, cache, diagnostic, Task evidence, release evidence, and user-pinned material with privacy and size warnings (closure, agent-observation)
- Pruning is dry-run by default and apply deletes only expired or pressure-selected unreferenced material (closure, agent-observation)
- Open Task references, project-integration/release references, active runs, and explicit pins are protected (closure, agent-observation)
- Retention periods and soft/hard size limits are configurable with conservative defaults (closure, agent-observation)
- Cleanup receipts record paths, classes, sizes, reasons, and outcomes without deleted content (closure, agent-observation)
- Packed CLI exposes working storage status, inspect, prune, pin, unpin, and policy commands (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/artifact-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/artifact-model.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-ed0b3be0",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T00:29:45.961Z",
  "updatedAt": "2026-08-09T00:57:06.536Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Implement privacy-safe reference-aware Skopos storage lifecycle and cleanup",
  "goal": "Implement privacy-safe reference-aware Skopos storage lifecycle and cleanup",
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
      "Storage status classifies temporary, cache, diagnostic, Task evidence, release evidence, and user-pinned material with privacy and size warnings",
      "Pruning is dry-run by default and apply deletes only expired or pressure-selected unreferenced material",
      "Open Task references, project-integration/release references, active runs, and explicit pins are protected",
      "Retention periods and soft/hard size limits are configurable with conservative defaults",
      "Cleanup receipts record paths, classes, sizes, reasons, and outcomes without deleted content",
      "Packed CLI exposes working storage status, inspect, prune, pin, unpin, and policy commands"
    ],
    "nonGoals": [
      "Do not implement content-addressed deduplication in this release"
    ],
    "constraints": [
      "Never delete protected material or prune without explicit --apply",
      "Do not modify files owned by active Product UI Craft R2 adjudication"
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-3794fffa9184ce89"
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
      "id": "decision-plan.security-privacy-change",
      "kind": "decision",
      "title": "Does this plan change authentication, authorization, privacy, or security-sensitive behavior?",
      "detail": "Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.",
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
      "detail": "Carry out \"Implement privacy-safe reference-aware Skopos storage lifecycle and cleanup\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-maintenance.refresh-knowledge",
      "kind": "action",
      "title": "Refresh self-hosted knowledge state",
      "detail": "Required by Guard knowledge.refresh.",
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
      "id": "maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
      "reason": "Required by Guard knowledge.refresh.",
      "matchedPaths": [
        "skopos.config.yaml"
      ],
      "outputPaths": [
        ".skopos/index"
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
        "packages/model/src/contracts/skopos-root-config.ts",
        "packages/config/src/contracts/skopos-root-config.schema.ts",
        "packages/config/src/application/create-default-config/create-default-config.service.ts",
        "packages/runtime/src/application/storage",
        "packages/runtime/src/index.ts",
        "packages/cli/src/cli/commands/storage.ts",
        "packages/cli/src/cli/index.ts",
        "packages/cli/src/cli/registry.ts",
        "packages/cli/src/__tests__/storage-lifecycle.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "package.json"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "knowledge.refresh",
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Storage status classifies temporary, cache, diagnostic, Task evidence, release evidence, and user-pinned material with privacy and size warnings",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Pruning is dry-run by default and apply deletes only expired or pressure-selected unreferenced material",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Open Task references, project-integration/release references, active runs, and explicit pins are protected",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Retention periods and soft/hard size limits are configurable with conservative defaults",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Cleanup receipts record paths, classes, sizes, reasons, and outcomes without deleted content",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-6",
      "acceptanceCriterion": "Packed CLI exposes working storage status, inspect, prune, pin, unpin, and policy commands",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-knowledge.refresh",
      "acceptanceCriterion": "Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge",
      "phase": "closure",
      "actionIds": [
        "maintenance.refresh-knowledge"
      ],
      "guardIds": [
        "knowledge.refresh"
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
      "id": "memory-architecture-1e8076edb8",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/artifact-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/artifact-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated canonical artifact architecture with managed storage classes, reference protection, dry-run/apply cleanup, metadata-only receipts, and the .skopos privacy boundary.",
      "resolvedAt": "2026-08-09T00:56:32.580Z",
      "resolvedByActorId": "codex-storage-release"
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
      "resolvedAt": "2026-08-09T00:30:09.074Z",
      "resolvedByActorId": "codex-storage-release"
    },
    {
      "id": "plan.security-privacy-change",
      "category": "security",
      "escalation": "must-ask",
      "question": "Does this plan change authentication, authorization, privacy, or security-sensitive behavior?",
      "whyItMatters": "Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.",
      "recommendedOptionId": "confirm-security-policy",
      "options": [
        {
          "id": "confirm-security-policy",
          "label": "Confirm policy first",
          "rationale": "Recommended because security-sensitive changes should follow an explicit policy choice."
        },
        {
          "id": "implement-fast-path",
          "label": "Implement fast path",
          "rationale": "Use only when the required policy is already settled and documented."
        },
        {
          "id": "no-security-change",
          "label": "No security change",
          "rationale": "Use when the classified wording does not actually change authentication, authorization, privacy, or security behavior."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "confirm-security-policy",
      "resolvedAt": "2026-08-09T00:30:12.484Z",
      "resolvedByActorId": "codex-storage-release"
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
      "id": "resolve-plan.security-privacy-change",
      "title": "Resolve: Does this plan change authentication, authorization, privacy, or security-sensitive behavior?",
      "summary": "Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.security-privacy-change",
      "blocking": true,
      "status": "complete"
    },
    {
      "id": "run-maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "summary": "Required by Guard knowledge.refresh.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "maintenance.refresh-knowledge",
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
    "docs/00-start-here.md",
    "docs/architecture/artifact-model.md",
    "docs/architecture/storage-lifecycle-and-privacy.md",
    "docs/guides/storage-and-privacy.md",
    "package.json",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/storage-lifecycle.test.ts",
    "packages/cli/src/cli/commands/storage.ts",
    "packages/cli/src/cli/index.ts",
    "packages/cli/src/cli/registry.ts",
    "packages/config/src/application/create-default-config/create-default-config.service.ts",
    "packages/config/src/contracts/skopos-root-config.schema.ts",
    "packages/model/src/contracts/skopos-root-config.ts",
    "packages/runtime/src/application/storage",
    "packages/runtime/src/index.ts",
    "skopos.config.yaml"
  ]
}
```
<!-- skopos:task-state:end -->
