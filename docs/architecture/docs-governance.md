---
title: Project Memory And Documentation Governance
status: active
owner: skopos-core
id: SKOPOS-ARCH-DOCS-GOVERNANCE
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: target
implementationStatus: partial
lastUpdated: 2026-08-02
relatedDocs:
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
  - ../patterns/README.md
  - artifact-model.md
  - retrieval-and-query-strategy.md
reviewCycle: when Memory structure or lifecycle changes
---

# Project Memory And Documentation Governance

Skopos gives coding agents a predictable semantic Memory structure while allowing each
project to keep its own application code architecture.

## Changelog

- `2026-08-02`: Bound tracked Task projections to their declared Scope Memory roots
  and made cross-root catalog discovery the reconstruction authority.
- `2026-07-31`: Kept verified adoption active during routine `skopos init` knowledge
  refreshes. Normal Project Memory evolution no longer reopens brownfield assessment;
  `skopos adopt assess` remains the explicit command for restarting adoption review.
- `2026-07-29`: Made canonical adoption intake part of actual initialization.
  Existing-project init performs assessment without creating a docs router or declared
  Scope registry; greenfield init creates the minimum router and registry directly.
  Exact proposal approval now generates a coding-agent execution brief containing only
  the approved operations, an Evidence template, and the verification command.
- `2026-07-29`: Added approval-bound adoption standard verification. Coding-agent
  execution evidence must cover every approved operation exactly once, result paths
  must match the approved topology, and strict metadata, links, required Memory roles,
  and instruction parity must all pass before Skopos records `standard-verified`.
  Activation remains a separate step and verification does not claim `agent-ready`.
- `2026-07-28`: Made `severity` mandatory for active Findings and removed the
  Work Queue compiler's last hand-maintained Finding-registry reader; queue entries now
  derive from the canonical document catalog and individual Finding metadata.
- `2026-07-28`: Defined the exact project-generic Scope kinds, required unique
  canonical Memory roots, and separated non-strict discovery records from adopted
  agent Memory and public context; query freshness now covers every declared Memory
  root, including colocated roots outside the workspace docs directory.
- `2026-07-28`: Restricted generated authority to
  `<memoryRoot>/reference/generated/**`, rejected generated directories elsewhere in
  strict adoption, and retained foreign generated layouts only during non-strict
  discovery.
- `2026-07-28`: Made YAML frontmatter the sole adopted metadata grammar, made invalid
  and duplicate records fail closed, enforced semantic role placement relative to the
  deepest declared Scope Memory root, and projected every relevant active or durable
  Memory role into compact Task context.
- `2026-07-28`: Added strict catalog validation for core metadata, declared Scope ids,
  Pattern kind/applicability, archive/generated routing, and local links; connected
  violations to Readiness while preserving non-strict brownfield intake.
- `2026-07-28`: Self-adopted the canonical workspace and Scope Memory tree in Skopos,
  declared stable package Scopes, normalized existing document metadata, removed
  hand-maintained registries, and compiled relevant failure Patterns into Task
  negative knowledge.
- `2026-07-28`: Defined optional Scope-relative `patterns/` Memory, preferred and
  failure kinds, metadata-derived indexing, and promotion and retrieval boundaries.

- `2026-07-28`: Replaced permanent brownfield role mapping with the Project Memory
  standard and agent-guided restructuring. Separated human generated reference under
  docs from local Skopos runtime output.

## Core Rules

1. fully adopted projects converge on the Project Memory standard
2. discovery mapping is temporary intake state
3. Skopos never silently restructures human-authored docs
4. material restructuring requires an approved operation envelope
5. source-code architecture is not standardized
6. every Memory root uses the same relative semantic grammar
7. current, target, transition, and exception views are explicit
8. active and durable Memory is eligible for default retrieval
9. historical Memory is archived and excluded by default
10. dead duplication is deleted
11. generated state never becomes hand-authored truth
12. no manual cross-document registry is required
13. collision-resistant ids prevent concurrent creation conflicts
14. no empty documentation families are scaffolded
15. reusable preferred and failure knowledge belongs in `patterns/`, not in an
    overloaded Standard, Finding, Decision, or Plan
