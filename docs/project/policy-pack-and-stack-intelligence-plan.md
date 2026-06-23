# Skopos Policy Pack And Stack Intelligence Plan

Use this plan to turn Skopos from project-state tooling into a stronger project-intelligence and memory system that helps LLM coding agents build, maintain, refactor, and evolve high-quality products across new, existing, small, large, frontend, backend, library, monorepo, and platform workspaces without becoming project-specific or toy-like.

## Metadata

- Doc ID: `SKOPOS-PROJECT-POLICY-PACK-AND-STACK-INTELLIGENCE-PLAN`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `vision.md`
  - `positioning.md`
  - `proof-phase-plan.md`
  - `system-ui-plan.md`
  - `roadmap.md`
  - `implementation-checklist.md`
  - `../architecture/00-architecture.md`
  - `../architecture/artifact-model.md`
  - `../architecture/config-model.md`
  - `../architecture/runtime-model.md`
  - `../architecture/trust-and-closure-model.md`
  - `../decisions/029-policy-pack-stack-intelligence-and-memory-contract.md`

## Changelog

- `2026-06-24`: Added the first policy-pack catalog runtime and CLI surface through `skopos policies list` and `skopos policies show`, backed by schema validation of `policy-packs/**/pack.json`.
- `2026-06-24`: Seeded `policy-packs/architecture/mid-app` as the first concrete built-in policy pack source, including manifest, operational docs, drift checks, and fixtures.
- `2026-06-24`: Added the accepted decision contract as the implementation authority for policy-pack, stack-intelligence, durable-memory, and drift-report artifacts.
- `2026-06-24`: Clarified that Skopos is not a Unisane-specific layer; it is a project-agnostic LLM coding-agent intelligence and memory layer that should generalize rigorous architecture, gates, UI doctrine, and docs governance patterns into portable packs while keeping project knowledge continuously fresh.
- `2026-06-24`: Added the first product-grade plan for policy packs, workflow packs, gate packs, stack intelligence, drift detection, greenfield profiles, brownfield stabilization, and agent bootstrap integration.

## Goal

Build Skopos so an installed project gets durable, project-aware guidance and memory that agents can actually use: architecture doctrine, clean-code rules, structure conventions, naming policy, UI component guidance, stack recommendations, validation gates, drift detection, and continuously updated project knowledge that match the project size and lifecycle.

The target is not a library of generic markdown templates. The target is a governed intelligence layer that can:

1. classify the project and its risk profile
2. recommend suitable policy and workflow packs
3. let the user accept, reject, or override recommendations
4. install durable guidance into the project through `AGENTS.md`, local docs, config, and generated artifacts
5. check future work against the accepted policy
6. explain when the existing project intentionally differs from a default pack
7. keep agents from inventing second patterns in every chat
8. preserve project knowledge across sessions, compaction, model changes, and long-running refactors
9. keep canonical project memory fresh as code, docs, decisions, commands, and generated artifacts change

## Product Thesis

Skopos exists because coding agents work better when they receive compact, current, project-specific truth instead of broad repo scans and chat memory. Policy and stack intelligence is a natural next layer because most agent mistakes come from weak local constraints:

1. unclear architecture boundaries
2. unclear greenfield versus brownfield rules
3. unclear file and module ownership
4. unclear naming and tree conventions
5. unclear validation lanes
6. unclear stack tradeoffs
7. no durable record of accepted decisions
8. no drift signal after the first good answer

This plan makes those constraints first-class Skopos artifacts.

Skopos is not the Unisane agent layer. Unisane is a useful reference project because it has serious architecture governance, command lanes, UI doctrine, generated-artifact ownership, decision logs, and finding lifecycle discipline. Skopos should learn from that rigor, then generalize it into project-agnostic packs that work for any high-quality product codebase.

Skopos should become the durable memory and intelligence layer around LLM coding agents. Its value is that the agent does not have to reconstruct project truth from raw files or user reminders every session. Skopos keeps the project knowledge current, compact, inspectable, and enforceable.

## Product Principles

