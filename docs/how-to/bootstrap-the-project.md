# Bootstrap The Project

Use this workflow when setting up Skopos on itself or any future project.

## Metadata

- Doc ID: `SKOPOS-HOWTO-BOOTSTRAP-PROJECT`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/how-to`
- Canonical: `yes`
- Last Updated: `2026-06-29`
- Review Cycle: `per workpack`
- Related Docs:
  - `../00-start-here.md`
  - `../architecture/config-model.md`
  - `../architecture/artifact-model.md`
  - `../decisions/034-post-init-setup-review-and-confirmed-understanding-contract.md`

## Changelog

- `2026-06-29`: Added actionable setup-review commands so post-init questions can be reviewed and answered instead of staying as generated JSON only.
- `2026-06-29`: Added the setup-review step after init so Skopos separates observed facts from assumptions and asks confirmation questions before broad agent use.
- `2026-06-29`: Documented fresh onboarding outputs and the post-init review expectation for existing projects.
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
12. run `skopos understand` to create compact repo understanding and setup review
13. review facts, inferences, assumptions, and confirmation questions:
   - `skopos setup review .`
14. confirm or correct setup assumptions before accepting policy packs, broad docs cleanup, or long-running agent work:
   - `skopos setup answer <question-id> <option-id> .`
15. run `skopos scan` when the repo is messy or inconsistent and review the remediation missions
16. run `skopos trust` to see whether the workspace is still missing mirrors or other bootstrap surfaces
17. review recommended next steps before enabling broader agent use

For an existing project, first-time init may also create or update:

1. `AGENTS.md` with the managed Skopos operating contract
2. `docs/00-start-here.md` as the docs router when the project does not already have one
3. `skopos.config.yaml`
4. `.gitignore` entries for local generated Skopos state
5. instruction mirrors after `skopos instructions sync`

Review those files like onboarding setup, then commit them if they match the project. Trust should not ask for a mission only because these first-time onboarding files exist.

## Current Slice

The current implemented bootstrap slice does this today:

1. scans an existing repo surface
2. suggests a root config
3. prepares `.skopos/bootstrap.json`
4. prepares `.skopos/scopes-lite.json`
5. prepares `.skopos/diagnosis.json`
6. prepares `.skopos/graph/workspace.json`, `.skopos/graph/docs.json`, `.skopos/graph/commands.json`, and `.skopos/graph/scope-relations.json`
7. writes or updates the root Skopos onboarding files when not already present
8. reports findings and recommended next steps

Later phases will extend this flow with:

1. richer docs generation
2. trust/reporting and remediation missions

## Post-Init Setup Review

`skopos understand` must not only explain the project. It must also show which parts of that understanding are confirmed by files and which parts are still assumptions.

The setup review should include:

1. observed facts with evidence
2. likely inferences with confidence
3. assumptions that need confirmation
4. guided questions with a recommended option and tradeoffs
5. recommended next actions

For existing projects, do not treat generated Skopos docs as automatically stronger than existing project docs. First map what exists, then suggest improvements. For new projects, Skopos can recommend a clearer default structure because there is less existing project truth to protect.

Setup answers are stored in `.skopos/understanding/setup-answers.json`. Safe answers, such as project archetype or canonical docs root, may also update `skopos.config.yaml`.

## Current Decision Output

The current `init` slice now emits recommended bootstrap questions in JSON output.

Those questions:

1. explain why the decision matters
2. recommend one option first
3. include alternatives and tradeoffs
4. help the user finalize the generated root config with less guesswork
