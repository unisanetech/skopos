---
title: First-Version Skill Capability Hard-Cut And Judgment-Pack Plan
status: active
owner: skopos-core
id: SKOPOS-PLAN-P-20260804-SKILL-CAPABILITY-HARD-CUT
scope: skopos
role: plan
lifecycle: active
authority: canonical
provenance: accepted
view: target
implementationStatus: planned
lastUpdated: 2026-08-04
relatedDocs:
  - ../../decisions/040-project-adapted-skill-packs-as-capability-projections.md
  - ../../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../../findings/F-20260804-skill-selection-proof-and-portability-gap.md
  - ../../findings/archive/F-20260804-self-hosted-derived-output-evidence-cycle.md
  - P-e7e888e6-canonical-product-convergence.md
  - ../../architecture/agent-native-operating-model.md
  - ../../architecture/action-extension-model.md
  - ../../architecture/evidence-and-readiness-model.md
reviewCycle: per phase
---

# First-Version Skill Capability Hard-Cut And Judgment-Pack Plan

## Changelog

- `2026-08-04`: Completed Phase 0 proof reliability: the shared-derived Evidence
  cycle is resolved and archived, and the previously blocked Product UI Craft content
  Task passed repeated closure verification and closed.
- `2026-08-04`: Created the complete pre-release hard-cut Plan for one first-version
  Skill capability system, efficacy-certifying Product UI Craft, and adding a lean
  catalog of judgment packs without generic coding-agent education or compatibility
  layers.

## Objective

Deliver one compact, project-adapted Skill system that gives capable coding agents only
the non-obvious judgment they repeatedly miss, while preserving Skopos as the sole
Task, Action, Evidence, Readiness, and closure authority.

The system must make high-quality implementation more likely without creating a second
instruction layer, injecting irrelevant context, slowing normal Tasks, or duplicating
Project Memory, Policies, Actions, Guards, and coding-agent baseline knowledge.

## Accepted Direction

1. Teach the delta, not the discipline.
2. Zero selected Skills is a correct result.
3. Project Memory is preferred before reusable generic guidance.
4. Skills own contextual judgment, trade-offs, compact good/bad comparisons, and
   subjective review lenses.
5. Policies own accepted normative requirements.
6. Actions own executable project capabilities and Evidence production.
7. Guards own deterministic blocking requirements.
8. Project docs and bindings own facts, terminology, tokens, components, architecture,
   workflows, permissions, metrics, claims, and operational budgets.
9. Skopos Readiness remains the only closure authority.
10. Every pack has a narrow owner, explicit exclusions, positive signals, anti-signals,
    measured context limits, real fixtures, and effectiveness proof.
11. Research provenance informs pack authors and freshness review; it does not enter
    normal Task context.
12. User corrections are classified evidence. One correction cannot automatically
    create or modify permanent guidance.

## First-Version Clean Hard Cut

Skopos is unreleased. This work updates the current implementation directly to the one
system intended for launch.

1. Keep one `schemaVersion: 1` for the canonical Skill manifest, binding, selection,
   and projection contract.
2. Reset `ui.product-craft` to `0.1.0`.
3. Start every new built-in Skill at `0.1.0`.
4. Update the model, validation, selector, catalog, bindings, fixtures, host
   projections, tests, documentation, and bundled delivery together.
5. Delete obsolete fields, selection paths, tests, and generated behavior.
6. Add no schema migration, fallback parser, deprecated alias, compatibility bridge,
   dual selector, parallel runtime, or silent version fallback.
7. Use Git history and isolated evaluation fixtures for previous behavior; do not keep
   old pack sources live in the accepted catalog.
8. Pack versions identify evaluated content before launch but do not create a public
   compatibility promise.
9. A material source change invalidates acceptance even when an author forgets to
   change the version label.

## Non-Goals

1. Teach React, TypeScript, CSS, testing, accessibility, SEO, security, or clean-code
   basics that modern coding agents already know.
