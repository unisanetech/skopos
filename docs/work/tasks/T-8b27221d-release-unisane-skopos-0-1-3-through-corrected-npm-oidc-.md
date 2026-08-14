---
title: "Task: Release @unisane/skopos 0.1.3 through corrected npm OIDC authentication"
status: active
owner: "codex-release"
id: T-8b27221d
scope: "skopos"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-ec6afdeb186c8304
lastUpdated: 2026-08-14
---

# Task: Release @unisane/skopos 0.1.3 through corrected npm OIDC authentication

## Changelog

- `2026-08-14`: Synchronized Task state `active` from Skopos.

## Goal

Release @unisane/skopos 0.1.3 through corrected npm OIDC authentication

## Acceptance

- The release workflow uses a checksum-pinned setup-node version that does not inject a dummy publish token, and the validator prevents regression.
- The root package, public CLI manifest, CLI version, tests, and active runbook consistently identify 0.1.3.
- The protected workflow certifies, publishes, and independently verifies @unisane/skopos@0.1.3 on npm next using trusted publishing.

## Non-Goals

- None declared.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `proof-subject`
- Reason: Project-integration proof always requires strict high-impact work.

## Owned Paths

- `.github/workflows/publish.yml`
- `docs/operations/release-runbook.md`
- `package.json`
- `packages/cli/package.json`
- `packages/cli/src/__tests__/help-contract.test.ts`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/release-surface.test.ts`
- `packages/cli/src/cli/index.ts`
- `scripts/release/validate-publish-workflow.mjs`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Release @unisane/skopos 0.1.3 through corrected npm OIDC authentication" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Build affected project** (action, complete) — Required by Guard quality.build.
- [x] **Test affected behavior** (action, complete) — Required by Guard quality.test.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.build`: Required by Guard quality.build.
- Action `quality.test`: Required by Guard quality.test.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.build`
- Guard `quality.focused-behavior-proof`
- Guard `quality.test`
- Guard `quality.typecheck`

## Evidence And Readiness

- The release workflow uses a checksum-pinned setup-node version that does not inject a dummy publish token, and the validator prevents regression. (closure, agent-observation)
- The root package, public CLI manifest, CLI version, tests, and active runbook consistently identify 0.1.3. (closure, agent-observation)
- The protected workflow certifies, publishes, and independently verifies @unisane/skopos@0.1.3 on npm next using trusted publishing. (closure, agent-observation)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.test: Test affected behavior (closure, source-bound-action)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-8b27221d",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-14T19:32:21.975Z",
  "updatedAt": "2026-08-14T19:38:54.325Z",
  "planIds": [],
  "childTasks": [],
  "state": "active",
  "detail": "detailed",
  "title": "Release @unisane/skopos 0.1.3 through corrected npm OIDC authentication",
  "goal": "Release @unisane/skopos 0.1.3 through corrected npm OIDC authentication",
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
      "The release workflow uses a checksum-pinned setup-node version that does not inject a dummy publish token, and the validator prevents regression.",
      "The root package, public CLI manifest, CLI version, tests, and active runbook consistently identify 0.1.3.",
      "The protected workflow certifies, publishes, and independently verifies @unisane/skopos@0.1.3 on npm next using trusted publishing."
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
    "selectionSource": "proof-subject",
    "workflow": "strict",
    "reasons": [
      "Project-integration proof always requires strict high-impact work."
    ],
    "signals": {
      "goalSignals": [
        "authentication",
        "release"
      ],
      "ownedPathCount": 9,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli"
      ],
      "impactCategories": [
        "docs",
        "package-manifest",
        "scope-source",
        "workspace-file"
      ],
      "proofSubjectKind": "project-integration"
    }
  },
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-ec6afdeb186c8304"
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
      "detail": "Carry out \"Release @unisane/skopos 0.1.3 through corrected npm OIDC authentication\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-quality.build",
      "kind": "action",
      "title": "Build affected project",
      "detail": "Required by Guard quality.build.",
      "status": "complete"
    },
    {
      "id": "action-quality.test",
      "kind": "action",
      "title": "Test affected behavior",
      "detail": "Required by Guard quality.test.",
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
      "id": "quality.build",
      "title": "Build affected project",
      "category": "quality-check",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/quality-build.yaml",
      "reason": "Required by Guard quality.build.",
      "matchedPaths": [
        ".github/workflows/publish.yml",
        "scripts/release/validate-publish-workflow.mjs",
        "packages/cli/package.json",
        "packages/cli/src/cli/index.ts",
        "packages/cli/src/__tests__/help-contract.test.ts",
        "packages/cli/src/__tests__/release-surface.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "docs/operations/release-runbook.md"
      ],
      "outputPaths": [],
      "requiresApproval": true
    },
    {
      "id": "quality.test",
      "title": "Test affected behavior",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-test.yaml",
      "reason": "Required by Guard quality.test.",
      "matchedPaths": [
        ".github/workflows/publish.yml",
        "scripts/release/validate-publish-workflow.mjs",
        "packages/cli/package.json",
        "packages/cli/src/cli/index.ts",
        "packages/cli/src/__tests__/help-contract.test.ts",
        "packages/cli/src/__tests__/release-surface.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "docs/operations/release-runbook.md"
      ],
      "outputPaths": [],
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
        "package.json",
        "packages/cli/package.json",
        "packages/cli/src/cli/index.ts",
        "packages/cli/src/__tests__/help-contract.test.ts",
        "packages/cli/src/__tests__/release-surface.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.build",
    "quality.focused-behavior-proof",
    "quality.test",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "The release workflow uses a checksum-pinned setup-node version that does not inject a dummy publish token, and the validator prevents regression.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "The root package, public CLI manifest, CLI version, tests, and active runbook consistently identify 0.1.3.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The protected workflow certifies, publishes, and independently verifies @unisane/skopos@0.1.3 on npm next using trusted publishing.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "guard-quality.build",
      "acceptanceCriterion": "Guard quality.build: Build affected project",
      "phase": "closure",
      "actionIds": [
        "quality.build"
      ],
      "guardIds": [
        "quality.build"
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
      "id": "guard-quality.test",
      "acceptanceCriterion": "Guard quality.test: Test affected behavior",
      "phase": "closure",
      "actionIds": [
        "quality.test"
      ],
      "guardIds": [
        "quality.test"
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
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "The architecture already separates public package identity and protected release governance; this patch changes only the trusted-publishing runtime and current release version.",
      "resolvedAt": "2026-08-14T19:38:54.325Z",
      "resolvedByActorId": "codex-release"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "run-quality.build",
      "title": "Build affected project",
      "summary": "Required by Guard quality.build.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.build",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-quality.test",
      "title": "Test affected behavior",
      "summary": "Required by Guard quality.test.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.test",
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
    ".github/workflows/publish.yml",
    "docs/operations/release-runbook.md",
    "package.json",
    "packages/cli/package.json",
    "packages/cli/src/__tests__/help-contract.test.ts",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/release-surface.test.ts",
    "packages/cli/src/cli/index.ts",
    "scripts/release/validate-publish-workflow.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
