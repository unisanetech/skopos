---
title: "Task: Align public proof-subject guidance and command help"
status: complete
owner: "codex"
id: T-a327923c
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-f43953e31d1597ad
lastUpdated: 2026-08-03
---

# Task: Align public proof-subject guidance and command help

## Changelog

- `2026-08-03`: Synchronized Task state `complete` from Skopos.

## Goal

Align public proof-subject guidance and command help

## Acceptance

- README and developer workflow guidance explain task-closure versus project-integration with exact commands
- Generated operating instructions teach the project-integration variant without expanding the default hot path
- Command-specific help works for start, actions, verify, and finish without entering command execution
- Focused tests and current documentation checks pass

## Non-Goals

- Change proof-subject runtime semantics

## Constraints

- None declared.

## Owned Paths

- `AGENTS.md`
- `README.md`
- `docs/guides/developer-workflows.md`
- `packages/cli/src/__tests__/help-contract.test.ts`
- `packages/cli/src/cli.ts`
- `packages/cli/src/cli/help.ts`
- `packages/instructions/src/__tests__/scaffold-project-instructions.test.ts`
- `packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Align public proof-subject guidance and command help" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Sync self-hosted instruction mirrors** (action, complete) — Required by Guard instructions.source-requires-sync.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `instructions.sync-mirrors`: Required by Guard instructions.source-requires-sync.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `instructions.source-requires-sync`
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- README and developer workflow guidance explain task-closure versus project-integration with exact commands (closure, agent-observation)
- Generated operating instructions teach the project-integration variant without expanding the default hot path (closure, agent-observation)
- Command-specific help works for start, actions, verify, and finish without entering command execution (closure, agent-observation)
- Focused tests and current documentation checks pass (closure, agent-observation)
- Guard instructions.source-requires-sync: Instruction source changes require synchronized mirrors (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-a327923c",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-03T18:34:31.146Z",
  "updatedAt": "2026-08-03T19:18:21.894Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Align public proof-subject guidance and command help",
  "goal": "Align public proof-subject guidance and command help",
  "scope": {
    "query": "skopos",
    "matchedBy": "id",
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
      "README and developer workflow guidance explain task-closure versus project-integration with exact commands",
      "Generated operating instructions teach the project-integration variant without expanding the default hot path",
      "Command-specific help works for start, actions, verify, and finish without entering command execution",
      "Focused tests and current documentation checks pass"
    ],
    "nonGoals": [
      "Change proof-subject runtime semantics"
    ],
    "constraints": []
  },
  "risk": "standard",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-f43953e31d1597ad"
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
      "detail": "Carry out \"Align public proof-subject guidance and command help\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-instructions.sync-mirrors",
      "kind": "action",
      "title": "Sync self-hosted instruction mirrors",
      "detail": "Required by Guard instructions.source-requires-sync.",
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
      "id": "instructions.sync-mirrors",
      "title": "Sync self-hosted instruction mirrors",
      "category": "docs-generator",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/instructions-sync-mirrors.yaml",
      "reason": "Required by Guard instructions.source-requires-sync.",
      "matchedPaths": [
        "AGENTS.md"
      ],
      "outputPaths": [
        "CLAUDE.md",
        ".cursor/rules/project.mdc",
        ".github/copilot-instructions.md"
      ],
      "requiresApproval": false
    },
    {
      "id": "quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "packages/cli/src/cli/help.ts",
        "packages/cli/src/cli.ts",
        "packages/cli/src/__tests__/help-contract.test.ts",
        "packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts",
        "packages/instructions/src/__tests__/scaffold-project-instructions.test.ts"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "instructions.source-requires-sync",
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "README and developer workflow guidance explain task-closure versus project-integration with exact commands",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Generated operating instructions teach the project-integration variant without expanding the default hot path",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Command-specific help works for start, actions, verify, and finish without entering command execution",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused tests and current documentation checks pass",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-instructions.source-requires-sync",
      "acceptanceCriterion": "Guard instructions.source-requires-sync: Instruction source changes require synchronized mirrors",
      "phase": "closure",
      "actionIds": [
        "instructions.sync-mirrors"
      ],
      "guardIds": [
        "instructions.source-requires-sync"
      ],
      "evidence": "source-bound-action"
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
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/developer-workflows.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the canonical developer workflow with proof-subject selection and overlay-safe Action guidance",
      "resolvedAt": "2026-08-03T18:56:51.750Z",
      "resolvedByActorId": "codex"
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
      "resolvedOptionId": "narrow-scope-first",
      "resolvedAt": "2026-08-03T18:36:17.571Z",
      "resolvedByActorId": "codex"
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
      "resolvedAt": "2026-08-03T18:36:21.267Z",
      "resolvedByActorId": "codex"
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
    },
    {
      "id": "run-instructions.sync-mirrors",
      "title": "Sync self-hosted instruction mirrors",
      "summary": "Required by Guard instructions.source-requires-sync.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "instructions.sync-mirrors",
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
    "AGENTS.md",
    "README.md",
    "docs/guides/developer-workflows.md",
    "packages/cli/src/__tests__/help-contract.test.ts",
    "packages/cli/src/cli.ts",
    "packages/cli/src/cli/help.ts",
    "packages/instructions/src/__tests__/scaffold-project-instructions.test.ts",
    "packages/instructions/src/application/scaffold-project-instructions/scaffold-project-instructions.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
