---
title: "Task: Release @unisane/skopos 0.1.1 from the certified public CLI boundary"
status: cancelled
owner: "project"
id: T-03a8cc10
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-4d482e4c51935d45
lastUpdated: 2026-08-14
---

# Task: Release @unisane/skopos 0.1.1 from the certified public CLI boundary

## Changelog

- `2026-08-14`: Synchronized Task state `cancelled` from Skopos.

## Goal

Release @unisane/skopos 0.1.1 from the certified public CLI boundary

## Acceptance

- The root release identity, public package manifest, and CLI version are 0.1.1 while private internal packages remain unpublished.
- Protected release security derives the reviewed tarball name from the public package version.
- GitHub OIDC publishes the exact certified 0.1.1 tarball with npm provenance and registry-installed verification.

## Non-Goals

- Do not change private internal package versions or overwrite the immutable 0.1.0 release.

## Constraints

- Do not stage unrelated pre-existing or cancelled local Task records.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `proof-subject`
- Reason: Project-integration proof always requires strict high-impact work.

## Owned Paths

- `.github/workflows/release-security.yml`
- `docs/operations/release-runbook.md`
- `docs/operations/release-security.md`
- `package.json`
- `packages/cli/package.json`
- `packages/cli/src/__tests__/help-contract.test.ts`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/release-surface.test.ts`
- `packages/cli/src/cli/index.ts`
- `scripts/release/validate-publish-workflow.mjs`
- `scripts/release/validate-release-security.mjs`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Release @unisane/skopos 0.1.1 from the certified public CLI boundary" inside the resolved scope before widening impact to adjacent areas.
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

- The root release identity, public package manifest, and CLI version are 0.1.1 while private internal packages remain unpublished. (closure, agent-observation)
- Protected release security derives the reviewed tarball name from the public package version. (closure, agent-observation)
- GitHub OIDC publishes the exact certified 0.1.1 tarball with npm provenance and registry-installed verification. (closure, agent-observation)
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
  "id": "T-03a8cc10",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-14T14:45:49.557Z",
  "updatedAt": "2026-08-14T18:52:21.020Z",
  "planIds": [],
  "childTasks": [],
  "state": "cancelled",
  "detail": "detailed",
  "title": "Release @unisane/skopos 0.1.1 from the certified public CLI boundary",
  "goal": "Release @unisane/skopos 0.1.1 from the certified public CLI boundary",
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
      "The root release identity, public package manifest, and CLI version are 0.1.1 while private internal packages remain unpublished.",
      "Protected release security derives the reviewed tarball name from the public package version.",
      "GitHub OIDC publishes the exact certified 0.1.1 tarball with npm provenance and registry-installed verification."
    ],
    "nonGoals": [
      "Do not change private internal package versions or overwrite the immutable 0.1.0 release."
    ],
    "constraints": [
      "Do not stage unrelated pre-existing or cancelled local Task records."
    ]
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
        "release"
      ],
      "ownedPathCount": 11,
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
    "baselineId": "baseline-4d482e4c51935d45"
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
      "detail": "Carry out \"Release @unisane/skopos 0.1.1 from the certified public CLI boundary\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/package.json",
        "packages/cli/src/cli/index.ts",
        "packages/cli/src/__tests__/help-contract.test.ts",
        "packages/cli/src/__tests__/release-surface.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        ".github/workflows/release-security.yml",
        "scripts/release/validate-release-security.mjs",
        "scripts/release/validate-publish-workflow.mjs",
        "docs/operations/release-runbook.md",
        "docs/operations/release-security.md"
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
        "packages/cli/package.json",
        "packages/cli/src/cli/index.ts",
        "packages/cli/src/__tests__/help-contract.test.ts",
        "packages/cli/src/__tests__/release-surface.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        ".github/workflows/release-security.yml",
        "scripts/release/validate-release-security.mjs",
        "scripts/release/validate-publish-workflow.mjs",
        "docs/operations/release-runbook.md",
        "docs/operations/release-security.md"
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
      "acceptanceCriterion": "The root release identity, public package manifest, and CLI version are 0.1.1 while private internal packages remain unpublished.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Protected release security derives the reviewed tarball name from the public package version.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "GitHub OIDC publishes the exact certified 0.1.1 tarball with npm provenance and registry-installed verification.",
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
      "resolutionReason": "The accepted architecture already defines @unisane/skopos as the public CLI boundary and private @skopos/* packages as bundled internals; the patch changes version and release mechanics, not architecture.",
      "resolvedAt": "2026-08-14T14:53:41.767Z",
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
  "disposition": {
    "kind": "cancel",
    "reason": "The protected v0.1.1 candidate remained unpublished after its OIDC workflow guard failed; the protected tag is immutable and the approved successor release is 0.1.2.",
    "actorId": "codex-release",
    "recordedAt": "2026-08-14T18:52:21.020Z",
    "priorState": "active",
    "nextState": "cancelled"
  },
  "declaredOwnedPaths": [
    ".github/workflows/release-security.yml",
    "docs/operations/release-runbook.md",
    "docs/operations/release-security.md",
    "package.json",
    "packages/cli/package.json",
    "packages/cli/src/__tests__/help-contract.test.ts",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/release-surface.test.ts",
    "packages/cli/src/cli/index.ts",
    "scripts/release/validate-publish-workflow.mjs",
    "scripts/release/validate-release-security.mjs"
  ]
}
```
<!-- skopos:task-state:end -->