2. Create one all-in-one website-building prompt.
3. Create one Skill per framework, component library, or host.
4. Copy project docs, design systems, source trees, or research libraries into Skill
   context.
5. Let Skills execute commands, create workflow state, capture authoritative Evidence,
   or declare closure.
6. Automatically accept or update a Skill after inferred usage or one user complaint.
7. Build all proposed packs before the selector and evaluation system prove the first
   pack's value and cost.
8. Preserve current internal `0.4.0` UI-pack numbering or a previous schema behavior.

## Current Gaps

The active Findings own detailed evidence. The Plan treats these as release-blocking
for Skill catalog expansion:

1. knowledge refresh can invalidate its own source-bound Evidence
2. Task eligibility is based on shallow text overlap rather than complete Task signals
3. declared positive signals and failure evidence do not drive Task selection
4. one matched module selects every pack-bound Action and Guard
5. project adaptation is mostly a flat provenance-path list
6. token budgets are author estimates, per pack, and outside one Task-wide ceiling
7. no hot-path selection cache exists
8. acceptance does not bind exact content and evaluation identity
9. fixtures and focused tests prove shape and phrases, not selection or outcome quality
10. visual and accessibility roles are not bound to truthful specialized proof
11. packed non-Skopos adoption and source-checkout independence are unproved

## Target Selection Contract

### Complete Task signal envelope

Selection uses one deterministic normalized envelope containing:

1. Task goal
2. acceptance criteria
3. constraints
4. non-goals
5. open decisions
6. risk
7. Scope and Scope ancestry
8. owned paths
9. current changed paths
10. affected symbols and capabilities when available
11. selected Actions
12. applicable Guards
13. accepted Findings and failure-signal occurrences
14. project lifecycle
15. authored, generated, vendored, build, and distribution path classification

Keyword overlap may rank an already eligible module. It cannot make a pack eligible or
override an anti-signal.

### Eligibility stage

A pack is eligible only when:

1. one high-confidence positive structural signal matches, or two independent
   medium-confidence signals match
2. a relevant Scope, path, capability, or accepted repeated failure signal exists
3. no blocking anti-signal matches
4. the project binding resolves every required role
5. the accepted content identity is current
6. the Task risk and project lifecycle permit the pack

Ambiguous evidence below the threshold suppresses the pack and records why.

### Budgeted module stage

For eligible packs, Skopos:

1. ranks modules by distinct judgment value and measured cost
2. prefers project-specific Memory over reusable guidance
3. removes duplicate concepts and resolves pack collisions
4. selects only module-relevant project context
5. selects only module-relevant Actions and Guards
6. selects only module-relevant rubric dimensions and failure signals
7. stops when another module adds no distinct judgment
8. enforces the Task-wide pack, module, and measured-token ceiling
9. never truncates a module mid-instruction
10. records selection, suppression, cost, capability, and cache explanations

### Initial context ceilings

| Task risk | Pack ceiling | Module ceiling | Skill-token ceiling | Expected normal use |
|---|---:|---:|---:|---:|
| light | 1 | 1 | 800 | 250-450 |
| standard | 2 | 3 | 1,800 | 600-1,200 |
| high-impact | 3 | 5 | 2,800 | 1,000-1,800 |

Additional rules:

1. negative fixtures and irrelevant real Tasks receive zero Skill tokens
2. a pack may declare lower limits but cannot raise Task ceilings silently
3. review-only modules load during review or closure rather than initial implementation
4. normal modules should usually remain between 200 and 450 measured tokens
5. research, full rubrics, inactive modules, evaluator oracles, and catalog docs remain
   outside the hot path
6. if required guidance cannot fit, Skopos suppresses it and explains the budget
   conflict rather than returning a partial instruction

### Capability locality

Each module declares its own:

1. positive and negative signals
2. relevant Scope and path kinds
3. required and recommended context roles
4. required and recommended Action roles
5. required and recommended Guard roles
6. rubric dimensions
7. failure signals
8. measured tokens

