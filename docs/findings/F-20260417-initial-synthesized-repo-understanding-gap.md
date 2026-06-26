# F-20260417-initial-synthesized-repo-understanding-gap: Brownfield Onboarding Still Leans Too Hard On Raw Artifacts Instead Of A Compact Repo Understanding Layer

## Metadata

- Doc ID: `SKOPOS-F-20260417-INITIAL-SYNTHESIZED-REPO-UNDERSTANDING-GAP`
- Status: `fixed`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-06-26`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../project/vision.md`
  - `../project/positioning.md`
  - `../decisions/019-compiled-reference-layer-and-agent-memory-baseline.md`
  - `../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
  - `../decisions/027-self-healing-product-loop-and-bounded-hardening-contract.md`
  - `../decisions/028-initial-synthesized-repo-understanding-contract.md`

## Changelog

- `2026-06-26`: Closed after `skopos understand` began generating compact repo-summary, feature-inventory, and implementation-hotspot artifacts from existing bootstrap and scope state, indexing those artifacts in the compiled knowledge index, and surfacing the orientation layer on the overview UI.
- `2026-04-17`: Opened after the external `examon-ai` pilot reached `trust = high / agent-ready` but still left the user asking what Skopos actually understands about the repo, because the first-run product surface exposed raw bootstrap, scope, symbol, graph, and generated UI artifacts without one compact synthesized orientation layer for messy brownfield repos.

## Summary

- Severity: `SHOULD`
- Status: `fixed`
- Owner: `skopos-core`
- Target Pack: `brownfield onboarding understanding layer`
- Current State: fixed. Skopos can now generate `.skopos/understanding/repo-summary.json`, `.skopos/understanding/feature-inventory.json`, and `.skopos/understanding/hotspots.json` through `skopos understand`. The artifacts are compact, confidence-aware, indexed in `.skopos/index.json`, and surfaced on the overview UI as a human-readable orientation layer above raw scopes, symbols, and graph artifacts.

## Symptom

1. A messy repo can initialize cleanly and reach `high / agent-ready`.
2. The routed UI then shows useful but mostly machine-readable surfaces such as symbols, scopes, search, and generated docs routes.
3. The user still cannot immediately answer:
   - what this project is
   - which areas matter most
   - where the first bounded implementation target likely lives
4. The current workaround is broad manual browsing or chat-based interpretation instead of one compact generated orientation surface.

## Impact

1. brownfield onboarding remains more expensive than it should be for humans and LLMs
2. LLM-assisted work still spends tokens rediscovering high-level repo structure that Skopos should summarize once
3. the first Skopos UI impression can look like raw artifact plumbing rather than useful project understanding
4. messy repos are onboarded structurally but not yet explained operationally

## Fix Plan

1. add one compact synthesized repo summary artifact
2. add one compact feature-inventory artifact
3. add one compact implementation-hotspots artifact
4. derive those artifacts from existing bootstrap, scope, diagnosis, docs, command, and symbol surfaces instead of inventing a second raw scan path
5. expose the understanding layer in the routed UI as an orientation surface, not a giant generated documentation set
6. prove the slice on Skopos and one messy external repo

## Verification

1. a messy repo first-run surface can answer what the repo is, what the main areas are, and where bounded work should likely start without requiring symbol-first browsing
2. the synthesized understanding layer stays compact and confidence-aware
3. the understanding layer reduces broad repo rediscovery during the first brownfield implementation slice
4. Skopos still avoids broad generated longform docs drift while adding the new orientation layer

## Linked Docs

1. `registry.md`
2. `../project/vision.md`
3. `../project/positioning.md`
4. `../decisions/019-compiled-reference-layer-and-agent-memory-baseline.md`
5. `../decisions/024-token-control-compact-agent-transport-and-progressive-retrieval.md`
6. `../decisions/027-self-healing-product-loop-and-bounded-hardening-contract.md`
7. `../decisions/028-initial-synthesized-repo-understanding-contract.md`
