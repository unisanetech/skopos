---
title: "Task: Deliver the reviewed Design Context Library, deterministic resolver, portability proof, and evaluation preparation"
status: complete
owner: "codex"
id: T-497629a9
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-257238b49d72d11b
lastUpdated: 2026-08-09
---

# Task: Deliver the reviewed Design Context Library, deterministic resolver, portability proof, and evaluation preparation

## Changelog

- `2026-08-09`: Synchronized Task state `complete` from Skopos.

## Goal

Deliver the reviewed Design Context Library, deterministic resolver, portability proof, and evaluation preparation

## Acceptance

- A small source-grounded Library covers the four approved domains and six experiences with dated provenance, limitations, originality constraints, review dates, and exact digests.
- The resolver preserves project authority, selects bounded applicable guides and active signals, excludes ambiguity, irrelevance, expiry, retirement, and public-page ownership, and explains every suppression.
- Design Context consumes the existing Task-wide Skill budget and exact Library, pack, binding, project-authority, selector, and Task inputs invalidate stale Context Brief reuse.
- Product Interface Design remains exactly Structure, Behavior, and Finish; generic Skopos core contains no design-specific vocabulary, domains, source candidates, or visual rules.
- Deterministic fixtures cover every initial domain and experience plus negative, ambiguous, hybrid, precedence, expiry, retirement, budget, saturated-signal, public-page, and identity cases without network or model calls.
- Source and packed-install proof load the same Library and produce equivalent deterministic Context Brief identity and selection.
- Behavioral evaluation and real-project pilot inputs are prepared honestly without claiming human acceptance or efficacy.

## Non-Goals

- Do not claim independent human efficacy, activate a release gate, publish, push, or globally install.
- Do not implement public-page narrative, persuasion, conversion, or search-intent guidance.

## Constraints

- Keep capability-specific Design Context content and vocabulary outside generic core code.
- Preserve unrelated dirty-worktree changes outside this Task proof boundary.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `automatic`
- Reason: Declared ownership affects 4 non-workspace Scopes.

## Owned Paths

- `docs/architecture/design-context-model.md`
- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-7b4e3c12-design-context-library.md`
- `fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json`
- `package.json`
- `packages/cli/package.json`
- `packages/cli/scripts/copy-skill-packs.mjs`
- `packages/cli/src/__tests__/design-context-library.test.ts`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/skill-context-resolution.test.ts`
- `packages/cli/src/__tests__/skill-packs.test.ts`
- `packages/indexer/src/application/load-skill-context-library/load-skill-context-library.service.ts`
- `packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts`
- `packages/model/src/contracts/skopos-skill-context.ts`
- `packages/model/src/contracts/skopos-skill-pack.ts`
- `packages/runtime/src/application/skills`
- `packages/runtime/src/index.ts`
- `skill-packs/ui/product-interface-design`
- `tools/skopos/skills/ui.product-interface-design.json`

## Ownership Expansions

- `2026-08-09T17:37:55.222Z` by `codex`: `packages/cli/src/__tests__/skill-context-resolution.test.ts` — Add deterministic resolver, precedence, budget, invalidation, and packed-source regression proof.
- `2026-08-09T17:38:03.823Z` by `codex`: `fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json`, `packages/runtime/src/index.ts` — Adopt reviewed generic contract fixture and runtime export changes required by the resolver.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Deliver the reviewed Design Context Library, deterministic resolver, portability proof, and evaluation preparation" inside the resolved scope before widening impact to adjacent areas.
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

