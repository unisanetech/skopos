---
title: "Task: Certify agent-reviewed adoption across assessment-only, healthy, and messy projects"
status: active
owner: "codex"
id: T-db2a2a6c
scope: "skopos"
role: task
lifecycle: active
authority: canonical
provenance: accepted
view: current
risk: high-impact
proofSubject: project-integration
proofBaseline: baseline-10c061c010ed4aa7
lastUpdated: 2026-08-03
---

# Task: Certify agent-reviewed adoption across assessment-only, healthy, and messy projects

## Changelog

- `2026-08-03`: Synchronized Task state `active` from Skopos.

## Goal

Certify agent-reviewed adoption across assessment-only, healthy, and messy projects

## Acceptance

- Scanner-only assessment remains visibly assessment-only and cannot claim agent-ready in Session, Trust, or UI projections.
- Healthy new-project and healthy brownfield fixtures complete assess, agent-reviewed proposal, approval, attributable execution, standard verification, activation, and agent-ready Session delivery.
- A messy brownfield fixture exposes contradictions and material questions, stops without mutation, and reaches agent-ready only after reviewed resolution and verified restructuring.
- The canonical proof command executes the adoption matrix and passes from a clean fixture state.
- Both adoption Findings close only after durable architecture, Decision, Plan, host, and UI truth match the certified behavior.

## Non-Goals

- Automatically rewrite adopter documents without the approved coding-agent execution record.

## Constraints

- Preserve assessment, proposal, approval, execution, verification, and activation as one canonical adoption lifecycle.

## Owned Paths

- `docs/architecture/docs-governance.md`
- `docs/decisions/028-initial-synthesized-repo-understanding-contract.md`
- `docs/findings/F-20260629-proof-fixtures-understanding-depth-gap.md`
- `docs/findings/F-20260629-understand-scanner-only-onboarding-gap.md`
- `docs/findings/archive`
- `docs/work/archive/tasks`
- `docs/work/plans/P-e7e888e6-canonical-product-convergence.md`
- `internal/evals`
- `packages/cli/package.json`
- `packages/cli/src/__tests__/adoption-approval.test.ts`
- `packages/cli/src/__tests__/adoption-assessment.test.ts`
- `packages/cli/src/__tests__/adoption-matrix.test.ts`
- `packages/cli/src/__tests__/adoption-proposal.test.ts`
- `packages/cli/src/__tests__/adoption-verification.test.ts`
- `packages/cli/src/__tests__/session-context-contract.test.ts`
- `packages/runtime/src/application/adoption`
- `packages/runtime/src/application/session`
- `packages/runtime/src/application/trust`
- `packages/ui/src`

## Steps

