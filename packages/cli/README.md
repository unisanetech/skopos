# Skopos CLI

**Give coding agents durable project memory, resumable work, and evidence-backed completion.**

Skopos works alongside Codex, Claude Code, Cursor, and other coding agents. It keeps
the project's rules, decisions, active Tasks, checks, and proof in the repository so a
new session can continue safely instead of reconstructing the work from chat history.

Skopos does not write the code for your agent and it does not replace Git or CI. It is
the operating layer that helps an agent answer four questions:

1. What does this project already know?
2. What work is active, and who owns it?
3. Which checks are required for this change?
4. Is there enough evidence to call the work complete?

## Release Status

`0.1.x` is the planned pre-release line for the npm `next` tag. It is not public until
the repository's release scorecard and protected publication workflow certify one
immutable candidate. Product contracts and command details may still change before
promotion to `latest`; use an exact version in automation after publication.

## Requirements

- Node.js `^22.13.0` or `^24.0.0`
- Git is strongly recommended so tracked project truth and change boundaries are
  available

The first release is certified on Linux, macOS, and Windows through the runtime matrix
documented in the repository.

## Install And Set Up

Run one of these commands inside the project you want Skopos to understand:

```bash
npx @skopos/cli@next setup .
```

```bash
pnpm dlx @skopos/cli@next setup .
```

```bash
npm exec --package @skopos/cli@next -- skopos setup .
```

Then load a compact project briefing:

```bash
skopos session context . --actor <your-agent-id> --json
```

If you prefer a project-local installation, install `@skopos/cli@next` as a development
dependency and run it through your package manager.

## A Typical Workflow

```bash
# Start bounded work with an outcome and owned path
skopos start "Add retry handling" . \
  --accept "Retries transient failures without duplicating writes" \
  --own src/api \
  --actor <your-agent-id>

# Ask what should happen next
skopos work next . --actor <your-agent-id> --json

# Run project-defined checks selected for the Task
skopos actions list .
skopos actions run <action-id> . --task <task-id> --actor <your-agent-id> --json

# Diagnose closure; this does not silently run missing checks
skopos verify <task-id> . --phase closure --json

# Finish only after the required evidence exists
skopos finish <task-id> . --actor <your-agent-id> --json
```

Run `skopos --help` for the complete command surface and `skopos --version` to confirm
the installed package identity.

## Visual Interface

Skopos includes a read-only supervision UI for current work, project knowledge,
readiness, and activity:

```bash
skopos ui dev . --host 127.0.0.1 --port 4173
```

The UI explains canonical Skopos state. Mutations still go through the CLI or another
supported adapter so there is only one Task and evidence authority.

## What It Adds To A Project

```text
AGENTS.md             coding-agent operating instructions
skopos.config.yaml    project configuration
tools/skopos/         Scopes, Actions, Guards, policy, and bindings
docs/                 durable project knowledge and tracked work
.skopos/              rebuildable local indexes, caches, coordination, and evidence
```

Tracked files are the durable source of truth. `.skopos/**` is local operational state
and may contain repository snippets, commands, paths, or evidence. Do not commit,
upload, or share that directory wholesale. Use `skopos storage status` and the dry-run
`skopos storage prune` workflow to inspect it safely.

## Current Limitations

- `0.1.x` is pre-release software and has no compatibility promise for prototype state.
- Coordination is cooperative; Skopos cannot stop an uncoordinated process from
  editing the same files.
- Skopos selects and records project checks, but the project remains responsible for
  the quality and correctness of those commands.
- Product Interface Design ships in the package under the accepted first-release
  boundary. Its deterministic selection, authority, containment, bounded-cost, packed
  installation, and project-binding checks must pass. Material efficacy remains
  explicitly unproven, so inclusion is not an efficacy claim.

## Help, Bugs, And Security

- Usage questions and reproducible bugs: <https://github.com/unisanetech/skopos/issues>
- Security reports: <https://github.com/unisanetech/skopos/security/advisories/new>
- Source and full documentation: <https://github.com/unisanetech/skopos>

Please do not post suspected vulnerabilities or sensitive project evidence in a public
issue.

## UI Source Provenance

The bundled Skopos UI includes reviewed source that originated in Unisane UI. The
copyright owner has explicitly authorized that copied source and its compiled output
for distribution in Skopos under Apache-2.0. The package has no private
`@unisane/*` runtime dependency or registry requirement.

## License

Apache-2.0. See `LICENSE` in the package.
