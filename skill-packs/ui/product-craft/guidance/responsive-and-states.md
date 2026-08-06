# Responsive Behavior And Complete States

1. Start with the narrowest useful container; add breakpoints when content requires
   change, not only at named devices.
2. Record what stays, moves, reorders, collapses, becomes an overlay, changes
   interaction, or needs an alternative.
3. For a modal drawer or dialog, transfer focus, expose modal semantics, make the
   background inert, support Escape, and return focus to the trigger.
4. Adapt information priority, navigation, dense data, and actions instead of shrinking
   desktop. Preserve critical content and recovery.
5. Prove applicable loading, empty, partial, error, permission, success, disabled, and
   retry states.
6. Check keyboard flow, zoom, long content, touch targets, reduced motion, overflow,
   and scroll ownership. Local scrolling must not leave clipped controls or scrollbar
   residue in the primary view.
7. Capture narrow, intermediate, and wide states at the actual change boundary.
8. If a desktop interaction becomes unusable when narrow, provide a supported
   alternative or state the limitation; never certify a compressed or inert surface.

Automated checks support but do not replace rendered interaction judgment.