- A small source-grounded Library covers the four approved domains and six experiences with dated provenance, limitations, originality constraints, review dates, and exact digests. (closure, agent-observation)
- The resolver preserves project authority, selects bounded applicable guides and active signals, excludes ambiguity, irrelevance, expiry, retirement, and public-page ownership, and explains every suppression. (closure, agent-observation)
- Design Context consumes the existing Task-wide Skill budget and exact Library, pack, binding, project-authority, selector, and Task inputs invalidate stale Context Brief reuse. (closure, agent-observation)
- Product Interface Design remains exactly Structure, Behavior, and Finish; generic Skopos core contains no design-specific vocabulary, domains, source candidates, or visual rules. (closure, agent-observation)
- Deterministic fixtures cover every initial domain and experience plus negative, ambiguous, hybrid, precedence, expiry, retirement, budget, saturated-signal, public-page, and identity cases without network or model calls. (closure, agent-observation)
- Source and packed-install proof load the same Library and produce equivalent deterministic Context Brief identity and selection. (closure, agent-observation)
- Behavioral evaluation and real-project pilot inputs are prepared honestly without claiming human acceptance or efficacy. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/design-context-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/design-context-model.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-497629a9",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T17:25:05.518Z",
  "updatedAt": "2026-08-09T18:01:53.033Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Deliver the reviewed Design Context Library, deterministic resolver, portability proof, and evaluation preparation",
  "goal": "Deliver the reviewed Design Context Library, deterministic resolver, portability proof, and evaluation preparation",
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
      "A small source-grounded Library covers the four approved domains and six experiences with dated provenance, limitations, originality constraints, review dates, and exact digests.",
      "The resolver preserves project authority, selects bounded applicable guides and active signals, excludes ambiguity, irrelevance, expiry, retirement, and public-page ownership, and explains every suppression.",
      "Design Context consumes the existing Task-wide Skill budget and exact Library, pack, binding, project-authority, selector, and Task inputs invalidate stale Context Brief reuse.",
      "Product Interface Design remains exactly Structure, Behavior, and Finish; generic Skopos core contains no design-specific vocabulary, domains, source candidates, or visual rules.",
      "Deterministic fixtures cover every initial domain and experience plus negative, ambiguous, hybrid, precedence, expiry, retirement, budget, saturated-signal, public-page, and identity cases without network or model calls.",
      "Source and packed-install proof load the same Library and produce equivalent deterministic Context Brief identity and selection.",
      "Behavioral evaluation and real-project pilot inputs are prepared honestly without claiming human acceptance or efficacy."
    ],
    "nonGoals": [
      "Do not claim independent human efficacy, activate a release gate, publish, push, or globally install.",
      "Do not implement public-page narrative, persuasion, conversion, or search-intent guidance."
    ],
    "constraints": [
      "Keep capability-specific Design Context content and vocabulary outside generic core code.",
      "Preserve unrelated dirty-worktree changes outside this Task proof boundary."
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
      "Declared ownership affects 4 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 17,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-indexer",
        "skopos-model",
        "skopos-runtime"
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
    "baselineId": "baseline-257238b49d72d11b"
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
      "detail": "Carry out \"Deliver the reviewed Design Context Library, deterministic resolver, portability proof, and evaluation preparation\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/scripts/copy-skill-packs.mjs",
        "packages/cli/src/__tests__/design-context-library.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/skill-context-resolution.test.ts",
        "packages/cli/src/__tests__/skill-packs.test.ts",
        "packages/indexer/src/application/load-skill-context-library/load-skill-context-library.service.ts",
        "packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts",
        "packages/model/src/contracts/skopos-skill-context.ts",
        "packages/model/src/contracts/skopos-skill-pack.ts",
        "packages/runtime/src/application/skills",
        "packages/runtime/src/index.ts"
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
      "acceptanceCriterion": "A small source-grounded Library covers the four approved domains and six experiences with dated provenance, limitations, originality constraints, review dates, and exact digests.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The resolver preserves project authority, selects bounded applicable guides and active signals, excludes ambiguity, irrelevance, expiry, retirement, and public-page ownership, and explains every suppression.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Design Context consumes the existing Task-wide Skill budget and exact Library, pack, binding, project-authority, selector, and Task inputs invalidate stale Context Brief reuse.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Product Interface Design remains exactly Structure, Behavior, and Finish; generic Skopos core contains no design-specific vocabulary, domains, source candidates, or visual rules.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Deterministic fixtures cover every initial domain and experience plus negative, ambiguous, hybrid, precedence, expiry, retirement, budget, saturated-signal, public-page, and identity cases without network or model calls.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-6",
      "acceptanceCriterion": "Source and packed-install proof load the same Library and produce equivalent deterministic Context Brief identity and selection.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-7",
      "acceptanceCriterion": "Behavioral evaluation and real-project pilot inputs are prepared honestly without claiming human acceptance or efficacy.",
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
      "id": "memory-architecture-f0625bf606",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/design-context-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/design-context-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical Design Context architecture with the reviewed Library, generic resolver boundary, exact identity, justification, packed proof, and intentionally deferred live Task-selector activation.",
      "resolvedAt": "2026-08-09T17:58:19.273Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "memory-decision-5e228f0160",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated Decision 040 with the pack-owned Library, generic resolver boundary, explicit saturated-signal justification, final accepted identity, and honest remaining activation and efficacy gates.",
      "resolvedAt": "2026-08-09T17:58:27.226Z",
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
      "resolvedAt": "2026-08-09T17:27:02.088Z",
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
        "packages/cli/src/__tests__/skill-context-resolution.test.ts"
      ],
      "reason": "Add deterministic resolver, precedence, budget, invalidation, and packed-source regression proof.",
      "actorId": "codex",
      "recordedAt": "2026-08-09T17:37:55.222Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/__tests__/skill-context-resolution.test.ts",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ]
    },
    {
      "paths": [
        "fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json",
        "packages/runtime/src/index.ts"
      ],
      "reason": "Adopt reviewed generic contract fixture and runtime export changes required by the resolver.",
      "actorId": "codex",
      "recordedAt": "2026-08-09T17:38:03.823Z",
      "baselinePaths": [
        {
          "path": "fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json",
          "digest": "92aaac64e9a60fc15973dcc803ea5130fe0fbd47b2c3808485b45e8c488f25da"
        },
        {
          "path": "packages/runtime/src/index.ts",
          "digest": "2257c0f7cc0502b94c19f97b1d4bf6370938afe1e72d776e33c14f271e858d62"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/design-context-model.md",
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-7b4e3c12-design-context-library.md",
    "fixtures/skill-context/product-interface-design/phase-1.contract.fixture.json",
    "package.json",
    "packages/cli/package.json",
    "packages/cli/scripts/copy-skill-packs.mjs",
    "packages/cli/src/__tests__/design-context-library.test.ts",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/skill-context-resolution.test.ts",
    "packages/cli/src/__tests__/skill-packs.test.ts",
    "packages/indexer/src/application/load-skill-context-library/load-skill-context-library.service.ts",
    "packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts",
    "packages/model/src/contracts/skopos-skill-context.ts",
    "packages/model/src/contracts/skopos-skill-pack.ts",
    "packages/runtime/src/application/skills",
    "packages/runtime/src/index.ts",
    "skill-packs/ui/product-interface-design",
    "tools/skopos/skills/ui.product-interface-design.json"
  ]
}
```
<!-- skopos:task-state:end -->
