---
title: "Task: Rename and simplify Product UI Craft as Product Interface Design"
status: complete
owner: "codex-interface-design"
id: T-4b256788
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-ff58aafdeefb5b7c
lastUpdated: 2026-08-09
---

# Task: Rename and simplify Product UI Craft as Product Interface Design

## Changelog

- `2026-08-09`: Synchronized Task state `complete` from Skopos.

## Goal

Rename and simplify Product UI Craft as Product Interface Design

## Acceptance

- The canonical display name is Product Interface Design, the pack id is ui.product-interface-design, and no live runtime or release surface depends on the old identity.
- The Skill exposes exactly three guidance capabilities: Structure, Behavior, and Finish; React advice is conditional framework guidance inside Behavior.
- Current bindings, Actions, fixtures, benchmarks, tests, package scripts, and public documentation use the new identity while immutable archives and snapshots remain unchanged.
- Deterministic selection, focused behavior, packed-install, release-surface, and typecheck proof pass for the renamed exact source.
- Release gate R2 remains blocked until fresh efficacy evidence and independent human review certify the new identity.

## Non-Goals

- Rewrite immutable Task archives, snapshots, or historical evaluation entries.
- Run paid model efficacy evaluation as part of the rename.
- Expand the Skill into product strategy, UX research, marketing, backend, or general frontend architecture.

## Constraints

- Product Interface Design remains a required public Skill owned and published by Unisane.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership spans 25 paths.

## Owned Paths

- `CONTRIBUTING.md`
- `docs/architecture/public-package-content-and-provenance.md`
- `docs/decisions/006-eval-harness-and-scoring-contract.md`
- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/operations/release-runbook.md`
- `docs/operations/release-security.md`
- `docs/overview.md`
- `docs/work/archive/tasks/T-22bcd9ef-certify-current-source-product-ui-craft-efficacy-and-por.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md`
- `docs/work/tasks/T-22bcd9ef-certify-current-source-product-ui-craft-efficacy-and-por.md`
- `package.json`
- `packages/cli/README.md`
- `packages/cli/scripts/copy-skill-packs.mjs`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/skill-evaluations.test.ts`
- `packages/cli/src/__tests__/skill-packs.test.ts`
- `packages/cli/src/__tests__/task-portability.test.ts`
- `packages/cli/src/benchmarks/external-skill-portability.ts`
- `packages/cli/src/benchmarks/product-interface-design-efficacy.ts`
- `packages/cli/src/benchmarks/product-ui-craft-efficacy.ts`
- `README.md`
- `skill-packs/ui/product-craft`
- `skill-packs/ui/product-interface-design`
- `tools/skopos/actions/skill-product-interface-design-efficacy.yaml`
- `tools/skopos/actions/skill-product-ui-craft-efficacy.yaml`
- `tools/skopos/skills/ui.product-craft.json`
- `tools/skopos/skills/ui.product-interface-design.json`

## Ownership Expansions

- `2026-08-09T09:29:59.577Z` by `codex-interface-design`: `docs/decisions/006-eval-harness-and-scoring-contract.md` — Update the current evaluation authority to name the renamed Product Interface Design subject while preserving its historical changelog.
- `2026-08-09T09:30:10.670Z` by `codex-interface-design`: `docs/work/archive/tasks/T-22bcd9ef-certify-current-source-product-ui-craft-efficacy-and-por.md`, `docs/work/tasks/T-22bcd9ef-certify-current-source-product-ui-craft-efficacy-and-por.md` — Attribute the Skopos-managed supersession move to this rename Task without editing the archived historical result.
- `2026-08-09T09:48:05.104Z` by `codex-interface-design`: `packages/cli/src/__tests__/task-portability.test.ts` — The canonical proof exposed two valid integration cases exceeding Vitest's brittle 5-second default; align them with the suite's existing 15-second integration timeout so release proof remains reliable.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Rename and simplify Product UI Craft as Product Interface Design" inside the resolved scope before widening impact to adjacent areas.
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

