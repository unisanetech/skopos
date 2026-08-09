---
title: "Task: Deliver progressive Skopos workflows from automatic admission through UI and semantic evaluation"
status: complete
owner: "codex-progressive-work"
id: T-c8935bd7
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-8ace4f15dde73a18
lastUpdated: 2026-08-09
---

# Task: Deliver progressive Skopos workflows from automatic admission through UI and semantic evaluation

## Changelog

- `2026-08-09`: Synchronized Task state `complete` from Skopos.

## Goal

Deliver progressive Skopos workflows from automatic admission through UI and semantic evaluation

## Acceptance

- Automatic Task admission recommends and records risk and detail with deterministic reasons from goal, owned paths, affected scopes, and proof subject; explicit overrides remain visible
- Light Tasks follow a compact fast path with focused proof, minimal visible interactions, no tracked Task document, and no immutable snapshot requirement
- Impact analysis explains selected and skipped Guards and Actions, with regression proof for proportional selection
- Active Tasks detect changed paths outside declared ownership and provide safe exact ownership-expansion suggestions without silently adopting them for high-impact work
- CLI success and failure output explains what happened, readiness, and the safest recovery or next command
- The read-only UI presents one understandable workflow for readiness, owned versus unowned changes, required Evidence, and exact next actions
- Reusable semantic Guard templates and a multi-project evaluation matrix prove positive, negative, historical, and ambiguous guidance cases without adding project-specific truth to core

## Non-Goals

- None declared.

## Constraints

- Preserve strict high-impact snapshots, Evidence, Memory, and Readiness
- Keep Product UI Craft and the current read-only UI authority
- Do not absorb unrelated dirty-worktree changes

## Admission And Workflow

- Legacy Task admission; workflow derives from risk `high-impact`.

## Owned Paths

- `docs/00-start-here.md`
- `docs/architecture/action-extension-model.md`
- `docs/architecture/agent-native-operating-model.md`
- `docs/architecture/evidence-and-readiness-model.md`
- `docs/guides/developer-workflows.md`
- `docs/guides/semantic-guards.md`
- `fixtures/repos`
- `package.json`
- `packages/cli/src/__tests__`
- `packages/cli/src/cli.ts`
- `packages/cli/src/cli/commands/impact.ts`
- `packages/cli/src/cli/commands/router.ts`
- `packages/cli/src/cli/commands/task.ts`
- `packages/cli/src/cli/commands/verification.ts`
- `packages/cli/src/cli/help.ts`
- `packages/cli/src/cli/index.ts`
- `packages/cli/src/cli/shared/error-guidance.ts`
- `packages/indexer/src/application/match-actions/match-actions.service.ts`
- `packages/model/src/contracts/skopos-impact-report.ts`
- `packages/model/src/contracts/skopos-start.ts`
- `packages/model/src/contracts/skopos-task.ts`
- `packages/runtime/src/application/impact/impact.service.ts`
- `packages/runtime/src/application/start/start.service.ts`
- `packages/runtime/src/application/task/task.service.ts`
- `packages/runtime/src/application/verification/verification.service.ts`
- `packages/ui/package.json`
- `packages/ui/src/__tests__`
- `packages/ui/src/application/build-console-state`
- `packages/ui/src/contracts`
- `packages/ui/src/features/validation`
- `packages/ui/src/features/work`
- `packages/ui/src/platform/console-state/work-selectors.ts`
- `packages/ui/src/screens/validation`
- `packages/ui/src/screens/work`
- `packages/verification/src/application/build-impact-report/build-impact-report.service.ts`
- `policy-packs/verification/semantic-drift`
- `README.md`

## Ownership Expansions

- `2026-08-09T04:06:19.186Z` by `codex-progressive-work`: `packages/cli/src/cli.ts`, `packages/ui/src/platform/console-state/work-selectors.ts` — The complete user-requested workflow requires centralized CLI recovery guidance and UI workflow projection logic outside the originally declared directories.
- `2026-08-09T04:14:46.002Z` by `codex-progressive-work`: `package.json`, `packages/ui/package.json` — The new progressive-workflow and UI regression suites must be part of the repository's canonical test commands rather than orphan tests.
- `2026-08-09T04:16:41.362Z` by `codex-progressive-work`: `docs/00-start-here.md` — The new canonical semantic Guard guide must be discoverable from the human documentation router.
- `2026-08-09T04:20:10.688Z` by `codex-progressive-work`: `packages/cli/src/cli/shared/error-guidance.ts` — The package-boundary regression requires CLI recovery formatting to live in the support layer rather than the thin top-level router.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Deliver progressive Skopos workflows from automatic admission through UI and semantic evaluation" inside the resolved scope before widening impact to adjacent areas.
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

