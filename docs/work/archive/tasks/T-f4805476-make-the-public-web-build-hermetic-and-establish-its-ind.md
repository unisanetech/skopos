---
title: "Task: Make the public web build hermetic and establish its independent deployment gate"
status: complete
owner: "codex"
id: T-f4805476
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-36fb874b2cdc7f29
lastUpdated: 2026-08-11
---

# Task: Make the public web build hermetic and establish its independent deployment gate

## Changelog

- `2026-08-11`: Synchronized Task state `complete` from Skopos.

## Goal

Make the public web build hermetic and establish its independent deployment gate

## Acceptance

- The public site builds without network-dependent font fetching and preserves the approved Geist typography
- One explicit web-owned verification command proves typecheck, tests, and production build without entering the CLI release boundary
- The web build Finding and release plan accurately reflect completed topology fixes and remaining release blockers
- Linked child Tasks have non-overlapping ownership and the parent closes only after every child is complete

## Non-Goals

- Deploy the website or publish the CLI

## Constraints

- Keep website deployment proof separate from CLI npm release certification

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: deployment.

## Owned Paths

- `apps/web/package.json`
- `apps/web/src/app/layout.tsx`
- `docs/findings/F-20260811-public-web-build-and-cli-release-gate-coupling.md`
- `docs/work/archive/tasks/T-02176c1d-add-and-run-one-independent-web-deployment-verification-.md`
- `docs/work/archive/tasks/T-660d5b70-resolve-the-web-build-finding-and-reconcile-stale-releas.md`
- `docs/work/archive/tasks/T-75133dbb-self-host-geist-for-the-public-site-and-prove-the-produc.md`
- `docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md`
- `package.json`
- `pnpm-lock.yaml`

## Ownership Expansions

- `2026-08-11T06:20:24.077Z` by `codex`: `docs/work/archive/tasks/T-02176c1d-add-and-run-one-independent-web-deployment-verification-.md`, `docs/work/archive/tasks/T-660d5b70-resolve-the-web-build-finding-and-reconcile-stale-releas.md`, `docs/work/archive/tasks/T-75133dbb-self-host-geist-for-the-public-site-and-prove-the-produc.md`, `pnpm-lock.yaml` — Adopt the reviewed outputs and portable Task records produced by the three linked children.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Make the public web build hermetic and establish its independent deployment gate" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.typecheck`

## Evidence And Readiness