- The canonical display name is Product Interface Design, the pack id is ui.product-interface-design, and no live runtime or release surface depends on the old identity. (closure, agent-observation)
- The Skill exposes exactly three guidance capabilities: Structure, Behavior, and Finish; React advice is conditional framework guidance inside Behavior. (closure, agent-observation)
- Current bindings, Actions, fixtures, benchmarks, tests, package scripts, and public documentation use the new identity while immutable archives and snapshots remain unchanged. (closure, agent-observation)
- Deterministic selection, focused behavior, packed-install, release-surface, and typecheck proof pass for the renamed exact source. (closure, agent-observation)
- Release gate R2 remains blocked until fresh efficacy evidence and independent human review certify the new identity. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/public-package-content-and-provenance.md; review and synchronize it if project truth changes. (target: `docs/architecture/public-package-content-and-provenance.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/006-eval-harness-and-scoring-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/006-eval-harness-and-scoring-contract.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-4b256788",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T09:17:14.321Z",
  "updatedAt": "2026-08-09T09:53:30.611Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Rename and simplify Product UI Craft as Product Interface Design",
  "goal": "Rename and simplify Product UI Craft as Product Interface Design",
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
      "The canonical display name is Product Interface Design, the pack id is ui.product-interface-design, and no live runtime or release surface depends on the old identity.",
      "The Skill exposes exactly three guidance capabilities: Structure, Behavior, and Finish; React advice is conditional framework guidance inside Behavior.",
      "Current bindings, Actions, fixtures, benchmarks, tests, package scripts, and public documentation use the new identity while immutable archives and snapshots remain unchanged.",
      "Deterministic selection, focused behavior, packed-install, release-surface, and typecheck proof pass for the renamed exact source.",
      "Release gate R2 remains blocked until fresh efficacy evidence and independent human review certify the new identity."
    ],
    "nonGoals": [
      "Rewrite immutable Task archives, snapshots, or historical evaluation entries.",
      "Run paid model efficacy evaluation as part of the rename.",
      "Expand the Skill into product strategy, UX research, marketing, backend, or general frontend architecture."
    ],
    "constraints": [
      "Product Interface Design remains a required public Skill owned and published by Unisane."
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
      "Declared ownership spans 25 paths."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 25,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli"
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
    "baselineId": "baseline-ff58aafdeefb5b7c"
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
      "detail": "Carry out \"Rename and simplify Product UI Craft as Product Interface Design\" inside the resolved scope before widening impact to adjacent areas.",
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
        "tools/skopos/actions/skill-product-interface-design-efficacy.yaml",
        "tools/skopos/actions/skill-product-ui-craft-efficacy.yaml",
        "tools/skopos/skills/ui.product-craft.json",
        "tools/skopos/skills/ui.product-interface-design.json"
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
        "package.json",
        "packages/cli/README.md",
        "packages/cli/scripts/copy-skill-packs.mjs",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/skill-evaluations.test.ts",
        "packages/cli/src/__tests__/skill-packs.test.ts",
        "packages/cli/src/__tests__/task-portability.test.ts",
        "packages/cli/src/benchmarks/external-skill-portability.ts",
        "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
        "packages/cli/src/benchmarks/product-ui-craft-efficacy.ts"
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
      "acceptanceCriterion": "The canonical display name is Product Interface Design, the pack id is ui.product-interface-design, and no live runtime or release surface depends on the old identity.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The Skill exposes exactly three guidance capabilities: Structure, Behavior, and Finish; React advice is conditional framework guidance inside Behavior.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Current bindings, Actions, fixtures, benchmarks, tests, package scripts, and public documentation use the new identity while immutable archives and snapshots remain unchanged.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Deterministic selection, focused behavior, packed-install, release-surface, and typecheck proof pass for the renamed exact source.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Release gate R2 remains blocked until fresh efficacy evidence and independent human review certify the new identity.",
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
      "id": "memory-architecture-3c55049580",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/public-package-content-and-provenance.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/public-package-content-and-provenance.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical public package and provenance architecture for Product Interface Design, its 38-file public surface, and owner-authorized Unisane requirement.",
      "resolvedAt": "2026-08-09T09:50:48.873Z",
      "resolvedByActorId": "codex-interface-design"
    },
    {
      "id": "memory-decision-3da7b245e6",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/006-eval-harness-and-scoring-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/006-eval-harness-and-scoring-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the evaluation subject to ui.product-interface-design while preserving the superseded Product UI Craft efficacy record as history.",
      "resolvedAt": "2026-08-09T09:50:50.803Z",
      "resolvedByActorId": "codex-interface-design"
    },
    {
      "id": "memory-decision-5e228f0160",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the accepted capability projection to Product Interface Design with the three-capability Structure, Behavior, and Finish model.",
      "resolvedAt": "2026-08-09T09:50:53.735Z",
      "resolvedByActorId": "codex-interface-design"
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
      "status": "open"
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
      "status": "open"
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
  "ownershipExpansions": [
    {
      "paths": [
        "docs/decisions/006-eval-harness-and-scoring-contract.md"
      ],
      "reason": "Update the current evaluation authority to name the renamed Product Interface Design subject while preserving its historical changelog.",
      "actorId": "codex-interface-design",
      "recordedAt": "2026-08-09T09:29:59.577Z",
      "baselinePaths": [
        {
          "path": "docs/decisions/006-eval-harness-and-scoring-contract.md",
          "digest": "2078783c23cdd0e48e40773aa074707fc8cf1f86700fae03b3db00627cee4a69"
        }
      ]
    },
    {
      "paths": [
        "docs/work/archive/tasks/T-22bcd9ef-certify-current-source-product-ui-craft-efficacy-and-por.md",
        "docs/work/tasks/T-22bcd9ef-certify-current-source-product-ui-craft-efficacy-and-por.md"
      ],
      "reason": "Attribute the Skopos-managed supersession move to this rename Task without editing the archived historical result.",
      "actorId": "codex-interface-design",
      "recordedAt": "2026-08-09T09:30:10.670Z",
      "baselinePaths": [
        {
          "path": "docs/work/archive/tasks/T-22bcd9ef-certify-current-source-product-ui-craft-efficacy-and-por.md",
          "digest": "dc28a4b6fdd3f928ee91139c9bb9d452bf7f7a45ea5cf22c32159ed099182979"
        },
        {
          "path": "docs/work/tasks/T-22bcd9ef-certify-current-source-product-ui-craft-efficacy-and-por.md",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ]
    },
    {
      "paths": [
        "packages/cli/src/__tests__/task-portability.test.ts"
      ],
      "reason": "The canonical proof exposed two valid integration cases exceeding Vitest's brittle 5-second default; align them with the suite's existing 15-second integration timeout so release proof remains reliable.",
      "actorId": "codex-interface-design",
      "recordedAt": "2026-08-09T09:48:05.104Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/__tests__/task-portability.test.ts",
          "digest": "faf105c05083af6a20be595a59529b4d65d6c06b6d13a05298cf498c382c6987"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "CONTRIBUTING.md",
    "docs/architecture/public-package-content-and-provenance.md",
    "docs/decisions/006-eval-harness-and-scoring-contract.md",
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/operations/release-runbook.md",
    "docs/operations/release-security.md",
    "docs/overview.md",
    "docs/work/archive/tasks/T-22bcd9ef-certify-current-source-product-ui-craft-efficacy-and-por.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md",
    "docs/work/tasks/T-22bcd9ef-certify-current-source-product-ui-craft-efficacy-and-por.md",
    "package.json",
    "packages/cli/README.md",
    "packages/cli/scripts/copy-skill-packs.mjs",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/skill-evaluations.test.ts",
    "packages/cli/src/__tests__/skill-packs.test.ts",
    "packages/cli/src/__tests__/task-portability.test.ts",
    "packages/cli/src/benchmarks/external-skill-portability.ts",
    "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
    "packages/cli/src/benchmarks/product-ui-craft-efficacy.ts",
    "README.md",
    "skill-packs/ui/product-craft",
    "skill-packs/ui/product-interface-design",
    "tools/skopos/actions/skill-product-interface-design-efficacy.yaml",
    "tools/skopos/actions/skill-product-ui-craft-efficacy.yaml",
    "tools/skopos/skills/ui.product-craft.json",
    "tools/skopos/skills/ui.product-interface-design.json"
  ]
}
```
<!-- skopos:task-state:end -->
