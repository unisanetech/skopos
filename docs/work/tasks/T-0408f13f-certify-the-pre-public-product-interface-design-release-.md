---
title: "Task: Certify the pre-public Product Interface Design release gate"
status: deferred
owner: "project"
id: T-0408f13f
scope: "skopos"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-db5c60fc8ecb27f1
lastUpdated: 2026-08-10
---

# Task: Certify the pre-public Product Interface Design release gate

## Changelog

- `2026-08-10`: Synchronized Task state `deferred` from Skopos.

## Goal

Certify the pre-public Product Interface Design release gate

## Acceptance

- The exact current Product Interface Design and Design Context identities pass the full paired efficacy evaluation without authority, safety, containment, or budget regression
- Independent blind human adjudication is prepared from label-safe artifacts and completed by an eligible reviewer
- Packed external-project portability matches the exact identity intended for the release tarball
- The release Plan and Skill Finding state only claims supported by immutable Evidence

## Non-Goals

- Publish the package, change repository visibility, or promote the npm dist tag

## Constraints

- Do not weaken or remove Product Interface Design to make the gate pass

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `docs/architecture/design-context-model.md`
- `docs/architecture/public-package-content-and-provenance.md`
- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/guides/product-interface-design-independent-human-review.md`
- `docs/work/plans/P-7b4e3c12-design-context-library.md`
- `docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md`
- `packages/cli/scripts/copy-skill-packs.mjs`
- `packages/cli/src/__tests__/design-context-library.test.ts`
- `packages/cli/src/__tests__/product-interface-design-showcase.test.ts`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/skill-context-resolution.test.ts`
- `packages/cli/src/__tests__/skill-evaluations.test.ts`
- `packages/cli/src/__tests__/skill-packs.test.ts`
- `packages/cli/src/benchmarks/external-skill-portability.ts`
- `packages/cli/src/benchmarks/product-interface-design-efficacy.ts`
- `packages/runtime/src/application/skills/skill-context.service.ts`
- `packages/runtime/src/application/skills/skill-evaluations.service.ts`
- `skill-packs/ui/product-interface-design/design-context/evaluations/candidate.matrix.json`
- `skill-packs/ui/product-interface-design/design-context/evaluations/promotion.matrix.json`
- `skill-packs/ui/product-interface-design/design-context/evaluations/release.matrix.json`
- `skill-packs/ui/product-interface-design/design-context/library.json`
- `skill-packs/ui/product-interface-design/guidance/behavior.md`
- `skill-packs/ui/product-interface-design/guidance/finish.md`
- `skill-packs/ui/product-interface-design/guidance/structure.md`
- `skill-packs/ui/product-interface-design/pack.json`
- `tools/skopos/skills/ui.product-interface-design.json`

## Ownership Expansions

