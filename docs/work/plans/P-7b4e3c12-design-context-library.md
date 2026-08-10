---
title: Design Context Library Delivery Plan
status: active
owner: skopos-core
id: P-7b4e3c12
scope: skopos
role: plan
lifecycle: active
authority: canonical
provenance: accepted
view: target
implementationStatus: phases-1-through-4-implemented-phase-5-blocked-deferred-from-first-release
lastUpdated: 2026-08-10
relatedDocs:
  - ../../architecture/design-context-model.md
  - ../../decisions/D-a61f2d9c-design-context-as-progressive-product-knowledge.md
  - ../../decisions/040-project-adapted-skill-packs-as-capability-projections.md
  - P-20260804-skill-capability-hard-cut-and-judgment-pack-plan.md
  - ../../findings/F-20260804-skill-selection-proof-and-portability-gap.md
reviewCycle: per phase or when the consumer boundary changes
---

# Design Context Library Delivery Plan

## Outcome

Deliver a small, accepted Design Context Library that improves Product Interface
Design's product-specific judgment without expanding its three-module public model,
copying external products, loading irrelevant context, or weakening current release
proof.

This Plan owns delivery sequencing. The
[Design Context architecture](../../architecture/design-context-model.md) owns target
semantics, and the
[accepted decision](../../decisions/D-a61f2d9c-design-context-as-progressive-product-knowledge.md)
owns the architectural choice.

## Current State

1. Product Interface Design `0.5.0` exposes exactly Structure, Behavior, and Finish.
2. All 8 deterministic fixtures pass for the exact accepted source at combined digest
   `sha256:d11ae3f87ccbe17004c8d83c18978a60837011f46966669bcd592cab9719ee56`.
3. The complete three-module selection measures 1,572 tokens against a 1,800-token
   standard-Task ceiling.
4. Phase 1 now provides a generic, project-agnostic Skill Context contract in core and
   pack-owned Design Context record-type declarations and frozen fixtures.
5. The contract validates namespace, type rules, applicability, provenance,
   relationships, freshness, exact digests, budget shape, and Context Brief
   originality fields without a model or network call.
6. The repository contains a reviewed `0.3.0` development Library with four Domain
   Guides, six Experience Guides, three Design Signals, and ten Source Notes.
7. A generic runtime resolver deterministically produces exact Context Briefs with
   project precedence, expiry, retirement, ambiguity, selection-limit, budget, and
   consumer-boundary explanations.
8. Focused deterministic proof covers the complete initial domain and experience
    matrix, explicit justification for saturated signals, copied-pack loading, and a
    clean packed CLI installation without source-checkout access.
9. Two successive six-case full comparisons each ended 2 candidate wins to 4 control
    wins. A third, fresh eight-case candidate then lost its one-case smoke 0-1, so its
    full run did not start. All three gates were valid, contained, within budget, and
    free of authority regression; they failed efficacy rather than infrastructure.
10. The exact public `0.5.0` three-module core then lost its fresh no-Skill smoke 0-1.
    Its full run and independent human adjudication did not start.
11. Product Interface Design no longer binds the Library. The first public tarball
    validates but excludes all four `design-context/**` development assets. Design
    Context activation, public packaging, pilots, and human acceptance are deferred.
12. Live Task projection is intentionally not activated until explicit domain and
    experience selectors have one canonical Task input path. Goal-text inference is
    rejected as unsafe and nondeterministic product authority.

The existing result is the baseline. This Plan must not reinterpret it as a pass.

## Scope

V1 includes:

1. the Design Context Library schema and validation contract
2. compact Library records with exact identity and provenance
3. deterministic task-selective resolution
4. one generated Context Brief with structured explanation
5. project-authority precedence and originality constraints
6. expiry, review, retirement, and invalidation behavior
7. a deliberately small initial application-interface library
8. deterministic and behavioral evaluation
9. Skopos and one non-Skopos pilot
10. reviewed activation and maintenance ownership

## Non-Goals

V1 does not:

1. create a new Skill, package, Task authority, or closure workflow
2. add a Product Interface Design module
3. implement live crawling, automatic trend discovery, or automatic promotion
4. scrape or redistribute third-party screenshots, assets, copy, fonts, or code
5. make named products into templates
6. implement the planned `web.public-page-craft` Skill
7. teach public-page claims, persuasion, conversion, or search-intent architecture
8. expand the wider Skill catalog
9. change the current release result without a new exact-source evidence cycle

