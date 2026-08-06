---
title: "Task: Modernize foundational Decisions without changing implemented contracts"
status: complete
owner: "codex-core-decision-convergence"
id: T-988c1c84
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-5a96c644859c3437
lastUpdated: 2026-08-05
---

# Task: Modernize foundational Decisions without changing implemented contracts

## Changelog

- `2026-08-05`: Synchronized Task state `complete` from Skopos.

## Goal

Modernize foundational Decisions without changing implemented contracts

## Acceptance

- Decisions 003 through 006 use current Skopos vocabulary and accurately describe implemented authority boundaries.
- Decision 005 truthfully distinguishes CLI/MCP core, Claude native hooks, Codex wrapper delivery, and manual-host fallback.
- Decision 006 limits the proof-phase scorecard contract to its declared benchmark subject and does not conflict with the separate frozen Skill efficacy suite.
- No implementation, active adoption Task surface, or frozen Skill efficacy surface changes.
- Strict documentation catalog and Task Readiness pass without missing Evidence.

## Non-Goals

- Do not edit internal/evals, runtime code, host adapters, Product UI Craft evaluation contracts, or active Task-owned files.

## Constraints

- None declared.

## Owned Paths

- `docs/decisions/003-current-state-and-recommended-architecture-split.md`
- `docs/decisions/004-large-repo-operating-mode.md`
- `docs/decisions/005-tool-native-enforcement-strategy.md`
- `docs/decisions/006-eval-harness-and-scoring-contract.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Modernize foundational Decisions without changing implemented contracts" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Decisions 003 through 006 use current Skopos vocabulary and accurately describe implemented authority boundaries. (closure, agent-observation)
- Decision 005 truthfully distinguishes CLI/MCP core, Claude native hooks, Codex wrapper delivery, and manual-host fallback. (closure, agent-observation)
- Decision 006 limits the proof-phase scorecard contract to its declared benchmark subject and does not conflict with the separate frozen Skill efficacy suite. (closure, agent-observation)
- No implementation, active adoption Task surface, or frozen Skill efficacy surface changes. (closure, agent-observation)
- Strict documentation catalog and Task Readiness pass without missing Evidence. (closure, agent-observation)

## Memory Obligations

- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/004-large-repo-operating-mode.md; review and synchronize it if project truth changes. (target: `docs/decisions/004-large-repo-operating-mode.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/006-eval-harness-and-scoring-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/006-eval-harness-and-scoring-contract.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/005-tool-native-enforcement-strategy.md; review and synchronize it if project truth changes. (target: `docs/decisions/005-tool-native-enforcement-strategy.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/003-current-state-and-recommended-architecture-split.md; review and synchronize it if project truth changes. (target: `docs/decisions/003-current-state-and-recommended-architecture-split.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-988c1c84",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-05T11:03:05.287Z",
  "updatedAt": "2026-08-05T11:04:39.028Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Modernize foundational Decisions without changing implemented contracts",
  "goal": "Modernize foundational Decisions without changing implemented contracts",
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
      "Decisions 003 through 006 use current Skopos vocabulary and accurately describe implemented authority boundaries.",
      "Decision 005 truthfully distinguishes CLI/MCP core, Claude native hooks, Codex wrapper delivery, and manual-host fallback.",
      "Decision 006 limits the proof-phase scorecard contract to its declared benchmark subject and does not conflict with the separate frozen Skill efficacy suite.",
      "No implementation, active adoption Task surface, or frozen Skill efficacy surface changes.",
      "Strict documentation catalog and Task Readiness pass without missing Evidence."
    ],
    "nonGoals": [
      "Do not edit internal/evals, runtime code, host adapters, Product UI Craft evaluation contracts, or active Task-owned files."
    ],
    "constraints": []
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-5a96c644859c3437"
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
      "detail": "Carry out \"Modernize foundational Decisions without changing implemented contracts\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Decisions 003 through 006 use current Skopos vocabulary and accurately describe implemented authority boundaries.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Decision 005 truthfully distinguishes CLI/MCP core, Claude native hooks, Codex wrapper delivery, and manual-host fallback.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Decision 006 limits the proof-phase scorecard contract to its declared benchmark subject and does not conflict with the separate frozen Skill efficacy suite.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "No implementation, active adoption Task surface, or frozen Skill efficacy surface changes.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Strict documentation catalog and Task Readiness pass without missing Evidence.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-decision-1ed5fd862f",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/004-large-repo-operating-mode.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/004-large-repo-operating-mode.md",
      "resolution": "memory-updated",
      "resolutionReason": "Clarified subtree compilation authority and removed the obsolete open-Decision queue.",
      "resolvedAt": "2026-08-05T11:04:04.819Z",
      "resolvedByActorId": "codex-core-decision-convergence"
    },
    {
      "id": "memory-decision-3da7b245e6",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/006-eval-harness-and-scoring-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/006-eval-harness-and-scoring-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Clarified proof-subject locality and the separate frozen Skill efficacy evaluation authority.",
      "resolvedAt": "2026-08-05T11:04:05.978Z",
      "resolvedByActorId": "codex-core-decision-convergence"
    },
    {
      "id": "memory-decision-bf93bcac58",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/005-tool-native-enforcement-strategy.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/005-tool-native-enforcement-strategy.md",
      "resolution": "memory-updated",
      "resolutionReason": "Reconciled implemented Claude native, Codex wrapper, and manual-host capability boundaries.",
      "resolvedAt": "2026-08-05T11:04:05.383Z",
      "resolvedByActorId": "codex-core-decision-convergence"
    },
    {
      "id": "memory-decision-f1d9bc61b4",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/003-current-state-and-recommended-architecture-split.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/003-current-state-and-recommended-architecture-split.md",
      "resolution": "memory-updated",
      "resolutionReason": "Reconciled architecture interpretation with current Project Memory, UI, and Readiness vocabulary.",
      "resolvedAt": "2026-08-05T11:04:04.248Z",
      "resolvedByActorId": "codex-core-decision-convergence"
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
      "resolvedAt": "2026-08-05T11:03:18.703Z",
      "resolvedByActorId": "codex-core-decision-convergence"
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
      "resolvedOptionId": "internal-only-change",
      "resolvedAt": "2026-08-05T11:03:19.544Z",
      "resolvedByActorId": "codex-core-decision-convergence"
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
  "declaredOwnedPaths": [
    "docs/decisions/003-current-state-and-recommended-architecture-split.md",
    "docs/decisions/004-large-repo-operating-mode.md",
    "docs/decisions/005-tool-native-enforcement-strategy.md",
    "docs/decisions/006-eval-harness-and-scoring-contract.md"
  ]
}
```
<!-- skopos:task-state:end -->
