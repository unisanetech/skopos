---
title: "Task: Refine the public homepage hero onboarding and responsive composition"
status: complete
owner: "codex-homepage-hero"
id: T-09d8f035
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-6c65ac887bded39c
lastUpdated: 2026-08-10
---

# Task: Refine the public homepage hero onboarding and responsive composition

## Changelog

- `2026-08-10`: Synchronized Task state `complete` from Skopos.

## Goal

Refine the public homepage hero onboarding and responsive composition

## Acceptance

- Hero replaces generic CTAs with truthful pre-release setup and coding-agent onboarding guidance
- Hero typography, artwork, command surface, and spacing remain balanced without overflow across desktop, tablet, and mobile widths
- Hero onboarding controls are keyboard accessible and copy the exact visible command or agent brief

## Non-Goals

- Redesign sections below the hero

## Constraints

- Do not publish or imply an unavailable registry install command

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
- `apps/web/src/patterns/site/site-footer.tsx`
- `apps/web/src/patterns/site/site-header.tsx`
- `design-qa.md`

## Ownership Expansions

- `2026-08-10T17:27:56.427Z` by `codex-homepage-hero`: `apps/web/src/features/homepage/sections/hero-onboarding.tsx` — The responsive hero onboarding control is isolated as its own client component
- `2026-08-10T17:39:06.797Z` by `codex-homepage-hero`: `apps/web/src/patterns/site/site-footer.tsx`, `apps/web/src/patterns/site/site-header.tsx` — The released npm hero must not contradict the global release-status labels visible in the same public surface
- `2026-08-10T17:41:16.431Z` by `codex-homepage-hero`: `apps/web/next-env.d.ts` — The required Next.js type generation refreshed this app-owned generated declaration

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Refine the public homepage hero onboarding and responsive composition" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Hero replaces generic CTAs with truthful pre-release setup and coding-agent onboarding guidance (closure, agent-observation)
- Hero typography, artwork, command surface, and spacing remain balanced without overflow across desktop, tablet, and mobile widths (closure, agent-observation)
- Hero onboarding controls are keyboard accessible and copy the exact visible command or agent brief (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-09d8f035",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-10T17:26:15.821Z",
  "updatedAt": "2026-08-10T17:43:15.039Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Refine the public homepage hero onboarding and responsive composition",
  "goal": "Refine the public homepage hero onboarding and responsive composition",
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
      "Hero replaces generic CTAs with truthful pre-release setup and coding-agent onboarding guidance",
      "Hero typography, artwork, command surface, and spacing remain balanced without overflow across desktop, tablet, and mobile widths",
      "Hero onboarding controls are keyboard accessible and copy the exact visible command or agent brief"
    ],
    "nonGoals": [
      "Redesign sections below the hero"
    ],
    "constraints": [
      "Do not publish or imply an unavailable registry install command"
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
      "ownedPathCount": 5,
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
    "baselineId": "baseline-6c65ac887bded39c"
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
      "detail": "Carry out \"Refine the public homepage hero onboarding and responsive composition\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Hero replaces generic CTAs with truthful pre-release setup and coding-agent onboarding guidance",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Hero typography, artwork, command surface, and spacing remain balanced without overflow across desktop, tablet, and mobile widths",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Hero onboarding controls are keyboard accessible and copy the exact visible command or agent brief",
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
      "resolvedAt": "2026-08-10T17:26:41.273Z",
      "resolvedByActorId": "codex-homepage-hero"
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
      "resolvedAt": "2026-08-10T17:26:40.980Z",
      "resolvedByActorId": "codex-homepage-hero"
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
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "apps/web/src/features/homepage/sections/hero-onboarding.tsx"
      ],
      "reason": "The responsive hero onboarding control is isolated as its own client component",
      "actorId": "codex-homepage-hero",
      "recordedAt": "2026-08-10T17:27:56.427Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ]
    },
    {
      "paths": [
        "apps/web/src/patterns/site/site-footer.tsx",
        "apps/web/src/patterns/site/site-header.tsx"
      ],
      "reason": "The released npm hero must not contradict the global release-status labels visible in the same public surface",
      "actorId": "codex-homepage-hero",
      "recordedAt": "2026-08-10T17:39:06.797Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/patterns/site/site-footer.tsx",
          "digest": "6be71618a73d146b8970c1f3748a544489f9ebfefd5e90999fcc02535de95a61"
        },
        {
          "path": "apps/web/src/patterns/site/site-header.tsx",
          "digest": "df6e5df8e0b36baff24b2066591d1133a15de035ad7b8db8a53302c04bba6dd1"
        }
      ]
    },
    {
      "paths": [
        "apps/web/next-env.d.ts"
      ],
      "reason": "The required Next.js type generation refreshed this app-owned generated declaration",
      "actorId": "codex-homepage-hero",
      "recordedAt": "2026-08-10T17:41:16.431Z",
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
    "apps/web/src/patterns/site/site-footer.tsx",
    "apps/web/src/patterns/site/site-header.tsx",
    "design-qa.md"
  ]
}
```
<!-- skopos:task-state:end -->
