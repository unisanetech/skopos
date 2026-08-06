---
title: "Task: Project truthful fresh-continuation capabilities across Codex, Claude Code, manual hosts, and the read-only UI"
status: complete
owner: "codex-continuation-implementation"
id: T-80f4df63
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-a3da30c10a016032
lastUpdated: 2026-08-04
---

# Task: Project truthful fresh-continuation capabilities across Codex, Claude Code, manual hosts, and the read-only UI

## Changelog

- `2026-08-04`: Synchronized Task state `complete` from Skopos.

## Goal

Project truthful fresh-continuation capabilities across Codex, Claude Code, manual hosts, and the read-only UI

## Acceptance

- Every host projection reports create, inject, origin identity, origin messaging, pre-compaction, and completion capabilities truthfully
- Codex, Claude Code, and manual projections use the shared schemaVersion 1 handoff commands and distinguish generation, review, acceptance, and delivery
- The existing Discussion UI reads the enriched handoff without creating a mutation authority or a new route
- Developer guidance documents the reviewed manual fallback, explicit user intent, privacy, freshness, and safe transfer sequence

## Non-Goals

- Real paired model evaluation or new Skill packs

## Constraints

- Do not claim native host operations that the generated adapter cannot prove
- Keep UI read-only and reuse the existing Discussion surface

## Owned Paths

- `docs/guides/developer-workflows.md`
- `packages/cli/src/__tests__/host-projection-model.test.ts`
- `packages/cli/src/__tests__/session-context-contract.test.ts`
- `packages/instructions/src/application/build-enforcement-profile/build-enforcement-profile.service.ts`
- `packages/instructions/src/application/sync-claude-code-hook-adapter/sync-claude-code-hook-adapter.service.ts`
- `packages/instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.ts`
- `packages/instructions/src/application/sync-manual-host-adapter/sync-manual-host-adapter.service.ts`
- `packages/instructions/src/application/validate-host-projection-model/validate-host-projection-model.service.ts`
- `packages/model/src/contracts/skopos-enforcement-profile.ts`
- `packages/ui/src/__tests__/discussion-continuation-projection.test.tsx`
- `packages/ui/src/application/build-console-state/build-console-state.service.ts`
- `packages/ui/src/features/work/discussion-sections.tsx`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Project truthful fresh-continuation capabilities across Codex, Claude Code, manual hosts, and the read-only UI" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.
- [x] **Build routed Skopos console app** (action, complete) — Required by Guard ui.console-build.
- [x] **Capture responsive and accessibility proof** (action, complete) — Required by Guard ui.accessibility-proof.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.build-console-app`: Required by Guard ui.console-build.
- Action `ui.capture-responsive-proof`: Required by Guard ui.accessibility-proof.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`
- Guard `ui.accessibility-proof`
- Guard `ui.console-build`

## Evidence And Readiness

