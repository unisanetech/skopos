---
title: "Task: Certify packed cross-host conversation-aware continuation and close the accepted Plan"
status: complete
owner: "codex-continuation-implementation"
id: T-95d0e2ba
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-b8f0fb101a32480b
lastUpdated: 2026-08-05
---

# Task: Certify packed cross-host conversation-aware continuation and close the accepted Plan

## Changelog

- `2026-08-05`: Synchronized Task state `complete` from Skopos.

## Goal

Certify packed cross-host conversation-aware continuation and close the accepted Plan

## Acceptance

- Packed @skopos/cli proves fresh continuation in a minimal external project and a sanitized Billquest copy with no checkout resolution
- Current, refreshable, stale, conflicted, and invalid classifications plus Action/mutation recovery and Evidence invalidation boundaries are machine-proven
- Secret-like redaction, near-budget success, explicit over-budget failure, unsupported-host manual fallback, and clean reconstruction are machine-proven
- One real fresh Codex task and one manual-host continuation preserve objective, intent, corrections, progress, rejected options, stopping point, and next action without transcript replay
- Host delivery and origin completion reporting are recorded truthfully, with failure stage classification and live Billquest protection
- Decision, Finding, Plan, architecture, and workflow Memory reflect only verified final truth and the Finding closes only if every proof passes

## Non-Goals

- Model efficacy or subjective output quality evaluation

## Constraints

- Use packed artifacts and ordinary declared dependencies only
- Do not start paired Skill evaluation or new Skill packs

## Owned Paths

