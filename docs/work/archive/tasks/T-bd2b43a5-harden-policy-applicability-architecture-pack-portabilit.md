---
title: "Task: Harden policy applicability, architecture-pack portability, and fixture credibility before public release"
status: complete
owner: "codex-release-hardening"
id: T-bd2b43a5
scope: "skopos"
role: task
lifecycle: historical
authority: canonical
provenance: accepted
view: exception
risk: high-impact
proofSubject: task-closure
proofBaseline: baseline-edd0787d829e4dc5
lastUpdated: 2026-08-08
---

# Task: Harden policy applicability, architecture-pack portability, and fixture credibility before public release

## Changelog

- `2026-08-08`: Synchronized Task state `complete` from Skopos.

## Goal

Harden policy applicability, architecture-pack portability, and fixture credibility before public release

## Acceptance

- Policy recommendations derive from observed repository evidence, anti-signals veto automatic application, unknown repositories remain review-only, and explicit human acceptance remains required
- Repository-family and language detection covers representative application, service, CLI, library, platform, mobile, data/ML, infrastructure, documentation, and embedded projects across common ecosystems
- architecture.mid-app uses portable role-based principles, valid architectural counterexamples, and no unfinished mandatory heuristic without human confirmation
- Every active repository fixture declares its family, language, purpose, expected result, and current executable consumer, with enforcement proving no active fixture is orphaned
- Representative non-JavaScript fixtures pass focused recommendation and policy-pack tests

## Non-Goals

- Publish Skopos or claim the full public-release audit complete

## Constraints

- Treat uncertain evidence conservatively and preserve explicit human acceptance before enforcement
- Do not weaken existing deterministic policy drift or fixture integrity gates

## Owned Paths

- `fixtures/repos`
- `packages/cli/src/__tests__`
- `packages/runtime/src/application/policies/policies.service.ts`
- `policy-packs/architecture/mid-app`
- `tests/README.md`

## Steps

- [x] **Should this change stay at workspace scope, or should it be narrowed to one declared Scope?** (decision, complete) — Wide-scope Plans in monorepos drift faster and make Readiness less precise.
- [x] **Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?** (decision, complete) — Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.
- [x] **Should this plan change a public contract, route, or SDK surface?** (decision, complete) — Public-facing changes need explicit confirmation so the agent does not silently ship a breaking contract.
- [x] **Resolve plan decisions** (implementation, complete) — Answer the recommended ask-back questions before implementation so the agent does not guess on high-impact choices.
- [x] **Record Task risk and detail before editing** (implementation, complete) — Confirm whether Task risk is light, standard, or high-impact. Keep the active Task current, use a Plan only for multi-Task direction, add a Decision for durable choices, and add or update a Finding for structural gaps.
- [x] **Review the current pattern in Skopos Workspace** (implementation, complete) — Use the compact references to confirm the current scope, command surface, and docs entrypoints before editing code.
- [x] **Implement the smallest scoped change** (implementation, complete) — Carry out "Harden policy applicability, architecture-pack portability, and fixture credibility before public release" inside the resolved scope before widening impact to adjacent areas.
- [x] **Sync docs and instruction surfaces if touched** (docs, complete) — Keep docs, instruction mirrors, and generated project knowledge aligned with the implementation.
- [x] **Typecheck the Skopos workspace** (action, complete) — Required by Guard quality.typecheck.

## Actions And Guards

- Action `quality.typecheck`: Required by Guard quality.typecheck.
- Guard `quality.focused-behavior-proof`
- Guard `quality.typecheck`

## Evidence And Readiness

- Policy recommendations derive from observed repository evidence, anti-signals veto automatic application, unknown repositories remain review-only, and explicit human acceptance remains required (closure, agent-observation)
- Repository-family and language detection covers representative application, service, CLI, library, platform, mobile, data/ML, infrastructure, documentation, and embedded projects across common ecosystems (closure, agent-observation)
- architecture.mid-app uses portable role-based principles, valid architectural counterexamples, and no unfinished mandatory heuristic without human confirmation (closure, agent-observation)
- Every active repository fixture declares its family, language, purpose, expected result, and current executable consumer, with enforcement proving no active fixture is orphaned (closure, agent-observation)
- Representative non-JavaScript fixtures pass focused recommendation and policy-pack tests (closure, agent-observation)
- Guard quality.focused-behavior-proof: Behavior changes require focused proof (closure, agent-observation)
- Guard quality.typecheck: TypeScript changes require typecheck Evidence (closure, source-bound-action)

## Memory Obligations

- [complete] architecture: High-impact work must review and synchronize the existing architecture Memory for Scope skopos. (target: `docs/architecture/00-architecture.md`); resolution: memory-updated

## Portable Task State

This machine-readable block is the durable source used to rebuild local Skopos state.

