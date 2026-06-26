# Skopos CLI

**Skopos helps coding agents understand your project and work without losing context.**

The CLI adds local project memory, agent guidance, policy recommendations, and done checks to your codebase.

## 🚀 Run It

Use npm:

```bash
npx @skopos/cli init .
```

Use pnpm:

```bash
pnpm dlx @skopos/cli init .
```

Use npm exec:

```bash
npm exec --package @skopos/cli -- skopos init .
```

## 📦 What It Writes

- `.skopos/` for local project memory and workflow state
- `AGENTS.md` for coding-agent instructions

The output is written for developers first, not only for machines.

## 🛠 Common Commands

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

Use `--json` when another tool needs machine-readable output.

## 🧭 Workflow

Small work stays light:

```txt
read context → edit → check → update memory if needed
```

Big work gets more structure:

```txt
mission/workpack → phases → decisions → gates → proof
```

## 📄 License

Apache-2.0