- `docs/architecture/agent-native-operating-model.md`
- `docs/architecture/artifact-model.md`
- `docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
- `docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`
- `docs/findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md`
- `docs/guides/developer-workflows.md`
- `docs/work/plans/P-20260805-conversation-aware-session-continuation-plan.md`
- `package.json`
- `packages/cli/package.json`
- `packages/cli/src/__tests__/discussion-continuation.test.ts`
- `packages/cli/src/__tests__/mcp-server-contract.test.ts`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/benchmarks/external-skill-portability.ts`
- `packages/cli/src/cli/commands/discussion.ts`
- `packages/cli/src/cli/help.ts`
- `packages/mcp/src/index.ts`
- `packages/runtime/src/application/discussion/discussion.service.ts`
- `packages/runtime/src/application/shared/discussion-handoff.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Certify packed cross-host conversation-aware continuation and close the accepted Plan" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Packed @skopos/cli proves fresh continuation in a minimal external project and a sanitized Billquest copy with no checkout resolution (closure, agent-observation)
- Current, refreshable, stale, conflicted, and invalid classifications plus Action/mutation recovery and Evidence invalidation boundaries are machine-proven (closure, agent-observation)
- Secret-like redaction, near-budget success, explicit over-budget failure, unsupported-host manual fallback, and clean reconstruction are machine-proven (closure, agent-observation)
- One real fresh Codex task and one manual-host continuation preserve objective, intent, corrections, progress, rejected options, stopping point, and next action without transcript replay (closure, agent-observation)
- Host delivery and origin completion reporting are recorded truthfully, with failure stage classification and live Billquest protection (closure, agent-observation)
- Decision, Finding, Plan, architecture, and workflow Memory reflect only verified final truth and the Finding closes only if every proof passes (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/artifact-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/artifact-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`); resolution: memory-updated
- [complete] finding: The declared Task scope owns canonical finding Memory at docs/findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md; review and synchronize it if project truth changes. (target: `docs/findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-95d0e2ba",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-04T23:35:17.767Z",
  "updatedAt": "2026-08-05T00:40:10.790Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Certify packed cross-host conversation-aware continuation and close the accepted Plan",
  "goal": "Certify packed cross-host conversation-aware continuation and close the accepted Plan",
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
      "Packed @skopos/cli proves fresh continuation in a minimal external project and a sanitized Billquest copy with no checkout resolution",
      "Current, refreshable, stale, conflicted, and invalid classifications plus Action/mutation recovery and Evidence invalidation boundaries are machine-proven",
      "Secret-like redaction, near-budget success, explicit over-budget failure, unsupported-host manual fallback, and clean reconstruction are machine-proven",
      "One real fresh Codex task and one manual-host continuation preserve objective, intent, corrections, progress, rejected options, stopping point, and next action without transcript replay",
      "Host delivery and origin completion reporting are recorded truthfully, with failure stage classification and live Billquest protection",
      "Decision, Finding, Plan, architecture, and workflow Memory reflect only verified final truth and the Finding closes only if every proof passes"
    ],
    "nonGoals": [
      "Model efficacy or subjective output quality evaluation"
    ],
    "constraints": [
      "Use packed artifacts and ordinary declared dependencies only",
      "Do not start paired Skill evaluation or new Skill packs"
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-b8f0fb101a32480b"
  },
  "priority": 0,
  "dependencyTaskIds": [
    "T-80f4df63"
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
      "detail": "Carry out \"Certify packed cross-host conversation-aware continuation and close the accepted Plan\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/src/benchmarks/external-skill-portability.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/package.json",
        "package.json",
        "packages/runtime/src/application/shared/discussion-handoff.ts",
        "packages/runtime/src/application/discussion/discussion.service.ts",
        "packages/cli/src/cli/commands/discussion.ts",
        "packages/cli/src/cli/help.ts",
        "packages/mcp/src/index.ts",
        "packages/cli/src/__tests__/discussion-continuation.test.ts",
        "packages/cli/src/__tests__/mcp-server-contract.test.ts"
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
      "acceptanceCriterion": "Packed @skopos/cli proves fresh continuation in a minimal external project and a sanitized Billquest copy with no checkout resolution",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Current, refreshable, stale, conflicted, and invalid classifications plus Action/mutation recovery and Evidence invalidation boundaries are machine-proven",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Secret-like redaction, near-budget success, explicit over-budget failure, unsupported-host manual fallback, and clean reconstruction are machine-proven",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "One real fresh Codex task and one manual-host continuation preserve objective, intent, corrections, progress, rejected options, stopping point, and next action without transcript replay",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Host delivery and origin completion reporting are recorded truthfully, with failure stage classification and live Billquest protection",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-6",
      "acceptanceCriterion": "Decision, Finding, Plan, architecture, and workflow Memory reflect only verified final truth and the Finding closes only if every proof passes",
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
      "id": "memory-architecture-1e8076edb8",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/artifact-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/artifact-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Implementation truth verified: the exact Task handoff remains local generated state with bounded agent-authored context and optional snapshot reconstruction.",
      "resolvedAt": "2026-08-05T00:25:57.494Z",
      "resolvedByActorId": "codex-continuation-implementation"
    },
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Implementation truth verified: fresh-session continuation reuses the canonical Task, Session, Evidence, and coordination lifecycle.",
      "resolvedAt": "2026-08-05T00:25:58.905Z",
      "resolvedByActorId": "codex-continuation-implementation"
    },
    {
      "id": "memory-decision-11a920677b",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Decision changelog now records verified Codex, manual, and truthful Claude capability outcomes.",
      "resolvedAt": "2026-08-05T00:26:00.501Z",
      "resolvedByActorId": "codex-continuation-implementation"
    },
    {
      "id": "memory-decision-3ec637c2cc",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Decision changelog now records the verified schemaVersion 1 hard cut and explicit Task identity selection.",
      "resolvedAt": "2026-08-05T00:26:01.876Z",
      "resolvedByActorId": "codex-continuation-implementation"
    },
    {
      "id": "memory-finding-7ee44d62ea",
      "role": "finding",
      "reason": "The declared Task scope owns canonical finding Memory at docs/findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md",
      "resolution": "memory-updated",
      "resolutionReason": "Finding resolution is synchronized to verified focused, packed, manual, and real Codex evidence.",
      "resolvedAt": "2026-08-05T00:26:55.080Z",
      "resolvedByActorId": "codex-continuation-implementation"
    },
    {
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/developer-workflows.md",
      "resolution": "memory-updated",
      "resolutionReason": "Guide documents exact Task-bound continuation commands, freshness, transfer, and host limitations.",
      "resolvedAt": "2026-08-05T00:26:56.392Z",
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
      "resolvedAt": "2026-08-04T23:35:31.526Z",
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
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/agent-native-operating-model.md",
    "docs/architecture/artifact-model.md",
    "docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md",
    "docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
    "docs/findings/F-20260805-conversation-aware-fresh-session-continuation-gap.md",
    "docs/guides/developer-workflows.md",
    "docs/work/plans/P-20260805-conversation-aware-session-continuation-plan.md",
    "package.json",
    "packages/cli/package.json",
    "packages/cli/src/__tests__/discussion-continuation.test.ts",
    "packages/cli/src/__tests__/mcp-server-contract.test.ts",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/benchmarks/external-skill-portability.ts",
    "packages/cli/src/cli/commands/discussion.ts",
    "packages/cli/src/cli/help.ts",
    "packages/mcp/src/index.ts",
    "packages/runtime/src/application/discussion/discussion.service.ts",
    "packages/runtime/src/application/shared/discussion-handoff.ts"
  ]
}
```
<!-- skopos:task-state:end -->
