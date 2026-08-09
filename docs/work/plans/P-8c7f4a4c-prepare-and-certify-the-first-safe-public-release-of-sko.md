---
title: "First Public Release Preparation And Certification"
status: active
owner: "codex-release"
id: "P-8c7f4a4c"
scope: "skopos"
role: plan
lifecycle: active
authority: canonical
provenance: accepted
view: target
lastUpdated: 2026-08-10
relatedDocs:
  - P-e7e888e6-canonical-product-convergence.md
  - P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md
  - ../../decisions/031-bundled-cli-release-contract.md
  - ../../findings/F-20260804-skill-selection-proof-and-portability-gap.md
---

# First Public Release Preparation And Certification

## Changelog

- `2026-08-10`: Reconciled the Plan with remote `main` after release workflow
  `31330288352` passed security, audit, licenses, SBOM, package boundary, lifecycle,
  Ubuntu, macOS, Windows, Node 22.13, and Node 24. Package metadata, version reporting,
  public support documents, and the runtime matrix are implemented. Added a
  manual-only exact-tag publication workflow and executable contract. npm registry
  checks confirmed that `@skopos/cli` does not yet exist, the local npm client is not
  authenticated, and no visible `skopos` organization membership is available. The
  repository is still private and has no `npm-release` environment. Official npm
  behavior also requires a one-time temporary-token bootstrap before OIDC trust can be
  configured for a brand-new package. None of these facts authorize publication.
- `2026-08-09`: Completed Product Interface Design `0.3.0` smoke and full machine
  evaluation from frozen inputs. Smoke passed 1-0; the eight-case result split 4-4 and
  is `inconclusive`, despite clean validity, authority, containment, and budget proof.
  Label-safe bundles and independent human-review instructions are ready. R2 remains
  blocked because current-source material improvement is not certified and human
  adjudication is still pending.
- `2026-08-07`: Replaced the generated outline with the accepted release program,
  hard go/no-go gates, ordered Tasks, evidence requirements, release controls, and
  post-release response. Product Interface Design is required in the first release and must
  earn current-source efficacy certification; removing or disabling it is not an
  allowed shortcut.
- `2026-08-06`: Created and accepted this Plan through Skopos.

## Goal

Prepare and certify the first safe public release of `@skopos/cli@0.1.0` under the
`next` npm dist tag without publishing until every product, security, packaging,
documentation, adoption, and release-proof gate is satisfied from one immutable
committed candidate.

## Relationship To Existing Authority

This Plan owns release preparation, certification sequencing, publication controls,
and the initial post-release response. It does not replace:

1. the canonical product contract and full gate in
   `P-e7e888e6-canonical-product-convergence.md`
2. the Skill-system direction in
   `P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md`
3. the bundled first-package contract in
   `docs/decisions/031-bundled-cli-release-contract.md`
4. the open Product Interface Design proof debt in
   `docs/findings/F-20260804-skill-selection-proof-and-portability-gap.md`

Those sources remain authoritative. This Plan compiles their release-critical outcomes
into one ordered program and may close only after their relevant gates are satisfied.

## Fixed Release Contract

1. The first public package is only `@skopos/cli`.
2. The first version is `0.1.0`.
3. The first publication uses the `next` dist tag, never `latest`.
4. Internal SDK packages and `@skopos/ui` remain private.
5. Product Interface Design is included in the first release.
6. Product Interface Design must pass current-source paired efficacy proof and independent
   blind human adjudication; it cannot be removed, disabled, or described as proven
   without that Evidence.
7. No Task created from this Plan may publish, tag, promote, deprecate, or unpublish a
   package without a separate explicit human-approved release Task.
8. A changed candidate invalidates release certification and must be proved again.

## Current Baseline

Remote `main` has passed focused typecheck, test, proof, clean-clone, packed-install,
release-check, package-content, responsive, accessibility, security, audit, license,
SBOM, and the six-job supported-runtime matrix. Package metadata, installed CLI version
reporting, security/support/contribution docs, and a fail-closed release runbook exist.
This baseline is valuable but is not public-release approval, and any later source
change requires a new exact-commit run.

