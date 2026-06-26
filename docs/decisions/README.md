# Skopos Decisions

Use this folder for durable Skopos architectural and product decisions.

## Metadata

- Doc ID: `SKOPOS-DECISIONS-INDEX`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/decisions`
- Canonical: `yes`
- Last Updated: `2026-06-27`
- Review Cycle: `per workpack`
- Related Docs:
  - `../architecture/00-architecture.md`
  - `../project/vision.md`

## Changelog

- `2026-06-27`: Added decision 032 for the workflow-recording preflight guard that prevents non-light work from bypassing mission, decision, and finding memory.
- `2026-06-26`: Added decision 031 for the bundled CLI release contract and `npx`/`npm exec`/`pnpm dlx` install UX.
- `2026-06-24`: Added decision 030 for the human guidance and developer experience contract across CLI output, UI surfaces, workpacks, and agent answers.
- `2026-06-24`: Added decision 029 for policy-pack, stack-intelligence, and durable-memory artifact ownership.
- `2026-04-09`: Added the decision log index so durable Skopos choices have a stable home before package work begins.

## Rules

1. current decisions stay in this folder
2. superseded decisions move to `archive/`
3. decisions should capture why the choice was made, not just what changed
