# Skopos CLI

Skopos is a local-first project intelligence layer for coding agents and developers.

Use it inside a project to create compact project memory, agent instructions, workflow state, policy guidance, and closure checks.

## Install and Run

Run without a permanent install:

```bash
npx @skopos/cli init .
```

With pnpm:

```bash
pnpm dlx @skopos/cli init .
```

With explicit npm exec:

```bash
npm exec --package @skopos/cli -- skopos init .
```

## Common Commands

```bash
skopos init .
skopos understand .
skopos policies recommend .
skopos program next . --compact
skopos trust . --compact
skopos done . --compact
```

## What It Writes

Skopos writes local project intelligence under `.skopos/` and can maintain `AGENTS.md` guidance for coding agents.

Generated `.skopos/` artifacts are project-local memory and should be reviewed before committing if a team wants durable shared state.

## License

Apache-2.0
