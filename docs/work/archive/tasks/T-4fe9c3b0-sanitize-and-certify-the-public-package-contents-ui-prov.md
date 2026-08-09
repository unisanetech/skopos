---
title: "Task: Sanitize and certify the public package contents, UI provenance, evaluation assets, and installed scripts"
status: complete
owner: "codex-release-package"
id: T-4fe9c3b0
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-031ab34dd7287c05
lastUpdated: 2026-08-09
---

# Task: Sanitize and certify the public package contents, UI provenance, evaluation assets, and installed scripts

## Changelog

- `2026-08-09`: Synchronized Task state `complete` from Skopos.

## Goal

Sanitize and certify the public package contents, UI provenance, evaluation assets, and installed scripts

## Acceptance

- Packed Product UI Craft fixtures use unmistakably fictional data and the exact tarball passes prohibited-pattern scans for personal data, credentials, absolute paths, and internal brands
- Public Skopos UI source and packed output contain no Unisane branding or managed markers, and bundled components, tokens, fonts, and assets have explicit Apache-2.0-compatible provenance
- The runtime evaluation-asset decision is implemented and exact packed-content assertions permit only documented runtime-required skill assets
- Every binary and script exposed by the installed @skopos/cli package works from a clean packed installation or is removed from the public manifest
- GitHub-visible source and final npm contents are inspected separately without changing or removing Product UI Craft

## Non-Goals

- Do not publish the package or close the separate Product UI Craft efficacy Finding

## Constraints

- Preserve Product UI Craft and sanitize it; do not remove the capability
- Do not modify the active R2 benchmark and adjudication files owned by T-22bcd9ef

## Owned Paths

- `docs/architecture/public-package-content-and-provenance.md`
- `packages/cli/package.json`
- `packages/cli/scripts/copy-skill-packs.mjs`
- `packages/cli/src/__tests__/release-install-smoke.test.ts`
- `packages/cli/src/__tests__/release-surface.test.ts`
- `packages/ui/skopos-ui.json`
- `packages/ui/src/app/globals.css`
- `packages/ui/unisane-ui.json`
- `skill-packs/ui/product-craft/evaluations/templates/complete-service-flow`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Sanitize and certify the public package contents, UI provenance, evaluation assets, and installed scripts" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.
- [x] **Build routed Skopos console app** (action, complete) — Required by Guard ui.console-build.
- [x] **Capture responsive and accessibility proof** (action, complete) — Required by Guard ui.accessibility-proof.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.build-console-app`: Required by Guard ui.console-build.
- Action `ui.capture-responsive-proof`: Required by Guard ui.accessibility-proof.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`
- Guard `ui.accessibility-proof`
- Guard `ui.console-build`

## Evidence And Readiness