- `2026-08-10T10:06:06.430Z` by `codex-release-finalization`: `docs/architecture/design-context-model.md`, `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`, `packages/cli/src/__tests__/release-install-smoke.test.ts`, `packages/cli/src/__tests__/skill-context-resolution.test.ts`, `packages/cli/src/benchmarks/product-interface-design-efficacy.ts`, `skill-packs/ui/product-interface-design/design-context/evaluations/promotion.matrix.json`, `skill-packs/ui/product-interface-design/design-context/library.json`, `skill-packs/ui/product-interface-design/pack.json`, `tools/skopos/skills/ui.product-interface-design.json` — The exact full evaluation found a transferable completeness-floor gap; preserve the failed matrix and add a separately frozen promotion holdout without expanding the Skill's three-module public model.
- `2026-08-10T10:56:19.935Z` by `codex-release-finalization`: `docs/guides/product-interface-design-independent-human-review.md`, `packages/cli/src/__tests__/skill-evaluations.test.ts`, `packages/runtime/src/application/skills/skill-context.service.ts`, `skill-packs/ui/product-interface-design/design-context/evaluations/candidate.matrix.json`, `skill-packs/ui/product-interface-design/design-context/evaluations/release.matrix.json`, `skill-packs/ui/product-interface-design/guidance/behavior.md`, `skill-packs/ui/product-interface-design/guidance/finish.md`, `skill-packs/ui/product-interface-design/guidance/structure.md` — The fresh promotion holdout exposed a general prompt-density and first-render completeness defect; own the generic renderer, compact three-module guidance, historical matrix status, fresh release holdout, focused proof, and human-review handoff without touching unrelated homepage work.
- `2026-08-10T11:00:07.495Z` by `codex-release-finalization`: `packages/cli/src/__tests__/design-context-library.test.ts`, `packages/cli/src/__tests__/product-interface-design-showcase.test.ts`, `packages/cli/src/__tests__/skill-packs.test.ts`, `packages/cli/src/benchmarks/external-skill-portability.ts` — The successor exact Skill identity advances to 0.5.0; own every focused version assertion and packed portability check needed to prove that identity consistently.
- `2026-08-10T11:10:54.966Z` by `codex-release-finalization`: `docs/architecture/public-package-content-and-provenance.md`, `packages/cli/scripts/copy-skill-packs.mjs` — The optional Design Context extension failed the release smoke; own the public asset boundary and provenance Memory needed to keep the three-module Product Interface Design core while deferring unproven Context assets from the 0.1.0 tarball.
- `2026-08-10T11:13:44.690Z` by `codex-release-finalization`: `packages/runtime/src/application/skills/skill-evaluations.service.ts` — The frozen core release holdout requires an explicit, fail-closed no-Skill custom comparison; own the generic comparison contract and regression proof instead of weakening module validation implicitly.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [ ] **Resolve plan decisions** (implementation, pending) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [ ] **Record Task risk and detail before editing** (implementation, pending) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [ ] **Review the current pattern in Skopos Workspace** (implementation, pending) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Certify the pre-public Product Interface Design release gate" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Refresh self-hosted knowledge state** (action, complete) — Required by Guard knowledge.refresh.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `maintenance.refresh-knowledge`: Required by Guard knowledge.refresh.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `knowledge.refresh`
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- The exact current Product Interface Design and Design Context identities pass the full paired efficacy evaluation without authority, safety, containment, or budget regression (closure, agent-observation)
- Independent blind human adjudication is prepared from label-safe artifacts and completed by an eligible reviewer (closure, agent-observation)
- Packed external-project portability matches the exact identity intended for the release tarball (closure, agent-observation)
- The release Plan and Skill Finding state only claims supported by immutable Evidence (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/public-package-content-and-provenance.md; review and synchronize it if project truth changes. (target: `docs/architecture/public-package-content-and-provenance.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/design-context-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/design-context-model.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-0408f13f",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-10T09:19:46.142Z",
  "updatedAt": "2026-08-10T11:50:32.842Z",
  "planIds": [],
  "childTasks": [],
  "state": "deferred",
  "detail": "detailed",
  "title": "Certify the pre-public Product Interface Design release gate",
  "goal": "Certify the pre-public Product Interface Design release gate",
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
      "The exact current Product Interface Design and Design Context identities pass the full paired efficacy evaluation without authority, safety, containment, or budget regression",
      "Independent blind human adjudication is prepared from label-safe artifacts and completed by an eligible reviewer",
      "Packed external-project portability matches the exact identity intended for the release tarball",
      "The release Plan and Skill Finding state only claims supported by immutable Evidence"
    ],
    "nonGoals": [
      "Publish the package, change repository visibility, or promote the npm dist tag"
    ],
    "constraints": [
      "Do not weaken or remove Product Interface Design to make the gate pass"
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
      "ownedPathCount": 3,
      "affectedScopeIds": [
        "skopos"
      ],
      "impactCategories": [
        "docs"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-db5c60fc8ecb27f1"
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
      "id": "decision-plan.public-api-change",
      "kind": "decision",
      "title": "Should this plan change a public contract, route, or SDK surface?",
      "detail": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "status": "complete"
    },
    {
      "id": "step-resolve-decisions",
      "kind": "implementation",
      "title": "Resolve plan decisions",
      "detail": "Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.",
      "status": "pending"
    },
    {
      "id": "step-record-task-risk",
      "kind": "implementation",
      "title": "Record Task risk and detail before editing",
      "detail": "Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.",
      "status": "pending"
    },
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in Skopos Workspace",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "pending"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Certify the pre-public Product Interface Design release gate\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "pending"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "pending"
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
        "packages/cli/scripts/copy-skill-packs.mjs",
        "packages/cli/src/__tests__/design-context-library.test.ts",
        "packages/cli/src/__tests__/product-interface-design-showcase.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/skill-context-resolution.test.ts",
        "packages/cli/src/__tests__/skill-evaluations.test.ts",
        "packages/cli/src/__tests__/skill-packs.test.ts",
        "packages/cli/src/benchmarks/external-skill-portability.ts",
        "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
        "packages/runtime/src/application/skills/skill-context.service.ts",
        "packages/runtime/src/application/skills/skill-evaluations.service.ts"
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
      "acceptanceCriterion": "The exact current Product Interface Design and Design Context identities pass the full paired efficacy evaluation without authority, safety, containment, or budget regression",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Independent blind human adjudication is prepared from label-safe artifacts and completed by an eligible reviewer",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Packed external-project portability matches the exact identity intended for the release tarball",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The release Plan and Skill Finding state only claims supported by immutable Evidence",
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
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope skopos.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed the canonical root architecture; the release-gate outcome changes Design Context and package-boundary truth but does not change the root architecture contract.",
      "resolvedAt": "2026-08-10T11:48:38.990Z",
      "resolvedByActorId": "codex-release-finalization"
    },
    {
      "id": "memory-architecture-3c55049580",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/public-package-content-and-provenance.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/public-package-content-and-provenance.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical public package boundary to retain the Product Interface Design core and exclude the four failed Design Context development assets.",
      "resolvedAt": "2026-08-10T11:48:52.179Z",
      "resolvedByActorId": "codex-release-finalization"
    },
    {
      "id": "memory-architecture-f0625bf606",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/design-context-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/design-context-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the Design Context architecture with the failed behavioral gates, active rollback boundary, and deferred activation/public packaging.",
      "resolvedAt": "2026-08-10T11:48:53.629Z",
      "resolvedByActorId": "codex-release-finalization"
    },
    {
      "id": "memory-decision-5e228f0160",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the accepted Skill projection decision with the exact failed efficacy evidence and retained three-module core identity.",
      "resolvedAt": "2026-08-10T11:48:55.069Z",
      "resolvedByActorId": "codex-release-finalization"
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
      "resolvedOptionId": "keep-workspace-scope",
      "resolvedAt": "2026-08-10T09:19:54.836Z",
      "resolvedByActorId": "codex-release-finalization"
    },
    {
      "id": "plan.public-api-change",
      "category": "public-api",
      "escalation": "must-ask",
      "question": "Should this plan change a public contract, route, or SDK surface?",
      "whyItMatters": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "recommendedOptionId": "confirm-contract-first",
      "options": [
        {
          "id": "confirm-contract-first",
          "label": "Confirm contract first",
          "rationale": "Recommended because contract decisions should be explicit before implementation starts."
        },
        {
          "id": "internal-only-change",
          "label": "Keep change internal",
          "rationale": "Use this when the goal should not affect public behavior or external consumers."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "internal-only-change",
      "resolvedAt": "2026-08-10T09:19:55.871Z",
      "resolvedByActorId": "codex-release-finalization"
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
      "id": "resolve-plan.public-api-change",
      "title": "Resolve: Should this plan change a public contract, route, or SDK surface?",
      "summary": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.public-api-change",
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
  "ownershipExpansions": [
    {
      "paths": [
        "docs/architecture/design-context-model.md",
        "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/skill-context-resolution.test.ts",
        "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
        "skill-packs/ui/product-interface-design/design-context/evaluations/promotion.matrix.json",
        "skill-packs/ui/product-interface-design/design-context/library.json",
        "skill-packs/ui/product-interface-design/pack.json",
        "tools/skopos/skills/ui.product-interface-design.json"
      ],
      "reason": "The exact full evaluation found a transferable completeness-floor gap; preserve the failed matrix and add a separately frozen promotion holdout without expanding the Skill's three-module public model.",
      "actorId": "codex-release-finalization",
      "recordedAt": "2026-08-10T10:06:06.430Z",
      "baselinePaths": [
        {
          "path": "docs/architecture/design-context-model.md",
          "digest": "50c68febe0481b26351bb04fb4ebec9c76198d5d6f13ed54fffee73c59b98cb5"
        },
        {
          "path": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
          "digest": "9e46f4ec24e06dd9585818c942bc624ce632a92a016a660d70f1b3c87133dd82"
        },
        {
          "path": "packages/cli/src/__tests__/release-install-smoke.test.ts",
          "digest": "ceab86792b758ffa9c08cb322e80ff6cbe8a96fe607f05fbd72f0d7a10574b92"
        },
        {
          "path": "packages/cli/src/__tests__/skill-context-resolution.test.ts",
          "digest": "356d8b921c41145d65118d75b795c4deeaf7205e6e48ea5cbdba48c5d195c6fa"
        },
        {
          "path": "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
          "digest": "fd75781525fd568f970e78e9cdf5619ee043cbfe7ef8d7195b9b72abb8ade34c"
        },
        {
          "path": "skill-packs/ui/product-interface-design/design-context/evaluations/promotion.matrix.json",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "skill-packs/ui/product-interface-design/design-context/library.json",
          "digest": "a4f00df82e7c8879e6cb040eb5009e88dc24838fa388e91cc3e06dbc10959f61"
        },
        {
          "path": "skill-packs/ui/product-interface-design/pack.json",
          "digest": "50cad4d2fa4fad7b3963b33ee8c556c9829ab0f2b7d5882d0976bcf431a157d0"
        },
        {
          "path": "tools/skopos/skills/ui.product-interface-design.json",
          "digest": "a34a418f948a1fbfe8b1aec34dbd39707cd6980367dcbdb6cf3df6b2f3dc88f8"
        }
      ]
    },
    {
      "paths": [
        "docs/guides/product-interface-design-independent-human-review.md",
        "packages/cli/src/__tests__/skill-evaluations.test.ts",
        "packages/runtime/src/application/skills/skill-context.service.ts",
        "skill-packs/ui/product-interface-design/design-context/evaluations/candidate.matrix.json",
        "skill-packs/ui/product-interface-design/design-context/evaluations/release.matrix.json",
        "skill-packs/ui/product-interface-design/guidance/behavior.md",
        "skill-packs/ui/product-interface-design/guidance/finish.md",
        "skill-packs/ui/product-interface-design/guidance/structure.md"
      ],
      "reason": "The fresh promotion holdout exposed a general prompt-density and first-render completeness defect; own the generic renderer, compact three-module guidance, historical matrix status, fresh release holdout, focused proof, and human-review handoff without touching unrelated homepage work.",
      "actorId": "codex-release-finalization",
      "recordedAt": "2026-08-10T10:56:19.935Z",
      "baselinePaths": [
        {
          "path": "docs/guides/product-interface-design-independent-human-review.md",
          "digest": "09ef6d88898b0286cbea5be2e943de32a1b4db71e4ed8dd7507da09a4751e0d0"
        },
        {
          "path": "packages/cli/src/__tests__/skill-evaluations.test.ts",
          "digest": "ae1c8c2989e8af392b3f7d686f5ced9bc4c3adcc1f9b5bc31e5e2878b779c635"
        },
        {
          "path": "packages/runtime/src/application/skills/skill-context.service.ts",
          "digest": "b2c6b9b111475a9d8ba4d40b20e167740750f02b4c23b3d8c5d9bd1e1f63c2c4"
        },
        {
          "path": "skill-packs/ui/product-interface-design/design-context/evaluations/candidate.matrix.json",
          "digest": "b2e411f776e31c98a14e2d2f236e276a89dd13754c9cf1387b30bf28ecc60fbe"
        },
        {
          "path": "skill-packs/ui/product-interface-design/design-context/evaluations/release.matrix.json",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "skill-packs/ui/product-interface-design/guidance/behavior.md",
          "digest": "92bd31242c27a7ad844361a98d3f675364c8410e663607c1bb0a0628f41c810f"
        },
        {
          "path": "skill-packs/ui/product-interface-design/guidance/finish.md",
          "digest": "e0606f6448be9e33c8fe5e4c10ab5e86d50aeebd76b4952c6d4b2cfcdd89f13d"
        },
        {
          "path": "skill-packs/ui/product-interface-design/guidance/structure.md",
          "digest": "3229a7bace2f1f01f33ff9c05730c4d286f7d4772be28db998c24ad75c0c8f32"
        }
      ]
    },
    {
      "paths": [
        "packages/cli/src/__tests__/design-context-library.test.ts",
        "packages/cli/src/__tests__/product-interface-design-showcase.test.ts",
        "packages/cli/src/__tests__/skill-packs.test.ts",
        "packages/cli/src/benchmarks/external-skill-portability.ts"
      ],
      "reason": "The successor exact Skill identity advances to 0.5.0; own every focused version assertion and packed portability check needed to prove that identity consistently.",
      "actorId": "codex-release-finalization",
      "recordedAt": "2026-08-10T11:00:07.495Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/__tests__/design-context-library.test.ts",
          "digest": "0ed3894f5ab62c09ba73a1a08b9a6e53381c3e4ce89547984e68b87065cb531d"
        },
        {
          "path": "packages/cli/src/__tests__/product-interface-design-showcase.test.ts",
          "digest": "666da20a6e909f8b6eedcf0348248a640c4d06b121df703c79650249a308c83b"
        },
        {
          "path": "packages/cli/src/__tests__/skill-packs.test.ts",
          "digest": "0f8d3c6fb46fc7aa688eeb42bd7d41a175fc3020ca519124103cf90be274fcb6"
        },
        {
          "path": "packages/cli/src/benchmarks/external-skill-portability.ts",
          "digest": "22dbd0f09ef06c64bafb276c6b3f4f947c5fecd6c1624c7a195867ecffeecf1d"
        }
      ]
    },
    {
      "paths": [
        "docs/architecture/public-package-content-and-provenance.md",
        "packages/cli/scripts/copy-skill-packs.mjs"
      ],
      "reason": "The optional Design Context extension failed the release smoke; own the public asset boundary and provenance Memory needed to keep the three-module Product Interface Design core while deferring unproven Context assets from the 0.1.0 tarball.",
      "actorId": "codex-release-finalization",
      "recordedAt": "2026-08-10T11:10:54.966Z",
      "baselinePaths": [
        {
          "path": "docs/architecture/public-package-content-and-provenance.md",
          "digest": "f57ea9ade39803407fbb92a1acdc5d513a44260d3471e00f22e3969a76ca6388"
        },
        {
          "path": "packages/cli/scripts/copy-skill-packs.mjs",
          "digest": "759071b50f2a2cc6179f11143d82d189ba9f0c78a352ce0bd4169d1b1c4a580f"
        }
      ]
    },
    {
      "paths": [
        "packages/runtime/src/application/skills/skill-evaluations.service.ts"
      ],
      "reason": "The frozen core release holdout requires an explicit, fail-closed no-Skill custom comparison; own the generic comparison contract and regression proof instead of weakening module validation implicitly.",
      "actorId": "codex-release-finalization",
      "recordedAt": "2026-08-10T11:13:44.690Z",
      "baselinePaths": [
        {
          "path": "packages/runtime/src/application/skills/skill-evaluations.service.ts",
          "digest": "6b4af35c12b65f843e25a794b7bc013b515feb0157f48fe0f44dbd1936909e37"
        }
      ]
    }
  ],
  "disposition": {
    "kind": "defer",
    "reason": "Release certification is not achievable on the exact Product Interface Design 0.5.0 identity: the mandatory no-Skill smoke lost 0-1, so full efficacy proof and independent human adjudication are ineligible. Product Interface Design remains required; Design Context is unbound and excluded pending a separately accepted redesign with a fresh holdout.",
    "actorId": "codex-release-finalization",
    "recordedAt": "2026-08-10T11:50:32.842Z",
    "priorState": "active",
    "nextState": "deferred"
  },
  "declaredOwnedPaths": [
    "docs/architecture/design-context-model.md",
    "docs/architecture/public-package-content-and-provenance.md",
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/guides/product-interface-design-independent-human-review.md",
    "docs/work/plans/P-7b4e3c12-design-context-library.md",
    "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md",
    "packages/cli/scripts/copy-skill-packs.mjs",
    "packages/cli/src/__tests__/design-context-library.test.ts",
    "packages/cli/src/__tests__/product-interface-design-showcase.test.ts",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/skill-context-resolution.test.ts",
    "packages/cli/src/__tests__/skill-evaluations.test.ts",
    "packages/cli/src/__tests__/skill-packs.test.ts",
    "packages/cli/src/benchmarks/external-skill-portability.ts",
    "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
    "packages/runtime/src/application/skills/skill-context.service.ts",
    "packages/runtime/src/application/skills/skill-evaluations.service.ts",
    "skill-packs/ui/product-interface-design/design-context/evaluations/candidate.matrix.json",
    "skill-packs/ui/product-interface-design/design-context/evaluations/promotion.matrix.json",
    "skill-packs/ui/product-interface-design/design-context/evaluations/release.matrix.json",
    "skill-packs/ui/product-interface-design/design-context/library.json",
    "skill-packs/ui/product-interface-design/guidance/behavior.md",
    "skill-packs/ui/product-interface-design/guidance/finish.md",
    "skill-packs/ui/product-interface-design/guidance/structure.md",
    "skill-packs/ui/product-interface-design/pack.json",
    "tools/skopos/skills/ui.product-interface-design.json"
  ]
}
```
<!-- skopos:task-state:end -->
