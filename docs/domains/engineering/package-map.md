---
title: Package Map
status: active
owner: skopos-core
id: SKOPOS-PACKAGE-MAP
scope: skopos
role: domain
lifecycle: durable
authority: supporting
provenance: declared
view: current
lastUpdated: 2026-07-29
relatedDocs:
  - ../../architecture/00-architecture.md
  - ../../architecture/package-boundaries.md
reviewCycle: when package ownership changes
---

# Package Map

## Changelog

- `2026-07-29`: Aligned package ownership with the canonical first-release model.

| Package | Responsibility |
| --- | --- |
| `@skopos/model` | schemas and public contracts |
| `@skopos/config` | configuration normalization and validation |
| `@skopos/indexer` | repository discovery, manifests, graphs, semantic catalogs |
| `@skopos/query` | Scope-aware retrieval and compact context |
| `@skopos/planner` | optional Plan creation and Task recommendations |
| `@skopos/docs-engine` | metadata, lifecycle, adoption intake and proposal validation |
| `@skopos/instructions` | communication contract, mirrors, host projections |
| `@skopos/verification` | workspace identity, change scope, Evidence and Readiness primitives |
| `@skopos/runtime` | application use cases and orchestration |
| `@unisane/skopos` | command-line workspace and first public package surface |
| `@skopos/mcp` | model-context-protocol surface |
| `@skopos/ui` | internal human projection |

## Dependency Rules

1. model has no workspace-package dependencies
2. config, indexer, query, planner, docs-engine, instructions, and verification own
   focused capabilities
3. runtime composes those capabilities
4. CLI, MCP, and UI call runtime or focused read APIs
5. package code never embeds adopting-project architecture
6. `.skopos/**` projections do not become package authority