Matching one interface-writing module cannot automatically add an unrelated build,
accessibility, and test capability.

### Exact identity and caching

Selection cache identity includes:

1. selection algorithm identity
2. Task signal digest
3. exact pack source digest
4. binding digest
5. bound project-source digest
6. Action and Guard catalog digest
7. resolved policy digest

The existing Skill-selection artifact becomes the one cache and explanation view. No
parallel cache or authority is introduced.

Runtime targets:

1. no network or model call during selection
2. warm p95 below 100 milliseconds at representative catalog size
3. cold p95 below 250 milliseconds at representative catalog size
4. exact cache reuse only while every relevant digest remains unchanged

## Evaluation And Promotion

The evaluation system proves that a Skill improves Tasks that need it, adds nothing to
Tasks that do not, and costs less than the rework it prevents.

### Layer 1: static validation

Run without a coding-agent call on every pack or binding change.

Validate:

1. schema, IDs, paths, and first-version identity
2. every module, rubric, research source, and proof fixture resolves
3. no duplicate module, signal, rubric, or fixture IDs
4. module-local roles resolve to declared project capabilities
5. authority remains with Skopos
6. actual rendered token counts and declared ceilings agree
7. research freshness remains current
8. accepted content digests match current sources
9. published source identity cannot change silently
10. rejected, retired, historical, dead, or otherwise ineligible sources cannot select
11. generated host projections preserve source and capability identity

### Layer 2: deterministic selection fixtures

Every pack covers:

1. clear positive Task
2. narrow positive Task selecting one module
3. adjacent Task with overlapping terms but no Skill need
4. explicit `notFor` or anti-signal case
5. generated or vendored path
6. missing binding role
7. stale source or stale research
8. ambiguous Task below confidence threshold
9. overlap where only one primary pack is correct
10. legitimate bounded multi-pack Task
11. light Task under the strict ceiling
12. high-impact Task with justified additional context
13. accepted failure evidence present and absent
14. prompt-shaped wording designed to cause a false keyword match

Fixtures declare required, allowed, and forbidden packs, modules, Actions, Guards, and
maximum cost. Several valid optional modules may remain allowed; deterministic proof
does not force arbitrary exact ordering.

Blocking gates:

1. all must-select and must-not-select cases pass
2. all anti-signals suppress correctly
3. every Task stays within the global budget
4. no forbidden module, Action, or Guard appears
5. supporting selection precision and recall reach at least 98 percent
6. every selection and suppression has a structured reason

### Layer 3: paired forward tests

Run when guidance, signals, limits, modules, rubrics, or failure signals change
materially.

Compare:

1. control without the candidate Skill
2. candidate with the Skill
3. previous evaluated source only when an update needs comparison

Keep the model, effort, host, tools, permissions, fixture digest, project state, and
acceptance checks identical. Use fresh isolated workspaces. The worker receives no
oracle, known failure, expected answer, prior conclusion, or other arm's output.

Run deterministic checks first, then blind review of the Task, diff, rendered proof,
and selected rubric dimensions. A blocking subjective disagreement requires human
adjudication.

Economical execution:

1. start with 8-12 representative paired Tasks
2. stop on the first authority, safety, deterministic, or budget blocker
3. reuse an exact control only while every environment and source digest matches
4. repeat only ambiguous cases, with at most three runs per arm
5. rerun all controls only after relevant model, host, fixture, or toolchain change

### Layer 4: project canary

Before validation:

1. run at least 10 eligible real Tasks
2. cover two materially different projects or Scopes
3. include one non-Skopos project for reusable built-in packs
4. record no severe Skill-attributable correction
5. record no anti-signal selection
6. keep token p95 inside the risk ceiling

Canary telemetry remains local and structured. It stores no prompts, source bodies,
secrets, or full conversations.

### Effectiveness metrics