1. Project-agnostic by design.
   Skopos must work outside Unisane and outside any single architecture style. Built-in packs may include strong defaults, but active policy must resolve from the installed project.

2. Project-aware before prescriptive.
   Skopos should inspect the current project shape before recommending a pack. Brownfield projects must not be judged against greenfield defaults blindly.

3. Policies are accepted state, not hidden magic.
   Skopos may recommend policies, but the active project contract should come from explicit accepted packs and local overrides.

4. Memory must stay fresh.
   Skopos should treat stale project knowledge as a product defect. Code, docs, generated artifacts, decisions, commands, and active drift must be reflected in compiled memory and agent briefs.

5. Brownfield-first, greenfield-capable.
   Existing repos need stabilization and pattern detection. New repos need strong starting defaults. The same system should support both through different profiles.

6. Smallest sufficient discipline.
   A small app should not inherit platform-grade ceremony. A large monorepo should not run on vague single-app rules.

7. Explainable recommendations.
   Every recommendation must include signals, tradeoffs, anti-signals, and consequences. Stack advice without reasoning is not useful.

8. Pack content must be operational.
   A pack is not complete until it includes policy text, examples, anti-patterns, enforceable checks, brownfield migration guidance, and proof fixtures.

9. Local truth outranks defaults.
   Project config, accepted decisions, explicit overrides, and existing canonical docs should outrank Skopos defaults.

10. Durable artifacts over chat memory.
   Agents should load Skopos-generated briefs and project docs instead of needing the user to repeat architectural context in every session.

11. Proof before product claims.
   Each pack family needs test repos, drift fixtures, and regression gates before being treated as production-grade.



## Project-Agnostic Reference Boundary

Skopos may use mature projects such as Unisane as reference material, but reference material must become generalized product intelligence before it enters Skopos.

Useful patterns to generalize:

1. canonical source-of-truth docs and read order
2. architecture layer maps and dependency direction rules
3. command lanes that scale from fast checks to release-grade proof
4. generated artifact ownership and freshness gates
5. decision records for important technical choices
6. active findings for known drift, blockers, and failure patterns
7. public API compatibility versus internal greenfield hard-cut rules
8. UI application structure from route to screen to feature to support layers
9. token, visual, accessibility, and responsive governance
10. docs lifecycle rules for active, durable, historical, and dead surfaces

What must not happen:

1. Skopos must not assume every project is a Unisane-style modular platform.
2. Skopos must not copy Unisane package names, DI rules, route grammar, or tenant model into default policy.
3. Skopos must not require a repo to adopt Unisane's architecture before becoming agent-ready.
4. Skopos must not treat any one reference project as the universal ideal.

The correct product shape is portable rigor: Skopos detects the project class, recommends a matching pack, records accepted local truth, and then keeps future agent work inside that truth.

## Memory Layer Contract

Skopos should be a high-quality memory layer for LLM coding agents. Memory is not just chat history. Memory is compiled project truth that agents can trust during build, maintenance, refactor, migration, and product evolution work.

Memory layers:

1. observed state
   - files, package manifests, commands, docs, imports, routes, tests, generated artifacts, runtime config, and tool surfaces
2. inferred state
   - project profile, scope map, architecture shape, dominant patterns, validation lanes, stack signals, and drift risks
3. accepted state
   - selected policies, stack decisions, local overrides, public API stance, workflow requirements, and team-approved exceptions
4. operational state
   - active missions, plans, workflow evidence, evaluation results, trust status, findings, and recent changes
5. agent-ready state
   - compact briefs, `AGENTS.md`, host mirrors, prompt briefs, and routed UI projections

Freshness rules:

1. Source changes that affect project truth must invalidate compiled memory.
2. Generated memory must carry source dependencies and update timestamps.
3. Trust should warn when memory is stale, incomplete, or contradicted by source truth.
4. Agent briefs should be compact enough for hot-path loading and strong enough to prevent pattern drift.
5. Accepted decisions must survive new chats, context compaction, model changes, and multi-agent handoff.
6. Drift should be measured against accepted local truth, not generic defaults.
7. Memory updates should be explainable: every generated recommendation should point back to source signals or accepted decisions.

