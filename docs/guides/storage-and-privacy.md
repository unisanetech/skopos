---
title: Manage Local Storage And Privacy
status: active
owner: skopos-core
id: SKOPOS-GUIDE-STORAGE-PRIVACY
scope: skopos
role: guide
lifecycle: durable
authority: supporting
provenance: declared
view: current
lastUpdated: 2026-08-09
relatedDocs:
  - ../architecture/storage-lifecycle-and-privacy.md
reviewCycle: when storage commands or privacy behavior changes
---

# Manage Local Storage And Privacy

Skopos stores local working data in `.skopos/`. Some of it is rebuildable; some of it
is evidence that explains or protects active work. Use the storage commands to see the
difference before removing anything.

> `.skopos/` may contain private source, prompts, screenshots, traces, generated code,
> and provider receipts. Do not upload or share the directory wholesale.

## Check Storage Health

```bash
skopos storage status .
skopos storage inspect . --limit 20
skopos storage policy show .
```

`status` shows total size, limit state, storage classes, protected units, and units
eligible for cleanup. `inspect` lists the largest managed units so you can understand
what occupies space. Add `--json` for automation.

## Preview Cleanup

```bash
skopos storage prune .
```

This is a dry-run. It lists what would be removed and changes nothing. Writing
`--dry-run` is optional but useful in scripts when you want the intent to be obvious.

Review the preview before applying it. Protected active Task data, release references,
running Action data, and user pins are excluded from the selection.

## Apply Cleanup

```bash
skopos storage prune . --apply --actor your-id
```

Applying cleanup requires an actor. Skopos deletes only the units selected by the
same safety rules and writes a receipt under `.skopos/storage/receipts/`. The receipt
records paths, sizes, reasons, outcomes, and the actor—not the contents of deleted
files.

## Keep Something Explicitly

```bash
skopos storage pin .skopos/evaluations/important-review . \
  --actor your-id \
  --reason "Needed for the release investigation"
```

Remove the pin later by id or path:

```bash
skopos storage unpin storage-pin-abc123 . --actor your-id
skopos storage unpin .skopos/evaluations/important-review . --actor your-id
```

Pins do not expire automatically. Keep their reasons specific so another operator can
understand why the data remains protected.

## Configure Limits And Retention

Edit the `storage` block in `skopos.config.yaml`. Start with the defaults and shorten
retention only when your team has another durable proof path. A hard-limit warning
does not cause automatic deletion; cleanup still requires an explicit apply command.
