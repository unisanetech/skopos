# Component Architecture And Naming

Treat the request as product intent, not as an implementation vocabulary. Before
creating a component, inspect the project-bound component catalog, exports, nearby
screens, and symbol uses.

## Reuse Decision

Choose in this order:

1. Reuse an existing component when its semantic role, behavior, and accessibility
   contract match.
2. Add an explicit shared variant when the role is the same and the difference is a
   supported presentation or state.
3. Compose existing primitives when the new surface has distinct product structure but
   not a new reusable primitive.
4. Create a component only when it owns a durable responsibility, behavior, state
   boundary, accessibility contract, or repeated composition that existing code does
   not represent.

Do not duplicate a component because its name, styling, folder, or original screen is
different. Do not add a wrapper or alias whose only purpose is to mirror request wording.

## Durable Naming

1. Name by stable responsibility or information role: `DetailSidebar`, `FilterPanel`,
   `AccountSummary`, or `WorkspaceNavigation`.
2. Do not encode prompt adjectives, implementation techniques, temporary campaigns,
   animations, visual treatments, or a full feature sentence in a name.
3. Add a domain prefix only when the project's naming rules need it to disambiguate a
   genuine boundary. A task happening inside a feature does not automatically justify
   prefixing every component with that feature.
4. Use the project's established terms and naming grammar. Search comparable symbols
   before introducing a new noun.
5. Name props and variants for semantic state or behavior, not CSS appearance or the
   first screen that requested them.

| Avoid | Prefer when that is the durable role |
| --- | --- |
| `AdvancedAsidebarWithMotion` | `DetailSidebar` |
| `AnimatedProjectFilterCard` | `ProjectFilters` |
| `NewDashboardSpecialHeader` | `PageHeader` or an existing header variant |
| `TrueResumeBlueActionButton` | the bound `Button` with a semantic variant |
| `UserRequestedCompactPanel` | `InspectorPanel` |

The preferred name depends on ownership. Do not mechanically rename everything to the
examples above.

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

Search again after implementation. Compare the new symbol, props, markup, behavior,
states, and styling with existing components. A review must be able to explain why each
new component exists, why an existing component could not own the change, and why its
name will still make sense when the original request wording is forgotten.
