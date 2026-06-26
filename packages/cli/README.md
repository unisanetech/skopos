# Skopos CLI

Skopos is a local-first project intelligence layer for developers who use coding agents.

The CLI installs Skopos into a project, builds local project memory, writes agent guidance, recommends useful rules, and helps agents close work with clear proof. It is designed to work with real projects, not only demo repositories.

## Run Without Installing Globally

Use npm:

```bash
npx @skopos/cli init .
```

Use pnpm:

```bash
pnpm dlx @skopos/cli init .
```

Use explicit npm exec:

```bash
npm exec --package @skopos/cli -- skopos init .
```

After initialization, the command is:

```bash
skopos
```

## What It Does

Skopos writes local project intelligence under `.skopos/`. This gives coding agents a compact view of the project so they do not need to rediscover the same facts every time.

Skopos can also create or update `AGENTS.md`. That file gives agents practical guidance for the project, such as how to inspect the codebase, how to choose the right workflow size, when to ask the developer a question, and which checks matter before finishing.

The default output is written for humans. Use `--json` when another tool needs stable machine-readable output.

## Common Commands

```bash
skopos init .
skopos understand .
skopos policies recommend .
skopos policies apply .
skopos policies drift .
skopos program next . --compact
skopos trust . --compact
skopos done . --compact
```

## How To Think About It

For a small task, Skopos should stay light. The agent reads a compact brief, edits the relevant files, runs a focused check, and updates memory only when a real project fact changed.

For bigger work, Skopos can guide a stronger workflow. It can track a mission or workpack, show progress, record decisions, surface blockers, and explain what proof is still needed before the work is done.

## License

Apache-2.0
