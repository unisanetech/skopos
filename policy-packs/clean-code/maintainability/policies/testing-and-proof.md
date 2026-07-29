# Testing And Proof

Changed behavior needs proof.

Good proof is focused. It should fail if the changed behavior is wrong.

Examples:

- a unit test for a parser or branch
- a feature test for a workflow
- a smoke check for a CLI command
- a typecheck when the change is type-surface only

If proof is skipped, record why.

## Agent Readiness Check

Before claiming completion, confirm:

- touched files still have clear responsibility
- new helpers have specific names
- shared code has real reuse
- behavior changes have a focused test or smoke check
- skipped checks are explained
