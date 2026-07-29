---
id: DOC-self-hosted-architecture
status: durable
owner: fixture
scope: workspace
role: architecture
lifecycle: durable
authority: canonical
provenance: declared
view: current
---

# Self-Hosted Architecture

The workspace owns three registered child Scopes:

- `selfhost-cli` is a `tool` at `packages/cli`.
- `selfhost-core` is a `package` at `packages/core`.
- `selfhost-ui` is an `application` at `packages/ui`.

The CLI and UI depend on core. Skopos must preserve those project-specific Scope
kinds while using package manifests only as workspace-discovery evidence.
