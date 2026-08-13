---
title: "Public Skopos Homepage"
status: active
owner: skopos-core
id: "P-7dde6750"
scope: "skopos"
role: plan
lifecycle: active
authority: canonical
provenance: accepted
view: target
lastUpdated: 2026-08-13
---

# Public Skopos Homepage

## Changelog

- `2026-08-13`: Aligned the active homepage Plan with the truthful pre-release
  candidate. The site names `@unisane/skopos@next` as the planned first-release channel,
  links status to release progress, and does not claim that the package is already
  available.
- `2026-08-11`: Reconciled the production candidate without redesigning it. Replaced
  the false `Read the product model` hero jump with the real target document, linked
  npm/source/release destinations through one content owner, added the intentional
  code-owned application icon, and added focused destination proof. These target
  links become publicly usable only after the repository and package are public. The
  Plan remains active for independent comprehension/trust review and the separate
  hosting/domain contract.

- `2026-08-11`: Clarified that this Plan owns the homepage milestone only. It does not
  declare the broader `skopos-web` application complete; future documentation,
  release, support, account, product, or other public-web surfaces retain their own
  Plans, Tasks, and proof.
- `2026-08-10`: Refined the accepted Project Dossier direction after rendered review:
  removed the persistent marketing rail, aligned every section to one shared frame,
  made actions monochrome by surface, and changed blue-slate product panels to neutral
  near-black while retaining color only for diagram and semantic state signals.
- `2026-08-10`: Selected the polished Project Dossier visual direction and delivered
  the responsive `apps/web` prototype through `T-b225439d`; side-by-side Product
  Design QA passed.
- `2026-08-10`: Defined the feature-first component tree, import direction, registry
  ownership, Server and Client Component boundary, and shared-promotion rule for
  `apps/web`.
- `2026-08-10`: Accepted `apps/web` as the separate public application boundary and
  Next.js, TypeScript, React, Tailwind CSS, and reviewed app-owned UI primitives as the
  homepage stack.
- `2026-08-10`: Replaced the generated scaffold with the accepted homepage product,
  copy, interaction, visual-direction, delivery, and proof contract.
- `2026-08-10`: Created and accepted this Plan through Skopos.

## Goal

Design and deliver a concise, product-led public homepage that helps a developer
understand Skopos quickly, see one truthful workflow, and take an appropriate next
action while the product remains pre-release.

## Plan Boundary

This Plan owns one public homepage and its release integration. Completion of this Plan
does not mean that `apps/web`, the public documentation experience, release surfaces,
support content, future authenticated products, or any broader Skopos web program is
complete. Those surfaces require their own accepted direction, bounded Tasks, and
Evidence when they enter scope.

No Decision should use homepage completion as a proxy for completion of the broader
web product.

## Outcome

At completion:

1. Skopos has a public homepage surface separate from the local supervision console.
2. a new visitor can explain what Skopos does, for whom, and why it matters after the
   hero and primary product workstream
3. the page presents one coherent narrative rather than a feature-card catalog
4. product claims, terminology, coordination limits, and release status match canonical
   Project Memory
5. the page works at wide, intermediate, and narrow widths with accessible interaction
6. calls to action are truthful for the current release state
7. the selected visual direction is original, project-grounded, and verified against
   equivalent rendered evidence

## Primary Audience And Conversion

Primary audience:

1. developers and technical founders already using coding agents on real repositories
2. engineering teams coordinating several coding-agent Sessions
3. maintainers of monorepos and inconsistent brownfield projects

The visitor's current problem is not code generation alone. It is repeated project
rediscovery, lost Task intent, conflicting instructions, wrong or excessive checks,
parallel-agent interference, and completion without sufficient proof.

The homepage conversion contract is:

1. primary action while pre-release: `Explore the workflow`
2. secondary action: `Read the product model` or inspect the source workspace
3. closing action: follow release progress
4. public installation becomes the primary action only after an approved release
   candidate and public package exist

