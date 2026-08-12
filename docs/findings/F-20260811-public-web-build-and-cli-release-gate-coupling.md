---
title: Public Web Build Reliability Is Separate From CLI Release Certification
status: resolved
severity: SHOULD
owner: skopos-web
id: F-20260811-public-web-build-and-cli-release-gate-coupling
scope: skopos
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-11
relatedDocs:
  - ../work/plans/P-7dde6750-design-and-deliver-the-public-skopos-homepage.md
  - ../work/plans/P-8c7f4a4c-prepare-and-certify-the-first-safe-public-release-of-sko.md
reviewCycle: before public-web deployment or when root release scripts change
---

# Public Web Build Reliability Is Separate From CLI Release Certification

## Resolution

- `2026-08-11`: Replaced `next/font/google` with the reviewed `geist@1.7.2`
  self-hosted package. Geist Sans and Geist Mono now retain their existing CSS
  variables without any build-time Google Fonts request.
- `2026-08-11`: Switched the production build to Next.js's supported
  `next build --webpack` path. The default Turbopack build attempted to bind a local
  port while evaluating PostCSS and failed in the restricted proof environment;
  Webpack completed the same static App Router build without that environmental
  dependency.
- `2026-08-11`: Added `pnpm web:verify` as the independent web gate. In one run it
  passed route type generation and TypeScript, all 9 focused homepage tests, and the
  production build, statically prerendering `/`, `/_not-found`, and `/robots.txt`.
  Root CLI build, test, typecheck, and release smoke remain explicitly separated from
  `@skopos/web`.

The observed build-reliability gap is resolved. Hosting-provider configuration,
deployment, cache policy, domain setup, and broader website completion remain future
web work and are not CLI release Evidence.

## Finding

Adding `@skopos/web` to the workspace caused the root `@skopos/*` build, test, and
typecheck filters to treat the hosted website as part of the bundled CLI candidate.
During release proof, `pnpm build` entered the Next.js application and failed because
`next/font/google` attempted to fetch Geist and Geist Mono from Google Fonts while the
build environment had no network access.

These are two different product lifecycles:

1. `@skopos/cli` is the first npm release candidate
2. `@skopos/web` is a separately hosted public product surface

Website health should not silently block or weaken CLI publication proof, and CLI
success should not be presented as website deployment proof.

## Implemented Containment

The root SDK/CLI `build`, `test`, and `typecheck` commands now exclude `@skopos/web`.
The website retains explicit `web:build`, `web:test`, `web:typecheck`, and `web:dev`
commands. `release:smoke` therefore continues to certify the bundled CLI boundary it
actually publishes.

## Required Resolution

Before the public website is deployed from a clean or restricted build environment:

1. replace the build-time Google font fetch with reviewed self-hosted/local font
   assets
2. run typecheck, focused tests, and the production build as one web-owned deployment
   proof
3. keep website hosting, cache, accessibility, responsive, and metadata checks outside
   the CLI npm release scorecard unless an accepted release contract intentionally
   joins them

This Finding does not define broader web completion and does not create a website
architecture Decision. It records one observed build-reliability gap and the correct
release boundary.
