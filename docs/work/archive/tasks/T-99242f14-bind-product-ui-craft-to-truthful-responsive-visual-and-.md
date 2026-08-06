---
title: "Task: Bind Product UI Craft to truthful responsive visual and accessibility proof"
status: complete
owner: "codex-ui-proof"
id: T-99242f14
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-22ba30f3c2dd5e52
lastUpdated: 2026-08-04
---

# Task: Bind Product UI Craft to truthful responsive visual and accessibility proof

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Bind Product UI Craft to truthful responsive visual and accessibility proof

## Acceptance

- A project-owned browser Action builds and renders the routed console at representative desktop and mobile viewports and writes screenshot plus machine-readable proof artifacts.
- The same browser proof performs automated accessibility analysis and fails on serious or critical violations instead of treating a generic observation as accessibility certification.
- Product UI Craft binds responsive visual capture and accessibility proof to the new specialized Action and Guard while keeping build and focused behavior proof separate.
- Focused tests prove routes render, screenshots are non-empty, horizontal overflow is detected, accessibility results are recorded, and browser/server resources are disposed.

## Non-Goals

- Do not redesign or certify the currently changing Skopos UI owned by the separate UI Task.
- Do not treat screenshots or automated accessibility analysis as subjective human visual approval.

## Constraints

- Reuse the project UI build and serve owners; do not add a second app build or server implementation.
- Browser proof must be headless, local-only, deterministic in route and viewport coverage, and write only declared generated artifacts.

## Owned Paths

- `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`
- `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`
- `docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
- `package.json`
- `packages/cli/package.json`
- `packages/cli/src/__tests__/ui-proof.test.ts`
- `packages/cli/src/scripts/capture-ui-proof.ts`
- `pnpm-lock.yaml`
- `tools/skopos/actions/ui-capture-responsive-proof.yaml`
- `tools/skopos/guards/ui-accessibility-proof.yaml`
- `tools/skopos/skills/ui.product-craft.json`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Bind Product UI Craft to truthful responsive visual and accessibility proof" inside the resolved scope before widening impact to adjacent areas.
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

- A project-owned browser Action builds and renders the routed console at representative desktop and mobile viewports and writes screenshot plus machine-readable proof artifacts. (closure, agent-observation)
- The same browser proof performs automated accessibility analysis and fails on serious or critical violations instead of treating a generic observation as accessibility certification. (closure, agent-observation)
- Product UI Craft binds responsive visual capture and accessibility proof to the new specialized Action and Guard while keeping build and focused behavior proof separate. (closure, agent-observation)
- Focused tests prove routes render, screenshots are non-empty, horizontal overflow is detected, accessibility results are recorded, and browser/server resources are disposed. (closure, agent-observation)
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
  "id": "T-99242f14",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T18:27:03.338Z",
  "updatedAt": "2026-08-04T20:26:17.648Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Bind Product UI Craft to truthful responsive visual and accessibility proof",
  "goal": "Bind Product UI Craft to truthful responsive visual and accessibility proof",
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
      "A project-owned browser Action builds and renders the routed console at representative desktop and mobile viewports and writes screenshot plus machine-readable proof artifacts.",
      "The same browser proof performs automated accessibility analysis and fails on serious or critical violations instead of treating a generic observation as accessibility certification.",
      "Product UI Craft binds responsive visual capture and accessibility proof to the new specialized Action and Guard while keeping build and focused behavior proof separate.",
      "Focused tests prove routes render, screenshots are non-empty, horizontal overflow is detected, accessibility results are recorded, and browser/server resources are disposed."
    ],
    "nonGoals": [
      "Do not redesign or certify the currently changing Skopos UI owned by the separate UI Task.",
      "Do not treat screenshots or automated accessibility analysis as subjective human visual approval."
    ],
    "constraints": [
      "Reuse the project UI build and serve owners; do not add a second app build or server implementation.",
      "Browser proof must be headless, local-only, deterministic in route and viewport coverage, and write only declared generated artifacts."
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-22ba30f3c2dd5e52"
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
      "detail": "Carry out \"Bind Product UI Craft to truthful responsive visual and accessibility proof\" inside the resolved scope before widening impact to adjacent areas.",
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
        "tools/skopos/actions/ui-capture-responsive-proof.yaml",
        "tools/skopos/guards/ui-accessibility-proof.yaml",
        "tools/skopos/skills/ui.product-craft.json"
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
        "packages/cli/src/scripts/capture-ui-proof.ts",
        "packages/cli/src/__tests__/ui-proof.test.ts",
        "package.json",
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
      "acceptanceCriterion": "A project-owned browser Action builds and renders the routed console at representative desktop and mobile viewports and writes screenshot plus machine-readable proof artifacts.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The same browser proof performs automated accessibility analysis and fails on serious or critical violations instead of treating a generic observation as accessibility certification.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Product UI Craft binds responsive visual capture and accessibility proof to the new specialized Action and Guard while keeping build and focused behavior proof separate.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused tests prove routes render, screenshots are non-empty, horizontal overflow is detected, accessibility results are recorded, and browser/server resources are disposed.",
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
      "resolutionReason": "Decision 040 now records the specialized proof boundary and the passing eight-capture automated Skopos canary without treating Axe as subjective visual approval.",
      "resolvedAt": "2026-08-04T20:23:33.029Z",
      "resolvedByActorId": "codex-ui-proof"
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
      "resolvedAt": "2026-08-04T18:27:13.072Z",
      "resolvedByActorId": "codex-ui-proof"
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
  "declaredOwnedPaths": [
    "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
    "docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md",
    "docs/work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md",
    "package.json",
    "packages/cli/package.json",
    "packages/cli/src/__tests__/ui-proof.test.ts",
    "packages/cli/src/scripts/capture-ui-proof.ts",
    "pnpm-lock.yaml",
    "tools/skopos/actions/ui-capture-responsive-proof.yaml",
    "tools/skopos/guards/ui-accessibility-proof.yaml",
    "tools/skopos/skills/ui.product-craft.json"
  ]
}
```
<!-- skopos:task-state:end -->
