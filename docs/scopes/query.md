# Scope: query

The `query` scope owns exact resolution, compact context assembly, and default retrieval order.

## Metadata

- Doc ID: `SKOPOS-SCOPE-QUERY`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/scopes`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `../architecture/retrieval-and-query-strategy.md`

## Changelog

- `2026-04-09`: Updated the query scope to reflect the first implemented `resolve` and `context` services backed by generated bootstrap and scope-card artifacts.
- `2026-04-09`: Added the initial `query` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `query` package currently owns:

1. loading generated query surfaces
2. exact scope resolution
3. compact context assembly
4. fallback bootstrap generation when generated artifacts are not present yet
