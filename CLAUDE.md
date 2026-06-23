<!-- Generated from AGENTS.md for CLAUDE.md. Do not edit directly. -->
# Skopos Self-Hosting Rules

This file is the canonical instruction source for the standalone Skopos workspace.

## Read Order

1. `docs/00-start-here.md`
2. `docs/project/proof-phase-plan.md`
3. `docs/project/implementation-checklist.md`
4. `docs/architecture/runtime-model.md`
5. `docs/architecture/config-model.md`
6. `docs/architecture/artifact-model.md`

## Standalone Governance

1. Treat this repository root as the Skopos project root.
2. Run Skopos commands from this root unless a task explicitly targets another project.
3. Keep project-specific integrations outside the Skopos core package family.

## Core Rules

1. Keep Skopos core generic and project-agnostic.
2. Do not hand-edit generated instruction mirrors or runtime-managed `.skopos/**` derived artifacts.
3. During the current proof phase, prioritize brownfield reliability, closure quality, and self-hosting friction discovery over new UI or graph surface expansion.
4. If `AGENTS.md` changes, regenerate mirrors with `pnpm instructions:sync`.

## Canonical Command Surface

1. `pnpm typecheck`
2. `pnpm test`
3. `pnpm proof`
4. `pnpm instructions:sync`
5. `pnpm skopos:init`
6. `pnpm skopos:trust`
7. `pnpm skopos:ui`
