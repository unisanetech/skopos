---
title: "Task: Reconcile the local pre-freeze release candidate and close every locally provable homepage and product-truth gap"
status: complete
owner: "codex-release-reconciliation"
id: T-4c690abd
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-dc8e21cab3a8636a
lastUpdated: 2026-08-11
---

# Task: Reconcile the local pre-freeze release candidate and close every locally provable homepage and product-truth gap

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Reconcile the local pre-freeze release candidate and close every locally provable homepage and product-truth gap

## Acceptance

- Homepage release truth, destinations, metadata assets, and focused verification are internally consistent and pass
- North-star continuation metric has a canonical definition, executable measurement owner, and recorded current baseline
- Host-parity, adopter-replacement, and historical-document gates are resolved only where source-bound evidence exists and otherwise retain exact blockers
- The release scorecard and active Plans identify the precise freeze boundary without claiming publication readiness

## Non-Goals

- Publish, deploy, configure external hosting, or create npm/GitHub release authority
- Claim real Claude or Unisane proof without running it

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `apps/web`
- `docs/operations/first-public-release-scorecard.md`
- `docs/operations/fresh-session-continuation-metric.md`
- `docs/scopes/skopos-web/overview.md`
- `docs/work/plans/P-7dde6750-design-and-deliver-the-public-skopos-homepage.md`
- `docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`

## Ownership Expansions

- `2026-08-11T11:45:38.400Z` by `codex-release-reconciliation`: `docs/operations/fresh-session-continuation-metric.md` — Record the canonical release baseline and eligibility rules for the already-defined north-star continuation measure.
- `2026-08-11T11:49:22.895Z` by `codex-release-reconciliation`: `docs/scopes/skopos-web/overview.md` — Reconcile the public-web Scope Memory with the homepage candidate's target-state npm copy and deployment sequencing gate.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Reconcile the local pre-freeze release candidate and close every locally provable homepage and product-truth gap" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.

## Actions And Guards

- No Action or Guard is selected.

## Evidence And Readiness

- Homepage release truth, destinations, metadata assets, and focused verification are internally consistent and pass (closure, agent-observation)
- North-star continuation metric has a canonical definition, executable measurement owner, and recorded current baseline (closure, agent-observation)
- Host-parity, adopter-replacement, and historical-document gates are resolved only where source-bound evidence exists and otherwise retain exact blockers (closure, agent-observation)
- The release scorecard and active Plans identify the precise freeze boundary without claiming publication readiness (closure, agent-observation)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-4c690abd",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T11:43:54.174Z",
  "updatedAt": "2026-08-11T11:51:11.263Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Reconcile the local pre-freeze release candidate and close every locally provable homepage and product-truth gap",
  "goal": "Reconcile the local pre-freeze release candidate and close every locally provable homepage and product-truth gap",
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
      "Homepage release truth, destinations, metadata assets, and focused verification are internally consistent and pass",
      "North-star continuation metric has a canonical definition, executable measurement owner, and recorded current baseline",
      "Host-parity, adopter-replacement, and historical-document gates are resolved only where source-bound evidence exists and otherwise retain exact blockers",
      "The release scorecard and active Plans identify the precise freeze boundary without claiming publication readiness"
    ],
    "nonGoals": [
      "Publish, deploy, configure external hosting, or create npm/GitHub release authority",
      "Claim real Claude or Unisane proof without running it"
    ],
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
      "ownedPathCount": 5,
      "affectedScopeIds": [
        "skopos",
        "skopos-web"
      ],
      "impactCategories": [
        "docs",
        "scope-source"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-dc8e21cab3a8636a"
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
      "detail": "Carry out \"Reconcile the local pre-freeze release candidate and close every locally provable homepage and product-truth gap\" inside the resolved scope before widening impact to adjacent areas.",
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
      "acceptanceCriterion": "Homepage release truth, destinations, metadata assets, and focused verification are internally consistent and pass",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "North-star continuation metric has a canonical definition, executable measurement owner, and recorded current baseline",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Host-parity, adopter-replacement, and historical-document gates are resolved only where source-bound evidence exists and otherwise retain exact blockers",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The release scorecard and active Plans identify the precise freeze boundary without claiming publication readiness",
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
      "resolutionReason": "Reviewed canonical architecture; this reconciliation changes release operations, public-web launch sequencing, and scorecard truth without changing product architecture or package boundaries.",
      "resolvedAt": "2026-08-11T11:50:11.927Z",
      "resolvedByActorId": "codex-release-reconciliation"
    }
  ],
  "questions": [],
  "recommendations": [],
  "ownershipExpansions": [
    {
      "paths": [
        "docs/operations/fresh-session-continuation-metric.md"
      ],
      "reason": "Record the canonical release baseline and eligibility rules for the already-defined north-star continuation measure.",
      "actorId": "codex-release-reconciliation",
      "recordedAt": "2026-08-11T11:45:38.400Z",
      "baselinePaths": [
        {
          "path": "docs/operations/fresh-session-continuation-metric.md",
          "digest": "ffa63583dfa6706b87d284b86b0d693a161e4840aad2c5cf6b5d27c3b9621f7d"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-web"
      ]
    },
    {
      "paths": [
        "docs/scopes/skopos-web/overview.md"
      ],
      "reason": "Reconcile the public-web Scope Memory with the homepage candidate's target-state npm copy and deployment sequencing gate.",
      "actorId": "codex-release-reconciliation",
      "recordedAt": "2026-08-11T11:49:22.895Z",
      "baselinePaths": [
        {
          "path": "docs/scopes/skopos-web/overview.md",
          "digest": "86bf95151c5c2b89ca6c39610e2f6e10304540e01488a0675432a68796b4b356"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-web"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "apps/web",
    "docs/operations/first-public-release-scorecard.md",
    "docs/operations/fresh-session-continuation-metric.md",
    "docs/scopes/skopos-web/overview.md",
    "docs/work/plans/P-7dde6750-design-and-deliver-the-public-skopos-homepage.md",
    "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md"
  ]
}
```
<!-- skopos:task-state:end -->
