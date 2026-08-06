---
title: Human-First Supervision Projection
status: accepted
owner: skopos-core
id: SKOPOS-D-20260804-HUMAN-FIRST-SUPERVISION-PROJECTION
scope: skopos-ui
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: target
date: 2026-08-04
implementationStatus: implemented
lastUpdated: 2026-08-04
relatedDocs:
  - ../overview.md
  - ../findings/archive/F-20260804-human-supervision-projection-drift.md
  - ../work/archive/P-20260804-human-first-ui-convergence.md
  - D-20260804-browser-history-and-unisane-ui-registry-delivery.md
  - D-20260804-unisane-ui-visual-ownership.md
  - archive/009-system-ui-app-shell-and-layout-doctrine.md
  - archive/010-system-ui-information-hierarchy-and-signal-placement.md
  - archive/011-system-ui-navigation-and-knowledge-routing.md
  - archive/014-system-ui-component-architecture-and-layout-normalization.md
  - ../../../architecture/evidence-and-readiness-model.md
  - ../../../architecture/agent-native-operating-model.md
---

# Human-First Supervision Projection

## Context

Skopos exists to make project work safer and easier to understand. Its canonical
runtime already models Project Memory, Scope, Task contracts, coordination, Evidence,
and Readiness. The UI should reduce the cost of supervising that model, not expose its
storage shape as a dashboard.

Existing system UI decisions correctly require attention-shaped information, simple
language, progressive disclosure, and a derived read-only UI. This Decision makes the
current product projection explicit without changing package, Scope, or runtime
authority boundaries.

## Decision

### One adaptive Now

Now is the default supervision surface. It consumes canonical Session Context and
adapts to the current state:

1. incomplete adoption or understanding
2. no current Task and recommended work available
3. a pending Task decision
4. an interrupted or running Action
5. active implementation
6. verification or closure

The first reading must answer, in plain language: what is happening, why it matters,
and what is the next safe action. Repository inventory is supporting context unless
adoption or understanding is the current concern.

Now renders only pressure that is current and actionable. A blocking Decision says
that work is waiting for the human; a non-blocking Decision is presented as a
recommendation and explains the default continuation. Discussion is shown only when
it belongs to the selected current Task. Plans, adapter capability, unrelated proof,
stale checkpoints, and empty attention states belong on their owning destinations,
not on Now. Every CLI handoff uses a visibly copyable command with an explicit actor
placeholder.

### Five primary destinations

Primary navigation is organized around human intent:

1. `Now` — current state, decision, and next safe action
2. `Work` — Work Queue, Tasks, Plans, ownership, and coordination
3. `Knowledge` — human project understanding and durable Memory
4. `Readiness` — subject-specific confidence, blockers, Evidence, and closure
5. `Activity` — recent Actions and state changes

Canonical product nouns remain visible. Plain sentences explain them; Skopos does not
replace its model with generic project-management vocabulary.

### Complete Task explanation, progressively disclosed

Task detail presents the goal and state first, then makes these canonical facts easy
to inspect:

1. Scope, acceptance criteria, non-goals, and constraints
2. owned paths, claims, other Sessions, and coordination conflicts
3. selected Actions and Guards
4. Evidence requirements and current proof
5. proof subject: `task-closure` or `project-integration`
6. the exact continue, verify, or finish path

Light Tasks stay compact. Standard and high-impact Tasks disclose proportionally more
contract and proof detail.

### Human Knowledge before index diagnostics

Project Knowledge separates:

1. human understanding — product purpose, architecture shape, Scopes, durable
   Decisions, active structural Findings, and important constraints
2. Memory diagnostics — source mappings, index coverage, generated paths, freshness,
   and retrieval details

Diagnostics remain available but do not masquerade as project understanding.

### Project Map is canonical Scope orientation

Project Map helps a developer understand how the declared Scopes fit together. Scope
detail derives from the canonical Scope registry, Scope Memory, dependency
relationships, related knowledge, and current work. It answers:

1. what the area is for
2. where it lives and who owns it
3. which responsibilities, commands, or rules its canonical overview records
4. what it depends on and what depends on it
5. which authoritative documents and current work belong to it

The UI does not maintain package-specific Scope descriptions or a second project
graph. Missing Scope Memory is shown as a missing explanation rather than replaced by
invented product knowledge.

### Readiness always has a named subject

Every Readiness surface states which question it answers:

1. adoption readiness — can Skopos understand and safely guide this Project?
2. Task continuation readiness — may this Task proceed now?
3. Task closure readiness — does this Task have the required Evidence and resolved
   obligations to finish?
4. Project integration readiness — is an explicitly owned integrated Project baseline
   certified?

Ready or blocked is never shown without this subject.

### Authority and interaction boundary

The UI stays derived and read-only. It may show, copy, or hand off an exact canonical
CLI or MCP command. It does not invent a second Task, approval, mutation, Evidence, or
Readiness authority.

`@skopos/ui` remains the product pattern owner. The successor delivery Decision accepts
Unisane UI external registry installation as the shared primitive boundary: Skopos owns
the installed source and CSS locally and introduces no direct Unisane workspace runtime
dependency. The visual ownership Decision makes those installed component defaults and
semantic tokens authoritative while Skopos retains workflow composition and language.

### Interaction quality

1. sentence case and conversational explanations are preferred over label piles
2. one primary action or decision dominates each state
3. raw ids, paths, JSON, and counts use secondary disclosure
4. compact navigation is deliberate and does not place the entire sidebar before the
   working canvas
5. hidden overlays are inert or unmounted and keyboard/focus behavior is explicit
6. color, icons, and status badges support wording rather than carrying meaning alone

## Consequences

1. console state must project canonical Session Context instead of rebuilding a
   competing current-state interpretation
2. route families can be consolidated in navigation without removing deep canonical
   views
3. current Project Readiness remains useful but must be named as adoption readiness
   until other subjects are projected
4. source changes should favor selectors and reusable supervision patterns over
   route-local dashboards
5. Unisane UI convergence is implemented by the separate registry delivery Decision
   without changing this supervision projection
6. Project Map projection must join canonical Scope, document, relationship, and work
   data before rendering instead of hardcoding package knowledge in React components

## Rejected Alternatives

### Keep artifact families as equal primary navigation

Rejected because it optimizes for model enumeration rather than current developer
intent.

### Replace canonical Skopos nouns with generic friendly language

Rejected because short-term familiarity would weaken the shared human-agent contract.
Canonical terms remain, with clear explanations.

### Rebuild Skopos UI directly on private Unisane workspace packages

Rejected because it would couple independent product distribution and release
authority before that contract is proven.

## Changelog

- `2026-08-04`: Tightened Now to truthful blocking language, selected current-state
  pressure, current-Task discussion, and an explicit copyable CLI handoff.
- `2026-08-04`: Defined Project Map as canonical Scope orientation derived from the
  Scope registry, Scope Memory, dependencies, related knowledge, and current work.
- `2026-08-04`: Refined the implemented projection so Task and queue pages lead with
  current work, readiness answers directly, search suggestions stay bounded, and
  metadata or repeated help no longer competes with the next safe action.
- `2026-08-04`: Linked the implemented Unisane-default visual ownership and Ops-style
  shell without changing the human-first supervision model.
- `2026-08-04`: Linked the implemented successor Decision for browser-history URLs and
  external Unisane UI registry delivery.
- `2026-08-04`: Implemented the projection across canonical Session Context, Task
  contract detail, human Knowledge, subject-named Readiness, the five navigation
  families, compact navigation, and search accessibility. Unisane UI remains deferred
  as decided.
- `2026-08-04`: Accepted the canonical human-first supervision projection and retained
  current package, Scope, and runtime authority boundaries.