The memory layer should make this possible: an agent can enter a project months later, ask Skopos for context, and receive the current architecture, policies, gates, stack decisions, known drift, and next required proof without rereading the whole repo or asking the user to repeat history.

## First Seeded Pack

The first source pack is `policy-packs/architecture/mid-app`. It exists to prove the quality bar before Skopos grows a large catalog. The pack includes:

1. `pack.json` typed against the policy-pack artifact contract
2. architecture rules with severity, rationale, examples, anti-patterns, and drift check ids
3. operational docs for overview, boundaries, brownfield behavior, greenfield behavior, and examples
4. drift-rule definitions that can later be connected to heuristic, AST, and semantic checks
5. good and drift fixtures that future proof lanes can use to reject placeholder-only pack work

This seed is not the final catalog. The first catalog slice now loads and validates `policy-packs/**/pack.json` through `skopos policies list` and `skopos policies show`. The next implementation step is to recommend packs from project profile signals, let projects accept or override them, generate resolved policy state, and surface memory/drift posture in agent briefs and trust.

## System Layers

### 1. Project Classifier

The classifier should infer the current workspace class before any pack recommendation.

Inputs:

1. package manager and workspace layout
2. app, library, package, service, tool, or monorepo shape
3. frontend, backend, full-stack, CLI, infra, data, AI, or mixed surface
4. project lifecycle: greenfield, early product, established brownfield, legacy stabilization
5. team and release surface signals when declared
6. current docs and instruction maturity
7. validation command availability
8. public API or internal-only posture
9. UI/design-system presence
10. queue, scheduler, cache, search, realtime, auth, billing, storage, observability, and deployment signals

Outputs:

1. `.skopos/classifier/project-profile.json`
2. compact project profile in `.skopos/agent/project-brief.json`
3. recommendation inputs for policy, workflow, gate, and stack packs
4. confidence and missing-evidence fields

### 2. Policy Pack System

Policy packs define how agents should shape code in a project.

Initial pack families:

1. `architecture`
2. `clean-code`
3. `structure-tree`
4. `naming`
5. `ui-components`
6. `api-contracts`
7. `data-modeling`
8. `testing`
9. `docs-governance`
10. `security-privacy`
11. `release-public-api`

Policy packs should be versioned, composable, and override-aware.

Each policy pack must include:

1. `pack.yaml` machine-readable metadata
2. human-readable policy docs
3. applicability signals
4. anti-signals and when not to apply it
5. severity model: `must`, `should`, `advisory`
6. examples and counterexamples
7. greenfield guidance
8. brownfield guidance
9. migration stance
10. local override fields
11. drift checks
12. validation commands or generated checks
13. proof fixtures
14. changelog and compatibility notes

### 3. Workflow Pack System

Workflow packs define how agents should execute common work.

Initial workflow families:

1. add feature
2. fix bug
3. refactor module
4. add API endpoint
5. add UI screen
6. add data model or migration
7. add background job
8. add integration or adapter
9. change public package API
10. improve performance
11. handle security-sensitive work
12. stabilize brownfield pattern drift

A workflow pack should map work type to:

1. first-read docs
2. scope discovery commands
3. likely files and ownership boundaries
4. decision questions
5. implementation constraints
6. validation lane
7. documentation obligations
8. drift checks
9. closure proof

### 4. Gate Pack System

Gate packs define validation intensity.

Initial variants:

1. `gates.fast` for tight local iteration
2. `gates.balanced` for normal feature work
3. `gates.strict` for key or risky changes
4. `gates.monorepo-affected` for affected-package validation
5. `gates.public-api` for package release surfaces
6. `gates.security-sensitive` for secrets, auth, permissions, or data exposure
7. `gates.ui-quality` for responsive and visual checks
8. `gates.data-integrity` for migrations, queues, idempotency, and backfills

Gate packs should not be generic command lists. They should choose commands from the actual project command surface and explain why a lane is sufficient.

### 5. Stack Intelligence

Stack intelligence recommends capabilities and implementation options, not random technologies.

Capability families:

