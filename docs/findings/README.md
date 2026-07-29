---
title: Skopos Findings
status: active
owner: skopos-core
id: SKOPOS-FINDINGS-INDEX
scope: skopos
role: router
lifecycle: durable
authority: supporting
provenance: declared
view: current
lastUpdated: 2026-07-28
relatedDocs:
  - ../patterns/README.md
reviewCycle: when owning truth changes
---

# Skopos Findings

Use this folder for active structural problems, architecture concerns, and high-signal inconsistencies discovered while building Skopos.

## Changelog

- `2026-04-09`: Added the findings index so product and architecture risks can be tracked explicitly during self-hosting.
- `2026-07-28`: Removed the hand-maintained Finding registry; Skopos now derives
  indexes from individual Finding metadata.
- `2026-07-28`: Required every active Finding to declare `severity` as `MUST`,
  `SHOULD`, or `COULD` so the Work Queue can prioritize it without a second index.

## Rules

1. active findings are individual collision-resistant `F-*` documents
2. resolved findings move to `archive/`
3. findings should stay focused on high-signal structural issues rather than general to-do noise
4. Skopos compiles indexes from Finding metadata under `.skopos/index/**`; do not
   maintain a shared registry
5. active Findings declare `severity: MUST`, `severity: SHOULD`, or
   `severity: COULD` in canonical YAML frontmatter
