---
title: "Task: Redesign the Skopos UI architecture around canonical human-first supervision"
status: complete
owner: "codex-skopos-ui"
id: T-3ee26ab5
scope: "skopos-ui"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-68d6b63cc6fc73e1
lastUpdated: 2026-08-03
---

# Task: Redesign the Skopos UI architecture around canonical human-first supervision

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Redesign the Skopos UI architecture around canonical human-first supervision

## Acceptance

- Now prioritizes the canonical Session Context decision or next safe action before repository inventory
- Task detail explains Scope, acceptance, ownership, coordination, selected Actions and Guards, Evidence, proof subject, and closure without making raw artifacts primary
- Project Knowledge separates human project understanding from diagnostic Memory mappings
- Readiness names whether it applies to adoption, Task continuation or closure, or Project integration
- Navigation and responsive layout keep canonical product vocabulary while reducing dashboard weight
- The UI remains a derived read-only projection and introduces no second workflow or mutation authority
- Focused UI type, behavior, build, and accessibility checks pass

## Non-Goals

- Do not redesign Skopos runtime authorities or turn the UI into a project-management suite

## Constraints

- Use canonical Skopos Session Context, Task, Evidence, and Readiness truth rather than UI-local competing interpretations
- Preserve unrelated worktree changes and keep Unisane UI adoption behind an explicit distribution decision

## Owned Paths

- `docs/scopes/skopos-ui`
- `packages/ui`

## Steps

- [x] **Does this plan intentionally change the current architecture or package boundaries around Skopos UI?** (decision, complete) — Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos UI** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Redesign the Skopos UI architecture around canonical human-first supervision" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Now prioritizes the canonical Session Context decision or next safe action before repository inventory (closure, agent-observation)
- Task detail explains Scope, acceptance, ownership, coordination, selected Actions and Guards, Evidence, proof subject, and closure without making raw artifacts primary (closure, agent-observation)
- Project Knowledge separates human project understanding from diagnostic Memory mappings (closure, agent-observation)
- Readiness names whether it applies to adoption, Task continuation or closure, or Project integration (closure, agent-observation)
- Navigation and responsive layout keep canonical product vocabulary while reducing dashboard weight (closure, agent-observation)
- The UI remains a derived read-only projection and introduces no second workflow or mutation authority (closure, agent-observation)
- Focused UI type, behavior, build, and accessibility checks pass (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize durable Memory for Scope skopos-ui. (target: `docs/scopes/skopos-ui/architecture/00-architecture.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-3ee26ab5",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T21:22:41.040Z",
  "updatedAt": "2026-08-03T21:49:32.309Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Redesign the Skopos UI architecture around canonical human-first supervision",
  "goal": "Redesign the Skopos UI architecture around canonical human-first supervision",
  "scope": {
    "query": "skopos-ui",
    "matchedBy": "id",
    "scope": {
      "id": "skopos-ui",
      "kind": "application",
      "title": "Skopos UI",
      "path": "packages/ui",
      "aliases": [
        "@skopos/ui"
      ],
      "summary": "Skopos UI (core.application).",
      "confidence": "high",
      "parent": "skopos",
      "ancestorIds": [
        "skopos"
      ],
      "profile": "core.application",
      "memoryRoot": "docs/scopes/skopos-ui",
      "codeRoots": [
        "packages/ui"
      ],
      "dependsOn": [
        "skopos-model",
        "skopos-runtime"
      ],
      "owners": [
        "skopos-core"
      ]
    }
  },
  "contract": {
    "acceptanceCriteria": [
      "Now prioritizes the canonical Session Context decision or next safe action before repository inventory",
      "Task detail explains Scope, acceptance, ownership, coordination, selected Actions and Guards, Evidence, proof subject, and closure without making raw artifacts primary",
      "Project Knowledge separates human project understanding from diagnostic Memory mappings",
      "Readiness names whether it applies to adoption, Task continuation or closure, or Project integration",
      "Navigation and responsive layout keep canonical product vocabulary while reducing dashboard weight",
      "The UI remains a derived read-only projection and introduces no second workflow or mutation authority",
      "Focused UI type, behavior, build, and accessibility checks pass"
    ],
    "nonGoals": [
      "Do not redesign Skopos runtime authorities or turn the UI into a project-management suite"
    ],
    "constraints": [
      "Use canonical Skopos Session Context, Task, Evidence, and Readiness truth rather than UI-local competing interpretations",
      "Preserve unrelated worktree changes and keep Unisane UI adoption behind an explicit distribution decision"
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-68d6b63cc6fc73e1"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.architecture-shift",
      "kind": "decision",
      "title": "Does this plan intentionally change the current architecture or package boundaries around Skopos UI?",
      "detail": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
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
      "title": "Review the current pattern in Skopos UI",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "complete"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Redesign the Skopos UI architecture around canonical human-first supervision\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck the Skopos workspace",
      "detail": "Required by Guard quality.typecheck.",
      "status": "complete"
    }
  ],
  "selectedActions": [
    {
      "id": "quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "packages/ui"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Now prioritizes the canonical Session Context decision or next safe action before repository inventory",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Task detail explains Scope, acceptance, ownership, coordination, selected Actions and Guards, Evidence, proof subject, and closure without making raw artifacts primary",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Project Knowledge separates human project understanding from diagnostic Memory mappings",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Readiness names whether it applies to adoption, Task continuation or closure, or Project integration",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Navigation and responsive layout keep canonical product vocabulary while reducing dashboard weight",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-6",
      "acceptanceCriterion": "The UI remains a derived read-only projection and introduces no second workflow or mutation authority",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-7",
      "acceptanceCriterion": "Focused UI type, behavior, build, and accessibility checks pass",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
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
      "id": "memory-architecture-720a11a7f2",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize durable Memory for Scope skopos-ui.",
      "status": "complete",
      "resolution": "memory-updated",
      "resolutionReason": "Added canonical skopos-ui architecture for Session Context projection, Task and Knowledge presentation, named Readiness subjects, responsive shell behavior, and the read-only authority boundary; synchronized the related Decision, Finding, Plan, and overview.",
      "targetPath": "docs/scopes/skopos-ui/architecture/00-architecture.md",
      "resolvedAt": "2026-08-03T21:45:25.632Z",
      "resolvedByActorId": "codex-skopos-ui"
    }
  ],
  "questions": [
    {
      "id": "plan.architecture-shift",
      "category": "architecture",
      "escalation": "must-ask",
      "question": "Does this plan intentionally change the current architecture or package boundaries around Skopos UI?",
      "whyItMatters": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "recommendedOptionId": "preserve-current-boundaries",
      "options": [
        {
          "id": "preserve-current-boundaries",
          "label": "Preserve current boundaries",
          "rationale": "Recommended unless the goal explicitly requires a structural redesign."
        },
        {
          "id": "approve-architecture-change",
          "label": "Approve architecture change",
          "rationale": "Use this when the change should redefine package, scope, or runtime boundaries."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "preserve-current-boundaries",
      "resolvedAt": "2026-08-03T21:23:10.063Z",
      "resolvedByActorId": "codex-skopos-ui"
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.architecture-shift",
      "title": "Resolve: Does this plan intentionally change the current architecture or package boundaries around Skopos UI?",
      "summary": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.architecture-shift",
      "blocking": true,
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
    "docs/scopes/skopos-ui",
    "packages/ui"
  ]
}
```
<!-- skopos:task-state:end -->
