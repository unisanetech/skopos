---
title: "Task: Separate Product Interface Design pipeline smoke from fresh design showcases"
status: complete
owner: "codex-product-interface-showcase"
id: T-1e515ca7
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-26fec77a2b1e879e
lastUpdated: 2026-08-11
---

# Task: Separate Product Interface Design pipeline smoke from fresh design showcases

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Separate Product Interface Design pipeline smoke from fresh design showcases

## Acceptance

- The fixed one-case smoke is explicitly classified as pipeline validation rather than design-quality evidence
- A coding agent can generate multiple fresh Product Interface Design pages from minimal scaffolds without reusing a scenario for the same Skill identity
- Showcase reports and a visual gallery preserve prompts, exact Skill identity, source, desktop/mobile renders, and execution telemetry
- Frozen paired efficacy and independent human promotion gates remain separate and unchanged

## Non-Goals

- Do not rerun paid model evaluation or claim R2 promotion

## Constraints

- Preserve unrelated dirty-worktree changes and existing evaluation Evidence

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership spans 12 paths.

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `package.json`
- `packages/cli/package.json`
- `packages/cli/src/__tests__/product-interface-design-showcase.test.ts`
- `packages/cli/src/benchmarks/fixtures/product-interface-design-showcase/index.html`
- `packages/cli/src/benchmarks/fixtures/product-interface-design-showcase/src.js`
- `packages/cli/src/benchmarks/fixtures/product-interface-design-showcase/styles.css`
- `packages/cli/src/benchmarks/product-interface-design-efficacy.ts`
- `packages/cli/src/benchmarks/product-interface-design-showcase-support.ts`
- `packages/cli/src/benchmarks/product-interface-design-showcase.scenarios.json`
- `packages/cli/src/benchmarks/product-interface-design-showcase.ts`
- `tools/skopos/actions/skill-product-interface-design-efficacy.yaml`
- `tools/skopos/actions/skill-product-interface-design-showcase.yaml`
- `tools/skopos/skills/ui.product-interface-design.json`

## Ownership Expansions

- `2026-08-09T13:20:06.992Z` by `codex-product-interface-showcase`: `tools/skopos/actions/skill-product-interface-design-efficacy.yaml`, `tools/skopos/actions/skill-product-interface-design-showcase.yaml` — The public Action catalog must distinguish the fixed pipeline canary from the fresh candidate-only showcase.
- `2026-08-09T13:28:16.298Z` by `codex-product-interface-showcase`: `tools/skopos/skills/ui.product-interface-design.json` — The new showcase Action intentionally changes the capability catalog, so the existing Product Interface Design binding must be re-accepted against the exact current catalog identity.

## Steps

- [ ] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, skipped) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Separate Product Interface Design pipeline smoke from fresh design showcases" inside the resolved scope before widening impact to adjacent areas.
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

