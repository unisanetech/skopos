---
title: "Task: Replace record-shaped UI pages with human supervision projections"
status: complete
owner: "codex-skopos-human-projections"
id: T-cf8d5171
scope: "skopos-ui"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-bce5aedc8cda4264
lastUpdated: 2026-08-04
---

# Task: Replace record-shaped UI pages with human supervision projections

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Replace record-shaped UI pages with human supervision projections

## Acceptance

- Now explains the current situation, recommendation, consequence, and exact safe handoff without presenting a generic dashboard.
- Plan detail leads with current direction, progress, next milestone, linked work, and risks while hiding duplicate or unknown metadata.
- Decision detail summarizes the accepted choice, rationale, consequences, and affected areas before the source document.
- Activity groups low-level events into meaningful human change stories with internal metadata secondary.
- Canonical UI Memory, focused tests, production build, and live desktop verification agree with the implemented behavior.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/scopes/skopos-ui/findings/F-20260804-human-content-projection-drift.md`
- `docs/scopes/skopos-ui/overview.md`
- `docs/scopes/skopos-ui/work/plans/P-20260804-human-first-ui-convergence.md`
- `packages/ui/package.json`
- `packages/ui/src/__tests__/human-supervision-projections.test.tsx`
- `packages/ui/src/features/knowledge/documents`
- `packages/ui/src/features/knowledge/plans`
- `packages/ui/src/features/validation/activity-sections.tsx`
- `packages/ui/src/features/work/overview-sections.tsx`
- `packages/ui/src/screens/knowledge/document-screens.tsx`
- `packages/ui/src/screens/validation/review-screens.tsx`
- `packages/ui/src/screens/work/execution-screens.tsx`

## Steps

- [x] **Does this plan require a destructive rename, removal, or migration path?** (decision, complete) — Destructive changes need an explicit cutover strategy instead of an implicit agent decision.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos UI** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Replace record-shaped UI pages with human supervision projections" inside the resolved scope before widening impact to adjacent areas.
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

- Now explains the current situation, recommendation, consequence, and exact safe handoff without presenting a generic dashboard. (closure, agent-observation)
- Plan detail leads with current direction, progress, next milestone, linked work, and risks while hiding duplicate or unknown metadata. (closure, agent-observation)
- Decision detail summarizes the accepted choice, rationale, consequences, and affected areas before the source document. (closure, agent-observation)
- Activity groups low-level events into meaningful human change stories with internal metadata secondary. (closure, agent-observation)
- Canonical UI Memory, focused tests, production build, and live desktop verification agree with the implemented behavior. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)
- Guard ui.console-build: Console changes require build Evidence (closure, source-bound-action)

## Memory Obligations

- No durable Memory obligation is inferred.

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-cf8d5171",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T04:14:30.703Z",
  "updatedAt": "2026-08-04T04:37:55.463Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Replace record-shaped UI pages with human supervision projections",
  "goal": "Replace record-shaped UI pages with human supervision projections",
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
      "Now explains the current situation, recommendation, consequence, and exact safe handoff without presenting a generic dashboard.",
      "Plan detail leads with current direction, progress, next milestone, linked work, and risks while hiding duplicate or unknown metadata.",
      "Decision detail summarizes the accepted choice, rationale, consequences, and affected areas before the source document.",
      "Activity groups low-level events into meaningful human change stories with internal metadata secondary.",
      "Canonical UI Memory, focused tests, production build, and live desktop verification agree with the implemented behavior."
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-bce5aedc8cda4264"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.destructive-migration",
      "kind": "decision",
      "title": "Does this plan require a destructive rename, removal, or migration path?",
      "detail": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
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
      "detail": "Carry out \"Replace record-shaped UI pages with human supervision projections\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/ui/src/features/work/overview-sections.tsx",
        "packages/ui/src/features/knowledge/plans",
        "packages/ui/src/features/knowledge/documents",
        "packages/ui/src/features/validation/activity-sections.tsx",
        "packages/ui/src/screens/work/execution-screens.tsx",
        "packages/ui/src/screens/knowledge/document-screens.tsx",
        "packages/ui/src/screens/validation/review-screens.tsx",
        "packages/ui/src/__tests__/human-supervision-projections.test.tsx",
        "packages/ui/package.json"
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
        "packages/ui/src/features/work/overview-sections.tsx",
        "packages/ui/src/features/knowledge/plans",
        "packages/ui/src/features/knowledge/documents",
        "packages/ui/src/features/validation/activity-sections.tsx",
        "packages/ui/src/screens/work/execution-screens.tsx",
        "packages/ui/src/screens/knowledge/document-screens.tsx",
        "packages/ui/src/screens/validation/review-screens.tsx",
        "packages/ui/src/__tests__/human-supervision-projections.test.tsx",
        "packages/ui/package.json"
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
      "acceptanceCriterion": "Now explains the current situation, recommendation, consequence, and exact safe handoff without presenting a generic dashboard.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Plan detail leads with current direction, progress, next milestone, linked work, and risks while hiding duplicate or unknown metadata.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Decision detail summarizes the accepted choice, rationale, consequences, and affected areas before the source document.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Activity groups low-level events into meaningful human change stories with internal metadata secondary.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Canonical UI Memory, focused tests, production build, and live desktop verification agree with the implemented behavior.",
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
  "memoryObligations": [],
  "questions": [
    {
      "id": "plan.destructive-migration",
      "category": "migration",
      "escalation": "must-ask",
      "question": "Does this plan require a destructive rename, removal, or migration path?",
      "whyItMatters": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
      "recommendedOptionId": "stage-the-change",
      "options": [
        {
          "id": "stage-the-change",
          "label": "Stage the change",
          "rationale": "Recommended because staged rollouts reduce drift and make Readiness easier to reason about."
        },
        {
          "id": "hard-cutover",
          "label": "Hard cutover",
          "rationale": "Use only when an immediate break is intentional and fully understood."
        },
        {
          "id": "no-destructive-change",
          "label": "No destructive change",
          "rationale": "Use when the classified wording does not actually rename, remove, or migrate persisted or public state."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "no-destructive-change",
      "resolvedAt": "2026-08-04T04:14:52.538Z",
      "resolvedByActorId": "codex-skopos-human-projections"
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.destructive-migration",
      "title": "Resolve: Does this plan require a destructive rename, removal, or migration path?",
      "summary": "Destructive changes need an explicit cutover strategy instead of an implicit agent decision.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.destructive-migration",
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
    "docs/scopes/skopos-ui/findings/F-20260804-human-content-projection-drift.md",
    "docs/scopes/skopos-ui/overview.md",
    "docs/scopes/skopos-ui/work/plans/P-20260804-human-first-ui-convergence.md",
    "packages/ui/package.json",
    "packages/ui/src/__tests__/human-supervision-projections.test.tsx",
    "packages/ui/src/features/knowledge/documents",
    "packages/ui/src/features/knowledge/plans",
    "packages/ui/src/features/validation/activity-sections.tsx",
    "packages/ui/src/features/work/overview-sections.tsx",
    "packages/ui/src/screens/knowledge/document-screens.tsx",
    "packages/ui/src/screens/validation/review-screens.tsx",
    "packages/ui/src/screens/work/execution-screens.tsx"
  ]
}
```
<!-- skopos:task-state:end -->