<!-- skopos:task-state:start -->
```json
{
  "schemaVersion": 1,
  "id": "T-bd2b43a5",
  "type": "task",
  "status": "durable",
  "generatedAt": "2026-08-08T23:18:20.329Z",
  "updatedAt": "2026-08-08T23:43:33.695Z",
  "planIds": [],
  "childTasks": [],
  "state": "complete",
  "detail": "detailed",
  "title": "Harden policy applicability, architecture-pack portability, and fixture credibility before public release",
  "goal": "Harden policy applicability, architecture-pack portability, and fixture credibility before public release",
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
      "Policy recommendations derive from observed repository evidence, anti-signals veto automatic application, unknown repositories remain review-only, and explicit human acceptance remains required",
      "Repository-family and language detection covers representative application, service, CLI, library, platform, mobile, data/ML, infrastructure, documentation, and embedded projects across common ecosystems",
      "architecture.mid-app uses portable role-based principles, valid architectural counterexamples, and no unfinished mandatory heuristic without human confirmation",
      "Every active repository fixture declares its family, language, purpose, expected result, and current executable consumer, with enforcement proving no active fixture is orphaned",
      "Representative non-JavaScript fixtures pass focused recommendation and policy-pack tests"
    ],
    "nonGoals": [
      "Publish Skopos or claim the full public-release audit complete"
    ],
    "constraints": [
      "Treat uncertain evidence conservatively and preserve explicit human acceptance before enforcement",
      "Do not weaken existing deterministic policy drift or fixture integrity gates"
    ]
  },
  "risk": "high-impact",
  "proofSubject": {
    "kind": "task-closure",
    "baselineId": "baseline-edd0787d829e4dc5"
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
      "id": "decision-plan.architecture-shift",
      "kind": "decision",
      "title": "Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "detail": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
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
      "detail": "Carry out \"Harden policy applicability, architecture-pack portability, and fixture credibility before public release\" inside the resolved scope before widening impact to adjacent areas.",
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
        "packages/runtime/src/application/policies/policies.service.ts",
        "packages/cli/src/__tests__"
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
      "acceptanceCriterion": "Policy recommendations derive from observed repository evidence, anti-signals veto automatic application, unknown repositories remain review-only, and explicit human acceptance remains required",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-2",
      "acceptanceCriterion": "Repository-family and language detection covers representative application, service, CLI, library, platform, mobile, data/ML, infrastructure, documentation, and embedded projects across common ecosystems",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-3",
      "acceptanceCriterion": "architecture.mid-app uses portable role-based principles, valid architectural counterexamples, and no unfinished mandatory heuristic without human confirmation",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-4",
      "acceptanceCriterion": "Every active repository fixture declares its family, language, purpose, expected result, and current executable consumer, with enforcement proving no active fixture is orphaned",
      "phase": "closure",
      "actionIds": [],
      "guardIds": [],
      "evidence": "agent-observation"
    },
    {
      "id": "acceptance-5",
      "acceptanceCriterion": "Representative non-JavaScript fixtures pass focused recommendation and policy-pack tests",
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
      "id": "memory-architecture-202882e662",
      "role": "architecture",
      "reason": "High-impact work must review and synchronize the existing architecture Memory for Scope skopos.",
      "status": "complete",
      "targetPath": "docs/architecture/00-architecture.md",
      "resolution": "memory-updated",
      "resolutionReason": "Updated the architecture router and added the canonical evidence-based policy applicability, portable role-mapping, and active fixture-governance model.",
      "resolvedAt": "2026-08-08T23:40:25.941Z",
      "resolvedByActorId": "codex-release-hardening"
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
      "resolvedAt": "2026-08-08T23:19:39.007Z",
      "resolvedByActorId": "codex-release-hardening"
    },
    {
      "id": "plan.architecture-shift",
      "category": "architecture",
      "escalation": "must-ask",
      "question": "Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "whyItMatters": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "recommendedOptionId": "preserve-current-boundaries",
      "options": [
        {
          "id": "preserve-current-boundaries",
          "label": "Preserve current boundaries",
          "rationale": "Recommended unless the goal explicitly requires a structural redesign."
        },
        {
          "id": "approve-architecture-change",
          "label": "Approve architecture change",
          "rationale": "Use this when the change should redefine package, scope, or runtime boundaries."
        }
      ],
      "blocking": true,
      "status": "resolved",
      "resolvedOptionId": "preserve-current-boundaries",
      "resolvedAt": "2026-08-08T23:19:40.845Z",
      "resolvedByActorId": "codex-release-hardening"
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
      "resolvedAt": "2026-08-08T23:19:42.603Z",
      "resolvedByActorId": "codex-release-hardening"
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
      "id": "resolve-plan.architecture-shift",
      "title": "Resolve: Does this plan intentionally change the current architecture or package boundaries around Skopos Workspace?",
      "summary": "Architecture changes should be explicit so future retrieval and Readiness rules do not model the wrong pattern as canonical.",
      "priority": "high",
      "actionKind": "resolve-question",
      "linkedQuestionId": "plan.architecture-shift",
      "blocking": true,
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
    }
  ],
  "declaredOwnedPaths": [
    "fixtures/repos",
    "packages/cli/src/__tests__",
    "packages/runtime/src/application/policies/policies.service.ts",
    "policy-packs/architecture/mid-app",
    "tests/README.md"
  ]
}
```
<!-- skopos:task-state:end -->