- The public site builds without network-dependent font fetching and preserves the approved Geist typography (closure, agent-observation)
- One explicit web-owned verification command proves typecheck, tests, and production build without entering the CLI release boundary (closure, agent-observation)
- The web build Finding and release plan accurately reflect completed topology fixes and remaining release blockers (closure, agent-observation)
- Linked child Tasks have non-overlapping ownership and the parent closes only after every child is complete (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-f4805476",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-11T06:01:50.334Z",
  "updatedAt": "2026-08-11T06:22:41.780Z",
  "planIds": [],
  "childTasks": [
    {
      "taskId": "T-75133dbb",
      "title": "Self-host Geist for the public site and prove the production build no longer fetches fonts from the network",
      "goal": "Self-host Geist for the public site and prove the production build no longer fetches fonts from the network",
      "scopeId": "skopos",
      "state": "complete",
      "createdAt": "2026-08-11T06:04:33.827Z",
      "createdByActorId": "codex",
      "ownedPaths": [
        "apps/web/package.json",
        "apps/web/src/app/layout.tsx",
        "pnpm-lock.yaml"
      ],
      "dependencyTaskIds": [],
      "parentAcceptanceRequirementIds": [
        "acceptance-1"
      ],
      "claimedByActorId": "codex-web-fonts"
    },
    {
      "taskId": "T-02176c1d",
      "title": "Add and run one independent web deployment verification command",
      "goal": "Add and run one independent web deployment verification command",
      "scopeId": "skopos",
      "state": "complete",
      "createdAt": "2026-08-11T06:04:33.827Z",
      "createdByActorId": "codex",
      "ownedPaths": [
        "package.json"
      ],
      "dependencyTaskIds": [
        "T-75133dbb"
      ],
      "parentAcceptanceRequirementIds": [
        "acceptance-2"
      ],
      "claimedByActorId": "codex-web-gate"
    },
    {
      "taskId": "T-660d5b70",
      "title": "Resolve the web build Finding and reconcile stale release-plan blockers with current project truth",
      "goal": "Resolve the web build Finding and reconcile stale release-plan blockers with current project truth",
      "scopeId": "skopos",
      "state": "complete",
      "createdAt": "2026-08-11T06:04:33.827Z",
      "createdByActorId": "codex",
      "ownedPaths": [
        "docs/findings/F-20260811-public-web-build-and-cli-release-gate-coupling.md",
        "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md"
      ],
      "dependencyTaskIds": [
        "T-02176c1d"
      ],
      "parentAcceptanceRequirementIds": [
        "acceptance-3"
      ],
      "claimedByActorId": "codex-release-truth"
    }
  ],
  "state": "complete",
  "detail": "detailed",
  "title": "Make the public web build hermetic and establish its independent deployment gate",
  "goal": "Make the public web build hermetic and establish its independent deployment gate",
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
      "The public site builds without network-dependent font fetching and preserves the approved Geist typography",
      "One explicit web-owned verification command proves typecheck, tests, and production build without entering the CLI release boundary",
      "The web build Finding and release plan accurately reflect completed topology fixes and remaining release blockers",
      "Linked child Tasks have non-overlapping ownership and the parent closes only after every child is complete"
    ],
    "nonGoals": [
      "Deploy the website or publish the CLI"
    ],
    "constraints": [
      "Keep website deployment proof separate from CLI npm release certification"
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
      "The goal contains high-impact signal: deployment."
    ],
    "signals": {
      "goalSignals": [
        "deployment"
      ],
      "ownedPathCount": 5,
      "affectedScopeIds": [
        "skopos",
        "skopos-web"
      ],
      "impactCategories": [
        "docs",
        "package-manifest",
        "scope-source",
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-36fb874b2cdc7f29"
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
      "detail": "Carry out \"Make the public web build hermetic and establish its independent deployment gate\" inside the resolved scope before widening impact to adjacent areas.",
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
        "package.json",
        "pnpm-lock.yaml"
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
      "acceptanceCriterion": "The public site builds without network-dependent font fetching and preserves the approved Geist typography",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "One explicit web-owned verification command proves typecheck, tests, and production build without entering the CLI release boundary",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The web build Finding and release plan accurately reflect completed topology fixes and remaining release blockers",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Linked child Tasks have non-overlapping ownership and the parent closes only after every child is complete",
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
      "resolutionReason": "Reviewed architecture Memory: package and release boundaries are unchanged; the resolved operational build truth belongs in the existing Finding and release Plan.",
      "resolvedAt": "2026-08-11T06:21:06.128Z",
      "resolvedByActorId": "codex"
    }
  ],
  "questions": [],
  "recommendations": [
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
        "docs/work/archive/tasks/T-02176c1d-add-and-run-one-independent-web-deployment-verification-.md",
        "docs/work/archive/tasks/T-660d5b70-resolve-the-web-build-finding-and-reconcile-stale-releas.md",
        "docs/work/archive/tasks/T-75133dbb-self-host-geist-for-the-public-site-and-prove-the-produc.md",
        "pnpm-lock.yaml"
      ],
      "reason": "Adopt the reviewed outputs and portable Task records produced by the three linked children.",
      "actorId": "codex",
      "recordedAt": "2026-08-11T06:20:24.077Z",
      "baselinePaths": [
        {
          "path": "docs/work/archive/tasks/T-02176c1d-add-and-run-one-independent-web-deployment-verification-.md",
          "digest": "cfcb068e853c4d88a413eaf76e0afe55c2d02077eb3f5e80ac8159d518dd2226"
        },
        {
          "path": "docs/work/archive/tasks/T-660d5b70-resolve-the-web-build-finding-and-reconcile-stale-releas.md",
          "digest": "d959bd7ddca7e209828c6f18c0a83a314dccdd0c21b59a4f4fa8752a3ebe4966"
        },
        {
          "path": "docs/work/archive/tasks/T-75133dbb-self-host-geist-for-the-public-site-and-prove-the-produc.md",
          "digest": "0ef6492b6b8429827dfb5b1bf94e3b9e0406c1ef5f35d8baf51a5a6ebbb4f9eb"
        },
        {
          "path": "pnpm-lock.yaml",
          "digest": "e50028c9bfdf1f8902817150b34c0badb38c11c936664f7f56f5a5f8f557ae71"
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
    "apps/web/package.json",
    "apps/web/src/app/layout.tsx",
    "docs/findings/F-20260811-public-web-build-and-cli-release-gate-coupling.md",
    "docs/work/archive/tasks/T-02176c1d-add-and-run-one-independent-web-deployment-verification-.md",
    "docs/work/archive/tasks/T-660d5b70-resolve-the-web-build-finding-and-reconcile-stale-releas.md",
    "docs/work/archive/tasks/T-75133dbb-self-host-geist-for-the-public-site-and-prove-the-produc.md",
    "docs/work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md",
    "package.json",
    "pnpm-lock.yaml"
  ]
}
```
<!-- skopos:task-state:end -->
