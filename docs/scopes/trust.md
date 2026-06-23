# Scope: trust

The `trust` scope owns impact analysis, closure checks, provenance, and trust reports.

## Metadata

- Doc ID: `SKOPOS-SCOPE-TRUST`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/scopes`
- Canonical: `yes`
- Last Updated: `2026-04-12`
- Review Cycle: `per workpack`
- Related Docs:
  - `../architecture/trust-and-closure-model.md`

## Changelog

- `2026-04-12`: Updated the trust scope after unresolved-question and mission-eval closure integration landed, so `trust` now emits mission-eval pressure for closure-ready work and `done` now fails directly on open blocking questions or missing eval evidence instead of treating them as external workflow discipline.
- `2026-04-12`: Updated the trust scope after `skopos eval` landed, so the remaining trust increment is no longer creating eval artifacts themselves but consuming them for stronger closure enforcement and clearer blocker reporting.
- `2026-04-11`: Updated the trust scope to reflect the accepted workflow-router contract, so the next trust increment now needs unresolved-question visibility, recommendation visibility, and eval-backed closure pressure instead of depending only on mission state and workflow freshness.
- `2026-04-11`: Updated the trust scope to reflect that git-status fallback now filters workflow-generated outputs from closure inference, and required instruction-mirror workflows no longer overmatch generic docs edits without instruction-surface evidence.
- `2026-04-11`: Updated the trust scope to reflect active-mission coverage checks, so local tracked source or workflow work without a claimed mission now warns directly in `skopos trust` and carries into `skopos done` through workspace trust.
- `2026-04-09`: Updated the trust scope to reflect declared-override provenance checks and safe impact handling for `.skopos/overrides.json`.
- `2026-04-09`: Updated the trust scope to reflect docs-router and stale-doc warnings derived from docs-health scanning in the bootstrap report.
- `2026-04-09`: Updated the trust scope to reflect typed impact graph generation and runtime-managed graph writes during impact and done flows.
- `2026-04-09`: Updated the trust scope to reflect that required workflows are now inferred during impact analysis and checked during closure for fresh successful run evidence.
- `2026-04-09`: Updated the trust scope to reflect implemented workflow-run artifacts under `.skopos/runs/` as part of the trust surface.
- `2026-04-09`: Updated the trust scope to reflect mission-based closure evidence and the distinction between immutable derived artifacts and mutable workflow artifacts.
- `2026-04-09`: Updated the trust scope to reflect that impact and closure can now consume the current git diff when explicit changed paths are not provided.
- `2026-04-09`: Updated the trust scope to reflect that it now owns impact and closure reporting in addition to workspace readiness.
- `2026-04-09`: Updated the trust scope to reflect the first working `skopos trust` readiness report.
- `2026-04-09`: Added the initial `trust` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `trust` package currently owns:

1. workspace readiness reporting
2. changed-path impact reporting
3. closure reporting for `skopos done`
4. mission-based closure evidence when mission ids are provided
5. immutable derived artifact presence and hand-edit checks
6. docs-root, docs-router, and stale-doc checks derived from docs health
7. instruction-source presence checks
8. instruction mirror parity checks
9. unresolved bootstrap assumption reporting
10. git-backed changed-path collection for impact and done
11. required workflow inference for matching changed surfaces
12. workflow run artifact freshness checks for closure
13. impact graph artifact generation
14. declared-override provenance checks and override-artifact impact handling
15. active-mission coverage checks for tracked local source and workflow changes
16. git-status fallback filtering for workflow-generated closure noise
17. unresolved workflow-question visibility from `.skopos/questions.json`
18. mission-eval pressure from `.skopos/evals/*.json`
19. direct closure failure reporting for blocking workflow questions and missing or incomplete mission eval artifacts

## Next Responsibilities

The next trust increment should also own:

1. recommendation visibility from `.skopos/recommendations.json`
2. adapter-facing and UI-facing explanation of whether closure is blocked by router state, workflow evidence, or broader trust drift