- Packed Product UI Craft fixtures use unmistakably fictional data and the exact tarball passes prohibited-pattern scans for personal data, credentials, absolute paths, and internal brands (closure, agent-observation)
- Public Skopos UI source and packed output contain no Unisane branding or managed markers, and bundled components, tokens, fonts, and assets have explicit Apache-2.0-compatible provenance (closure, agent-observation)
- The runtime evaluation-asset decision is implemented and exact packed-content assertions permit only documented runtime-required skill assets (closure, agent-observation)
- Every binary and script exposed by the installed @skopos/cli package works from a clean packed installation or is removed from the public manifest (closure, agent-observation)
- GitHub-visible source and final npm contents are inspected separately without changing or removing Product UI Craft (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)
- Guard ui.accessibility-proof: UI changes require browser accessibility proof (closure, source-bound-action)
- Guard ui.console-build: Console changes require build Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-4fe9c3b0",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-08T23:44:23.481Z",
  "updatedAt": "2026-08-09T00:26:52.948Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Sanitize and certify the public package contents, UI provenance, evaluation assets, and installed scripts",
  "goal": "Sanitize and certify the public package contents, UI provenance, evaluation assets, and installed scripts",
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
      "Packed Product UI Craft fixtures use unmistakably fictional data and the exact tarball passes prohibited-pattern scans for personal data, credentials, absolute paths, and internal brands",
      "Public Skopos UI source and packed output contain no Unisane branding or managed markers, and bundled components, tokens, fonts, and assets have explicit Apache-2.0-compatible provenance",
      "The runtime evaluation-asset decision is implemented and exact packed-content assertions permit only documented runtime-required skill assets",
      "Every binary and script exposed by the installed @skopos/cli package works from a clean packed installation or is removed from the public manifest",
      "GitHub-visible source and final npm contents are inspected separately without changing or removing Product UI Craft"
    ],
    "nonGoals": [
      "Do not publish the package or close the separate Product UI Craft efficacy Finding"
    ],
    "constraints": [
      "Preserve Product UI Craft and sanitize it; do not remove the capability",
      "Do not modify the active R2 benchmark and adjudication files owned by T-22bcd9ef"
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-031ab34dd7287c05"
  },
  "priority": 0,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.scope-confirmation",
      "kind": "decision",
      "title": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "detail": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "status": "complete"
    },
    {
      "id": "decision-plan.public-api-change",
      "kind": "decision",
      "title": "Should this plan change a public contract, route, or SDK surface?",
      "detail": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "status": "complete"
    },
    {
      "id": "step-resolve-decisions",
      "kind": "implementation",
      "title": "Resolve plan decisions",
      "detail": "Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.",
      "status": "complete"
    },
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
      "detail": "Carry out \"Sanitize and certify the public package contents, UI provenance, evaluation assets, and installed scripts\" inside the resolved scope before widening impact to adjacent areas.",
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
    },
    {
      "id": "action-ui.build-console-app",
      "kind": "action",
      "title": "Build routed Skopos console app",
      "detail": "Required by Guard ui.console-build.",
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
      "id": "quality.typecheck",
      "title": "Typecheck the Skopos workspace",
      "category": "quality-check",
      "safety": "read-only",
      "sourcePath": "tools/skopos/actions/quality-typecheck.yaml",
      "reason": "Required by Guard quality.typecheck.",
      "matchedPaths": [
        "packages/ui/src/app/globals.css",
        "packages/ui/unisane-ui.json",
        "packages/ui/skopos-ui.json",
        "packages/cli/scripts/copy-skill-packs.mjs",
        "packages/cli/package.json",
        "packages/cli/src/__tests__/release-surface.test.ts",
        "packages/cli/src/__tests__/release-install-smoke.test.ts"
      ],
      "outputPaths": [],
      "requiresApproval": false
    },
    {
      "id": "ui.build-console-app",
      "title": "Build routed Skopos console app",
      "category": "maintenance",
      "safety": "mutating",
      "sourcePath": "tools/skopos/actions/ui-build-console-app.yaml",
      "reason": "Required by Guard ui.console-build.",
      "matchedPaths": [
        "packages/ui/src/app/globals.css",
        "packages/ui/unisane-ui.json",
        "packages/ui/skopos-ui.json"
      ],
      "outputPaths": [
        ".skopos/ui/app"
      ],
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
        "packages/ui/src/app/globals.css",
        "packages/ui/unisane-ui.json",
        "packages/ui/skopos-ui.json"
      ],
      "outputPaths": [
        ".skopos/evidence/ui"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.focused-behavior-proof",
    "quality.typecheck",
    "ui.accessibility-proof",
    "ui.console-build"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Packed Product UI Craft fixtures use unmistakably fictional data and the exact tarball passes prohibited-pattern scans for personal data, credentials, absolute paths, and internal brands",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Public Skopos UI source and packed output contain no Unisane branding or managed markers, and bundled components, tokens, fonts, and assets have explicit Apache-2.0-compatible provenance",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "The runtime evaluation-asset decision is implemented and exact packed-content assertions permit only documented runtime-required skill assets",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Every binary and script exposed by the installed @skopos/cli package works from a clean packed installation or is removed from the public manifest",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "GitHub-visible source and final npm contents are inspected separately without changing or removing Product UI Craft",
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
    },
    {
      "id": "guard-ui.console-build",
      "acceptanceCriterion": "Guard ui.console-build: Console changes require build Evidence",
      "phase": "closure",
      "actionIds": [
        "ui.build-console-app"
      ],
      "guardIds": [
        "ui.console-build"
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
      "resolution": "memory-updated",
      "resolutionReason": "Linked and summarized the source/tarball release boundary, exact Skill asset contract, private tooling ownership, and unresolved copied-UI provenance in canonical architecture Memory.",
      "resolvedAt": "2026-08-09T00:09:04.697Z",
      "resolvedByActorId": "codex-release-package"
    }
  ],
  "questions": [
    {
      "id": "plan.scope-confirmation",
      "category": "scope",
      "escalation": "recommend-and-ask",
      "question": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "whyItMatters": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "recommendedOptionId": "narrow-scope-first",
      "options": [
        {
          "id": "narrow-scope-first",
          "label": "Narrow scope first",
          "rationale": "Recommended because one declared Scope keeps context, checks, and docs impact easier to control."
        },
        {
          "id": "keep-workspace-scope",
          "label": "Keep workspace scope",
          "rationale": "Useful when the change truly spans multiple Scopes and you intend to coordinate a cross-Scope rollout."
        }
      ],
      "blocking": false,
      "status": "resolved",
      "resolvedOptionId": "narrow-scope-first",
      "resolvedAt": "2026-08-08T23:44:38.519Z",
      "resolvedByActorId": "codex-release-package"
    },
    {
      "id": "plan.public-api-change",
      "category": "public-api",
      "escalation": "must-ask",
      "question": "Should this plan change a public contract, route, or SDK surface?",
      "whyItMatters": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "recommendedOptionId": "confirm-contract-first",
      "options": [
        {
          "id": "confirm-contract-first",
          "label": "Confirm contract first",
          "rationale": "Recommended because contract decisions should be explicit before implementation starts."
        },
        {
          "id": "internal-only-change",
          "label": "Keep change internal",
          "rationale": "Use this when the goal should not affect public behavior or external consumers."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "confirm-contract-first",
      "resolvedAt": "2026-08-08T23:44:40.327Z",
      "resolvedByActorId": "codex-release-package"
    }
  ],
  "recommendations": [
    {
      "id": "resolve-plan.scope-confirmation",
      "title": "Resolve: Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "summary": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "priority": "medium",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.scope-confirmation",
      "blocking": false,
      "status": "complete"
    },
    {
      "id": "resolve-plan.public-api-change",
      "title": "Resolve: Should this plan change a public contract, route, or SDK surface?",
      "summary": "Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.public-api-change",
      "blocking": true,
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
      "id": "run-ui.build-console-app",
      "title": "Build routed Skopos console app",
      "summary": "Required by Guard ui.console-build.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.build-console-app",
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
  "declaredOwnedPaths": [
    "docs/architecture/public-package-content-and-provenance.md",
    "packages/cli/package.json",
    "packages/cli/scripts/copy-skill-packs.mjs",
    "packages/cli/src/__tests__/release-install-smoke.test.ts",
    "packages/cli/src/__tests__/release-surface.test.ts",
    "packages/ui/skopos-ui.json",
    "packages/ui/src/app/globals.css",
    "packages/ui/unisane-ui.json",
    "skill-packs/ui/product-craft/evaluations/templates/complete-service-flow"
  ]
}
```
<!-- skopos:task-state:end -->