- Automatic Task admission recommends and records risk and detail with deterministic reasons from goal, owned paths, affected scopes, and proof subject; explicit overrides remain visible (closure, agent-observation)
- Light Tasks follow a compact fast path with focused proof, minimal visible interactions, no tracked Task document, and no immutable snapshot requirement (closure, agent-observation)
- Impact analysis explains selected and skipped Guards and Actions, with regression proof for proportional selection (closure, agent-observation)
- Active Tasks detect changed paths outside declared ownership and provide safe exact ownership-expansion suggestions without silently adopting them for high-impact work (closure, agent-observation)
- CLI success and failure output explains what happened, readiness, and the safest recovery or next command (closure, agent-observation)
- The read-only UI presents one understandable workflow for readiness, owned versus unowned changes, required Evidence, and exact next actions (closure, agent-observation)
- Reusable semantic Guard templates and a multi-project evaluation matrix prove positive, negative, historical, and ambiguous guidance cases without adding project-specific truth to core (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)
- Guard ui.accessibility-proof: UI changes require browser accessibility proof (closure, source-bound-action)
- Guard ui.console-build: Console changes require build Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/evidence-and-readiness-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/action-extension-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/action-extension-model.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/semantic-guards.md; review and synchronize it if project truth changes. (target: `docs/guides/semantic-guards.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-c8935bd7",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-09T03:57:59.880Z",
  "updatedAt": "2026-08-09T04:49:02.101Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Deliver progressive Skopos workflows from automatic admission through UI and semantic evaluation",
  "goal": "Deliver progressive Skopos workflows from automatic admission through UI and semantic evaluation",
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
      "Automatic Task admission recommends and records risk and detail with deterministic reasons from goal, owned paths, affected scopes, and proof subject; explicit overrides remain visible",
      "Light Tasks follow a compact fast path with focused proof, minimal visible interactions, no tracked Task document, and no immutable snapshot requirement",
      "Impact analysis explains selected and skipped Guards and Actions, with regression proof for proportional selection",
      "Active Tasks detect changed paths outside declared ownership and provide safe exact ownership-expansion suggestions without silently adopting them for high-impact work",
      "CLI success and failure output explains what happened, readiness, and the safest recovery or next command",
      "The read-only UI presents one understandable workflow for readiness, owned versus unowned changes, required Evidence, and exact next actions",
      "Reusable semantic Guard templates and a multi-project evaluation matrix prove positive, negative, historical, and ambiguous guidance cases without adding project-specific truth to core"
    ],
    "nonGoals": [],
    "constraints": [
      "Preserve strict high-impact snapshots, Evidence, Memory, and Readiness",
      "Keep Product UI Craft and the current read-only UI authority",
      "Do not absorb unrelated dirty-worktree changes"
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-8ace4f15dde73a18"
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
      "detail": "Carry out \"Deliver progressive Skopos workflows from automatic admission through UI and semantic evaluation\" inside the resolved scope before widening impact to adjacent areas.",
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
        "package.json",
        "packages/cli/src/__tests__",
        "packages/cli/src/cli.ts",
        "packages/cli/src/cli/commands/impact.ts",
        "packages/cli/src/cli/commands/router.ts",
        "packages/cli/src/cli/commands/task.ts",
        "packages/cli/src/cli/commands/verification.ts",
        "packages/cli/src/cli/help.ts",
        "packages/cli/src/cli/index.ts",
        "packages/cli/src/cli/shared/error-guidance.ts",
        "packages/indexer/src/application/match-actions/match-actions.service.ts",
        "packages/model/src/contracts/skopos-impact-report.ts",
        "packages/model/src/contracts/skopos-start.ts",
        "packages/model/src/contracts/skopos-task.ts",
        "packages/runtime/src/application/impact/impact.service.ts",
        "packages/runtime/src/application/start/start.service.ts",
        "packages/runtime/src/application/task/task.service.ts",
        "packages/runtime/src/application/verification/verification.service.ts",
        "packages/ui/package.json",
        "packages/ui/src/__tests__",
        "packages/ui/src/application/build-console-state",
        "packages/ui/src/contracts",
        "packages/ui/src/features/validation",
        "packages/ui/src/features/work",
        "packages/ui/src/platform/console-state/work-selectors.ts",
        "packages/ui/src/screens/validation",
        "packages/ui/src/screens/work",
        "packages/verification/src/application/build-impact-report/build-impact-report.service.ts"
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
        "packages/ui/package.json",
        "packages/ui/src/__tests__",
        "packages/ui/src/application/build-console-state",
        "packages/ui/src/contracts",
        "packages/ui/src/features/validation",
        "packages/ui/src/features/work",
        "packages/ui/src/platform/console-state/work-selectors.ts",
        "packages/ui/src/screens/validation",
        "packages/ui/src/screens/work"
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
        "packages/ui/package.json",
        "packages/ui/src/__tests__",
        "packages/ui/src/application/build-console-state",
        "packages/ui/src/contracts",
        "packages/ui/src/features/validation",
        "packages/ui/src/features/work",
        "packages/ui/src/platform/console-state/work-selectors.ts",
        "packages/ui/src/screens/validation",
        "packages/ui/src/screens/work"
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
      "acceptanceCriterion": "Automatic Task admission recommends and records risk and detail with deterministic reasons from goal, owned paths, affected scopes, and proof subject; explicit overrides remain visible",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Light Tasks follow a compact fast path with focused proof, minimal visible interactions, no tracked Task document, and no immutable snapshot requirement",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Impact analysis explains selected and skipped Guards and Actions, with regression proof for proportional selection",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Active Tasks detect changed paths outside declared ownership and provide safe exact ownership-expansion suggestions without silently adopting them for high-impact work",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "CLI success and failure output explains what happened, readiness, and the safest recovery or next command",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-6",
      "acceptanceCriterion": "The read-only UI presents one understandable workflow for readiness, owned versus unowned changes, required Evidence, and exact next actions",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-7",
      "acceptanceCriterion": "Reusable semantic Guard templates and a multi-project evaluation matrix prove positive, negative, historical, and ambiguous guidance cases without adding project-specific truth to core",
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
      "id": "memory-architecture-579535b5d3",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/evidence-and-readiness-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated canonical readiness architecture for progressive workflow, exact next-step guidance, and Evidence boundaries.",
      "resolvedAt": "2026-08-09T04:36:27.984Z",
      "resolvedByActorId": "codex-progressive-work"
    },
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated canonical operating model for automatic admission, light fast path, ownership guidance, and human-facing recovery.",
      "resolvedAt": "2026-08-09T04:36:30.124Z",
      "resolvedByActorId": "codex-progressive-work"
    },
    {
      "id": "memory-architecture-f171416107",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/action-extension-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/action-extension-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated canonical Action and Guard architecture for deterministic selection explanations and semantic templates.",
      "resolvedAt": "2026-08-09T04:36:32.161Z",
      "resolvedByActorId": "codex-progressive-work"
    },
    {
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/developer-workflows.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated developer workflows with progressive admission, ownership expansion, impact explanation, and closure commands.",
      "resolvedAt": "2026-08-09T04:36:34.671Z",
      "resolvedByActorId": "codex-progressive-work"
    },
    {
      "id": "memory-guide-f69150206f",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/semantic-guards.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/semantic-guards.md",
      "resolution": "memory-updated",
      "resolutionReason": "Added canonical reusable semantic Guard authoring and evaluation guide.",
      "resolvedAt": "2026-08-09T04:36:37.067Z",
      "resolvedByActorId": "codex-progressive-work"
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
      "resolvedAt": "2026-08-09T04:28:45.860Z",
      "resolvedByActorId": "codex-progressive-work"
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
  "ownershipExpansions": [
    {
      "paths": [
        "packages/cli/src/cli.ts",
        "packages/ui/src/platform/console-state/work-selectors.ts"
      ],
      "reason": "The complete user-requested workflow requires centralized CLI recovery guidance and UI workflow projection logic outside the originally declared directories.",
      "actorId": "codex-progressive-work",
      "recordedAt": "2026-08-09T04:06:19.186Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/cli.ts",
          "digest": "a49ad7526bf4323b7de4d9094f168eb8097a6c97e5572d377840a7497d97bb58"
        },
        {
          "path": "packages/ui/src/platform/console-state/work-selectors.ts",
          "digest": "253206466d6140674193c2ecd679a2550f0cff06cf3e63d399b3dec4c4e909b3"
        }
      ]
    },
    {
      "paths": [
        "package.json",
        "packages/ui/package.json"
      ],
      "reason": "The new progressive-workflow and UI regression suites must be part of the repository's canonical test commands rather than orphan tests.",
      "actorId": "codex-progressive-work",
      "recordedAt": "2026-08-09T04:14:46.002Z",
      "baselinePaths": [
        {
          "path": "package.json",
          "digest": "c76f510eaf20bd9dcbee69a47097c8e3d0314e9ec26f079e90da21cc1f6da15d"
        },
        {
          "path": "packages/ui/package.json",
          "digest": "46b7f2f42a263630fe417402a025a8108a50ec5ab4b3a8add12e89fc98c11072"
        }
      ]
    },
    {
      "paths": [
        "docs/00-start-here.md"
      ],
      "reason": "The new canonical semantic Guard guide must be discoverable from the human documentation router.",
      "actorId": "codex-progressive-work",
      "recordedAt": "2026-08-09T04:16:41.362Z",
      "baselinePaths": [
        {
          "path": "docs/00-start-here.md",
          "digest": "1ff606f90f1847e3068b001d21ccc2d1f4fd89a93f19f4d0709447b891d61433"
        }
      ]
    },
    {
      "paths": [
        "packages/cli/src/cli/shared/error-guidance.ts"
      ],
      "reason": "The package-boundary regression requires CLI recovery formatting to live in the support layer rather than the thin top-level router.",
      "actorId": "codex-progressive-work",
      "recordedAt": "2026-08-09T04:20:10.688Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/cli/shared/error-guidance.ts",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/00-start-here.md",
    "docs/architecture/action-extension-model.md",
    "docs/architecture/agent-native-operating-model.md",
    "docs/architecture/evidence-and-readiness-model.md",
    "docs/guides/developer-workflows.md",
    "docs/guides/semantic-guards.md",
    "fixtures/repos",
    "package.json",
    "packages/cli/src/__tests__",
    "packages/cli/src/cli.ts",
    "packages/cli/src/cli/commands/impact.ts",
    "packages/cli/src/cli/commands/router.ts",
    "packages/cli/src/cli/commands/task.ts",
    "packages/cli/src/cli/commands/verification.ts",
    "packages/cli/src/cli/help.ts",
    "packages/cli/src/cli/index.ts",
    "packages/cli/src/cli/shared/error-guidance.ts",
    "packages/indexer/src/application/match-actions/match-actions.service.ts",
    "packages/model/src/contracts/skopos-impact-report.ts",
    "packages/model/src/contracts/skopos-start.ts",
    "packages/model/src/contracts/skopos-task.ts",
    "packages/runtime/src/application/impact/impact.service.ts",
    "packages/runtime/src/application/start/start.service.ts",
    "packages/runtime/src/application/task/task.service.ts",
    "packages/runtime/src/application/verification/verification.service.ts",
    "packages/ui/package.json",
    "packages/ui/src/__tests__",
    "packages/ui/src/application/build-console-state",
    "packages/ui/src/contracts",
    "packages/ui/src/features/validation",
    "packages/ui/src/features/work",
    "packages/ui/src/platform/console-state/work-selectors.ts",
    "packages/ui/src/screens/validation",
    "packages/ui/src/screens/work",
    "packages/verification/src/application/build-impact-report/build-impact-report.service.ts",
    "policy-packs/verification/semantic-drift",
    "README.md"
  ]
}
```
<!-- skopos:task-state:end -->
