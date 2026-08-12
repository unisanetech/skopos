---
title: "Task: Replace the homepage sidebar with a focused responsive top navigation"
status: complete
owner: "codex-homepage-build"
id: T-25dd4fd6
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-a7cb875acfc7ba68
lastUpdated: 2026-08-10
---

# Task: Replace the homepage sidebar with a focused responsive top navigation

## Changelog

- `2026-08-10`: Synchronized Task state `complete` from Skopos.

## Goal

Replace the homepage sidebar with a focused responsive top navigation

## Acceptance

- The desktop homepage uses a compact top navigation instead of the fixed sidebar.
- Wide, intermediate, and narrow layouts remain balanced, accessible, and free of horizontal overflow.
- Navigation, mobile menu, workflow interactions, and focused web checks pass.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `apps/web/src/app/globals.css`
- `apps/web/src/features/homepage/__tests__`
- `apps/web/src/features/homepage/sections/hero-section.tsx`
- `apps/web/src/features/homepage/sections/product-boundary-section.tsx`
- `apps/web/src/features/homepage/sections/promises-section.tsx`
- `apps/web/src/patterns/site/site-footer.tsx`
- `apps/web/src/patterns/site/site-header.tsx`
- `design-qa.md`

## Ownership Expansions

- `2026-08-10T14:58:38.097Z` by `codex-homepage-build`: `apps/web/src/features/homepage/sections/hero-section.tsx`, `apps/web/src/features/homepage/sections/product-boundary-section.tsx`, `apps/web/src/features/homepage/sections/promises-section.tsx`, `apps/web/src/patterns/site/site-footer.tsx` — The requested consistent section width requires content-frame wrappers in every full-width homepage section and footer.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Replace the homepage sidebar with a focused responsive top navigation" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The desktop homepage uses a compact top navigation instead of the fixed sidebar. (closure, agent-observation)
- Wide, intermediate, and narrow layouts remain balanced, accessible, and free of horizontal overflow. (closure, agent-observation)
- Navigation, mobile menu, workflow interactions, and focused web checks pass. (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-25dd4fd6",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-10T14:50:50.340Z",
  "updatedAt": "2026-08-10T15:43:46.368Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Replace the homepage sidebar with a focused responsive top navigation",
  "goal": "Replace the homepage sidebar with a focused responsive top navigation",
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
      "The desktop homepage uses a compact top navigation instead of the fixed sidebar.",
      "Wide, intermediate, and narrow layouts remain balanced, accessible, and free of horizontal overflow.",
      "Navigation, mobile menu, workflow interactions, and focused web checks pass."
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
  "admission": {
    "recommendedRisk": "standard",
    "recommendedDetail": "standard",
    "selectedRisk": "standard",
    "selectedDetail": "standard",
    "selectionSource": "explicit-override",
    "workflow": "tracked",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 4,
      "affectedScopeIds": [
        "skopos",
        "skopos-web"
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
    "baselineId": "baseline-a7cb875acfc7ba68"
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
      "detail": "Carry out \"Replace the homepage sidebar with a focused responsive top navigation\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "complete"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "complete"
    }
  ],
  "selectedActions": [],
  "selectedGuardIds": [],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "The desktop homepage uses a compact top navigation instead of the fixed sidebar.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Wide, intermediate, and narrow layouts remain balanced, accessible, and free of horizontal overflow.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Navigation, mobile menu, workflow interactions, and focused web checks pass.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [],
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
      "resolvedAt": "2026-08-10T14:51:52.122Z",
      "resolvedByActorId": "codex-homepage-build"
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
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "apps/web/src/features/homepage/sections/hero-section.tsx",
        "apps/web/src/features/homepage/sections/product-boundary-section.tsx",
        "apps/web/src/features/homepage/sections/promises-section.tsx",
        "apps/web/src/patterns/site/site-footer.tsx"
      ],
      "reason": "The requested consistent section width requires content-frame wrappers in every full-width homepage section and footer.",
      "actorId": "codex-homepage-build",
      "recordedAt": "2026-08-10T14:58:38.097Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/homepage/sections/hero-section.tsx",
          "digest": "726ba63c9794291df2965879c17df0db895917718183d3f1a813105fb3a7e3c8"
        },
        {
          "path": "apps/web/src/features/homepage/sections/product-boundary-section.tsx",
          "digest": "7077a217fe9ef23cee439b644598bcba49b3e0d1c23f6b503ac6c8726d60adf1"
        },
        {
          "path": "apps/web/src/features/homepage/sections/promises-section.tsx",
          "digest": "7df9472dbffb870de31d672651db68dbbaea5cc21868d2b926956c97e603e6d8"
        },
        {
          "path": "apps/web/src/patterns/site/site-footer.tsx",
          "digest": "6be71618a73d146b8970c1f3748a544489f9ebfefd5e90999fcc02535de95a61"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "apps/web/src/app/globals.css",
    "apps/web/src/features/homepage/__tests__",
    "apps/web/src/features/homepage/sections/hero-section.tsx",
    "apps/web/src/features/homepage/sections/product-boundary-section.tsx",
    "apps/web/src/features/homepage/sections/promises-section.tsx",
    "apps/web/src/patterns/site/site-footer.tsx",
    "apps/web/src/patterns/site/site-header.tsx",
    "design-qa.md"
  ]
}
```
<!-- skopos:task-state:end -->
