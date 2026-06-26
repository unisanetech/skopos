# Clean Code Maintainability

Use this pack to keep everyday product code easy to read, change, and verify.

The pack is not a request for style-only cleanup. Agents should improve the code they touch, follow local patterns, and avoid broad rewrites unless the task actually needs them.

## Core Rule

Code should have a clear owner and a clear reason to exist.

Before editing, ask:

- What behavior or responsibility owns this change?
- Is there an existing local pattern?
- Is this helper truly shared, or only useful to one feature?
- What proof shows the changed behavior still works?

## Good Default

Keep small work small. Improve names, tests, and local structure around the touched code, but do not turn a focused fix into a general refactor.

Escalate to a bigger workflow when cleanup touches shared helpers, public APIs, many files, or behavior that needs stronger proof.
