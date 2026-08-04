# Visual Composition And Polish

Build hierarchy before decoration. Inspect the bound design system and approved
precedents, then define the page's primary job, reading order, content edge, and
responsive behavior.

## Type

1. Use semantic type roles instead of arbitrary sizes, weights, or tracking.
2. Keep one dominant page title. Make section, subsection, body, support, and label
   roles visibly descend from it.
3. Use size, spacing, color, and placement together; do not make every heading bold.
4. Keep headings compact and body copy readable. Labels stay quieter than their values.
5. Reject a secondary heading that appears larger or heavier than its parent role.

## Spacing And Alignment

1. Use the project spacing scale. Related items stay close; sections receive a larger,
   repeated gap.
2. Keep component padding smaller than the separation between major regions.
3. Establish a small set of alignment lines for titles, body content, controls, lists,
   metadata, and supporting rails.
4. Align by ownership, not by available space. Centering is a product decision, not a
   default.
5. Use optical alignment for icons and type when mathematical centering looks wrong.

## Surfaces And Density

1. Give a region one primary containment treatment: spacing, divider, surface, border,
   or elevation. Do not stack all of them.
2. Use borders to explain boundaries, dividers for internal grouping, and shadows only
   for genuine overlay or elevation.
3. Reject nested cards, box-inside-box composition, decorative pills, and competing
   surfaces when whitespace or alignment communicates the structure.
4. Give primary content the strongest width and emphasis. Keep metadata and inspectors
   quieter, bounded, collapsible, and independently scrollable when needed.
5. Keep persistent headers and controls compact. Use readable maximum widths rather
   than filling space without purpose.

## Components And Interaction

1. Start from project component defaults. Override only application composition such as
   width, placement, content density, or responsive visibility.
2. If the same override repeats, improve the shared component or add an explicit
   variant instead of accumulating local classes.
3. Reuse semantic tokens. Do not invent nearby colors, radii, shadows, control heights,
   or spacing values.
4. Keep navigation stable and URL-backed where state must survive refresh, sharing, or
   browser history. Selected, expanded, focused, disabled, and loading states must be
   distinguishable.
5. Prove scrolling inside every bounded region. A hidden scrollbar must not disable
   scrolling, and persistent controls must not become unreachable.
6. Make every visible primary control work with pointer and keyboard input.

## Rendered Review

Review the live interface at wide, intermediate, and narrow content boundaries. Check
type hierarchy, repeated spacing, content edges, optical alignment, surface nesting,
overflow, scroll ownership, long content, focus order, and active states. Fix visible
P0-P2 issues before closure. Source correctness and build success do not replace this
rendered review.
