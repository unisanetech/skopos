# Visual Composition And Polish

Use the diagnosed archetype, bound system, precedents, and art direction to define page
job, reading order, density, and responsive behavior before decoration.

## Type, Tokens, And Alignment

1. Use semantic type roles with one dominant page title and a clear descent through
   section, body, support, label, and value. Do not bold every heading.
2. Use project semantic color and spacing roles. Raw values belong in the token
   authority or a documented exception, not scattered local styles.
3. Establish a small set of alignment lines. Centering is a product decision, not a
   default; use optical alignment when mathematical centering looks wrong.

## Layers And Attention

1. Name the canvas and every persistent layer before styling. Prefer one near-neutral
   canvas and at most two persistent surfaces; reserve another for a genuine overlay.
2. Give a region one primary containment treatment: spacing, divider, surface, border,
   or elevation. Do not stack tint, border, radius, and shadow on an ordinary region.
3. Do not wash the product in a tint and add white cards to recover contrast.
4. Each large region must earn its footprint through task evidence. Keep one dominant
   content field; reflow, resize, or progressively disclose secondary regions.
5. Make typography, spacing, alignment, and content order carry most hierarchy. Color,
   elevation, and decoration are scarce attention resources.
6. Match density to task frequency. Keep metadata and inspectors quieter or contextual.

## Components, States, And Proof

1. Start from project component defaults. Repeated overrides become a shared semantic
   variant. Imported components plus local overrides must not create a second palette or
   interaction language.
2. Keep current, hovered, focused, pressed, selected, disabled, and loading states
   distinct. Never render populated and empty results or success and failure together.
3. Use cards for real objects or interaction boundaries and shadows for real elevation.
   Keep persistent icon size and stroke weight coherent and subordinate to content.
4. Compare live output and precedent at equal viewport and state. Inspect overflow,
   focus, scroll ownership, responsive transformation, and product character.
5. Run bound design-system conformance proof when available. A missing check is an
   explicit limitation; build or Axe success alone is insufficient.
6. If five unrelated products could use the screen unchanged, ground its character in
   domain objects, workflows, language, or bound assets—not more color.
