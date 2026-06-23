# F-20260413-nested-package-pilot-onboarding-gap: Nested Package Pilots Still Misread Parent Workspace Governance

## Metadata

- Doc ID: `SKOPOS-F-20260413-NESTED-PACKAGE-PILOT-ONBOARDING-GAP`
- Status: `done`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-04-13`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../architecture/runtime-model.md`
  - `../architecture/config-model.md`
  - `../project/vision.md`

## Changelog

- `2026-04-14`: Hardened the same onboarding lane again after the `unisane-ui` workspace-root pilot showed that bootstrap refresh could still forget a configured inherited docs root when a local `docs/` folder appeared later. Refresh now keeps the configured parent-relative docs root and trust resolves docs existence by absolute workspace path instead of brittle string equality.
- `2026-04-13`: Opened after the first temporary pilot on `unisane/packages/modules/identity` showed that `skopos init` still treats nested package targets too much like standalone repos, so parent `docs/` and `AGENTS.md` surfaces were missed, the target package was undercounted, and the first trust pass reported bootstrap failure even though the parent monorepo already carried canonical governance surfaces.
- `2026-04-13`: Narrowed after the nested-package scanner, trust, and instruction-mirror lanes began inheriting parent workspace `pnpm-workspace.yaml`, docs, and canonical instruction surfaces. The remaining open gaps are stale temporary pilot config reuse and richer repo-specific docs-router inheritance for monorepos whose canonical entrypoint is not `docs/00-start-here.md`.
- `2026-04-13`: Narrowed again after `skopos init` began refreshing stale bootstrap-managed nested-package config on rerun. The `modules/identity` pilot now heals its old temporary config in place and reaches `trust = medium / needs-review`; the remaining open gap is repo-specific docs-router inheritance, not broken nested-package bootstrap.
- `2026-04-13`: Closed after inherited docs-router detection began carrying repo-specific router paths like `docs/core/ssot/00-start-here.md` through bootstrap, trust, query, and config refresh. The rerun on `unisane/packages/modules/identity` no longer reports onboarding failures; only expected temporary-pilot hygiene warnings remain.
- `2026-04-13`: Finalized after bootstrap questions, diagnosis, and compact context stopped treating only a literal root-relative `AGENTS.md` as canonical. Inherited parent instruction paths like `../../../../AGENTS.md` now clear the remaining false bootstrap ambiguity in nested-package pilots.

## Summary

- Severity: `SHOULD`
- Status: `done`
- Owner: `skopos-core`
- Target Pack: `nested package pilot onboarding`
- Current State: resolved. Nested-package onboarding now inherits parent workspace governance correctly, refreshes stale bootstrap-managed config on rerun, and accepts repo-specific inherited docs routers in monorepos like Unisane.

## Symptom

1. First-time nested-package init previously reported `packageCount: 0` even when the target package clearly had a `package.json`.
2. Parent monorepo surfaces like `docs/00-start-here.md`, `AGENTS.md`, and `pnpm-workspace.yaml` were not inherited into the package-local bootstrap view.
3. Generated config and enforcement artifacts defaulted back to local `docs` and `AGENTS.md` paths even when the correct canonical surfaces lived higher in the repo.
4. The first `trust` pass then reported `bootstrap-needed` for missing docs or instructions that actually existed at the parent workspace level.
5. Earlier versions also failed to detect valid inherited docs routers when a monorepo used a non-default start-here path.
6. The last narrow bug was a literal-path assumption that only `AGENTS.md` counted as canonical, even when bootstrap had already inherited a valid parent path like `../../../../AGENTS.md`.
7. A later refresh could still regress inherited governance if the workspace gained its own local `docs/` folder after init, because the rescan path preferred discovery over the configured inherited docs root and trust compared docs roots by raw string instead of resolved workspace path.

## Impact

1. Package-level pilots look less ready than they really are.
2. Users get misleading first-run output and may distrust Skopos onboarding.
3. Temporary package pilots in large monorepos require manual cleanup or coaching instead of working as a low-friction wedge.
4. The product misses an important adoption path between full-repo install and package-local experimentation.
5. Package-level pilots in monorepos with custom docs routers could still look partially degraded even after the main bootstrap fix landed.
6. Workspace-root pilots with inherited docs governance could still look downgraded after a refresh if local generated app docs created a sibling `docs/` folder.

## Fix Plan

1. Detect when init is running inside a nested package under a parent workspace root.
2. Inherit parent workspace governance signals for bootstrap when the nested target does not define them locally.
3. Count the current package correctly while still reporting broader parent workspace package counts.
4. Write inherited docs and instruction paths into generated config and enforcement artifacts as relative paths from the nested package root.
5. Add regression coverage for nested package init plus first trust output.
6. Detect inherited docs-router paths for monorepos whose canonical entrypoint is not `docs/00-start-here.md`.
7. Accept inherited parent `AGENTS.md` paths consistently in bootstrap questions, diagnosis, trust, and compact context surfaces.
8. Keep configured inherited docs roots stable across bootstrap refresh, even when a local `docs/` folder appears later.
9. Resolve docs-root and docs-router trust checks by absolute workspace path rather than string equality.

## Verification

1. A nested package init reports the target package as present.
2. Parent docs and canonical instruction surfaces are surfaced through relative inherited paths when the package does not define local copies.
3. The generated config points to inherited canonical surfaces instead of always defaulting to local `docs` and `AGENTS.md`.
4. The first trust report stops failing purely because repo-level governance lives at the monorepo root.
5. Rerunning an old temporary pilot refreshes stale bootstrap-managed config safely.
6. Monorepo pilots with custom docs routers infer the real entrypoint without being downgraded as if the docs root were missing.
7. Nested-package pilots with inherited parent `AGENTS.md` reach `trust = high / agent-ready` once mirrors are synced and an active mission is claimed, without a false `bootstrap.instructions-source` question.
8. Pilots that intentionally inherit a parent docs root keep passing trust after bootstrap refresh even when a local `docs/` folder is later created for generated app output.

## Linked Docs

1. `registry.md`
2. `../architecture/runtime-model.md`
3. `../architecture/config-model.md`
4. `../project/vision.md`
