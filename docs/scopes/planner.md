# Scope: planner

The `planner` scope owns plan generation, mission generation, and ask-back recommendation building.

## Metadata

- Doc ID: `SKOPOS-SCOPE-PLANNER`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/scopes`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `../architecture/decision-escalation-model.md`

## Changelog

- `2026-04-09`: Updated the planner scope to reflect typed mission graph generation from plan, mission, decision, command, and workflow relationships.
- `2026-04-09`: Updated the planner scope to reflect that plans now recommend matching registered workflows and persist those recommendations into mission artifacts.
- `2026-04-09`: Updated the planner scope to reflect that it now persists generated plan and mission artifacts for later execution.
- `2026-04-09`: Updated the planner scope to reflect that it now builds scoped implementation plans from goal text, compact context, and decision heuristics.
- `2026-04-09`: Added the initial `planner` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `planner` package currently owns:

1. bootstrap question generation
2. scoped plan generation from goal text
3. persisted plan artifact generation
4. persisted mission artifact generation
5. decision ask-back heuristics for plan-time human questions
6. canonical validation command recommendation for planned work
7. workflow recommendation for matching scopes and goals
8. mission graph artifact generation
