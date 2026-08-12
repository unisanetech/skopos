---
title: "Task: Polish homepage grid line continuity"
status: complete
owner: "codex"
id: T-41f30939
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-16a7adfde814c639
lastUpdated: 2026-08-11
---

# Task: Polish homepage grid line continuity

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Polish homepage grid line continuity

## Acceptance

- Workstream tabs have complete top, bottom, and vertical cell borders without disturbing the active state.
- Horizontal rules meet their containing vertical borders and boundary dividers span the full desktop row height.
- Desktop and mobile preserve content padding and have no horizontal overflow.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `automatic`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `apps/web/public/agents/claude-code.svg`
- `apps/web/public/agents/codex.svg`
- `apps/web/public/agents/cursor.svg`
- `apps/web/public/agents/github-copilot.svg`
- `apps/web/public/brand/repository-handoff-v2.png`
- `apps/web/public/brand/repository-truth-v3.png`
- `apps/web/public/brand/repository-truth-v3.svg`
- `apps/web/src/app/globals.css`
- `apps/web/src/features/homepage/__tests__/agent-compatibility.test.ts`
- `apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts`
- `apps/web/src/features/homepage/__tests__/workstream.model.test.ts`
- `apps/web/src/features/homepage/components/agent-logo.tsx`
- `apps/web/src/features/homepage/components/repository-truth-visual.tsx`
- `apps/web/src/features/homepage/content/homepage-copy.ts`
- `apps/web/src/features/homepage/homepage-screen.tsx`
- `apps/web/src/features/homepage/sections/agent-compatibility-strip.tsx`
- `apps/web/src/features/homepage/sections/hero-onboarding.tsx`
- `apps/web/src/features/homepage/sections/hero-section.tsx`
- `apps/web/src/features/homepage/sections/product-workstream-section.tsx`
- `apps/web/src/features/homepage/workstream/workstream-demo.tsx`
- `apps/web/src/features/homepage/workstream/workstream-stage.tsx`
- `apps/web/src/features/homepage/workstream/workstream.model.ts`
- `design-qa.md`

## Ownership Expansions

- `2026-08-10T20:32:23.024Z` by `codex`: `apps/web/public/brand/repository-handoff-v2.png`, `apps/web/src/features/homepage/sections/hero-section.tsx` — Replace the hero illustration with the approved monochrome repository handoff concept.
- `2026-08-10T20:32:31.261Z` by `codex`: `apps/web/src/features/homepage/content/homepage-copy.ts`, `apps/web/src/features/homepage/sections/hero-onboarding.tsx` — Adopt the reviewed hero-console polish completed during this active homepage task.
- `2026-08-10T20:36:35.875Z` by `codex`: `apps/web/public/brand/repository-truth-v3.png` — Adopt the selected monochrome repository-truth hero illustration.
- `2026-08-10T20:45:03.256Z` by `codex`: `apps/web/public/brand/repository-truth-v3.svg` — Add a purpose-built vector hero illustration.
- `2026-08-10T21:16:49.818Z` by `codex`: `apps/web/public/agents/claude-code.svg`, `apps/web/public/agents/codex.svg`, `apps/web/public/agents/cursor.svg`, `apps/web/public/agents/github-copilot.svg`, `apps/web/src/features/homepage/__tests__/agent-compatibility.test.ts`, `apps/web/src/features/homepage/homepage-screen.tsx`, `apps/web/src/features/homepage/sections/agent-compatibility-strip.tsx` — Add the coding-agent compatibility strip below the hero.
- `2026-08-10T21:19:46.125Z` by `codex`: `apps/web/src/features/homepage/components/agent-logo.tsx` — Render coding-agent logos as inline SVG components.
- `2026-08-10T21:23:59.745Z` by `codex`: `apps/web/src/features/homepage/components/repository-truth-visual.tsx` — Render the hero illustration as a native SVG component.
- `2026-08-10T21:30:27.916Z` by `codex`: `apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts` — Protect the selected hero coherence promise.
- `2026-08-10T22:06:25.028Z` by `codex`: `apps/web/src/features/homepage/__tests__/workstream.model.test.ts`, `apps/web/src/features/homepage/sections/product-workstream-section.tsx`, `apps/web/src/features/homepage/workstream/workstream-demo.tsx`, `apps/web/src/features/homepage/workstream/workstream-stage.tsx`, `apps/web/src/features/homepage/workstream/workstream.model.ts` — Refine the public homepage Workstream example around a realistic developer request and benefit-led stages.

## Steps