Current release blockers are:

1. Product Interface Design `0.3.0` ended its current-source paired run 4–4; material
   improvement and independent blind human adjudication are not certified
2. the canonical convergence Plan and release-blocking Skill Finding remain active,
   and the 17 final product questions do not yet have one release scorecard
3. the GitHub repository is private, so npm public-package provenance cannot bind to
   public source; the `npm-release` environment and its protection rules do not exist
4. the local npm client is not authenticated, `@skopos/cli` does not exist, and
   ownership or creation rights for the `@skopos` scope are not certified
5. npm cannot configure trusted publishing for a package that does not yet exist; the
   exact first release therefore needs one temporary-token GitHub bootstrap followed
   immediately by token revocation, OIDC trust configuration, and token disallowance
6. final clean-clone certification and real-registry `npx`, `npm exec`, and `pnpm dlx`
   proof must run from the unchanged approved candidate; registry proof is possible
   only after explicit publication approval

## Ordered Workstreams

### R1 — Security And Dependency Baseline

Purpose: ensure the code and bundled UI are not knowingly released with material
dependency or repository-integrity risk.

Tasks:

1. upgrade and lock production dependencies until the audit reports zero critical and
   zero high vulnerabilities
2. review remaining moderate rendering-path advisories for exploitability and either
   patch them or record explicit accepted risk
3. run secret scanning across the full Git history and final package contents
4. generate dependency-license and SBOM evidence
5. define the supported Node and operating-system matrix and prove it in CI

Exit gate:

- zero unaccepted critical or high vulnerabilities
- no known leaked secret or private adopter data
- license and SBOM review complete
- supported runtime matrix explicit and green

### R2 — Product Interface Design Efficacy

Purpose: certify the required first-release Skill on its exact shipped identity.

Tasks:

1. freeze the exact accepted pack, binding, fixtures, rubric, environment, and source
   identity
2. run the economical smoke gate
3. run isolated paired candidate-versus-control evaluation on current source
4. complete independent blind human adjudication
5. prove material targeted improvement without authority, safety, latency, token, or
   project-adaptation regression
6. rerun packed external-project portability and containment proof
7. close the active efficacy Finding only when every exit criterion has Evidence

Exit gate:

- the required Skill improves the targeted outcomes on current source
- human and machine review agree the result is safe and material
- the exact certified identity is the identity included in the release tarball

### R3 — Canonical Product And Adoption Closure

Purpose: finish the product-level promises that cannot be inferred from package smoke.

Tasks:

1. complete the Unisane replacement pilot without leaking adopter grammar into core
2. prove Codex and Claude lifecycle parity
3. complete every missing scenario in the canonical proof matrix
4. record the north-star fresh-session continuation metric
5. confirm `.skopos/**` deletion and reconstruction from tracked truth
6. close or explicitly supersede every remaining release-blocking Finding, active
   prototype authority, and contradictory current document

Exit gate:

- all 17 canonical final-release questions answer `yes` with linked Evidence
- the convergence Plan is complete or its remaining work is explicitly non-blocking by
  an accepted replacement decision

### R4 — Public Package And User Contract

Purpose: make the package understandable, supportable, inspectable, and reproducible.

Tasks:

1. complete npm metadata: repository, homepage, bugs, keywords, maintainers, license,
   engines, files, binary, exports, access, and dist tag
2. add `skopos --version` and `skopos -v` with installed-package tests
3. align the root README, package README, overview, setup, compatibility, limitations,
   and first-release notes
4. add security reporting, support expectations, contribution policy, release runbook,
   and rollback guidance
5. inspect the final tarball file-by-file and reject private paths, source checkout
   references, undeclared runtime dependencies, development noise, or secret values

Exit gate:

- a first-time user can install, understand, operate, troubleshoot, and report a
  security issue without private project knowledge
- the tarball contains only intentional public material

### R5 — CI And Trusted Publishing

Purpose: prevent a developer laptop or long-lived token from becoming release
authority.

Tasks:

