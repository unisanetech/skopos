# Self-Hosted Tooling Fixture Instructions

Use this fixture to model a repo that uses Skopos on itself.

## Read Order

1. `docs/00-start-here.md`
2. `docs/overview.md`
3. `docs/work/plans/P-2c91f6e0-self-hosting-proof.md`

## Rules

1. Treat packages under `packages/` as the public SDK and tool surface.
2. Treat `fixtures/`, `internal/`, and `tests/` as ignored roots.
3. Declared Actions under `tools/skopos/actions/` are the canonical project-specific maintenance surface.