## Acceptance Criteria

1. The schema implements the complete canonical vocabulary without aliases such as
   trend pack, inspiration feed, premium reference, or top-platform template.
2. Every record declares applicability, failure modes, provenance, freshness, and
   exact identity.
3. Selection prefers project truth and fails closed on ambiguous or irrelevant Tasks.
4. The Context Brief includes only bounded relevant records and explains inclusion,
   suppression, expiry, and budget decisions.
5. Design Context stays inside the existing Task-wide Skill budget; no hidden allowance
   is introduced.
6. Expired or retired records cannot enter new Context Briefs.
7. External principles include explicit adaptation and do-not-copy constraints.
8. Exact Library, binding, project-source, selector, or Task changes invalidate stale
   acceptance and reuse.
9. Deterministic fixtures cover positive, negative, ambiguous, precedence, expiry,
   budget, identity, and consumer-boundary behavior.
10. Blinded paired evaluation shows material improvement without originality,
    behavioral, accessibility, authority, latency, or token regression.
11. Skopos and one non-Skopos project prove installation, selection, execution, and
    evidence portability.
12. Human acceptance activates the exact Library identity; structural completeness
    alone cannot promote it.

## Initial Library Boundary

Start with enough variety to test selection, not enough content to simulate a catalog.

### Domain Guides

1. **Developer platforms:** dense technical work, direct manipulation, progressive
   detail, product proof, and expert efficiency
2. **AI-assisted products:** system state, source visibility, permission, steering,
   interruption, recovery, and human-agent handoff
3. **Commerce operations:** merchant clarity, global content, inventory or order
   consequences, and workflow continuity
4. **Financial and high-trust products:** consequence visibility, review, confidence,
   auditability, and restrained brand expression

### Experience Guides

1. application workspace or workbench
2. setup and onboarding
3. review, approval, or transaction
4. monitoring and operational status
5. AI-assisted or delegated work
6. mobile task transformation

### Design Signals

Seed only signals that appear across multiple reliable sources or are required by a
platform authority. Each seed needs independent maturity and guidance classification.
The initial collection should be intentionally small enough for every record to receive
manual review.

### Source Notes

Use official design systems, platform guidance, direct product sources, and primary
research where available. A Domain or Experience Guide should not depend on one admired
company. Discovery galleries may locate candidates but cannot be the sole evidence for
active guidance.

### Reviewed Initial Source Boundary

The following sources were inspected on `2026-08-09` and admitted as dated Source
Notes after applicability, limitations, freshness, transfer rationale, redistribution,
and do-not-copy review. Source Notes remain evidence, not templates. Only the original
pack-owned guidance records they support can enter a Context Brief.

