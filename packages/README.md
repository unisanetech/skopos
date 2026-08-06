# Skopos Packages

This directory contains the current Skopos package family. Package ownership and
release classification are defined by
[`docs/architecture/package-boundaries.md`](../docs/architecture/package-boundaries.md)
and [`docs/domains/engineering/package-map.md`](../docs/domains/engineering/package-map.md).

Current packages:

1. `model`
2. `config`
3. `indexer`
4. `query`
5. `planner`
6. `docs-engine`
7. `instructions`
8. `verification`
9. `runtime`
10. `cli`
11. `mcp`
12. `ui`

`verification` owns Evidence and Readiness primitives. There is no `trust` package or
compatibility alias. Add or split a package only when the canonical boundary documents
and package-manifest checks establish a distinct owner.
