# Skopos Architecture

This is the canonical architecture baseline for Skopos itself.

## Metadata

- Doc ID: `SKOPOS-ARCH-BASELINE`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/architecture`
- Canonical: `yes`
- Last Updated: `2026-04-10`
- Review Cycle: `per workpack`
- Related Docs:
  - `package-boundaries.md`
  - `runtime-model.md`
  - `config-model.md`
  - `artifact-model.md`

## Changelog

- `2026-06-24`: Removed the repo-specific Unisane adapter from the active Skopos package model now that Skopos lives as a standalone project.
- `2026-04-10`: Updated the architecture baseline to make public-versus-internal surface classification explicit and to require config-driven workspace-ignore policy so proof and development roots do not contaminate compiled active package state.
- `2026-04-09`: Updated the architecture baseline to make subtree-targeted compilation and sliced artifacts part of the large-repo operating contract.
- `2026-04-09`: Updated the architecture baseline to make current-state and recommended-state architecture interpretation a first-class compiled artifact for brownfield repos.
- `2026-04-09`: Refined the architecture baseline around compiled project knowledge, an explicit ingest-compile-query-lint-trust loop, and a brownfield-first proof direction.
- `2026-04-09`: Updated the architecture baseline to reflect broader graph coverage for docs, commands, and cross-scope relationships in addition to workspace, mission, and impact.
- `2026-04-09`: Updated the architecture baseline to reflect that the first internal typed graph artifacts now exist for workspace, mission, and impact relationships.
- `2026-04-09`: Updated the architecture baseline to require a governed workflow extension model for project-specific scripts instead of arbitrary command guessing.
- `2026-04-09`: Updated the architecture baseline to require an internal graph backbone with selective, high-signal UI graph views instead of generic graph rendering.
- `2026-04-09`: Added the first canonical architecture baseline for Skopos before package implementation begins.

## Layer Model

1. `model`: schemas, ids, lifecycle and authority contracts
2. `config`: root config load, normalize, validate, migrate, and declare durable policy hooks
3. `indexer`: ingest raw repo signals and compile machine-readable project knowledge
4. `query`: resolve scope, symbols, commands, indexes, compact context, and filtered relationship slices
5. `planner`: build plans, missions, questions, and next-step recommendations
6. `docs-engine`: own docs generation, metadata, archive, and link discipline
7. `instructions`: own instruction mirror generation and checking
8. `trust`: own impact analysis, lint and freshness checks, done checks, trust reports, and provenance
9. `runtime`: orchestrate command use cases and registered project workflows without re-owning package logic
10. `cli`, `mcp`, `ui`: thin user and tool surfaces

## Surface Classification

1. the public SDK core is narrower than the full product workspace
2. `model`, `config`, `indexer`, `query`, `planner`, `instructions`, `trust`, and `runtime` form the core SDK family
3. `cli` and `mcp` are tool surfaces on top of that family
4. `ui` and `docs-engine` are internal product surfaces during incubation and self-hosting, not default core-SDK surfaces
5. proof, fixture, test, and generated roots support development but must not be compiled as active package scopes

## Operating Loop

1. ingest raw project signals from code, docs, configs, workflows, and diffs
2. compile them into durable project knowledge and focused generated views
3. index and log the current knowledge state so humans and agents can navigate it cheaply
4. query compiled knowledge first and reach back to raw sources only when needed
5. lint the knowledgebase for stale state, contradictions, gaps, and orphaned knowledge
6. enforce trust and closure through evidence-backed gates
7. file useful outputs back into the knowledgebase so repo understanding compounds over time

## Core Rules

1. keep Skopos core provider-agnostic and agent-agnostic
2. generated artifacts must not become hand-authored sources of truth
3. active docs and active generated routes must exclude archive material by default
4. poor project patterns should be diagnosed and contained, not normalized blindly
5. compiled project knowledge should be the default working memory, not raw broad-repo rescans
6. keep an internal typed graph backbone for relationships, but expose only filtered, high-signal graph views to humans
7. project-specific scripts must be surfaced through registered workflow manifests rather than hidden shell conventions
8. graph artifacts should be runtime-managed evidence surfaces, not hand-edited documentation
9. brownfield reliability is the primary proof target for the next phase
10. brownfield architecture must keep current-state and recommended-state views distinct so Skopos does not confuse diagnosis with prescription
11. large-repo mode should prefer explicit subtree-targeted compiled slices before broader full-workspace recompilation
12. config-driven workspace-ignore policy must keep internal, proof-only, and generated roots out of active package discovery when they are not real product scopes
13. the full repo used to build Skopos may be larger than the public SDK contract, and compiled workspace state must preserve that distinction instead of flattening everything into one package family
