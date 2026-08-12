---
title: "Task: Record homepage-build product findings and topology-aware Task authority direction"
status: complete
owner: "codex"
id: T-8271bbbe
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: standard
proofSubject: task-closure
proofBaseline: baseline-24dadf8489bce2dd
lastUpdated: 2026-08-10
---

# Task: Record homepage-build product findings and topology-aware Task authority direction

## Changelog

- `2026-08-10`: Synchronized Task state `complete` from Skopos.

## Goal

Record homepage-build product findings and topology-aware Task authority direction

## Acceptance

- Observed Scope, closure, ask-back, Task drift, visual Evidence, and durable Memory gaps are recorded as focused Findings with severity and evidence.
- Durable cross-project Task Scope authority is accepted without hard-coding the homepage or declaring the broader web product complete.
- Architecture and release Plans distinguish pre-release blockers from post-release improvements and remain internally linked.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `tracked`
- Selected risk/detail: `standard` / `standard`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `automatic`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.

## Owned Paths

- `docs/architecture/decision-escalation-model.md`
- `docs/architecture/docs-governance.md`
- `docs/architecture/evidence-and-readiness-model.md`
- `docs/decisions/D-20260803-evidence-based-ask-back-classification.md`
- `docs/decisions/D-20260811-topology-aware-task-scope-authority.md`
- `docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md`
- `docs/findings/F-20260811-task-question-closure-invariant-gap.md`
- `docs/findings/F-20260811-topology-aware-task-scope-resolution-gap.md`
- `docs/work/plans/P-7dde6750-design-and-deliver-the-public-skopos-homepage.md`
- `docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Record homepage-build product findings and topology-aware Task authority direction" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Observed Scope, closure, ask-back, Task drift, visual Evidence, and durable Memory gaps are recorded as focused Findings with severity and evidence. (closure, agent-observation)
- Durable cross-project Task Scope authority is accepted without hard-coding the homepage or declaring the broader web product complete. (closure, agent-observation)
- Architecture and release Plans distinguish pre-release blockers from post-release improvements and remain internally linked. (closure, agent-observation)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/decision-escalation-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/decision-escalation-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/evidence-and-readiness-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes. (target: `docs/architecture/docs-governance.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260803-evidence-based-ask-back-classification.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260803-evidence-based-ask-back-classification.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-8271bbbe",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-10T23:16:01.122Z",
  "updatedAt": "2026-08-10T23:22:11.477Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "standard",
  "title": "Record homepage-build product findings and topology-aware Task authority direction",
  "goal": "Record homepage-build product findings and topology-aware Task authority direction",
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
      "Observed Scope, closure, ask-back, Task drift, visual Evidence, and durable Memory gaps are recorded as focused Findings with severity and evidence.",
      "Durable cross-project Task Scope authority is accepted without hard-coding the homepage or declaring the broader web product complete.",
      "Architecture and release Plans distinguish pre-release blockers from post-release improvements and remain internally linked."
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "standard",
  "admission": {
    "recommendedRisk": "standard",
    "recommendedDetail": "standard",
    "selectedRisk": "standard",
    "selectedDetail": "standard",
    "selectionSource": "automatic",
    "workflow": "tracked",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface."
    ],
    "signals": {
      "goalSignals": [],
      "ownedPathCount": 11,
      "affectedScopeIds": [
        "skopos"
      ],
      "impactCategories": [
        "docs"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-24dadf8489bce2dd"
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
      "detail": "Carry out \"Record homepage-build product findings and topology-aware Task authority direction\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Observed Scope, closure, ask-back, Task drift, visual Evidence, and durable Memory gaps are recorded as focused Findings with severity and evidence.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Durable cross-project Task Scope authority is accepted without hard-coding the homepage or declaring the broader web product complete.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Architecture and release Plans distinguish pre-release blockers from post-release improvements and remain internally linked.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-030023aa04",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/decision-escalation-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/decision-escalation-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated ask-back authority to distinguish deterministic Scope selection and public presentation from real human decisions.",
      "resolvedAt": "2026-08-10T23:21:18.434Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "memory-architecture-579535b5d3",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/evidence-and-readiness-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated terminal question consistency and source-bound browser Evidence target.",
      "resolvedAt": "2026-08-10T23:21:19.502Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "memory-architecture-fbdc372589",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/docs-governance.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated project-generic Task Scope authority and post-mutation baseline preservation rules.",
      "resolvedAt": "2026-08-10T23:21:20.595Z",
      "resolvedByActorId": "codex"
    },
    {
      "id": "memory-decision-95ee267954",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260803-evidence-based-ask-back-classification.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260803-evidence-based-ask-back-classification.md",
      "resolution": "memory-updated",
      "resolutionReason": "Extended the accepted subject-and-intent classifier to Scope and public-contract questions.",
      "resolvedAt": "2026-08-10T23:21:21.706Z",
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
      "resolvedOptionId": "keep-workspace-scope",
      "resolvedAt": "2026-08-10T23:16:42.725Z",
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
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/decision-escalation-model.md",
    "docs/architecture/docs-governance.md",
    "docs/architecture/evidence-and-readiness-model.md",
    "docs/decisions/D-20260803-evidence-based-ask-back-classification.md",
    "docs/decisions/D-20260811-topology-aware-task-scope-authority.md",
    "docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md",
    "docs/findings/F-20260811-task-question-closure-invariant-gap.md",
    "docs/findings/F-20260811-topology-aware-task-scope-resolution-gap.md",
    "docs/work/plans/P-7dde6750-design-and-deliver-the-public-skopos-homepage.md",
    "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md"
  ]
}
```
<!-- skopos:task-state:end -->
