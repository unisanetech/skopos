---
title: "Public Web Information Architecture And Content Plan"
status: active
owner: skopos-core
id: "P-20260812-PUBLIC-WEB-CONTENT"
scope: "skopos"
role: plan
lifecycle: active
authority: canonical
provenance: accepted
view: target
implementationStatus: planned
lastUpdated: 2026-08-13
relatedDocs:
  - P-7dde6750-design-and-deliver-the-public-skopos-homepage.md
  - ../../domains/product/vision.md
  - ../../domains/product/positioning.md
  - ../../overview.md
  - ../../guides/developer-workflows.md
  - ../../architecture/docs-governance.md
  - ../../architecture/evidence-and-readiness-model.md
  - ../../operations/first-public-release-scorecard.md
  - ../../decisions/D-20260813-company-ownership-and-first-release-host-support-boundary.md
reviewCycle: when the public product story, supported-host proof, or documentation model changes
---

# Public Web Information Architecture And Content Plan

## Changelog

- `2026-08-13`: Bound the `/agents` story to the accepted Codex-first support matrix.
  Codex is certified; Claude Code, Cursor, and GitHub Copilot remain unverified and
  may not receive logo-implied support or parity claims.
- `2026-08-12`: Created and accepted the broader public-web information architecture,
  route-level copy contract, conversation-first documentation model, content
  governance, and staged delivery backlog. This Plan preserves the existing
  `apps/web` boundary and keeps the independently owned homepage Plan active.

## Goal

Build a restrained, production-quality public website that lets a developer:

1. understand Skopos in under one minute
2. see why repository instructions or chat memory alone do not maintain project truth
3. understand how Skopos supports ordinary discussion with a coding agent
4. evaluate its ownership, enforcement, proof, and host-support boundaries honestly
5. adopt it through a clear quickstart
6. find task-oriented, conceptual, and reference documentation without learning the
   entire internal artifact model first

## Plan Boundary

This Plan owns the information architecture and content contract for the broader
public Skopos website. It does not declare the public web application complete.

The existing `P-7dde6750` Plan continues to own the homepage milestone and its
independent visual, interaction, accessibility, link, and hosting proof. This Plan
owns the relationship between that homepage and the future product, use-case,
compatibility, trust, documentation, and changelog surfaces.

Completion of one route, one delivery phase, or this content Plan is not a Decision
that every future Skopos web surface is complete. Future account, support, hosted
product, community, pricing, enterprise, or other public-web surfaces require their
own accepted direction and bounded proof when they enter scope.

This Plan preserves:

1. the separate `apps/web` application boundary
2. the current Next.js and feature-first component direction
3. the repository-native core product boundary
4. the canonical product vocabulary and release claims
5. the rule that public claims remain limited to passed proof

## Product Story

### Canonical headline

> Your agents write the code. Skopos keeps the work coherent.

### Canonical short explanation

> Plans, decisions, project rules, active work, and proof stay with your
> repository—so coding agents can continue real work without rebuilding context from
> scratch.

### Canonical one-sentence description

Skopos keeps the knowledge behind a software project inside the repository so a
supported coding agent can understand the relevant truth, continue bounded work,
follow project rules, and show fresh proof before calling that work complete.

### Narrative order

Public content introduces the product in this order:

1. **The human problem** — every new chat or agent starts with less project context
   than the project itself contains.
2. **The primary outcome** — the project retains its knowledge and the work can
   continue.
3. **The category** — Skopos is a repo-native operating Memory and trust layer for
   coding agents.
4. **The working loop** — relevant context, bounded intent, project capabilities,
   fresh proof, Memory review, and continuation.
5. **The product model** — Project Memory, Scope, Task, Session, Action, Guard,
   Evidence, and Readiness only after their purpose is clear.

Skopos is not introduced as a larger instruction file, chat-history replacement,
generic wiki, project manager, coding agent, model provider, or invisible automatic
memory collector.

## Audience And Visitor Questions

### Primary audience

1. developers and technical founders using coding agents on real repositories
2. maintainers returning to long-running projects across fresh agent Sessions
3. teams running several supported coding-agent Sessions against shared project state
4. maintainers adopting agents into monorepos or inconsistent brownfield projects
5. open-source projects that want vendor-neutral, repository-owned guidance and proof

