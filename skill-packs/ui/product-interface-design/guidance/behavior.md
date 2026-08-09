# Behavior

Make the interface work across input, viewport, state, and framework constraints.
Project architecture and bound components override generic advice.

1. Inventory components, tokens, exports, and nearby screens. Prefer reuse, supported
   variant, composition, then a new component for a durable missing responsibility.
2. Name components by stable responsibility or semantic state—not prompt wording,
   appearance, or one screen. Missing conformance proof means unverified, not passed.
3. From the narrowest container, decide what stays, moves, reorders, collapses, becomes
   contextual, or changes interaction. Never merely shrink or hide desktop UI. Give
   scrolling one clear owner.
4. Prove applicable loading, empty, partial, error, permission, success, disabled,
   selected, and retry states. Keep interaction states distinct.

## Bad to Better

| Problem | Bad | Better |
| --- | --- | --- |
| Reuse | Add `CheckoutBlueButton` | Reuse Button or add semantic `intent="checkout"`. |
| Responsive | Stack the shrunken desktop UI | Keep the decision and action visible; reorder details and contextualize tools. |
| State | One spinner for loading and failure | Distinguish loading, partial data, failure, and retry. |
| Control | Clickable styled `div` | Native or project control with keyboard and focus behavior. |
| Dialog | Leave focus behind it | Move focus in, make background inert, support Escape, restore focus. |
| Naming | `SettingsPageCard` | Name the role: `PermissionSummary` or `RetryNotice`. |

Framework guidance is conditional. In React, add a narrow client boundary only for
state, events, lifecycle, or browser APIs. Bad: make a route client-rendered for one
menu. Better: isolate that menu when project architecture supports it. Never introduce
React or another rendering model into a project that does not use it.
