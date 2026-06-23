# Bootstrap The Project

Use this workflow when setting up Skopos on itself or any future project.

## Metadata

- Doc ID: `SKOPOS-HOWTO-BOOTSTRAP-PROJECT`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/how-to`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `../00-start-here.md`
  - `../architecture/config-model.md`
  - `../architecture/artifact-model.md`

## Changelog

- `2026-04-09`: Updated the bootstrap workflow to include the broader `init` graph artifacts for docs, commands, and scope relations under `.skopos/graph/`.
- `2026-04-09`: Updated the bootstrap workflow to include `.skopos/diagnosis.json` and the follow-up `skopos scan` diagnosis flow for messy repos.
- `2026-04-09`: Updated the bootstrap workflow to include a post-bootstrap `skopos trust` readiness check.
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
5. write the initial `.skopos/bootstrap.json`
6. write the initial `.skopos/scopes-lite.json`
7. write the initial `.skopos/diagnosis.json`
8. write the initial `.skopos/graph/workspace.json`
9. write the initial `.skopos/graph/docs.json`
10. write the initial `.skopos/graph/commands.json`
11. write the initial `.skopos/graph/scope-relations.json`
12. run `skopos scan` when the repo is messy or inconsistent and review the remediation missions
13. run `skopos trust` to see whether the workspace is still missing mirrors or other bootstrap surfaces
14. review recommended next steps before enabling broader agent use

## Current Slice

The current implemented bootstrap slice does this today:

1. scans an existing repo surface
2. suggests a root config
3. prepares `.skopos/bootstrap.json`
4. prepares `.skopos/scopes-lite.json`
5. prepares `.skopos/diagnosis.json`
6. prepares `.skopos/graph/workspace.json`, `.skopos/graph/docs.json`, `.skopos/graph/commands.json`, and `.skopos/graph/scope-relations.json`
7. reports findings and recommended next steps

Later phases will extend this flow with:

1. richer docs generation
2. trust/reporting and remediation missions

## Current Decision Output

The current `init` slice now emits recommended bootstrap questions in JSON output.

Those questions:

1. explain why the decision matters
2. recommend one option first
3. include alternatives and tradeoffs
4. help the user finalize the generated root config with less guesswork
