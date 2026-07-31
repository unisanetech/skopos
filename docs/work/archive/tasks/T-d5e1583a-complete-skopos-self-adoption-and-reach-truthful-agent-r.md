---
title: "Task: Complete Skopos self-adoption and reach truthful agent-ready Session state"
status: complete
owner: "codex"
id: T-d5e1583a
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
lastUpdated: 2026-07-31
---

# Task: Complete Skopos self-adoption and reach truthful agent-ready Session state

## Changelog

- `2026-07-31`: Synchronized Task state `complete` from Skopos.

## Goal

Complete Skopos self-adoption and reach truthful agent-ready Session state

## Acceptance

- Every active or durable Skopos document has an evidence-backed authority and lifecycle disposition
- The adoption proposal preserves current canonical truth without unnecessary document churn
- Adoption verification and activation complete with no unresolved material authority question
- Session context reports agent-ready adoption and routes to Work Queue when no Task is active

## Non-Goals

- Do not implement unrelated product roadmap features

## Constraints

- Do not fabricate review claims or bypass adoption approval
- Do not restructure already-canonical documents without evidence

## Owned Paths

- `.cursor/rules/project.mdc`
- `.github/copilot-instructions.md`
- `AGENTS.md`
- `CLAUDE.md`
- `docs`
- `skopos.config.yaml`
- `tools/skopos`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Does this plan change authentication, authorization, privacy, or security-sensitive behavior?** (decision, complete) — Security and privacy decisions should be confirmed explicitly before the agent modifies behavior.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Complete Skopos self-adoption and reach truthful agent-ready Session state" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Sync self-hosted instruction mirrors** (action, complete) — Required by Guard instructions.source-requires-sync.
- [x] **Refresh self-hosted knowledge state** (action, complete) — Required by Guard knowledge.refresh.

## Actions And Guards

- Action `instructions.sync-mirrors`: Required by Guard instructions.source-requires-sync.
- Action `maintenance.refresh-knowledge`: Required by Guard knowledge.refresh.
- Guard `instructions.source-requires-sync`
- Guard `knowledge.refresh`

## Evidence And Readiness

- Every active or durable Skopos document has an evidence-backed authority and lifecycle disposition (closure, agent-observation)
- The adoption proposal preserves current canonical truth without unnecessary document churn (closure, agent-observation)
- Adoption verification and activation complete with no unresolved material authority question (closure, agent-observation)
- Session context reports agent-ready adoption and routes to Work Queue when no Task is active (closure, agent-observation)
- Guard instructions.source-requires-sync: Instruction source changes require synchronized mirrors (closure, source-bound-action)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-d5e1583a",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-07-31T00:58:11.228Z",
  "updatedAt": "2026-07-31T01:10:29.529Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Complete Skopos self-adoption and reach truthful agent-ready Session state",
  "goal": "Complete Skopos self-adoption and reach truthful agent-ready Session state",
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
      "Every active or durable Skopos document has an evidence-backed authority and lifecycle disposition",
      "The adoption proposal preserves current canonical truth without unnecessary document churn",
      "Adoption verification and activation complete with no unresolved material authority question",
      "Session context reports agent-ready adoption and routes to Work Queue when no Task is active"
    ],
    "nonGoals": [
      "Do not implement unrelated product roadmap features"
    ],
    "constraints": [
      "Do not fabricate review claims or bypass adoption approval",
      "Do not restructure already-canonical documents without evidence"
    ]
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
      "detail": "Carry out \"Complete Skopos self-adoption and reach truthful agent-ready Session state\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-maintenance.refresh-knowledge",
      "kind": "action",
      "title": "Refresh self-hosted knowledge state",
      "detail": "Required by Guard knowledge.refresh.",
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
      "id": "maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
      "reason": "Required by Guard knowledge.refresh.",
      "matchedPaths": [
        "skopos.config.yaml"
      ],
      "outputPaths": [
        ".skopos/index"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "instructions.source-requires-sync",
    "knowledge.refresh"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Every active or durable Skopos document has an evidence-backed authority and lifecycle disposition",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The adoption proposal preserves current canonical truth without unnecessary document churn",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Adoption verification and activation complete with no unresolved material authority question",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Session context reports agent-ready adoption and routes to Work Queue when no Task is active",
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
      "id": "guard-knowledge.refresh",
      "acceptanceCriterion": "Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge",
      "phase": "closure",
      "actionIds": [
        "maintenance.refresh-knowledge"
      ],
      "guardIds": [
        "knowledge.refresh"
      ],
      "evidence": "source-bound-action"
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
      "resolvedAt": "2026-07-31T00:58:31.103Z",
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
      "resolvedAt": "2026-07-31T00:58:34.754Z",
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
      "id": "run-maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "summary": "Required by Guard knowledge.refresh.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "maintenance.refresh-knowledge",
      "blocking": false,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    ".cursor/rules/project.mdc",
    ".github/copilot-instructions.md",
    "AGENTS.md",
    "CLAUDE.md",
    "docs",
    "skopos.config.yaml",
    "tools/skopos"
  ]
}
```
<!-- skopos:task-state:end -->