Track independently rather than collapsing them into one opaque score:

1. pack and module precision and recall
2. anti-signal, missed-selection, and over-selection rates
3. irrelevant Action and Guard count
4. actual Skill tokens and Skill share of the compact brief at p50 and p95
5. warm and cold selector latency
6. repository search and read calls
7. files inspected before the first correct edit
8. time to first acceptable patch
9. implementation rounds and repeated Action executions
10. lines added and later removed
11. final-diff-to-total-churn ratio
12. failed validation followed by correction
13. user correction turns classified as agent mistake, Skill-targeted failure, user
    preference, new requirement, or scope change
14. first-pass acceptance and acceptance-criterion pass rate
15. blocking rubric conditions, Guard failures, false closure, and unrelated edits
16. blind pairwise win, loss, and tie

### Promotion threshold

A pack declares its delta hypothesis and primary outcome before evaluation. It advances
only when:

1. deterministic blockers pass
2. no new safety, privacy, authority, Guard, or false-closure failure appears
3. targeted failure signals fall by at least 30 percent, or blind wins reach at least
   65 percent
4. blind losses remain at or below 10 percent
5. first-pass success does not regress
6. correction turns and post-first-patch churn improve by about 20 percent once the
   sample is meaningful
7. search remains neutral or improves; a regression above 10 percent is investigated
8. token and latency ceilings pass
9. Skopos and one non-Skopos proof pass for a reusable pack

If the baseline agent already performs equally well, shrink, reject, or retire the
candidate. Catalog breadth is not a success metric.

## Product UI Craft Refocus

The current content work remains useful but the first canonical pack must own a smaller
judgment boundary.

Keep in `ui.product-craft@0.1.0`:

1. information and visual hierarchy
2. brand and token fidelity
3. semantic type scale, spacing, alignment, density, and containment
4. surface, border, radius, and elevation discipline
5. responsive visual composition
6. page-wide copy-role economy
7. rendered anti-slop review

Move to later focused owners:

1. component reuse, variants, API shape, and durable naming to
   `frontend.component-evolution`
2. server/client and route delivery boundaries to `performance.route-delivery`
3. multi-step forms, destructive actions, work preservation, transactional errors,
   and recovery to `ux.flow-integrity`
4. complex keyboard, focus, motion, and assistive semantics to
   `accessibility.interaction-semantics`
5. public narrative, claims, proof, and conversion language to
   `web.public-page-craft`

Keep only the small amount of writing guidance needed to ensure distinct page roles,
specific visible actions, and calm user-facing status. Do not turn Product UI Craft
into a complete writing discipline.

Replace prose-only fixtures with actual Task contracts, small runnable components or
pages, good and drift sources, responsive rendered evidence, overflow and scroll cases,
component-duplication cases, prompt-shaped names, repeated copy roles, and generated
output anti-signals.

Bind responsive visual capture to a real browser-capable Action. Bind accessibility to
specialized proof rather than a generic observation. Build, visual, interaction, and
accessibility Evidence remain distinct.

## Initial Judgment-Pack Catalog

Every initial built-in pack starts at `0.1.0`.

### `ui.product-craft`

Use for authenticated application pages, navigation, settings, workspaces, dashboards,
and visual redesigns.

Owns hierarchy, composition, visual density, responsive layout, concise page content
roles, and rendered anti-slop review.

Prevents generic machine dashboards, card and border soup, excessive pills, giant
headings, arbitrary weights, weak alignment, repeated page nouns, compressed mobile
layouts, and unexplained design-system overrides.

Does not own component APIs, flow state machines, public narrative, technical SEO, or
production operations.

### `web.public-page-craft`

Use for landing, pricing, product, campaign, editorial, documentation, or search-intent
pages whose job is explanation, discovery, persuasion, or conversion.

Modules cover audience and one-page promise, narrative sequence, claims and proof, CTA
and trust architecture, content structure, discoverability, and public-page review.

