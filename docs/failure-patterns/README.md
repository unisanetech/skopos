# Skopos Failure Patterns

Record repeated wrong moves, retrieval mistakes, drift failures, and governance mistakes here so Skopos can improve itself over time.

## Metadata

- Doc ID: `SKOPOS-FAILURE-PATTERNS-INDEX`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/failure-patterns`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `../findings/README.md`
  - `../architecture/retrieval-and-query-strategy.md`
  - `../architecture/trust-and-closure-model.md`

## Changelog

- `2026-04-09`: Added the failure-pattern index so repeatable mistakes can become durable improvement memory.

## Rules

1. keep entries concise and diagnostic
2. archive patterns that are no longer relevant after durable fixes land
3. each entry should explain what went wrong, why it was risky, and what rule or system change reduced recurrence
