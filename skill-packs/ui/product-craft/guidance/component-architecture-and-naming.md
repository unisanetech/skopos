# Component Architecture And Naming

Treat the request as product intent, not implementation vocabulary. Before editing,
inspect every component and token authority named in the project adaptation, plus
exports, nearby screens, and symbol uses. Record a short reuse inventory: required
role, matching component or import, and the reuse, variant, composition, or custom
decision. A custom control needs a named semantic or behavioral mismatch; preference is
not evidence.

## Reuse Decision

Choose in this order:

1. Reuse an existing component when its semantics, behavior, and accessibility match.
2. Add a shared variant when the role is the same and the difference is supported.
3. Compose existing primitives for distinct product structure without a new primitive.
4. Create a component only for a durable responsibility, behavior, state boundary,
   accessibility contract, or repeated composition absent from the catalog.

Do not duplicate a component because its name, styling, folder, or original screen is
different. A page-local button, tab, segmented control, navigation item, drawer, dialog,
or progress indicator is still a new behavior contract. Do not add a wrapper or alias
whose only purpose is to mirror request wording.

## Durable Naming

1. Name by stable responsibility or information role.
2. Do not encode prompt adjectives, implementation techniques, temporary campaigns,
   animations, visual treatments, or a full feature sentence in a name.
3. Add a domain prefix only when project rules need it to disambiguate a real boundary.
4. Use the project's established terms and naming grammar. Search comparable symbols
   before introducing a new noun.
5. Name props and variants for semantic state or behavior, not CSS appearance or the
   first screen that requested them.

For example, prefer a durable role such as `DetailSidebar`, `ProjectFilters`, or
`PageHeader` over names built from prompt adjectives, visual treatments, or campaigns.
The right name still depends on actual ownership.

## Component Shape

1. Keep one clear responsibility. Split unrelated state or behavior; do not fragment
   cohesive markup into files merely to make it look modular.
2. Prefer composition and existing extension points over copied markup or growing a
   second almost-identical API.
3. Keep page-specific assembly near the page. Promote it only after a stable reusable
   role is demonstrated.
4. Remove obsolete duplicates after a clean cutover. Do not leave two canonical paths
   for the same role unless the project explicitly supports both.

## Review

Search again after implementation. Compare symbols, props, markup, behavior, states,
and styling with the bound catalog. Run the project-bound inventory and conformance
Actions or Guards when available. Missing conformance capability means unverified, not
passed. Review must explain why each new component exists, why an existing component could not own the change, and why its name outlives the request wording.