The checked-in implementation is a truthful pre-release candidate. It names
`@unisane/skopos@next` as the planned first-release channel, marks the install path as
planned, and directs status clicks to public release progress. It must not claim npm
availability or make the npm package page the release-status destination until
registry verification passes. Showing the planned command is not proof that npm
publication has already happened.

## Messaging Contract

The page introduces Skopos in this order:

1. **Human outcome** — the project remembers and the work continues
2. **Market category** — repo-native infrastructure for agentic engineering
3. **Concrete mechanism** — relevant context, bounded Tasks, project-owned rules,
   cooperative coordination, and evidence-backed completion
4. **Canonical vocabulary** — Project Memory, Scope, Task, Session, Action, Guard,
   Evidence, and Readiness only after the visitor understands their purpose

Recommended hero direction:

- eyebrow: `Repo-native infrastructure for coding agents`
- headline: `Agents change. The project remembers.`
- explanation: `Skopos keeps project knowledge, task intent, project-specific checks,
  and proof with the repository—so coding agents can continue real work without
  starting over.`
- primary action: `Explore the workflow`
- secondary action: `Read the product model`
- status: `First release targets npm @next.`

Final copy may improve this wording, but it must preserve the same hierarchy, truth,
and action contract.

Copy budgets:

1. hero headline: at most 9 words
2. hero explanation: approximately 25–32 words
3. section headline: 4–9 words
4. section explanation: approximately 25–40 words
5. complete narrative copy: approximately 450–550 words, excluding product-demo labels
6. one dominant action per viewport and one idea per section

Each string has one role: orient, title, explain, act, report, label, or recover.
Repeated promises, vague actions, implementation language, and stacked category jargon
fail review.

## Page Narrative

The homepage uses at most six substantial sections:

1. **Hero**
   - answer what Skopos is, who it is for, and why it matters
   - place the product workstream at or immediately below the fold
2. **Live workstream**
   - show one fresh coding-agent Session resuming an interrupted, bounded Task
   - let the visitor move through `Recover context`, `Keep the Task bounded`,
     `Run the right checks`, and `Explain Readiness`
3. **Remember**
   - headline direction: `Continue the work, not the conversation.`
   - connect repository-owned Memory, Task intent, Decisions, and handoff without
     replaying a transcript
4. **Coordinate**
   - headline direction: `Use your project's rules. Share one view of the work.`
   - introduce project Actions, Guards, Policies, ownership, and cooperating Sessions
   - explain the compact logic: `Actions do. Guards decide. Evidence proves.`
5. **Prove**
   - headline direction: `Done needs evidence.`
   - show why one focused check is required, why one broad check is skipped, and how
     Readiness changes from blocked to ready
6. **Product boundary and closing action**
   - headline direction: `The agent works. Skopos keeps the work coherent.`
   - distinguish what the coding agent does from what Skopos preserves and verifies
   - close with the truthful pre-release action

Navigation stays minimal: Product, Workflow, Product model or Docs, Release, and one
primary action. The page does not add a broad marketing navigation system before the
public documentation and release destinations are confirmed.

## Primary Product Workstream

Use one believable workflow instead of several unrelated screenshots. The default
scenario is a fresh Session resuming an interrupted checkout-recovery Task.

The four states must update one coherent product environment:

1. `Recover context`
   - relevant tracked Project Memory, Decisions, Task state, and remaining work appear
2. `Keep the Task bounded`
   - goal, acceptance, non-goals, owned paths, and current responsibility stay visible
3. `Run the right checks`
   - a focused project Action is required and an unrelated broad Action is skipped with
     an explicit reason
4. `Explain Readiness`
   - missing Evidence blocks Task closure; current Evidence changes the same Task to a
     plainly explained ready state

The demonstration uses current Skopos terminology and plausible source-bound state. It
must not place durable Memory only under `.skopos/**`, imply preventive filesystem
safety, or confuse Task closure with Project integration or release Readiness.

## Visual And Interaction Direction

The recommended starting direction is editorial developer infrastructure:

