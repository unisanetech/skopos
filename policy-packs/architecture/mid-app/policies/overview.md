# Mid-App Architecture Pack

## Metadata

- Pack ID: `architecture.mid-app`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/architecture/mid-app`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`
  - `boundaries.md`
  - `brownfield.md`
  - `greenfield.md`
  - `examples.md`
  - `../checks/drift-rules.json`

## Purpose

Use this pack for product applications that have outgrown one-folder simplicity but do not need large-platform ceremony. It gives agents a stable architecture contract for apps with multiple features, app/runtime wiring, shared platform adapters, UI flows, and validation lanes.

This pack is intentionally project-agnostic. It does not require React, Next.js, Express, Prisma, Tailwind, dependency injection, monorepos, or any specific vendor. Projects can map the roles to their stack.

## Target Project Shape

A mid-app usually has:

1. more than one product feature or workflow
2. a runtime entrypoint or composition root
3. shared platform boundaries for APIs, persistence, auth, jobs, storage, or integrations
4. reusable UI or support primitives
5. tests or checks that should be selected proportionally to the change
6. enough code ownership that generic `utils` and sibling-feature imports create drift

## Baseline Tree Roles

Names are examples, not mandatory paths:

```text
src/
  app/          composition root, routing, bootstrapping, top-level shell
  features/     product behavior owned by feature/workflow
  platform/     runtime adapters and integration boundaries
  support/      stable cross-feature primitives and helpers
  ui/           reusable design-system or component primitives
  generated/    generated surfaces with named source commands
```

A project may use different names. The important contract is ownership and import direction.

## Acceptance Criteria

A project can accept this pack when agents can answer these questions from project truth:

1. Where is runtime wiring assembled?
2. Where does each product feature own behavior, UI, and tests?
3. Which shared folders are stable cross-feature contracts rather than dumping grounds?
4. Which imports are allowed across features, platform, support, and UI layers?
5. Which inputs must be validated at boundaries?
6. Which generated outputs are never hand-edited?
7. Which checks prove small, medium, and release-risk changes?

## Not For

Do not apply this pack as the active default when the project is:

1. a single script, throwaway prototype, or notebook
2. a public library whose exports are the product
3. a large modular platform with formal package/module ownership
4. a legacy stabilization project where the immediate goal is only inventory and risk reduction

## Agent Operating Rule

Before editing, agents should resolve the local accepted policy. If this pack is accepted, agents should preserve the dominant local naming and framework style while enforcing the pack's ownership and boundary rules.