- [ ] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, skipped) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Polish homepage grid line continuity" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Workstream tabs have complete top, bottom, and vertical cell borders without disturbing the active state. (closure, agent-observation)
- Horizontal rules meet their containing vertical borders and boundary dividers span the full desktop row height. (closure, agent-observation)
- Desktop and mobile preserve content padding and have no horizontal overflow. (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-41f30939",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-10T20:08:36.232Z",
  "updatedAt": "2026-08-11T01:51:07.953Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Polish homepage grid line continuity",
  "goal": "Polish homepage grid line continuity",
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
      "Workstream tabs have complete top, bottom, and vertical cell borders without disturbing the active state.",
      "Horizontal rules meet their containing vertical borders and boundary dividers span the full desktop row height.",
      "Desktop and mobile preserve content padding and have no horizontal overflow."
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
    "selectionSource": "automatic",
    "workflow": "tracked",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 2,
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
    "baselineId": "baseline-16a7adfde814c639"
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
      "detail": "Carry out \"Polish homepage grid line continuity\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Workstream tabs have complete top, bottom, and vertical cell borders without disturbing the active state.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Horizontal rules meet their containing vertical borders and boundary dividers span the full desktop row height.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Desktop and mobile preserve content padding and have no horizontal overflow.",
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
      "status": "dismissed",
      "disposition": {
        "kind": "dismissed",
        "reason": "Historical Task completed before terminal question invariants. The completed outcome superseded this non-blocking Scope suggestion; no answer is inferred.",
        "actorId": "codex",
        "recordedAt": "2026-08-11T01:51:07.953Z"
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
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "apps/web/public/brand/repository-handoff-v2.png",
        "apps/web/src/features/homepage/sections/hero-section.tsx"
      ],
      "reason": "Replace the hero illustration with the approved monochrome repository handoff concept.",
      "actorId": "codex",
      "recordedAt": "2026-08-10T20:32:23.024Z",
      "baselinePaths": [
        {
          "path": "apps/web/public/brand/repository-handoff-v2.png",
          "digest": "1ad8aa63d16ef0f20d36db97709adc9401f39c4098eb0e1758a0d411942d922a"
        },
        {
          "path": "apps/web/src/features/homepage/sections/hero-section.tsx",
          "digest": "b8f61a5c7c2887c5db09723d8954e721526cb1cec67035a03a38368c90a88cb6"
        }
      ]
    },
    {
      "paths": [
        "apps/web/src/features/homepage/content/homepage-copy.ts",
        "apps/web/src/features/homepage/sections/hero-onboarding.tsx"
      ],
      "reason": "Adopt the reviewed hero-console polish completed during this active homepage task.",
      "actorId": "codex",
      "recordedAt": "2026-08-10T20:32:31.261Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/homepage/content/homepage-copy.ts",
          "digest": "b29924d002781bd8a7249474e55d2df76b3dcb09e5c63f24b54bb4f6c8aba5eb"
        },
        {
          "path": "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
          "digest": "48aa5f3f0701ccfae33f9c6b7459c8fd7c0e2e9289a558e6c1cdeda4d5c5b1ed"
        }
      ]
    },
    {
      "paths": [
        "apps/web/public/brand/repository-truth-v3.png"
      ],
      "reason": "Adopt the selected monochrome repository-truth hero illustration.",
      "actorId": "codex",
      "recordedAt": "2026-08-10T20:36:35.875Z",
      "baselinePaths": [
        {
          "path": "apps/web/public/brand/repository-truth-v3.png",
          "digest": "06d47db742319828ec2e51a650254bc06d1f8f2dfea73ff94b95db197c2bc809"
        }
      ]
    },
    {
      "paths": [
        "apps/web/public/brand/repository-truth-v3.svg"
      ],
      "reason": "Add a purpose-built vector hero illustration.",
      "actorId": "codex",
      "recordedAt": "2026-08-10T20:45:03.256Z",
      "baselinePaths": [
        {
          "path": "apps/web/public/brand/repository-truth-v3.svg",
          "digest": "470fec193c315573068eda79136ef0ba33e9da26bf8da9f2efe2d5e65690ba4e"
        }
      ]
    },
    {
      "paths": [
        "apps/web/public/agents/claude-code.svg",
        "apps/web/public/agents/codex.svg",
        "apps/web/public/agents/cursor.svg",
        "apps/web/public/agents/github-copilot.svg",
        "apps/web/src/features/homepage/__tests__/agent-compatibility.test.ts",
        "apps/web/src/features/homepage/homepage-screen.tsx",
        "apps/web/src/features/homepage/sections/agent-compatibility-strip.tsx"
      ],
      "reason": "Add the coding-agent compatibility strip below the hero.",
      "actorId": "codex",
      "recordedAt": "2026-08-10T21:16:49.818Z",
      "baselinePaths": [
        {
          "path": "apps/web/public/agents/claude-code.svg",
          "digest": "80b22b7a4dd65e725f17b8ec6cd68d25c560f5a0e7d4d8c46deddde4aa31cfc9"
        },
        {
          "path": "apps/web/public/agents/codex.svg",
          "digest": "426907803e768eca1677909c8d8c708be66da8b9b2880b6e9756d26f178492d7"
        },
        {
          "path": "apps/web/public/agents/cursor.svg",
          "digest": "b8f712eec9f8f37b7b309cbcc46699cf104b9b6ae66e171ccc3f7e30491b38fe"
        },
        {
          "path": "apps/web/public/agents/github-copilot.svg",
          "digest": "04014a26fb6ad1d24331ba5e98d811cd7ddfb29a6b8eba81d80960256fe8769c"
        },
        {
          "path": "apps/web/src/features/homepage/__tests__/agent-compatibility.test.ts",
          "digest": "8ca85b2e448cd18a198ae9daa20cbd42d1381d6cdbec7343495be2a5c2eeae31"
        },
        {
          "path": "apps/web/src/features/homepage/homepage-screen.tsx",
          "digest": "dab489d9162f332cf14b0476fd4dd223e369b4bcf1f677f96ae4e7ea08776ec5"
        },
        {
          "path": "apps/web/src/features/homepage/sections/agent-compatibility-strip.tsx",
          "digest": "5a866dd590e72503173c558f6e036fb65b492f5d07da3181e29d046cbcb6d511"
        }
      ]
    },
    {
      "paths": [
        "apps/web/src/features/homepage/components/agent-logo.tsx"
      ],
      "reason": "Render coding-agent logos as inline SVG components.",
      "actorId": "codex",
      "recordedAt": "2026-08-10T21:19:46.125Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/homepage/components/agent-logo.tsx",
          "digest": "932173b77855a69865edb28c3fbc060c129eb61aa7aa96671f5256d3e38ad9cf"
        }
      ]
    },
    {
      "paths": [
        "apps/web/src/features/homepage/components/repository-truth-visual.tsx"
      ],
      "reason": "Render the hero illustration as a native SVG component.",
      "actorId": "codex",
      "recordedAt": "2026-08-10T21:23:59.745Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/homepage/components/repository-truth-visual.tsx",
          "digest": "f20dfbe0b22af32addce31971b3a531273cc1021d74bd3d862b63738898a9b65"
        }
      ]
    },
    {
      "paths": [
        "apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts"
      ],
      "reason": "Protect the selected hero coherence promise.",
      "actorId": "codex",
      "recordedAt": "2026-08-10T21:30:27.916Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts",
          "digest": "b492b4c0527065d5ce2fd85e4bcf346954c6aae778a7f001194195cf67c85c57"
        }
      ]
    },
    {
      "paths": [
        "apps/web/src/features/homepage/__tests__/workstream.model.test.ts",
        "apps/web/src/features/homepage/sections/product-workstream-section.tsx",
        "apps/web/src/features/homepage/workstream/workstream-demo.tsx",
        "apps/web/src/features/homepage/workstream/workstream-stage.tsx",
        "apps/web/src/features/homepage/workstream/workstream.model.ts"
      ],
      "reason": "Refine the public homepage Workstream example around a realistic developer request and benefit-led stages.",
      "actorId": "codex",
      "recordedAt": "2026-08-10T22:06:25.028Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/homepage/__tests__/workstream.model.test.ts",
          "digest": "2c8d7d8f11fbfa7d64168af8cacb87cf230c140254148df13ee67bb7468393f4"
        },
        {
          "path": "apps/web/src/features/homepage/sections/product-workstream-section.tsx",
          "digest": "0e66ddebf0930040602672dfd364d03faf0a60716fcfae0a5e85acb590684187"
        },
        {
          "path": "apps/web/src/features/homepage/workstream/workstream-demo.tsx",
          "digest": "72699969791401a394daa8b25a83e9fbaa390a3be6f45301c0f73f1fb8ea9177"
        },
        {
          "path": "apps/web/src/features/homepage/workstream/workstream-stage.tsx",
          "digest": "f289114d27caea6253788d41b68c30a0eba357f1bc33d38cccc1641bc373d20e"
        },
        {
          "path": "apps/web/src/features/homepage/workstream/workstream.model.ts",
          "digest": "99b581e5ae1b066f0f20084d443c814c9eba31565103ce161068f04f2e9f199a"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "apps/web/public/agents/claude-code.svg",
    "apps/web/public/agents/codex.svg",
    "apps/web/public/agents/cursor.svg",
    "apps/web/public/agents/github-copilot.svg",
    "apps/web/public/brand/repository-handoff-v2.png",
    "apps/web/public/brand/repository-truth-v3.png",
    "apps/web/public/brand/repository-truth-v3.svg",
    "apps/web/src/app/globals.css",
    "apps/web/src/features/homepage/__tests__/agent-compatibility.test.ts",
    "apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts",
    "apps/web/src/features/homepage/__tests__/workstream.model.test.ts",
    "apps/web/src/features/homepage/components/agent-logo.tsx",
    "apps/web/src/features/homepage/components/repository-truth-visual.tsx",
    "apps/web/src/features/homepage/content/homepage-copy.ts",
    "apps/web/src/features/homepage/homepage-screen.tsx",
    "apps/web/src/features/homepage/sections/agent-compatibility-strip.tsx",
    "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
    "apps/web/src/features/homepage/sections/hero-section.tsx",
    "apps/web/src/features/homepage/sections/product-workstream-section.tsx",
    "apps/web/src/features/homepage/workstream/workstream-demo.tsx",
    "apps/web/src/features/homepage/workstream/workstream-stage.tsx",
    "apps/web/src/features/homepage/workstream/workstream.model.ts",
    "design-qa.md"
  ]
}
```
<!-- skopos:task-state:end -->