1. database
2. cache
3. Redis or cache server
4. background queue
5. scheduled jobs and cron
6. durable workflows such as Inngest or Temporal-style systems
7. search
8. realtime
9. auth and authorization
10. payments and billing
11. email and notifications
12. object storage
13. webhooks
14. analytics and product events
15. observability
16. feature flags
17. rate limiting
18. secrets and config
19. deployment and runtime topology

Each recommendation should include:

1. current signal
2. user goal or workload shape
3. recommended capability
4. recommended option set
5. anti-signals
6. operational cost
7. failure modes
8. local-development implications
9. production implications
10. migration path
11. decision record candidate
12. required gates

Examples:

1. Redis is recommended when the project needs shared cache, rate limiting, distributed locks, queue backend, session storage, or cross-process coordination. It should not be recommended for a small single-process app just because caching sounds useful.
2. A queue is recommended when work is slow, retryable, rate-limited, user-visible but asynchronous, webhook-driven, or needs failure isolation. It should not be recommended for simple synchronous CRUD side effects.
3. Cron is recommended for simple time-based jobs. A durable workflow system is recommended when execution needs retries, state, long-running steps, external callbacks, idempotency, and auditability.
4. Inngest-style workflow tooling is recommended when event-driven background work needs strong developer ergonomics, durable runs, retries, local dev visibility, and function-level workflow composition.

### 6. Project Memory And Accepted Decisions

Skopos should remember accepted project decisions in durable artifacts.

Examples:

1. accepted architecture pack
2. chosen project size profile
3. accepted validation lane defaults
4. stack decisions and rejected alternatives
5. local exceptions and expiration rules
6. brownfield stabilization decisions
7. public API compatibility policy
8. UI component organization policy

Artifacts:

1. `.skopos/decisions/accepted-policy-decisions.json`
2. `.skopos/stack/decisions.json`
3. `.skopos/policies/overrides.json`
4. generated docs under `docs/skopos/decisions/**` when the project opts into durable markdown mirrors

### 7. Brownfield Stabilizer

For existing projects, Skopos should first understand what is already true.

Brownfield flow:

1. scan existing docs, instructions, commands, packages, imports, routes, UI tree, tests, and build surfaces
2. infer current patterns with confidence levels
3. detect competing patterns and likely drift
4. distinguish intentional local policy from accidental inconsistency
5. recommend packs that fit the observed project
6. recommend stabilization work before large new feature work when drift is high
7. create local override proposals for mature projects that intentionally differ from Skopos defaults

Brownfield must never force a rewrite just because a cleaner default exists. It should preserve working local architecture and focus on preventing additional drift.

### 8. Greenfield Bootstrap Profiles

For new projects, Skopos should recommend a profile and starter policy set.

Initial profiles:

1. `greenfield.small-app`
2. `greenfield.mid-app`
3. `greenfield.large-platform`
4. `greenfield.library`
5. `greenfield.monorepo`
6. `greenfield.react-dashboard`
7. `greenfield.fullstack-saas`
8. `greenfield.cli-tool`
9. `greenfield.ai-app`

Greenfield profiles should produce:

1. `AGENTS.md`
2. initial `skopos.config.yaml`
3. selected policy packs
4. selected workflow packs
5. selected gate packs
6. docs start router
7. minimal tree guidance
8. stack recommendation questions
9. first validation commands
10. project-specific agent brief

### 9. Drift Detector

The drift detector should compare future changes against accepted policy.

Drift examples:

1. new file in wrong layer
2. import crossing forbidden boundary
3. second routing or dependency injection pattern
4. inconsistent service or component naming
5. oversized file crossing accepted line budget
6. UI component placed in wrong feature or shared layer
7. queue introduced without retry/idempotency policy
8. cron introduced without ownership and observability policy
9. Redis introduced without local/prod config guidance
10. generated artifact edited manually
11. public package API changed without release gate

Outputs:

1. `.skopos/drift/report.json`
2. trust warnings
3. mission evaluation blockers when severity is `must`
4. agent brief updates for accepted exceptions

### 10. Agent Bootstrap Integration

Skopos should install and maintain project instructions that agents can load quickly. This bootstrap must represent current project memory, not only initial install-time guidance.

