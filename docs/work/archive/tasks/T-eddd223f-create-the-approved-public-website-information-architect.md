---
title: "Task: Create the approved public website information architecture, page copy specification, documentation model, and staged implementation backlog"
status: complete
owner: "codex-root"
id: T-eddd223f
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-b42f583ace73b794
lastUpdated: 2026-08-11
---

# Task: Create the approved public website information architecture, page copy specification, documentation model, and staged implementation backlog

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Create the approved public website information architecture, page copy specification, documentation model, and staged implementation backlog

## Acceptance

- The durable plan defines the restrained launch sitemap and global navigation.
- Every launch page has a clear audience question, content hierarchy, core copy, and CTA.
- Documentation combines conversation-first prompts with exact commands, concepts, reference, and troubleshooting.
- The backlog sequences shared foundations, pages, docs, truthful compatibility, and release verification without declaring the complete website finished.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `automatic`
- Reason: The goal contains high-impact signal: architecture.

## Owned Paths

- `docs/work/plans/P-20260812-public-web-information-architecture-and-content-plan.md`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?** (decision, complete) — Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Create the approved public website information architecture, page copy specification, documentation model, and staged implementation backlog" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- The durable plan defines the restrained launch sitemap and global navigation. (closure, agent-observation)
- Every launch page has a clear audience question, content hierarchy, core copy, and CTA. (closure, agent-observation)
- Documentation combines conversation-first prompts with exact commands, concepts, reference, and troubleshooting. (closure, agent-observation)
- The backlog sequences shared foundations, pages, docs, truthful compatibility, and release verification without declaring the complete website finished. (closure, agent-observation)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-eddd223f",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T19:58:22.000Z",
  "updatedAt": "2026-08-11T20:03:53.287Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Create the approved public website information architecture, page copy specification, documentation model, and staged implementation backlog",
  "goal": "Create the approved public website information architecture, page copy specification, documentation model, and staged implementation backlog",
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
      "The durable plan defines the restrained launch sitemap and global navigation.",
      "Every launch page has a clear audience question, content hierarchy, core copy, and CTA.",
      "Documentation combines conversation-first prompts with exact commands, concepts, reference, and troubleshooting.",
      "The backlog sequences shared foundations, pages, docs, truthful compatibility, and release verification without declaring the complete website finished."
    ],
    "nonGoals": [],
    "constraints": []
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "high-impact",
    "recommendedDetail": "detailed",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "automatic",
    "workflow": "strict",
    "reasons": [
      "The goal contains high-impact signal: architecture."
    ],
    "signals": {
      "goalSignals": [
        "architecture"
      ],
      "ownedPathCount": 1,
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
    "baselineId": "baseline-b42f583ace73b794"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.architecture-shift",
      "kind": "decision",
      "title": "Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "detail": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
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
      "detail": "Carry out \"Create the approved public website information architecture, page copy specification, documentation model, and staged implementation backlog\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "The durable plan defines the restrained launch sitemap and global navigation.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Every launch page has a clear audience question, content hierarchy, core copy, and CTA.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Documentation combines conversation-first prompts with exact commands, concepts, reference, and troubleshooting.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The backlog sequences shared foundations, pages, docs, truthful compatibility, and release verification without declaring the complete website finished.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope skopos.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "The approved work defines public-web information architecture and content within the existing apps/web and package boundaries; canonical runtime and package architecture do not change.",
      "resolvedAt": "2026-08-11T20:02:20.385Z",
      "resolvedByActorId": "codex-root"
    }
  ],
  "questions": [
    {
      "id": "plan.architecture-shift",
      "category": "architecture",
      "escalation": "must-ask",
      "question": "Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "whyItMatters": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "recommendedOptionId": "preserve-current-boundaries",
      "options": [
        {
          "id": "preserve-current-boundaries",
          "label": "Preserve current boundaries",
          "rationale": "Recommended unless the goal explicitly requires a structural redesign."
        },
        {
          "id": "approve-architecture-change",
          "label": "Approve architecture change",
          "rationale": "Use this when the change should redefine package, scope, or runtime boundaries."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "preserve-current-boundaries",
      "resolvedAt": "2026-08-11T19:58:41.567Z",
      "resolvedByActorId": "codex-root",
      "disposition": {
        "kind": "answered",
        "reason": "Selected Task question option preserve-current-boundaries.",
        "actorId": "codex-root",
        "recordedAt": "2026-08-11T19:58:41.567Z",
        "target": {
          "kind": "option",
          "ref": "preserve-current-boundaries"
        }
      }
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.architecture-shift",
      "title": "Resolve: Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "summary": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.architecture-shift",
      "blocking": true,
      "status": "complete"
    }
  ],
  "declaredOwnedPaths": [
    "docs/work/plans/P-20260812-public-web-information-architecture-and-content-plan.md"
  ]
}
```
<!-- skopos:task-state:end -->
