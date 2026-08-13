---
title: First Public Release Scorecard
status: active
owner: skopos-release
id: SKOPOS-FIRST-PUBLIC-RELEASE-SCORECARD
scope: skopos
role: operation
lifecycle: durable
authority: canonical
provenance: accepted
view: current
lastUpdated: 2026-08-13
relatedDocs:
  - ../work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
  - ../decisions/D-20260811-product-interface-design-first-release-boundary.md
  - ../decisions/D-20260813-company-ownership-and-first-release-host-support-boundary.md
  - fresh-session-continuation-metric.md
reviewCycle: after any release-candidate source change or release-gate Evidence update
---

# First Public Release Scorecard

This is the current binary release view. `Yes` means the product behavior or accepted
release boundary is established. `No` means work or fresh immutable-candidate Evidence
is still required. A source change can turn a previously proven candidate check back
to `No` until it is rerun.

## Changelog

- `2026-08-13`: Replaced the unsupported Codex/Claude parity blocker with the accepted
  claimed-host certification boundary. Codex is the only host claimed supported for
  the first release; Claude Code, Cursor, and GitHub Copilot remain unverified and are
  not release blockers while no support claim is made.

## Product Interface Design

| Question | Yes/No | Current truth |
| --- | --- | --- |
| Deterministic selection and exact identity pass | Yes | Eight deterministic fixtures and exact accepted identity pass. |
| Authority, containment, and bounded-cost checks pass | Yes | No authority or containment regression is recorded; budgets pass. |
| Packed external installation and project binding pass | Yes | Packed portability proof exists for Skopos and an external project. |
| Material efficacy is certified | No | The exact `0.5.0` fresh smoke lost `0-1`; no full efficacy run followed. |
| Independent blind human efficacy is certified | No | It did not run for the exact identity. |
| The exact pack is publishable in `0.1.0` | Yes | Accepted release-risk boundary; no efficacy claim is permitted. |
| A broader public Skill catalog is approved | No | Catalog expansion remains outside the first-release boundary. |

Product Interface Design is therefore **publishable: yes** and **efficacy-certified:
no**. No additional efficacy work is required for the first `next` release.

## Canonical Product Gate

| # | Question | Yes/No | Current reason |
| --- | --- | --- | --- |
| 1 | Canonical vocabulary only | Yes | Current product and host contracts use the canonical Project, Scope, Task, Session, Action, Guard, Evidence, and Readiness model. |
| 2 | `.skopos/**` is disposable | Yes | Tracked Memory and Task projections reconstruct local derived state. |
| 3 | Clean clone rebuilds current Memory and capabilities | No | Earlier proof passed, but the accumulated candidate has changed and needs one fresh clean-clone run. |
| 4 | Unified setup converges docs to the standard | No | The exact final-candidate setup and documentation-convergence matrix is not yet consolidated. |
| 5 | Nested Scopes work generically | Yes | Topology-aware admission, expansion, reconstruction, and packed fixtures pass. |
| 6 | Guards decide required Evidence | Yes | Actions execute; Guards select Evidence obligations. |
| 7 | One Task owns execution | Yes | Session reservation and Task ownership are canonical. |
| 8 | Work Queue is derived and Session-aware | Yes | Queue state derives from canonical Task, dependency, and Session state. |
| 9 | Same-directory Sessions avoid unsafe overlap | Yes | Reservations, exact claims, recovery, and reviewer transitions fail closed on conflicting authority. |
| 10 | Closure proof binds to an immutable Task snapshot | Yes | High-impact closure requires and records immutable snapshots. |
| 11 | Every host claimed supported has real-host behavioral proof | Yes | Codex is the sole first-release supported host and has current real-host delivery and continuation Evidence. Claude Code, Cursor, and GitHub Copilot remain explicitly unverified projections, not support claims. |
| 12 | External-project integrations remain project-owned | Yes | Adopter-specific workflows, commands, and checks stay outside the Skopos core and release boundary. |
| 13 | Core is free of adopter-specific grammar | Yes | Project-specific integration remains outside the generic core package family. |
| 14 | Superseded decisions and prototype work are historical | Yes | Superseded sequential Decisions and completed prototype Plans live under archive routes with historical/transition metadata; the remaining active Plans are current release, convergence, and homepage work rather than prototypes. |
| 15 | Packed-install smoke passes for the exact candidate | No | Earlier packed smoke passed; the changed candidate must be frozen and rerun. |
| 16 | Full proof matrix passes for the exact candidate | No | Final immutable-candidate certification has not run. |
| 17 | North-star continuation metric is recorded | Yes | The canonical operation records the eligibility rule and a source-linked `3 / 3` real Codex baseline, explicitly limited to that cohort. |

Current canonical score: **13 yes / 4 no**.

### Gate execution boundary

The protected publication workflow divides these answers into two groups so it cannot
silently substitute candidate tests for adopter or host proof:

1. Gates `1`, `2`, `5`–`14`, and `17` must already be `Yes` in this accepted
   scorecard before candidate certification starts. Every claimed host needs real-host
   proof; generated adapters and local inference do not count.
2. Gates `3`, `4`, `15`, and `16` are candidate-bound. The protected workflow earns
   them from a fresh exact checkout through reconstruction, the unified setup matrix,
   packed-install smoke, and the complete candidate proof commands.

`pnpm release:scorecard:validate` enforces the first group.
`pnpm release:reconstruct:validate` enforces the clean-checkout portion of the second
group and refuses a checkout that already has derived `.skopos/**` state or
tracked-file drift.

## Release Workstreams

| Workstream | Yes/No | Remaining condition |
| --- | --- | --- |
| R1 — security and dependency baseline | No | Rerun on the frozen candidate commit. |
| R2 — Product Interface Design boundary | Yes | Publishable with efficacy explicitly unproven. |
| R3 — canonical product and setup closure | No | Close the four remaining `No` canonical answers: current-candidate reconstruction, setup convergence, packed smoke, and the full proof matrix. |
| R4 — public package and user contract | No | Inspect and certify the final tarball and launch-facing documentation. |
| R5 — CI and trusted publishing | No | Public repository, npm scope rights, protected environment, bootstrap, and OIDC remain external setup. |
| R6 — immutable candidate certification | No | Commit, freeze, clean-clone, run the full matrix, and bind one tarball digest. |

## Next Release Work

1. integrate and commit the accumulated work, then freeze one candidate
2. rerun unified setup, clean-clone, packed-install, security, runtime, and full proof on
   that exact commit
3. configure the public repository, npm scope, protected release environment, and
   trusted publisher
4. request explicit human publication approval for the exact commit and tarball

Real-host verification for Claude Code, Cursor, and GitHub Copilot remains later
support-expansion work. None may be described as supported until that proof exists.