Installed guidance should include:

1. project snapshot
2. greenfield or brownfield policy
3. accepted policy packs
4. accepted stack decisions
5. first-read order
6. scope discovery steps
7. command lanes
8. generated artifact rules
9. security rules
10. workflow rules
11. current trust and drift posture

This should flow into:

1. root `AGENTS.md`
2. optional mirrors for host tools
3. `.skopos/agent/project-brief.json`
4. `.skopos/agent/prompt-brief.json`
5. routed console surfaces

## Pack Taxonomy

### Architecture Packs

1. `architecture.small-app`
   - single deployable app
   - simple modules by feature
   - minimal abstraction
   - local service boundaries only where useful

2. `architecture.mid-app`
   - app with growing domains
   - explicit feature modules
   - shared infrastructure boundaries
   - clear API, UI, and data ownership

3. `architecture.large-platform`
   - multi-domain or multi-product platform
   - dependency direction rules
   - ports/adapters or equivalent seams
   - strong module ownership
   - explicit orchestration layer

4. `architecture.library`
   - public package surface
   - small internal core
   - semver and compatibility gates
   - examples and contract tests

5. `architecture.monorepo`
   - package ownership
   - workspace command lanes
   - affected validation
   - cross-package dependency policy

6. `architecture.plugin-or-extension`
   - host boundary
   - manifest contract
   - versioned integration surface
   - compatibility and sandbox policy

### Clean Code Packs

1. `clean-code.baseline`
   - readable functions
   - explicit data shapes
   - limited cleverness
   - clear error paths

2. `clean-code.strict`
   - stronger file budgets
   - stricter public/private boundaries
   - stronger tests around shared logic

3. `clean-code.legacy-stabilization`
   - preserve behavior
   - reduce local duplication
   - avoid broad rewrites
   - extract only after tests or proof exist

### Structure Tree Packs

1. `structure.single-app`
2. `structure.feature-first-react`
3. `structure.domain-first-backend`
4. `structure.package-monorepo`
5. `structure.library-package`
6. `structure.platform-modular`

Each tree pack should define ownership for app, domain, feature, shared, infra, tests, generated, docs, and scripts.

### Naming Packs

1. `naming.typescript-baseline`
2. `naming.react-components`
3. `naming.api-contracts`
4. `naming.package-exports`
5. `naming.events-and-jobs`
6. `naming.database-artifacts`

Naming packs should include allowed suffixes, forbidden ambiguous names, file naming, export naming, operation naming, and generated artifact naming.

### UI Packs

1. `ui.react-baseline`
2. `ui.react-dashboard`
3. `ui.design-system-package`
4. `ui.mobile-responsive-app`
5. `ui.form-heavy-product`
6. `ui.data-table-product`

UI packs should cover:

1. component ownership
2. route and screen structure
3. shared component admission rules
4. state and data-fetching ownership
5. forms and validation
6. layout and responsive rules
7. accessibility gates
8. visual QA gates
9. file-size and component-size budgets
10. design-token policy

### Stack Advisor Packs

1. `stack.web-app-baseline`
2. `stack.fullstack-saas`
3. `stack.event-driven-workflows`
4. `stack.background-jobs`
5. `stack.realtime-collaboration`
6. `stack.search-heavy-app`
7. `stack.data-heavy-product`
8. `stack.public-api-product`
9. `stack.enterprise-readiness`

## Pack Artifact Model

Source pack layout:

```text
policy-packs/
  architecture/
    mid-app/
      pack.yaml
      policies/
        overview.md
        boundaries.md
        examples.md
        brownfield.md
        greenfield.md
      checks/
        drift-rules.yaml
      fixtures/
        good/
        drift/
```

Installed project layout:

```text
AGENTS.md
docs/skopos/
  policies/
    architecture.md
    clean-code.md
    ui.md
    stack.md
  decisions/
    stack-decisions.md
.skopos/
  policies/
    resolved.json
    recommendations.json
    overrides.json
  stack/
    assessment.json
    recommendations.json
    decisions.json
  drift/
    report.json
  agent/
    project-brief.json
    prompt-brief.json
```

