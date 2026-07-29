# Skopos CLI

**Persistent project memory for coding agents.**

Skopos helps Codex, Claude, Cursor, and other coding agents understand your project before they edit it.

## 🚀 Start

Run inside your project:

```bash
npx @skopos/cli init .
```

Or:

```bash
pnpm dlx @skopos/cli init .
npm exec --package @skopos/cli -- skopos init .
```

## 🤖 Tell Your Agent

After setup, tell your coding agent:

```txt
Read AGENTS.md first. Use Skopos context before editing.
```

Better prompt:

```txt
Use Skopos. Follow AGENTS.md, make the smallest safe change, run the right checks, and update memory if project truth changed.
```

## 📦 What It Owns

```txt
AGENTS.md
skopos.config.yaml
tools/skopos/
.skopos/
```

`AGENTS.md`, `skopos.config.yaml`, `tools/skopos/`, and durable project docs are
tracked authority. `.skopos/` contains only disposable local projections, task
runtime state, evidence, and caches; delete it and run `skopos init .` to rebuild
the project state.

## 🛠 Useful Commands

```bash
skopos understand .
skopos policies recommend .
skopos policies apply .
skopos session context . --json
skopos work next . --json
skopos verify <task-id> . --phase closure
skopos readiness <task-id> . --for close
```

Use `--json` when another tool needs structured output.

## 📄 License

Apache-2.0
