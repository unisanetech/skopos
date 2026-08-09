---
title: First Public Release And Rollback Runbook
status: active
owner: skopos-core
id: SKOPOS-FIRST-PUBLIC-RELEASE-RUNBOOK
scope: skopos
role: operation
lifecycle: durable
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-08-10
relatedDocs:
  - ../work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md
  - release-security.md
  - ../../SECURITY.md
  - ../../SUPPORT.md
---

# First Public Release And Rollback Runbook

This runbook turns the release Plan into a repeatable operator checklist. It does not
authorize publication. The first release is only `@skopos/cli@0.1.0` under the npm
`next` dist tag.

## Hard Stop Conditions

Do not tag or publish when any of these is true:

1. Product Interface Design's current-source efficacy and independent blind-review gate is not
   passed.
2. A critical or high vulnerability, suspected secret, incompatible license, private
   adopter data, or unexplained package file remains.
3. The candidate working tree is dirty, the candidate commit is not pushed, or proof
   comes from more than one source identity.
4. A release-blocking Finding, policy drift, Task question, missing Evidence, or failed
   runtime-matrix job remains.
5. npm scope ownership, protected GitHub environment, or OIDC trusted publishing has
   not been verified.
6. The requested action would publish from a developer laptop or require a long-lived
   npm write token.

## Candidate Freeze

1. Complete R1 through R5 from the release Plan.
2. Review the complete diff and intentionally commit the convergence work.
3. Push the candidate commit and require protected CI to pass on that exact SHA.
4. Create a clean clone with no copied `.skopos/**` state.
5. Install the frozen lockfile and run the release matrix without a release build
   cache.
6. Build one tarball, record its SHA-256 digest, and use only that artifact for the
   remaining certification.
7. Inspect `npm pack --json` output and every extracted file. Reject development
   scripts, workspace references, private paths, source-checkout dependencies,
   credentials, unexpected brands, or undeclared runtime assets.
8. Install that tarball into fresh projects on the supported Node and operating-system
   matrix and exercise version, help, init, Session, Task, Action, Evidence, Readiness,
   storage, Product Interface Design portability, and the bundled UI.
9. Produce a scorecard that maps each R1–R6 gate to the candidate SHA, tarball digest,
   workflow run, and immutable evidence.

Any source, dependency, lockfile, documentation, or package-content change after the
freeze creates a new candidate and invalidates certification.

## Approval Before Publication

After every gate is green, create a separate high-impact `project-integration` release
Task. It must name:

- candidate commit SHA
- `@skopos/cli@0.1.0`
- `next` dist tag
- tarball SHA-256 and reviewed file manifest
- protected trusted-publishing workflow and run
- release notes and known limitations
- registry verification and rollback owner

A human must explicitly approve that exact Task. Approval of release preparation,
source licensing, a test run, or this runbook is not approval to publish.

## Trusted Release Sequence

The protected GitHub workflow is `.github/workflows/publish.yml`. It is manual-only,
accepts one exact tag, defaults to certification without publication, refuses dispatch
from anything except `main`, and always uses the `npm-release` environment.

### One-Time First-Package Bootstrap

npm trusted publishing cannot create a brand-new package: npm requires the package to
exist before a trusted publisher can be configured. Staged publishing has the same
first-package restriction. Therefore `@skopos/cli@0.1.0` needs one explicit bootstrap;
describing its first publication as pure OIDC would be incorrect.

After every R1–R6 gate and the exact release Task receive human approval:

1. make the GitHub repository public so npm provenance can bind the public package to
   public source
2. confirm npm account 2FA, create or verify the `skopos` npm organization, and confirm
   the publishing user can create public packages in that scope
3. create the GitHub `npm-release` environment before running the workflow; restrict it
   to release tags, require manual approval, prevent self-review when a second qualified
   reviewer exists, and disable administrator bypass where the repository plan permits
4. create one short-expiry granular npm token with bypass-2FA solely for the first
   package bootstrap; place it only in the protected environment as
   `NPM_BOOTSTRAP_TOKEN`
5. dispatch `publish.yml` from `main` with the approved tag and
   `mode=bootstrap-publish`
6. after registry verification, immediately delete the environment secret and revoke
   the token
7. configure the package's npm trusted publisher with GitHub owner `Croodo`, repository
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
3. run the complete certified validation matrix
4. rebuild and compare the package identity and file manifest with the approved
   candidate
5. publish the first package through the bounded bootstrap above, or an existing
   package through npm OIDC trusted publishing, always with `--tag next`
6. record npm integrity, provenance, repository binding, maintainers, and dist tags
7. install `@skopos/cli@next` through real-registry `npx`, `npm exec`, and `pnpm dlx`
   in clean projects
8. exercise the installed lifecycle and bundled UI
9. publish honest release notes only after registry-installed proof passes

Never set `latest` during this sequence.

## Verification After Publication

Verify and record:

```bash
npm view @skopos/cli@0.1.0 version dist.integrity dist.tarball repository --json
npm view @skopos/cli dist-tags --json
npx @skopos/cli@next --version
npm exec --package @skopos/cli@next -- skopos --version
pnpm dlx @skopos/cli@next --version
```

The expected version is `0.1.0`; `next` must point to it and `latest` must not be
created or moved by this release.

## Rollback And Incident Response

Published versions are immutable. Never rebuild and overwrite `0.1.0`.

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

Keep `0.1.0` on `next` while monitoring install failures, initialization, data loss,
false closure, coordination safety, Product Interface Design outcomes, UI/runtime errors,
platform compatibility, and documentation friction. Promotion to `latest` is a later,
separate decision and requires a new approved Task.
