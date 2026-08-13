---
title: "Task: Complete the unified setup cut across CLI, current docs, release contracts, and public web"
status: complete
owner: "codex-setup-cutover"
id: T-3df838b5
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-7a5e705fab8e8c0e
lastUpdated: 2026-08-12
---

# Task: Complete the unified setup cut across CLI, current docs, release contracts, and public web

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Complete the unified setup cut across CLI, current docs, release contracts, and public web

## Acceptance

- No current public surface instructs users to run the removed adopt command
- Homepage and documentation teach skopos setup as the single onboarding entrypoint
- Release contracts and smoke expectations use setup while init remains explicitly low-level
- Built CLI rejects adopt and focused CLI/web tests plus typecheck pass

## Non-Goals

- Do not rewrite historical archives that intentionally preserve superseded behavior

## Constraints

- Clean refactor: no public compatibility alias for adopt

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `apps/web/src/app/globals.css`
- `apps/web/src/features/documentation/__tests__/documentation-copy.test.ts`
- `apps/web/src/features/documentation/content.ts`
- `apps/web/src/features/documentation/customize-content.ts`
- `apps/web/src/features/documentation/docs-landing-screen.tsx`
- `apps/web/src/features/documentation/quickstart-screen.tsx`
- `apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts`
- `apps/web/src/features/homepage/content/homepage-copy.ts`
- `apps/web/src/features/homepage/sections/hero-onboarding.tsx`
- `apps/web/src/features/project-memory/__tests__/project-memory-copy.test.ts`
- `apps/web/src/features/project-memory/content.ts`
- `apps/web/src/features/project-memory/project-memory-screen.tsx`
- `apps/web/src/features/trust-control/content.ts`
- `apps/web/src/features/use-cases/__tests__/use-cases-copy.test.ts`
- `apps/web/src/features/use-cases/content.ts`
- `docs/architecture/docs-governance.md`
- `docs/decisions/031-bundled-cli-release-contract.md`
- `docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md`
- `docs/guides/bootstrap-a-project.md`
- `docs/operations/first-public-release-scorecard.md`
- `docs/operations/release-runbook.md`
- `packages/cli/README.md`
- `packages/cli/src/__tests__/adoption-approval.test.ts`
- `packages/cli/src/__tests__/canonical-surface.test.ts`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/release-surface.test.ts`
- `packages/docs-engine/src/adoption-proposal.ts`
- `packages/runtime/src/application/adoption/adoption.service.ts`
- `README.md`

## Ownership Expansions

- `2026-08-12T20:54:00.553Z` by `codex-setup-cutover`: `packages/cli/src/__tests__/release-install-smoke.test.ts`, `packages/cli/src/__tests__/release-surface.test.ts` — Release proof must validate the new public setup entrypoint and explicitly reject the removed adopt command in the packed executable.
- `2026-08-12T20:56:30.819Z` by `codex-setup-cutover`: `apps/web/src/features/documentation/docs-landing-screen.tsx`, `apps/web/src/features/documentation/quickstart-screen.tsx`, `apps/web/src/features/homepage/sections/hero-onboarding.tsx`, `apps/web/src/features/project-memory/__tests__/project-memory-copy.test.ts`, `apps/web/src/features/project-memory/content.ts`, `apps/web/src/features/project-memory/project-memory-screen.tsx`, `apps/web/src/features/trust-control/content.ts`, `apps/web/src/features/use-cases/__tests__/use-cases-copy.test.ts`, `apps/web/src/features/use-cases/content.ts` — End-to-end public setup migration includes lifecycle labels, use cases, Project Memory setup language, quickstart prose, and accessibility labels—not only command arrays.
- `2026-08-12T20:58:15.115Z` by `codex-setup-cutover`: `apps/web/src/features/documentation/customize-content.ts` — Current public Skill guidance should describe explicit acceptance and binding without reusing the superseded onboarding adoption term.
- `2026-08-12T20:59:43.673Z` by `codex-setup-cutover`: `apps/web/src/app/globals.css` — Remove the final obsolete public-web adoption selector name so current web source uses setup vocabulary consistently.
- `2026-08-12T21:00:35.859Z` by `codex-setup-cutover`: `README.md` — The public repository README still advertised the removed adopt command and must route first-time use to unified setup.
- `2026-08-12T21:07:54.640Z` by `codex-setup-cutover`: `docs/guides/bootstrap-a-project.md`, `packages/cli/README.md` — Align the current bootstrap guide and published CLI README with the unified setup entry point.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Complete the unified setup cut across CLI, current docs, release contracts, and public web" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- No current public surface instructs users to run the removed adopt command (closure, agent-observation)
- Homepage and documentation teach skopos setup as the single onboarding entrypoint (closure, agent-observation)
- Release contracts and smoke expectations use setup while init remains explicitly low-level (closure, agent-observation)
- Built CLI rejects adopt and focused CLI/web tests plus typecheck pass (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes. (target: `docs/architecture/docs-governance.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/031-bundled-cli-release-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/031-bundled-cli-release-contract.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-3df838b5",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T20:52:12.532Z",
  "updatedAt": "2026-08-12T21:12:48.113Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Complete the unified setup cut across CLI, current docs, release contracts, and public web",
  "goal": "Complete the unified setup cut across CLI, current docs, release contracts, and public web",
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
      "No current public surface instructs users to run the removed adopt command",
      "Homepage and documentation teach skopos setup as the single onboarding entrypoint",
      "Release contracts and smoke expectations use setup while init remains explicitly low-level",
      "Built CLI rejects adopt and focused CLI/web tests plus typecheck pass"
    ],
    "nonGoals": [
      "Do not rewrite historical archives that intentionally preserve superseded behavior"
    ],
    "constraints": [
      "Clean refactor: no public compatibility alias for adopt"
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
      "ownedPathCount": 13,
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-docs-engine",
        "skopos-runtime",
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
    "baselineId": "baseline-7a5e705fab8e8c0e"
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
      "detail": "Carry out \"Complete the unified setup cut across CLI, current docs, release contracts, and public web\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/cli/README.md",
        "packages/cli/src/__tests__/adoption-approval.test.ts",
        "packages/cli/src/__tests__/canonical-surface.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/release-surface.test.ts",
        "packages/docs-engine/src/adoption-proposal.ts",
        "packages/runtime/src/application/adoption/adoption.service.ts"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "No current public surface instructs users to run the removed adopt command",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Homepage and documentation teach skopos setup as the single onboarding entrypoint",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Release contracts and smoke expectations use setup while init remains explicitly low-level",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Built CLI rejects adopt and focused CLI/web tests plus typecheck pass",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
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
      "id": "memory-architecture-fbdc372589",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/docs-governance.md",
      "resolution": "memory-updated",
      "resolutionReason": "Current docs governance now records unified setup as the public onboarding authority and init as low-level reconstruction.",
      "resolvedAt": "2026-08-12T21:10:34.228Z",
      "resolvedByActorId": "codex-setup-cutover"
    },
    {
      "id": "memory-decision-24824ea4ce",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/031-bundled-cli-release-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/031-bundled-cli-release-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "The bundled CLI release contract now requires installed setup behavior and rejection of the removed adopt command.",
      "resolvedAt": "2026-08-12T21:10:36.008Z",
      "resolvedByActorId": "codex-setup-cutover"
    },
    {
      "id": "memory-decision-f8abc13982",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "The canonical project operating contract now presents setup as the single user-facing onboarding workflow.",
      "resolvedAt": "2026-08-12T21:10:37.999Z",
      "resolvedByActorId": "codex-setup-cutover"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 6 times. Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "medium",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-3df838b5' 'Continue Complete the unified setup cut across CLI, current docs, release contracts, and public web as bounded follow-up work' . --scope 'skopos' --own 'apps/web/src/app/globals.css' --own 'apps/web/src/features/documentation/customize-content.ts' --own 'apps/web/src/features/documentation/docs-landing-screen.tsx' --own 'apps/web/src/features/documentation/quickstart-screen.tsx' --own 'apps/web/src/features/homepage/sections/hero-onboarding.tsx' --own 'apps/web/src/features/project-memory/__tests__/project-memory-copy.test.ts' --own 'apps/web/src/features/project-memory/content.ts' --own 'apps/web/src/features/project-memory/project-memory-screen.tsx' --own 'apps/web/src/features/trust-control/content.ts' --own 'apps/web/src/features/use-cases/__tests__/use-cases-copy.test.ts' --own 'apps/web/src/features/use-cases/content.ts' --own 'docs/guides/bootstrap-a-project.md' --own 'packages/cli/README.md' --own 'packages/cli/src/__tests__/release-install-smoke.test.ts' --own 'packages/cli/src/__tests__/release-surface.test.ts' --own 'README.md' --reason 'The Task may be drifting from its admitted subject because ownership expanded 6 times.' --actor 'codex-setup-cutover'",
      "ownedPaths": [
        "apps/web/src/app/globals.css",
        "apps/web/src/features/documentation/customize-content.ts",
        "apps/web/src/features/documentation/docs-landing-screen.tsx",
        "apps/web/src/features/documentation/quickstart-screen.tsx",
        "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
        "apps/web/src/features/project-memory/__tests__/project-memory-copy.test.ts",
        "apps/web/src/features/project-memory/content.ts",
        "apps/web/src/features/project-memory/project-memory-screen.tsx",
        "apps/web/src/features/trust-control/content.ts",
        "apps/web/src/features/use-cases/__tests__/use-cases-copy.test.ts",
        "apps/web/src/features/use-cases/content.ts",
        "docs/guides/bootstrap-a-project.md",
        "packages/cli/README.md",
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/release-surface.test.ts",
        "README.md"
      ],
      "scopeId": "skopos",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 6 times.",
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
        "packages/cli/src/__tests__/release-install-smoke.test.ts",
        "packages/cli/src/__tests__/release-surface.test.ts"
      ],
      "reason": "Release proof must validate the new public setup entrypoint and explicitly reject the removed adopt command in the packed executable.",
      "actorId": "codex-setup-cutover",
      "recordedAt": "2026-08-12T20:54:00.553Z",
      "baselinePaths": [
        {
          "path": "packages/cli/src/__tests__/release-install-smoke.test.ts",
          "digest": "129274e0bc4a4000a5cd7b73e765af9c7555492cae54df4f03e91939192c5ffb"
        },
        {
          "path": "packages/cli/src/__tests__/release-surface.test.ts",
          "digest": "b0314d6a586dfb5bb873bcabc798f822f68b11dc3b0ee2cd4cb8d4bf00f5bad0"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-docs-engine",
        "skopos-runtime",
        "skopos-web"
      ]
    },
    {
      "paths": [
        "apps/web/src/features/documentation/docs-landing-screen.tsx",
        "apps/web/src/features/documentation/quickstart-screen.tsx",
        "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
        "apps/web/src/features/project-memory/__tests__/project-memory-copy.test.ts",
        "apps/web/src/features/project-memory/content.ts",
        "apps/web/src/features/project-memory/project-memory-screen.tsx",
        "apps/web/src/features/trust-control/content.ts",
        "apps/web/src/features/use-cases/__tests__/use-cases-copy.test.ts",
        "apps/web/src/features/use-cases/content.ts"
      ],
      "reason": "End-to-end public setup migration includes lifecycle labels, use cases, Project Memory setup language, quickstart prose, and accessibility labels—not only command arrays.",
      "actorId": "codex-setup-cutover",
      "recordedAt": "2026-08-12T20:56:30.819Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/documentation/docs-landing-screen.tsx",
          "digest": "32384fd3591a7a0c6263dd5988a5e7e1e995834d5c62b155163d01432060f7be"
        },
        {
          "path": "apps/web/src/features/documentation/quickstart-screen.tsx",
          "digest": "736ecf6f8c1ff39a52d8788746b52ed5006aa911f4f222d828e100c05c6f9959"
        },
        {
          "path": "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
          "digest": "5c52188216d0cfd1d623a92319b2743536844c5c9d28c1608c82bba411954a35"
        },
        {
          "path": "apps/web/src/features/project-memory/__tests__/project-memory-copy.test.ts",
          "digest": "1a88bdcb98ba773cd2e172547d19fb197c6593c4b2faebf33d6edd45535fbfcf"
        },
        {
          "path": "apps/web/src/features/project-memory/content.ts",
          "digest": "e32314b955981a2c553d3a4a0132c9f86a6d5d35d66cdd2ddc00ddbc29fe6f89"
        },
        {
          "path": "apps/web/src/features/project-memory/project-memory-screen.tsx",
          "digest": "eeac197965760b4c9ea70a51450e90b968ea0eae95c19793bd326745c5435889"
        },
        {
          "path": "apps/web/src/features/trust-control/content.ts",
          "digest": "cbb8454e425330a9cf7e5b8d9c17059183d85715a4df5ca4927fd63341094613"
        },
        {
          "path": "apps/web/src/features/use-cases/__tests__/use-cases-copy.test.ts",
          "digest": "fce3041d8af85eaaf4c6ba634ee66305832c073988858001a28dfe7dce226a75"
        },
        {
          "path": "apps/web/src/features/use-cases/content.ts",
          "digest": "38a4d77250bde6552e58d64453cb358a49158441123c1f1a375c74b983304ba8"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-docs-engine",
        "skopos-runtime",
        "skopos-web"
      ]
    },
    {
      "paths": [
        "apps/web/src/features/documentation/customize-content.ts"
      ],
      "reason": "Current public Skill guidance should describe explicit acceptance and binding without reusing the superseded onboarding adoption term.",
      "actorId": "codex-setup-cutover",
      "recordedAt": "2026-08-12T20:58:15.115Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/features/documentation/customize-content.ts",
          "digest": "a7c3e519301f71e576d947af6f2106ed2cdbb25559f0e3b69ef69192abfc1f67"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-docs-engine",
        "skopos-runtime",
        "skopos-web"
      ]
    },
    {
      "paths": [
        "apps/web/src/app/globals.css"
      ],
      "reason": "Remove the final obsolete public-web adoption selector name so current web source uses setup vocabulary consistently.",
      "actorId": "codex-setup-cutover",
      "recordedAt": "2026-08-12T20:59:43.673Z",
      "baselinePaths": [
        {
          "path": "apps/web/src/app/globals.css",
          "digest": "a4a982f0c98f832366f1e81b9e2b84cfb678ca8662ea4a7f40625109042d2311"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-docs-engine",
        "skopos-runtime",
        "skopos-web"
      ]
    },
    {
      "paths": [
        "README.md"
      ],
      "reason": "The public repository README still advertised the removed adopt command and must route first-time use to unified setup.",
      "actorId": "codex-setup-cutover",
      "recordedAt": "2026-08-12T21:00:35.859Z",
      "baselinePaths": [
        {
          "path": "README.md",
          "digest": "01a5d79d328b4a2422507203478a8d25602855a3c39863720fafeddf80aed99e"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-docs-engine",
        "skopos-runtime",
        "skopos-web"
      ]
    },
    {
      "paths": [
        "docs/guides/bootstrap-a-project.md",
        "packages/cli/README.md"
      ],
      "reason": "Align the current bootstrap guide and published CLI README with the unified setup entry point.",
      "actorId": "codex-setup-cutover",
      "recordedAt": "2026-08-12T21:07:54.640Z",
      "baselinePaths": [
        {
          "path": "docs/guides/bootstrap-a-project.md",
          "digest": "8561a6bf5d60ed457cfe0057d267e06d828f457d62b547eca4e2b51e43afcdf6"
        },
        {
          "path": "packages/cli/README.md",
          "digest": "dd7ad0e47e1a17843a0ddc8e1acc6d8d7c1b3d0abaf09478556366d0b7a93368"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-docs-engine",
        "skopos-runtime",
        "skopos-web"
      ]
    }
  ],
  "declaredOwnedPaths": [
    "apps/web/src/app/globals.css",
    "apps/web/src/features/documentation/__tests__/documentation-copy.test.ts",
    "apps/web/src/features/documentation/content.ts",
    "apps/web/src/features/documentation/customize-content.ts",
    "apps/web/src/features/documentation/docs-landing-screen.tsx",
    "apps/web/src/features/documentation/quickstart-screen.tsx",
    "apps/web/src/features/homepage/__tests__/hero-onboarding.test.ts",
    "apps/web/src/features/homepage/content/homepage-copy.ts",
    "apps/web/src/features/homepage/sections/hero-onboarding.tsx",
    "apps/web/src/features/project-memory/__tests__/project-memory-copy.test.ts",
    "apps/web/src/features/project-memory/content.ts",
    "apps/web/src/features/project-memory/project-memory-screen.tsx",
    "apps/web/src/features/trust-control/content.ts",
    "apps/web/src/features/use-cases/__tests__/use-cases-copy.test.ts",
    "apps/web/src/features/use-cases/content.ts",
    "docs/architecture/docs-governance.md",
    "docs/decisions/031-bundled-cli-release-contract.md",
    "docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md",
    "docs/guides/bootstrap-a-project.md",
    "docs/operations/first-public-release-scorecard.md",
    "docs/operations/release-runbook.md",
    "packages/cli/README.md",
    "packages/cli/src/__tests__/adoption-approval.test.ts",
    "packages/cli/src/__tests__/canonical-surface.test.ts",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/release-surface.test.ts",
    "packages/docs-engine/src/adoption-proposal.ts",
    "packages/runtime/src/application/adoption/adoption.service.ts",
    "README.md"
  ]
}
```
<!-- skopos:task-state:end -->
