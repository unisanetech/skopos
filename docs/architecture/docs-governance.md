# Docs Governance

Skopos should manage docs with explicit authority, lifecycle, and archive discipline so human and agent knowledge stay useful over time.

## Metadata

- Doc ID: `SKOPOS-ARCH-DOCS-GOVERNANCE`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/architecture`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `artifact-model.md`
  - `retrieval-and-query-strategy.md`
  - `../findings/registry.md`

## Changelog

- `2026-04-09`: Added the initial docs-governance rules so active docs stay concise and archive-aware from day one.

## Rules

1. active docs must be concise, linked, and authority-labeled
2. high-churn doc families must own per-domain `archive/` folders
3. archive material must not appear in default read paths or default retrieval
4. generated docs live under `docs/generated/`
5. JSON/YAML is authoritative for machine truth; Markdown/MDX is authoritative for human explanation
6. instruction mirrors are generated artifacts, not hand-authored docs