Prevents generic gradient heroes, vague transformation claims, feature-grid dumping,
invented evidence, repeated CTAs, keyword soup, decorative screenshots, and sections
without narrative purpose.

It owns the human narrative side of discoverability. Crawl, canonical, schema, and link
verification remain Actions and Guards.

`ui.product-craft` and `web.public-page-craft` are normally mutually exclusive primary
surface packs.

### `frontend.component-evolution`

Use for reusable components, shared variants, component refactors, public component
APIs, and design-system work.

Modules cover catalog-first discovery, reuse versus variant versus composition versus
new ownership, semantic API and state design, durable naming, ownership, and clean
cutover.

Prevents duplicate wrappers, local forks, prompt-shaped names such as
`AdvancedSidebarWithMotion`, boolean-prop soup, premature abstraction, variant
explosion, and mega-components.

Do not load for ordinary page assembly using accepted primitives.

### `ux.flow-integrity`

Use for onboarding, authentication, checkout, multi-step forms, imports, exports,
permissions, async operations, and destructive or financial actions.

Modules cover journey and state topology, validation, work preservation, recovery,
continuity, consequences, consent, privacy, and financial trust.

Prevents happy-path-only flows, modal piles, giant front-loaded forms, unexplained
disabled actions, lost input, vague errors, useless confirmation dialogs, late
permission failures, and missing retry, undo, back, resume, or next-step behavior.

### `accessibility.interaction-semantics`

Use for custom widgets, dialogs, popovers, menus, comboboxes, drag-and-drop, focus
management, live updates, and motion-dependent interactions.

Modules cover native or project primitive choice, keyboard behavior, focus movement
and return, state announcements, touch, zoom, reflow, motion alternatives, and
assistive-technology proof.

Prevents div-based controls, focus loss and traps, hover-only behavior, drag-only
actions, ambiguous state, inaccessible async feedback, and unnecessary ARIA.

Basic conformance remains Policy and Guard territory; this pack supplies judgment for
complex interaction semantics.

### `performance.route-delivery`

Use for new routes, server/client boundaries, data loading, caching, media, fonts,
animation, third-party scripts, bundles, and Core Web Vitals concerns.

Modules cover render and execution boundaries, dependency and cache topology, loading,
perceived performance, failure resilience, asset budgets, and third-party budgets.

Prevents whole-route client rendering for one interaction, fetch waterfalls, full-page
spinners, skeleton theatre, layout shift, oversized assets, heavy dependencies for
small behavior, blocking analytics, and caching without an invalidation owner.

Measurements and blocking budgets remain Actions and Guards.

### `security.trust-boundary-review`

Use only for explicit authentication, authorization, session, personal-data, upload,
webhook, payment, public-mutation, third-party integration, admin, or impersonation
signals.

Modules cover actors, assets, trust boundaries, resource ownership, input and output
boundaries, redirects, uploads, secrets, sensitive data, abuse, replay, throttling,
idempotency, privacy, consent, audit, and safe failure.

Prevents client-only authorization, resource leakage, trusted ownership fields,
sensitive logs, unsafe redirects and uploads, invented security guarantees, unaudited
administrative effects, and retryable financial effects without idempotency.

Hard requirements remain Policies and Guards; this pack supplies task-specific threat
and boundary judgment.

### `ui.data-experience`

Keep evidence-gated until repeated accepted failures justify it. Use for analytics,
reports, dense tables, filtering, comparison, bulk selection, charts, and metric
surfaces.

Modules cover decision-first information models, density and scanning, filter and
selection continuity, responsive tables and lists, metric truth, freshness, units,
time windows, and partial failure.

Prevents KPI-card soup, decorative charts, missing units, fake precision, resetting
filters, mobile table failure, stale data presented as current, and conflated zero,
empty, unknown, and error states.

## Skills Not To Add Initially

Do not add generic:

