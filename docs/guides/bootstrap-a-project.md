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
lastUpdated: 2026-07-31
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

1. run a bootstrap dry-run first:
   - `node --import tsx src/cli.ts init --dry-run --json <repo-root>`
2. review the detected repo shape:
   - repo mode
   - archetype suggestion
   - canonical commands
   - docs roots
   - instruction files
   - findings
3. confirm or adjust the recommended `skopos.config.yaml`
4. write `skopos.config.yaml`
5. write the initial `.skopos/index/bootstrap.json`
6. write the initial `.skopos/index/scopes.json`
7. write the initial `.skopos/index/diagnosis.json`
8. write the initial `.skopos/graph/workspace.json`
9. write the initial `.skopos/graph/docs.json`
10. write the initial `.skopos/graph/commands.json`
11. write the initial `.skopos/graph/scope-relations.json`
12. run `skopos understand . --json` to create compact repository Understanding
13. review the returned facts, inferences, assumptions, contradictions, and material
    adoption questions through `skopos session context . --json`
14. confirm material adoption decisions through the proposal and approval flow before
    accepting policy packs, broad docs cleanup, or long-running agent work
15. run `skopos scan . --json` when the repo is messy or inconsistent and turn
    actionable gaps into Findings or bounded Tasks
16. run `skopos adopt assess .` and `skopos session context . --json` to inspect
    remaining adoption or instruction gaps
17. review recommended next steps before enabling broader agent use

For an existing project, first-time init may also create or update:

1. `AGENTS.md` with the managed Skopos operating contract
2. `docs/00-start-here.md` as the docs router when the project does not already have one
3. `skopos.config.yaml`
4. `.gitignore` entries for local generated Skopos state
5. instruction mirrors after `skopos instructions sync`

Review those files like onboarding setup, then commit them if they match the project.
Readiness should not require a Task only because these first-time onboarding files exist.

## Target Boundary

The path passed to `skopos init` is the workspace boundary for that Skopos adoption.
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

## Current Slice

The current implemented bootstrap slice does this today:

1. scans an existing repo surface
2. suggests a root config
3. prepares `.skopos/index/bootstrap.json`
4. prepares `.skopos/index/scopes.json`
5. prepares `.skopos/index/diagnosis.json`
6. prepares `.skopos/graph/workspace.json`, `.skopos/graph/docs.json`, `.skopos/graph/commands.json`, and `.skopos/graph/scope-relations.json`
7. writes or updates the root Skopos onboarding files when not already present
8. reports findings and recommended next steps

Later phases may extend this flow with richer generated guidance and additional
preventive host integration. Current project Readiness, Findings, and Tasks remain the
canonical reporting and remediation surfaces.

## Post-Init Understanding Review

`skopos understand` must not only explain the project. It must also show which parts of that understanding are confirmed by files and which parts are still assumptions.

The Understanding and adoption review should include:

1. observed facts with evidence
2. likely inferences with confidence
3. assumptions that need confirmation
4. guided questions with a recommended option and tradeoffs
5. recommended next actions

For existing projects, do not treat generated Skopos docs as automatically stronger than existing project docs. First map what exists, then suggest improvements. For new projects, Skopos can recommend a clearer default structure because there is less existing project truth to protect.

Durable project choices belong in their tracked owner, such as `skopos.config.yaml`.
Material document-authority or restructuring choices use the adoption proposal and
approval artifacts; generated Understanding remains evidence, not a second authority.

## Current Decision Output

The current `init` slice now emits recommended bootstrap questions in JSON output.

Those questions:

1. explain why the decision matters
2. recommend one option first
3. include alternatives and tradeoffs
4. help the user finalize the generated root config with less guesswork
