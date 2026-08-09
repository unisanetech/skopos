---
title: Public Package Content And Provenance
status: active
owner: skopos-core
id: SKOPOS-PUBLIC-PACKAGE-CONTENT-AND-PROVENANCE
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-09
relatedDocs:
  - 00-architecture.md
  - ../decisions/031-bundled-cli-release-contract.md
reviewCycle: before every public package release or imported-source change
---

# Public Package Content And Provenance

## Release Boundary

The first public artifact is the bundled `@skopos/cli` npm package. GitHub source and
the npm tarball are separate review surfaces:

1. the repository review covers authored source, fixtures, licenses, and provenance
2. the tarball review covers only `package.json`, `README.md`, `LICENSE`, and `dist/**`
3. clean-install proof runs the packed tarball without workspace resolution
4. a release is blocked if either surface contains private data, credentials,
   machine-specific paths, undisclosed internal brands, or code without a compatible
   public license

The public package manifest exposes the `skopos` binary and import export only.
Repository build, test, benchmark, proof, release, and UI-capture scripts are owned by
the private workspace root and must not appear in the installed package manifest.

## Product UI Craft Runtime Assets

Product UI Craft is part of the public capability and must not be removed. Its public
runtime files are fail-closed in `packages/cli/scripts/copy-skill-packs.mjs`. The
allowlist contains exactly 42 files under these roles:

1. `pack.json` for selection and authority metadata
2. `guidance/**` for selected agent context
3. `fixtures/**` for deterministic applicability checks
4. `rubrics/**` for review dimensions
5. `evaluations/core.suite.json` and `evaluations/templates/**` for explicit,
   user-invoked evaluation runs

Evaluation templates stay in the runtime package because the installed runtime reads
the suite and copies its declared project template for an evaluation. Removing those
files would leave a public command with an incomplete runtime. The templates are
synthetic test material; `.invalid` is the only permitted contact domain.

The copy step compares the complete source inventory with the reviewed allowlist and
stops if a file is added or removed. Release proof independently compares the packed
inventory with the source contract and scans the final tarball.

## UI Source Provenance

The current Skopos UI component and token baseline entered this repository in commit
`b442f0d` from the local `unisane-ui` registry. The source package manifests identify
that origin as `@unisane/ui` and declared `license: UNLICENSED`; no `LICENSE`, `NOTICE`,
or `COPYING` file was found in that source repository during the 2026-08-09 audit.

On 2026-08-09, during the public-release hardening review, the copyright owner
confirmed ownership of Unisane UI and explicitly authorized the Unisane UI source
copied into Skopos for distribution under Apache-2.0. That authorization covers the
source-installed UI implementation under `packages/ui/src/**`, its token and theme
baseline, and the corresponding compiled object code bundled into `@skopos/cli`.
Those files are distributed under the repository's root Apache-2.0 `LICENSE`.

The copied UI source is therefore certified as Apache-2.0-compatible for this release
boundary. Future imports from Unisane UI are new contributions: they require an
explicit reviewed diff and must not rely on this record to authorize unrelated files.

Technical isolation remains part of the release contract:

1. public UI source and output use Skopos-neutral names and markers
2. no private `@unisane/*` package is a runtime or package dependency
3. no Unisane registry configuration is part of the Skopos release surface
4. future imported-source changes must refresh this provenance review

## Required Proof

Before publication, the release gate must show:

1. source-surface prohibited-pattern scan
2. exact packed Skill asset inventory
3. packed prohibited-pattern and high-confidence credential scan
4. installed package manifest with no scripts and no private workspace dependencies
5. clean installation and canonical Task lifecycle proof
6. explicit Apache-2.0-compatible provenance for every copied UI file

## Changelog

- `2026-08-09`: Recorded the copyright owner's explicit Apache-2.0 authorization for
  the Unisane UI source copied into Skopos, its theme/token baseline, and corresponding
  bundled object code; the previously blocking provenance criterion is resolved.
- `2026-08-09`: Declared the separate source and npm review boundaries, retained the
  runtime-required Product UI Craft evaluation assets behind an exact allowlist,
  moved repository-only scripts out of the publishable manifest, and recorded the
  unresolved `UNLICENSED` UI-source provenance blocker.