### Questions the site must answer

1. What is Skopos, in plain English?
2. Why is an `AGENTS.md`, `CLAUDE.md`, chat history, or agent memory not enough by
   itself?
3. Does Skopos write code or replace my coding agent?
4. What does it store in my repository?
5. How does Project Memory remain current?
6. Can I use it through normal conversation with my agent?
7. Which coding-agent hosts are actually supported, and at what capability level?
8. What does Skopos enforce, and what remains cooperative or advisory?
9. How does it decide which checks matter?
10. How do I adopt it in an existing project without losing current truth?
11. What is the shortest trustworthy path to first value?

## Global Navigation

The public header uses this hierarchy:

```text
Skopos
├── Product
│   ├── Project Memory
│   ├── How Skopos works
│   ├── Supported agents
│   └── Trust and control
├── Use cases
├── Docs
├── Changelog
├── GitHub
└── Get started
```

Rules:

1. the wordmark links to `/`; `Home` is not a navigation item
2. `Product` is the only launch dropdown
3. `Get started` is the only persistent primary action
4. `Read the docs` is the standard secondary action
5. homepage narrative labels such as Remember, Coordinate, Prove, and Boundary are
   section language, not global routes
6. mobile navigation preserves the same order and destinations
7. unsupported destinations are not displayed as empty placeholders

## Launch Route Map

| Route | Visitor job | Primary action |
| --- | --- | --- |
| `/` | Understand the promise and see one believable workflow | Get started |
| `/project-memory` | Understand the primary product wedge and ownership model | Add Skopos to an existing project |
| `/how-it-works` | Understand the complete discussion-to-proof loop | Follow the first workflow |
| `/use-cases` | Find the workflow matching a recognizable project problem | Copy a prompt / open the guide |
| `/agents` | Inspect truthful host compatibility and setup | Set up a supported agent |
| `/trust` | Evaluate repository ownership, approvals, enforcement, and limits | Read the operating model |
| `/docs` | Start, learn, configure, troubleshoot, or inspect reference | Open the quickstart |
| `/changelog` | See shipped behavior, migrations, and current limitations | Read the latest release |

GitHub remains an external destination rather than a duplicate source page.

## Route Copy Specifications

### Homepage — `/`

**Visitor question:** What does Skopos do, and why should I care now?

**Hero headline**

> Your agents write the code. Skopos keeps the work coherent.

**Hero explanation**

> Plans, decisions, project rules, active work, and proof stay with your
> repository—so coding agents can continue real work without starting over.

**Hero interaction**

1. `Ask your agent` is the default human-friendly tab.
2. `Install Skopos` provides the exact released package command.
3. `Read the quickstart` is the supporting action.

**Narrative**

1. hero and setup module
2. supported-agent strip linked to `/agents`
3. `Your project should not start over when the chat does.`
4. one interactive, realistic development workstream
5. three outcomes: keep the project understood, keep the work bounded, and know when
   it is actually done
6. product boundary and final get-started action

The homepage remains within the narrative and copy budgets owned by `P-7dde6750`.

### Project Memory — `/project-memory`

**Visitor question:** How is this different from chat history, instructions, or an
agent's private memory?

**Hero headline**

> The project memory your coding agents can actually work from.

**Hero explanation**

> Skopos keeps architecture, decisions, plans, patterns, active work, and important
> lessons in a predictable, repository-owned structure. Agents receive the relevant
> truth without loading the whole project into every conversation.

**Sections**

1. `More than an instructions file.`
   Explain that instructions guide behavior while Project Memory also owns durable
   knowledge, work state, lifecycle, retrieval, and proof relationships.
2. `Memory that belongs to the repository.`
   Explain tracked, human-readable, reviewable, portable sources and disposable
   generated state.
3. `Only the relevant context.`
   Explain Scope-aware and Task-aware retrieval without promising perfect semantic
   recall.
4. `Updated as the project changes.`
   Explain closure-time Memory review and the explicit `memory-updated` or
   `reviewed-no-change` outcome. Do not claim silent automatic truth rewriting.
5. `Bring an existing project with you.`
   Explain discovery, analysis, proposed keep/move/merge/split/rewrite/archive/delete
   operations, approval, verification, and activation.
