---
title: "Task: Reconcile the first public release blockers and prepare an exact candidate certification path without publishing"
status: deferred
owner: "project"
id: T-8deb91df
scope: "skopos"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-d1efc4ebda1e2cf2
lastUpdated: 2026-08-12
---

# Task: Reconcile the first public release blockers and prepare an exact candidate certification path without publishing

## Changelog

- `2026-08-12`: Synchronized Task state `deferred` from Skopos.

## Goal

Reconcile the first public release blockers and prepare an exact candidate certification path without publishing

## Acceptance

- Every current release No maps to an executable local proof or an explicit external prerequisite.
- Contradictory release authority is corrected without weakening accepted product gates.
- Locally actionable candidate defects and certification scripts are fixed and focused Evidence passes.
- No package, tag, repository visibility, or production deployment is changed.

## Non-Goals

- Publish, tag, promote, expose the repository, or configure external release credentials.

## Constraints

- Preserve unrelated accumulated work and do not infer Claude or Unisane proof.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `.github/workflows/publish.yml`
- `docs/operations/first-public-release-scorecard.md`
- `docs/operations/release-runbook.md`
- `docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md`
- `package.json`
- `scripts/release`
- `tools/skopos/skills/ui.product-interface-design.json`

## Ownership Expansions

- `2026-08-12T14:59:04.044Z` by `codex-root`: `.github/workflows/publish.yml` — The protected publish workflow must fail closed on the canonical release scorecard before any publication job can run.
- `2026-08-12T15:10:31.805Z` by `codex-root`: `tools/skopos/skills/ui.product-interface-design.json` — Fresh-checkout reconstruction proved the tracked accepted binding identity stale after intentional project-source changes; the exact 0.5.0 pack and binding must be re-evaluated and explicitly re-accepted.

## Steps

- [ ] **Record Task risk and detail before editing** (implementation, pending) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [ ] **Review the current pattern in Skopos Workspace** (implementation, pending) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Reconcile the first public release blockers and prepare an exact candidate certification path without publishing" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [ ] **Refresh self-hosted knowledge state** (action, pending) — Required by Guard knowledge.refresh.
- [ ] **Typecheck the Skopos workspace** (action, pending) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `maintenance.refresh-knowledge`: Required by Guard knowledge.refresh.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `knowledge.refresh`
- Guard `quality.typecheck`

## Evidence And Readiness

