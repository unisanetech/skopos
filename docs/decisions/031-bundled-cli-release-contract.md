---
title: "Decision: Bundled CLI Release Contract"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-031
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-06-26
lastUpdated: 2026-08-14
relatedDocs:
  - ../architecture/package-boundaries.md
  - ../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../../packages/cli/README.md
---

# Decision: Bundled CLI Release Contract

## Changelog

- `2026-08-14`: Selected `@unisane/skopos` as the clean pre-launch public package
  identity because the third-party `@skopos` npm namespace is unavailable. The
  executable remains `skopos`; the company-owned npm scope is publisher identity only
  and introduces no Unisane runtime or product coupling.
- `2026-08-13`: Bound first-release launcher examples to the `next` dist tag so they do
  not depend on a nonexistent or unverified `latest` tag.
- `2026-08-13`: Replaced launch-facing `init` examples with the unified `setup`
  workflow, retained `init` only as a low-level reconstruction primitive, and required
  packed smoke to reject the removed public `adopt` command.
- `2026-08-03`: Extended release smoke to certify the Action effect contract from the
  packed CLI in a fresh offline-installed project: isolated JSON artifacts remain
  stable, unavailable external services prevent command execution, and undeclared
  workspace mutation fails closed.
- `2026-07-29`: Updated installed smoke proof to use canonical Session context and
  Readiness surfaces.
- `2026-07-27`: Required installed live UI to resolve the CLI-bundled app without a
  monorepo-local UI package and extended release smoke to prove both snapshot build
  and live refresh from the packed CLI.
- `2026-06-27`: Added the first-release version policy: publish the bundled CLI at `0.1.0` with the `next` dist tag while internal packages remain private and version-aligned.
- `2026-06-26`: Set the public bundled CLI release license to Apache-2.0 and required the npm package to include a license file.
- `2026-06-26`: Accepted the bundled CLI release contract so Skopos can install through `npx`, `npm exec`, and `pnpm dlx` without publishing the internal package graph.

## Context

Skopos is developed as a package family, but the first user-facing product is the CLI. A user installing Skopos should not need to understand or install internal packages like `@skopos/runtime`, `@skopos/model`, `@skopos/query`, or `@skopos/ui`.

The release audit showed that publishing a thin CLI with private `@skopos/*` runtime
dependencies breaks fresh installs. It also showed that package tarballs need a strict
file whitelist and a smoke test that runs outside the monorepo. Before launch, npm
ownership checks established that the third-party `@skopos` namespace is unavailable;
the company-owned `@unisane` scope supplies a stable publisher identity without
changing the standalone Skopos product or runtime.

## Decision

Skopos will release `@unisane/skopos` first as a bundled CLI package.

The CLI package is the only public package in the first release lane. Internal Skopos packages remain private until each receives a separate SDK release contract.

The first public CLI release version is `0.1.0` and must publish with the `next` dist tag, not `latest`.

## Rules

1. `@unisane/skopos` must install as one product package for normal users.
2. The published CLI manifest must not contain runtime dependencies on private `@skopos/*` packages.
3. Skopos-owned workspace code may stay split internally, but release packaging must bundle it into the CLI output.
4. Third-party packages that are unsafe or too large to bundle may remain normal CLI dependencies.
5. The package tarball must use a `files` whitelist and avoid source tests, `.turbo` logs, and development config noise.
6. The public CLI package must declare `license: Apache-2.0` and include the Apache-2.0 `LICENSE` file.
7. The first public CLI release must be `@unisane/skopos@0.1.0`.
8. The first public CLI release must publish with `publishConfig.tag: next`.
9. The package family should stay version-aligned at `0.1.0` for the first release while non-CLI packages remain private.
10. Do not publish `latest` until the registry-published `next` package passes real install smoke from npm.
11. The binary name is `skopos`.
12. Supported first-run commands are:
   - `npx @unisane/skopos@next setup .`
   - `npm exec --package @unisane/skopos@next -- skopos setup .`
   - `pnpm dlx @unisane/skopos@next setup .`
13. Release smoke must prove the packed CLI works from a fresh project outside the monorepo.
14. Installed `skopos ui dev` must use bundled app assets when source UI assets are
    unavailable; it must not require a separately installed internal `@skopos/ui`
    package.

## Consequences

### Positive

1. Install UX is simple for beginner and mid-level developers.
2. Users do not need to understand the internal package graph.
3. `npx`, `npm exec`, and `pnpm dlx` can use the same package.
4. Internal package boundaries can keep improving without forcing multi-package public versioning.
5. `next` gives the first real users a safe install path without implying stable `1.0` behavior.

### Tradeoffs

1. The CLI bundle can grow if too much product UI/runtime code is imported eagerly.
2. Package exports need to keep bin entrypoints separate from importable API entrypoints.
3. Some third-party dependencies still need to be external runtime dependencies when bundling would break ESM execution.
4. Pre-1.0 releases can still change behavior, so breaking changes must be documented in release notes even when semver allows them.

## Proof

The release smoke test must pack `@unisane/skopos`, install it into a fresh project,
and run:

1. installed `skopos --help`
2. installed `skopos setup . --actor <id>` and its consolidated review
3. installed `skopos session context . --json`
4. `npm exec --package <packed-cli> -- skopos setup <target>`
5. `pnpm dlx <packed-cli> setup <target>`
6. installed `skopos ui build <target>`
7. installed `skopos ui dev <target>` plus live state refresh
8. installed artifact-producing Action execution with an isolated run-owned reference
9. installed declared external capability preflight with no command execution when the
   service is unavailable
10. installed rejection of undeclared workspace mutation in a Git-backed project
11. installed rejection of the removed `skopos adopt` public command