- Every host projection reports create, inject, origin identity, origin messaging, pre-compaction, and completion capabilities truthfully (closure, agent-observation)
- Codex, Claude Code, and manual projections use the shared schemaVersion 1 handoff commands and distinguish generation, review, acceptance, and delivery (closure, agent-observation)
- The existing Discussion UI reads the enriched handoff without creating a mutation authority or a new route (closure, agent-observation)
- Developer guidance documents the reviewed manual fallback, explicit user intent, privacy, freshness, and safe transfer sequence (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)
- Guard ui.accessibility-proof: UI changes require browser accessibility proof (closure, source-bound-action)
- Guard ui.console-build: Console changes require build Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-80f4df63",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T23:23:32.207Z",
  "updatedAt": "2026-08-04T23:34:30.477Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Project truthful fresh-continuation capabilities across Codex, Claude Code, manual hosts, and the read-only UI",
  "goal": "Project truthful fresh-continuation capabilities across Codex, Claude Code, manual hosts, and the read-only UI",
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
      "Every host projection reports create, inject, origin identity, origin messaging, pre-compaction, and completion capabilities truthfully",
      "Codex, Claude Code, and manual projections use the shared schemaVersion 1 handoff commands and distinguish generation, review, acceptance, and delivery",
      "The existing Discussion UI reads the enriched handoff without creating a mutation authority or a new route",
      "Developer guidance documents the reviewed manual fallback, explicit user intent, privacy, freshness, and safe transfer sequence"
    ],
    "nonGoals": [
      "Real paired model evaluation or new Skill packs"
    ],
    "constraints": [
      "Do not claim native host operations that the generated adapter cannot prove",
      "Keep UI read-only and reuse the existing Discussion surface"
    ]
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-a3da30c10a016032"
  },
  "priority": 0,
  "dependencyTaskIds": [
    "T-7e80b1cf"
  ],
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
      "detail": "Carry out \"Project truthful fresh-continuation capabilities across Codex, Claude Code, manual hosts, and the read-only UI\" inside the resolved scope before widening impact to adjacent areas.",
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
    },
    {
      "id": "action-ui.capture-responsive-proof",
      "kind": "action",
      "title": "Capture responsive and accessibility proof",
      "detail": "Required by Guard ui.accessibility-proof.",
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
        "packages/model/src/contracts/skopos-enforcement-profile.ts",
        "packages/instructions/src/application/build-enforcement-profile/build-enforcement-profile.service.ts",
        "packages/instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.ts",
        "packages/instructions/src/application/sync-claude-code-hook-adapter/sync-claude-code-hook-adapter.service.ts",
        "packages/instructions/src/application/sync-manual-host-adapter/sync-manual-host-adapter.service.ts",
        "packages/instructions/src/application/validate-host-projection-model/validate-host-projection-model.service.ts",
        "packages/ui/src/features/work/discussion-sections.tsx",
        "packages/ui/src/application/build-console-state/build-console-state.service.ts",
        "packages/ui/src/__tests__/discussion-continuation-projection.test.tsx",
        "packages/cli/src/__tests__/host-projection-model.test.ts",
        "packages/cli/src/__tests__/session-context-contract.test.ts"
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
        "packages/ui/src/features/work/discussion-sections.tsx",
        "packages/ui/src/application/build-console-state/build-console-state.service.ts",
        "packages/ui/src/__tests__/discussion-continuation-projection.test.tsx"
      ],
      "outputPaths": [
        ".skopos/ui/app"
      ],
      "requiresApproval": false
    },
    {
      "id": "ui.capture-responsive-proof",
      "title": "Capture responsive and accessibility proof",
      "category": "quality-check",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-capture-responsive-proof.yaml",
      "reason": "Required by Guard ui.accessibility-proof.",
      "matchedPaths": [
        "packages/ui/src/features/work/discussion-sections.tsx",
        "packages/ui/src/application/build-console-state/build-console-state.service.ts",
        "packages/ui/src/__tests__/discussion-continuation-projection.test.tsx"
      ],
      "outputPaths": [
        ".skopos/evidence/ui"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.focused-behavior-proof",
    "quality.typecheck",
    "ui.accessibility-proof",
    "ui.console-build"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Every host projection reports create, inject, origin identity, origin messaging, pre-compaction, and completion capabilities truthfully",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Codex, Claude Code, and manual projections use the shared schemaVersion 1 handoff commands and distinguish generation, review, acceptance, and delivery",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The existing Discussion UI reads the enriched handoff without creating a mutation authority or a new route",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Developer guidance documents the reviewed manual fallback, explicit user intent, privacy, freshness, and safe transfer sequence",
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
      "id": "guard-ui.accessibility-proof",
      "acceptanceCriterion": "Guard ui.accessibility-proof: UI changes require browser accessibility proof",
      "phase": "closure",
      "actionIds": [
        "ui.capture-responsive-proof"
      ],
      "guardIds": [
        "ui.accessibility-proof"
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
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/developer-workflows.md",
      "resolution": "memory-updated",
      "resolutionReason": "Developer workflows now document the implemented fresh-session continuation and truthful host capability boundaries.",
      "resolvedAt": "2026-08-04T23:33:22.422Z",
      "resolvedByActorId": "codex-continuation-implementation"
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
      "resolvedAt": "2026-08-04T23:23:41.763Z",
      "resolvedByActorId": "codex-continuation-implementation"
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
    },
    {
      "id": "run-ui.capture-responsive-proof",
      "title": "Capture responsive and accessibility proof",
      "summary": "Required by Guard ui.accessibility-proof.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.capture-responsive-proof",
      "blocking": false,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    "docs/guides/developer-workflows.md",
    "packages/cli/src/__tests__/host-projection-model.test.ts",
    "packages/cli/src/__tests__/session-context-contract.test.ts",
    "packages/instructions/src/application/build-enforcement-profile/build-enforcement-profile.service.ts",
    "packages/instructions/src/application/sync-claude-code-hook-adapter/sync-claude-code-hook-adapter.service.ts",
    "packages/instructions/src/application/sync-codex-wrapper-adapter/sync-codex-wrapper-adapter.service.ts",
    "packages/instructions/src/application/sync-manual-host-adapter/sync-manual-host-adapter.service.ts",
    "packages/instructions/src/application/validate-host-projection-model/validate-host-projection-model.service.ts",
    "packages/model/src/contracts/skopos-enforcement-profile.ts",
    "packages/ui/src/__tests__/discussion-continuation-projection.test.tsx",
    "packages/ui/src/application/build-console-state/build-console-state.service.ts",
    "packages/ui/src/features/work/discussion-sections.tsx"
  ]
}
```
<!-- skopos:task-state:end -->
