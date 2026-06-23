# Package Boundaries

Skopos packages must remain narrow, explicit, and free from ownership drift.

## Metadata

- Doc ID: `SKOPOS-ARCH-PACKAGE-BOUNDARIES`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/architecture`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per workpack`
- Related Docs:
  - `00-architecture.md`
  - `runtime-model.md`
  - `../scopes/model.md`

## Changelog

- `2026-06-24`: Classified authored policy, stack, gate, and workflow pack roots as non-package product source roots so built-in intelligence packs do not leak into SDK package discovery.
- `2026-06-24`: Removed the repo-specific Unisane adapter package from the active package family after moving Skopos to its standalone workspace.
- `2026-04-10`: Updated the package-boundary contract to require machine-readable package surface metadata and a release-readiness check while all Skopos packages remain private during incubation.
- `2026-04-10`: Updated the package-boundary contract to reflect automated dependency checks that keep public SDK core packages free from internal product surfaces and repo-specific adapters.
- `2026-04-10`: Updated the package-boundary contract to classify public SDK, tool surfaces, and internal-only product surfaces explicitly, and to require `workspace.ignore` for non-product roots during self-hosting.
- `2026-04-09`: Added the initial package ownership map and import-boundary rules for the Skopos package family.

## Planned Package Family

1. `model`
2. `config`
3. `indexer`
4. `query`
5. `planner`
6. `docs-engine`
7. `instructions`
8. `trust`
9. `runtime`
10. `cli`
11. `mcp`
12. `ui`

## Surface Classification

### Public SDK Core

1. `model`
2. `config`
3. `indexer`
4. `query`
5. `planner`
6. `instructions`
7. `trust`
8. `runtime`

### Tool Surfaces

1. `cli`
2. `mcp`

### Internal Product Surfaces

1. `ui`
2. `docs-engine`

## Manifest Contract

Every package manifest must declare:

1. `skopos.surface`
2. `skopos.releaseTarget`
3. `skopos.publishPhase`

Current incubation defaults are:

1. public SDK core and tool surfaces use `releaseTarget: candidate`
2. internal product surfaces use `releaseTarget: internal-only`
3. all packages remain `private: true` until release hardening explicitly changes that contract

The release-readiness gate must verify this metadata rather than relying on naming or memory alone.

### Non-Package Product And Internal Roots

1. `policy-packs/`
2. `stack-packs/`
3. `gate-packs/`
4. `workflow-packs/`
5. `internal/`
6. `fixtures/`
7. `tests/`
8. `docs/generated/`
9. self-hosting root files and workflow manifests

These support building, proving, and shipping Skopos intelligence, but they are not part of the active SDK package model and must not appear as package scopes in compiled workspace state. Pack roots are authored product sources; they become package scopes only if a future decision explicitly promotes a pack runtime into the package family.

## Boundary Rules

1. `runtime` orchestrates only
2. `cli`, `mcp`, and `ui` must stay thin
3. `model` must not depend on filesystem, git, child-process, or UI concerns
4. package-local helper dumps should be avoided; prefer feature-local policies and services
5. the minimal public SDK contract must stay smaller than the full product-incubation surface
6. `ui` and `docs-engine` may exist as product surfaces during incubation, but they are not the core SDK contract by default
7. proof, fixture, generated, authored pack, and internal roots must be excluded from package discovery when they are not real SDK scopes
8. public SDK core packages must not depend on `ui` or `docs-engine`
9. tool surfaces may depend on internal product surfaces when needed, but that must not back-propagate into the public SDK core graph
10. boundary classification should be enforced by automated package-manifest checks, not by memory alone
11. release-candidate packages must be machine-readable through manifest metadata and checked through the workspace `release:check` lane
