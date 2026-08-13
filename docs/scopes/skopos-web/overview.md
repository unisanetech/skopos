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
lastUpdated: 2026-08-13
reviewCycle: when public product behavior changes
---

# Skopos Public Web

## Purpose

`apps/web` is the public Skopos product website. Its first route explains the product
through one truthful coding-agent workstream. The checked-in homepage candidate names
`@unisane/skopos@next` as the planned first-release channel without claiming that the
package is already published.

## Changelog

- `2026-08-13`: Made the pre-release npm state explicit, required a configured HTTPS
  site origin for production metadata, and made documentation fragments resolve to
  stable focusable destinations.

## Boundaries

1. The application is a private pnpm workspace package and an independently deployable
   Next.js application.
2. It owns its public narrative, responsive compositions, assets, metadata, and
   reviewed app-owned UI source.
3. It does not import `@skopos/ui`, read compiled local project state, or depend on the
   Skopos runtime.
4. The first release is static-first and has no authentication, database, application
   API, analytics, or deployment-provider dependency.
5. Pre-release surfaces may describe `@unisane/skopos@next` only as the planned first
   release. They must not say the package is available until registry verification
   passes.
6. Production builds require `NEXT_PUBLIC_SITE_URL` to contain the deployed HTTPS
   origin. Missing or insecure production configuration fails the build so canonical,
   Open Graph, robots, and sitemap URLs cannot silently point at localhost.

## Source Shape

1. `src/app` owns Next.js routes, metadata, and global styles.
2. `src/features/homepage` owns homepage copy, sections, and the product workstream.
3. `src/patterns/site` owns site-wide header, rail, footer, and section framing.
4. `src/components/ui` and related support source are reviewed and owned by the app.

## Verification

Use the package-local `check-types`, `test`, and `build` scripts, then verify the wide,
intermediate, and narrow layouts in the browser. Public visual changes require
side-by-side rendered design QA against the accepted visual target.

Production build verification must provide an explicit review origin, for example:

```bash
NEXT_PUBLIC_SITE_URL=https://skopos.example pnpm --filter @skopos/web build
```

Deployment replaces the example origin with the real public HTTPS origin. The example
must never be treated as a deployable default.