Config shape should stay compact:

```yaml
policies:
  profile: brownfield.mid-app
  acceptedPacks:
    - architecture.mid-app
    - clean-code.baseline
    - naming.typescript-baseline
    - ui.react-dashboard
    - gates.balanced
  overrides:
    - id: local.ui.shared-components
      reason: Existing design system uses package-owned shared primitives.
      expires: null
stack:
  acceptedCapabilities:
    queue: bullmq
    cache: redis
  rejectedCapabilities:
    durableWorkflow: not-needed-yet
```

## CLI Surface

Initial commands should stay small and composable.

Policy commands:

1. `skopos policies list [target]` - implemented first catalog read surface
2. `skopos policies show <pack> [target]` - implemented first pack detail surface
3. `skopos policies assess .`
4. `skopos policies recommend .`
5. `skopos policies apply . --pack architecture.mid-app`
6. `skopos policies explain architecture.mid-app`
7. `skopos policies drift .`

Stack commands:

1. `skopos stack assess .`
2. `skopos stack recommend . --goal "send retryable invoices"`
3. `skopos stack explain queue`
4. `skopos stack decide queue bullmq --reason "Needs retryable background invoice jobs"`
5. `skopos stack reject durableWorkflow --reason "Cron plus queue is enough for current workload"`

Memory commands:

1. `skopos memory refresh .`
2. `skopos memory status .`
3. `skopos memory explain . --topic architecture`
4. `skopos memory diff . --since <checkpoint>`
5. `skopos agent brief . --include memory,policy,stack,drift`

Profile commands:

1. `skopos init . --profile greenfield.small-app`
2. `skopos init . --profile brownfield.mid-app`
3. `skopos init . --profile greenfield.react-dashboard`
4. `skopos profiles recommend .`
5. `skopos profiles explain brownfield.mid-app`

Agent commands:

1. `skopos agent brief .`
2. `skopos instructions scaffold . --profile brownfield.mid-app`
3. `skopos trust . --include policies,stack,drift`
4. `skopos eval . --include policy-drift`

## Brownfield Flow

1. User runs `skopos init .`.
2. Skopos classifies project shape and lifecycle.
3. Skopos scans docs, command surface, tree shape, imports, package boundaries, UI structure, and existing patterns.
4. Skopos recommends a profile and packs with confidence levels.
5. User accepts the recommended profile or chooses another.
6. Skopos scaffolds or updates `AGENTS.md` without overwriting local truth unless forced.
7. Skopos writes accepted pack state into `.skopos/policies/resolved.json`.
8. Skopos generates compact policy docs if configured.
9. Skopos reports current drift only against accepted policy.
10. Future `trust`, `plan`, `eval`, and `done` flows include policy and stack posture.

Brownfield acceptance rule:

Skopos must not mark a mature project as wrong only because it differs from Skopos defaults. It should mark drift only after a policy is accepted or when a universally unsafe pattern exists, such as secrets in code, generated artifact edits, or broken command surfaces.

## Greenfield Flow

1. User runs `skopos init . --greenfield` or chooses a greenfield profile.
2. Skopos asks bounded questions about product shape, team size, public API, UI needs, backend needs, persistence, background work, deployment, and validation budget.
3. Skopos recommends policy, workflow, gate, and stack packs.
4. User accepts or changes the profile.
5. Skopos writes `AGENTS.md`, config, docs router, and initial policy docs.
6. Skopos recommends a minimal stack rather than maximal infrastructure.
7. Skopos records decisions and rejected complexity.
8. Skopos creates an initial trust report and agent brief.

Greenfield acceptance rule:

The first Skopos greenfield profile should be strong but restrained. It should prevent chaos without installing enterprise ceremony into a small product.

## Stack Recommendation Examples

### When To Add Redis

Recommend Redis when signals include:

1. multi-process cache coherence
2. rate limiting across instances
3. queue backend requirement
4. distributed locks
5. shared session storage
6. websocket presence coordination
7. high-read data that can tolerate cache invalidation policy

Do not recommend Redis when:

