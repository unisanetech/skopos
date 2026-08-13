---
title: "Task: Consolidate and review the first public release candidate"
status: complete
owner: "codex-root"
id: T-cbbd94cd
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-fcaa7d1ce633f049
lastUpdated: 2026-08-13
---

# Task: Consolidate and review the first public release candidate

## Changelog

- `2026-08-13`: Synchronized Task state `complete` from Skopos.

## Goal

Consolidate and review the first public release candidate

## Acceptance

- Every intended accumulated source and documentation change is reviewed for product consistency and release safety.
- No adopter-specific or unrelated project material enters the Skopos candidate.
- Focused tests, workspace typecheck, release scorecard validation, and package-facing checks report truthful outcomes.
- The reviewed candidate is committed locally without publishing or deploying.

## Non-Goals

- Do not publish npm packages, deploy the public website, or change external release infrastructure.

## Constraints

- None declared.

## Admission And Workflow

- Workflow: `strict`
- Selected risk/detail: `high-impact` / `detailed`
- Recommended risk/detail: `high-impact` / `detailed`
- Selection source: `explicit-override`
- Reason: The goal contains high-impact signal: release.

## Owned Paths

- `.cursor/rules/project.mdc`
- `.github/copilot-instructions.md`
- `AGENTS.md`
- `apps/web`
- `CLAUDE.md`
- `design-qa.md`
- `docs`
- `package.json`
- `packages`
- `README.md`
- `scripts`
- `tools/skopos/actions/maintenance-refresh-knowledge.yaml`
- `tools/skopos/skills/ui.product-interface-design.json`

## Ownership Expansions

- `2026-08-13T08:38:09.546Z` by `codex-root`: `design-qa.md`, `tools/skopos/actions/maintenance-refresh-knowledge.yaml` — Candidate audit found a new public QA artifact with machine-local paths and a self-hosted Action still targeting a removed package script.
- `2026-08-13T10:22:42.176Z` by `codex-root`: `tools/skopos/skills/ui.product-interface-design.json` — Adopt the exact revalidated Product Interface Design binding required by the final candidate source state.

## Steps

- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Consolidate and review the first public release candidate" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Sync self-hosted instruction mirrors** (action, complete) — Required by Guard instructions.source-requires-sync.
- [x] **Refresh self-hosted knowledge state** (action, complete) — Required by Guard knowledge.refresh.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.
- [x] **Capture responsive and accessibility proof** (action, complete) — Required by Guard ui.accessibility-proof.

## Actions And Guards

