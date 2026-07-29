---
title: "Decision: Initial Synthesized Repo Understanding Contract"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-028
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-04-17
lastUpdated: 2026-04-17
relatedDocs:
  - ../overview.md
  - ../domains/product/vision.md
  - ../domains/product/positioning.md
  - ../work/archive/P-37fa9180-prototype-roadmap.md
  - ../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - 019-compiled-reference-layer-and-agent-memory-baseline.md
  - 024-token-control-compact-agent-transport-and-progressive-retrieval.md
  - archive/027-self-healing-product-loop-and-bounded-hardening-contract.md
  - ../findings/archive/F-20260417-initial-synthesized-repo-understanding-gap.md
  - ../findings/README.md
---

# Decision: Initial Synthesized Repo Understanding Contract

## Changelog

- `2026-04-17`: Added the initial synthesized repo-understanding contract so Skopos brownfield onboarding now has a compact human-meaningful understanding layer above raw bootstrap, scope, symbol, and graph artifacts instead of relying on machine-readable surfaces alone.

## Context

The recent external pilot on a messy non-Unisane repo reached `trust = high / agent-ready`, but the resulting product signal was still incomplete:

1. Skopos could explain the workspace shape, scope, command surface, and docs router.
2. Skopos could expose symbols, routes, activity, trust, and generated graph or index state.
3. Skopos still could not answer the simple human question, "What is this project and where should I look first?" without making the user inspect multiple raw artifact families.

That is a real brownfield onboarding weakness.

Raw machine-readable artifacts are necessary, but they are not sufficient for:

1. fast human review in the routed UI
2. compact prompt loading for LLM-assisted work
3. identifying the first bounded implementation target in a messy repo

If the system only emits bootstrap, scopes, symbols, graphs, and indexes, it still forces broad repo rediscovery through chat or manual UI browsing.

## Decision

Add one compact synthesized repo-understanding layer above the existing bootstrap artifacts.

This layer must summarize the repo in a token-efficient way without trying to auto-author a full human documentation set.

Skopos should generate:

1. one compact repo-understanding summary
2. one compact feature-inventory surface
3. one compact implementation-hotspots surface

This understanding layer is now part of the brownfield onboarding contract for messy repos.

## Canonical Rules

### Keep The Understanding Layer Compact

1. the understanding layer must summarize the repo; it must not become a broad generated docs tree
2. the default output should stay short enough for fast UI rendering and prompt loading
3. long explanations, historical notes, and speculative architecture prose do not belong here

### Build On Existing Artifacts Instead Of Re-Scanning Blindly

The synthesized layer must be derived from the existing bootstrap knowledge loop:

1. `.skopos/index/bootstrap.json`
2. `.skopos/index/scopes.json`
3. `.skopos/index/diagnosis.json`
4. `.skopos/index/architecture.json`
5. `.skopos/index/memory.json`
6. command, symbol, graph, and docs projections where needed

It should add synthesis, not duplicate raw inventories.

### Generate Three Compact Surfaces

#### 1. Repo Understanding Summary

Purpose:

1. explain what the repo appears to be
2. describe the main product or runtime shape
3. call out the likely primary areas for work

Required content:

1. detected stack and repo mode
2. one short summary of the repo purpose
3. main scope areas
4. main docs or knowledge entrypoints
5. main command surface
6. major uncertainties if confidence is low

Recommended artifact forms:

1. `.skopos/index/understanding/repo-summary.json`
2. optional routed-doc projection for the console UI

#### 2. Feature Inventory

Purpose:

1. help the user or agent answer "what major capabilities exist here?"
2. group routes, domains, packages, or app areas into a compact feature map

Required content:

1. feature or area title
2. source ownership or dominant path
3. brief summary
4. confidence
5. related docs if present

Recommended artifact form:

1. `.skopos/index/understanding/feature-inventory.json`

#### 3. Implementation Hotspots

Purpose:

1. show where bounded changes are most likely to matter
2. reduce broad repo wandering before implementation

Required content:

1. entrypoints
2. high-fanout or high-centrality files or folders
3. risky boundaries such as auth, billing, data, or integrations
4. hotspot reason

Recommended artifact form:

1. `.skopos/index/understanding/hotspots.json`

### Keep Confidence Explicit

1. every synthesized understanding entry should carry confidence or evidence strength
2. Skopos must not present inferred repo understanding as canonical repo truth when evidence is weak
3. low-confidence understanding should surface as uncertainty, not fake precision

### Use The Understanding Layer In Brownfield Onboarding

For messy or lightly documented repos, the initial reading path should become:

1. bootstrap
2. scopes
3. diagnosis
4. synthesized repo understanding
5. only then deep docs, symbols, or raw source exploration

This keeps onboarding token-efficient while still giving a human-meaningful starting point.

### Do Not Turn Skopos Into An Auto-Docs Writer

This decision does not authorize:

1. full generated architecture docs
2. page-by-page or feature-by-feature longform markdown authoring
3. replacing real human-maintained docs with generated prose

The understanding layer is a compact orientation surface, not a full documentation generator.

## Consequences

### Positive

1. messy brownfield onboarding becomes more understandable immediately
2. LLM-assisted work can load one compact synthesized surface before broad repo exploration
3. the routed UI can explain the repo without forcing users through raw symbols and artifact pages first

### Costs

1. Skopos now needs a synthesis step instead of only raw inventory generation
2. poor confidence handling could create misleading summaries if the synthesis layer is too aggressive
3. feature creep risk rises if this drifts into broad generated docs authoring

## Next Action

Run one bounded self-healing workpack to implement the first synthesized understanding slice:

1. generate compact summary, feature-inventory, and hotspot artifacts
2. expose them in the routed UI
3. prove the slice on Skopos and one messy external repo
