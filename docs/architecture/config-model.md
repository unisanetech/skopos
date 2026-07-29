---
title: Config Model
status: active
owner: skopos-core
id: SKOPOS-ARCH-CONFIG-MODEL
scope: skopos
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-28
relatedDocs:
  - artifact-model.md
  - runtime-model.md
  - docs-governance.md
  - ../patterns/PAT-23c981d4-mutation-before-admission-validation.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
  - ../work/plans/P-e7e888e6-canonical-product-convergence.md
reviewCycle: when owning truth changes
---

# Config Model

Skopos uses one small, checked-in root configuration. Explicit project choices live in
that file or in typed tracked sources under `tools/skopos/**`; inference may propose a
choice but cannot outrank declared project truth.

## Changelog

- `2026-07-28`: Made every project-owned config path workspace-relative, required the
  start-here router to live inside the configured Memory root, and required complete
  config preflight before initialization writes.
- `2026-07-28`: Defined strict docs flags as the adoption boundary: brownfield intake
  stays readable, while accepted strict projects fail trust on invalid metadata or
  broken local links.
- `2026-07-28`: Replaced local override and permanent docs-projection authority with
  direct tracked configuration and canonical Skopos source owners.

## Root Config Contract

`skopos.config.yaml` owns compact workspace-level choices:

1. project identity, archetype, and repository mode
2. canonical docs root and start-here router
3. workspace boundaries and ignored roots
4. canonical agent instruction source and supported host projections
5. trust, privacy, approval, and decision-escalation defaults
6. validation selection policy during Action compilation

The root config does not store runtime indexes, retrieval internals, Session state,
leases, Evidence, accepted work, or compatibility paths.

## Dedicated Tracked Sources

Detailed project behavior stays out of the root config:

| Concern | Source |
| --- | --- |
| Scopes | `tools/skopos/scopes.yaml` |
| Profiles | `tools/skopos/profiles/**` |
| Actions | `tools/skopos/actions/**` |
| Guards | `tools/skopos/guards/**` |
| Policy acceptance and exceptions | `tools/skopos/policies.yaml` |
| Skill acceptance and project bindings | `tools/skopos/skills/**` |
| Optional product extensions | `tools/skopos/extensions/**` |

Commands that change these choices write the tracked owner in a deterministic,
reviewable form. A resolved file under `.skopos/**` is only a projection.

## Declared Truth And Inference

1. An existing root config is read directly; scanning does not reconcile it with a
   newly inferred replacement.
2. A missing root config may be proposed during adoption from repository evidence.
3. Inferred values require review before they become declared truth.
4. Changing archetype, repository mode, docs root, or another canonical choice means
   changing its tracked owner.
5. There is no root `.skopos/overrides.json`, `skopos.local.yaml`, or parallel
   override command.

## Docs Configuration

`docs.root` and `docs.startHerePath` identify the adopted canonical docs tree. A fully
adopted project does not keep a permanent path-mapping manifest for an arbitrary old
layout.

For an existing project, adoption may build a local intake catalog and propose a
restructure. The coding agent then moves, merges, archives, or deletes docs with user
review. Once adopted, the normal docs structure and Scope-owned sub-docs are the
authority.

`docs.strictMetadata` and `docs.strictLinking` distinguish discovery from adopted
conformance:

1. brownfield discovery defaults both flags to false so Skopos can inventory an
   arbitrary existing tree without treating inference as accepted truth
2. greenfield and explicitly adopted or clean-refactor projects enable both flags
3. strict metadata requires stable identity, owner, declared Scope, semantic role,
   lifecycle, authority, provenance, and view; Patterns additionally require kind and
   applicability
4. when a Scope registry exists, strict metadata rejects unknown Scope ids
5. strict linking checks local Markdown links and metadata `Related Docs` references
6. violations remain visible in the intake catalog and fail Readiness; the
   compiler does not guess missing Pattern semantics
7. non-strict catalog records remain discovery and restructuring evidence; they never
   compile into normal Project Memory context merely because inferred or foreign
   metadata resembles the canonical grammar

## Workspace Boundary Rule

`workspace.ignore` excludes non-project and generated roots from package discovery,
diagnosis, accepted-policy scanning, and compiled Scope graphs. Entries must describe
real project boundaries, not hide architecture drift.

Common examples include fixtures, external vendored trees, test-only workspaces, and
build output. `.skopos/**` is already a runtime root and must be ignored by version
control regardless of workspace discovery settings.

Every project-owned path in the root config is relative to and contained by the target
workspace. This includes `workspace.ignore`, `docs.root`, `docs.startHerePath`,
`agents.canonicalInstructions`, and every `agents.syncMirrors` entry.
`docs.startHerePath` must be a file path below `docs.root`. Absolute paths, drive-rooted
or drive-relative paths, and `..` traversal are invalid declared or inferred
configuration.

Init validates this complete contract before writing config, docs, instructions,
ignore rules, local state, or lifecycle Evidence. A rejected config is not partially
installed.

## Validation Rule

Skopos selects validation from tracked Actions and Guards according to Task-owned
paths, Scope, phase, risk, and dependency impact. A command catalog may help adoption
discover candidate executors, but it is not a second validation authority and never
means “run every root command.”

## Self-Hosting Rule

Skopos self-hosting uses the same contract as any adopter:

1. one root `skopos.config.yaml`
2. one canonical `AGENTS.md`
3. tracked `tools/skopos/**` sources
4. canonical docs and tracked work
5. ignored, rebuildable `.skopos/**`

Self-hosting behavior must not rely on an outer repository, hidden local overrides, or
special compatibility readers.