| Candidate source | What it may help establish | Important limitation |
| --- | --- | --- |
| [Linear interface refresh](https://linear.app/now/behind-the-latest-design-refresh) | Calm density, scanability, consistent navigation, and content focus in developer work | Linear's dark palette and recognizable shell are not transferable rules. |
| [Vercel Geist](https://vercel.com/geist/stack) | High-contrast developer semantics, grid discipline, type, and component consistency | A branded design system is platform evidence, not a universal visual direction. |
| [Atlassian AI interaction guidelines](https://atlassian.design/rovo-ui/ai-interaction-guidelines) | Proactivity, flow preservation, inspectability, multiplayer work, and responsible acceleration | Atlassian-specific brand expression must be removed from reusable principles. |
| [Microsoft Responsible AI](https://fluent2.microsoft.design/responsible-AI) | Expectation setting, user control, source verification, agent scope, recovery, and error content | Product-specific required disclaimers cannot be generalized without policy review. |
| [Stripe app design](https://docs.stripe.com/stripe-apps/design) | Financial consistency, constrained customization, trust, and accessible platform integration | Stripe Dashboard component rules apply directly only inside Stripe surfaces. |
| [Wise Design](https://docs.wise.design/design-at-wise/get-started) | Product-and-brand system continuity across financial experiences | Wise brand assets and visual identity are not reusable source material. |
| [Shopify content guidance](https://shopify.dev/docs/apps/design/content) | Merchant-centered language, decision support, global clarity, and control | Shopify Admin conventions apply directly only to Shopify integrations. |
| [Apple interface materials](https://developer.apple.com/design/human-interface-guidelines/materials) | Platform-required hierarchy, adaptable material, and restrained use of translucency | Liquid Glass is platform-specific and must not become generic glass styling. |
| [Material Design 3](https://m3.material.io/) | Adaptive components, expressive motion, typography, shape, and Android conventions | Material expression should not overwrite an established non-Material system. |
| [GOV.UK accessibility strategy](https://design-system.service.gov.uk/accessibility/accessibility-strategy/) | Universal design, progressive enhancement, tolerance for error, and rigorous accessibility | Public-service visual language is not an aesthetic template for commercial products. |

Future maintenance may add, revise, weaken, or retire sources based on coverage and
semantic review. Fame, awards, or visual novelty are never admission criteria.

## Delivery Phases

### Phase 1 — Contract and fixtures

1. add schema types for Domain Guide, Experience Guide, Design Signal, Source Note,
   and Context Brief
2. define stable ids, applicability, maturity, guidance, freshness, and digest rules
3. validate relationships and reject missing or duplicate records
4. freeze representative positive, negative, ambiguous, expired, and budget fixtures
5. prove the Library can remain absent without changing current Skill behavior

Exit when the contract is deterministic, documented, and covered without a model or
network call.

Implementation record: Task `T-70955189` introduced generic `Skill Context` core
contracts and validation, while keeping the complete Design Context vocabulary,
taxonomy, and representative fixture content capability-owned and outside generic core
code. The Phase 1 fixture remains outside the currently accepted pack digest; the
production Library enters the pack only with deliberate exact re-acceptance. The
fixture covers positive, negative, ambiguous, expired, retired, explicit multi-domain,
and budget-pressure cases. Product Interface Design continues to expose exactly
Structure, Behavior, and Finish when no Library is bound.

### Phase 2 — Small reviewed Library

1. research the four initial domains and six initial experiences
2. record original Source Notes with dates, limitations, and do-not-copy constraints
3. author concise guides from multiple sources and project evidence
4. classify a small set of Design Signals
5. run metadata, provenance, expiry, link, and token checks
6. review every record before acceptance

Exit when the complete Library remains inspectable, source-grounded, and small enough
for a human to audit.

Implementation record: Product Interface Design owns the reviewed Library under
`design-context/library.json`. Its ten official Source Notes contain original
observations, transfer rationale, do-not-copy lists, limitations, asset restrictions,
observation dates, review dates, and exact digests. Fast-moving signals and AI sources
use 90-day review windows; durable guides use 180-day windows.

### Phase 3 — Resolver and Context Brief

1. extend Task signals only with evidence needed for domain and experience selection
2. preserve project-source and platform precedence
3. select one primary Domain Guide and one primary Experience Guide by default
4. add only directly applicable active Design Signals
5. enforce the current Task-wide pack, module, and token budgets
6. generate one exact Context Brief and structured explanation
7. invalidate reuse when any authoritative input changes

Exit when irrelevant Tasks receive zero Design Context and every selection or
suppression is explainable.

Implementation record: the generic resolver implements this resolution contract and
produces one exact in-memory Context Brief. It fails closed on missing or ambiguous
selectors and charges selected records after existing module context against the same
Task ceiling. Project-authority overrides, selector inputs, algorithm identity, source
freshness, Library digest, and budget inputs all affect exact identity. Activation in
the canonical live Task projection remains pending a single explicit Task-selector
authority; no keyword inference was introduced.

### Phase 4 — Deterministic proof

Cover:

1. each initial domain and experience
2. negative backend, docs-only, generated-only, and unrelated maintenance Tasks
3. ambiguous and hybrid Tasks
4. project design-system precedence
5. expired, retired, and unreachable-source behavior
6. saturated signals with and without product justification
7. budget pressure and deterministic suppression order
8. public-page ownership exclusion
9. stale acceptance and Context Brief invalidation
10. packed installation without source-checkout access

Exit only when all declared fixtures resolve exactly once and no test requires live
network access.

Implementation record: focused source-bound tests cover all four domains, all six
experiences, irrelevant and public-page Tasks, ambiguous and explicit multi-domain
selection, project precedence, expiry, retirement, budget pressure, identity changes,
consumer ownership, capability locality, saturated-signal justification, and
copied-pack equivalence. These selector tests use no model or network call. Repository
tests parse the development Library directly, while the public copy step recognizes it
as an explicitly reviewed internal source set and excludes it from the tarball. Packed
install proof therefore covers the accepted three-module core, not Design Context.

### Phase 5 — Behavioral evaluation

1. freeze unseen briefs across the initial domain and experience matrix
2. give the control accepted Product Interface Design core only
3. give the candidate the same core plus its resolved Context Brief
4. keep product facts and behavior equal and avoid prescriptive art direction
5. capture source, interactions, desktop and mobile renders, errors, overflow, Axe,
   telemetry, and correction history
6. randomize labels and conduct independent blind human review
7. score task fit, originality, character, hierarchy, behavior, responsive adaptation,
   accessibility, trust, and finish
8. report win/loss/tie reasons and time/token cost without treating a small sample as
   statistical certainty

Exit only if the exact candidate meets the existing material-improvement threshold and
introduces no important regression. An inconclusive result triggers diagnosis, not
automatic expansion.

Evaluation record: the generic paired-evaluation runtime successfully kept comparison
sources digest-bound, arms isolated, briefs candidate-only, labels blind, and source
identity exact. Design Context `0.1.0` and `0.2.0` each completed their six-case full
comparison at 2 candidate wins and 4 control wins. Successor `0.3.0` then lost its
fresh one-case smoke 0-1, so the full comparison correctly did not start. The exact
public Product Interface Design `0.5.0` core also lost a fresh no-Skill smoke 0-1.
Per the stop rule, independent human review and real-project pilots did not start. The
machine gates therefore block Phase 5; this Plan records the failure instead of tuning
against a consumed holdout or reinterpreting deterministic completeness as usefulness.

### Phase 6 — Real-project pilots

1. use one bounded Skopos application Task
2. use one non-Skopos application with an established design system
3. preserve each project's existing components, tokens, and product language
4. compare selected context, search behavior, corrections, rendered quality, and proof
5. record project-adaptation gaps instead of encoding adopter-specific guidance into
   core

Exit when both projects prove useful bounded selection and no source-checkout,
authority, portability, or contamination defect.

### Phase 7 — Acceptance and maintenance

1. review the exact Library source, fixtures, rubric, project bindings, and evidence
2. accept one combined identity
3. regenerate required host projections and packaged assets
4. document Library ownership and review cadence
5. activate upcoming-review, expired, dead-link, and changed-source reports
6. keep semantic changes human-reviewed
7. rerun only proof invalidated by the accepted source change

Exit when the exact accepted identity is portable and Readiness contains no Design
Context blocker.

## Validation Economy

1. Validate schema and deterministic selection before model or browser work.
2. Stop on the first failing proof stage and correct its cause.
3. Reuse source-bound Evidence only while Library, selector, binding, project authority,
   fixture, command, and configuration digests remain exact.
4. Keep showcase generation separate from promotion evaluation.
5. Do not rerun the current expensive efficacy suite until a candidate Library identity
   is complete, frozen, and independently authorized.

## Maintenance And Future Improvement

After V1 proves value, consider:

1. source reachability and material-change detection
2. a review queue ordered by expiry and consumer impact
3. side-by-side diffs of old and newly researched Source Notes
4. outcome feedback from real Tasks
5. promotion, weakening, or retirement recommendations
6. additional Domain and Experience Guides demanded by real projects
7. reuse by future Skills through explicit consumer ownership

Automation may recommend review. It may not silently rewrite, reactivate, accept, or
promote design knowledge.

## Rollback

Design Context must be independently suppressible. If it regresses quality, cost,
originality, or project conformance:

1. suppress the affected Library identity or record
2. invalidate derived Context Briefs
3. fall back to accepted core Skill guidance and project truth
4. preserve failed Evidence and reasons
5. correct and re-evaluate a new identity

Rollback never requires restoring a previous Product Interface Design name or module
model.

Implementation record: the rollback boundary is active. Product Interface Design
retains its required three-module core, while its unproven Design Context Library is
unbound from `pack.json` and excluded from the first public tarball. The generic
resolver, bounded comparison contract, Library source, and failed evidence remain for
audit and a separately accepted redesign; none is presented as release-certified.

## Completion Evidence

Completion requires:

1. deterministic fixture and budget reports
2. accepted Library and binding digests
3. Context Brief selection and invalidation proof
4. blinded paired machine and independent human results
5. Skopos and non-Skopos pilot Evidence
6. packed-install proof
7. maintenance ownership and freshness report
8. explicit release-gate assessment

Until those exist, Design Context remains planned or experimental and cannot be
described as an efficacy-certified Product Interface Design capability.