- [ ] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, pending) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [ ] **Resolve plan decisions** (implementation, pending) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [ ] **Record Task risk and detail before editing** (implementation, pending) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [ ] **Review the current pattern in Skopos Workspace** (implementation, pending) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [ ] **Implement the smallest scoped change** (implementation, pending) — Carry out "Certify agent-reviewed adoption across assessment-only, healthy, and messy projects" inside the resolved scope before widening impact to adjacent areas.
- [ ] **Sync docs and instruction surfaces if touched** (docs, pending) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [ ] **Typecheck the Skopos workspace** (action, pending) — Required by Guard quality.typecheck.
- [ ] **Build routed Skopos console app** (action, pending) — Required by Guard ui.console-build.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Action `ui.build-console-app`: Required by Guard ui.console-build.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`
- Guard `ui.console-build`

## Evidence And Readiness

- Scanner-only assessment remains visibly assessment-only and cannot claim agent-ready in Session, Trust, or UI projections. (closure, agent-observation)
- Healthy new-project and healthy brownfield fixtures complete assess, agent-reviewed proposal, approval, attributable execution, standard verification, activation, and agent-ready Session delivery. (closure, agent-observation)
- A messy brownfield fixture exposes contradictions and material questions, stops without mutation, and reaches agent-ready only after reviewed resolution and verified restructuring. (closure, agent-observation)
- The canonical proof command executes the adoption matrix and passes from a clean fixture state. (closure, agent-observation)
- Both adoption Findings close only after durable architecture, Decision, Plan, host, and UI truth match the certified behavior. (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)
- Guard ui.console-build: Console changes require build Evidence (closure, source-bound-action)

## Memory Obligations

- [open] architecture: The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes. (target: `docs/architecture/docs-governance.md`)
- [open] decision: The declared Task scope owns canonical decision Memory at docs/decisions/028-initial-synthesized-repo-understanding-contract.md; review and synchronize it if project truth changes. (target: `docs/decisions/028-initial-synthesized-repo-understanding-contract.md`)

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-db2a2a6c",
  "type": "task",
  "status": "active",
  "generatedAt": "2026-08-03T17:38:40.934Z",
  "updatedAt": "2026-08-03T17:38:40.934Z",
  "planIds": [],
  "childTasks": [],
  "state": "active",
  "detail": "detailed",
  "title": "Certify agent-reviewed adoption across assessment-only, healthy, and messy projects",
  "goal": "Certify agent-reviewed adoption across assessment-only, healthy, and messy projects",
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
      "Scanner-only assessment remains visibly assessment-only and cannot claim agent-ready in Session, Trust, or UI projections.",
      "Healthy new-project and healthy brownfield fixtures complete assess, agent-reviewed proposal, approval, attributable execution, standard verification, activation, and agent-ready Session delivery.",
      "A messy brownfield fixture exposes contradictions and material questions, stops without mutation, and reaches agent-ready only after reviewed resolution and verified restructuring.",
      "The canonical proof command executes the adoption matrix and passes from a clean fixture state.",
      "Both adoption Findings close only after durable architecture, Decision, Plan, host, and UI truth match the certified behavior."
    ],
    "nonGoals": [
      "Automatically rewrite adopter documents without the approved coding-agent execution record."
    ],
    "constraints": [
      "Preserve assessment, proposal, approval, execution, verification, and activation as one canonical adoption lifecycle."
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "project-integration",
    "baselineId": "baseline-10c061c010ed4aa7"
  },
  "priority": 90,
  "dependencyTaskIds": [],
  "steps": [
    {
      "id": "decision-plan.scope-confirmation",
      "kind": "decision",
      "title": "Should this change stay at workspace scope, or should it be narrowed to one declared Scope?",
      "detail": "Wide-scope Plans in monorepos drift faster and make Readiness less precise.",
      "status": "pending"
    },
    {
      "id": "step-resolve-decisions",
      "kind": "implementation",
      "title": "Resolve plan decisions",
      "detail": "Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.",
      "status": "pending"
    },
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
      "detail": "Carry out \"Certify agent-reviewed adoption across assessment-only, healthy, and messy projects\" inside the resolved scope before widening impact to adjacent areas.",
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
      "id": "action-quality.typecheck",
      "kind": "action",
      "title": "Typecheck the Skopos workspace",
      "detail": "Required by Guard quality.typecheck.",
      "status": "pending"
    },
    {
      "id": "action-ui.build-console-app",
      "kind": "action",
      "title": "Build routed Skopos console app",
      "detail": "Required by Guard ui.console-build.",
      "status": "pending"
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
        "packages/cli/package.json",
        "packages/cli/src/__tests__/adoption-matrix.test.ts",
        "packages/cli/src/__tests__/adoption-assessment.test.ts",
        "packages/cli/src/__tests__/adoption-proposal.test.ts",
        "packages/cli/src/__tests__/adoption-approval.test.ts",
        "packages/cli/src/__tests__/adoption-verification.test.ts",
        "packages/cli/src/__tests__/session-context-contract.test.ts",
        "packages/runtime/src/application/adoption",
        "packages/runtime/src/application/session",
        "packages/runtime/src/application/trust",
        "packages/ui/src"
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
        "packages/ui/src"
      ],
      "outputPaths": [
        ".skopos/ui/app"
      ],
      "requiresApproval": false
    }
  ],
  "selectedGuardIds": [
    "quality.focused-behavior-proof",
    "quality.typecheck",
    "ui.console-build"
  ],
  "evidenceRequirements": [
    {
      "id": "acceptance-1",
      "acceptanceCriterion": "Scanner-only assessment remains visibly assessment-only and cannot claim agent-ready in Session, Trust, or UI projections.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Healthy new-project and healthy brownfield fixtures complete assess, agent-reviewed proposal, approval, attributable execution, standard verification, activation, and agent-ready Session delivery.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "A messy brownfield fixture exposes contradictions and material questions, stops without mutation, and reaches agent-ready only after reviewed resolution and verified restructuring.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "The canonical proof command executes the adoption matrix and passes from a clean fixture state.",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Both adoption Findings close only after durable architecture, Decision, Plan, host, and UI truth match the certified behavior.",
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
      "id": "memory-architecture-fbdc372589",
      "role": "architecture",
      "reason": "The declared Task scope owns canonical architecture Memory at docs/architecture/docs-governance.md; review and synchronize it if project truth changes.",
      "status": "open",
      "targetPath": "docs/architecture/docs-governance.md"
    },
    {
      "id": "memory-decision-7064b9fa95",
      "role": "decision",
      "reason": "The declared Task scope owns canonical decision Memory at docs/decisions/028-initial-synthesized-repo-understanding-contract.md; review and synchronize it if project truth changes.",
      "status": "open",
      "targetPath": "docs/decisions/028-initial-synthesized-repo-understanding-contract.md"
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
      "status": "open"
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
    },
    {
      "id": "run-ui.build-console-app",
      "title": "Build routed Skopos console app",
      "summary": "Required by Guard ui.console-build.",
      "priority": "medium",
      "actionKind": "run-action",
      "actionId": "ui.build-console-app",
      "blocking": false,
      "status": "open"
    }
  ],
  "declaredOwnedPaths": [
    "docs/architecture/docs-governance.md",
    "docs/decisions/028-initial-synthesized-repo-understanding-contract.md",
    "docs/findings/F-20260629-proof-fixtures-understanding-depth-gap.md",
    "docs/findings/F-20260629-understand-scanner-only-onboarding-gap.md",
    "docs/findings/archive",
    "docs/work/archive/tasks",
    "docs/work/plans/P-e7e888e6-canonical-product-convergence.md",
    "internal/evals",
    "packages/cli/package.json",
    "packages/cli/src/__tests__/adoption-approval.test.ts",
    "packages/cli/src/__tests__/adoption-assessment.test.ts",
    "packages/cli/src/__tests__/adoption-matrix.test.ts",
    "packages/cli/src/__tests__/adoption-proposal.test.ts",
    "packages/cli/src/__tests__/adoption-verification.test.ts",
    "packages/cli/src/__tests__/session-context-contract.test.ts",
    "packages/runtime/src/application/adoption",
    "packages/runtime/src/application/session",
    "packages/runtime/src/application/trust",
    "packages/ui/src"
  ]
}
```
<!-- skopos:task-state:end -->
