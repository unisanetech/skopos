---
title: Release Security And Runtime Certification
status: active
owner: skopos-core
id: SKOPOS-RELEASE-SECURITY
scope: skopos
role: operation
lifecycle: durable
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-08-14
relatedDocs:
  - ../work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md
  - ../decisions/031-bundled-cli-release-contract.md
---

# Release Security And Runtime Certification

This runbook defines the fail-closed security and runtime proof required before a
public `@unisane/skopos` candidate can be approved. It does not publish, tag, or promote a
package.

## Supported Runtime

The `0.1.x` release line supports these exact runtime families:

| Runtime | Linux | macOS | Windows |
| --- | --- | --- | --- |
| Node 22 LTS, starting at 22.13.0 | Ubuntu 24.04 x64 | macOS 15 arm64 | Windows Server 2025 x64 |
| Node 24 LTS | Ubuntu 24.04 x64 | macOS 15 arm64 | Windows Server 2025 x64 |

The package engine range is `^22.13.0 || ^24.0.0`. Node 20, odd-numbered Node lines,
and operating-system versions outside this matrix are not certified for `0.1.x`.
The minimum moved from Node 22.5 to 22.13 because Node 22.12 still requires the
`--experimental-sqlite` flag for `node:sqlite`; Skopos does not require adopters to
enable an experimental runtime flag.

The CLI's direct production dependencies are exact versions for the first candidate.
Changing any of them requires a new lockfile, tarball, audit, clean install, license
report, SBOM, and runtime-matrix result.

## Required CI Evidence

The `Release security and runtime proof` workflow must pass on the exact candidate
commit. It:

1. checks out the complete Git history without retaining credentials
2. runs the release boundary and canonical lifecycle tests across all six runtime jobs
3. fails on critical or high production dependency advisories
4. builds and packs the exact `@unisane/skopos` manifest version, then installs that
   version-derived tarball in a clean project
5. scans full Git history and a physically extracted, nonempty CLI tarball with
   checksum-pinned Gitleaks 8.18.4
6. scans installed package manifests and checks the production-license report
7. independently generates a CycloneDX JSON SBOM from the installed candidate
8. uploads only the license report and SBOM, never a secret finding payload

GitHub Actions are pinned to full commit SHAs. Gitleaks is pinned by both version and
the release asset's SHA-256 checksum. Updating a tool requires reviewing the upstream
release, changing the pin and human-readable version comment together, then rerunning
the local contract and CI.

## License Policy

Dependency licenses are inspected from the clean packed installation. Empty or unknown
license data and AGPL, GPL, SSPL, BUSL, `UNLICENSED`, or `SEE LICENSE` expressions fail
the gate for human review. A failure is not an automatic legal conclusion; it prevents
release until the dependency and its actual terms are reviewed and the policy is
updated explicitly.

## Local Validation

Run:

```bash
pnpm release:security:validate
pnpm release:publish:validate
pnpm release:check
pnpm typecheck
```

The first command verifies immutable action pins, complete-history checkout, the
Gitleaks version and checksum, SBOM and license commands, the six-job matrix, the Node
engine contract, and fail-closed license-policy fixtures. It does not claim that remote
CI passed.

The publication validator separately proves the manual-only trigger, exact-tag and
`main` ancestry checks, protected-environment binding, OIDC permission, immutable
Actions, no-cache frozen build, complete proof commands, candidate digest, `next` tag,
and separation between certification, first-package bootstrap, and normal OIDC modes.
It does not publish and cannot prove that GitHub or npm external settings are correct.

## Publication Authentication Boundary

Normal package publication uses npm trusted publishing from the GitHub-hosted
`publish.yml` workflow and does not receive an npm token. npm currently requires a
package to exist before its trusted publisher can be configured, so the first-ever
`@unisane/skopos` publication uses one short-expiry granular bootstrap token inside the
manually approved `npm-release` environment. The token must be removed and revoked
immediately after the first registry verification, then the package must be switched
to the exact OIDC trust binding and traditional tokens disallowed. The complete
operator sequence lives in [the release runbook](release-runbook.md).

## Release Decision

Local validation proves the control definition only. R1 closes after the committed
candidate is pushed deliberately and the GitHub workflow returns green Evidence. A
failed secret scan must be handled without copying a secret into Task docs, logs,
issues, or chat. Revoke or rotate the credential first, preserve redacted evidence,
then decide whether history rewriting is required.

Product Interface Design is outside this workflow's mutation boundary and remains mandatory.
Its current-source paired evaluation and independent blind human adjudication are the
separate R2 gate.