16. adopted documents use one YAML-frontmatter grammar; Markdown metadata sections and
    alias fields are discovery inputs, never a second adopted schema
17. `failure-pattern` is a Pattern kind, not a separate `failure-patterns/` family
18. existing-project init starts with non-mutating assessment; greenfield init creates
    the minimum standard router and declared Scope registry directly
19. after verified activation, routine init refreshes generated project state without
    discarding adoption; only explicit adoption assessment reopens the review workflow
20. a tracked Task is stored at `work/tasks/**` relative to its declared Scope Memory
    root, and portable reconstruction catalogs every declared Memory root
21. before adoption, only the inferred default workspace Scope may use the standard
    `docs/` root; a declared Scope with missing or unsafe Memory authority fails closed

## Workspace Memory Root

```text
docs/
├── 00-start-here.md
├── overview.md
├── architecture/
├── standards/
├── domains/
├── guides/
├── operations/
├── decisions/
├── findings/
├── patterns/
├── work/
│   ├── plans/
│   ├── tasks/
│   └── archive/
├── reference/
│   └── generated/
└── archive/
```

Only `00-start-here.md` and `overview.md` are universal. Other families, including
`patterns/`, exist only when the project has durable truth in that role.

## Scope Memory

A declared Scope may own one `memoryRoot`.

Scope `kind` uses this exact project-generic set:

1. `workspace`
2. `product`
3. `application`
4. `service`
5. `package`
6. `domain`
7. `infrastructure`
8. `tool`

There is exactly one `workspace` Scope. Every other kind declares a parent. Library,
internal-package, and minimal behavior belongs to the selected Profile rather than
creating more Scope-kind aliases.

The default centralized location is:

```text
docs/scopes/<scope-id>/
```

A project may deliberately colocate a Scope Memory root beside its code. Colocation is
not arbitrary mapping: the root is explicit in `tools/skopos/scopes.yaml`, and its
contents follow the same relative grammar.

Rules:

1. Scope ids are stable and path-independent
2. a Scope may own several code roots
3. a Scope has at most one canonical Memory root
4. two Scopes cannot declare the same normalized canonical Memory root
5. child Scopes inherit parent governance
6. child docs add owned knowledge rather than copy parent truth
7. technical dependencies are separate from parent inheritance
8. the chosen placement strategy is intentional and reviewable
9. docs roots and agent instruction files are governed surfaces, not declared Scopes;
   a fully adopted Scope index contains only registry entries
10. Skopos catalogs every declared Memory root, including deliberate colocated roots
11. when Memory roots are nested, the deepest matching declared root owns the document;
    a document claiming another Scope is quarantined
12. every declared Memory root is a source dependency, so changed or newly added
    colocated Memory invalidates compiled query state
13. Task projection follows the Task's declared Scope; workspace Tasks use the
    workspace root without imposing that root on child Scopes

## Canonical Relative Grammar

Every workspace or Scope Memory root uses the same semantic routes:

| Role | Canonical location relative to the Memory root |
| --- | --- |
| Router | `00-start-here.md` |
| Overview | `overview.md` |
| Architecture | `architecture/**` |
| Standard | `standards/**` |
| Domain | `domains/**` |
| Guide | `guides/**` |
| Operation | `operations/**` |
| Decision | `decisions/**` |
| Finding | `findings/**` |
| Pattern | `patterns/**` |
| Plan | `work/plans/**` |
| Task | `work/tasks/**` |
| Reference | `reference/**` |

Historical documents may use the relevant family `archive/` or the Memory-root
`archive/`. A family `README.md` may act as that family's compact router or Standard.
The generic `document` role is discovery vocabulary, not a valid role in a
strictly-adopted Memory root.

### Generated Reference Boundary

