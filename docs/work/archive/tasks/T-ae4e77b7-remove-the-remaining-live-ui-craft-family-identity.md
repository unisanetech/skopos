---
title: "Task: Remove the remaining live ui-craft family identity"
status: complete
owner: "codex-interface-design"
id: T-ae4e77b7
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-420ac7fc7480b065
lastUpdated: 2026-08-11
---

# Task: Remove the remaining live ui-craft family identity

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Remove the remaining live ui-craft family identity

## Acceptance

- The Product Interface Design manifest family is interface-design and the public model and loader accept that family.
- No live runtime, package, test, binding, Action, or release surface contains ui-craft, Product UI Craft, product-craft, or product-ui-craft; historical Memory and immutable records remain unchanged.
- Focused loader tests, skill tests, typecheck, build, and canonical proof pass for the corrected exact source.
- Release gate R2 remains blocked until fresh efficacy and independent human review certify the corrected exact identity.

## Non-Goals

- Rewrite historical Memory, archived Tasks, snapshots, or frozen efficacy results.
- Run paid efficacy evaluation during this correction.

## Constraints

- Product Interface Design remains a required public Skill owned and published by Unisane.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: Declared ownership affects 2 non-workspace Scopes.

## Owned Paths

- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts`
- `packages/model/src/contracts/skopos-skill-pack.ts`
- `skill-packs/ui/product-interface-design/pack.json`
- `tools/skopos/skills/ui.product-interface-design.json`

## Ownership Expansions

- `2026-08-09T09:55:41.310Z` by `codex-interface-design`: `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`, `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`, `tools/skopos/skills/ui.product-interface-design.json` — Changing the public family identifier invalidates the accepted binding digest and the current release-plan/finding source identity; re-accept and synchronize only their current normative entries.

## Steps

- [ ] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, skipped) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Remove the remaining live ui-craft family identity" inside the resolved scope before widening impact to adjacent areas.
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

- The Product Interface Design manifest family is interface-design and the public model and loader accept that family. (closure, agent-observation)
- No live runtime, package, test, binding, Action, or release surface contains ui-craft, Product UI Craft, product-craft, or product-ui-craft; historical Memory and immutable records remain unchanged. (closure, agent-observation)
- Focused loader tests, skill tests, typecheck, build, and canonical proof pass for the corrected exact source. (closure, agent-observation)
- Release gate R2 remains blocked until fresh efficacy and independent human review certify the corrected exact identity. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-ae4e77b7",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T09:55:04.899Z",
  "updatedAt": "2026-08-11T01:51:39.456Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Remove the remaining live ui-craft family identity",
  "goal": "Remove the remaining live ui-craft family identity",
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
      "The Product Interface Design manifest family is interface-design and the public model and loader accept that family.",
      "No live runtime, package, test, binding, Action, or release surface contains ui-craft, Product UI Craft, product-craft, or product-ui-craft; historical Memory and immutable records remain unchanged.",
      "Focused loader tests, skill tests, typecheck, build, and canonical proof pass for the corrected exact source.",
      "Release gate R2 remains blocked until fresh efficacy and independent human review certify the corrected exact identity."
    ],
    "nonGoals": [
      "Rewrite historical Memory, archived Tasks, snapshots, or frozen efficacy results.",
      "Run paid efficacy evaluation during this correction."
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
      "Declared ownership affects 2 non-workspace Scopes."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 3,
      "affectedScopeIds": [
        "skopos",
        "skopos-indexer",
        "skopos-model"
      ],
      "impactCategories": [
        "scope-source",
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-420ac7fc7480b065"
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
      "detail": "Carry out \"Remove the remaining live ui-craft family identity\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts",
        "packages/model/src/contracts/skopos-skill-pack.ts"
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
      "acceptanceCriterion": "The Product Interface Design manifest family is interface-design and the public model and loader accept that family.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "No live runtime, package, test, binding, Action, or release surface contains ui-craft, Product UI Craft, product-craft, or product-ui-craft; historical Memory and immutable records remain unchanged.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Focused loader tests, skill tests, typecheck, build, and canonical proof pass for the corrected exact source.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Release gate R2 remains blocked until fresh efficacy and independent human review certify the corrected exact identity.",
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
      "resolutionReason": "The canonical architecture already defines generic project-adapted Skill families and authority boundaries; this correction changes one family enum value without changing that architecture.",
      "resolvedAt": "2026-08-09T10:01:30.627Z",
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
      "status": "dismissed",
      "disposition": {
        "kind": "dismissed",
        "reason": "Historical Task completed before terminal question invariants. The completed outcome superseded this non-blocking Scope suggestion; no answer is inferred.",
        "actorId": "codex",
        "recordedAt": "2026-08-11T01:51:39.456Z"
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
        "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
        "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
        "tools/skopos/skills/ui.product-interface-design.json"
      ],
      "reason": "Changing the public family identifier invalidates the accepted binding digest and the current release-plan/finding source identity; re-accept and synchronize only their current normative entries.",
      "actorId": "codex-interface-design",
      "recordedAt": "2026-08-09T09:55:41.310Z",
      "baselinePaths": [
        {
          "path": "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
          "digest": "b68a82c073b716a66cb46d705468ff39ddc3d08b0525865733574ffb8c74ce88"
        },
        {
          "path": "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
          "digest": "c09b1f29a137c739532750ba10685c937d740e240bd11ded9066dccd24388408"
        },
        {
          "path": "tools/skopos/skills/ui.product-interface-design.json",
          "digest": "20ba55accafd84f79725b5448753aec97b4ac5c6e66c4f99cde16e6c4e158b5f"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "packages/indexer/src/application/load-skill-packs/load-skill-packs.service.ts",
    "packages/model/src/contracts/skopos-skill-pack.ts",
    "skill-packs/ui/product-interface-design/pack.json",
    "tools/skopos/skills/ui.product-interface-design.json"
  ]
}
```
<!-- skopos:task-state:end -->
