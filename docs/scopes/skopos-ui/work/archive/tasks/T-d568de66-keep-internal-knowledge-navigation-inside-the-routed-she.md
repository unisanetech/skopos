---
title: "Task: Keep internal knowledge navigation inside the routed shell"
status: complete
owner: "codex-client-navigation"
id: T-d568de66
scope: "skopos-ui"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-7ebaeb3c00ec08b8
lastUpdated: 2026-08-04
---

# Task: Keep internal knowledge navigation inside the routed shell

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Keep internal knowledge navigation inside the routed shell

## Acceptance

- Previous and next document controls use client-side router navigation so the shell, sidebar, header, and inspector are not document-reloaded.
- Internal Markdown links use the same application link owner, while external URLs and in-page anchors retain native browser behavior.
- Navigation still updates browser-history URLs and supports direct links and back/forward behavior.
- Focused routing tests, complete UI tests, typecheck, builds, and live previous/next navigation proof pass.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/scopes/skopos-ui`
- `packages/ui/src/__tests__/document-body.test.tsx`
- `packages/ui/src/__tests__/url-routing-contract.test.ts`
- `packages/ui/src/patterns/sections/content/document-body.tsx`
- `packages/ui/src/patterns/shells/page-frame.tsx`
- `packages/ui/src/support/ui/application-link.tsx`

## Steps

- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos UI** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Keep internal knowledge navigation inside the routed shell" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.
- [x] **Build routed Skopos console app** (action, complete) — Required by Guard ui.console-build.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.build-console-app`: Required by Guard ui.console-build.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`
- Guard `ui.console-build`

## Evidence And Readiness

- Previous and next document controls use client-side router navigation so the shell, sidebar, header, and inspector are not document-reloaded. (closure, agent-observation)
- Internal Markdown links use the same application link owner, while external URLs and in-page anchors retain native browser behavior. (closure, agent-observation)
- Navigation still updates browser-history URLs and supports direct links and back/forward behavior. (closure, agent-observation)
- Focused routing tests, complete UI tests, typecheck, builds, and live previous/next navigation proof pass. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)
- Guard ui.console-build: Console changes require build Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/scopes/skopos-ui/architecture/00-architecture.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/architecture/00-architecture.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-d568de66",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T11:47:00.122Z",
  "updatedAt": "2026-08-04T11:57:04.644Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Keep internal knowledge navigation inside the routed shell",
  "goal": "Keep internal knowledge navigation inside the routed shell",
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
      "Previous and next document controls use client-side router navigation so the shell, sidebar, header, and inspector are not document-reloaded.",
      "Internal Markdown links use the same application link owner, while external URLs and in-page anchors retain native browser behavior.",
      "Navigation still updates browser-history URLs and supports direct links and back/forward behavior.",
      "Focused routing tests, complete UI tests, typecheck, builds, and live previous/next navigation proof pass."
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-7ebaeb3c00ec08b8"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
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
      "title": "Review the current pattern in Skopos UI",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "complete"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Keep internal knowledge navigation inside the routed shell\" inside the resolved scope before widening impact to adjacent areas.",
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
    },
    {
      "id": "action-ui.build-console-app",
      "kind": "action",
      "title": "Build routed Skopos console app",
      "detail": "Required by Guard ui.console-build.",
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
        "packages/ui/src/support/ui/application-link.tsx",
        "packages/ui/src/patterns/shells/page-frame.tsx",
        "packages/ui/src/patterns/sections/content/document-body.tsx",
        "packages/ui/src/__tests__/url-routing-contract.test.ts",
        "packages/ui/src/__tests__/document-body.test.tsx"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "ui.build-console-app",
      "title": "Build routed Skopos console app",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-build-console-app.yaml",
      "reason": "Required by Guard ui.console-build.",
      "matchedPaths": [
        "packages/ui/src/support/ui/application-link.tsx",
        "packages/ui/src/patterns/shells/page-frame.tsx",
        "packages/ui/src/patterns/sections/content/document-body.tsx",
        "packages/ui/src/__tests__/url-routing-contract.test.ts",
        "packages/ui/src/__tests__/document-body.test.tsx"
      ],
      "outputPaths": [
        ".skopos/ui/app"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.focused-behavior-proof",
    "quality.typecheck",
    "ui.console-build"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Previous and next document controls use client-side router navigation so the shell, sidebar, header, and inspector are not document-reloaded.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Internal Markdown links use the same application link owner, while external URLs and in-page anchors retain native browser behavior.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Navigation still updates browser-history URLs and supports direct links and back/forward behavior.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused routing tests, complete UI tests, typecheck, builds, and live previous/next navigation proof pass.",
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
    },
    {
      "id": "guard-ui.console-build",
      "acceptanceCriterion": "Guard ui.console-build: Console changes require build Evidence",
      "phase": "closure",
      "actionIds": [
        "ui.build-console-app"
      ],
      "guardIds": [
        "ui.console-build"
      ],
      "evidence": "source-bound-action"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-573233ab26",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/scopes/skopos-ui/architecture/00-architecture.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/architecture/00-architecture.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented the shared router-aware application-link owner and persistent shell behavior for internal document transitions.",
      "resolvedAt": "2026-08-04T11:55:03.838Z",
      "resolvedByActorId": "codex-client-navigation"
    },
    {
      "id": "memory-decision-0f99f3e0a4",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/D-20260804-unisane-ui-visual-ownership.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "The change uses the existing Unisane IconButton and does not alter reusable visual ownership.",
      "resolvedAt": "2026-08-04T11:55:19.637Z",
      "resolvedByActorId": "codex-client-navigation"
    },
    {
      "id": "memory-decision-5f0163a357",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "The human-first projection remains unchanged; this task corrects navigation continuity within that accepted projection.",
      "resolvedAt": "2026-08-04T11:55:22.719Z",
      "resolvedByActorId": "codex-client-navigation"
    },
    {
      "id": "memory-decision-7b162a74fe",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/D-20260804-browser-history-and-unisane-ui-registry-delivery.md",
      "resolution": "memory-updated",
      "resolutionReason": "Extended the accepted browser-history decision to require router navigation for previous/next and internal Markdown links.",
      "resolvedAt": "2026-08-04T11:55:25.441Z",
      "resolvedByActorId": "codex-client-navigation"
    }
  ],
  "questions": [
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
      "resolvedOptionId": "internal-only-change",
      "resolvedAt": "2026-08-04T11:47:24.207Z",
      "resolvedByActorId": "codex-client-navigation"
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.public-api-change",
      "title": "Resolve: Should this plan change a public contract, route, or SDK surface?",
      "summary": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.public-api-change",
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
    },
    {
      "id": "run-ui.build-console-app",
      "title": "Build routed Skopos console app",
      "summary": "Required by Guard ui.console-build.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.build-console-app",
      "blocking": false,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    "docs/scopes/skopos-ui",
    "packages/ui/src/__tests__/document-body.test.tsx",
    "packages/ui/src/__tests__/url-routing-contract.test.ts",
    "packages/ui/src/patterns/sections/content/document-body.tsx",
    "packages/ui/src/patterns/shells/page-frame.tsx",
    "packages/ui/src/support/ui/application-link.tsx"
  ]
}
```
<!-- skopos:task-state:end -->
