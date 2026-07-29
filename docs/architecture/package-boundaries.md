---
title: Package Boundaries
status: active
owner: skopos-core
id: SKOPOS-ARCH-PACKAGE-BOUNDARIES
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - 00-architecture.md
  - runtime-model.md
  - ../scopes/skopos-model/overview.md
reviewCycle: when owning truth changes
---

# Package Boundaries

Skopos packages must remain narrow, explicit, and free from ownership drift.

## Changelog

- `2026-07-29`: Promoted `docs-engine` into the core SDK family because generic
  adoption runtime depends on its metadata, intake, restructuring, lifecycle, and
  link contract. Kept the bundled CLI free from publish-time private workspace
  dependencies; workspace imports are build-time dependencies bundled into the CLI.

- `2026-06-27`: Added the first-release versioning rule that all packages stay version-aligned at `0.1.0` while only `@skopos/cli@0.1.0` publishes on the `next` dist tag.
- `2026-06-26`: Updated the release boundary contract so `@skopos/cli` is the first public bundled CLI candidate with Apache-2.0 license metadata while internal SDK and product packages remain private.
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
6. `docs-engine`
7. `instructions`
8. `trust`
9. `runtime`

### Tool Surfaces

1. `cli`
2. `mcp`

### Internal Product Surfaces

1. `ui`

## Manifest Contract

Every package manifest must declare:

1. `skopos.surface`
2. `skopos.releaseTarget`
3. `skopos.publishPhase`

Current release defaults are:

1. public SDK core and tool surfaces use `releaseTarget: candidate`
2. internal product surfaces use `releaseTarget: internal-only`
3. `@skopos/cli` is the first public bundled CLI candidate and must not publish with `@skopos/*` runtime dependencies
4. all non-CLI packages remain `private: true` until they receive a separate SDK/package release contract
5. public CLI package metadata must include Apache-2.0 license metadata, a package license file, a `files` whitelist, package README, binary mapping, and `publishConfig` tag/access policy
6. the first release keeps all package versions aligned at `0.1.0`
7. the first public CLI package publishes as `@skopos/cli@0.1.0` with npm dist tag `next`
8. `latest` is reserved until the registry-published `next` package passes real install smoke

The release-readiness gate must verify this metadata rather than relying on naming or memory alone.

### Non-Package Product And Internal Roots

1. `policy-packs/`
2. `stack-packs/`
3. `gate-packs/`
4. `workflow-packs/`
5. `internal/`
6. `fixtures/`
7. `tests/`
8. `docs/reference/generated/`
9. self-hosting root files and Action declarations

These support building, proving, and shipping Skopos intelligence, but they are not part of the active SDK package model and must not appear as package scopes in compiled workspace state. Pack roots are authored product sources; they become package scopes only if a future decision explicitly promotes a pack runtime into the package family.

## Boundary Rules

1. `runtime` orchestrates only
2. `cli`, `mcp`, and `ui` must stay thin
3. `model` must not depend on filesystem, git, child-process, or UI concerns
4. package-local helper dumps should be avoided; prefer feature-local policies and services
5. the minimal public SDK contract must stay smaller than the full product-incubation surface
6. `ui` may exist as an internal product surface during incubation; project-generic
   documentation governance belongs to the core SDK contract
7. proof, fixture, generated, authored pack, and internal roots must be excluded from package discovery when they are not real SDK scopes
8. public SDK core packages must not depend on `ui`
9. tool source may use internal product surfaces when needed, but the publishable CLI manifest must install as one bundled product without private Skopos workspace dependencies
10. boundary classification should be enforced by automated package-manifest checks, not by memory alone
11. release-candidate packages must be machine-readable through manifest metadata and checked through the workspace `release:check` lane
