---
title: Public Release And Rollback Runbook
status: active
owner: skopos-core
id: SKOPOS-FIRST-PUBLIC-RELEASE-RUNBOOK
scope: skopos
role: operation
lifecycle: durable
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-08-15
relatedDocs:
  - ../work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md
  - ../decisions/D-20260813-company-ownership-and-first-release-host-support-boundary.md
  - release-security.md
  - ../../SECURITY.md
  - ../../SUPPORT.md
---

# Public Release And Rollback Runbook

This runbook turns the release Plan into a repeatable operator checklist. It does not
authorize publication. The immutable first release was `@unisane/skopos@0.1.0`. The
current patch candidate is `@unisane/skopos@0.1.2` under the npm `next` dist tag and
must use OIDC trusted publishing.

## Changelog

- `2026-08-15`: Superseded the protected, unpublished `v0.1.1` candidate with
  `0.1.2` after correcting the OIDC publication guard. The failed candidate tag
  remains immutable; no `0.1.1` package was published.
- `2026-08-14`: Added the `0.1.1` patch-release path. Later versions use OIDC trusted
  publishing, derive the reviewed tarball name from the public package manifest, and
  keep private internal packages unpublished.
- `2026-08-14`: Replaced the unavailable third-party `@skopos` npm namespace with the
  company-owned publisher identity `@unisane/skopos`. The executable remains `skopos`,
  and the scope creates no Unisane runtime or product coupling.
- `2026-08-13`: Required every supported runtime cell to install and exercise the same
  digest-bound candidate tarball, required the production website gate to use the
  configured HTTPS origin, and added fail-closed post-publication verification for npm
  integrity, provenance, repository, maintainers, dist tags, launchers, installed
  lifecycle, and bundled UI.
- `2026-08-13`: Required immutable external candidate receipts, one packed artifact
  reused across certification, exact-SHA security proof, and machine-readable
  reconstruction and unified-setup Evidence. Clarified that the first package uses
  the bounded bootstrap token and only later versions use OIDC.
- `2026-08-13`: Bound repository and trusted-publisher identity to
  `unisanetech/skopos` and changed the host gate to proof for every host actually
  claimed supported. The first release certifies Codex only; other host projections
  remain unverified and non-blocking.

## Hard Stop Conditions

Do not tag or publish when any of these is true:

1. Product Interface Design's accepted identity, deterministic selection, authority,
   containment, bounded-cost, packed-install, or project-binding gate is not passed,
   or a release surface claims efficacy. Material and independent human efficacy are
   explicitly unproven and are not first-`next` release blockers under the accepted
   release boundary.
2. A critical or high vulnerability, suspected secret, incompatible license, private
   adopter data, or unexplained package file remains.
3. The candidate working tree is dirty, the candidate commit is not pushed, or proof
   comes from more than one source identity.
4. A release-blocking Finding, policy drift, Task question, missing Evidence, or failed
   runtime-matrix job remains.
5. npm scope ownership, the protected GitHub environment, or the post-bootstrap OIDC
   trusted publisher has not been verified. Bootstrap mode is valid only for creating
   the already-published immutable first package and must never be reused for a patch.
6. The requested action would publish from a developer laptop or require a long-lived
   npm write token.
7. A release, package, website, or documentation surface calls a host supported
   without current real-host Evidence for the exact lifecycle capabilities claimed.

## Candidate Freeze

1. Complete R1 through R5 from the release Plan.
2. Review the complete diff and intentionally commit the convergence work.
3. Push the candidate commit and require protected CI to pass on that exact SHA.
4. Create a clean clone with no copied `.skopos/**` state.
5. Install the frozen lockfile and run the release matrix without a release build
   cache.
6. Run `pnpm release:scorecard:validate` to fail closed unless every non-candidate
   product gate is already `Yes`, including real-host proof for every host claimed
   supported. External adopter migrations are not part of Skopos release authority.
