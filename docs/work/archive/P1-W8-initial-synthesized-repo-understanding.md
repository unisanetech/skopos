---
title: P1-W8 Initial Synthesized Repo Understanding
status: active
owner: skopos-core
id: SKOPOS-P1-W8
scope: skopos
role: task
lifecycle: historical
authority: supporting
provenance: accepted
view: transition
lastUpdated: 2026-04-17
relatedDocs:
  - ../../overview.md
  - ../../domains/product/vision.md
  - P-37fa9180-prototype-roadmap.md
  - P-b4e43e34-prototype-implementation-checklist.md
  - ../../archive/missing-decisions-checklist.md
  - ../../decisions/027-self-healing-product-loop-and-bounded-hardening-contract.md
  - ../../decisions/028-initial-synthesized-repo-understanding-contract.md
  - ../../findings/README.md
  - ../../findings/archive/F-20260417-initial-synthesized-repo-understanding-gap.md
reviewCycle: per workpack
---

# P1-W8 Initial Synthesized Repo Understanding

Temporary execution workpack for the first brownfield onboarding slice that adds a compact synthesized understanding layer above raw bootstrap, scope, symbol, and graph artifacts.

## Changelog

- `2026-04-17`: Opened after the first messy external brownfield pilot showed that Skopos can bootstrap trust, scopes, and generated UI state cleanly but still does not produce one compact synthesized explanation of what the repo is, what its main feature areas are, and where implementation should likely start.

- Phase: `P1`
- Workpack: `P1-W8`
- Findings: `F-20260417-initial-synthesized-repo-understanding-gap`
- Scope Packs: `SP-brownfield-onboarding`, `SP-repo-understanding`
- Status: `active`

## Temporary Status And Removal Rule

- Temporary execution artifact. Archive or remove it after the understanding-layer artifacts and routed UI surface are implemented, verified, and promoted into the roadmap, checklist, and finding state.

## Candidate Scope

### Repo Summary

- generate one compact summary of:
  - repo purpose
  - detected stack
  - primary scopes
  - docs and command entrypoints
  - major uncertainties

### Feature Inventory

- group major areas or capabilities into a compact generated feature map
- attach dominant ownership paths and confidence

### Implementation Hotspots

- highlight entrypoints, high-fanout files or folders, and risky boundaries
- explain why each hotspot matters

### Routed UI Adoption

- expose the synthesized understanding layer as a first-run orientation surface
- keep raw symbols, graphs, and deeper docs as secondary drill-down surfaces

## Execution Rules

1. keep the synthesis layer compact and evidence-based
2. do not add broad generated longform docs
3. derive the new layer from existing bootstrap and projection artifacts, not a second blind scan pipeline
4. prove the slice on:
   - `skopos`
   - `/Users/bhaskarbarma/Desktop/Fiverr/examonai/examon-ai`

## Checklist

- [x] Add the finding
- [x] Add the decision contract
- [x] Link the gap into the roadmap, checklist, missing-decisions checklist, and findings registry
- [ ] Generate compact repo-summary, feature-inventory, and hotspot artifacts
- [ ] Expose the understanding layer in the routed UI
- [ ] Verify the slice on Skopos and `examon-ai`
- [ ] Archive this workpack after closure

## Verification Commands

- `pnpm build`
- `pnpm typecheck`
- `pnpm program:index:check`