- Action `instructions.sync-mirrors`: Required by Guard instructions.source-requires-sync.
- Action `maintenance.refresh-knowledge`: Required by Guard knowledge.refresh.
- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.capture-responsive-proof`: Required by Guard ui.accessibility-proof.
- Guard `instructions.source-requires-sync`
- Guard `knowledge.refresh`
- Guard `quality.typecheck`
- Guard `ui.accessibility-proof`

## Evidence And Readiness

- Every intended accumulated source and documentation change is reviewed for product consistency and release safety. (closure, agent-observation)
- No adopter-specific or unrelated project material enters the Skopos candidate. (closure, agent-observation)
- Focused tests, workspace typecheck, release scorecard validation, and package-facing checks report truthful outcomes. (closure, agent-observation)
- The reviewed candidate is committed locally without publishing or deploying. (closure, agent-observation)
- Guard instructions.source-requires-sync: Instruction source changes require synchronized mirrors (closure, source-bound-action)
- Guard knowledge.refresh: Operating-model declarations require refreshed local knowledge (closure, source-bound-action)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)
- Guard ui.accessibility-proof: UI changes require browser accessibility proof (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/decision-escalation-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/decision-escalation-model.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/retrieval-and-query-strategy.md; review and synchronize it if project truth changes. (target: `docs/architecture/retrieval-and-query-strategy.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/artifact-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/artifact-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/public-package-content-and-provenance.md; review and synchronize it if project truth changes. (target: `docs/architecture/public-package-content-and-provenance.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/scopes/skopos-ui/architecture/00-architecture.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/architecture/00-architecture.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/evidence-and-readiness-model.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes. (target: `docs/architecture/intelligent-project-onboarding.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/package-boundaries.md; review and synchronize it if project truth changes. (target: `docs/architecture/package-boundaries.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/policy-applicability-and-fixture-governance.md; review and synchronize it if project truth changes. (target: `docs/architecture/policy-applicability-and-fixture-governance.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/storage-lifecycle-and-privacy.md; review and synchronize it if project truth changes. (target: `docs/architecture/storage-lifecycle-and-privacy.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/runtime-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/runtime-model.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/agent-native-operating-model.md`); resolution: memory-updated
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/config-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/config-model.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/design-context-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/design-context-model.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/action-extension-model.md; review and synchronize it if project truth changes. (target: `docs/architecture/action-extension-model.md`); resolution: reviewed-no-change
- [complete] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes. (target: `docs/architecture/docs-governance.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/016-system-ui-diagram-and-graph-presentation.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/016-system-ui-diagram-and-graph-presentation.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-a61f2d9c-design-context-as-progressive-product-knowledge.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-a61f2d9c-design-context-as-progressive-product-knowledge.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/004-large-repo-operating-mode.md; review and synchronize it if project truth changes. (target: `docs/decisions/004-large-repo-operating-mode.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/031-bundled-cli-release-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/031-bundled-cli-release-contract.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/006-eval-harness-and-scoring-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/006-eval-harness-and-scoring-contract.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/012-system-ui-dev-loop-and-hot-reload.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/012-system-ui-dev-loop-and-hot-reload.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes. (target: `docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/028-initial-synthesized-repo-understanding-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/028-initial-synthesized-repo-understanding-contract.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes. (target: `docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260811-topology-aware-task-scope-authority.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260811-topology-aware-task-scope-authority.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260803-evidence-based-ask-back-classification.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260803-evidence-based-ask-back-classification.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/019-compiled-reference-layer-and-agent-memory-baseline.md; review and synchronize it if project truth changes. (target: `docs/decisions/019-compiled-reference-layer-and-agent-memory-baseline.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/005-tool-native-enforcement-strategy.md; review and synchronize it if project truth changes. (target: `docs/decisions/005-tool-native-enforcement-strategy.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/015-system-ui-markdown-rendering-and-doc-reader-pipeline.md; review and synchronize it if project truth changes. (target: `docs/scopes/skopos-ui/decisions/015-system-ui-markdown-rendering-and-doc-reader-pipeline.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260812-intelligent-project-onboarding-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260812-intelligent-project-onboarding-contract.md`); resolution: memory-updated
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-20260811-product-interface-design-first-release-boundary.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-20260811-product-interface-design-first-release-boundary.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/003-current-state-and-recommended-architecture-split.md; review and synchronize it if project truth changes. (target: `docs/decisions/003-current-state-and-recommended-architecture-split.md`); resolution: reviewed-no-change
- [complete] decision: The declared Task scope owns canonical decision Memory at docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes. (target: `docs/guides/developer-workflows.md`); resolution: memory-updated
- [complete] guide: The declared Task scope owns canonical guide Memory at docs/guides/semantic-guards.md; review and synchronize it if project truth changes. (target: `docs/guides/semantic-guards.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-3f19c8b2-unisolated-host-history-in-tests.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-3f19c8b2-unisolated-host-history-in-tests.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-20260803-mixed-worktree-proof-scope-amplification.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-20260803-mixed-worktree-proof-scope-amplification.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-ec3f2b2d-stale-distribution-reanimates-retired-contracts.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-ec3f2b2d-stale-distribution-reanimates-retired-contracts.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-0c339ca4-target-standard-without-self-adoption.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-0c339ca4-target-standard-without-self-adoption.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-4e27c8a1-retired-contracts-preserved-by-tests.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-4e27c8a1-retired-contracts-preserved-by-tests.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-23c981d4-mutation-before-admission-validation.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-23c981d4-mutation-before-admission-validation.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-a438a365-file-backed-ownership-without-atomic-cas.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-a438a365-file-backed-ownership-without-atomic-cas.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-f5a79ee3-timestamp-based-projection-freshness.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-f5a79ee3-timestamp-based-projection-freshness.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-6b27d8e4-volatile-task-state-self-invalidates-closure-evidence.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-6b27d8e4-volatile-task-state-self-invalidates-closure-evidence.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-91a6d470-dual-task-state-compatibility-projection.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-91a6d470-dual-task-state-compatibility-projection.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-7bc9a41e-passive-guidance-without-host-delivery.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-7bc9a41e-passive-guidance-without-host-delivery.md`); resolution: reviewed-no-change
- [complete] pattern: The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-2d65fd83-policy-label-command-guessing.md; review and synchronize it if project truth changes. (target: `docs/patterns/PAT-2d65fd83-policy-label-command-guessing.md`); resolution: reviewed-no-change
- [complete] standard: The declared Task scope owns canonical standard Memory at docs/patterns/README.md; review and synchronize it if project truth changes. (target: `docs/patterns/README.md`); resolution: reviewed-no-change
- [complete] standard: The declared Task scope owns canonical standard Memory at docs/standards/terminology.md; review and synchronize it if project truth changes. (target: `docs/standards/terminology.md`); resolution: reviewed-no-change
- [complete] standard: The declared Task scope owns canonical standard Memory at docs/standards/validation.md; review and synchronize it if project truth changes. (target: `docs/standards/validation.md`); resolution: reviewed-no-change

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-cbbd94cd",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-13T08:35:00.392Z",
  "updatedAt": "2026-08-13T10:28:53.251Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Consolidate and review the first public release candidate",
  "goal": "Consolidate and review the first public release candidate",
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
      "Every intended accumulated source and documentation change is reviewed for product consistency and release safety.",
      "No adopter-specific or unrelated project material enters the Skopos candidate.",
      "Focused tests, workspace typecheck, release scorecard validation, and package-facing checks report truthful outcomes.",
      "The reviewed candidate is committed locally without publishing or deploying."
    ],
    "nonGoals": [
      "Do not publish npm packages, deploy the public website, or change external release infrastructure."
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
      "ownedPathCount": 10,
      "affectedScopeIds": [
        "skopos",
        "skopos-web"
      ],
      "impactCategories": [
        "docs",
        "instruction-mirror",
        "instruction-source",
        "scope-source",
        "workspace-file"
      ],
      "proofSubjectKind": "task-closure"
    }
  },
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-fcaa7d1ce633f049"
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
      "detail": "Carry out \"Consolidate and review the first public release candidate\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck the Skopos workspace",
      "detail": "Required by Guard quality.typecheck.",
      "status": "complete"
    },
    {
      "id": "action-ui.capture-responsive-proof",
      "kind": "action",
      "title": "Capture responsive and accessibility proof",
      "detail": "Required by Guard ui.accessibility-proof.",
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
        "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
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
    },
    {
      "id": "ui.capture-responsive-proof",
      "title": "Capture responsive and accessibility proof",
      "category": "quality-check",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-capture-responsive-proof.yaml",
      "reason": "Required by Guard ui.accessibility-proof.",
      "matchedPaths": [
        "packages"
      ],
      "outputPaths": [
        ".skopos/evidence/ui"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "instructions.source-requires-sync",
    "knowledge.refresh",
    "quality.typecheck",
    "ui.accessibility-proof"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Every intended accumulated source and documentation change is reviewed for product consistency and release safety.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "No adopter-specific or unrelated project material enters the Skopos candidate.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "Focused tests, workspace typecheck, release scorecard validation, and package-facing checks report truthful outcomes.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The reviewed candidate is committed locally without publishing or deploying.",
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
    },
    {
      "id": "guard-ui.accessibility-proof",
      "acceptanceCriterion": "Guard ui.accessibility-proof: UI changes require browser accessibility proof",
      "phase": "closure",
      "actionIds": [
        "ui.capture-responsive-proof"
      ],
      "guardIds": [
        "ui.accessibility-proof"
      ],
      "evidence": "source-bound-action"
    }
  ],
  "memoryObligations": [
    {
      "id": "memory-architecture-030023aa04",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/decision-escalation-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/decision-escalation-model.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:24:56.673Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-18bdf705a5",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/retrieval-and-query-strategy.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/retrieval-and-query-strategy.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:24:57.983Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-1e8076edb8",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/artifact-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/artifact-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:24:59.569Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/00-architecture.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:25:00.950Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-3c55049580",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/public-package-content-and-provenance.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/public-package-content-and-provenance.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:02.288Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-573233ab26",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/scopes/skopos-ui/architecture/00-architecture.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/architecture/00-architecture.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:25:03.680Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-579535b5d3",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/evidence-and-readiness-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/evidence-and-readiness-model.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:04.960Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-663c7727b6",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/intelligent-project-onboarding.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/intelligent-project-onboarding.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:25:06.470Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-6db7adb969",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/package-boundaries.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/package-boundaries.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:08.556Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-7fa0e89822",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/policy-applicability-and-fixture-governance.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/policy-applicability-and-fixture-governance.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:10.879Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-a23449a467",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/storage-lifecycle-and-privacy.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/storage-lifecycle-and-privacy.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:13.409Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-c1be08bbb0",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/runtime-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/runtime-model.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:15.747Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-cad6006744",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/agent-native-operating-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/agent-native-operating-model.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:25:17.999Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-e1c28243f1",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/config-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/config-model.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:19.881Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-f0625bf606",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/design-context-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/design-context-model.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:22.336Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-f171416107",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/action-extension-model.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/action-extension-model.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:25.016Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-architecture-fbdc372589",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/architecture/docs-governance.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:25:27.303Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-02b92ac2a2",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/016-system-ui-diagram-and-graph-presentation.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/016-system-ui-diagram-and-graph-presentation.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:29.823Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-03283a9975",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/D-20260812-locally-owned-ui-source-and-visual-authority.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:25:32.349Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-0f7a3e18ef",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-a61f2d9c-design-context-as-progressive-product-knowledge.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-a61f2d9c-design-context-as-progressive-product-knowledge.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:35.336Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-11a920677b",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:37.800Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-1ed5fd862f",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/004-large-repo-operating-mode.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/004-large-repo-operating-mode.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:40.326Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-24824ea4ce",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/031-bundled-cli-release-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/031-bundled-cli-release-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:25:42.997Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-3da7b245e6",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/006-eval-harness-and-scoring-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/006-eval-harness-and-scoring-contract.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:45.386Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-3ec637c2cc",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/021-discussion-memory-checkpoints-and-handoff-contract.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:47.696Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-591b3528f8",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/012-system-ui-dev-loop-and-hot-reload.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/012-system-ui-dev-loop-and-hot-reload.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:50.048Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-5e228f0160",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/040-project-adapted-skill-packs-as-capability-projections.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:52.327Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-5f0163a357",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/D-20260804-human-first-supervision-projection.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:25:53.984Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-5fcdd568ee",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/008-system-ui-routed-app-stack.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:25:55.484Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-7064b9fa95",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/028-initial-synthesized-repo-understanding-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/028-initial-synthesized-repo-understanding-contract.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:25:57.159Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-7f31a96932",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:25:58.685Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-92ec6dfb32",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260811-topology-aware-task-scope-authority.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260811-topology-aware-task-scope-authority.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:00.172Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-95ee267954",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260803-evidence-based-ask-back-classification.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260803-evidence-based-ask-back-classification.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:01.647Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-9771d90f6d",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/019-compiled-reference-layer-and-agent-memory-baseline.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/019-compiled-reference-layer-and-agent-memory-baseline.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:03.090Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-bf93bcac58",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/005-tool-native-enforcement-strategy.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/005-tool-native-enforcement-strategy.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:04.557Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-c20585c476",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/scopes/skopos-ui/decisions/015-system-ui-markdown-rendering-and-doc-reader-pipeline.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/scopes/skopos-ui/decisions/015-system-ui-markdown-rendering-and-doc-reader-pipeline.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:05.965Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-c310d960b6",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260812-intelligent-project-onboarding-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260812-intelligent-project-onboarding-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:26:07.460Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-d2ed4ca2a8",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-20260811-product-interface-design-first-release-boundary.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-20260811-product-interface-design-first-release-boundary.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:08.817Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-f1d9bc61b4",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/003-current-state-and-recommended-architecture-split.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/003-current-state-and-recommended-architecture-split.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:10.212Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-decision-f8abc13982",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:26:11.704Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-guide-0ee62166d8",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/developer-workflows.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/developer-workflows.md",
      "resolution": "memory-updated",
      "resolutionReason": "Canonical project truth was updated and reviewed during release-candidate consolidation.",
      "resolvedAt": "2026-08-13T10:26:13.777Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-guide-f69150206f",
      "role": "guide",
      "reason": "The declared Task scope owns canonical guide Memory at docs/guides/semantic-guards.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/guides/semantic-guards.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:15.489Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-0ead6a28fa",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-3f19c8b2-unisolated-host-history-in-tests.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-3f19c8b2-unisolated-host-history-in-tests.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:17.094Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-1db7523f80",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-20260803-mixed-worktree-proof-scope-amplification.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-20260803-mixed-worktree-proof-scope-amplification.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:18.534Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-1e3aee600c",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-ec3f2b2d-stale-distribution-reanimates-retired-contracts.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-ec3f2b2d-stale-distribution-reanimates-retired-contracts.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:19.973Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-27d1887004",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-0c339ca4-target-standard-without-self-adoption.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-0c339ca4-target-standard-without-self-adoption.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:21.516Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-336d641e2b",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-4e27c8a1-retired-contracts-preserved-by-tests.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-4e27c8a1-retired-contracts-preserved-by-tests.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:23.052Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-4fb3a887ab",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-23c981d4-mutation-before-admission-validation.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-23c981d4-mutation-before-admission-validation.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:24.803Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-5974fa04f1",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-a438a365-file-backed-ownership-without-atomic-cas.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-a438a365-file-backed-ownership-without-atomic-cas.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:26.103Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-8443189a2a",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-f5a79ee3-timestamp-based-projection-freshness.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-f5a79ee3-timestamp-based-projection-freshness.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:27.503Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-ae2f88709d",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-6b27d8e4-volatile-task-state-self-invalidates-closure-evidence.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-6b27d8e4-volatile-task-state-self-invalidates-closure-evidence.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:28.830Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-ba640c5b0d",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-91a6d470-dual-task-state-compatibility-projection.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-91a6d470-dual-task-state-compatibility-projection.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:30.182Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-eb703377ea",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-7bc9a41e-passive-guidance-without-host-delivery.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-7bc9a41e-passive-guidance-without-host-delivery.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:31.751Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-pattern-fc4c879980",
      "role": "pattern",
      "reason": "The declared Task scope owns canonical pattern Memory at docs/patterns/PAT-2d65fd83-policy-label-command-guessing.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/PAT-2d65fd83-policy-label-command-guessing.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:33.397Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-standard-00e2cf8798",
      "role": "standard",
      "reason": "The declared Task scope owns canonical standard Memory at docs/patterns/README.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/patterns/README.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:34.793Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-standard-0b6e5e077b",
      "role": "standard",
      "reason": "The declared Task scope owns canonical standard Memory at docs/standards/terminology.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/standards/terminology.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:36.290Z",
      "resolvedByActorId": "codex-root"
    },
    {
      "id": "memory-standard-5f2d58a335",
      "role": "standard",
      "reason": "The declared Task scope owns canonical standard Memory at docs/standards/validation.md; review and synchronize it if project truth changes.",
      "status": "complete",
      "targetPath": "docs/standards/validation.md",
      "resolution": "reviewed-no-change",
      "resolutionReason": "Reviewed during release-candidate consolidation; no additional change to this Memory owner was required.",
      "resolvedAt": "2026-08-13T10:26:37.654Z",
      "resolvedByActorId": "codex-root"
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
      "id": "run-quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "summary": "Required by Guard quality.typecheck.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "quality.typecheck",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "run-ui.capture-responsive-proof",
      "title": "Capture responsive and accessibility proof",
      "summary": "Required by Guard ui.accessibility-proof.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.capture-responsive-proof",
      "blocking": false,
      "status": "complete"
    }
  ],
  "ownershipExpansions": [
    {
      "paths": [
        "design-qa.md",
        "tools/skopos/actions/maintenance-refresh-knowledge.yaml"
      ],
      "reason": "Candidate audit found a new public QA artifact with machine-local paths and a self-hosted Action still targeting a removed package script.",
      "actorId": "codex-root",
      "recordedAt": "2026-08-13T08:38:09.546Z",
      "baselinePaths": [
        {
          "path": "design-qa.md",
          "digest": "9130ef014d0368e0842f5c9fcae43d4cbc44602b425c6822e1df8b26dac1b6c9"
        },
        {
          "path": "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
          "digest": "7707f7c919620340f3653a3b285eb59409353b77a9eb63cc32ec6af58d6c5a48"
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
        "tools/skopos/skills/ui.product-interface-design.json"
      ],
      "reason": "Adopt the exact revalidated Product Interface Design binding required by the final candidate source state.",
      "actorId": "codex-root",
      "recordedAt": "2026-08-13T10:22:42.176Z",
      "baselinePaths": [
        {
          "path": "tools/skopos/skills/ui.product-interface-design.json",
          "digest": "03c73c0b13ba9781c592829936a602f3b03017621727df021e0a7d16d6cb507c"
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
    ".cursor/rules/project.mdc",
    ".github/copilot-instructions.md",
    "AGENTS.md",
    "apps/web",
    "CLAUDE.md",
    "design-qa.md",
    "docs",
    "package.json",
    "packages",
    "README.md",
    "scripts",
    "tools/skopos/actions/maintenance-refresh-knowledge.yaml",
    "tools/skopos/skills/ui.product-interface-design.json"
  ]
}
```
<!-- skopos:task-state:end -->