6. comparison table for chat history, host instructions, host auto-memory,
   documentation, and Skopos.

**Primary action:** `Add Skopos to an existing project`

### How Skopos Works — `/how-it-works`

**Visitor question:** What happens after I describe the work I want?

**Hero headline**

> From a request to verified work—without losing the why.

**Hero explanation**

> Talk to your coding agent normally. Skopos supplies the relevant project truth,
> protects the requested outcome, connects project checks to fresh proof, and leaves
> the work ready to continue.

**Canonical loop**

1. **Discuss** — the developer describes an outcome in normal language.
2. **Understand** — the agent loads current Task, Scope, and targeted Project Memory.
3. **Bound** — the outcome becomes one Task with acceptance, ownership, constraints,
   and non-goals.
4. **Work** — the agent reasons, edits, and uses project-approved Actions under
   applicable Guards.
5. **Prove** — source-bound Evidence covers acceptance and explains remaining
   blockers.
6. **Remember** — durable changes produce reviewed Memory obligations.
7. **Continue** — a fresh supported Session can use the current handoff and live
   project state.

Use one continuous example rather than seven unrelated diagrams. At each stage show
`What you say` beside `What Skopos handles`.

**Primary action:** `Follow the first workflow`

### Use Cases — `/use-cases`

**Visitor question:** Does Skopos help with the way I currently use coding agents?

**Hero headline**

> Use coding agents on real projects without rebuilding context every time.

**Hero explanation**

> Start with the project problem you recognize. Each workflow shows what to ask your
> agent, what Skopos maintains, and what you should review.

**Launch scenarios**

1. adopt an existing repository
2. plan and build a feature
3. return after days or weeks
4. continue in a fresh agent Session
5. split independent work across supported Sessions
6. require the right checks before completion
7. keep durable project knowledge current

Each scenario contains exactly:

1. the recognizable problem
2. the outcome
3. one short `Say this to your agent` prompt
4. the related documentation guide

Separate marketing pages are added only when a scenario has enough distinct demand,
proof, and content to justify one.

### Supported Agents — `/agents`

**Visitor question:** What works with my coding-agent host today?

**Hero headline**

> One project memory. Honest support for the agents you use.

**Hero explanation**

> Skopos keeps project truth host-neutral, but host automation is not identical. See
> exactly which setup, context, handoff, delivery, and coordination capabilities are
> verified for each supported agent.

**Required capability matrix**

1. project instruction adapter
2. Session context delivery
3. fresh-Session handoff
4. child-Task delivery
5. origin reviewer continuity
6. pre-compaction support
7. completion hook support
8. coordination mediation level

Allowed states are `Verified`, `Beta`, `Manual workflow`, `Planned`, and
`Not supported`. Every state has a version or proof date and a link to setup or
limitations. Logos never imply parity. The launch copy must reflect the current proof
matrix, including manual fallback where host automation is not proven.

The first-release matrix marks Codex `Verified`. Claude Code, Cursor, and GitHub
Copilot are `Planned` or `Manual workflow` only where the exact fallback exists; none
is described as supported until real-host proof exists.

**Primary action:** `Set up Codex`

### Trust And Control — `/trust`

**Visitor question:** What does Skopos store, change, enforce, and leave to the agent?

**Hero headline**

> Project truth stays with the project.

**Hero explanation**

> Skopos keeps durable knowledge in tracked, human-readable sources; compiles local
> working state separately; and explains approvals, checks, proof, and coordination
> limits instead of hiding them behind an agent summary.

**Sections**

1. tracked truth versus disposable `.skopos/**` state
2. what initialization, adoption, work, and closure may write
3. approval before material documentation restructuring or sensitive Actions
4. advisory instructions versus deterministic Guards and provider Actions
5. Evidence freshness and explainable Readiness
6. cooperative same-checkout coordination and its explicit limits
7. local, hosted, network, secret, and external-service capability boundaries
8. telemetry and data handling when those product decisions exist
9. security reporting and source license links

**Boundary copy**

> Skopos helps coding agents follow your project. It does not replace the agent,
> upload a second source of truth, or claim that advisory instructions are hard
> security boundaries.

**Primary action:** `Read the operating model`

### Documentation — `/docs`