7. From the fresh checkout with no `.skopos/**` state, run
   `pnpm release:reconstruct:validate` to rebuild Project Memory and registered
   capabilities from tracked truth without changing tracked files. This check must
   invoke source `skopos setup` with the Codex host/session, preserve the configured
   canonical docs root, reject redundant archetype/docs-root questions, and prove that
   tracked setup certification still reconstructs as ready.
8. Build one tarball, record its SHA-256 digest, and use only that artifact for packed
   smoke, security inspection, publication dry-run, protected transfer, and any
   approved publication. A test that silently repacks does not certify this artifact.
9. Inspect `npm pack --json` output and every extracted file. Reject development
   scripts, workspace references, private paths, source-checkout dependencies,
   credentials, unexpected brands, or undeclared runtime assets.
10. In every supported Node and operating-system cell, download the protected candidate
   artifact, verify its SHA-256, install that exact tarball into fresh projects, and
   exercise version, help, unified setup, Session, Task, Action, Evidence, Readiness,
   storage, Product Interface Design portability, and the bundled UI. Bind every
   machine receipt to both candidate SHA and tarball SHA-256; source-only proof is not
   runtime-matrix proof. Prove
   that the removed public `adopt` command is rejected; exercise low-level `init` only
   in the reconstruction lane.
11. Preserve machine-readable clean-reconstruction and unified-setup Evidence, then
   preserve production-web Evidence and produce an external certification receipt that
   maps all 20 canonical gates and each R1–R6 gate to the candidate SHA, tarball digest,
   workflow run, and immutable evidence. Never change the tracked candidate merely to
   turn its candidate-bound scorecard rows from `No` to `Yes`.

Any source, dependency, lockfile, documentation, or package-content change after the
freeze creates a new candidate and invalidates certification.

## Approval Before Publication

After every gate is green, create a separate high-impact `project-integration` release
Task. It must name:

- candidate commit SHA
- `@unisane/skopos@0.1.2`
- `next` dist tag
- tarball SHA-256 and reviewed file manifest
- protected trusted-publishing workflow and run
- release notes and known limitations
- registry verification and rollback owner

A human must explicitly approve that exact Task. Approval of release preparation,
source licensing, a test run, or this runbook is not approval to publish.

## Trusted Release Sequence

The protected GitHub workflow is `.github/workflows/publish.yml`. It is manual-only,
accepts one exact tag, defaults to certification without publication, and refuses
dispatch from anything except `main`. Certification is non-publishing and does not use
release credentials; only the publication job enters the `npm-release` environment.
Before certification, configure the repository variable `SKOPOS_PUBLIC_SITE_URL` to
the one reviewed public HTTPS origin with no path or trailing slash. A missing,
non-HTTPS, or path-bearing value fails the independent website gate.
The production web build must also receive `SKOPOS_WEB_CANDIDATE_SHA` from its deployment
provider's exact source revision. It exposes that value with the canonical product and
repository identity at `/.well-known/skopos-release`; certification fetches the live
endpoint and fails unless its SHA equals the tagged candidate.

### One-Time First-Package Bootstrap

npm trusted publishing cannot create a brand-new package: npm requires the package to
exist before a trusted publisher can be configured. Staged publishing has the same
first-package restriction. Therefore `@unisane/skopos@0.1.0` needs one explicit
bootstrap; describing its first publication as pure OIDC would be incorrect.

After every R1–R6 gate and the exact release Task receive human approval:

1. make the GitHub repository public so npm provenance can bind the public package to
   public source
2. confirm npm account 2FA, verify the `unisane` npm organization, and confirm
   the publishing user can create public packages in that scope
3. create the GitHub `npm-release` environment before running the workflow; allow only
   the protected `main` branch because the manual workflow is dispatched from `main`
   and separately verifies the immutable release tag, require manual approval, prevent
   self-review when a second qualified reviewer exists, and disable administrator
   bypass where the repository plan permits
4. create one short-expiry granular npm token with bypass-2FA solely for the first
   package bootstrap; place it only in the protected environment as
   `NPM_BOOTSTRAP_TOKEN`
