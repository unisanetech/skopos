---
title: "Task: Certify unified setup as standard-verified and agent-ready"
status: complete
owner: "codex-release"
id: T-setupb65960d2
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-511c944d798ea08b
lastUpdated: 2026-08-13
---

# Task: Certify unified setup as standard-verified and agent-ready

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Certify unified setup as standard-verified and agent-ready

## Acceptance

- Unified setup certification is standard-verified and agent-ready from current tracked project owners.
- Host delivery remains checkout-local and is reverified per Session.

## Non-Goals

- None declared.

## Constraints

- skopos.setup-certification.v1

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `standard` / `standard`
- Selection source: `explicit-override`
- Reason: The work changes multiple paths, durable guidance, configuration, or a normal coordinated surface.
- Reason: The caller explicitly selected high-impact; Skopos recommended standard and kept both values visible.

## Owned Paths

- `AGENTS.md`
- `docs/architecture/00-architecture.md`
- `docs/overview.md`
- `docs/standards/validation.md`
- `skill-packs`
- `skopos.config.yaml`
- `tools/skopos/actions`
- `tools/skopos/guards`
- `tools/skopos/policies.yaml`
- `tools/skopos/scopes.yaml`
- `tools/skopos/skills`

## Ownership Expansions

- None recorded.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Certify unified setup as standard-verified and agent-ready" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Sync self-hosted instruction mirrors** (action, complete) — Required by Guard instructions.source-requires-sync.
- [x] **Refresh self-hosted knowledge state** (action, complete) — Required by Guard knowledge.refresh.
- [x] **Build affected project** (action, complete) — Required by Guard quality.build.
- [x] **Test affected behavior** (action, complete) — Required by Guard quality.test.

## Actions And Guards

- Action `instructions.sync-mirrors`: Required by Guard instructions.source-requires-sync.
- Action `maintenance.refresh-knowledge`: Required by Guard knowledge.refresh.
- Action `quality.build`: Required by Guard quality.build.
- Action `quality.test`: Required by Guard quality.test.
- Guard `instructions.source-requires-sync`
- Guard `knowledge.refresh`
- Guard `quality.build`
- Guard `quality.test`

## Evidence And Readiness

- Unified setup certification is standard-verified and agent-ready from current tracked project owners. (closure, agent-observation)
- Host delivery remains checkout-local and is reverified per Session. (closure, agent-observation)
- Guard instructions.source-requires-sync: Instruction source changes require synchronized mirrors (closure, source-bound-action)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.build: Build affected project (closure, source-bound-action)
- Guard quality.test: Test affected behavior (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes. (target: `docs/architecture/00-architecture.md`); resolution: reviewed-no-change
- [complete] standard: The declared Task scope owns canonical standard Memory at docs/standards/validation.md; review and synchronize it if project truth changes. (target: `docs/standards/validation.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-setupb65960d2",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T13:52:06.031Z",
  "updatedAt": "2026-08-13T14:03:10.792Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Certify unified setup as standard-verified and agent-ready",
  "goal": "Certify unified setup as standard-verified and agent-ready",
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
      "Unified setup certification is standard-verified and agent-ready from current tracked project owners.",
      "Host delivery remains checkout-local and is reverified per Session."
    ],
    "nonGoals": [],
    "constraints": [
      "skopos.setup-certification.v1"
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
      "ownedPathCount": 11,
      "affectedScopeIds": [
        "skopos"
      ],
      "impactCategories": [
        "docs",
        "instruction-source",
        "root-config",
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-511c944d798ea08b"
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
      "detail": "Carry out \"Certify unified setup as standard-verified and agent-ready\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-maintenance.refresh-knowledge",
      "kind": "action",
      "title": "Refresh self-hosted knowledge state",
      "detail": "Required by Guard knowledge.refresh.",
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
      "id": "maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
      "reason": "Required by Guard knowledge.refresh.",
      "matchedPaths": [
        "skopos.config.yaml",
        "tools/skopos/actions",
        "tools/skopos/guards",
        "tools/skopos/policies.yaml",
        "tools/skopos/scopes.yaml",
        "tools/skopos/skills"
      ],
      "outputPaths": [
        ".skopos/index"
      ],
      "requiresApproval": false
    },
    {
      "id": "quality.build",
      "title": "Build affected project",
      "category": "quality-check",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/quality-build.yaml",
      "reason": "Required by Guard quality.build.",
      "matchedPaths": [
        "docs/architecture/00-architecture.md",
        "docs/overview.md",
        "docs/standards/validation.md",
        "tools/skopos/actions",
        "tools/skopos/guards",
        "tools/skopos/policies.yaml",
        "tools/skopos/scopes.yaml",
        "tools/skopos/skills"
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
        "docs/architecture/00-architecture.md",
        "docs/overview.md",
        "docs/standards/validation.md",
        "tools/skopos/actions",
        "tools/skopos/guards",
        "tools/skopos/policies.yaml",
        "tools/skopos/scopes.yaml",
        "tools/skopos/skills"
      ],
      "outputPaths": [],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "instructions.source-requires-sync",
    "knowledge.refresh",
    "quality.build",
    "quality.test"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Unified setup certification is standard-verified and agent-ready from current tracked project owners.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Host delivery remains checkout-local and is reverified per Session.",
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
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Canonical architecture already describes tracked setup reconstruction and project-owner authority; this certification confirms that contract without changing it.",
      "resolvedAt": "2026-08-13T13:56:40.523Z",
      "resolvedByActorId": "codex-release"
    },
    {
      "id": "memory-standard-5f2d58a335",
      "role": "standard",
      "reason": "The declared Task scope owns canonical standard Memory at docs/standards/validation.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/standards/validation.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "The validation standard already requires source-bound Actions, Evidence, and fail-closed Readiness; no additional durable rule is needed.",
      "resolvedAt": "2026-08-13T13:56:41.888Z",
      "resolvedByActorId": "codex-release"
    }
  ],
  "questions": [],
  "recommendations": [
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
      "id": "run-maintenance.refresh-knowledge",
      "title": "Refresh self-hosted knowledge state",
      "summary": "Required by Guard knowledge.refresh.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "maintenance.refresh-knowledge",
      "blocking": false,
      "status": "complete"
    },
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
    }
  ],
  "declaredOwnedPaths": [
    "AGENTS.md",
    "docs/architecture/00-architecture.md",
    "docs/overview.md",
    "docs/standards/validation.md",
    "skill-packs",
    "skopos.config.yaml",
    "tools/skopos/actions",
    "tools/skopos/guards",
    "tools/skopos/policies.yaml",
    "tools/skopos/scopes.yaml",
    "tools/skopos/skills"
  ]
}
```
<!-- skopos:task-state:end -->
