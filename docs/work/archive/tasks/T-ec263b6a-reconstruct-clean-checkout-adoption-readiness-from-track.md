---
title: "Task: Reconstruct clean-checkout adoption readiness from tracked project truth"
status: complete
owner: "codex-clean-checkout-readiness"
id: T-ec263b6a
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-a26d03cfd6a36e7f
lastUpdated: 2026-08-12
---

# Task: Reconstruct clean-checkout adoption readiness from tracked project truth

## Changelog

- `2026-08-12`: Synchronized Task state `complete` from Skopos.

## Goal

Reconstruct clean-checkout adoption readiness from tracked project truth

## Acceptance

- A clean checkout of an adopted project reaches agent-ready from current tracked Memory, Scope, Actions, Guards, instructions, completed Task, and source-bound snapshot without proposal replay or copying ignored state.
- Real tracked drift invalidates only affected readiness lanes while checkout-local host and environment lanes are reverified.

## Non-Goals

- Do not add a tracked omnibus setup manifest or a second adoption authority.

## Constraints

- Preserve fail-closed behavior when tracked evidence is missing, stale, or contradictory.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.
- Reason: The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible.

## Owned Paths

- `.cursor/rules/project.mdc`
- `.github/copilot-instructions.md`
- `AGENTS.md`
- `CLAUDE.md`
- `docs/architecture/intelligent-project-onboarding.md`
- `docs/findings/F-20260813-clean-checkout-setup-readiness-reconstruction-gap.md`
- `docs/work/archive/tasks/T-8b569157-implement-compact-mode-specific-human-friendly-response-.md`
- `docs/work/tasks/snapshots/T-8b569157-S-1717ae59ba19.json`
- `packages/cli/src/__tests__/adoption-assessment.test.ts`
- `packages/cli/src/__tests__/session-context-contract.test.ts`
- `packages/model/src/contracts/skopos-adoption.ts`
- `packages/model/src/contracts/skopos-bootstrap-artifact.ts`
- `packages/model/src/contracts/skopos-session-context.ts`
- `packages/runtime/src/application/adoption/adoption.service.ts`
- `packages/runtime/src/application/init/init.service.ts`
- `packages/runtime/src/application/session/session-context.service.ts`

## Ownership Expansions

