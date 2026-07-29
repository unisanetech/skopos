---
title: "Decision: System UI Markdown Rendering And Doc Reader Pipeline"
status: accepted
owner: skopos-core
id: SKOPOS-DECISION-015
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
date: 2026-04-11
relatedDocs:
  - ../work/archive/P-11229565-system-ui.md
  - ../work/archive/P-37fa9180-prototype-roadmap.md
  - ../work/archive/P-b4e43e34-prototype-implementation-checklist.md
  - ../scopes/skopos-ui/overview.md
  - 009-system-ui-app-shell-and-layout-doctrine.md
  - 010-system-ui-information-hierarchy-and-signal-placement.md
  - 014-system-ui-component-architecture-and-layout-normalization.md
  - 016-system-ui-diagram-and-graph-presentation.md
---

# Decision: System UI Markdown Rendering And Doc Reader Pipeline

## Changelog

- `2026-04-11`: Updated the decision to reflect doc-owned Mermaid diagram rendering in the markdown reader, so explanatory diagrams can render inline in prose docs while compiled graph artifacts remain a separate canonical system layer.
- `2026-04-11`: Updated the decision to reflect typed JSON artifact pages for canonical docs surfaces, so known `.skopos/*.json` files now render through schema-aware artifact presenters with raw JSON demoted to secondary disclosure instead of falling into the empty markdown-reader fallback.
- `2026-04-11`: Updated the decision to reflect implemented syntax highlighting and flatter reader-body chrome, so fenced code blocks now render with polished language-aware highlighting and the main reader stays less boxed and more document-like.
- `2026-04-11`: Updated the decision to reflect active in-document outline tracking and copyable fenced-code blocks in the reader, so the inspector now follows the current section and code blocks expose a product-grade copy affordance.
- `2026-04-11`: Updated the decision to reflect internal knowledge-link routing and richer fenced-code presentation in the markdown reader, so routed docs links can stay inside the app and code blocks now present a clearer language-aware shell.
- `2026-04-11`: Updated the decision to reflect the implemented baseline markdown reader, where narrative and reference sections now render through `react-markdown` plus `remark-gfm` and metadata or changelog remain in the inspector.
- `2026-04-11`: Added the accepted markdown-rendering and docs-reader pipeline decision for the routed console, so narrative docs content will move from the current light text splitter to a real markdown renderer while metadata and changelog context stay classified into the inspector.

## Context

The routed docs reader is cleaner than the earlier artifact dump, but it is still not rendering document content the way a product-grade reader should:

1. `DocumentBody` currently does light paragraph and list splitting rather than real markdown rendering
2. fenced code blocks, inline code, tables, blockquotes, nested lists, and richer link semantics are not rendered faithfully
3. document projections now classify sections as `narrative`, `metadata`, `changelog`, `reference`, and `preview`, but the narrative body still loses important markdown structure
4. metadata and changelog now live in the inspector, which makes the next gap more obvious: the main reader still behaves like a smart text preview rather than a true docs-reading surface
5. the current approach is harder to extend for code formatting, table support, and reader-specific components because the parsing logic is embedded in UI primitives instead of using a standard markdown pipeline

Quality product readers do not generally hand-split markdown into paragraphs and bullet lists. They use either a block model or a markdown AST pipeline with UI-owned renderers.

The routed docs surface also exposes canonical JSON artifacts such as `bootstrap.json`, `diagnosis.json`, `architecture.json`, and `index.json`. Those files are not prose documents, so they should not fall back to an empty markdown reader or a raw JSON dump as the main content surface.

## Decision

The routed Skopos docs surface should split markdown reading from JSON artifact presentation.

Chosen direction:

1. keep build-time section classification in the projection layer
2. render `narrative` and `reference` body content through a real markdown renderer in the app
3. render canonical JSON artifacts through typed artifact presenters instead of the markdown reader fallback
4. keep `metadata`, `changelog`, source links, and raw JSON disclosure out of the main reading flow and in the inspector or secondary disclosure
5. use UI-owned markdown and artifact components so the surface still follows the Skopos token system and product grammar
6. prefer a simple, durable stack over a heavier editor or MDX model

