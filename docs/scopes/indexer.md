# Scope: indexer

The `indexer` scope owns repo scanning, pattern detection, scope inference, and generated machine-readable project knowledge.

## Metadata

- Doc ID: `SKOPOS-SCOPE-INDEXER`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/scopes`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `../architecture/retrieval-and-query-strategy.md`

## Changelog

- `2026-04-09`: Updated the indexer scope to reflect declared canonical override loading and docs-root/archetype correction during scan/bootstrap flows.
- `2026-04-09`: Updated the indexer scope to reflect docs-health scanning for canonical start-here routing and stale tracked docs metadata.
- `2026-04-09`: Updated the indexer scope to reflect subtree-targeted repo scanning and sliced artifact generation for large workspaces.
- `2026-04-09`: Updated the indexer scope to reflect compiled current-state versus recommended-state architecture reporting under `.skopos/architecture.json`.
- `2026-04-09`: Updated the indexer scope to reflect broader graph generation for docs, commands, and cross-scope package relations.
- `2026-04-09`: Updated the indexer scope to reflect that it now builds the workspace graph artifact from scopes, commands, and registered workflows.
- `2026-04-09`: Updated the indexer scope to reflect project-workflow manifest discovery under `tools/skopos/workflows/*.yaml`.
- `2026-04-09`: Updated the indexer scope to reflect that it now produces repo diagnosis and remediation reports in addition to bootstrap and scope-lite artifacts.
- `2026-04-09`: Added the initial `indexer` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `indexer` package currently owns:

1. repo scanning for bootstrap signals
2. archetype and repo-mode inference
3. canonical command, docs-root, docs-health, and instruction-source detection
4. compact scope-lite artifact generation
5. diagnosis reporting for conflicting and poor patterns
6. remediation mission suggestions derived from diagnosis findings
7. architecture interpretation with distinct current and recommended views
8. project workflow manifest discovery and validation
9. workspace graph artifact generation
10. docs graph artifact generation
11. commands graph artifact generation
12. scope-relations graph artifact generation
13. subtree-targeted slice compilation for large-repo bootstrap and scan flows
14. stale-docs and weak canonical docs-router detection for brownfield trust and diagnosis
15. declared override loading from `.skopos/overrides.json` so human canonicals can outrank wrong inference