1. warm neutral canvas with a near-black product environment
2. strong ink typography plus mono for commands, paths, Evidence, and status
3. one cool signal color reserved for current or ready state
4. one restrained warm exception role for blockers
5. thin structural rules, generous editorial space, modest corners, and limited depth
6. hierarchy carried by order, type, spacing, and alignment before decoration
7. real product state as the primary visual proof

Do not ship:

1. feature-card walls, excessive pills, or nested container chrome
2. purple gradients, glowing orbs, glass panels, decorative 3D, or generic AI imagery
3. fake customer logos, testimonials, metrics, integrations, or security claims
4. tiny terminal or console imagery that looks technical but cannot be understood
5. an unmodified internal-console composition as the public marketing surface
6. a visual identity copied from another developer-product company

The existing light and dark landing-page evaluation artifacts are supporting evidence,
not reusable authority. Retain the light direction's editorial clarity and the dark
direction's single continuous workstream. Reject their excessive length, generic dark
developer styling, low-contrast miniature UI, stale `.skopos/**` Memory examples, and
weak pre-release actions.

Before implementation, create exactly three original visual directions from the
accepted copy architecture. Do not initialize the production site until one direction
is selected.

## Responsive And Accessible Behavior

1. wide layout may keep the workstream visible while its narrative state advances
2. intermediate layout must remain fully legible rather than becoming a compressed
   desktop console
3. narrow layout becomes a deliberate sequence prioritizing status, reason, required
   action, and next step
4. the stage switcher is keyboard accessible and user-controlled
5. no automatic carousel or scroll hijacking owns the core experience
6. motion communicates continuity, selection, and state and respects
   `prefers-reduced-motion`
7. focus, contrast, semantic structure, scroll ownership, and every interactive state
   receive rendered proof

## Skill And Project-Design Contract

Homepage Tasks must use the accepted `ui.product-interface-design` Skill for structure,
interface language economy, responsive behavior, component reuse, accessibility, and
rendered finish.

The Skill does not own public marketing narrative or conversion strategy. Those remain
grounded in canonical Skopos Vision, Positioning, Overview, README, product terminology,
current release truth, and reviewed market evidence.

Before Skill-backed implementation proof, resolve the current pack/binding identity:
the project binding identifies accepted version `0.3.0`, while the checked-in pack
source identifies `0.4.0`. Selection, implementation, and proof must use one exact
accepted identity.

Reuse project semantic tokens and appropriate components where their roles fit, but do
not treat the private console layout as automatic public-site design truth. The public
surface uses the explicit application, route, asset, and sharing boundary below.

## Application And Stack Decision

The public site will be a separate deployable application with this boundary:

1. application root: `apps/web`
2. private workspace package: `@skopos/web`
3. public homepage route: `/`
4. target Scope: `skopos-web`, declared as an application Scope when the app is
   scaffolded, with durable Memory under `docs/scopes/skopos-web`
5. deployment root: `apps/web`, independent from the CLI package and local console

`packages/ui` remains the private, Vite-built, local supervision console. The public
site must not import `@skopos/ui`, reach into its source tree, consume compiled local
project state, or become part of the CLI's bundled console output.

The accepted application stack is:

1. Next.js App Router
2. TypeScript
3. React 19, aligned with the workspace
4. Tailwind CSS 4
5. app-owned source components and semantic theme
6. pnpm workspace scripts and focused Skopos Actions and Guards

Pin the exact compatible framework versions during the scaffold Task. Start with
static-first rendering: Server Components for page structure and content, and Client
Components only for the interactive product workstream and controls that need browser
state. Keep the first homepage export-ready and free of a database, authentication,
application API, or Skopos runtime dependency. Use Next.js metadata, icon, social-image,
font, sitemap, and robots conventions rather than parallel custom owners. Keep image
handling and social assets compatible with static export.

Reusable UI source is reviewed into and owned by the application:

1. keep `apps/web/ui-registry.json`, the semantic theme and tokens, and reviewed reusable
   primitives owned inside `apps/web`