1. React basics
2. TypeScript best practices
3. clean code
4. responsive design
5. testing basics
6. SEO basics
7. security basics
8. motion
9. one Skill per component library
10. one complete-website mega Skill

Potential future packs remain evidence-gated:

1. `web.internationalization` after real locale, RTL, translation, formatting, and
   content-expansion failures exist
2. `product.measurement-integrity` after analytics or experiment-quality failures
3. `testing.behavior-strategy` only when agents repeatedly choose the wrong proof layer
   despite accepted progressive validation
4. `operations.production-change` only when deployment, migration, rollback, and
   observability judgment repeatedly fails
5. `search.discovery-architecture` only when public-page craft plus technical search
   Actions and Guards prove insufficient

## Existing Policy-Pack Improvements

### `architecture.mid-app`

1. select only after project-shape discovery
2. map roles to accepted local ownership instead of enforcing template folders
3. keep dependency direction and generated-output ownership deterministic
4. prove both greenfield and messy-brownfield adaptation

### `clean-code.maintainability`

1. remove generic textbook explanation from agent-facing context
2. retain touched-scope discipline, duplicate ownership, proven sharing, generated
   ownership, project-enforceable naming, and focused proof
3. move subjective component and interface judgment to Skills
4. move detectable violations to Guards

### `stack.async-work`

1. strengthen positive and negative selection signals
2. bind to accepted project stack and operational owners
3. require local development, deployment, monitoring, and recovery ownership
4. never infer Redis, a queue, or a workflow engine from fashionable terminology

### `verification.progressive-validation`

1. preserve it as a core Policy rather than creating a generic testing Skill
2. select affected-scope and dependency-aware Actions
3. keep exact Evidence reuse reliable
4. stop after the first failing check and resume after repair
5. separate normal Task proof from explicit project integration or release proof

## Project-Bound Action And Guard Roles

Packs may reference roles for:

1. responsive browser capture
2. keyboard interaction smoke proof
3. accessibility scan
4. focused frontend tests
5. bundle analysis
6. Lighthouse or Web Vitals capture
7. technical search validation
8. structured-data validation
9. broken-link and canonical checks
10. security and secret scans
11. production smoke and health checks
12. migration dry run
13. rollback rehearsal

Projects bind only capabilities they actually own. Skopos does not create placeholder
commands to satisfy a pack. One broad `run everything` Action is not the target.

Guards may require fresh proof for type safety, rendered behavior, accessibility,
component duplication, performance budgets, technical search health, sensitive
surfaces, generated ownership, public API changes, migrations, and release publication.

## Research And Freshness

Prefer primary and normative sources:

1. Apple Human Interface Guidelines, Samsung One UI writing, and Material content
   guidance for interface craft and writing
2. WCAG, ARIA Authoring Practices, and WAI tutorials for accessibility
3. GOV.UK Service Standard and user-needs guidance for product and service flows
4. WHATWG HTML and official framework documentation for browser and rendering
   boundaries
5. Web Vitals and official browser guidance for performance
6. OWASP ASVS and NIST Privacy Framework for security and privacy
7. Google Search Essentials for public discovery
8. Testing Library and Playwright official guidance for behavior proof
9. Google SRE and OpenTelemetry for production operations
10. W3C Internationalization for future locale support

Review framework and tool sources every three to six months, product guidance every six
to twelve months, normative standards when a relevant revision lands, and bound
project sources immediately when their digest changes.

Research summaries remain concise and source-owned. Do not paste large external guides
into pack modules.

## Work Phases

### Phase 0: restore proof reliability

1. fix the self-hosted derived-output Evidence cycle
2. prove refresh remains valid after Task linking and repeated closure verification
3. prove genuine source or semantic projection changes still invalidate Evidence
4. close the active Product UI Craft Task once its existing proof is valid

### Phase 1: record and hard-cut the first canonical model

1. update Decision 040, the active Findings, and this Plan — complete
2. hard-cut model and validation contracts in place under `schemaVersion: 1` — complete
3. remove obsolete selection and compatibility behavior — complete
4. update every current pack and project binding to `0.1.0` — complete
5. regenerate canonical projections once — complete

