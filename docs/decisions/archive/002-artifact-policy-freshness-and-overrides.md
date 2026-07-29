---
title: "Decision 002: Artifact Policy, Freshness, And Overrides"
status: superseded
owner: skopos-core
id: SKOPOS-DECISION-002
scope: skopos
role: decision
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
lastUpdated: 2026-07-28
relatedDocs:
  - ../D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../README.md
  - ../../architecture/artifact-model.md
  - ../../architecture/config-model.md
  - ../../architecture/trust-and-closure-model.md
  - ../../archive/missing-decisions-checklist.md
reviewCycle: per workpack
---

# Decision 002: Artifact Policy, Freshness, And Overrides

Use this decision to keep Skopos durable, explainable, and low-drift as the compiled knowledge layer grows.

## Changelog

- `2026-07-28`: Superseded by Decision D-8d32a27b. Durable truth is tracked outside
  the fully ignored and rebuildable `.skopos/**` runtime root.

- `2026-04-10`: Updated the artifact policy decision to reflect actor attribution and explicit force-transfer semantics for durable override state, so shared canonicals cannot be silently taken over.
- `2026-04-10`: Updated the artifact policy decision to reflect that the first multi-actor model is now mission-level coordination, while mission artifacts still remain local runtime state by default.
- `2026-04-09`: Updated the decision to reflect that `.skopos/overrides.json` and `skopos overrides` are now implemented as the durable human-override path.
- `2026-04-09`: Added the artifact and override decision so Skopos can distinguish durable shared truth from local runtime noise.

## Decision

1. Durable shared truth under `.skopos/**` should be committed by default when it improves shared project understanding:
   - `.skopos/bootstrap.json`
   - `.skopos/scopes-lite.json`
   - `.skopos/diagnosis.json`
   - future `.skopos/index.json`
   - `.skopos/overrides.json`
   - `.skopos/plans/*.json`
   - future durable architecture and decision artifacts
2. Ephemeral runtime state should stay local-only by default:
   - `.skopos/runs/*.json`
   - future `.skopos/log.jsonl`
   - `.skopos/graph/impact.json`
   - `.skopos/graph/<mission-id>.json`
   - `.skopos/missions/*.json`, because mission claims and actor handoff are runtime-specific even after the first coordination model exists
3. Every generated artifact must carry freshness inputs:
   - source file or source artifact references
   - `generatedAt`
   - freshness status or equivalent invalidation inputs
4. Required artifacts must be treated as stale when their source dependencies change.
5. Human overrides should live in a checked-in machine-readable artifact:
   - `.skopos/overrides.json`
6. Declared overrides always outrank heuristic inference.
7. Mutable durable override state must record the last updating actor and reject silent takeover unless an explicit force-transfer is requested.

## Why

1. Shared project truth is only useful if teams can review and carry it in git.
2. Runtime noise should not pollute commits or create false churn.
3. Trust and closure only work when stale knowledge is visible and enforceable.
4. Overrides are necessary because inference will be wrong on real brownfield repos.
5. Multi-actor coordination should start on the smallest mutable artifact surface that matters instead of jumping straight to a global lock.
6. Durable shared truth becomes harder to trust if one actor can quietly rewrite another actor's declared canonical without any attribution or transfer signal.

## Consequences

1. Artifact policy must distinguish durable shared truth from ephemeral runtime state.
2. `done` should fail when required committed knowledge is stale.
3. Runtime and trust outputs should explain when an override influenced a conclusion.
4. The override file should be written through `skopos overrides`, not hand-managed ad hoc.
5. Mission ownership should be explicit when one actor is blocking another from mutating the same mission state.
6. Override ownership should be explicit when one actor is replacing another actor's declared canonical, and force-transfer should leave an operational log trail.
