---
title: Topology-Aware Task Scope Resolution Is Not Yet Enforced
status: resolved
severity: MUST
owner: skopos-core
id: F-20260811-topology-aware-task-scope-resolution-gap
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-11
relatedDocs:
  - ../decisions/D-20260811-topology-aware-task-scope-authority.md
  - ../architecture/docs-governance.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
  - ../work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md
reviewCycle: before public release and whenever Task Scope admission changes
---

# Topology-Aware Task Scope Resolution Is Not Yet Enforced

## Progress

- `2026-08-11`: Initial Task ownership now resolves to the deepest declared
  `codeRoots` owner across the project-generic Scope kind set. Mixed implicit ownership
  fails closed with candidate Scopes and exact explicit-Scope or split-Task recovery.
  The generic monorepo Scope ask-back is no longer emitted, and legacy
  `narrow-scope-first` answers cannot be recorded without an operational authority
  change. Source and packed CLI fixtures pass for the implemented baseline.
- `2026-08-11`: Post-admission ownership now classifies within-Scope, declared
  dependency, meaningful common-ancestor, explicit workspace, and unrelated shapes.
  A common ancestor rebinds Task authority and its Memory/proof surface; dependency
  expansion preserves the narrow owning Scope; unrelated expansion fails before path
  adoption with exact independent-Task commands. Required Actions reset to pending,
  stale Evidence cannot close the new proof identity, and clean reconstruction
  preserves the rebound Scope. Generic source fixtures and the packed CLI lifecycle
  pass.
- `2026-08-11`: Safe split guidance is now integrated with semantic Task-drift
  detection. The canonical Task recommendation carries the exact bounded follow-up
  command and is visible through the full runtime/MCP Task artifact and compact CLI
  projection. Core Scope authority no longer widens silently.
- `2026-08-11`: The release baseline now includes initial narrowest-owner admission,
  topology-aware post-admission expansion, dependency preservation, meaningful
  common-ancestor rebinding, unrelated-Scope fail-closed recovery, semantic split
  guidance, clean reconstruction, source fixtures, and the packed CLI lifecycle. This
  Finding is resolved; immutable public-release certification remains owned by the
  release Plan rather than this implementation gap.

## Finding

Skopos detects affected child Scopes and can ask whether work should be narrowed, but
the recorded decision does not consistently change the Task's actual Scope authority.

During self-hosted public-web work, `skopos-web` was declared as an application Scope
with `apps/web` as its code root. A one-path CSS Task still bound to the workspace
Scope after `narrow-scope-first` was selected. Its admission state listed both
`skopos` and `skopos-web` as affected while its portable Task Scope remained
`workspace`.

The homepage is only the observed fixture. The defect applies to any user project with
applications, services, packages, domains, infrastructure, or nested custom Scopes.

## Impact

1. the human answer can become ceremonial instead of operational
2. Task Memory may project to the wrong Memory root
3. Actions and Guards may be selected from an unnecessarily broad authority surface
4. ownership expansion can drift without a matching Scope transition
5. cross-Scope dependents and proof boundaries can disagree
6. Skopos cannot truthfully claim project- and Scope-aware execution while the mismatch
   remains

## Required Resolution

1. implement the accepted topology-aware Task Scope authority Decision
2. make explicit Scope, target path, and initial ownership produce deterministic
   narrowest-owner selection
3. make `narrow-scope-first` rebind authority or return a concrete unresolved blocker
4. recompute Memory, capabilities, dependents, Evidence, and proof identity after any
   Scope change
5. fail closed on ambiguous or unrelated multi-Scope work
6. pass the generic topology matrix through source and packed hosts

This is a public-release blocker because it affects a core product authority claim,
not an optional workflow enhancement.
