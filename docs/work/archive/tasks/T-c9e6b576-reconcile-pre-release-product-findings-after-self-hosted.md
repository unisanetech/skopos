---
title: "Task: Reconcile pre-release product Findings after self-hosted hardening"
status: complete
owner: "codex"
id: T-c9e6b576
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-d37352a2042114cc
lastUpdated: 2026-08-11
---

# Task: Reconcile pre-release product Findings after self-hosted hardening

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Reconcile pre-release product Findings after self-hosted hardening

## Acceptance

- The topology authority Finding is resolved with its source, packed-host, split-guidance, and reconstruction proof stated.
- The convergence Plan no longer describes semantic drift, browser Evidence, or convention Memory as deferred post-release work.
- The release Plan records these hardening changes as completed without claiming publication readiness or closing unrelated Skill and hosting gates.
- The Work Queue and release proof report remaining blockers truthfully after reconciliation.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md`
- `docs/findings/F-20260811-topology-aware-task-scope-resolution-gap.md`
- `docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `package.json`

## Ownership Expansions

- `2026-08-11T02:41:48.329Z` by `codex`: `package.json` — The new first-class browser Evidence fixture must run in the default CLI test gate, not only in an ad hoc focused command.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Reconcile pre-release product Findings after self-hosted hardening" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.typecheck`

## Evidence And Readiness

- The topology authority Finding is resolved with its source, packed-host, split-guidance, and reconstruction proof stated. (closure, agent-observation)
- The convergence Plan no longer describes semantic drift, browser Evidence, or convention Memory as deferred post-release work. (closure, agent-observation)
- The release Plan records these hardening changes as completed without claiming publication readiness or closing unrelated Skill and hosting gates. (closure, agent-observation)
- The Work Queue and release proof report remaining blockers truthfully after reconciliation. (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-c9e6b576",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T02:40:46.266Z",
  "updatedAt": "2026-08-11T02:45:02.939Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Reconcile pre-release product Findings after self-hosted hardening",
  "goal": "Reconcile pre-release product Findings after self-hosted hardening",
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
      "The topology authority Finding is resolved with its source, packed-host, split-guidance, and reconstruction proof stated.",
      "The convergence Plan no longer describes semantic drift, browser Evidence, or convention Memory as deferred post-release work.",
      "The release Plan records these hardening changes as completed without claiming publication readiness or closing unrelated Skill and hosting gates.",
      "The Work Queue and release proof report remaining blockers truthfully after reconciliation."
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
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "The goal contains high-impact signal: release."
    ],
    "signals": {
      "goalSignals": [
        "release"
      ],
      "ownedPathCount": 4,
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
    "baselineId": "baseline-d37352a2042114cc"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
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
      "detail": "Carry out \"Reconcile pre-release product Findings after self-hosted hardening\" inside the resolved scope before widening impact to adjacent areas.",
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
        "package.json"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "The topology authority Finding is resolved with its source, packed-host, split-guidance, and reconstruction proof stated.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The convergence Plan no longer describes semantic drift, browser Evidence, or convention Memory as deferred post-release work.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The release Plan records these hardening changes as completed without claiming publication readiness or closing unrelated Skill and hosting gates.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The Work Queue and release proof report remaining blockers truthfully after reconciliation.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
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
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope skopos.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "This Task reconciles Findings and release Plans; the canonical architecture already contains the implemented topology, drift, browser Evidence, and convention Memory contracts.",
      "resolvedAt": "2026-08-11T02:44:02.206Z",
      "resolvedByActorId": "codex"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because new impact categories appeared (workspace-file). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos start 'Continue Reconcile pre-release product Findings after self-hosted hardening as bounded follow-up work' . --scope 'skopos' --own 'package.json' --actor 'codex'",
      "ownedPaths": [
        "package.json"
      ],
      "scopeId": "skopos",
      "reason": "The Task may be drifting from its admitted subject because new impact categories appeared (workspace-file).",
      "blocking": false,
      "status": "open"
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
  "ownershipExpansions": [
    {
      "paths": [
        "package.json"
      ],
      "reason": "The new first-class browser Evidence fixture must run in the default CLI test gate, not only in an ad hoc focused command.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T02:41:48.329Z",
      "baselinePaths": [
        {
          "path": "package.json",
          "digest": "d0d22817165156cb672dd40cba67c3f343de291bc729ade84dcb84aa06e5f57d"
        }
      ],
      "classification": "within-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "docs/findings/F-20260811-agent-iteration-bounding-and-evidence-gap.md",
    "docs/findings/F-20260811-topology-aware-task-scope-resolution-gap.md",
    "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "package.json"
  ]
}
```
<!-- skopos:task-state:end -->
