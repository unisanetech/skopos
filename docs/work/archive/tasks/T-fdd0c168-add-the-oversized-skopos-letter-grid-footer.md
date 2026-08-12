---
title: "Task: Add the oversized Skopos letter-grid footer"
status: complete
owner: "codex"
id: T-fdd0c168
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-73cb5652b462bfee
lastUpdated: 2026-08-11
---

# Task: Add the oversized Skopos letter-grid footer

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Add the oversized Skopos letter-grid footer

## Acceptance

- Footer presents SKOPOS as six large equal bordered cells above the footer metadata.
- The brand grid stays readable and overflow-free from mobile through desktop.

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

- `apps/web/next-env.d.ts`
- `apps/web/src/app/globals.css`
- `apps/web/src/patterns/site/site-footer.tsx`

## Ownership Expansions

- `2026-08-10T22:27:26.118Z` by `codex`: `apps/web/next-env.d.ts` — Adopt the Next.js type stub refreshed by the required web typecheck.

## Steps

- [ ] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, skipped) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Add the oversized Skopos letter-grid footer" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Footer presents SKOPOS as six large equal bordered cells above the footer metadata. (closure, agent-observation)
- The brand grid stays readable and overflow-free from mobile through desktop. (closure, agent-observation)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-fdd0c168",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-10T22:21:17.645Z",
  "updatedAt": "2026-08-11T01:51:44.693Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Add the oversized Skopos letter-grid footer",
  "goal": "Add the oversized Skopos letter-grid footer",
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
      "Footer presents SKOPOS as six large equal bordered cells above the footer metadata.",
      "The brand grid stays readable and overflow-free from mobile through desktop."
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
        "scope-source"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-73cb5652b462bfee"
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
      "detail": "Carry out \"Add the oversized Skopos letter-grid footer\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Footer presents SKOPOS as six large equal bordered cells above the footer metadata.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The brand grid stays readable and overflow-free from mobile through desktop.",
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
        "recordedAt": "2026-08-11T01:51:44.693Z"
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
        "apps/web/next-env.d.ts"
      ],
      "reason": "Adopt the Next.js type stub refreshed by the required web typecheck.",
      "actorId": "codex",
      "recordedAt": "2026-08-10T22:27:26.118Z",
      "baselinePaths": [
        {
          "path": "apps/web/next-env.d.ts",
          "digest": "818768e37190278e7a9797b6ac53f943664835cefbd63f042311e867e22423e0"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "apps/web/next-env.d.ts",
    "apps/web/src/app/globals.css",
    "apps/web/src/patterns/site/site-footer.tsx"
  ]
}
```
<!-- skopos:task-state:end -->