2. install only primitives selected by the accepted visual direction; do not copy the
   complete registry speculatively
3. keep public npm dependencies declared by `@skopos/web`
4. do not import private packages or copy components from `packages/ui`
5. review every new source contribution and its license/provenance

The app owns reusable component behavior, accessibility, semantic tokens, theming,
states, responsive defaults, homepage narrative, information hierarchy, product
workstream, marketing compositions, brand assets, and public claims.

Add `apps/*` to the pnpm workspace when scaffolding begins. Workspace build and
typecheck should include `@skopos/web`, while website deployment remains independent
from npm publication and must never cause the web app to enter the CLI tarball. The
hosting provider and public domain remain a separate deployment Decision; static-first
output preserves provider choice.

## Source And Component Architecture

Use a feature-first source tree. Do not create a flat `components/marketing` bucket or
copy every layer of the larger internal console into a one-page public site.

Target initial shape:

```text
apps/web/
  public/
    brand/
  src/
    app/
      layout.tsx
      page.tsx
      globals.css
      icon.svg
      opengraph-image.png
      robots.ts
      sitemap.ts
    features/
      homepage/
        index.ts
        homepage-screen.tsx
        content/
          homepage-copy.ts
        sections/
          hero-section.tsx
          product-workstream-section.tsx
          promises-section.tsx
          product-boundary-section.tsx
          closing-cta-section.tsx
        workstream/
          workstream-demo.tsx
          workstream-stage.tsx
          workstream.model.ts
        __tests__/
    patterns/
      site/
        site-header.tsx
        site-footer.tsx
        section-shell.tsx
    components/
      ui/
    platform/
    support/
  ui-registry.json
```

Create `platform/` and `support/` children only when a real owner exists; empty
architecture folders are not progress. The initial ownership rules are:

1. `app/` owns Next.js routing, layouts, metadata files, global theme entry, and thin
   framework composition. `page.tsx` imports the homepage feature and contains no
   section implementation.
2. `features/homepage/` owns homepage copy, section composition, the product workstream
   model and interaction, feature-specific components, and focused tests.
3. `features/homepage/index.ts` is an intentional small public surface. Code outside
   the feature does not deep-import its private sections or workstream internals.
4. `patterns/site/` owns stable site-shell and repeated marketing-layout grammar. It
   contains no homepage-only claims or product state.
5. `components/ui/` and registry-declared transitive support own reviewed UI primitives
   only. Product copy, Skopos workflow logic, and one-off marketing
   sections do not enter the registry layer.
6. `platform/` owns real external bridges such as analytics or public content clients
   only after their contracts are accepted. It does not own presentation logic.
7. `support/` owns stable, domain-neutral cross-feature utilities only. Do not create
   `helpers`, `common`, `misc`, or an unrestricted `lib` bucket.
8. `public/brand/` owns static public brand assets. Generated or code-owned Next.js
   metadata assets remain in `app/` under their framework conventions.

Preferred import direction:

```text
app -> features / patterns / components-ui / platform / support
features -> patterns / components-ui / platform / support
patterns -> components-ui / support
platform -> support
components-ui -> registry support only
support -> no app, feature, pattern, or platform imports
```

One feature may not import another feature's private internals. A component stays in
its owning feature until at least two real consumers need the same stable meaning;
then promote it deliberately to `patterns/`, `components/ui/`, or `support/` according
to its responsibility. Do not use broad barrels that re-export private files.

React Server Components are the default. Add `use client` only to the smallest leaf
that owns browser interaction, such as the workstream stage controller. The homepage
screen, copy, and static sections must not become Client Components merely because one
demonstration is interactive. Pass serializable content into client leaves and keep
animation state local to the owning feature.

Use kebab-case filenames, explicit responsibility-bearing names, and named exports for
application code. Next.js convention files retain their required default exports.
Tests stay with the owning feature or boundary and verify behavior and copy contracts,
not private implementation details.

## Delivery Status

Completed on `2026-08-10`:

1. established `apps/web` and the `skopos-web` Scope as the public application boundary
2. implemented the reviewed homepage narrative and product workstream in the public app
3. selected the polished Project Dossier direction: compact top navigation, warm paper
   canvas, neutral-black product surfaces, monochrome actions, one shared content frame,
   repository-truth hero, continuous workstream, and numbered narrative bands
4. delivered and browser-proved the interactive responsive prototype at wide,
   intermediate, and narrow widths through Task `T-b225439d`
5. completed side-by-side Product Design QA with a final result of `passed`

Still required before public release:

1. independent five-second comprehension and trust review
2. make the already-wired documentation, source, npm, and release destinations public
   as part of repository/package release sequencing
3. hosting provider, domain, and deployment integration
4. intentional favicon and social-preview assets after their brand direction is accepted
5. an analytics and privacy decision only if analytics are proposed
6. adoption of the homepage candidate by the release Plan

## Workstreams And Task Sequence

### 1. Public Surface And Claim Contract

1. scaffold the accepted `apps/web` owner, `/` route, static-first build, and
   `skopos-web` Scope boundary
2. keep the private local console state-dependent and separate
3. compile an approved claims matrix from canonical Project Memory
4. confirm pre-release destinations and analytics/privacy expectations
5. prove workspace health includes the web app without coupling web deployment to npm
   publication or CLI bundling

Exit gate: the public boundary and every allowed claim and action are explicit.

### 2. Homepage Copy Deck

1. write navigation, hero, section, workstream, product-state, CTA, footer, metadata,
   accessibility, and social-preview copy
2. enforce the messaging order and copy budgets in this Plan
3. review every claim against current product and release truth
4. run a five-second comprehension review with people unfamiliar with Skopos

Exit gate: a reader understands audience, problem, product mechanism, differentiation,
and next action without internal documentation.

### 3. Visual Direction Selection

1. generate exactly three original visual directions using the approved copy deck
2. ground them in project tokens, useful console precedents, and real product state
3. compare hierarchy, character, product legibility, responsive transformation, and
   truthful conversion
4. select one direction before production UI begins

Exit gate: one reviewed visual source owns implementation fidelity.

### 4. Interactive Responsive Prototype

1. build the selected direction as a separate public prototype
2. implement the accepted feature-first component boundary before page composition
3. implement the four-state product workstream and all core navigation and actions
4. use realistic Skopos state and complete blocked, ready, focus, and reduced-motion
   behavior
5. capture equivalent wide, intermediate, and narrow views

Exit gate: the prototype communicates the product through use, not explanatory volume.

### 5. Product Design And Conversion Review

1. compare selected visual and rendered implementation at equivalent states and sizes
2. run hierarchy, language, accessibility, responsive, performance, and claim audits
3. conduct independent human review for comprehension and trust calibration
4. revise until all material findings close or become explicit limitations

Exit gate: product, design, accessibility, and conversion review support implementation.

### 6. Production Delivery And Release Integration

1. implement the approved public-site boundary without coupling it to local console
   state
2. add intentional logo, favicon, social image, metadata, and public assets
3. wire real documentation, source, workflow, and release destinations
4. add proportionate analytics only after privacy and retention decisions are accepted
5. register focused project Actions and Guards for build, responsive capture,
   accessibility, links, claims, and release surface
6. update README, package metadata, docs routes, and release documentation only where
   the homepage changes public truth

Exit gate: the built homepage passes focused proof and is included intentionally in the
approved public release candidate.

## Proof Matrix

| Proof | Must establish |
| --- | --- |
| five-second comprehension | visitor can explain what Skopos does and for whom |
| claims audit | every statement maps to current canonical or accepted target truth |
| terminology review | human value appears before canonical nouns and category jargon |
| copy-role review | no repetition, vague action, false certainty, or technical leakage |
| interaction proof | stage, readiness, navigation, focus, and action states work |
| responsive proof | equivalent wide, intermediate, and narrow experiences pass |
| accessibility proof | semantic structure, keyboard, focus, contrast, reduced motion, and automated audit pass |
| component-boundary proof | routes stay thin, homepage logic remains feature-owned, registry UI remains product-neutral, and imports follow the accepted direction |
| product boundary review | agent and Skopos responsibilities remain distinct |
| coordination truth review | cooperative behavior is not described as preventive isolation |
| release truth review | pre-release and installation claims match the candidate state |
| clean public build | public surface builds without private workspace or source-checkout assumptions |

