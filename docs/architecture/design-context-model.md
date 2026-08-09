---
title: Design Context Model
status: active
owner: skopos-core
id: SKOPOS-ARCH-DESIGN-CONTEXT
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: target
implementationStatus: phase-1-contract-implemented
lastUpdated: 2026-08-09
relatedDocs:
  - 00-architecture.md
  - agent-native-operating-model.md
  - ../decisions/D-a61f2d9c-design-context-as-progressive-product-knowledge.md
  - ../decisions/040-project-adapted-skill-packs-as-capability-projections.md
  - ../work/plans/P-7b4e3c12-design-context-library.md
  - ../work/plans/P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md
  - ../findings/F-20260804-skill-selection-proof-and-portability-gap.md
reviewCycle: when Design Context authority, vocabulary, selection, or lifecycle changes
---

# Design Context Model

Design Context gives a coding agent the smallest relevant body of product-design
knowledge for the interface it is changing. It exists to improve contextual judgment,
not to make every product resemble currently fashionable software.

The first consumer is Product Interface Design. Future Skills may consume relevant
parts of the same model without copying its knowledge or creating a parallel design
authority.

## Changelog

- `2026-08-09`: Implemented the Phase 1 contract through a generic core Skill Context
  envelope and capability-owned Design Context vocabulary and fixtures. Skopos core owns
  reusable identity, provenance, freshness, applicability, budget, and validation
  mechanics; Product Interface Design owns every design-specific record type, rule,
  example, and source.
- `2026-08-09`: Accepted the initial target model, vocabulary, authority order,
  progressive-disclosure contract, freshness lifecycle, provenance rules, and proof
  requirements.

## Problem

General coding agents can produce technically valid interfaces while relying on stale
or generic visual conventions. A raw list of admired websites does not solve that
problem:

1. popularity is not evidence that a pattern fits the current product
2. links decay and visible products change without changing the Skill source
3. direct examples encourage brand imitation and recognizable layout copying
4. loading every reference wastes context and weakens project-specific direction
5. live research in every Task makes selection slow, nondeterministic, and difficult
   to reproduce
6. aesthetic novelty can displace behavior, accessibility, truthful content, and
   platform conventions

Skopos therefore needs accepted, dated, selectively loaded design knowledge rather
than a generic trend feed or inspiration gallery.

## Boundary

Design Context is:

1. a supporting capability of the existing Skill system
2. versioned and content-digested
3. resolved only for a Task that selected a compatible Skill capability
4. progressively disclosed from compact accepted sources
5. provenance-backed and reviewable
6. bounded by the existing Task-wide Skill budget

The implementation boundary is intentionally asymmetric:

1. Skopos core may own a generic `Skill Context Library` and `Skill Context Brief`
   contract because selection identity, provenance, freshness, budget accounting,
   portability, and explanation are shared Skill infrastructure.
2. A Skill pack declares its own namespaced record types, selector dimensions,
   required constraints, facets, content, and fixtures over that generic contract.
3. Product Interface Design therefore owns `design-context.domain-guide`,
   `design-context.experience-guide`, `design-context.design-signal`, and
   `design-context.source-note` under its pack source.
4. Core model, indexer, runtime, CLI, and MCP code must not hardcode Product Interface
   Design, Design Context, design domains, experience names, visual conventions, or
   source candidates.
5. A future Skill may use the generic infrastructure with a different namespace and
   vocabulary without importing design semantics or changing a core project primitive.

Phase 1 keeps its synthetic contract fixture outside the currently accepted pack
directory so proving the optional contract does not change that pack's source digest.
The reviewed production Library enters the pack source only when the Library is ready
for exact re-acceptance.

Design Context is not:

1. a new public Skill
2. a fourth Product Interface Design module
3. a Policy, Guard, Action, Task, or closure authority
4. a design-system replacement
5. a live crawler or mandatory browsing workflow
6. a catalog of layouts to reproduce
7. a claim that recent, popular, premium, dark, minimal, expressive, or animated is
   inherently better

Product Interface Design retains exactly Structure, Behavior, and Finish. Design
Context may make those modules more relevant; it does not widen their ownership.

## Vocabulary

