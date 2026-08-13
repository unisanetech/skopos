---
title: Locally Owned UI Source And Visual Authority
status: accepted
owner: skopos-core
id: SKOPOS-D-20260812-LOCALLY-OWNED-UI-SOURCE-AND-VISUAL-AUTHORITY
scope: skopos-ui
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-08-12
implementationStatus: implemented
lastUpdated: 2026-08-12
relatedDocs:
  - ../architecture/00-architecture.md
  - ../overview.md
  - D-20260804-human-first-supervision-projection.md
  - D-20260804-browser-history-and-unisane-ui-registry-delivery.md
  - D-20260804-unisane-ui-visual-ownership.md
  - ../../../architecture/public-package-content-and-provenance.md
---

# Locally Owned UI Source And Visual Authority

## Context

Skopos adopted useful UI primitives from an external source during incubation. The
source was copied into this repository, sanitized for public distribution, and made
independent of private workspace packages. Earlier Decisions recorded that adoption
accurately, but their wording left the external adopter looking like a continuing
product and visual authority.

Skopos is a separate product. Its current UI must have one local owner and must not
depend on another product's registry, package graph, naming, release process, or design
authority.

## Decision

1. `@skopos/ui` owns its reviewed component source, semantic theme, accessibility
   behavior, application shell, and reusable visual defaults.
2. The public web app independently owns its reviewed primitives, theme, brand assets,
   and registry metadata under `apps/web`.
3. Skopos uses no private external workspace package or registry command at runtime,
   build time, or release time.
4. Component and theme changes are ordinary reviewed Skopos source changes. No
   external product controls upgrades or visual direction.
5. Historical origin and license attribution remain in archived Decisions, provenance
   records, package metadata, and `NOTICE`; those records do not create current product
   authority or a dependency.
6. Product-specific integrations remain outside the Skopos core package family and
   contribute context, Actions, and Guards without becoming Skopos workflow authority.

## Consequences

1. current docs and runtime symbols use Skopos-owned or generic names
2. public release gates test independence and provenance, not one adopter's migration
3. archived adoption records remain factual and auditable
4. future UI work can evolve locally without coordinating with an external product

## Rejected Alternatives

### Erase the source history

Rejected because provenance and license history are material facts.

### Keep the external registry as the visual authority

Rejected because copied source with independent release ownership must not retain an
external product identity or upgrade authority.

## Changelog

- `2026-08-12`: Superseded adopter-specific UI delivery and visual-ownership wording
  with one locally owned Skopos authority while preserving the original records as
  historical provenance.