- The fixed one-case smoke is explicitly classified as pipeline validation rather than design-quality evidence (closure, agent-observation)
- A coding agent can generate multiple fresh Product Interface Design pages from minimal scaffolds without reusing a scenario for the same Skill identity (closure, agent-observation)
- Showcase reports and a visual gallery preserve prompts, exact Skill identity, source, desktop/mobile renders, and execution telemetry (closure, agent-observation)
- Frozen paired efficacy and independent human promotion gates remain separate and unchanged (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-1e515ca7",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T13:19:14.072Z",
  "updatedAt": "2026-08-11T01:51:06.496Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Separate Product Interface Design pipeline smoke from fresh design showcases",
  "goal": "Separate Product Interface Design pipeline smoke from fresh design showcases",
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
      "The fixed one-case smoke is explicitly classified as pipeline validation rather than design-quality evidence",
      "A coding agent can generate multiple fresh Product Interface Design pages from minimal scaffolds without reusing a scenario for the same Skill identity",
      "Showcase reports and a visual gallery preserve prompts, exact Skill identity, source, desktop/mobile renders, and execution telemetry",
      "Frozen paired efficacy and independent human promotion gates remain separate and unchanged"
    ],
    "nonGoals": [
      "Do not rerun paid model evaluation or claim R2 promotion"
    ],
    "constraints": [
      "Preserve unrelated dirty-worktree changes and existing evaluation Evidence"
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
      "Declared ownership spans 12 paths."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 12,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli"
      ],
      "impactCategories": [
        "docs",
        "package-manifest",
        "scope-source",
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-26fec77a2b1e879e"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.scope-confirmation",
      "kind": "decision",
      "title": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "detail": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "status": "skipped"
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
      "detail": "Carry out \"Separate Product Interface Design pipeline smoke from fresh design showcases\" inside the resolved scope before widening impact to adjacent areas.",
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
        "tools/skopos/actions/skill-product-interface-design-showcase.yaml",
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
        "packages/cli/package.json",
        "packages/cli/src/__tests__/product-interface-design-showcase.test.ts",
        "packages/cli/src/benchmarks/fixtures/product-interface-design-showcase/index.html",
        "packages/cli/src/benchmarks/fixtures/product-interface-design-showcase/src.js",
        "packages/cli/src/benchmarks/fixtures/product-interface-design-showcase/styles.css",
        "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
        "packages/cli/src/benchmarks/product-interface-design-showcase-support.ts",
        "packages/cli/src/benchmarks/product-interface-design-showcase.scenarios.json",
        "packages/cli/src/benchmarks/product-interface-design-showcase.ts"
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
      "acceptanceCriterion": "The fixed one-case smoke is explicitly classified as pipeline validation rather than design-quality evidence",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "A coding agent can generate multiple fresh Product Interface Design pages from minimal scaffolds without reusing a scenario for the same Skill identity",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Showcase reports and a visual gallery preserve prompts, exact Skill identity, source, desktop/mobile renders, and execution telemetry",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Frozen paired efficacy and independent human promotion gates remain separate and unchanged",
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
      "id": "memory-decision-5e228f0160",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
      "resolution": "memory-updated",
      "resolutionReason": "Decision 040 now defines pipeline smoke, fresh candidate-only showcase, and frozen paired promotion as separate proof purposes and records the refreshed accepted identity.",
      "resolvedAt": "2026-08-09T13:31:23.818Z",
      "resolvedByActorId": "codex-product-interface-showcase"
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
      "status": "dismissed",
      "disposition": {
        "kind": "dismissed",
        "reason": "Historical Task completed before terminal question invariants. The completed outcome superseded this non-blocking Scope suggestion; no answer is inferred.",
        "actorId": "codex",
        "recordedAt": "2026-08-11T01:51:06.496Z"
      }
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
      "status": "dismissed"
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
        "tools/skopos/actions/skill-product-interface-design-efficacy.yaml",
        "tools/skopos/actions/skill-product-interface-design-showcase.yaml"
      ],
      "reason": "The public Action catalog must distinguish the fixed pipeline canary from the fresh candidate-only showcase.",
      "actorId": "codex-product-interface-showcase",
      "recordedAt": "2026-08-09T13:20:06.992Z",
      "baselinePaths": [
        {
          "path": "tools/skopos/actions/skill-product-interface-design-efficacy.yaml",
          "digest": "fd28104ae7e63b5253a55dabcbaf41495948ccc575c5742d4570289b89498c0d"
        },
        {
          "path": "tools/skopos/actions/skill-product-interface-design-showcase.yaml",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ]
    },
    {
      "paths": [
        "tools/skopos/skills/ui.product-interface-design.json"
      ],
      "reason": "The new showcase Action intentionally changes the capability catalog, so the existing Product Interface Design binding must be re-accepted against the exact current catalog identity.",
      "actorId": "codex-product-interface-showcase",
      "recordedAt": "2026-08-09T13:28:16.298Z",
      "baselinePaths": [
        {
          "path": "tools/skopos/skills/ui.product-interface-design.json",
          "digest": "a776f966f7398c00a2fdc6c19eb409d00bf1b7207233f83ea2263254d148d4da"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "package.json",
    "packages/cli/package.json",
    "packages/cli/src/__tests__/product-interface-design-showcase.test.ts",
    "packages/cli/src/benchmarks/fixtures/product-interface-design-showcase/index.html",
    "packages/cli/src/benchmarks/fixtures/product-interface-design-showcase/src.js",
    "packages/cli/src/benchmarks/fixtures/product-interface-design-showcase/styles.css",
    "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
    "packages/cli/src/benchmarks/product-interface-design-showcase-support.ts",
    "packages/cli/src/benchmarks/product-interface-design-showcase.scenarios.json",
    "packages/cli/src/benchmarks/product-interface-design-showcase.ts",
    "tools/skopos/actions/skill-product-interface-design-efficacy.yaml",
    "tools/skopos/actions/skill-product-interface-design-showcase.yaml",
    "tools/skopos/skills/ui.product-interface-design.json"
  ]
}
```
<!-- skopos:task-state:end -->