| Term | Meaning |
| --- | --- |
| **Design Context** | Task-relevant product-design knowledge resolved for an accepted Skill capability. |
| **Design Context Library** | The complete versioned collection from which Design Context is selected. |
| **Domain Guide** | Durable judgment for a product domain such as developer platforms, commerce, or financial software. |
| **Experience Guide** | Durable judgment for an experience type such as a workbench, setup flow, review flow, or monitoring surface. |
| **Design Signal** | A dated observation about a changing design or interaction direction, including its maturity, applicability, and risks. |
| **Source Note** | A concise, dated record of evidence from a real product, official design system, research source, or platform authority. |
| **Context Brief** | The compact generated selection delivered to the coding agent for one Task. |

Do not use `trend`, `inspiration`, `premium`, `high-end`, or `top platform` as canonical
artifact types. They describe perception or source discovery, not durable authority.

## Authority Order

When guidance conflicts, resolve it in this order:

1. user intent, accepted Task constraints, and safety requirements
2. project Memory and bound project design authorities
3. existing project components, tokens, interaction contracts, and product language
4. required platform or host conventions
5. applicable Domain Guide
6. applicable Experience Guide
7. active Design Signals
8. general model judgment

Policies and Guards remain mandatory enforcement regardless of this ordering. A Design
Signal can never override accessibility, truthful content, platform behavior, or a
project's accepted design system.

Project-specific sources are not merely visual inputs. The Context Brief must name
their authority and preserve their contracts before introducing external judgment.

## Selection Inputs

Resolve Design Context from explicit Task and project evidence:

1. product domain
2. interface or experience type
3. primary audience and job
4. trust, safety, or consequence level
5. target platform and input modes
6. existing design-system maturity
7. product language and brand constraints
8. responsive and accessibility obligations
9. selected Skill and capability ownership
10. Task risk, owned paths, changed paths, and non-goals

Do not infer a domain or visual direction from incidental words alone. Ambiguous
selection fails closed to core Skill guidance and project truth.

## Progressive Disclosure

The library must not enter every prompt.

1. Library metadata supports deterministic eligibility without loading full content.
2. A compatible selected Skill capability may request Design Context.
3. Resolution chooses at most one primary Domain Guide and one primary Experience
   Guide unless the Task explicitly spans a second domain or experience.
4. Only directly applicable active Design Signals and the necessary Source Note ids,
   dates, and provenance fields are projected; full Source Notes stay outside the
   prompt unless an explicit research or review Task needs them.
5. Every projected token counts against the existing Task-wide Skill budget; Design
   Context receives no hidden or separate allowance.
6. When the budget is insufficient, lower-authority Design Signals are omitted before
   durable guides or project truth. Content is never truncated mid-record.
7. The generated selection explains inclusion, exclusion, staleness, and budget
   suppression.

Routine Task execution uses accepted local content. Browsing is a research and
maintenance operation, not a runtime dependency.

## Library Record Contract

Every selectable record needs stable identity and sufficient context to prevent
misapplication. The implementation schema must represent:

1. stable id and record kind
2. title and concise purpose
3. applicable domains, experience types, platforms, and audiences
4. positive and negative selection signals
5. problem addressed and principle recommended
6. failure modes and contexts where the guidance should not be used
7. accessibility, trust, and responsive considerations
8. implementation or operational cost when material
9. source-note references
10. creation, review, and expiry metadata
11. exact content digest

These are Design Context requirements declared by the Product Interface Design pack,
not fixed core record names. Core validates the generic record envelope plus the
pack-declared type contract: required selector dimensions, required constraint kinds,
allowed facet values, relationships, provenance, freshness, namespace, and digests.

A Design Signal additionally declares two independent dimensions:

1. `maturity`: `emerging`, `established`, `saturated`, or `retired`
2. `guidance`: `consider`, `prefer`, `avoid-default`, or `platform-required`

New does not mean recommended. Widespread does not mean appropriate. Saturated does
not mean forbidden; it means the agent must justify its use from product context rather
than familiarity.

## Source Notes And Provenance

A Source Note records evidence without turning another product into a template. It
must include:

1. source owner and official URL when available
2. source type and relevant product surface
3. observation date and next review date
4. the observed principle, not a copied composition
5. why the principle may transfer
6. what must not be copied
7. limitations or conflicting evidence
8. license or asset restrictions when relevant

Prefer official product pages, official design systems, platform guidance, and direct
research. Galleries, awards, social posts, and design roundups may help discover a
candidate but cannot independently establish active guidance.

Do not bundle third-party screenshots, logos, copy, fonts, illustrations, or extracted
code unless redistribution rights are explicit. Links and concise original observations
are the default evidence form.

## Originality Contract

Every Context Brief translates sources into product-specific decisions. For each
external principle it uses, the brief states:

