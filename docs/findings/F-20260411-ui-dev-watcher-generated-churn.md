# F-20260411-ui-dev-watcher-generated-churn: UI Dev Was Watching Generated App Output And Tooling Churn As Live Inputs

## Metadata

- Doc ID: `SKOPOS-F-20260411-UI-DEV-WATCHER-GENERATED-CHURN`
- Status: `fixed`
- Owner: `skopos-core`
- Scope: `skopos/findings`
- Canonical: `yes`
- Last Updated: `2026-06-25`
- Review Cycle: `per workpack`
- Related Docs:
  - `registry.md`
  - `../decisions/012-system-ui-dev-loop-and-hot-reload.md`
  - `../runbooks/local-development.md`

## Changelog

- `2026-06-25`: Closed after adding repeated-churn regression coverage that fires 25 generated app and tooling events before a real docs refresh and 15 more ignored events afterward, proving ignored output stays quiet while route-owned authoring changes still refresh.
- `2026-04-17`: Added explicit dev-server regression coverage proving that change events inside `.skopos/tooling/**` do not emit UI state refreshes, so the remaining gap is now longer-running empirical stability under repeated self-hosted churn rather than untested ignore-path alignment.
- `2026-04-11`: Opened after `skopos ui dev` crashed with a macOS `fsevents` heap OOM while the custom watcher was still treating generated app output under `docs/generated/skopos/app/**` and non-route-owned `.skopos/tooling/**` churn as part of the live authoring watch surface.

## Summary

- Severity: `SHOULD`
- Status: `fixed`
- Owner: `skopos-core`
- Target Pack: `ui dev watcher hardening`
- Current State: fixed. The dev watcher excludes generated app output and `.skopos/tooling/**`, the refresh filter rejects those paths even if they surface through the watcher, explicit regression coverage proves both ignore paths do not emit UI refresh events, and repeated-churn coverage now proves ignored output stays quiet while route-owned docs changes still refresh.

## Symptom

1. `skopos ui dev` could run for a while and then abort with a Node heap out-of-memory error inside `fsevents`.
2. The custom dev watcher was still listening to generated app output and non-route-owned tooling churn through the same broad `docs` and `.skopos` watch trees used for live authoring refresh.
3. Generated output and tooling noise could therefore compete with canonical authoring inputs such as docs, plans, missions, proof, and trust artifacts.

## Impact

1. The default UI authoring loop could become unstable during normal self-hosted iteration.
2. Generated output risked feeding back into the watcher that is supposed to track human-authored or route-owned source changes.
3. Skopos was violating its own dev-loop doctrine that watcher scope must stay incremental and route-aware.

## Fix Plan

1. Narrow `skopos ui dev` watch targets to route-relevant authoring and artifact inputs instead of broad tree roots where possible.
2. Explicitly ignore `docs/generated/skopos/app/**` and `.skopos/tooling/**` in the dev watcher configuration.
3. Keep the runtime refresh filter aligned with those ignore rules so generated churn cannot still trigger a rebuild path indirectly.
4. Keep regression coverage in place so generated output and tooling files cannot re-enter the live refresh path.

## Verification

1. `skopos ui dev` no longer watches `docs/generated/skopos/app/**` or `.skopos/tooling/**` as live refresh inputs.
2. A change event inside the generated app output path no longer emits a console-state refresh event.
3. The routed console still refreshes for canonical docs, plans, missions, proof, trust, and other route-owned `.skopos` artifacts.
4. Repeated generated app and tooling churn stays quiet before and after a real route-owned docs refresh.
5. Self-hosted long-running `ui dev` sessions stay stable under normal authoring and adjacent build churn.

## Linked Docs

1. `registry.md`
2. `../decisions/012-system-ui-dev-loop-and-hot-reload.md`
3. `../runbooks/local-development.md`