## Decisions

Accepted for this Plan:

1. keep the Plan at workspace Scope because it coordinates product positioning, public
   site ownership, UI foundations, docs, and release integration
2. narrow each implementation Task to its actual declared Scope and owned paths
3. create a separate public surface rather than turning the local supervision console
   root into a marketing homepage
4. treat the homepage as an intentional public contract while leaving CLI, MCP, SDK,
   and local-console contracts unchanged unless a later explicit Decision says otherwise
5. own the public site in `apps/web` as private workspace package `@skopos/web`, with
   `/` as the homepage and `skopos-web` as its target application Scope
6. use Next.js App Router, TypeScript, React 19, Tailwind CSS 4, and app-owned UI
   components and semantic theme
7. keep v1 static-first, export-ready, and free of backend, authentication, database,
   or Skopos runtime dependencies
8. include the web app in workspace health checks while keeping deployment and npm/CLI
   publication boundaries independent
9. organize `apps/web` feature-first: thin App Router files, one homepage feature,
   stable site patterns, registry-owned UI primitives, and no generic shared buckets
10. use the selected polished Project Dossier direction: compact top navigation, warm
    paper canvas, neutral-black product surfaces, monochrome actions, one shared content
    frame, repository-truth hero, continuous workstream, and numbered narrative bands

Still required at their relevant workstream gates:

1. hosting provider, public domain, and deployment configuration
2. accepted Product Interface Design pack identity
3. final public docs, source, workflow, and release destinations
4. independent comprehension and trust review
5. intentional favicon and social-preview brand assets
6. analytics and local/public privacy boundary, if analytics are proposed

## Non-Goals

1. publish Skopos before the release Plan passes
2. claim production maturity, customer adoption, performance gains, or certification
   without Evidence
3. replace the coding agent, local console, documentation, or README with the homepage
4. expose private `.skopos/**` artifacts or source-workspace assumptions publicly
5. build a generic CMS, blog, broad docs portal, pricing system, or account product
6. optimize for every possible audience at the expense of the primary developer story
7. encode the complete Skopos product model above the fold

## Risks And Controls

| Risk | Control |
| --- | --- |
| homepage becomes a long specification | six-section limit, copy budgets, one workstream |
| buzzwords replace understanding | outcome first, category second, canonical vocabulary third |
| attractive mockup misstates product truth | claims matrix and canonical-state fixture |
| visual direction converges on generic developer SaaS | three original directions and explicit anti-pattern review |
| internal console and public site become coupled | explicit separate owner and build boundary |
| pre-release page implies installation or maturity | release-state-aware actions and status copy |
| coordination sounds stronger than implemented | cooperative-language review |
| mobile becomes compressed desktop | narrow-first workstream recomposition |
| Skill proof uses stale acceptance | exact pack/binding identity resolution before selection |
| homepage blocks current release work | child Tasks with narrow ownership and Task-local proof |

## Definition Of Done

This Plan is complete only when:

1. all six workstreams meet their exit gates
2. the public boundary and final visual direction are accepted
3. canonical claims, status, and CTA destinations are current
4. the page passes the complete proof matrix
5. tracked docs and package metadata agree with the shipped public surface
6. no unrelated dirty-worktree changes enter homepage proof
7. the release Plan intentionally adopts the homepage candidate
8. remaining limitations are explicit and do not undermine the homepage's core promise

## Next Work

Run an independent five-second comprehension and trust review, then decide the
hosting/domain contract. The target documentation, source, npm, and release URLs are
now wired and must be checked again after those destinations become public. The
delivered local candidate is the accepted implementation baseline; do not redesign it
while closing these release-only gaps.
