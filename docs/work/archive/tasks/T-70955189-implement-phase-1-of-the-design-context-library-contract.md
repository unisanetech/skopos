---
title: "Task: Implement Phase 1 of the Design Context Library contract and deterministic fixtures"
status: complete
owner: "codex"
id: T-70955189
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-7ea74e3e4e4b3b2e
lastUpdated: 2026-08-09
---

# Task: Implement Phase 1 of the Design Context Library contract and deterministic fixtures

## Changelog

- `2026-08-09`: Synchronized Task state `complete` from Skopos.

## Goal

Implement Phase 1 of the Design Context Library contract and deterministic fixtures

## Acceptance

- Canonical Domain Guide, Experience Guide, Design Signal, Source Note, Library, and Context Brief contracts are typed and validated without aliases.
- Validation rejects duplicate ids, broken relationships, invalid provenance or freshness, and inconsistent exact content digests.
- Representative positive, negative, ambiguous, expired, retired, multi-domain, and budget fixtures are frozen and validated without network or model calls.
- A Product Interface Design pack with no Design Context Library keeps its current selection behavior.

## Non-Goals

- Do not implement Task resolution or Context Brief selection in this Task.
- Do not author or accept the production Design Context Library in this Task.

## Constraints

- Preserve exactly three Product Interface Design modules: Structure, Behavior, and Finish.
- Do not absorb unrelated dirty-worktree changes into proof.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `automatic`
- Reason: Declared ownership affects 3 non-workspace Scopes.

## Owned Paths

- `docs/architecture/design-context-model.md`
- `docs/work/plans/P-7b4e3c12-design-context-library.md`
- `fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json`
- `package.json`
- `packages/cli/src/__tests__/design-context-library.test.ts`
- `packages/cli/src/__tests__/skill-packs.test.ts`
- `packages/indexer/src/application/load-design-context-library/load-design-context-library.service.ts`
- `packages/indexer/src/application/load-skill-context-library/load-skill-context-library.service.ts`
- `packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts`
- `packages/indexer/src/index.ts`
- `packages/model/src/contracts/skopos-design-context.ts`
- `packages/model/src/contracts/skopos-skill-context.ts`
- `packages/model/src/contracts/skopos-skill-pack.ts`
- `packages/model/src/index.ts`
- `skill-packs/ui/product-interface-design/design-context/fixtures`

## Ownership Expansions

