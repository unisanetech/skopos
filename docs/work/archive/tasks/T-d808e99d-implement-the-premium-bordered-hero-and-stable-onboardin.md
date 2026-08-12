---
title: "Task: Implement the premium bordered hero and stable onboarding console"
status: complete
owner: "codex-homepage-hero-grid"
id: T-d808e99d
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-8219fcc1f35b299e
lastUpdated: 2026-08-10
---

# Task: Implement the premium bordered hero and stable onboarding console

## Changelog

- `2026-08-10`: Synchronized Task state `complete` from Skopos.

## Goal

Implement the premium bordered hero and stable onboarding console

## Acceptance

- Hero uses one restrained structural frame with clear copy and illustration cells without decorative clutter
- Onboarding tabs and code body form one unified console with no visible layout shift between states
- Hero remains accessible and visually balanced from 320px mobile through wide desktop

## Non-Goals

- Change sections below the hero

## Constraints

- Preserve the approved headline, npm positioning, and repository-truth raster

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `automatic`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `apps/web/next-env.d.ts`
- `apps/web/src/app/globals.css`
- `apps/web/src/features/homepage/__tests__`
- `apps/web/src/features/homepage/content/homepage-copy.ts`
- `apps/web/src/features/homepage/sections/hero-onboarding.tsx`
- `apps/web/src/features/homepage/sections/hero-section.tsx`
- `design-qa.md`

## Ownership Expansions

- `2026-08-10T18:04:36.946Z` by `codex-homepage-hero-grid`: `apps/web/next-env.d.ts` — Adopt reviewed generated Next route type declaration refreshed by focused type verification.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Implement the premium bordered hero and stable onboarding console" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Hero uses one restrained structural frame with clear copy and illustration cells without decorative clutter (closure, agent-observation)
- Onboarding tabs and code body form one unified console with no visible layout shift between states (closure, agent-observation)
- Hero remains accessible and visually balanced from 320px mobile through wide desktop (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-d808e99d",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-10T17:51:55.548Z",
  "updatedAt": "2026-08-10T18:05:32.208Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Implement the premium bordered hero and stable onboarding console",
  "goal": "Implement the premium bordered hero and stable onboarding console",
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
      "Hero uses one restrained structural frame with clear copy and illustration cells without decorative clutter",
      "Onboarding tabs and code body form one unified console with no visible layout shift between states",
      "Hero remains accessible and visually balanced from 320px mobile through wide desktop"
    ],
    "nonGoals": [
      "Change sections below the hero"
    ],
    "constraints": [
      "Preserve the approved headline, npm positioning, and repository-truth raster"
    ]
  },
  "risk": "standard",
  "admission": {
    "recommendedRisk": "standard",
    "recommendedDetail": "standard",
    "selectedRisk": "standard",
    "selectedDetail": "standard",
    "selectionSource": "automatic",
    "workflow": "tracked",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 6,
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
    "baselineId": "baseline-8219fcc1f35b299e"
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
      "detail": "Carry out \"Implement the premium bordered hero and stable onboarding console\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Hero uses one restrained structural frame with clear copy and illustration cells without decorative clutter",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Onboarding tabs and code body form one unified console with no visible layout shift between states",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Hero remains accessible and visually balanced from 320px mobile through wide desktop",
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
      "resolvedAt": "2026-08-10T17:52:05.147Z",
      "resolvedByActorId": "codex-homepage-hero-grid"
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
        "apps/web/next-env.d.ts"
      ],
      "reason": "Adopt reviewed generated Next route type declaration refreshed by focused type verification.",
      "actorId": "codex-homepage-hero-grid",
      "recordedAt": "2026-08-10T18:04:36.946Z",
      "baselinePaths": [
        {
          "path": "apps/web/next-env.d.ts",
          "digest": "b5876e075e749d492d94278d69b0da02e185fca479466578bfc2cdec8df522ae"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "apps/web/next-env.d.ts",
    "apps/web/src/app/globals.css",
    "apps/web/src/features/homepage/__tests__",
    "apps/web/src/features/homepage/content/homepage-copy.ts",
    "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
    "apps/web/src/features/homepage/sections/hero-section.tsx",
    "design-qa.md"
  ]
}
```
<!-- skopos:task-state:end -->
