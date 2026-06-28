# Scope: cli

The `cli` scope owns the human and agent terminal surface only.

## Metadata

- Doc ID: `SKOPOS-SCOPE-CLI`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/scopes`
- Canonical: `yes`
- Last Updated: `2026-06-27`
- Review Cycle: `per workpack`
- Related Docs:
  - `../architecture/runtime-model.md`

## Changelog

- `2026-06-27`: Updated UI command wording so `skopos ui dev` is clearly the live auto-refreshing workspace console and `skopos ui serve` is clearly a static snapshot preview.
- `2026-06-27`: Updated the cli scope after moving the broad CLI e2e suite to `pnpm --filter @skopos/cli test:e2e`, so the default `pnpm test` lane remains bounded for normal mission eval while full CLI workflow coverage stays available as an explicit heavier gate.
- `2026-04-12`: Updated the cli scope after separating the heavyweight proof-phase scorecard from the default CLI `test` lane, so normal regression validation stays in `pnpm test` while the reliability scorecard remains on the dedicated `proof` lane and `quality.run-proof-phase` workflow.
- `2026-04-12`: Updated the cli scope after trust-and-done closure integration landed, so the workflow-router surface now extends through closure and `skopos done` can fail directly on open blocking workflow questions or missing mission eval artifacts.
- `2026-04-12`: Updated the cli scope to reflect the workflow-router command surface, so `skopos start`, `skopos decide`, `skopos next`, and `skopos eval` now sit alongside the existing plan-mission-trust tool lanes and evaluation can hand off to explicit mission completion instead of leaving checklist drift behind.
- `2026-04-10`: Updated the cli scope to reflect `skopos ui build`, which now emits the routed app bundle plus compiled UI state while `skopos ui render` remains the fallback snapshot path.
- `2026-04-10`: Updated the cli scope to reflect `skopos mission slice`, linked child mission creation, and actor-aware batch decomposition for self-hosted proof work.
- `2026-04-10`: Updated the cli scope to reflect that `skopos scan` now reports the refreshed diagnosis artifact path and write status in addition to actor-aware diagnosis provenance.
- `2026-04-10`: Updated the cli scope to reflect actor-aware `skopos scan`, so brownfield diagnosis output and operational-log provenance now use the same actor contract as the rest of the runtime loop.
- `2026-04-10`: Updated the cli scope to reflect actor-aware `skopos init`, `skopos trust`, and `skopos impact`, so normal lifecycle commands can expose bootstrap and validation provenance in both output and operational log entries.
- `2026-04-10`: Updated the cli scope to reflect actor-aware `skopos instructions sync --actor <id>` execution and visible instruction-sync provenance in command output.
- `2026-04-10`: Updated the cli scope to reflect actor-attributed `skopos plan --actor <id>` creation for shared plan and mission artifacts.
- `2026-04-10`: Updated the cli scope to reflect actor-attributed `skopos workflows run` execution for mutating workflows and actor-aware workflow evidence output in `done`.
- `2026-04-10`: Updated the cli scope to reflect actor-attributed `skopos overrides set` writes and explicit `--force` transfer protection for shared canonical overrides.
- `2026-04-10`: Updated the cli scope to reflect actor-aware `skopos done --mission --actor <id>` ownership checks in addition to mission claim and release commands.
- `2026-04-10`: Updated the cli scope to reflect mission claim and release commands plus actor-aware completion semantics for multi-actor mission coordination.
- `2026-04-09`: Updated the cli scope to reflect `skopos overrides show/set` for declared canonical override management.
- `2026-04-09`: Updated the cli scope to reflect that `skopos ui render` now emits a portal shell with recent activity modules for plans, missions, and workflow evidence.
- `2026-04-09`: Updated the cli scope to reflect that `skopos ui render` now generates a local portal shell plus a linked graph portal and reports trust/readiness in the result.
- `2026-04-09`: Updated the cli scope to reflect the implemented `skopos ui render` command for generating the local graph portal.
- `2026-04-09`: Updated the cli scope to reflect graph artifact paths in `init`, `plan`, `impact`, and `done` outputs.
- `2026-04-09`: Updated the cli scope to reflect that plan, impact, and done now surface workflow recommendations, requirements, and closure evidence.
- `2026-04-09`: Updated the cli scope to reflect implemented workflow listing, explanation, and execution commands for project-registered custom scripts.
- `2026-04-09`: Updated the cli scope to reflect mission inspection/completion commands and mission-aware closure checks.
- `2026-04-09`: Updated the cli scope to reflect that `skopos plan` now persists plan and mission artifacts and supports dry-run planning.
- `2026-04-09`: Updated the cli scope to reflect that `skopos scan` now surfaces diagnosis findings and remediation missions for messy repos.
- `2026-04-09`: Updated the cli scope to reflect that `impact` and `done` can now infer changed paths from the current git diff when paths are omitted.
- `2026-04-09`: Updated the cli scope to reflect that `skopos impact` and `skopos done` now exist as working closure commands.
- `2026-04-09`: Updated the cli scope to reflect that `skopos plan` now exists as a scoped planning command.
- `2026-04-09`: Updated the cli scope to reflect that `trust` now exists as a working readiness command.
- `2026-04-09`: Updated the cli scope to reflect that `resolve` and `context` now exist alongside `init`.
- `2026-04-09`: Updated the cli scope to reflect that the first implemented command surface is `skopos init`.
- `2026-04-09`: Added the initial `cli` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `cli` package currently owns:

1. `skopos init`
2. `skopos scan`
3. `skopos resolve`
4. `skopos context`
5. `skopos start`
6. `skopos next`
7. `skopos decide`
8. `skopos eval`
9. `skopos plan`
10. `skopos overrides show`
11. `skopos overrides set`
12. `skopos mission show`
13. `skopos mission claim`
14. `skopos mission release`
15. `skopos mission slice`
16. `skopos mission complete`
17. `skopos impact`
18. `skopos done`
19. `skopos trust`
20. `skopos workflows list`
21. `skopos workflows show`
22. `skopos workflows run`
23. `skopos ui render`
24. `skopos ui build`
25. `skopos ui dev`
26. `skopos ui serve`
27. JSON and human-readable command output
28. argument parsing for `mode`, `dry-run`, `force`, `scope`, `cwd`, `mission`, `actor`, `output`, `output-dir`, `reason`, and `json`
29. optional git-backed changed-path collection for `impact` and `done`
30. durable workflow-router artifact writes for `.skopos/questions.json`, `.skopos/recommendations.json`, and `.skopos/evals/*.json`
31. workflow recommendation and evidence output in `plan`, `impact`, `next`, `eval`, and `done`
32. graph artifact path reporting in runtime command output
33. portal-shell and graph-portal output reporting for `skopos ui render`
34. routed app bundle and compiled console-state output reporting for `skopos ui build`
35. live UI output reporting for `skopos ui dev` and snapshot UI output reporting for `skopos ui serve`
36. override ownership and force-transfer feedback in `skopos overrides show` and `skopos overrides set`
37. mutating workflow actor attribution and actor-aware workflow evidence feedback
38. actor-attributed plan creation feedback in `skopos plan`
39. optional actor-attributed instruction mirror sync feedback in `skopos instructions sync`
40. optional actor-attributed bootstrap, diagnosis, and validation feedback in `skopos init`, `skopos scan`, `skopos trust`, and `skopos impact`
41. linked child mission creation feedback for `skopos mission slice`, including narrowed scope, parent mission id, and optional immediate child claim
42. closure feedback that surfaces workflow-question and mission-eval evidence inside `skopos done`
43. package-level validation lane ownership, where default CLI regression coverage stays in `pnpm test`, broad CLI workflow e2e coverage stays on `pnpm --filter @skopos/cli test:e2e`, and the heavyweight proof-phase scorecard stays on `pnpm proof`
