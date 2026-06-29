# Config Model

Skopos should use one small root-level checked-in config and generate the rest.

## Metadata

- Doc ID: `SKOPOS-ARCH-CONFIG-MODEL`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/architecture`
- Canonical: `yes`
- Last Updated: `2026-06-29`
- Review Cycle: `per workpack`
- Related Docs:
  - `artifact-model.md`
  - `runtime-model.md`
  - `../project/overview.md`

## Changelog

- `2026-06-29`: Clarified that inferred command config must omit missing scripts instead of writing null command keys.
- `2026-04-10`: Updated the config model to make `workspace.ignore` canonical, so internal, proof, test, and generated roots can stay out of the active workspace model during self-hosting and product development.
- `2026-04-09`: Updated the config model to make subtree-local self-hosting explicit, so Skopos-on-Skopos uses its own root config and workflow registry instead of borrowing outer repo policy implicitly.
- `2026-04-09`: Updated the config model to reflect the implemented `.skopos/overrides.json` artifact and `skopos overrides` CLI for declared canonicals that outrank inference.
- `2026-04-09`: Added the first explicit override-artifact direction so declared canonical choices can outrank inference without bloating the root config.
- `2026-04-09`: Refined the config model to leave room for artifact-policy hooks, override declarations, and freshness policy without growing into an oversized control surface.
- `2026-04-09`: Updated the config model to reserve a small root-level workflow registry hook while keeping detailed workflow definitions in repo-authored manifest files.
- `2026-04-09`: Added the root-config contract so Skopos remains simple at the surface while generated complexity stays internal.

## Config Rules

1. one checked-in config:
   - `skopos.config.yaml`
2. one optional gitignored local override:
   - `skopos.local.yaml`
3. users configure policy and project shape, not internal retrieval mechanics
4. project-specific workflow definitions should live in dedicated manifest files, not inside an oversized root config
5. artifact durability, override, and freshness hooks should stay compact and policy-oriented, not become low-level runtime wiring
6. when Skopos is dogfooded on itself, the subtree must still have its own root config rather than inheriting outer-repo execution policy implicitly

## Primary Config Areas

1. project archetype and scope strategy
2. canonical commands
3. workspace boundary policy
4. docs policy
5. trust mode
6. decision escalation mode
7. agent integration targets
8. privacy and approval rules
9. optional workflow manifest directories
10. artifact policy defaults
11. canonical override hooks

## Command Config Rule

Canonical command inference must only write commands that Skopos can resolve to a real string command.

If a project has `build`, `typecheck`, and `lint` scripts but no `test` script, the generated `commands` config should omit `test` instead of writing `test: null`. Missing command keys mean “not detected yet”; they should not make the generated config invalid on the next read.

## Workspace Boundary Rule

The checked-in root config may declare compact workspace boundary policy through:

1. `workspace.ignore`
2. future small boundary policy hooks if needed

The current rule is:

1. ignored roots are excluded from active package discovery
2. ignored roots are excluded from scopes-lite package scopes
3. ignored roots are excluded from diagnosis, architecture interpretation, and compiled graphs that depend on package discovery
4. ignored roots are project truth, not UI-only filtering

Use `workspace.ignore` for paths such as:

1. `fixtures/`
2. `internal/`
3. `tests/`
4. `docs/generated/`

## Workflow Config Rule

The checked-in root config may later declare a small workflow registry like:

1. default workflow manifest directory
2. additional trusted workflow directories
3. workflow policy defaults

The detailed workflow definitions should still live in dedicated repo-authored manifests such as `tools/skopos/workflows/*.yaml`.

## Override And Artifact Policy Rule

The checked-in root config may later declare compact policy hooks for:

1. canonical override locations or override enablement
2. artifact durability defaults for shared versus local-only runtime state
3. freshness and lint policy defaults for required generated artifacts

These hooks should stay small. The detailed behavior should live in dedicated artifacts and runtime logic, not in a bloated root config file.

The preferred direction is:

1. keep the root config small
2. store declared canonical overrides in the dedicated checked-in machine-readable artifact `.skopos/overrides.json`
3. write and review override artifacts through `skopos overrides` rather than ad hoc handwritten notes

## Self-Hosting Rule

When Skopos runs on its own subtree, the canonical self-hosting root should include:

1. `skopos.config.yaml`
2. `package.json` with the subtree command surface
3. `pnpm-workspace.yaml`
4. `AGENTS.md`
5. `tools/skopos/workflows/*.yaml`

This keeps Skopos self-hosting explicit and extraction-ready instead of relying on the outer Unisane workspace as an implicit control plane.

When Skopos runs on itself, `workspace.ignore` should exclude proof-only and internal roots so the self-hosted package model reflects the actual SDK family rather than every development artifact in the repo.
