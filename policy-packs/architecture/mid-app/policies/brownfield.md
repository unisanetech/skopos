# Mid-App Brownfield Policy

## Metadata

- Pack ID: `architecture.mid-app`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/architecture/mid-app/brownfield`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`
  - `boundaries.md`
  - `../checks/drift-rules.json`

## Brownfield First Rule

Do not rewrite an existing project into this pack blindly. First infer the project's current architecture, dominant names, actual dependency direction, validation commands, generated surfaces, and known team decisions.

The pack becomes active only after the project accepts it or Skopos resolves it from explicit local policy.

## Stabilization Sequence

1. Inventory current roles: app, features, platform, support, UI, generated.
2. Identify dominant local names and map them to pack roles.
3. Mark drift only when source evidence conflicts with accepted local policy.
4. Fix high-risk boundary drift before cosmetic tree renames.
5. Avoid broad moves unless tests and import updates are part of the same change.
6. Preserve working public surfaces while tightening internals.
7. Add missing validation lanes before large structural refactors.

## Acceptable Brownfield Variance

These are not drift by themselves:

1. different folder names for the same roles
2. feature folders organized by route instead of domain
3. shared UI folder with existing component conventions
4. framework-specific app directories
5. generated artifacts in framework-owned locations
6. temporary compatibility layers at public package boundaries

These usually are drift:

1. feature business logic hidden in generic shared helpers
2. runtime provider selection inside UI components or feature services
3. sibling-feature private imports
4. generated outputs edited by hand
5. missing source command for generated artifacts
6. no documented validation lane for risky changes

## Refactor Policy

For brownfield refactors, agents should produce a small migration path:

1. current pattern being changed
2. target local pattern
3. affected imports or public surfaces
4. proof command lane
5. rollback risk
6. docs or `AGENTS.md` update if the rule becomes durable

No broad tree normalization should happen without a clear product or maintenance problem.
