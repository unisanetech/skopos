---
title: "Task: Certify Product Interface Design 0.3.0 efficacy and prepare independent blind review"
status: complete
owner: "codex-interface-design"
id: T-20edad31
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-3fb3cc56e931cba7
lastUpdated: 2026-08-09
---

# Task: Certify Product Interface Design 0.3.0 efficacy and prepare independent blind review

## Changelog

- `2026-08-09`: Synchronized Task state `complete` from Skopos.

## Goal

Certify Product Interface Design 0.3.0 efficacy and prepare independent blind review

## Acceptance

- The exact accepted Product Interface Design 0.3.0 source, binding, fixtures, rubric, benchmark, and environment identities are frozen before execution.
- The zero-model smoke preflight passes without model calls or token use.
- Any real smoke execution occurs only after explicit authorization and produces a valid identity-bound report with containment, authority, latency, and token evidence.
- A full eight-case paired run occurs only after an exact valid smoke, and its result is reported without outcome-driven input changes.
- An independent blind human-review packet and adjudication instructions are available without exposing candidate identity.
- Release gate R2 remains blocked unless current-source machine and independent-human thresholds both pass, and durable Finding and Plan truth is updated honestly.

## Non-Goals

- Do not tune the Skill, fixtures, rubric, prompts, or benchmark after seeing evaluation outcomes.
- Do not publish packages or declare public-release readiness in this Task.

## Constraints

- Do not execute paid/model-backed evaluation without explicit authorization for the exact 0.3.0 source.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.
- Reason: The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible.

## Owned Paths

- `docs/00-start-here.md`
- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/guides/product-interface-design-independent-human-review.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md`
- `packages/cli/package.json`
- `packages/cli/src/benchmarks/product-interface-design-efficacy.ts`
- `pnpm-lock.yaml`
- `skill-packs/ui/product-interface-design`
- `tools/skopos/actions/skill-product-interface-design-efficacy.yaml`
- `tools/skopos/skills/ui.product-interface-design.json`

## Ownership Expansions

- `2026-08-09T10:36:51.350Z` by `codex-interface-design`: `packages/cli/package.json`, `pnpm-lock.yaml` — The zero-model efficacy preflight revealed that the CLI benchmark imports @skopos/indexer without declaring its direct workspace development dependency; the manifest and lockfile must own the correction.
- `2026-08-09T11:53:11.222Z` by `codex-interface-design`: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`, `docs/guides/product-interface-design-independent-human-review.md` — The exact 0.3.0 full result changes the current Skill decision record, and the generated blinded bundles require a durable reviewer-facing protocol that does not reveal arm identity.
- `2026-08-09T11:54:30.720Z` by `codex-interface-design`: `docs/00-start-here.md` — The new independent human-review guide is a current release-gate workflow and must be discoverable from the canonical documentation router.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Certify Product Interface Design 0.3.0 efficacy and prepare independent blind review" inside the resolved scope before widening impact to adjacent areas.
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

