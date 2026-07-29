---
title: "Scope: config"
status: active
owner: skopos-core
id: SKOPOS-SCOPE-CONFIG
scope: skopos-config
role: overview
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-28
relatedDocs:
  - ../../architecture/config-model.md
reviewCycle: when owning truth changes
---

# Scope: config

The `config` scope owns the root config contract, normalization, validation, and config migrations.

## Changelog

- `2026-07-28`: Moved this overview into its canonical Scope Memory root and
  bound it to the stable Scope id.

- `2026-04-09`: Updated the config scope to reflect that it will later normalize workflow registry settings while leaving detailed workflow manifests outside the root config.
- `2026-04-09`: Added the initial `config` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `config` package currently owns:

1. root config contract and validation
2. config normalization
3. config load and write flows
4. future workflow registry settings in the root config