Generated reference is a narrow Project Memory authority:

1. `authority: generated` is valid only under
   `<memoryRoot>/reference/generated/**`
2. every document under that route declares `authority: generated`
3. a `generated/` directory anywhere else in an adopted Memory root is invalid
4. non-strict discovery may inspect a foreign generated layout, but that tolerance
   does not make the layout adopted truth

## Document Contract

Every adopted document begins with YAML frontmatter. There is no parallel Markdown
`## Metadata` block and no alias such as `Doc ID`, `docId`, `Pattern Kind`, or
`patternKind`.

The required core is:

1. id
2. Scope
3. role
4. lifecycle
5. authority
6. provenance
7. view
8. owner

Use these canonical optional fields when they carry truth:

1. `title` and role-specific `status`
2. `appliesTo` for deterministic relevance signals
3. `relatedDocs` and role-specific relationship fields such as `supersededBy`
4. `lastUpdated` and `reviewCycle`
5. Evidence references when the claim needs supporting proof
6. `kind` when the role is `pattern`
7. `severity` as `MUST`, `SHOULD`, or `COULD` when the role is an active `finding`

For example:

```yaml
---
title: Payments Retry Decision
status: accepted
owner: payments
id: D-a84d19c2
scope: platform-payments
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - packages/payments/**
relatedDocs:
  - ../architecture/retry-model.md
lastUpdated: 2026-07-28
reviewCycle: when retry ownership changes
---
```

Allowed lifecycle:

1. `active`
2. `durable`
3. `historical`
4. `dead`

Allowed authority:

1. `canonical`
2. `supporting`
3. `generated`

Allowed provenance:

1. `declared`
2. `accepted`
3. `observed`
4. `inferred`
5. `proposed`

Allowed view:

1. `current`
2. `target`
3. `transition`
4. `exception`

Inferred or proposed content cannot become canonical merely because an agent wrote it.
Promotion needs explicit acceptance or evidence-backed declared truth.

Strict adoption is fail closed:

1. malformed or noncanonical frontmatter is reported and the document is withheld from
   agent Memory
2. unknown Scope ids and Scope-to-memory-root mismatches are reported
3. role-to-path mismatches are reported
4. duplicate ids report every conflicting document and all copies are withheld
5. invalid Pattern kind or missing Pattern applicability is reported
6. missing or invalid active Finding severity is reported
7. broken local links remain Readiness issues even when the owning document is quarantined

## Pattern Family

`patterns/` is an optional durable Memory family. It may exist at the workspace root or
at `<scope-memory-root>/patterns/`; the same grammar applies in both locations.

Each Pattern uses a collision-resistant `PAT-<id>` and declares one kind:

1. `preferred-pattern`: context, applicability signals, forces, repeatable response,
   expected outcome, and trade-offs
2. `failure-pattern`: detection signals, failure mechanism, consequences, prevention,
   and recovery

A Pattern is contextual reusable knowledge. A Standard is normative, a Finding is a
current observed condition, and a Decision is an accepted choice. A Finding may
instantiate a failure Pattern; a Decision may adopt or address a Pattern. None of those
relationships transfers authority automatically.

Lifecycle and retrieval follow these rules:

1. `active` and `durable` Patterns are eligible only when Task, Scope, path, symbol,
   Action, or risk signals match their applicability
2. `historical` Patterns move to `<memory-root>/archive/patterns/`, leave baseline
   retrieval, and remain available through explicit relationships or targeted
   negative-knowledge lookup
3. `dead` Pattern duplication is deleted after any still-valid rule is promoted
4. child Scope Patterns inherit parent governance and may add context, but cannot
   silently weaken a canonical parent Standard or Guard
5. `ui`, `api`, `db`, `cli`, and other short technical signals remain searchable;
   token filtering must not erase them

