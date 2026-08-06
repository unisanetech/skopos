---
title: Policy Rule Detail Projection Gap
status: resolved
severity: MUST
owner: skopos-core
id: SKOPOS-F-20260804-POLICY-RULE-DETAIL-PROJECTION-GAP
scope: skopos-ui
role: finding
lifecycle: historical
authority: supporting
provenance: observed
view: transition
lastUpdated: 2026-08-04
relatedDocs:
  - ../../overview.md
  - ../../decisions/D-20260804-human-first-supervision-projection.md
  - ../../work/archive/P-20260804-human-first-ui-convergence.md
---

# Policy Rule Detail Projection Gap

## Summary

Rules had URL-backed pack pages, but individual active policy rules were expanded
inside both the Rules overview and the pack page. A developer could not link one Task,
Finding, drift result, or search result to the complete meaning and current posture of
one exact rule.

## Evidence

The live Rules review on 2026-08-04 found:

1. `/rules` expanded all active rules below pack, skill, drift, and exception content.
2. `/rules/packs/:packId` combined pack meaning, structure mapping, role decisions,
   Guard diagnostics, and every complete rule article in one long page.
3. rule rationale, examples, anti-patterns, check identifiers, drift, exceptions, pack
   Guards, and source context had no stable rule-level URL.
4. search indexed rule text only as pack keywords and could not open the matching rule.

## Impact

The UI made policy discoverable but not precisely referenceable. Developers and agents
had to scan long pages, while Task guidance and drift explanations could not hand off
one canonical rule destination.

## Resolution Criteria

1. every active rule has a stable URL under its owning pack
2. rule detail leads with requirement, rationale, applicability, examples, and
   anti-patterns before enforcement metadata
3. current drift and accepted exceptions are shown without treating missing drift as
   proof of compliance
4. rule-specific check IDs remain distinct from broader pack Guards
5. Rules and pack pages use compact linked rule summaries
6. search opens the exact rule and direct-route behavior is tested

## Resolution

Task `T-23cc1155` added `/rules/packs/:packId/rules/:ruleId`, a complete human-first
rule projection, direct links from overview and pack summaries, and individual search
entries. Rule detail separates recorded project posture, rule checks, and pack-level
Guard context so the UI does not invent verification authority.

Focused routing and projection tests, TypeScript verification, production build, and
live route inspection passed on 2026-08-04.

## Changelog

- `2026-08-04`: Resolved after individual rule routes, projections, links, and search
  indexing were implemented and verified.
- `2026-08-04`: Opened from the live Rules and pack-detail review.