**Visitor question:** How do I start, and how should I work with Skopos day to day?

**Hero headline**

> Set up Skopos once. Then talk to your coding agent normally.

**Hero explanation**

> Start with a conversation, use commands when you need precision, and inspect every
> important decision before it becomes project truth.

**Start routes**

1. Add Skopos to an existing project
2. Start a new project
3. Continue current work
4. Understand the product model

The documentation information architecture and page template are defined below.

### Changelog — `/changelog`

**Visitor question:** What changed, do I need to migrate, and is this capability
actually ready?

**Hero headline**

> See what changed—and what is actually ready.

Each entry includes:

1. version and date
2. user-visible changes
3. host and compatibility changes
4. migration steps
5. current limitations
6. linked release proof

The changelog is release information, not a general company blog.

## Documentation Information Architecture

Documentation separates learning modes instead of mixing tutorials, goal-based
guidance, explanation, and reference in one page.

```text
Docs
├── Start
│   ├── Overview
│   ├── Quickstart
│   ├── Adopt an existing project
│   ├── Start a new project
│   ├── Set up Codex
│   ├── Set up Claude Code
│   └── Verify the installation
├── Work with your agent
│   ├── Ask questions about the project
│   ├── Plan a feature
│   ├── Record a decision
│   ├── Start bounded work
│   ├── Continue in a fresh Session
│   ├── Split work across Sessions
│   ├── Add project-specific checks
│   ├── Review and finish work
│   └── Keep Project Memory current
├── Concepts
│   ├── Project Memory
│   ├── Projects and Scopes
│   ├── Plans and Tasks
│   ├── Sessions and handoffs
│   ├── Actions and Guards
│   ├── Evidence and Readiness
│   ├── Adoption
│   └── Tracked truth and generated state
├── Configure
│   ├── Scope registry
│   ├── Project Actions
│   ├── Project Guards
│   ├── Policies
│   ├── Skills
│   ├── Host adapters
│   └── MCP integration
├── Reference
│   ├── CLI
│   ├── Configuration
│   ├── Manifest schemas
│   ├── MCP tools
│   ├── Files and directories
│   ├── Environment variables
│   ├── Exit codes
│   └── Generated artifacts
└── Help
    ├── Troubleshooting
    ├── Adoption problems
    ├── Stale or conflicting Memory
    ├── Failed checks
    ├── Coordination conflicts
    └── Interrupted-work recovery
```

The launch does not require every leaf before the first documentation release. It
requires the minimum coherent journey defined in the delivery backlog.

## Conversation-First Documentation Contract

Commands remain complete and authoritative, but a developer's first path through a
workflow guide is natural conversation.

Every workflow guide uses this order:

1. **Outcome** — what the developer will achieve
2. **Say this to your agent** — one short, copyable prompt
3. **What Skopos will do** — the relevant product behavior in plain English
4. **What to review** — decisions or proposals that require judgment
5. **Run it yourself** — exact CLI commands and equivalent MCP behavior when relevant
6. **Done when** — observable success and Readiness state
7. **Common problems** — failure explanation and the safest recovery
8. **Next** — one useful continuation

### Canonical prompt: adopt an existing project

> Set up Skopos in this repository. First inspect the source, existing documentation,
> project instructions, and working commands. Do not restructure or overwrite
> anything yet. Show me what is canonical, what conflicts, what is missing, and the
> proposed Project Memory structure before applying changes.

### Canonical prompt: plan a feature

> I want to add passwordless login. Load the relevant project context, find the
> narrowest project area that owns the change, and help me define the intended
> behavior, acceptance criteria, constraints, and non-goals. Ask only questions that
> could materially change the implementation.

### Canonical prompt: continue work

> Continue the current Skopos Task. Load the latest intent, decisions, relevant
> Project Memory, remaining checks, and handoff. Before editing, tell me what is
> already done, what remains, and the next safe action.

### Canonical prompt: finish work

> Review this Task against its acceptance criteria. Run only the checks selected for
> the affected project area, fix relevant failures, and show me the Evidence. Do not
> call the work complete until Skopos reports that it is ready.

### Canonical prompt: record durable truth

