---
title: "Decision: Intelligent Project Onboarding Contract"
status: accepted
owner: skopos-core
id: D-20260812-INTELLIGENT-PROJECT-ONBOARDING
scope: skopos
role: decision
lifecycle: durable
authority: canonical
provenance: accepted
view: target
date: 2026-08-12
implementationStatus: implemented-core-workflow
lastUpdated: 2026-08-13
relatedDocs:
  - ../architecture/intelligent-project-onboarding.md
  - ../architecture/docs-governance.md
  - ../architecture/agent-native-operating-model.md
  - ../architecture/artifact-model.md
  - 024-token-control-compact-agent-transport-and-progressive-retrieval.md
  - ../domains/product/vision.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: per onboarding implementation phase
---

# Decision: Intelligent Project Onboarding Contract

## Changelog

- `2026-08-13`: Implemented the clean public setup surface, unified state and review,
  source-bound dispositions, staged resume checkpoints, mixed-language capability
  discovery, executable agent packet, lane readiness, and bound host-delivery receipt.
  Removed the public prototype adoption command family; init remains diagnostic.
- `2026-08-13`: Bound the human conversation contract to selective response transport.
  Detailed setup guidance is stage-specific, ordinary turns keep a tiny contract, and
  response-quality evaluation does not add a second per-response model call.

## Context

Skopos already has safe lower-level workflows for initialization, Project Memory
assessment, restructuring approval, capability integration, Policy recommendation,
Skill acceptance, instruction projection, and verification. Requiring a developer or
coding agent to discover and operate those workflows separately creates too much
visible ceremony and can leave a project only partially configured.

The problem is most serious for existing projects. Their documentation may be absent,
scattered, contradictory, or organized around folders that do not represent durable
ownership. A deterministic scanner can inventory those sources, but it cannot safely
decide product intent, architectural authority, meaningful Scope boundaries, or what
knowledge should become canonical. That work requires coding-agent investigation and
user judgment.

Skopos has not launched. The correct response is a clean target refactor, not a
compatibility layer around the current prototype command sequence.

## Decision

Skopos will provide one coding-agent-led project setup workflow with five user-facing
stages:

```text
Understand -> Clarify -> Review -> Apply -> Verify
```

The default entrypoint is:

```bash
skopos setup .
```

Equivalent natural-language requests such as “Set up Skopos for this project” use the
same runtime authority. `setup status`, `setup resume`, and `setup review` expose the
same workflow without creating alternative state owners.

The coding agent performs investigation, synthesis, recommendations, questions, and
approved project edits. Skopos supplies the project boundary, structured work
contract, durable authority rules, decision state, approval envelope, deterministic
validation, and truthful Readiness.

## Required Setup Coverage

One setup review covers, in dependency order:

1. project purpose, users, workflows, architecture, and lifecycle
2. meaningful Scopes, code roots, Memory roots, dependencies, and ownership
3. existing Project Memory authority and proposed restructuring
4. missing Project Memory created from source Evidence and user-confirmed intent
5. project capabilities proposed as Actions selected by Guards
6. proportional Policy recommendations
7. relevant task-selective Skills and generated project bindings
8. coding-agent instructions, adapters, and delivery verification
9. lane-specific and overall setup Readiness

The workflow adapts depth to the project. A small clean library receives a short plan;
a contradictory production monorepo receives deeper investigation and explicit
questions. The underlying guarantees do not weaken when the visible interaction is
shorter.

## Agent Authority

During understanding, the coding agent may inspect every permitted project source and
may create only local generated assessment state. It may:

1. inspect source, tests, configuration, CI, documentation, and allowed history
2. classify claims as fact, inference, user-confirmed intent, contradiction, or unknown
3. propose Scopes and Project Memory structure
4. draft evidence-bound missing Memory
5. discover commands and propose project capabilities
6. recommend Policies and Skills
7. explain recommendations and their effect on future coding-agent work

It must stop for user judgment when the answer changes product truth, architecture,
Scope ownership, document authority, security, public behavior, information retention,
or another material setup boundary. It must not mutate human-authored project truth,
accept a material Policy, bind a Skill, or perform an external effect before the
required approval.

## Human Conversation Contract

The setup agent behaves like a project consultant rather than a command transcript.
It must:

1. explain what it understands in plain project-specific language
2. distinguish findings, recommendations, risks, and questions
3. recommend a default and explain why it improves future agent work
4. ask only material questions and normally ask one at a time
5. group related low-risk recommendations without hiding their effect
6. remember prior answers and avoid repeated questions
7. hide digests, schemas, binding ids, and internal lifecycle details unless requested
8. report progress as meaningful project outcomes rather than artifact writes
9. state incomplete or unverified integration honestly

Every material question contains the decision, why it matters, supporting evidence,
the recommended answer, alternatives and trade-offs, what happens after the answer,
and the safe behavior when deferred.

