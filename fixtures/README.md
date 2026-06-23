# Skopos Fixtures

Use this folder for realistic repo fixtures that exercise:

1. greenfield bootstrap
2. messy existing projects
3. monorepo retrieval
4. docs drift and closure behavior

Current active fixture roots:

1. `repos/clean-service` for clean single-repo brownfield bootstrap and planning benchmarks
2. `repos/basic-monorepo` for bootstrap, exact scope resolution, compact context, workflow-sensitive closure, and mixed benchmark flows
3. `repos/messy-monorepo` for conflicting-pattern diagnosis and remediation benchmarks
4. `repos/legacy-multi-package` for quieter brownfield structure-drift benchmarks where docs and instructions exist but workspace boundaries are still implicit
5. `repos/approval-workflow-repo` for approval-sensitive and destructive workflow enforcement benchmarks
6. `repos/large-monorepo` for subtree-targeted large-repo bootstrap and sliced-artifact benchmarks
7. `repos/stale-docs-repo` for brownfield docs-trust benchmarks where docs exist but canonical routing and freshness have drifted
8. `repos/canonical-override-repo` for brownfield canonicalization benchmarks where declared human truth must outrank inference
9. `repos/boundary-aware-workspace` for workspace-ignore and active-package-boundary benchmarks in proof-heavy repos
10. `repos/self-hosted-tooling-workspace` for deterministic Skopos-on-Skopos workflow discovery, trust, and portal-rendering benchmarks
11. `repos/mixed-brownfield-monorepo` for middle-band brownfield diagnosis where workspace/docs/instructions are canonical but the root command surface still needs stabilization
12. `repos/library-structure-drift` for middle-band architecture interpretation where a library-style multi-package repo is usable but still needs explicit workspace-boundary stabilization
13. `repos/brownfield-stabilization-delta-before` and `repos/brownfield-stabilization-delta-after` for before-versus-after stabilization benchmarks where docs routing, root commands, and mirror sync should produce a measurable health and trust delta