5. dispatch `publish.yml` from `main` with the approved tag and
   `mode=bootstrap-publish`
6. after registry verification, immediately delete the environment secret and revoke
   the token
7. configure the package's npm trusted publisher with GitHub owner `unisanetech`, repository
   `skopos`, workflow filename `publish.yml`, environment `npm-release`, and allowed
   action `npm publish`
8. set package publishing access to require 2FA and disallow traditional tokens

The bootstrap is not permission to weaken any product or candidate gate. It is a
one-time registry constraint handled in the same GitHub-hosted, protected, exact-tag
workflow. Every later version uses `mode=oidc-publish` and no npm token.

### Workflow Contract

The protected GitHub workflow must:

1. check out the approved tag and verify it resolves to the approved commit
2. install the frozen lockfile with no retained checkout credentials
3. run the complete certified validation matrix and require the exact tagged SHA's
   security, dependency, license, secret-scan, and SBOM job to pass; require
   `SKOPOS_PUBLIC_SITE_URL` to be one HTTPS origin, run `pnpm web:verify` with it, and
   require the live `/.well-known/skopos-release` identity to match the candidate SHA
4. rebuild and compare the package identity and file manifest with the approved
   candidate
5. publish the first package through the bounded bootstrap above, or an existing
   package through npm OIDC trusted publishing, always with `--tag next`
6. fail closed after publication unless machine verification records npm integrity,
   provenance, repository binding, maintainers, and dist tags and proves the downloaded
   registry tarball is byte-identical to the certified candidate digest
7. execute `@unisane/skopos@next` through real-registry `npx`, `npm exec`, and `pnpm dlx`
   in clean projects
8. exercise the registry-installed lifecycle and bundled UI and preserve
   `published-registry-verification.json`
9. publish honest release notes only after registry-installed proof passes

Never set `latest` during this sequence.

## Verification After Publication

Verify and record:

```bash
npm view @unisane/skopos@0.1.2 version dist.integrity dist.tarball repository --json
npm view @unisane/skopos dist-tags --json
npx @unisane/skopos@next --version
npm exec --package @unisane/skopos@next -- skopos --version
pnpm dlx @unisane/skopos@next --version
```

The expected version is `0.1.2`; `next` must point to it and `latest` must not be moved
by this candidate-publication workflow. The protected workflow runs
`pnpm release:registry:verify` after publication; it validates the same fields and
commands, compares the downloaded registry tarball to the final candidate receipt,
exercises the complete packed lifecycle, builds the installed UI, and uploads its
machine-readable Evidence. A version-only registry lookup is not sufficient.

## Rollback And Incident Response

Published versions are immutable. Never rebuild or overwrite `0.1.0`, `0.1.2`, or any
other registry version. Never move or reuse the protected, unpublished `v0.1.1`
candidate tag.

For a functional defect without known compromise:

1. stop promotion and public announcements
2. remove or move the `next` tag so new default pre-release installs stop selecting
   the affected version
3. deprecate the version with a concise impact and upgrade message when appropriate
4. open a high-impact patch Task and preserve the failing registry evidence
5. fix from a clean trusted commit, publish a new patch version, and repeat registry
   verification

For suspected compromise or leaked publishing authority:

1. stop all releases and disable the protected environment
2. revoke affected npm/GitHub trust and rotate any exposed credentials
3. preserve redacted evidence without copying secrets into Tasks, issues, or chat
4. assess repository history, workflow definitions, published provenance, and package
   contents
5. publish a security advisory and corrected patch when the facts are verified

Unpublish only when npm policy allows it and removal is safer than deprecation. Every
rollback, deprecation, unpublish, or patch requires its own human-approved Task and
registry verification.

## Soak Before `latest`

Keep `0.1.2` on `next` while monitoring install failures, initialization, data loss,
false closure, coordination safety, Product Interface Design outcomes, UI/runtime errors,
platform compatibility, and documentation friction. Promotion to `latest` is a later,
separate decision and requires a new approved Task.