> We decided to use signed, short-lived recovery tokens rather than persistent reset
> tokens. Record this in the correct Project Memory, link it to the affected Scope and
> current work, and tell me which existing documentation should now change.

Prompts describe intent rather than pretending that the model alone enforces state.
The guide explains the exact Skopos authority the host adapter or agent must call.

## Agent-Readable Documentation

Human and agent documentation share one source. The public documentation experience
provides:

1. a stable Markdown representation for every page
2. `Copy page as Markdown`
3. `Copy prompt` on conversation-first workflows
4. `/llms.txt` as the compact documentation index
5. `/llms-full.txt` only when it can be generated and kept within a deliberate size
   and freshness contract
6. stable headings and anchor links
7. versioned commands and schemas
8. descriptive links to canonical reference
9. no required information available only through animation, image, or client-side
   interaction

Generated agent-readable surfaces never become a second hand-authored documentation
authority.

## Copy And Terminology Rules

1. begin with the developer's problem, then name the Skopos concept
2. introduce no more than one unfamiliar product noun per section
3. use `project knowledge` before introducing `Project Memory`
4. use `the work you asked for` before introducing `Task`
5. use `the checks your project requires` before introducing `Actions` and `Guards`
6. use `proof that still matches the source` before introducing `Evidence freshness`
7. use `ready` only with a named Task, phase, or release subject
8. never say `never forgets` without the explicit Memory review lifecycle
9. never say `works with every agent`
10. never imply that cooperative local coordination prevents unmediated writes
11. never call a behavior automatic when an agent or human must review or apply it
12. never use Task closure as proof of Project integration or release Readiness
13. use sentence case for headings and actions
14. use one dominant action per page and one idea per section
15. avoid category stacking such as `agentic harness loop memory infrastructure` in
    user-facing headlines

## Discoverability And Educational Content

The following terms reflect how users currently describe the problem and are useful
for documentation titles, guide copy, page metadata, and later educational articles:

1. coding-agent memory
2. project context for coding agents
3. `AGENTS.md` and `CLAUDE.md`
4. stale coding-agent instructions
5. coding-agent handoff
6. multiple coding agents in one repository
7. agent checks and verification
8. harness engineering
9. agent loop and feedback loop

These terms do not replace the primary product story. Harness engineering and loop
engineering belong in educational content, not the main headline or global
navigation.

Possible later guides, added only with sufficient proof and maintenance ownership:

1. `AGENTS.md versus Project Memory`
2. `How to keep coding-agent context from going stale`
3. `A practical coding-agent handoff workflow`
4. `From vibe coding to a reliable agent harness`
5. `How to give coding agents checks they can trust`

## Shared Page And Content Structure

The public app should reuse page-level patterns instead of building every route as a
bespoke composition:

```text
apps/web/src/
├── app/
│   ├── page.tsx
│   ├── project-memory/page.tsx
│   ├── how-it-works/page.tsx
│   ├── use-cases/page.tsx
│   ├── agents/page.tsx
│   ├── trust/page.tsx
│   ├── docs/**
│   └── changelog/page.tsx
├── features/
│   ├── homepage/
│   ├── project-memory/
│   ├── product-workflow/
│   ├── use-cases/
│   ├── agent-support/
│   ├── trust/
│   ├── documentation/
│   └── changelog/
├── patterns/site/
└── components/ui/
```

Shared candidates include:

1. site header, mobile navigation, footer, and page frame
2. narrative hero
3. section intro
4. prompt and command switcher
5. `Say this to your agent` block
6. capability/status matrix
7. comparison table
8. workflow step
9. documentation callout
10. page metadata and structured-data helpers

Feature components stay feature-owned until at least two real consumers require the
same behavior and API.

## Delivery Backlog

Each phase yields independently reviewable Tasks. Completing a phase does not certify
later phases.

### Phase 1 — Public-web foundation

1. replace homepage anchors in the global header with the accepted route model
2. establish route-aware navigation, active state, mobile menu, and skip-link behavior
3. establish shared page metadata, canonical URL, Open Graph, sitemap, and robots
   behavior
4. establish shared narrative-page and documentation-page shells
5. preserve the existing homepage visuals while changing only the navigation and
   destinations required by this Plan

### Phase 2 — Primary product story

