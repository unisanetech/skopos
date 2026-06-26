# Skopos

Skopos is a standalone local-first project intelligence and trust runtime for coding agents.

## Purpose

Skopos should help existing coding agents work on real projects with higher confidence by providing:

1. project-aware planning
2. compact queryable local knowledge
3. docs and instruction governance
4. human decision escalation
5. trust and closure proof

## Install UX

The first public release target is a bundled CLI package. Users should not need to install internal Skopos workspace packages.

```bash
npx @skopos/cli init .
pnpm dlx @skopos/cli init .
npm exec --package @skopos/cli -- skopos init .
```

The installed binary is `skopos`.

## Layout

- `docs/`: durable Skopos product knowledge
- `packages/`: Skopos package family; only `@skopos/cli` is intended as the first public bundled package
- `internal/`: archetypes, policies, prompt packs, evals, and templates
- `fixtures/`: realistic repo fixtures
- `tests/`: e2e, regression, and performance test suites

Use [00-start-here.md](/Users/bhaskarbarma/Desktop/TOP/skopos/docs/00-start-here.md) as the first read.

## License

Apache-2.0
