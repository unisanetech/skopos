# Mid-App Boundary Policy

## Metadata

- Pack ID: `architecture.mid-app`
- Status: `active`
- Owner: `skopos-core`
- Scope: `policy-packs/architecture/mid-app/boundaries`
- Canonical: `yes`
- Last Updated: `2026-06-24`
- Review Cycle: `per pack release`
- Related Artifacts:
  - `../pack.json`
  - `../checks/drift-rules.json`

## Boundary Roles

### App

Owns startup, routing, page/screen composition, dependency assembly, app shell, and environment interpretation. App code may call feature public surfaces and platform adapters. App code should stay thin enough that feature behavior remains testable outside the full app shell.

### Feature

Owns product behavior for a workflow or domain slice. A feature may contain screen-level UI, local services, validation, state, tests, and feature-specific helpers. Feature internals are private unless exported through an intentional public surface.

### Platform

Owns runtime bridges: API clients, database access, cache, queues, auth providers, storage, observability, feature flags, and environment adapters. Platform code should not know feature internals.

### Support

Owns stable cross-feature primitives: date/money formatting, typed IDs, result helpers, domain-neutral validation helpers, logging wrappers, and other utilities that are genuinely reused. Support is not a dumping ground for product decisions.

### UI

Owns reusable component primitives and design-system rules. Feature-specific UI remains in the feature. Move a component to shared UI only after it has stable cross-feature semantics.

### Generated

Owns generated SDKs, routes, schemas, docs indexes, or types. Generated outputs must declare the owning command or source. Agents update generators or sources, then regenerate.

## Import Direction

Preferred direction:

```text
app -> features -> platform/support/ui
app -> platform/support/ui
features -> platform/support/ui
platform -> support
ui -> support
support -> no app/feature/platform imports
```

Forbidden by default:

1. `platform` importing `features`
2. `support` importing product features
3. one feature importing another feature's private internals
4. UI primitives importing feature behavior
5. generated files importing handwritten feature internals unless the generator contract owns that relationship

## Public Surface Rule

Each feature should have an intentional public surface when other layers need it. Public files expose supported service calls, route handlers, view models, schemas, or components. Internal files stay private to the feature.

Avoid both extremes:

1. no public surface, causing deep imports everywhere
2. barrel files that export every internal file and erase ownership

## Boundary Validation Rule

External data is validated at boundaries before feature logic consumes it:

1. HTTP request bodies and query parameters
2. form submissions
3. database or storage records when shape can drift
4. job payloads
5. webhooks and third-party API responses
6. generated client inputs and outputs when generator guarantees are weak

Feature internals should not repeatedly defend against unknown shapes that should have been normalized at the edge.
