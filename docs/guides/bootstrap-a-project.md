---
title: Bootstrap The Project
status: active
owner: skopos-core
id: SKOPOS-HOWTO-BOOTSTRAP-PROJECT
scope: skopos
role: guide
lifecycle: durable
authority: supporting
provenance: declared
view: current
appliesTo:
  - workspace
lastUpdated: 2026-08-13
relatedDocs:
  - ../00-start-here.md
  - ../architecture/config-model.md
  - ../architecture/artifact-model.md
  - ../architecture/docs-governance.md
  - ../patterns/PAT-23c981d4-mutation-before-admission-validation.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: per convergence phase
---

# Bootstrap The Project

Use this workflow when setting up Skopos on itself or any future project.

## Changelog

- `2026-08-13`: Replaced the visible init and adoption ceremony with the unified
  coding-agent-led setup workflow. Init remains a low-level reconstruction primitive.
- `2026-07-31`: Removed retired setup-review command examples and aligned bootstrap
  follow-up with Understanding, adoption state, Session context, Work Queue, Findings,
  Tasks, and Readiness.
- `2026-07-28`: Added the workspace-containment preflight and zero-mutation rejection
  contract for root and nested initialization.
- `2026-07-28`: Moved bootstrap guidance into the canonical guide family and declared
  its supporting role.
- `2026-07-28`: Marked this as current prototype guidance. Canonical adoption and
  documentation restructuring are owned by convergence Phase 4.

- `2026-06-29`: Added actionable setup-review commands so post-init questions can be reviewed and answered instead of staying as generated JSON only.
- `2026-06-29`: Added the setup-review step after init so Skopos separates observed facts from assumptions and asks confirmation questions before broad agent use.
- `2026-06-29`: Documented fresh onboarding outputs and the post-init review expectation for existing projects.
- `2026-04-09`: Updated the bootstrap workflow to include the broader `init` graph artifacts for docs, commands, and scope relations under `.skopos/graph/`.
- `2026-04-09`: Updated the bootstrap workflow to include `.skopos/index/diagnosis.json` and the follow-up `skopos scan` diagnosis flow for messy repos.
- `2026-07-29`: Updated bootstrap verification to use adoption assessment and Session
  context.
- `2026-04-09`: Updated the bootstrap workflow to match the first working `skopos init` slice, including dry-run bootstrap output for existing repos.
- `2026-04-09`: Added the initial bootstrap workflow so Skopos can use the same setup discipline it will later provide.

## Workflow

1. run `skopos setup <repo-root> --actor <id>`
2. let the coding agent follow the generated setup packet and inspect real project
   evidence
3. answer only questions that change product truth, architecture, ownership,
   authority, security, or public behavior
4. review one consolidated plan with `skopos setup review <repo-root>`
5. accept, edit, defer, or reject the recommendations you want
6. run `skopos setup resume <repo-root> --actor <id>`
7. bind a supported coding-agent Session, let the real host inject current context,
   then record the host's explicit delivery confirmation
8. continue normal work only after required setup lanes are ready

After the user accepts the relevant Apply recommendations, existing-project setup may
also create or update:

1. `AGENTS.md` with the managed Skopos operating contract
2. `docs/00-start-here.md` as the docs router when the project does not already have one
3. `skopos.config.yaml`
4. `.gitignore` entries for local generated Skopos state
5. instruction mirrors after `skopos instructions sync`

Review those files like onboarding setup, then commit them if they match the project.
Readiness should not require a Task only because these first-time onboarding files exist.

## Target Boundary

The path passed to `skopos setup` is the workspace boundary for Skopos.
Every configured docs root, docs router, instruction source, instruction mirror, and
ignored project path must remain inside it.

1. In a monorepo, initialize the repository root once and declare packages, products,
   applications, services, domains, infrastructure, and tools as Scopes.
2. Initialize a nested package separately only when it is intentionally a standalone
   Skopos project with an explicit local config, local Memory root, and local
   instruction source.
3. Skopos must not inherit `../../docs`, `../../AGENTS.md`, or another parent-owned path
   into a nested project's durable configuration.
4. An invalid inferred or existing configuration fails before mutation in normal and
   dry-run modes.
5. Rejection leaves the target and its parent byte-for-byte unchanged: no config,
   `.gitignore`, `.skopos/**`, docs, instructions, or success log may be written.

## Low-Level Reconstruction

`skopos init` still rebuilds configuration, indexes, graphs, instruction scaffolding,
and clean-checkout state. It is intentionally not the user-facing setup journey. Use
it only for diagnostics, recovery, or Skopos internals.

## Setup Understanding Review

The understanding stage of `skopos setup` must not only explain the project. It must
also show which parts of that understanding are confirmed by files and which parts are
still assumptions.

The unified setup review should include:

1. observed facts with evidence
2. likely inferences with confidence
3. assumptions that need confirmation
4. guided questions with a recommended option and tradeoffs
5. recommended next actions

For existing projects, do not treat generated Skopos docs as automatically stronger than existing project docs. First map what exists, then suggest improvements. For new projects, Skopos can recommend a clearer default structure because there is less existing project truth to protect.

Durable project choices belong in their tracked owner, such as `skopos.config.yaml`.
Material document-authority or restructuring choices use the unified setup review;
generated Understanding remains evidence, not a second authority.

## Setup Decision Output

The unified setup review emits only material project questions and keeps them blocking
until the user answers or explicitly defers the affected setup lane.

Those questions:

1. explain why the decision matters
2. recommend one option first
3. include alternatives and tradeoffs
4. help the user finalize the generated root config with less guesswork