1. the app is single-process and low traffic
2. local in-memory cache is enough
3. the team has no operational path for Redis
4. the need is actually durable job orchestration rather than caching

Required policy if accepted:

1. local dev setup
2. production config
3. failure behavior
4. key naming
5. TTL policy
6. monitoring
7. tests for cache fallback or invalidation where relevant

### When To Add A Queue

Recommend a queue when signals include:

1. slow work that should not block requests
2. retryable external API calls
3. webhook fanout
4. email or notification delivery
5. media processing
6. import/export jobs
7. rate-limited provider calls
8. failure isolation

Do not recommend a queue when:

1. the work is fast and must stay transactionally synchronous
2. no retry or failure handling is needed
3. a simple scheduled script is sufficient

Required policy if accepted:

1. job naming
2. payload schema
3. idempotency
4. retries and backoff
5. dead-letter handling
6. observability
7. local execution path
8. tests for duplicate delivery

### When To Add Cron Or Durable Workflows

Recommend cron when:

1. the task is time-based
2. the task is short or can delegate to a queue
3. failure handling is simple
4. no long-running state machine is needed

Recommend durable workflow tooling when:

1. steps are long-running
2. retries must preserve step state
3. external callbacks are part of the process
4. human approval or waiting is needed
5. auditability matters
6. partial failure recovery matters

Required policy if accepted:

1. schedule ownership
2. execution idempotency
3. run visibility
4. retry policy
5. alerting
6. local test path
7. data consistency guarantees

## Enforcement And Proof

Each pack family must have a proof lane before it is considered product-grade.

Minimum proof requirements:

1. at least one greenfield fixture
2. at least one brownfield fixture
3. at least one drift fixture
4. at least one local override fixture
5. CLI e2e coverage for recommendation and acceptance
6. trust integration coverage
7. eval or done integration coverage when severity can block closure
8. generated artifact freshness coverage
9. agent brief coverage
10. UI projection coverage when user-facing

Quality gate for a pack:

1. no placeholder rules
2. no vague advice without examples
3. no rule that cannot be explained or checked
4. no framework-specific default without applicability signals
5. brownfield behavior documented
6. greenfield behavior documented
7. override behavior documented
8. drift behavior tested
9. command impact documented
10. token impact considered

## System UI Surface

The routed console should expose policy and stack intelligence only where it helps users decide or trust.

Initial surfaces:

1. `overview`
   - active profile
   - accepted packs
   - policy drift summary
   - stack recommendation summary

2. `trust`
   - blocking policy drift
   - missing accepted stack gates
   - stale policy artifacts

3. `plan` or `mission detail`
   - policy obligations for the current task
   - stack decision questions for the current task
   - validation lane chosen from gate packs

4. `docs` or `knowledge detail`
   - generated policy docs and accepted decisions

Avoid a giant policy dashboard as the first UI. The useful surface is task-context guidance and trust posture.

## Implementation Phases

### Phase 0: Design Contracts

Deliverables:

1. pack manifest schema
2. profile schema
3. policy resolution schema
4. stack recommendation schema
5. drift report schema
6. config extension proposal
7. decision doc for accepted architecture

Acceptance:

1. schemas are typechecked
2. sample artifacts are realistic
3. no generated artifact format is ambiguous
4. no command surface is committed before artifact ownership is clear

### Phase 1: Pack Runtime And Artifact Model

Deliverables:

1. pack discovery
2. pack validation
3. pack recommendation engine
4. accepted-pack persistence
5. generated policy docs
6. project agent brief integration

Acceptance:

1. `skopos policies recommend` works on Skopos and fixtures
2. accepted packs show in trust
3. installed `AGENTS.md` references accepted policy compactly
4. stale pack artifacts trigger trust warnings

### Phase 2: First Product-Grade Packs

Initial packs:

1. `architecture.small-app`
2. `architecture.mid-app`
3. `architecture.monorepo`
4. `clean-code.baseline`
5. `naming.typescript-baseline`
6. `structure.single-app`
7. `structure.package-monorepo`
8. `ui.react-baseline`
9. `gates.fast`
10. `gates.balanced`

Acceptance:

