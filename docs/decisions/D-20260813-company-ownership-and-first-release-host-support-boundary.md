---
title: "Decision: Company Ownership And First-Release Host Support Boundary"
status: accepted
owner: skopos-release
id: D-20260813-COMPANY-OWNERSHIP-FIRST-RELEASE-HOST-SUPPORT
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-08-13
implementationStatus: implemented
lastUpdated: 2026-08-14
relatedDocs:
  - ../domains/product/positioning.md
  - ../domains/product/vision.md
  - ../architecture/public-package-content-and-provenance.md
  - ../operations/first-public-release-scorecard.md
  - ../operations/release-runbook.md
  - ../work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: before adding a supported host or changing repository ownership
---

# Decision: Company Ownership And First-Release Host Support Boundary

## Changelog

- `2026-08-14`: Bound the first public package to the company-owned npm identity
  `@unisane/skopos` after confirming the third-party `@skopos` namespace is
  unavailable. The executable and product remain `skopos` and Skopos; npm publisher
  identity creates no Unisane runtime or product coupling.
- `2026-08-13`: Completed the private repository transfer. The existing repository,
  reviewed candidate branch, package provenance, and both verified local checkouts now
  resolve to `unisanetech/skopos`; the former personal URL redirects to that repository.
- `2026-08-13`: Accepted company ownership and the Codex-first host-support boundary.

## Context

Skopos is moving from a founder-owned GitHub repository to company-owned release
governance before its first public package. That change must preserve the existing
repository history and must not turn Skopos into a Unisane application, dependency, or
project-specific integration.

The implementation also contains host-neutral instructions and generated projections
for several coding-agent hosts. A generated file, contract test, or manual prompt does
not prove that the real host delivered context or completed the claimed lifecycle.
Only the Codex path currently has real-host delivery and continuation Evidence.
Requiring unproven Claude Code parity before the first release would confuse the
long-term multi-host target with the support actually claimed at launch.

## Decision

### Repository And Product Ownership

1. The canonical repository identity is `https://github.com/unisanetech/skopos`.
2. The existing repository is transferred instead of replaced so its Git history,
   issues, pull requests, and redirect continuity are preserved.
3. `unisanetech` owns repository governance and release provenance. The product name
   remains Skopos, the executable remains `skopos`, and the public npm package is
   `@unisane/skopos` because the third-party `@skopos` namespace is unavailable.
4. Skopos remains a standalone, project-agnostic product and repository. Company
   ownership introduces no Unisane runtime dependency, product workflow, private
   registry requirement, adopter-specific Action, Guard, path, or policy into core.
5. Existing reviewed source-provenance records remain valid historical and licensing
   evidence. They do not create an ongoing product or runtime coupling.
6. Current public, support, security, contribution, package, and release sources use
   the company-owned repository identity. Historical records retain their original
   provenance where changing them would rewrite history.

The ownership cutover is complete only after the transferred remote, reviewed
candidate branch, package repository metadata, release workflow, and a fresh local
clone all resolve to the same `unisanetech/skopos` identity. This Decision does not
authorize making the repository public, publishing npm, deploying the website, or
deleting the prior local checkout.

### First-Release Host Support

The first `@unisane/skopos@0.1.0` release uses this public support matrix:

| Host | First-release status | Allowed claim |
| --- | --- | --- |
| Codex | real-host certified | Supported for the verified Codex lifecycle and delivery capabilities. |
| Claude Code | projection available; real-host verification planned | Do not claim supported, parity, or verified automation. |
| Cursor | instruction/manual projection available; real-host verification planned | Do not claim supported or verified automation. |
| GitHub Copilot | instruction/manual projection available; real-host verification planned | Do not claim supported or verified automation. |
| Other hosts | portable CLI/MCP and reviewed manual workflow where applicable | Do not claim native or automated host support. |

Every host described as supported must have current real-host Evidence for the exact
capabilities in the claim. Depending on that claim, proof covers setup, context
delivery, Task binding, continuation, child delivery, origin-reviewer continuity,
pre-compaction, completion reporting, and enforcement level. Generated configuration,
source-only contract tests, local simulation, and inferred capability are not
substitutes for real-host proof.

Claude Code, Cursor, and GitHub Copilot verification is a post-first-release support
expansion, not a blocker while those hosts are explicitly unverified and no support
claim is made. A later accepted Decision may expand the matrix only after the matching
real-host Evidence exists.

## Consequences

1. The release scorecard asks whether every **claimed** host is behaviorally certified,
   rather than requiring Codex/Claude parity that the first release does not claim.
2. The first release can pass that gate with Codex as its sole real-host-certified
   adapter, while retaining honest projections and manual fallbacks for other hosts.
3. Marketing, documentation, logos, package metadata, and release notes must expose
   status explicitly; a logo or generated adapter may not imply support.
4. Host-neutral architecture remains the product direction. This release boundary
   narrows claims, not the core model or future integration surface.
5. Repository transfer and candidate certification remain separate from publication.