- `2026-08-12T19:26:34.418Z` by `codex-clean-checkout-readiness`: `docs/architecture/intelligent-project-onboarding.md`, `packages/cli/src/__tests__/adoption-assessment.test.ts`, `packages/cli/src/__tests__/session-context-contract.test.ts`, `packages/model/src/contracts/skopos-adoption.ts`, `packages/model/src/contracts/skopos-session-context.ts`, `packages/runtime/src/application/adoption/adoption.service.ts`, `packages/runtime/src/application/init/init.service.ts`, `packages/runtime/src/application/session/session-context.service.ts` — Implement source-bound clean-checkout adoption reconstruction, integrate it into init and Session context, and prove exact fresh-checkout plus selective drift behavior.
- `2026-08-12T19:26:54.480Z` by `codex-clean-checkout-readiness`: `.cursor/rules/project.mdc`, `.github/copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`, `docs/work/archive/tasks/T-8b569157-implement-compact-mode-specific-human-friendly-response-.md`, `docs/work/tasks/snapshots/T-8b569157-S-1717ae59ba19.json` — Attribute the just-completed dependency Task's generated mirrors, archived Task projection, and immutable snapshot so this follow-up can establish a clean proof baseline without absorbing unrelated work.
- `2026-08-12T19:42:39.094Z` by `codex-clean-checkout-readiness`: `packages/model/src/contracts/skopos-bootstrap-artifact.ts` — Expose tracked adoption reconstruction in the init result contract.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Reconstruct clean-checkout adoption readiness from tracked project truth" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Sync self-hosted instruction mirrors** (action, complete) — Required by Guard instructions.source-requires-sync.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `instructions.sync-mirrors`: Required by Guard instructions.source-requires-sync.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `instructions.source-requires-sync`
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- A clean checkout of an adopted project reaches agent-ready from current tracked Memory, Scope, Actions, Guards, instructions, completed Task, and source-bound snapshot without proposal replay or copying ignored state. (closure, agent-observation)
- Real tracked drift invalidates only affected readiness lanes while checkout-local host and environment lanes are reverified. (closure, agent-observation)
- Guard instructions.source-requires-sync: Instruction source changes require synchronized mirrors (closure, source-bound-action)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes. (target: `docs/architecture/intelligent-project-onboarding.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-ec263b6a",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-12T19:14:14.056Z",
  "updatedAt": "2026-08-12T19:46:40.031Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Reconstruct clean-checkout adoption readiness from tracked project truth",
  "goal": "Reconstruct clean-checkout adoption readiness from tracked project truth",
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
      "A clean checkout of an adopted project reaches agent-ready from current tracked Memory, Scope, Actions, Guards, instructions, completed Task, and source-bound snapshot without proposal replay or copying ignored state.",
      "Real tracked drift invalidates only affected readiness lanes while checkout-local host and environment lanes are reverified."
    ],
    "nonGoals": [
      "Do not add a tracked omnibus setup manifest or a second adoption authority."
    ],
    "constraints": [
      "Preserve fail-closed behavior when tracked evidence is missing, stale, or contradictory."
    ]
  },
  "risk": "high-impact",
  "admission": {
    "recommendedRisk": "standard",
    "recommendedDetail": "standard",
    "selectedRisk": "high-impact",
    "selectedDetail": "detailed",
    "selectionSource": "explicit-override",
    "workflow": "strict",
    "reasons": [
      "The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.",
      "The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible."
    ],
    "signals": {
      "goalSignals": [],
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
    "baselineId": "baseline-a26d03cfd6a36e7f"
  },
  "priority": 0,
  "dependencyTaskIds": [
    "T-8b569157"
  ],
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
      "detail": "Carry out \"Reconstruct clean-checkout adoption readiness from tracked project truth\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck the Skopos workspace",
      "detail": "Required by Guard quality.typecheck.",
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
        "AGENTS.md",
        "CLAUDE.md",
        ".cursor/rules/project.mdc",
        ".github/copilot-instructions.md"
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
        "packages/cli/src/__tests__/adoption-assessment.test.ts",
        "packages/cli/src/__tests__/session-context-contract.test.ts",
        "packages/model/src/contracts/skopos-adoption.ts",
        "packages/model/src/contracts/skopos-bootstrap-artifact.ts",
        "packages/model/src/contracts/skopos-session-context.ts",
        "packages/runtime/src/application/adoption/adoption.service.ts",
        "packages/runtime/src/application/init/init.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "instructions.source-requires-sync",
    "quality.focused-behavior-proof",
    "quality.typecheck"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "A clean checkout of an adopted project reaches agent-ready from current tracked Memory, Scope, Actions, Guards, instructions, completed Task, and source-bound snapshot without proposal replay or copying ignored state.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Real tracked drift invalidates only affected readiness lanes while checkout-local host and environment lanes are reverified.",
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
      "id": "memory-architecture-663c7727b6",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/intelligent-project-onboarding.md",
      "resolution": "memory-updated",
      "resolutionReason": "Documented repository-native clean-checkout reconstruction and lane-selective invalidation.",
      "resolvedAt": "2026-08-12T19:43:05.267Z",
      "resolvedByActorId": "codex-clean-checkout-readiness"
    }
  ],
  "questions": [],
  "recommendations": [
    {
      "id": "start-bounded-child-task",
      "title": "Start a bounded child Task",
      "summary": "The Task may be drifting from its admitted subject because ownership expanded 3 times and new declared Scopes appeared (skopos-cli, skopos-model, skopos-runtime) and new impact categories appeared (instruction-mirror, instruction-source, scope-source). Keep this Task intact and move the suggested paths into focused follow-up work.",
      "priority": "high",
      "actionKind": "start-child-task",
      "command": "skopos task child start 'T-ec263b6a' 'Continue Reconstruct clean-checkout adoption readiness from tracked project truth as bounded follow-up work' . --scope 'skopos' --own '.cursor/rules/project.mdc' --own '.github/copilot-instructions.md' --own 'AGENTS.md' --own 'CLAUDE.md' --own 'docs/architecture/intelligent-project-onboarding.md' --own 'docs/work/archive/tasks/T-8b569157-implement-compact-mode-specific-human-friendly-response-.md' --own 'docs/work/tasks/snapshots/T-8b569157-S-1717ae59ba19.json' --own 'packages/cli/src/__tests__/adoption-assessment.test.ts' --own 'packages/cli/src/__tests__/session-context-contract.test.ts' --own 'packages/model/src/contracts/skopos-adoption.ts' --own 'packages/model/src/contracts/skopos-bootstrap-artifact.ts' --own 'packages/model/src/contracts/skopos-session-context.ts' --own 'packages/runtime/src/application/adoption/adoption.service.ts' --own 'packages/runtime/src/application/init/init.service.ts' --own 'packages/runtime/src/application/session/session-context.service.ts' --reason 'The Task may be drifting from its admitted subject because ownership expanded 3 times and new declared Scopes appeared (skopos-cli, skopos-model, skopos-runtime) and new impact categories appeared (instruction-mirror, instruction-source, scope-source).' --actor 'codex-clean-checkout-readiness'",
      "ownedPaths": [
        ".cursor/rules/project.mdc",
        ".github/copilot-instructions.md",
        "AGENTS.md",
        "CLAUDE.md",
        "docs/architecture/intelligent-project-onboarding.md",
        "docs/work/archive/tasks/T-8b569157-implement-compact-mode-specific-human-friendly-response-.md",
        "docs/work/tasks/snapshots/T-8b569157-S-1717ae59ba19.json",
        "packages/cli/src/__tests__/adoption-assessment.test.ts",
        "packages/cli/src/__tests__/session-context-contract.test.ts",
        "packages/model/src/contracts/skopos-adoption.ts",
        "packages/model/src/contracts/skopos-bootstrap-artifact.ts",
        "packages/model/src/contracts/skopos-session-context.ts",
        "packages/runtime/src/application/adoption/adoption.service.ts",
        "packages/runtime/src/application/init/init.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts"
      ],
      "scopeId": "skopos",
      "reason": "The Task may be drifting from its admitted subject because ownership expanded 3 times and new declared Scopes appeared (skopos-cli, skopos-model, skopos-runtime) and new impact categories appeared (instruction-mirror, instruction-source, scope-source).",
      "blocking": false,
      "status": "open"
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
        "docs/architecture/intelligent-project-onboarding.md",
        "packages/cli/src/__tests__/adoption-assessment.test.ts",
        "packages/cli/src/__tests__/session-context-contract.test.ts",
        "packages/model/src/contracts/skopos-adoption.ts",
        "packages/model/src/contracts/skopos-session-context.ts",
        "packages/runtime/src/application/adoption/adoption.service.ts",
        "packages/runtime/src/application/init/init.service.ts",
        "packages/runtime/src/application/session/session-context.service.ts"
      ],
      "reason": "Implement source-bound clean-checkout adoption reconstruction, integrate it into init and Session context, and prove exact fresh-checkout plus selective drift behavior.",
      "actorId": "codex-clean-checkout-readiness",
      "recordedAt": "2026-08-12T19:26:34.418Z",
      "baselinePaths": [
        {
          "path": "docs/architecture/intelligent-project-onboarding.md",
          "digest": "45ebd34aee504599b0f89da979f43912501f5fd55396965f114d311ea53c4627"
        },
        {
          "path": "packages/cli/src/__tests__/adoption-assessment.test.ts",
          "digest": "f4547cf18984cd770c81cdd8c84335dd4785542c5f617b0fda7f69b755a59340"
        },
        {
          "path": "packages/cli/src/__tests__/session-context-contract.test.ts",
          "digest": "97c208111253400579ecf579cc3eee1208f12f37eb757b26dd0c0678939c7807"
        },
        {
          "path": "packages/model/src/contracts/skopos-adoption.ts",
          "digest": "31eea9fd10364b3def3012b35004a2c6b90cb77cca9ba726b8d0d5d0f5b8d7f0"
        },
        {
          "path": "packages/model/src/contracts/skopos-session-context.ts",
          "digest": "8564581625c569d7604056374448891c24f60cdf65b1214d28a0a8f04debe2b1"
        },
        {
          "path": "packages/runtime/src/application/adoption/adoption.service.ts",
          "digest": "1c4444e84b8e2e12c0469c239506899aae382308068a125810d8bbc66103d0af"
        },
        {
          "path": "packages/runtime/src/application/init/init.service.ts",
          "digest": "e86ce9a0280986196a4e989c4294958d7f8b506e6759c33150bc76ae7ab31ece"
        },
        {
          "path": "packages/runtime/src/application/session/session-context.service.ts",
          "digest": "56c88c3c94d7f3aeca0a323662298023f097e496f63f9077c4466c843b37bff7"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        ".cursor/rules/project.mdc",
        ".github/copilot-instructions.md",
        "AGENTS.md",
        "CLAUDE.md",
        "docs/work/archive/tasks/T-8b569157-implement-compact-mode-specific-human-friendly-response-.md",
        "docs/work/tasks/snapshots/T-8b569157-S-1717ae59ba19.json"
      ],
      "reason": "Attribute the just-completed dependency Task's generated mirrors, archived Task projection, and immutable snapshot so this follow-up can establish a clean proof baseline without absorbing unrelated work.",
      "actorId": "codex-clean-checkout-readiness",
      "recordedAt": "2026-08-12T19:26:54.480Z",
      "baselinePaths": [
        {
          "path": ".cursor/rules/project.mdc",
          "digest": "e2904a353f522668d6dcaf8fa0699270d2fdfc48763d9216bcd11d42d25c0219"
        },
        {
          "path": ".github/copilot-instructions.md",
          "digest": "83d99dd6bd16ec336cad037f9aa202f68b01e967ddf2029f5107b4b19f219559"
        },
        {
          "path": "AGENTS.md",
          "digest": "32cb8a8b5f861c5140edb44f56e3461041426804f4971242a0feacc6ccbfb7e9"
        },
        {
          "path": "CLAUDE.md",
          "digest": "1e36b11cba1d5da0be161dea215ea9ef154c363d58c9d6bf8e447e8a10b624de"
        },
        {
          "path": "docs/work/archive/tasks/T-8b569157-implement-compact-mode-specific-human-friendly-response-.md",
          "digest": "9dc786fd8e29bdc940aa477e630b8c45e27e46780341ba834d123b88539fa2d5"
        },
        {
          "path": "docs/work/tasks/snapshots/T-8b569157-S-1717ae59ba19.json",
          "digest": "ca411c103d66fa7e2220a86d21540de9d95a3021463f428e7a4d3f045ba9867b"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime"
      ]
    },
    {
      "paths": [
        "packages/model/src/contracts/skopos-bootstrap-artifact.ts"
      ],
      "reason": "Expose tracked adoption reconstruction in the init result contract.",
      "actorId": "codex-clean-checkout-readiness",
      "recordedAt": "2026-08-12T19:42:39.094Z",
      "baselinePaths": [
        {
          "path": "packages/model/src/contracts/skopos-bootstrap-artifact.ts",
          "digest": "fb464dc5b40e5c81b9aef07f523e4f6107dd6e5c70166b2edfd2147d28dea2ba"
        }
      ],
      "classification": "explicit-multi-scope",
      "priorScopeId": "skopos",
      "nextScopeId": "skopos",
      "affectedScopeIds": [
        "skopos",
        "skopos-cli",
        "skopos-model",
        "skopos-runtime"
      ]
    }
  ],
  "declaredOwnedPaths": [
    ".cursor/rules/project.mdc",
    ".github/copilot-instructions.md",
    "AGENTS.md",
    "CLAUDE.md",
    "docs/architecture/intelligent-project-onboarding.md",
    "docs/findings/F-20260813-clean-checkout-setup-readiness-reconstruction-gap.md",
    "docs/work/archive/tasks/T-8b569157-implement-compact-mode-specific-human-friendly-response-.md",
    "docs/work/tasks/snapshots/T-8b569157-S-1717ae59ba19.json",
    "packages/cli/src/__tests__/adoption-assessment.test.ts",
    "packages/cli/src/__tests__/session-context-contract.test.ts",
    "packages/model/src/contracts/skopos-adoption.ts",
    "packages/model/src/contracts/skopos-bootstrap-artifact.ts",
    "packages/model/src/contracts/skopos-session-context.ts",
    "packages/runtime/src/application/adoption/adoption.service.ts",
    "packages/runtime/src/application/init/init.service.ts",
    "packages/runtime/src/application/session/session-context.service.ts"
  ]
}
```
<!-- skopos:task-state:end -->
