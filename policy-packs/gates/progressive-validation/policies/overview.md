# Progressive Validation Gates Pack

## Metadata

- Pack ID: `gates.progressive-validation`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/gates/progressive-validation`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`
  - `lane-guide.md`
  - `closure.md`
  - `../checks/drift-rules.json`

## Purpose

Use this pack when a project needs clear proof lanes without making every task ceremonial.

The rule is simple: small work stays light, normal work gets focused validation, and risky work uses staged proof plus durable context.

## Agent Operating Rule

Agents should choose the lightest lane that proves the change honestly.

They should escalate only when the task affects public APIs, architecture, stack, security, migrations, generated artifacts, multiple packages, or long-running execution.