Authority and promotion follow the normal document contract. Proposed or inferred
Patterns cannot promote themselves. Observed failure Patterns require reproducible
Evidence or accepted review before becoming canonical. Repeated validation may justify
a separate Standard, Guard, or Decision; promotion uses that family's acceptance
process and the Pattern links to the new authority rather than duplicating its rule.

## Decision, Finding, Pattern, Plan, And Task Indexing

1. individual documents carry their own ids and status
2. Skopos compiles local indexes into `.skopos/index/**`
3. humans do not update a shared registry when adding an item
4. indexes may be rendered for humans, but remain generated
5. sequential global numbering is not used for new items
6. Git history supplies mechanical change history
7. docs keep changelog entries only for material semantic changes when useful

`patterns/README.md` documents the family contract. It must not contain a maintained
entry list; Pattern discovery and grouping come from entry metadata.

## Agent Retrieval

The catalog compiles all eligible active and durable roles—not only Decisions or
Patterns—into provenance-aware Memory candidates. A compact Task brief selects the
smallest relevant set from architecture, Standards, domains, guides, operations,
Decisions, Findings, Plans, tracked Tasks, Patterns, references, and other adopted
Memory.

Selection uses:

1. the Task goal, acceptance criteria, non-goals, constraints, and open decisions
2. the declared Scope plus its ancestors
3. owned and changed paths
4. symbols
5. selected Actions and required Evidence
6. risk
7. document title, summary, role, path, and `appliesTo`

A child Scope may receive relevant parent Memory. Parent and sibling Tasks do not
receive child-only Memory merely because a keyword matches. Compact entries retain the
source path so a coding agent can open the authoritative document when its summary is
insufficient.

Only strict, conforming adopted records become these Memory candidates. Non-strict
foreign or legacy records remain discovery and restructuring evidence even when their
inferred fields resemble a canonical Decision, Pattern, or another adopted role.

## Generated Output

1. checked-in human reference belongs only in `docs/reference/generated/**`
2. local UI builds, search indexes, graphs, Task projections, and other Skopos runtime
   output belong in `.skopos/**`
3. generated docs declare their owner command and source dependencies
4. generated output is never hand-edited
5. target runtime UI lives only under `.skopos/ui/**`

## Existing-Project Restructuring

The adoption agent:

1. inventories existing docs and instructions
2. identifies authority conflicts and missing roles
3. classifies reusable preferred and failure knowledge separately from one-off
   Findings and normative Standards
4. proposes keep/move/merge/split/rewrite/archive/delete operations
5. shows the target tree and relationship impact
6. asks only material questions
7. waits for approval
8. gives the coding agent the exact approved operations and Evidence template
9. performs Git-aware moves and edits
10. repairs links and agent instructions
11. verifies metadata, Scope coverage, lifecycle, and retrieval

A project that keeps an arbitrary layout may use assessment output, but does not pass
full adoption Readiness.

Non-strict discovery may recognize foreign frontmatter or Markdown metadata only to
build the restructuring proposal. Once a project declares strict adoption, the
canonical YAML grammar and role paths are the only readers used for agent Memory.

## Current Implementation Note

Skopos now self-adopts this physical Memory tree, declared Scope registry, single YAML
metadata grammar, strict role/Scope/id/link Readiness checks, metadata-derived catalog,
colocated Memory-root discovery, and Scope-aware relevance selection across every
active or durable Memory role. Preferred and failure Patterns use the same `patterns/`
family; relevant failure Patterns become negative knowledge.

Archived Task T-62a045f9 records the completed self-adoption proof. Actual init now
starts canonical adoption automatically. Existing projects receive non-mutating
assessment, while greenfield projects receive the minimum standard router and declared
Scope registry. Generic proposal, exact approval, coding-agent execution brief and
Evidence template, standard verification, explicit activation, and adoption-aware
Readiness checks are implemented. Skopos does not autonomously rewrite human documents:
the coding agent performs only the approved operations. Complete Profile enforcement,
promotion validation, verified host/UI delivery, and pre-launch adopter proof remain
owned by the active convergence Plan.