1. deliver `/project-memory`
2. deliver `/how-it-works`
3. connect homepage claims and examples to the deeper routes
4. verify copy against canonical vision, positioning, Memory lifecycle, and current
   CLI behavior

### Phase 3 — Evaluation surfaces

1. deliver `/use-cases` with the seven launch scenarios
2. deliver `/agents` from a generated or source-bound support matrix
3. deliver `/trust` with explicit tracked/generated, approval, enforcement,
   coordination, and data boundaries
4. prevent unsupported host capability claims from entering shared copy or logo
   treatments

### Phase 4 — Documentation minimum coherent journey

Deliver these pages before calling the documentation usable:

1. documentation overview
2. quickstart
3. adopt an existing project
4. start a new project
5. work with your agent
6. plan and finish one feature
7. continue in a fresh Session
8. Project Memory concept
9. Task, Action, Guard, Evidence, and Readiness concept overview
10. CLI and configuration reference routers
11. troubleshooting router

Every workflow page includes both conversation-first and exact-command paths.

### Phase 5 — Agent-readable docs and reference depth

1. add Markdown page output or copy source
2. add generated `/llms.txt`
3. decide whether `/llms-full.txt` meets size and freshness constraints
4. generate command reference from the canonical public CLI where practical
5. link schemas and manifests without duplicating their authority
6. expand configuration, MCP, artifact, exit-code, and troubleshooting reference

### Phase 6 — Release communication

1. deliver `/changelog`
2. source release notes from one canonical release record
3. include migrations, host-support changes, limitations, and proof links
4. replace pre-release and target-preview claims only when the package and public
   destinations exist

### Phase 7 — Integrated public-web proof

Run a separate Project-integration Task when the intended outcome is an integrated
public website or release candidate. That Task owns the explicit integration boundary
and proves:

1. navigation and every public destination
2. responsive layout across representative widths
3. keyboard and screen-reader navigation
4. prompt, command-copy, tab, menu, and deep-link interactions
5. metadata, sitemap, robots, canonical links, and structured data
6. source-bound browser Evidence for critical routes and interactions
7. production build and clean packed or deployed candidate as applicable
8. link and claim validity against actual npm, GitHub, documentation, and release
   destinations

## Content Governance

1. product truth comes from canonical Project Memory, not duplicated marketing notes
2. command reference comes from the public CLI and schemas where generation is safe
3. support status comes from a dated, reviewable capability source
4. changelog content comes from canonical release records
5. page copy may simplify terminology but must not widen claims
6. a product behavior change triggers review of affected marketing and docs routes
7. a host-support change triggers review of `/agents`, setup docs, homepage logos, and
   relevant use cases
8. a command change triggers documentation and copy-example review
9. unsupported or unverified claims fail release review rather than receiving vague
   wording

## Proof Contract

Each route Task selects proof proportional to its behavior. A content-only Task may
use source review and focused rendering. Interactive or visual acceptance requires a
source-bound browser Evidence receipt.

The integrated public-web release proof must not reuse homepage completion as a proxy.
It requires its own Task, owned paths, current candidate, fresh Evidence, and explicit
release subject.

At minimum, the final candidate proves:

1. a new visitor can state what Skopos does after the homepage hero and example
2. Project Memory is understood as maintained repository truth rather than host chat
   memory
3. natural-language workflows and manual commands describe the same authority
4. host support and coordination limits are visible and accurate
5. every displayed primary action reaches a truthful destination
6. documentation covers first setup, first workflow, continuation, closure, concepts,
   reference, and recovery

## Deferred Surfaces

Do not add these until product truth, demand, and ownership justify them:

1. pricing
2. enterprise
3. customer stories
4. marketplace
5. community
6. careers
7. hosted-service status page
8. a broad company blog
9. competitive comparison pages
10. one marketing page per internal feature

Privacy, terms, telemetry disclosure, and hosted-service security pages become
required when the website or product actually collects data, creates accounts,
accepts commercial terms, or operates a hosted service.

## Plan Completion

This Plan is complete when the accepted information architecture, page copy contract,
documentation model, content governance, and staged backlog have been implemented or
superseded through explicit follow-up Plans and every owned requirement has current
Evidence.

Its completion means the planned public-web content program was delivered. It does
not mean every possible future Skopos web page or product surface is complete.
