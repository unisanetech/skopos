# Naming And Responsibility

Names should explain the purpose of the code.

Prefer names that say what the code owns:

- `parseWebhookPayload`
- `formatInvoiceTotal`
- `createInviteEmail`
- `loadProjectMemory`

Avoid vague names when a specific name is possible:

- `misc`
- `helper`
- `helpers`
- `common`
- `manager`
- `thing`
- `data`

## Responsibility

A file or function should have one clear job. If one place handles input parsing, product rules, persistence, formatting, and output mapping, the next agent will have a harder time changing it safely.

Keep feature-only behavior inside the feature. Move code to shared only when reuse is real and the shared helper has one stable meaning.