- `2026-08-09T16:36:41.323Z` by `codex`: `packages/cli/src/__tests__/design-context-library.test.ts`, `packages/indexer/src/application/load-design-context-library/load-design-context-library.service.ts`, `packages/indexer/src/index.ts`, `packages/model/src/contracts/skopos-design-context.ts`, `packages/model/src/index.ts` — Use dedicated Design Context contract and loader owners so Phase 1 stays cohesive and does not overload the existing Skill pack manifest loader.
- `2026-08-09T16:43:40.094Z` by `codex`: `packages/indexer/src/application/load-skill-context-library/load-skill-context-library.service.ts`, `packages/model/src/contracts/skopos-skill-context.ts` — Keep reusable context-library infrastructure generic in Skopos core while the Product Interface Design pack owns Design Context vocabulary and content.
- `2026-08-09T16:52:36.155Z` by `codex`: `package.json` — Register the new focused contract suite in the repository's curated default CLI test command while preserving the pre-existing Product Interface Design script changes.
- `2026-08-09T16:53:54.700Z` by `codex`: `fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json` — Keep Phase 1 contract fixtures outside the accepted Product Interface Design pack digest so an absent Library does not invalidate or change current Skill behavior.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Implement Phase 1 of the Design Context Library contract and deterministic fixtures" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Canonical Domain Guide, Experience Guide, Design Signal, Source Note, Library, and Context Brief contracts are typed and validated without aliases. (closure, agent-observation)
- Validation rejects duplicate ids, broken relationships, invalid provenance or freshness, and inconsistent exact content digests. (closure, agent-observation)
- Representative positive, negative, ambiguous, expired, retired, multi-domain, and budget fixtures are frozen and validated without network or model calls. (closure, agent-observation)
- A Product Interface Design pack with no Design Context Library keeps its current selection behavior. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/design-context-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/design-context-model.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-70955189",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T16:34:58.362Z",
  "updatedAt": "2026-08-09T16:58:46.374Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Implement Phase 1 of the Design Context Library contract and deterministic fixtures",
  "goal": "Implement Phase 1 of the Design Context Library contract and deterministic fixtures",
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
      "Canonical Domain Guide, Experience Guide, Design Signal, Source Note, Library, and Context Brief contracts are typed and validated without aliases.",
      "Validation rejects duplicate ids, broken relationships, invalid provenance or freshness, and inconsistent exact content digests.",
      "Representative positive, negative, ambiguous, expired, retired, multi-domain, and budget fixtures are frozen and validated without network or model calls.",
      "A Product Interface Design pack with no Design Context Library keeps its current selection behavior."
    ],
    "nonGoals": [
      "Do not implement Task resolution or Context Brief selection in this Task.",
      "Do not author or accept the production Design Context Library in this Task."
    ],
    "constraints": [
      "Preserve exactly three Product Interface Design modules: Structure, Behavior, and Finish.",
      "Do not absorb unrelated dirty-worktree changes into proof."
    ]
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "automatic",
    "workflow": "strict",
    "reasons": [
      "Declared ownership affects 3 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 6,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-indexer",
        "skopos-model"
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
    "baselineId": "baseline-7ea74e3e4e4b3b2e"
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
      "detail": "Carry out \"Implement Phase 1 of the Design Context Library contract and deterministic fixtures\" inside the resolved scope before widening impact to adjacent areas.",
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
        "package.json",
        "packages/cli/src/__tests__/design-context-library.test.ts",
        "packages/cli/src/__tests__/skill-packs.test.ts",
        "packages/indexer/src/application/load-design-context-library/load-design-context-library.service.ts",
        "packages/indexer/src/application/load-skill-context-library/load-skill-context-library.service.ts",
        "packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts",
        "packages/indexer/src/index.ts",
        "packages/model/src/contracts/skopos-design-context.ts",
        "packages/model/src/contracts/skopos-skill-context.ts",
        "packages/model/src/contracts/skopos-skill-pack.ts",
        "packages/model/src/index.ts"
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
      "acceptanceCriterion": "Canonical Domain Guide, Experience Guide, Design Signal, Source Note, Library, and Context Brief contracts are typed and validated without aliases.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Validation rejects duplicate ids, broken relationships, invalid provenance or freshness, and inconsistent exact content digests.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Representative positive, negative, ambiguous, expired, retired, multi-domain, and budget fixtures are frozen and validated without network or model calls.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "A Product Interface Design pack with no Design Context Library keeps its current selection behavior.",
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
      "id": "memory-architecture-f0625bf606",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/design-context-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/design-context-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the Design Context architecture to record the generic Skill Context core boundary, capability-owned Design Context vocabulary, Phase 1 fixture placement outside the accepted pack digest, and current implementation status.",
      "resolvedAt": "2026-08-09T16:55:58.920Z",
      "resolvedByActorId": "codex"
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
      "resolvedAt": "2026-08-09T16:35:30.578Z",
      "resolvedByActorId": "codex"
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
      "resolvedOptionId": "confirm-contract-first",
      "resolvedAt": "2026-08-09T16:35:32.275Z",
      "resolvedByActorId": "codex"
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
        "packages/cli/src/__tests__/design-context-library.test.ts",
        "packages/indexer/src/application/load-design-context-library/load-design-context-library.service.ts",
        "packages/indexer/src/index.ts",
        "packages/model/src/contracts/skopos-design-context.ts",
        "packages/model/src/index.ts"
      ],
      "reason": "Use dedicated Design Context contract and loader owners so Phase 1 stays cohesive and does not overload the existing Skill pack manifest loader.",
      "actorId": "codex",
      "recordedAt": "2026-08-09T16:36:41.323Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/__tests__/design-context-library.test.ts",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "packages/indexer/src/application/load-design-context-library/load-design-context-library.service.ts",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "packages/indexer/src/index.ts",
          "digest": "56c90aae4f0e9697f99b87f246c0c254e87f0c9272d4d1e24126a540d07eef5f"
        },
        {
          "path": "packages/model/src/contracts/skopos-design-context.ts",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "packages/model/src/index.ts",
          "digest": "2e6a95bc73a03667adbe6b4144421bc9860b8dc6d2af33b15ed4885252ed3654"
        }
      ]
    },
    {
      "paths": [
        "packages/indexer/src/application/load-skill-context-library/load-skill-context-library.service.ts",
        "packages/model/src/contracts/skopos-skill-context.ts"
      ],
      "reason": "Keep reusable context-library infrastructure generic in Skopos core while the Product Interface Design pack owns Design Context vocabulary and content.",
      "actorId": "codex",
      "recordedAt": "2026-08-09T16:43:40.094Z",
      "baselinePaths": [
        {
          "path": "packages/indexer/src/application/load-skill-context-library/load-skill-context-library.service.ts",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        },
        {
          "path": "packages/model/src/contracts/skopos-skill-context.ts",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ]
    },
    {
      "paths": [
        "package.json"
      ],
      "reason": "Register the new focused contract suite in the repository's curated default CLI test command while preserving the pre-existing Product Interface Design script changes.",
      "actorId": "codex",
      "recordedAt": "2026-08-09T16:52:36.155Z",
      "baselinePaths": [
        {
          "path": "package.json",
          "digest": "ead885570e99cc4c64f157ed6839fd926c8c1ec70211cd41529a826f61c2cad8"
        }
      ]
    },
    {
      "paths": [
        "fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json"
      ],
      "reason": "Keep Phase 1 contract fixtures outside the accepted Product Interface Design pack digest so an absent Library does not invalidate or change current Skill behavior.",
      "actorId": "codex",
      "recordedAt": "2026-08-09T16:53:54.700Z",
      "baselinePaths": [
        {
          "path": "fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/design-context-model.md",
    "docs/work/plans/P-7b4e3c12-design-context-library.md",
    "fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json",
    "package.json",
    "packages/cli/src/__tests__/design-context-library.test.ts",
    "packages/cli/src/__tests__/skill-packs.test.ts",
    "packages/indexer/src/application/load-design-context-library/load-design-context-library.service.ts",
    "packages/indexer/src/application/load-skill-context-library/load-skill-context-library.service.ts",
    "packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts",
    "packages/indexer/src/index.ts",
    "packages/model/src/contracts/skopos-design-context.ts",
    "packages/model/src/contracts/skopos-skill-context.ts",
    "packages/model/src/contracts/skopos-skill-pack.ts",
    "packages/model/src/index.ts",
    "skill-packs/ui/product-interface-design/design-context/fixtures"
  ]
}
```
<!-- skopos:task-state:end -->