This richness is conditional rather than always injected. The stable communication
contract remains small; setup loads the detailed conversation layer only for initial
understanding, material questions, review, risky apply boundaries, resume, and
completion. Unchanged setup context is referenced or summarized rather than replayed.
Plain-language quality is certified through focused scenario evaluation during
implementation and release, not through an additional model judge on every response.

Every optional recommendation supports four distinct dispositions:

1. `accept`: include it in the approved setup
2. `edit`: revise it through conversation before approval
3. `defer`: omit it now but preserve it as an open recommendation
4. `reject`: record an intentional refusal and do not repeat it unless material source
   evidence changes

Natural-language partial approval must revise the exact setup envelope before apply.

## Project Memory Convergence

Arbitrary brownfield layouts remain discovery input, not the adopted end state.
Onboarding may propose `keep`, `move`, `merge`, `split`, `rewrite`, `archive`, `delete`,
and `create-from-evidence` operations.

`create-from-evidence` is required for undocumented projects. A created document binds
its verified claims to source paths, keeps inferences and unknowns explicit, records
user-confirmed intent separately, and receives canonical authority only through the
reviewed setup envelope. Skopos does not generate empty document families merely to
satisfy a template.

Existing-project setup proposes and obtains approval for meaningful Scope definitions
before any restructuring target depends on a Memory root. Package or directory
discovery may suggest a boundary but never becomes accepted Scope authority by itself.

## Setup State And Authority

Setup is a workflow, not a new durable product primitive or parallel control plane.

1. local intake, drafts, conversation progress, generated recommendations, approval
   envelopes, and verification receipts live under rebuildable `.skopos/**`
2. accepted Scope outcomes live in the Scope registry
3. accepted Memory outcomes live in canonical tracked Project Memory
4. accepted capabilities live in tracked Action and Guard declarations
5. accepted Policy and Skill outcomes live in their existing tracked sources
6. accepted agent guidance lives in the canonical instruction source and declared
   mirrors
7. defer and reject dispositions live with the subsystem that owns the recommendation
   and are invalidated only by material source change
8. no omnibus tracked setup manifest duplicates these authorities

Application is resumable by stage. A failure reports completed stages, unapplied
stages, invalidated recommendations, and the exact safe continuation. Approval is
bound to the reviewed source and recommendation identities; changed material inputs
invalidate affected approval rather than silently widening it.

## Readiness

One loose `agent-ready` label is insufficient. Setup reports at least:

1. project understanding
2. Scopes
3. Project Memory
4. capabilities and checks
5. Policies
6. Skills
7. agent instructions
8. host delivery

Overall setup states are:

1. `inspection-required`
2. `questions-open`
3. `plan-ready`
4. `applying`
5. `verification-blocked`
6. `setup-ready`
7. `setup-ready-with-deferred-options`

`setup-ready` requires current, internally consistent proof for every required lane.
Generated adapter files are configuration Evidence, not proof that a host delivered
context. Optional deferred recommendations may produce
`setup-ready-with-deferred-options`; required or failed lanes cannot.

The accepted setup result is durably certified by one typed, canonically completed
high-impact setup certification Task and its immutable source-bound snapshot. The Task
must pass the normal Action, Evidence, Readiness, snapshot, and finish lifecycle; setup
cannot write a completed certification directly. Those existing Task owners
reconstruct tracked readiness on a clean checkout; host delivery remains Session-local
and must be reverified. No parallel setup manifest becomes configuration or Memory
authority.

## Clean-Refactor Consequences

1. The current visible `init -> assess -> propose -> approve -> execute -> verify ->
   activate` ceremony is implementation input, not a public compatibility contract.
2. Capability, Policy, Skill, instruction, and adoption setup are composed under the
   unified workflow instead of remaining separate onboarding journeys.
3. Replaced commands, schemas, states, help, fixtures, and generated projections are
   removed in the same implementation slices that introduce their canonical owners.
4. No aliases, dual readers, command shims, migrations, or “legacy setup” mode are
   added for the unreleased prototype.
5. Low-level diagnostic operations may remain only when they serve a distinct advanced
   or recovery purpose under the same setup authority.

## Consequences

The default onboarding experience becomes substantially simpler while Project Memory,
approval, provenance, capability safety, and verification remain strict. The coding
agent receives enough authority and a complete work contract to sort out an existing
project well, but cannot invent project truth or widen approved changes.

Implementation must expand discovery beyond root `package.json` assumptions, generate
project-specific Skill bindings, distinguish configured adapters from verified host
delivery, and prove the workflow against undocumented, chaotic, contradictory,
multi-language, mixed-stack, small, and complex projects.

## Non-Goals

1. force one source-code architecture or universal docs tree on every adopter
2. replace the coding agent's judgment with scanner heuristics
3. expose internal artifact ceremony as the normal user experience
4. accept every discovered command, Policy, or Skill automatically
5. weaken approval for destructive, external, security-sensitive, or truth-changing
   operations
6. preserve compatibility with the pre-release onboarding prototype