### Phase 2: complete Task-aware selection

1. build the complete Task signal envelope — complete for currently available signals
2. implement structured eligibility and anti-signal suppression — complete
3. add module-local role and rubric ownership — complete
4. enforce Task-wide measured budgets — complete
5. add structured explanations and exact caching — explanations complete; exact caching pending

### Phase 3: build economical evaluation

1. add static pack and binding validation
2. add deterministic selection fixtures
3. add paired isolated forward-test support
4. add blinded module-specific review
5. bind evaluation Evidence and human acceptance to exact source digests

### Phase 4: certify Product UI Craft

1. refocus pack ownership
2. replace prose fixtures with runnable and rendered artifacts
3. bind truthful visual, interaction, accessibility, and build proof
4. compare against no Skill
5. canary in Skopos
6. prove one packed non-Skopos adoption

### Phase 5: add core packs sequentially

Implement and validate in this order:

1. `web.public-page-craft@0.1.0`
2. `frontend.component-evolution@0.1.0`
3. `ux.flow-integrity@0.1.0`
4. `accessibility.interaction-semantics@0.1.0`
5. `performance.route-delivery@0.1.0`
6. `security.trust-boundary-review@0.1.0`

Each pack completes research, boundary design, static proof, deterministic fixtures,
paired evaluation, project binding, and external canary before the next pack begins.

### Phase 6: consider specialist packs from evidence

1. review accumulated accepted failure signals and correction classifications
2. add `ui.data-experience@0.1.0` only when evidence supports it
3. propose any later pack only when existing Memory, Policies, Actions, Guards, and
   validated Skills cannot address the repeated judgment gap economically
4. retire guidance whose value disappears as coding-agent baselines improve

## Exact Implementation Order

1. fix derived-output Evidence freshness
2. close and integrate current Product UI Craft content work
3. commit the Decision, Findings, and this Plan
4. hard-cut the Skill model and loader in place
5. hard-cut Task signal collection and selection
6. add module-local context and capability ownership
7. add Task-wide measured budgets
8. add exact selection caching and explanation
9. bind acceptance to source and evaluation digests
10. add deterministic fixture discovery and execution
11. add paired forward-test and blind review support
12. refocus and reset Product UI Craft to `0.1.0`
13. validate Product UI Craft in Skopos and one external project
14. add core packs one at a time in the Phase 5 order
15. evaluate real cost and correction data before any specialist expansion

## Definition Of Done For Every Pack

A pack is complete only when it has:

1. one narrow judgment purpose
2. explicit ownership and exclusions
3. positive and negative structural signals
4. module-local project roles
5. module-local Action and Guard roles
6. module-local rubric dimensions and failure signals
7. actual measured context size
8. Task-wide budget compliance
9. authoritative provenance and freshness dates
10. positive, negative, ambiguous, overlap, generated, and budget fixtures
11. runnable behavioral fixtures
12. paired no-Skill or prior-source evaluation
13. blind review where judgment is subjective
14. one Skopos and one external-project proof for reusable packs
15. exact content-bound human acceptance
16. host projection parity
17. no authority capture
18. valid Skopos Task Evidence and Readiness closure

## Program Completion

This Plan is complete when:

1. the self-hosted Evidence cycle is closed
2. one canonical first-version Skill model exists with no compatibility residue
3. irrelevant Tasks receive zero Skill context
4. Task-wide measured budgets and latency targets hold at representative catalog size
5. Product UI Craft and every accepted core pack prove material targeted improvement
6. project-specific context remains authoritative and compact
7. selection, suppression, cost, capabilities, and acceptance are fully explainable
8. packed external adoption works without the source checkout
9. no pack owns Task state, execution, Evidence, Readiness, or closure
10. catalog expansion stops when another pack would not add measurable judgment
