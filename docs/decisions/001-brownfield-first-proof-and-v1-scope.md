# Decision 001: Brownfield-First Wedge, Proof Target, And V1 Scope

Use this decision to keep Skopos focused on the adoption wedge that matters most during incubation.

## Metadata

- Doc ID: `SKOPOS-DECISION-001`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `README.md`
  - `../project/positioning.md`
  - `../project/proof-phase-plan.md`
  - `../project/missing-decisions-checklist.md`

## Changelog

- `2026-04-09`: Added the first durable product-scope decision so Skopos leads with a brownfield wedge and a realistic v1 ecosystem claim.

## Decision

1. Skopos will lead with a brownfield adoption wedge:
   - make coding agents safer and more reliable on existing repos
2. The first proof target will be three must-win workflows:
   - clean existing repo change
   - messy repo change with conflicting patterns
   - workflow-sensitive change with required custom scripts and closure requirements
3. Skopos v1 support will be explicit and narrow:
   - Node and TypeScript first
   - `package.json` repos first
   - `pnpm` first, with `npm` and `yarn` tolerated where detection is straightforward
4. Skopos will not claim broad multi-language support until a later adapter phase proves it.

## Why

1. Most real adoption pain is brownfield, not greenfield.
2. Generic coding agents are weakest when repos are inconsistent, poorly documented, or workflow-heavy.
3. A narrow v1 support lane prevents the product from sounding broader than the implementation really is.
4. A small must-win proof set is better than a large but vague roadmap.

## Consequences

1. Proof-phase work should favor brownfield fixtures over greenfield polish.
2. Product framing, evals, and demos should emphasize existing-repo stabilization.
3. Non-Node ecosystems remain explicitly out of scope for the first proof phase.
4. Future expansion should happen only after the brownfield wedge is proven.
