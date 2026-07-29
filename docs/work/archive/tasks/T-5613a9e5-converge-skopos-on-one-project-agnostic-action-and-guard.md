---
title: "Task: Converge Skopos on one project-agnostic Action and Guard authority"
status: complete
owner: "codex"
id: T-5613a9e5
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-07-29
---

# Task: Converge Skopos on one project-agnostic Action and Guard authority

## Changelog

- `2026-07-29`: Synchronized Task state `complete` from Skopos.

## Goal

Converge Skopos on one project-agnostic Action and Guard authority

## Acceptance

- Tracked Actions are the sole executable validation authority and command-mode execution is removed
- Accepted Policies compile into the same Guard and Evidence model without project-specific core rules
- Task verification consumes current native Project Memory integrity and acceptance-linked Evidence
- Focused model, indexer, runtime, verification, and CLI tests pass

## Non-Goals

- None declared.

## Constraints

- None declared.

## Owned Paths

- `docs/architecture`
- `docs/work/plans`
- `packages/cli`
- `packages/config`
- `packages/indexer`
- `packages/model`
- `packages/planner`
- `packages/runtime`
- `packages/verification`
- `tools/skopos`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Does this plan change authentication, authorization, privacy, or security-sensitive behavior?** (decision, complete) — Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Converge Skopos on one project-agnostic Action and Guard authority" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Run selected project Actions** (action, complete) — Use the registered Action surface where needed: graph.render-local-portal | instructions.sync-mirrors | maintenance.refresh-knowledge | quality.run-proof-phase | ui.build-console-app
- [x] **Refresh self-hosted knowledge state** (action, complete) — Run after changing the Skopos subtree workspace shape, root config, docs routing, or declared Actions.
- [x] **Build routed Skopos console app** (action, complete) — Run after changing routed UI state shaping, the console app shell, route structure, or other human-facing app surfaces.

## Actions And Guards

- Action `graph.render-local-portal`: Run after changing graph artifacts, portal rendering, Readiness projections, or recent activity views.
- Action `instructions.sync-mirrors`: Run after changing AGENTS.md or instruction-routing guidance inside the Skopos subtree.
- Action `maintenance.refresh-knowledge`: Run after changing the Skopos subtree workspace shape, root config, docs routing, or declared Actions.
- Action `quality.run-proof-phase`: Run after changing runtime behavior, proof fixtures, scorecard contracts, or other reliability-critical Skopos surfaces.
- Action `ui.build-console-app`: Run after changing routed UI state shaping, the console app shell, route structure, or other human-facing app surfaces.

## Evidence And Readiness

