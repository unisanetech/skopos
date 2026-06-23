# Self-Hosted Tooling Fixture Instructions

Use this fixture to model a repo that uses Skopos on itself.

## Read Order

1. `docs/00-start-here.md`
2. `docs/project/proof-phase-plan.md`

## Rules

1. Treat packages under `packages/` as the public SDK and tool surface.
2. Treat `fixtures/`, `internal/`, `tests/`, and `docs/generated/` as ignored roots.
3. Registered workflows under `tools/skopos/workflows/` are the canonical project-specific maintenance surface.