1. add protected pull-request CI for build, typecheck, tests, proof, audit, packed smoke,
   and supported runtime matrix
2. retain the GitHub-hosted manual publication workflow and create its manually
   approved `npm-release` environment
3. verify npm `@skopos` ownership, package creation rights, exact repository binding,
   workflow filename, environment, allowed action, protected tags, and publisher
   permissions
4. ensure only the tagged commit can produce the published artifact
5. preserve provenance and record registry integrity after publication

Exit gate:

- no long-lived npm write token is required
- the publish workflow is protected, reproducible, least-privileged, and proven in a
  non-publishing dry run
- the first-package bootstrap uses only a short-expiry environment-scoped token, then
  removes and revokes it before normal OIDC-only publication becomes authoritative

### R6 — Immutable Candidate Certification

Purpose: bind all release claims to one clean, reviewable source identity.

Tasks:

1. review and integrate the accumulated convergence history through the chosen Git
   workflow
2. freeze one remote candidate commit with a clean working tree
3. reconstruct it in a clean clone with a frozen lockfile and no local Skopos state
4. run the complete release matrix in fail-fast order
5. build and inspect one tarball from that exact commit
6. install the tarball into fresh Node projects and exercise the complete lifecycle,
   bundled UI, Actions, coordination, Evidence, and Readiness
7. produce a release scorecard mapping every gate to immutable Evidence

Exit gate:

- all proof passes from the same commit and package digest
- no open release blocker, policy drift, Task question, stale Evidence, or unexplained
  dirty path remains

## Explicit Release Approval

Certification does not publish. After R1–R6 pass, create a separate high-impact
`project-integration` release Task that names the exact commit, version, tarball digest,
npm tag, workflow, and release notes. Publication requires explicit human approval of
that Task after the final scorecard is reviewed.

## Release-Day Sequence

1. check out the protected release tag in the trusted GitHub workflow
2. install the frozen lockfile without a release build cache
3. run the certified build, typecheck, test, proof, audit, release-check, release-smoke,
   host-parity, adoption, Skill-efficacy, responsive, and accessibility lanes
4. pack and compare the artifact identity with the reviewed manifest
5. publish `@skopos/cli@0.1.0` to `next` through OIDC
6. verify registry metadata, integrity, provenance, and dist tags
7. run real registry `npx`, `npm exec`, and `pnpm dlx` smoke in clean projects
8. exercise installed `init`, Session, Task, Action, Evidence, Readiness, and bundled UI
9. publish honest release notes and known limitations
10. close the release Task only after registry-installed proof passes

## Rollback And Incident Response

1. Never overwrite or reuse a published version.
2. For a bad candidate, remove or move the `next` tag, deprecate the affected version
   with a clear message, and publish a corrected patch.
3. Unpublish only when npm policy permits and removal is safer than deprecation.
4. For suspected compromise, stop promotion, revoke publisher trust, rotate affected
   credentials, preserve evidence, publish a security notice, and rebuild from a clean
   trusted commit.
5. A rollback or patch requires its own Task, Evidence, release notes, and registry
   verification.

## Post-Release Soak And Promotion

Keep `0.1.0` on `next` while monitoring installation, initialization, runtime crashes,
coordination safety, false closure, Skill behaviour, UI security, platform support,
documentation friction, and fresh-session continuation.

Promotion to `latest` requires a separate human-approved Task and all of the following:

1. no unresolved critical/high vulnerability or security incident
2. no data-loss, destructive, or false-closure defect
3. registry install proof remains green on the supported matrix
4. early-adopter continuation and Product Interface Design outcomes meet recorded thresholds
5. no release-blocking documentation, support, or package-metadata gap
6. rollback and patch procedures have been exercised or reviewed

## Plan Completion

This Plan completes only when:

1. R1–R6 are closed with fresh Evidence
2. the explicit release Task published and verified `@skopos/cli@0.1.0` on `next`
3. post-release monitoring ownership and escalation paths are active
4. the release result, limitations, registry identity, and next promotion decision are
   recorded in durable project Memory

Promotion to `latest` is a later decision and is not required to complete the first
`next` release.
