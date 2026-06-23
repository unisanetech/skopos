# Mid-App Greenfield Policy

## Metadata

- Pack ID: `architecture.mid-app`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/architecture/mid-app/greenfield`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`
  - `boundaries.md`
  - `examples.md`

## Greenfield Starting Point

Start with the smallest tree that preserves ownership:

```text
src/
  app/
    main.*
    routes/
  features/
    <feature>/
      index.*
      service.*
      components/
      __tests__/
  platform/
    api/
    config/
  support/
  ui/
```

Create a folder only when it has real ownership. A new project can start with one feature and a small platform boundary; it does not need every role on day one.

## Early Decisions To Record

1. application entrypoint and routing owner
2. feature public surface convention
3. shared UI promotion rule
4. boundary validation library or approach
5. generated artifact ownership rule
6. fast, targeted, and release validation commands
7. public API compatibility stance
8. naming conventions for files, services, components, routes, and tests

## Default Agent Guidance

For new code:

1. put product behavior in the owning feature
2. put runtime integration code in platform
3. put stable cross-feature primitives in support
4. put reusable component primitives in UI
5. validate external data at boundaries
6. avoid generic helpers until reuse is proven
7. declare proof commands with the change
8. update local policy when a new durable rule is created

## Promotion Rule

A local helper can move outward only when:

1. at least two feature owners need the same behavior
2. the behavior has a stable name independent of one feature
3. tests cover the shared contract
4. imports after promotion still follow one-way direction
5. the change does not hide product policy in support code
