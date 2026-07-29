---
title: "Scope: query"
status: active
owner: skopos-core
id: SKOPOS-SCOPE-QUERY
scope: skopos-query
role: overview
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-28
relatedDocs:
  - ../../architecture/retrieval-and-query-strategy.md
reviewCycle: when owning truth changes
---

# Scope: query

The `query` scope owns exact resolution, compact context assembly, and default retrieval order.

## Changelog

- `2026-07-28`: Moved this overview into its canonical Scope Memory root and
  bound it to the stable Scope id.

- `2026-04-09`: Updated the query scope to reflect the first implemented `resolve` and `context` services backed by generated bootstrap and scope-card artifacts.
- `2026-04-09`: Added the initial `query` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `query` package currently owns:

1. loading generated query surfaces
2. exact scope resolution
3. compact context assembly
4. fallback bootstrap generation when generated artifacts are not present yet
