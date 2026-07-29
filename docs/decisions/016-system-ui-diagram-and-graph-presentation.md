---
title: "Decision: System UI Diagram And Graph Presentation"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-016
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-04-11
lastUpdated: 2026-04-11
relatedDocs:
  - ../work/archive/P-11229565-system-ui.md
  - ../work/archive/P-37fa9180-prototype-roadmap.md
  - ../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../scopes/skopos-ui/overview.md
  - 015-system-ui-markdown-rendering-and-doc-reader-pipeline.md
  - ../architecture/artifact-model.md
---

# Decision: System UI Diagram And Graph Presentation

## Changelog

- `2026-04-11`: Added the first curated Mermaid diagrams to the overview, runtime model, and trust-and-closure docs, so the new diagram lane now has focused adoption in explanation surfaces rather than only an abstract policy.
- `2026-04-11`: Added the accepted diagram-versus-graph presentation contract, so Mermaid is now treated as a doc-owned explanatory diagram format while compiled graph artifacts remain the canonical structural relationship layer for Skopos and its graph portal.

## Context

Skopos now has two different relationship surfaces:

1. compiled graph artifacts under `.skopos/graph/*`
2. a real markdown reader for prose docs in the routed console

Those surfaces solve different problems.

Compiled graph artifacts are canonical system truth for relationship data. They exist so Skopos and coding agents can query stable structural relationships without depending on prose or hand-authored visuals.

Markdown docs solve a different problem. They exist so humans can explain architecture, workflows, failure patterns, and decisions in a readable form.

If those two lanes are mixed together, both humans and agents get worse outcomes:

1. if Mermaid becomes canonical truth, agents lose a structured graph model
2. if raw graphs become the default UI surface, humans get noisy node dumps instead of clear review surfaces
3. if diagrams are added casually inside product routes, the routed console drifts back toward graph-heavy chrome instead of calm trust and comprehension

## Decision

Skopos should treat diagrams and graphs as separate system layers.

Terminology:

1. `diagram`
   - a human-authored explanatory visual
   - usually small, curated, and narrative
   - can be rendered from fenced `mermaid` blocks in markdown docs
2. `graph`
   - a compiled structural relationship model
   - generated from canonical Skopos artifacts
   - consumed by the graph portal and any future dedicated graph views

Product contract:

1. Mermaid is allowed in prose docs, decisions, findings, and similar explanation surfaces
2. Mermaid is not the canonical source of relationship truth
3. `.skopos/graph/*` remains the canonical relationship layer for agents and system-generated graph views
4. the main routed console stays graph-light and human-first
5. deeper relationship inspection belongs in the graph portal or dedicated graph views, not the default center canvas of every route

## Surface Rules

Use diagrams when:

1. the main value is understanding relationship shape
2. the visual is small enough to remain curated
3. prose alone would be materially harder to follow

Do not use diagrams when:

1. status, trust, proof, or chronology is the real message
2. the route already has a clearer summary, table, timeline, or artifact presenter
3. the result would become a repo-wide node soup

Surface ownership:

1. main routed app:
   - summaries
   - readers
   - timelines
   - typed artifact presenters
   - curated entrypoints to deeper graph views
2. graph portal:
   - compiled relationship exploration
   - structural graph views
   - scope, docs, command, impact, and mission graph inspection
3. markdown reader:
   - explanatory diagrams from fenced `mermaid` blocks

## Authoring Contract

System-generated:

1. graph artifacts are generated and owned by Skopos workflows and projections
2. graph portal views are derived from those artifacts

Agent-authored or human-authored:

1. Mermaid diagrams may be added where the doc genuinely benefits
2. Mermaid diagrams must stay explanatory rather than canonical
3. diagrams must stay compact and curated
4. diagrams should not duplicate a dedicated compiled graph view unless the prose doc specifically needs a simplified explanation

## Current Implementation Status

The first diagram lane is now implemented:

1. the markdown reader recognizes fenced `mermaid` blocks
2. those blocks render as diagrams in docs detail instead of generic code shells
3. diagram rendering stays inside the markdown-reader lane only
4. compiled graph artifacts and the graph portal remain separate and canonical
5. the first curated authored diagrams now live in the overview, runtime-model, and trust-and-closure docs where relationship shape materially helps reading

## Consequences

Positive:

1. humans can use diagrams where they genuinely improve understanding
2. agents keep a structured graph model instead of depending on prose visuals
3. the routed app keeps its calm, review-first posture

Tradeoffs:

1. the docs reader now carries Mermaid rendering support
2. author discipline still matters; diagrams can still create noise if used carelessly
3. future in-app graph work should use dedicated graph surfaces rather than stretching Mermaid beyond explanatory docs