1. the principle being adopted
2. the Task evidence that makes it relevant
3. the intended adaptation
4. a deliberate difference from the source
5. recognizable brand, layout, copy, or interaction characteristics that must not be
   reproduced

The brief must not instruct an agent to "make it like" a named product. Reference
owners are evidence providers, not design directions.

## Freshness And Lifecycle

The Library uses review state rather than pretending that links stay current.

1. Active Design Signals receive a default 90-day review interval.
2. Fast-moving AI and agent-interaction guidance receives at most a 90-day interval.
3. Domain and Experience Guides receive a default 180-day interval.
4. Platform guidance is reviewed after a material platform release even when its date
   has not elapsed.
5. Expired records become `needs-review` and are excluded from new Context Briefs.
6. Expiry does not delete history or silently convert guidance into an anti-pattern.
7. Retired records remain available to explain past decisions but are excluded from
   normal selection.
8. A reachable URL proves only reachability, not continued semantic accuracy.

V1 maintenance is deliberately reviewed and curated. Later automation may detect
changed pages, dead links, upcoming review dates, and source diffs, but it may not
promote or rewrite design guidance without human acceptance.

## Context Brief Contract

One generated Context Brief owns the resolved context for a Task. It records:

1. Task and selected Skill identity
2. Design Context Library version and digest
3. project design authorities consulted
4. selected and suppressed guides and signals with reasons
5. applicable principles and known failure modes
6. originality constraints
7. unresolved project-context gaps
8. token cost and budget decisions
9. source-note ids and observation dates
10. exact Context Brief digest

The brief is derived state under `.skopos/**`; accepted library sources remain tracked
and portable. A changed library, binding, project authority, selector, or Task signal
invalidates exact reuse.

## Versioning And Acceptance

1. Product Interface Design keeps its own semantic version.
2. The Design Context Library has an independently inspectable version and digest.
3. The accepted combined Skill identity includes the exact library content and project
   binding inputs used by selection.
4. Editorial or source changes that can affect selection or output invalidate stale
   acceptance and Context Brief reuse.
5. Refreshing a review date without semantic review cannot reactivate expired content.
6. A library update does not claim that Product Interface Design efficacy improved.

The first implementation may store the library inside the existing Product Interface
Design package source. Independent identity does not require a new package or runtime
boundary.

## Quality And Proof

Design Context is successful only if it improves product-specific judgment without
creating imitation, context bloat, or behavioral regressions.

Deterministic proof must cover:

1. positive, negative, ambiguous, and multi-domain selection
2. project-authority precedence
3. expired and retired record exclusion
4. budget suppression and explanation
5. exact identity and invalidation
6. source provenance and required metadata
7. consumer ownership boundaries
8. no context for irrelevant Tasks

Behavioral evaluation must compare the same unseen brief and agent with:

1. accepted Product Interface Design core only
2. the same core plus the applicable Design Context Library

Prompts may state product facts and required behavior but cannot prescribe the desired
visual answer. Blinded review measures:

1. task and domain fit
2. distinct product character
3. originality and distance from named sources
4. hierarchy and human-readable content
5. complete states, control, and recovery
6. responsive transformation
7. accessibility and trust
8. rendered finish
9. time, token, and correction cost

Machine review alone cannot certify subjective improvement. Promotion requires the
existing independent human threshold and real-project proof in Skopos plus one
non-Skopos project. A changed Design Context identity reopens relevant efficacy proof;
it does not bypass the current Product Interface Design release gate.

## Initial Consumer Boundary

V1 supports Product Interface Design work for application interfaces. Initial
Experience Guides may cover:

1. application workspaces and workbenches
2. setup and onboarding
3. review, approval, and transactional decisions
4. monitoring and operational status
5. AI-assisted and delegated work
6. mobile task transformation

Public-page narrative, claims, proof, persuasion, conversion architecture, and search
intent remain owned by the planned `web.public-page-craft` Skill. The Library may later
serve that Skill through separately owned Experience Guides; Product Interface Design
must not absorb that responsibility through Design Context.

## Invariants

1. Project truth wins over generic design knowledge.
2. Design Context is selected, never dumped wholesale.
3. Currentness is dated evidence, not a visual style.
4. External products teach principles, not compositions.
5. Every selected record has provenance, applicability, and failure modes.
6. Expired knowledge fails closed.
7. All context consumes the existing Task-wide Skill budget.
8. Generated Context Briefs are derived state, not parallel Memory.
9. Design Context never creates another Task or closure authority.
10. No release or efficacy claim follows from structural completeness alone.
