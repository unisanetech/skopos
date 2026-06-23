# Skopos Positioning

Skopos is project intelligence and trust infrastructure for coding agents.

## Metadata

- Doc ID: `SKOPOS-PROJECT-POSITIONING`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `vision.md`
  - `../architecture/runtime-model.md`

## Changelog

- `2026-04-12`: Added the workflow-weight discipline to the positioning doc, so Skopos now states explicitly that it should not become a ceremony-heavy process layer while expanding its control plane.
- `2026-04-09`: Added the explicit v1 support lane so Skopos does not claim more ecosystem breadth than the current implementation supports.
- `2026-04-09`: Refined the positioning around a compiled project knowledgebase, brownfield repo stabilization, and trust-backed agent execution.
- `2026-04-09`: Added category and product-boundary positioning so Skopos stays distinct from hosted coding agents and generic AI documentation tools.

## Category

Skopos belongs in developer tooling, but specifically as:

1. a local project intelligence runtime
2. a compiled project knowledgebase for coding agents
3. an agent workflow governance layer
4. a repo-native trust system

## Primary Wedge

Skopos should lead with one clear adoption wedge:

1. make coding agents safer and more reliable on existing repos, especially inconsistent brownfield repos

## V1 Support Lane

Skopos v1 should explicitly support:

1. Node and TypeScript first
2. `package.json` repos first
3. `pnpm` first, with `npm` and `yarn` tolerated where detection is straightforward

Skopos v1 should not claim broad multi-language support yet.

## Target User

Primary user:

1. developers and technical founders already using coding agents on real existing repos

Secondary user:

1. teams that need safer and more repeatable agent-driven work on shared repos

## Fit Discipline

1. strongest fit today is agent-heavy brownfield Node and TypeScript repos
2. fit for other project shapes is conditional, not universal
3. Skopos should only widen its control plane when the added surface removes more supervision than it adds process weight

## Non-Goals

1. replace the user’s preferred coding tool
2. own model inference
3. become a full PM or docs SaaS
4. force cloud dependency for core value
5. become a generic personal wiki with no repo-governance or trust runtime
6. become a workflow-ceremony layer that costs more to operate than the supervision it removes