- Every current release No maps to an executable local proof or an explicit external prerequisite. (closure, agent-observation)
- Contradictory release authority is corrected without weakening accepted product gates. (closure, agent-observation)
- Locally actionable candidate defects and certification scripts are fixed and focused Evidence passes. (closure, agent-observation)
- No package, tag, repository visibility, or production deployment is changed. (closure, agent-observation)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [open] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-8deb91df",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-12T14:56:10.379Z",
  "updatedAt": "2026-08-12T15:54:20.902Z",
  "planIds": [],
  "childTasks": [],
  "state": "deferred",
  "detail": "detailed",
  "title": "Reconcile the first public release blockers and prepare an exact candidate certification path without publishing",
  "goal": "Reconcile the first public release blockers and prepare an exact candidate certification path without publishing",
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
      "Every current release No maps to an executable local proof or an explicit external prerequisite.",
      "Contradictory release authority is corrected without weakening accepted product gates.",
      "Locally actionable candidate defects and certification scripts are fixed and focused Evidence passes.",
      "No package, tag, repository visibility, or production deployment is changed."
    ],
    "nonGoals": [
      "Publish, tag, promote, expose the repository, or configure external release credentials."
    ],
    "constraints": [
      "Preserve unrelated accumulated work and do not infer Claude or Unisane proof."
    ]
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
        "skopos"
      ],
      "impactCategories": [
        "docs",
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-d1efc4ebda1e2cf2"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "step-record-task-risk",
      "kind": "implementation",
      "title": "Record Task risk and detail before editing",
      "detail": "Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.",
      "status": "pending"
    },
    {
      "id": "step-review-current-pattern",
      "kind": "implementation",
      "title": "Review the current pattern in Skopos Workspace",
      "detail": "Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.",
      "status": "pending"
    },
    {
      "id": "step-implement-scoped-change",
      "kind": "implementation",
      "title": "Implement the smallest scoped change",
      "detail": "Carry out \"Reconcile the first public release blockers and prepare an exact candidate certification path without publishing\" inside the resolved scope before widening impact to adjacent areas.",
      "status": "pending"
    },
    {
      "id": "step-sync-knowledge",
      "kind": "docs",
      "title": "Sync docs and instruction surfaces if touched",
      "detail": "Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.",
      "status": "pending"
    },
    {
      "id": "action-maintenance.refresh-knowledge",
      "kind": "action",
      "title": "Refresh self-hosted knowledge state",
      "detail": "Required by Guard knowledge.refresh.",
      "status": "pending"
    },
    {
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck the Skopos workspace",
      "detail": "Required by Guard quality.typecheck.",
      "status": "pending"
    }
  ],
  "selectedActions": [
    {
      "id": "maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
      "reason": "Required by Guard knowledge.refresh.",
      "matchedPaths": [
        "tools/skopos/skills/ui.product-interface-design.json"
      ],
      "outputPaths": [
        ".skopos/index"
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
        "package.json"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "knowledge.refresh",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Every current release No maps to an executable local proof or an explicit external prerequisite.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Contradictory release authority is corrected without weakening accepted product gates.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Locally actionable candidate defects and certification scripts are fixed and focused Evidence passes.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "No package, tag, repository visibility, or production deployment is changed.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
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
      "status": "open",
      "targetPath": "docs/architecture/00-architecture.md"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "run-maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "summary": "Required by Guard knowledge.refresh.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "maintenance.refresh-knowledge",
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
      "status": "open"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        ".github/workflows/publish.yml"
      ],
      "reason": "The protected publish workflow must fail closed on the canonical release scorecard before any publication job can run.",
      "actorId": "codex-root",
      "recordedAt": "2026-08-12T14:59:04.044Z",
      "baselinePaths": [
        {
          "path": ".github/workflows/publish.yml",
          "digest": "bd3e751cdd42caf7e89cde6620bc99bc21dde7b14d112c6a94aafffed41ee565"
        }
      ],
      "classification": "within-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos"
      ]
    },
    {
      "paths": [
        "tools/skopos/skills/ui.product-interface-design.json"
      ],
      "reason": "Fresh-checkout reconstruction proved the tracked accepted binding identity stale after intentional project-source changes; the exact 0.5.0 pack and binding must be re-evaluated and explicitly re-accepted.",
      "actorId": "codex-root",
      "recordedAt": "2026-08-12T15:10:31.805Z",
      "baselinePaths": [
        {
          "path": "tools/skopos/skills/ui.product-interface-design.json",
          "digest": "f90af0ef533966dde2bb3ced55e2910fe28445f68d75a311533ac264f1051c0e"
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
  "disposition": {
    "kind": "defer",
    "reason": "Local release preparation, full core/web verification, and executable scorecard guards are complete. Candidate certification remains intentionally deferred until the external Claude and Unisane proof gates are supplied; no package publish or production deployment occurred.",
    "actorId": "codex-root",
    "recordedAt": "2026-08-12T15:54:20.902Z",
    "priorState": "active",
    "nextState": "deferred"
  },
  "declaredOwnedPaths": [
    ".github/workflows/publish.yml",
    "docs/operations/first-public-release-scorecard.md",
    "docs/operations/release-runbook.md",
    "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md",
    "package.json",
    "scripts/release",
    "tools/skopos/skills/ui.product-interface-design.json"
  ]
}
```
<!-- skopos:task-state:end -->
