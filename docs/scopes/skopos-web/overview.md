---
title: Skopos Public Web
status: active
owner: skopos-core
id: SKOPOS-WEB-OVERVIEW
scope: skopos-web
role: overview
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-08-11
reviewCycle: when public product behavior changes
---

# Skopos Public Web

## Purpose

`apps/web` is the public Skopos product website. Its first route explains the product
through one truthful coding-agent workstream. The checked-in homepage candidate uses
the approved post-publication npm state and must not be deployed before
`@skopos/cli@0.1.0` and its linked public destinations actually exist.

## Boundaries

1. The application is a private pnpm workspace package and an independently deployable
   Next.js application.
2. It owns its public narrative, responsive compositions, assets, metadata, and
   app-local Unisane UI registry source.
3. It does not import `@skopos/ui`, read compiled local project state, or depend on the
   Skopos runtime.
4. The first release is static-first and has no authentication, database, application
   API, analytics, or deployment-provider dependency.
5. `Available on npm` is a deployment gate, not a claim about the unpublished local
   candidate. A deployment with that copy requires the public npm package, public
   repository, product-model document, and release destination to resolve first.

## Source Shape

1. `src/app` owns Next.js routes, metadata, and global styles.
2. `src/features/homepage` owns homepage copy, sections, and the product workstream.
3. `src/patterns/site` owns site-wide header, rail, footer, and section framing.
4. `src/components/ui` and related registry support source are owned by the app after
   review through the Unisane UI registry.

## Verification

Use the package-local `check-types`, `test`, and `build` scripts, then verify the wide,
intermediate, and narrow layouts in the browser. Public visual changes require
side-by-side rendered design QA against the accepted visual target.
