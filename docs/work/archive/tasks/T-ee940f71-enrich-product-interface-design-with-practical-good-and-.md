---
title: "Task: Enrich Product Interface Design with practical good and bad patterns"
status: complete
owner: "codex-interface-design"
id: T-ee940f71
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-db028314321dad7f
lastUpdated: 2026-08-11
---

# Task: Enrich Product Interface Design with practical good and bad patterns

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Enrich Product Interface Design with practical good and bad patterns

## Acceptance

- Product Interface Design keeps exactly Structure, Behavior, and Finish while each guide contains concise Bad-to-Better examples for its owned judgments.
- Structure includes practical human interface writing patterns for actions, errors, empty states, confirmations, headings, help text, and technical leakage.
- Behavior includes practical reuse, responsive transformation, state, accessibility, and conditional React patterns; Finish includes practical hierarchy, containment, density, token, and visual-restraint patterns.
- The complete three-capability selection remains within the 1800-token standard-Task ceiling and all eight deterministic fixtures pass.
- The revised versioned exact source, accepted binding, tests, packed portability, public docs, and release proof agree; R2 remains blocked pending fresh efficacy and independent human review.

## Non-Goals

- Restore the former seven-module Skill structure.
- Add product strategy, marketing, backend, or framework-specific modules.
- Run paid efficacy evaluation during this guidance improvement.

## Constraints

- Product Interface Design remains a required public Skill owned and published by Unisane.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.
- Reason: The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible.

## Owned Paths

- `README.md`
- `docs/architecture/public-package-content-and-provenance.md`
- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `packages/cli/src/__tests__/skill-packs.test.ts`
- `packages/cli/src/benchmarks/external-skill-portability.ts`
- `skill-packs/ui/product-interface-design`
- `tools/skopos/skills/ui.product-interface-design.json`

## Ownership Expansions

- None recorded.

## Steps

- [ ] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, skipped) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Enrich Product Interface Design with practical good and bad patterns" inside the resolved scope before widening impact to adjacent areas.
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

- Product Interface Design keeps exactly Structure, Behavior, and Finish while each guide contains concise Bad-to-Better examples for its owned judgments. (closure, agent-observation)
- Structure includes practical human interface writing patterns for actions, errors, empty states, confirmations, headings, help text, and technical leakage. (closure, agent-observation)
- Behavior includes practical reuse, responsive transformation, state, accessibility, and conditional React patterns; Finish includes practical hierarchy, containment, density, token, and visual-restraint patterns. (closure, agent-observation)
- The complete three-capability selection remains within the 1800-token standard-Task ceiling and all eight deterministic fixtures pass. (closure, agent-observation)
- The revised versioned exact source, accepted binding, tests, packed portability, public docs, and release proof agree; R2 remains blocked pending fresh efficacy and independent human review. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/public-package-content-and-provenance.md; review and synchronize it if project truth changes. (target: `docs/architecture/public-package-content-and-provenance.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-ee940f71",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T10:21:24.853Z",
  "updatedAt": "2026-08-11T01:51:42.314Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Enrich Product Interface Design with practical good and bad patterns",
  "goal": "Enrich Product Interface Design with practical good and bad patterns",
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
      "Product Interface Design keeps exactly Structure, Behavior, and Finish while each guide contains concise Bad-to-Better examples for its owned judgments.",
      "Structure includes practical human interface writing patterns for actions, errors, empty states, confirmations, headings, help text, and technical leakage.",
      "Behavior includes practical reuse, responsive transformation, state, accessibility, and conditional React patterns; Finish includes practical hierarchy, containment, density, token, and visual-restraint patterns.",
      "The complete three-capability selection remains within the 1800-token standard-Task ceiling and all eight deterministic fixtures pass.",
      "The revised versioned exact source, accepted binding, tests, packed portability, public docs, and release proof agree; R2 remains blocked pending fresh efficacy and independent human review."
    ],
    "nonGoals": [
      "Restore the former seven-module Skill structure.",
      "Add product strategy, marketing, backend, or framework-specific modules.",
      "Run paid efficacy evaluation during this guidance improvement."
    ],
    "constraints": [
      "Product Interface Design remains a required public Skill owned and published by Unisane."
    ]
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "standard",
    "recommendedDetail": "standard",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.",
      "The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 9,
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
    "baselineId": "baseline-db028314321dad7f"
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
      "detail": "Carry out \"Enrich Product Interface Design with practical good and bad patterns\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/__tests__/skill-packs.test.ts",
        "packages/cli/src/benchmarks/external-skill-portability.ts"
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
      "acceptanceCriterion": "Product Interface Design keeps exactly Structure, Behavior, and Finish while each guide contains concise Bad-to-Better examples for its owned judgments.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Structure includes practical human interface writing patterns for actions, errors, empty states, confirmations, headings, help text, and technical leakage.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Behavior includes practical reuse, responsive transformation, state, accessibility, and conditional React patterns; Finish includes practical hierarchy, containment, density, token, and visual-restraint patterns.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The complete three-capability selection remains within the 1800-token standard-Task ceiling and all eight deterministic fixtures pass.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "The revised versioned exact source, accepted binding, tests, packed portability, public docs, and release proof agree; R2 remains blocked pending fresh efficacy and independent human review.",
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
      "resolutionReason": "Updated public package provenance to the required owner-authorized Product Interface Design 0.3.0 runtime identity.",
      "resolvedAt": "2026-08-09T10:29:36.374Z",
      "resolvedByActorId": "codex-interface-design"
    },
    {
      "id": "memory-decision-5e228f0160",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical Skill decision for the 0.3.0 practical-pattern enrichment, measured budget, accepted digest, and unchanged R2 blocker.",
      "resolvedAt": "2026-08-09T10:29:38.240Z",
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
        "recordedAt": "2026-08-11T01:51:42.314Z"
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
  "declaredOwnedPaths": [
    "README.md",
    "docs/architecture/public-package-content-and-provenance.md",
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "packages/cli/src/__tests__/skill-packs.test.ts",
    "packages/cli/src/benchmarks/external-skill-portability.ts",
    "skill-packs/ui/product-interface-design",
    "tools/skopos/skills/ui.product-interface-design.json"
  ]
}
```
<!-- skopos:task-state:end -->
