---
title: "Task: Remove external adopter identity from current Skopos product and release authority"
status: complete
owner: "codex-root"
id: T-35de153e
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-19e8f06663c123b9
lastUpdated: 2026-08-12
---

# Task: Remove external adopter identity from current Skopos product and release authority

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Remove external adopter identity from current Skopos product and release authority

## Acceptance

- The canonical release scorecard contains no product gate tied to one external adopter.
- Current Plans describe generic external-project validation while historical pilot records remain historical.
- The public web owns its brand/config names and has no Unisane-named runtime symbols or CSS selectors.
- Legal source attribution remains in NOTICE and Skopos has no private Unisane dependency.

## Non-Goals

- Rewrite archived Tasks or erase factual historical pilot evidence.

## Constraints

- Preserve generic external-project tests and legally necessary attribution.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `apps/web/config/ui/brand.ts`
- `apps/web/public/brand/publish-manifest.json`
- `apps/web/src/app/globals.css`
- `apps/web/ui-registry.json`
- `apps/web/unisane-ui.json`
- `design-qa.md`
- `docs/architecture/00-architecture.md`
- `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
- `docs/domains/product/implementation-map.md`
- `docs/domains/product/vision.md`
- `docs/operations/first-public-release-scorecard.md`
- `docs/operations/release-runbook.md`
- `docs/overview.md`
- `docs/reference/generated/archive/unisane-external-workspace-pilot.md`
- `docs/reference/generated/unisane-external-workspace-pilot.md`
- `docs/scopes/skopos-ui/architecture/00-architecture.md`
- `docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md`
- `docs/scopes/skopos-ui/decisions/archive/D-20260804-browser-history-and-unisane-ui-registry-delivery.md`
- `docs/scopes/skopos-ui/decisions/archive/D-20260804-unisane-ui-visual-ownership.md`
- `docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md`
- `docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md`
- `docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md`
- `docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md`
- `docs/scopes/skopos-ui/overview.md`
- `docs/scopes/skopos-web/overview.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `docs/work/plans/P-7dde6750-design-and-deliver-the-public-skopos-homepage.md`
- `docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `NOTICE`
- `packages/cli/src/__tests__/external-workspace-pilot.test.ts`
- `packages/cli/src/__tests__/host-projection-model.test.ts`
- `packages/cli/src/benchmarks/external-skill-portability.ts`
- `packages/cli/src/benchmarks/external-workspace-pilot.ts`
- `scripts/release/validate-release-scorecard.test.mjs`

## Ownership Expansions

- `2026-08-12T16:22:09.658Z` by `codex-root`: `docs/architecture/00-architecture.md`, `docs/overview.md`, `packages/cli/src/__tests__/external-workspace-pilot.test.ts`, `packages/cli/src/benchmarks/external-workspace-pilot.ts` — Active benchmark output and current architecture overview still encode the external adopter identity; they must become generic while archived evidence remains historical.
- `2026-08-12T16:24:24.328Z` by `codex-root`: `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md` — This active Skill Plan still names one adopter as the canonical canary; current Plan authority must describe a generic external-project canary.
- `2026-08-12T16:28:46.775Z` by `codex-root`: `apps/web/ui-registry.json`, `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`, `docs/domains/product/implementation-map.md`, `docs/domains/product/vision.md`, `docs/reference/generated/archive/unisane-external-workspace-pilot.md`, `docs/reference/generated/unisane-external-workspace-pilot.md`, `docs/scopes/skopos-ui/architecture/00-architecture.md`, `docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md`, `docs/scopes/skopos-ui/decisions/archive/D-20260804-browser-history-and-unisane-ui-registry-delivery.md`, `docs/scopes/skopos-ui/decisions/archive/D-20260804-unisane-ui-visual-ownership.md`, `docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md`, `docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md`, `docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md`, `docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md`, `docs/scopes/skopos-ui/overview.md` — Complete the approved separation by replacing active adopter-specific product authority while archiving factual provenance.
- `2026-08-12T16:33:45.153Z` by `codex-root`: `packages/cli/src/__tests__/host-projection-model.test.ts`, `packages/cli/src/benchmarks/external-skill-portability.ts` — Remove adopter-specific fixture names from active generic portability and host-projection proof.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Remove external adopter identity from current Skopos product and release authority" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- The canonical release scorecard contains no product gate tied to one external adopter. (closure, agent-observation)
- Current Plans describe generic external-project validation while historical pilot records remain historical. (closure, agent-observation)
- The public web owns its brand/config names and has no Unisane-named runtime symbols or CSS selectors. (closure, agent-observation)
- Legal source attribution remains in NOTICE and Skopos has no private Unisane dependency. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/scopes/skopos-ui/architecture/00-architecture.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/architecture/00-architecture.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes. (target: `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-35de153e",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T16:20:54.286Z",
  "updatedAt": "2026-08-12T16:42:19.731Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Remove external adopter identity from current Skopos product and release authority",
  "goal": "Remove external adopter identity from current Skopos product and release authority",
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
      "The canonical release scorecard contains no product gate tied to one external adopter.",
      "Current Plans describe generic external-project validation while historical pilot records remain historical.",
      "The public web owns its brand/config names and has no Unisane-named runtime symbols or CSS selectors.",
      "Legal source attribution remains in NOTICE and Skopos has no private Unisane dependency."
    ],
    "nonGoals": [
      "Rewrite archived Tasks or erase factual historical pilot evidence."
    ],
    "constraints": [
      "Preserve generic external-project tests and legally necessary attribution."
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
      "The goal contains high-impact signal: release."
    ],
    "signals": {
      "goalSignals": [
        "release"
      ],
      "ownedPathCount": 13,
      "affectedScopeIds": [
        "skopos",
        "skopos-web"
      ],
      "impactCategories": [
        "docs",
        "scope-source",
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-19e8f06663c123b9"
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
      "detail": "Carry out \"Remove external adopter identity from current Skopos product and release authority\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/external-workspace-pilot.test.ts",
        "packages/cli/src/__tests__/host-projection-model.test.ts",
        "packages/cli/src/benchmarks/external-skill-portability.ts",
        "packages/cli/src/benchmarks/external-workspace-pilot.ts"
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
      "acceptanceCriterion": "The canonical release scorecard contains no product gate tied to one external adopter.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Current Plans describe generic external-project validation while historical pilot records remain historical.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The public web owns its brand/config names and has no Unisane-named runtime symbols or CSS selectors.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Legal source attribution remains in NOTICE and Skopos has no private Unisane dependency.",
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
      "resolutionReason": "Updated root architecture to define app-owned public UI source and project-owned external integrations.",
      "resolvedAt": "2026-08-12T16:40:32.384Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-573233ab26",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/scopes/skopos-ui/architecture/00-architecture.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/architecture/00-architecture.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated UI architecture so reviewed local Skopos source owns components, theme, and visual authority.",
      "resolvedAt": "2026-08-12T16:40:33.556Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-03283a9975",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md",
      "resolution": "memory-updated",
      "resolutionReason": "Added the canonical local UI-source and visual-authority Decision.",
      "resolvedAt": "2026-08-12T16:40:34.717Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-5f0163a357",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated supervision projection to link the local ownership authority.",
      "resolvedAt": "2026-08-12T16:40:35.888Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-5fcdd568ee",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated routed app stack references to the local ownership authority.",
      "resolvedAt": "2026-08-12T16:40:37.059Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-7f31a96932",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
      "resolution": "memory-updated",
      "resolutionReason": "Moved adopter pilot output to historical generated reference and updated the canonical link.",
      "resolvedAt": "2026-08-12T16:40:38.231Z",
      "resolvedByActorId": "codex-root"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 4 times and new declared Scopes appeared (skopos-cli). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-35de153e' 'Continue Remove external adopter identity from current Skopos product and release authority as bounded follow-up work' . --scope 'skopos' --own 'apps/web/ui-registry.json' --own 'docs/architecture/00-architecture.md' --own 'docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md' --own 'docs/domains/product/implementation-map.md' --own 'docs/domains/product/vision.md' --own 'docs/overview.md' --own 'docs/reference/generated/archive/unisane-external-workspace-pilot.md' --own 'docs/reference/generated/unisane-external-workspace-pilot.md' --own 'docs/scopes/skopos-ui/architecture/00-architecture.md' --own 'docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md' --own 'docs/scopes/skopos-ui/decisions/archive/D-20260804-browser-history-and-unisane-ui-registry-delivery.md' --own 'docs/scopes/skopos-ui/decisions/archive/D-20260804-unisane-ui-visual-ownership.md' --own 'docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md' --own 'docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md' --own 'docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md' --own 'docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md' --own 'docs/scopes/skopos-ui/overview.md' --own 'docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md' --own 'packages/cli/src/__tests__/external-workspace-pilot.test.ts' --own 'packages/cli/src/__tests__/host-projection-model.test.ts' --own 'packages/cli/src/benchmarks/external-skill-portability.ts' --own 'packages/cli/src/benchmarks/external-workspace-pilot.ts' --reason 'The Task may be drifting from its admitted subject because ownership expanded 4 times and new declared Scopes appeared (skopos-cli).' --actor 'codex-root'",
      "ownedPaths": [
        "apps/web/ui-registry.json",
        "docs/architecture/00-architecture.md",
        "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
        "docs/domains/product/implementation-map.md",
        "docs/domains/product/vision.md",
        "docs/overview.md",
        "docs/reference/generated/archive/unisane-external-workspace-pilot.md",
        "docs/reference/generated/unisane-external-workspace-pilot.md",
        "docs/scopes/skopos-ui/architecture/00-architecture.md",
        "docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md",
        "docs/scopes/skopos-ui/decisions/archive/D-20260804-browser-history-and-unisane-ui-registry-delivery.md",
        "docs/scopes/skopos-ui/decisions/archive/D-20260804-unisane-ui-visual-ownership.md",
        "docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md",
        "docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md",
        "docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md",
        "docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md",
        "docs/scopes/skopos-ui/overview.md",
        "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
        "packages/cli/src/__tests__/external-workspace-pilot.test.ts",
        "packages/cli/src/__tests__/host-projection-model.test.ts",
        "packages/cli/src/benchmarks/external-skill-portability.ts",
        "packages/cli/src/benchmarks/external-workspace-pilot.ts"
      ],
      "scopeId": "skopos",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 4 times and new declared Scopes appeared (skopos-cli).",
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
        "docs/architecture/00-architecture.md",
        "docs/overview.md",
        "packages/cli/src/__tests__/external-workspace-pilot.test.ts",
        "packages/cli/src/benchmarks/external-workspace-pilot.ts"
      ],
      "reason": "Active benchmark output and current architecture overview still encode the external adopter identity; they must become generic while archived evidence remains historical.",
      "actorId": "codex-root",
      "recordedAt": "2026-08-12T16:22:09.658Z",
      "baselinePaths": [
        {
          "path": "docs/architecture/00-architecture.md",
          "digest": "5a9380c9e99ed34eb5177a081a5e17679da5f7c5400812188933ab21e9845fc0"
        },
        {
          "path": "docs/overview.md",
          "digest": "063eae4c664e2cf5be51097813a6cd76d6aea5cb2051e635b9a35fa1531f1731"
        },
        {
          "path": "packages/cli/src/__tests__/external-workspace-pilot.test.ts",
          "digest": "eb457db87a4efcf74e8c73bb68025ca28fb0c26dc8114754597704184b344f85"
        },
        {
          "path": "packages/cli/src/benchmarks/external-workspace-pilot.ts",
          "digest": "e8bddfee5fb3e97885ce5b8bb29ab2182094d24bd5d44d223893aba14dc61f56"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-web"
      ]
    },
    {
      "paths": [
        "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md"
      ],
      "reason": "This active Skill Plan still names one adopter as the canonical canary; current Plan authority must describe a generic external-project canary.",
      "actorId": "codex-root",
      "recordedAt": "2026-08-12T16:24:24.328Z",
      "baselinePaths": [
        {
          "path": "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
          "digest": "a7c2a848fb5921016a7f1214c00bd6d49aab0fe4e7849c8436100a3530e6eabe"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-web"
      ]
    },
    {
      "paths": [
        "apps/web/ui-registry.json",
        "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
        "docs/domains/product/implementation-map.md",
        "docs/domains/product/vision.md",
        "docs/reference/generated/archive/unisane-external-workspace-pilot.md",
        "docs/reference/generated/unisane-external-workspace-pilot.md",
        "docs/scopes/skopos-ui/architecture/00-architecture.md",
        "docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md",
        "docs/scopes/skopos-ui/decisions/archive/D-20260804-browser-history-and-unisane-ui-registry-delivery.md",
        "docs/scopes/skopos-ui/decisions/archive/D-20260804-unisane-ui-visual-ownership.md",
        "docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md",
        "docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md",
        "docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md",
        "docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md",
        "docs/scopes/skopos-ui/overview.md"
      ],
      "reason": "Complete the approved separation by replacing active adopter-specific product authority while archiving factual provenance.",
      "actorId": "codex-root",
      "recordedAt": "2026-08-12T16:28:46.775Z",
      "baselinePaths": [
        {
          "path": "apps/web/ui-registry.json",
          "digest": "27e70dc63dcbf6a4df80bdf8db2db75183d634f55f7168345004246416a9eba1"
        },
        {
          "path": "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
          "digest": "a0627b3c7b4376974e3faf80b4c62d901c96c597ffd9801f87b74301c627a0c2"
        },
        {
          "path": "docs/domains/product/implementation-map.md",
          "digest": "5c54908cb7c71fee4a905e79fc63b643b88455d01a7e64b16116924470891573"
        },
        {
          "path": "docs/domains/product/vision.md",
          "digest": "466a0b37eccc96ff4b2f1011db780c3b0217b7ece8ce3c819c3f8c01e93d205f"
        },
        {
          "path": "docs/reference/generated/archive/unisane-external-workspace-pilot.md",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "docs/reference/generated/unisane-external-workspace-pilot.md",
          "digest": "510c15ba5a3a913a26650cddcc3eb3e8687e657f9ea0ea837681d022a26a65d7"
        },
        {
          "path": "docs/scopes/skopos-ui/architecture/00-architecture.md",
          "digest": "2841537db532fd594dcf1d6f90b9760d0ef824cc9232a57b3e082fadc7172535"
        },
        {
          "path": "docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md",
          "digest": "837ce088155c35be05643c305bc4b3f27a6eee78529c95985201144571dd9ee1"
        },
        {
          "path": "docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md",
          "digest": "e22fc06c9ba056606187b9eacb95994fa30d5a773c60d09f1eefe6f4c3d40c80"
        },
        {
          "path": "docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md",
          "digest": "3a43bda1b77a184524ae48932c478e2e6c72baeb23d5fd4b12492f5f1f52be4d"
        },
        {
          "path": "docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md",
          "digest": "043949c20e5f829c25040c09a2b4b47651e235b724a03e299d16ef9b7b63b9fe"
        },
        {
          "path": "docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "docs/scopes/skopos-ui/decisions/archive/D-20260804-browser-history-and-unisane-ui-registry-delivery.md",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "docs/scopes/skopos-ui/decisions/archive/D-20260804-unisane-ui-visual-ownership.md",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "docs/scopes/skopos-ui/overview.md",
          "digest": "4fd08a40dee3a175a2767cf340dd599394c7b25b2cdba1b2678419e4e766fccc"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-web"
      ]
    },
    {
      "paths": [
        "packages/cli/src/__tests__/host-projection-model.test.ts",
        "packages/cli/src/benchmarks/external-skill-portability.ts"
      ],
      "reason": "Remove adopter-specific fixture names from active generic portability and host-projection proof.",
      "actorId": "codex-root",
      "recordedAt": "2026-08-12T16:33:45.153Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/__tests__/host-projection-model.test.ts",
          "digest": "03d383f070e13d690748fdf8bb84812886e1fb3fb30c67743fc3160f5f46827b"
        },
        {
          "path": "packages/cli/src/benchmarks/external-skill-portability.ts",
          "digest": "8cfeeeddd24685e9501a835dc31a31c0efeeeea4d7c9235b1ca4c7d294094c35"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-web"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "apps/web/config/ui/brand.ts",
    "apps/web/public/brand/publish-manifest.json",
    "apps/web/src/app/globals.css",
    "apps/web/ui-registry.json",
    "apps/web/unisane-ui.json",
    "design-qa.md",
    "docs/architecture/00-architecture.md",
    "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
    "docs/domains/product/implementation-map.md",
    "docs/domains/product/vision.md",
    "docs/operations/first-public-release-scorecard.md",
    "docs/operations/release-runbook.md",
    "docs/overview.md",
    "docs/reference/generated/archive/unisane-external-workspace-pilot.md",
    "docs/reference/generated/unisane-external-workspace-pilot.md",
    "docs/scopes/skopos-ui/architecture/00-architecture.md",
    "docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md",
    "docs/scopes/skopos-ui/decisions/archive/D-20260804-browser-history-and-unisane-ui-registry-delivery.md",
    "docs/scopes/skopos-ui/decisions/archive/D-20260804-unisane-ui-visual-ownership.md",
    "docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md",
    "docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md",
    "docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md",
    "docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md",
    "docs/scopes/skopos-ui/overview.md",
    "docs/scopes/skopos-web/overview.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "docs/work/plans/P-7dde6750-design-and-deliver-the-public-skopos-homepage.md",
    "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "NOTICE",
    "packages/cli/src/__tests__/external-workspace-pilot.test.ts",
    "packages/cli/src/__tests__/host-projection-model.test.ts",
    "packages/cli/src/benchmarks/external-skill-portability.ts",
    "packages/cli/src/benchmarks/external-workspace-pilot.ts",
    "scripts/release/validate-release-scorecard.test.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
