# Docs Governance

Skopos should manage docs with explicit authority, lifecycle, and archive discipline so human and agent knowledge stay useful over time.

## Metadata

- Doc ID: `SKOPOS-ARCH-DOCS-GOVERNANCE`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/architecture`
- Canonical: `yes`
- Last Updated: `2026-07-25`
- Review Cycle: `per workpack`
- Related Docs:
  - `artifact-model.md`
  - `retrieval-and-query-strategy.md`
  - `../findings/registry.md`

## Changelog

- `2026-07-25`: Added role-first docs adoption, the recommended agent-native docs tree,
  authority/provenance requirements, negative knowledge, and the rule that existing
  brownfield projects may map strong docs without path conformity.

- `2026-04-09`: Added the initial docs-governance rules so active docs stay concise and archive-aware from day one.

## Rules

1. active docs must be concise, linked, and authority-labeled
2. high-churn doc families must own per-domain `archive/` folders
3. archive material must not appear in default read paths or default retrieval
4. generated docs live under `docs/generated/`
5. JSON/YAML is authoritative for machine truth; Markdown/MDX is authoritative for human explanation
6. instruction mirrors are generated artifacts, not hand-authored docs
7. docs authority is role-first: project purpose, architecture, domains, workflows,
   validation, decisions, findings, active work, and agent instructions must be
   resolvable even when local paths differ
8. new and clean-refactor projects should use the recommended Skopos tree; brownfield
   projects may map strong existing docs before any reorganization is proposed
9. inferred or proposed docs do not become canonical without project evidence or
   explicit acceptance
10. durable docs should preserve relevant negative knowledge such as retired patterns,
    rejected approaches, known failure modes, and temporary exceptions with removal
    conditions

## Recommended Docs Tree

```text
docs/
├── 00-start-here.md
├── overview/
├── architecture/
├── guides/
├── decisions/
├── findings/
├── work/
│   ├── plans/
│   ├── execution/
│   └── archive/
├── domains/
├── reference/
│   └── generated/
└── archive/
```

The tree is a strong default, not a universal validity test. Memory-role mapping remains
the canonical portability mechanism.