- The exact accepted Product Interface Design 0.3.0 source, binding, fixtures, rubric, benchmark, and environment identities are frozen before execution. (closure, agent-observation)
- The zero-model smoke preflight passes without model calls or token use. (closure, agent-observation)
- Any real smoke execution occurs only after explicit authorization and produces a valid identity-bound report with containment, authority, latency, and token evidence. (closure, agent-observation)
- A full eight-case paired run occurs only after an exact valid smoke, and its result is reported without outcome-driven input changes. (closure, agent-observation)
- An independent blind human-review packet and adjudication instructions are available without exposing candidate identity. (closure, agent-observation)
- Release gate R2 remains blocked unless current-source machine and independent-human thresholds both pass, and durable Finding and Plan truth is updated honestly. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-20edad31",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T10:35:51.491Z",
  "updatedAt": "2026-08-09T12:11:50.102Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Certify Product Interface Design 0.3.0 efficacy and prepare independent blind review",
  "goal": "Certify Product Interface Design 0.3.0 efficacy and prepare independent blind review",
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
      "The exact accepted Product Interface Design 0.3.0 source, binding, fixtures, rubric, benchmark, and environment identities are frozen before execution.",
      "The zero-model smoke preflight passes without model calls or token use.",
      "Any real smoke execution occurs only after explicit authorization and produces a valid identity-bound report with containment, authority, latency, and token evidence.",
      "A full eight-case paired run occurs only after an exact valid smoke, and its result is reported without outcome-driven input changes.",
      "An independent blind human-review packet and adjudication instructions are available without exposing candidate identity.",
      "Release gate R2 remains blocked unless current-source machine and independent-human thresholds both pass, and durable Finding and Plan truth is updated honestly."
    ],
    "nonGoals": [
      "Do not tune the Skill, fixtures, rubric, prompts, or benchmark after seeing evaluation outcomes.",
      "Do not publish packages or declare public-release readiness in this Task."
    ],
    "constraints": [
      "Do not execute paid/model-backed evaluation without explicit authorization for the exact 0.3.0 source."
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
      "ownedPathCount": 7,
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
    "baselineId": "baseline-3fb3cc56e931cba7"
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
      "detail": "Carry out \"Certify Product Interface Design 0.3.0 efficacy and prepare independent blind review\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/package.json",
        "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
        "pnpm-lock.yaml"
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
      "acceptanceCriterion": "The exact accepted Product Interface Design 0.3.0 source, binding, fixtures, rubric, benchmark, and environment identities are frozen before execution.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The zero-model smoke preflight passes without model calls or token use.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Any real smoke execution occurs only after explicit authorization and produces a valid identity-bound report with containment, authority, latency, and token evidence.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "A full eight-case paired run occurs only after an exact valid smoke, and its result is reported without outcome-driven input changes.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "An independent blind human-review packet and adjudication instructions are available without exposing candidate identity.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-6",
      "acceptanceCriterion": "Release gate R2 remains blocked unless current-source machine and independent-human thresholds both pass, and durable Finding and Plan truth is updated honestly.",
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
      "resolutionReason": "The efficacy cycle changes observed release evidence and readiness status, not the canonical architecture contract; architecture Memory was reviewed and remains accurate.",
      "resolvedAt": "2026-08-09T12:05:32.857Z",
      "resolvedByActorId": "codex-interface-design"
    },
    {
      "id": "memory-decision-5e228f0160",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
      "resolution": "memory-updated",
      "resolutionReason": "Decision 040 now records the exact 0.3.0 smoke and full 4-4 inconclusive result, clean safety and budget evidence, prepared human-review protocol, and blocked R2 status.",
      "resolvedAt": "2026-08-09T12:05:35.333Z",
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
      "status": "resolved",
      "resolvedOptionId": "narrow-scope-first",
      "resolvedAt": "2026-08-09T10:36:18.546Z",
      "resolvedByActorId": "codex-interface-design"
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
        "packages/cli/package.json",
        "pnpm-lock.yaml"
      ],
      "reason": "The zero-model efficacy preflight revealed that the CLI benchmark imports @skopos/indexer without declaring its direct workspace development dependency; the manifest and lockfile must own the correction.",
      "actorId": "codex-interface-design",
      "recordedAt": "2026-08-09T10:36:51.350Z",
      "baselinePaths": [
        {
          "path": "packages/cli/package.json",
          "digest": "cb1897050c4471ba67c7e74d03f0b65abbb1d59f9f6659f15e1b08ab9ff9d26b"
        },
        {
          "path": "pnpm-lock.yaml",
          "digest": "459b6120ba60c01a1d39fdef0c7afdf487e82e82130d34dd68bbd3aacead5953"
        }
      ]
    },
    {
      "paths": [
        "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
        "docs/guides/product-interface-design-independent-human-review.md"
      ],
      "reason": "The exact 0.3.0 full result changes the current Skill decision record, and the generated blinded bundles require a durable reviewer-facing protocol that does not reveal arm identity.",
      "actorId": "codex-interface-design",
      "recordedAt": "2026-08-09T11:53:11.222Z",
      "baselinePaths": [
        {
          "path": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
          "digest": "d9d0b7bd758c2182a80dfe39d5ea7f704b99cc1cca8c163db716c830111acc02"
        },
        {
          "path": "docs/guides/product-interface-design-independent-human-review.md",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ]
    },
    {
      "paths": [
        "docs/00-start-here.md"
      ],
      "reason": "The new independent human-review guide is a current release-gate workflow and must be discoverable from the canonical documentation router.",
      "actorId": "codex-interface-design",
      "recordedAt": "2026-08-09T11:54:30.720Z",
      "baselinePaths": [
        {
          "path": "docs/00-start-here.md",
          "digest": "e84a52f1fd07732a6236e90c2d9289280dc2fc58f55dc618d9982fd00429d311"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/00-start-here.md",
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/guides/product-interface-design-independent-human-review.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md",
    "packages/cli/package.json",
    "packages/cli/src/benchmarks/product-interface-design-efficacy.ts",
    "pnpm-lock.yaml",
    "skill-packs/ui/product-interface-design",
    "tools/skopos/actions/skill-product-interface-design-efficacy.yaml",
    "tools/skopos/skills/ui.product-interface-design.json"
  ]
}
```
<!-- skopos:task-state:end -->