- Tracked Actions are the sole executable validation authority and command-mode execution is removed (closure, agent-observation)
- Accepted Policies compile into the same Guard and Evidence model without project-specific core rules (closure, agent-observation)
- Task verification consumes current native Project Memory integrity and acceptance-linked Evidence (closure, agent-observation)
- Focused model, indexer, runtime, verification, and CLI tests pass (closure, agent-observation)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-5613a9e5",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-07-29T19:24:43.871Z",
  "updatedAt": "2026-07-29T20:08:12.841Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Converge Skopos on one project-agnostic Action and Guard authority",
  "goal": "Converge Skopos on one project-agnostic Action and Guard authority",
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
      "Tracked Actions are the sole executable validation authority and command-mode execution is removed",
      "Accepted Policies compile into the same Guard and Evidence model without project-specific core rules",
      "Task verification consumes current native Project Memory integrity and acceptance-linked Evidence",
      "Focused model, indexer, runtime, verification, and CLI tests pass"
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
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
      "id": "decision-plan.security-privacy-change",
      "kind": "decision",
      "title": "Does this plan change authentication, authorization, privacy, or security-sensitive behavior?",
      "detail": "Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.",
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
      "detail": "Carry out \"Converge Skopos on one project-agnostic Action and Guard authority\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "step-run-actions",
      "kind": "action",
      "title": "Run selected project Actions",
      "detail": "Use the registered Action surface where needed: graph.render-local-portal | instructions.sync-mirrors | maintenance.refresh-knowledge | quality.run-proof-phase | ui.build-console-app",
      "status": "complete"
    },
    {
      "id": "action-maintenance.refresh-knowledge",
      "kind": "action",
      "title": "Refresh self-hosted knowledge state",
      "detail": "Run after changing the Skopos subtree workspace shape, root config, docs routing, or declared Actions.",
      "status": "complete"
    },
    {
      "id": "action-ui.build-console-app",
      "kind": "action",
      "title": "Build routed Skopos console app",
      "detail": "Run after changing routed UI state shaping, the console app shell, route structure, or other human-facing app surfaces.",
      "status": "complete"
    }
  ],
  "selectedActions": [
    {
      "id": "graph.render-local-portal",
      "title": "Render local Skopos portal",
      "category": "graph-generator",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/graph-render-local-portal.yaml",
      "reason": "Run after changing graph artifacts, portal rendering, Readiness projections, or recent activity views.",
      "matchedPaths": [],
      "outputPaths": [
        ".skopos/ui/index.html",
        ".skopos/ui/graph-portal.html"
      ],
      "requiresApproval": false
    },
    {
      "id": "instructions.sync-mirrors",
      "title": "Sync self-hosted instruction mirrors",
      "category": "docs-generator",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/instructions-sync-mirrors.yaml",
      "reason": "Run after changing AGENTS.md or instruction-routing guidance inside the Skopos subtree.",
      "matchedPaths": [],
      "outputPaths": [
        "CLAUDE.md",
        ".cursor/rules/project.mdc",
        ".github/copilot-instructions.md"
      ],
      "requiresApproval": false
    },
    {
      "id": "maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
      "reason": "Run after changing the Skopos subtree workspace shape, root config, docs routing, or declared Actions.",
      "matchedPaths": [],
      "outputPaths": [
        ".skopos/index/bootstrap.json",
        ".skopos/index/scopes.json",
        ".skopos/index/diagnosis.json",
        ".skopos/index/architecture.json",
        ".skopos/index/enforcement.json",
        ".skopos/index/memory.json",
        ".skopos/runs/operations.jsonl"
      ],
      "requiresApproval": false
    },
    {
      "id": "quality.run-proof-phase",
      "title": "Run proof-phase scorecard",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-run-proof-phase.yaml",
      "reason": "Run after changing runtime behavior, proof fixtures, scorecard contracts, or other reliability-critical Skopos surfaces.",
      "matchedPaths": [],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "ui.build-console-app",
      "title": "Build routed Skopos console app",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-build-console-app.yaml",
      "reason": "Run after changing routed UI state shaping, the console app shell, route structure, or other human-facing app surfaces.",
      "matchedPaths": [],
      "outputPaths": [
        ".skopos/ui/app"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Tracked Actions are the sole executable validation authority and command-mode execution is removed",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Accepted Policies compile into the same Guard and Evidence model without project-specific core rules",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Task verification consumes current native Project Memory integrity and acceptance-linked Evidence",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Focused model, indexer, runtime, verification, and CLI tests pass",
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
      "status": "resolved",
      "resolvedOptionId": "keep-workspace-scope",
      "resolvedAt": "2026-07-29T19:25:10.875Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "plan.security-privacy-change",
      "category": "security",
      "escalation": "must-ask",
      "question": "Does this plan change authentication, authorization, privacy, or security-sensitive behavior?",
      "whyItMatters": "Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.",
      "recommendedOptionId": "confirm-security-policy",
      "options": [
        {
          "id": "confirm-security-policy",
          "label": "Confirm policy first",
          "rationale": "Recommended because security-sensitive changes should follow an explicit policy choice."
        },
        {
          "id": "implement-fast-path",
          "label": "Implement fast path",
          "rationale": "Use only when the required policy is already settled and documented."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "implement-fast-path",
      "resolvedAt": "2026-07-29T19:25:07.579Z",
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
      "id": "resolve-plan.security-privacy-change",
      "title": "Resolve: Does this plan change authentication, authorization, privacy, or security-sensitive behavior?",
      "summary": "Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.security-privacy-change",
      "blocking": true,
      "status": "complete"
    },
    {
      "id": "run-graph.render-local-portal",
      "title": "Render local Skopos portal",
      "summary": "Run after changing graph artifacts, portal rendering, Readiness projections, or recent activity views.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "graph.render-local-portal",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-instructions.sync-mirrors",
      "title": "Sync self-hosted instruction mirrors",
      "summary": "Run after changing AGENTS.md or instruction-routing guidance inside the Skopos subtree.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "instructions.sync-mirrors",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "summary": "Run after changing the Skopos subtree workspace shape, root config, docs routing, or declared Actions.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "maintenance.refresh-knowledge",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-quality.run-proof-phase",
      "title": "Run proof-phase scorecard",
      "summary": "Run after changing runtime behavior, proof fixtures, scorecard contracts, or other reliability-critical Skopos surfaces.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.run-proof-phase",
      "blocking": false,
      "status": "open"
    },
    {
      "id": "run-ui.build-console-app",
      "title": "Build routed Skopos console app",
      "summary": "Run after changing routed UI state shaping, the console app shell, route structure, or other human-facing app surfaces.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.build-console-app",
      "blocking": false,
      "status": "open"
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture",
    "docs/work/plans",
    "packages/cli",
    "packages/config",
    "packages/indexer",
    "packages/model",
    "packages/planner",
    "packages/runtime",
    "packages/verification",
    "tools/skopos"
  ]
}
```
<!-- skopos:task-state:end -->