Preferred implementation stack:

1. `react-markdown`
2. `remark-gfm`
3. optional code-block highlighting after the baseline renderer is stable

This is the right fit for the routed console because it:

1. works well with the existing Vite plus React app
2. preserves markdown semantics without inventing another parser
3. still allows custom rendering for headings, paragraphs, lists, links, code, tables, and blockquotes
4. keeps the docs reader local-first and projection-driven instead of turning it into a CMS or editor problem

## Reader Contract

The docs surface should now follow this split:

1. projection layer:
   - classify sections
   - detect canonical JSON artifact families
   - extract metadata and changelog blocks
   - keep route sequence and document context stable
2. main reader:
   - render `narrative` and `reference` sections with real markdown components
   - preserve heading hierarchy, code, lists, blockquotes, tables, and links
   - keep narrative reading mostly unboxed so the center lane feels like a canvas, using separators and spacing instead of extra inner card chrome
3. main artifact view:
   - render known JSON artifacts through schema-aware sections and curated summaries
   - keep raw JSON secondary and collapsed by default
   - avoid empty-reader fallbacks for structured artifacts
4. inspector:
   - show metadata
   - show changelog
   - show source links
   - show outline or other support-only navigation when useful
   - show artifact metrics when the current route is a JSON artifact

The main reader must no longer expose machine-facing heading-level pills or section-debug affordances as visible UI.

## Current Implementation Status

The baseline reader implementation is now in place:

1. `DocumentBody` now uses `react-markdown` plus `remark-gfm`
2. the reader now renders paragraphs, ordered and unordered lists, links, inline code, fenced code blocks, blockquotes, and tables semantically
3. document section classification still happens in the projection layer
4. internal markdown links can now resolve to routed docs, decisions, and findings destinations instead of always leaving the app surface
5. fenced code blocks now use a clearer language-aware code shell
6. metadata, changelog, and source links still stay in the inspector instead of drifting back into the center lane
7. the inspector outline now tracks the active reader section instead of remaining a static list
8. fenced code blocks now expose a copy control in the code header
9. fenced code blocks now render with language-aware syntax highlighting
10. the main reader body now stays flatter and less boxed so markdown reads like content rather than a nested panel
11. canonical JSON docs now render through typed artifact sections for `architecture`, `bootstrap`, `diagnosis`, and `index` instead of falling into the empty reader fallback
12. raw JSON now stays secondary through explicit disclosure rather than becoming the default main canvas
13. fenced `mermaid` blocks now render as explanatory diagrams in docs detail instead of staying generic code blocks

The next reader work should build on that baseline rather than replacing it:

1. further reader-specific polish through shared primitives and tokens
2. keep syntax highlighting, outline behavior, and code-shell interactions system-owned rather than route-local
3. add deeper reader polish only when it improves readability without introducing clutter

## Explicit Non-Goals

This batch should not:

1. introduce MDX authoring
2. turn the docs reader into a full editor
3. reintroduce metadata or changelog blocks into the main reading lane
4. make raw artifact dumps the default routed docs experience

## Implementation Order

1. add the markdown-rendering dependency pair
2. replace the current light `DocumentBody` parser with a markdown-rendered narrative body
3. add Skopos-owned markdown components for:
   - headings
   - paragraphs
   - ordered and unordered lists
   - links
   - inline code
   - fenced code blocks
   - blockquotes
   - tables
4. keep section classification in the projection layer and avoid pushing metadata classification back into the reader
5. verify that docs detail still keeps metadata, changelog, and source links in the inspector

## Consequences

Positive:

1. the docs reader becomes a real product surface instead of a structured text preview
2. narrative docs can render code and richer formatting correctly
3. the reader grammar becomes easier to extend without route-local hacks
4. the current information-hierarchy contract stays intact because support context remains in the inspector

Tradeoffs:

1. the UI package adds markdown-rendering dependencies
2. markdown component styling must be kept aligned with the existing token system
3. some current document-body tests will need to be rewritten around semantic markdown output instead of string-splitting behavior