1. each pack has real docs, examples, checks, fixtures, and tests
2. brownfield and greenfield behavior both work
3. no pack is accepted as complete with placeholder-only content

### Phase 3: Stack Advisor

Deliverables:

1. capability model
2. signal detector
3. recommendation engine
4. stack decision persistence
5. stack guidance in agent brief
6. stack-aware gates

Initial capabilities:

1. Redis/cache
2. queue
3. cron/scheduler
4. durable workflow
5. search
6. observability
7. feature flags
8. realtime

Acceptance:

1. recommendations include anti-signals and tradeoffs
2. accepted stack decisions affect future plan/eval output
3. rejected stack decisions are remembered
4. Skopos avoids recommending infrastructure without workload signals

### Phase 4: Drift Detection And Closure Integration

Deliverables:

1. drift checks for first pack set
2. trust warnings
3. eval blockers for `must` drift
4. done integration
5. override and expiration support

Acceptance:

1. accepted policy drift blocks closure when severity is `must`
2. intentional local exceptions do not keep blocking after approval
3. drift reports point to rules, files, and remediation guidance

### Phase 5: Greenfield Profiles

Deliverables:

1. profile recommendation command
2. bounded profile questions
3. initial greenfield policy installs
4. starter docs router
5. first agent brief

Acceptance:

1. small-app profile stays simple
2. large-platform profile includes stronger boundaries
3. library profile includes public API and release gates
4. profile choice can be changed through explicit decision flow

### Phase 6: Brownfield Stabilization Packs

Deliverables:

1. brownfield pattern detector
2. competing-pattern report
3. stabilization workflow pack
4. before-versus-after drift score
5. local override proposal flow

Acceptance:

1. brownfield projects get stabilization recommendations before broad rewrites
2. Skopos can identify dominant local patterns
3. Skopos can identify drift without misclassifying all legacy as wrong
4. stabilization improvements show measurable trust delta

### Phase 7: UI Productization

Deliverables:

1. overview policy posture
2. trust policy blockers
3. mission policy obligations
4. stack recommendation review surface
5. accepted decisions reader

Acceptance:

1. users can understand why a pack or stack recommendation exists
2. users can see what is blocking closure
3. users can accept/reject decisions without reading raw JSON
4. UI stays projection-only and does not become the source of truth

## Non-Goals

1. Do not build a hosted coding agent.
2. Do not make Skopos depend on one LLM provider.
3. Do not make packs hidden prompt tricks.
4. Do not force every project into one architecture style.
5. Do not ship toy packs that only contain slogans.
6. Do not make small projects carry large-platform ceremony.
7. Do not treat stack recommendations as affiliate-style technology suggestions.
8. Do not let pack docs replace actual gates and proof.

## Success Criteria

1. Installing Skopos in a project gives agents immediate, project-specific working rules and compact current memory.
2. Brownfield repos get stabilization guidance without destructive rewrite bias.
3. Greenfield repos get strong defaults without unnecessary infrastructure.
4. Stack recommendations are explainable, remembered, and reversible.
5. Accepted policy changes future planning, trust, eval, and done behavior.
6. Drift is detected against accepted local truth, not generic preference.
7. Pack quality is proven through fixtures and gates before release claims.
8. Users can see and change the active project policy without editing raw generated artifacts.
9. Project knowledge does not silently drift: stale docs, stale generated memory, obsolete decisions, missing command evidence, and policy contradictions surface in trust or eval.
10. Skopos works as well for a non-Unisane product repo as it does for Skopos or Unisane-inspired architecture.

## Immediate Next Slice

The first implementation slice should be design-first, not pack-content-first.

Build order:

1. add a decision doc for policy pack and stack intelligence artifact ownership
2. define pack manifest, resolved policy, stack recommendation, and drift schemas
3. add one realistic internal example pack without public claims
4. add `skopos policies recommend` against Skopos and fixture repos
5. add trust integration for stale or missing accepted policy artifacts
6. add proof fixtures before adding more packs

A single high-quality `architecture.mid-app` pack with real checks, examples, brownfield behavior, and proof is more valuable than ten thin placeholder packs.
