# Scope: config

The `config` scope owns the root config contract, normalization, validation, and config migrations.

## Metadata

- Doc ID: `SKOPOS-SCOPE-CONFIG`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/scopes`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `../architecture/config-model.md`

## Changelog

- `2026-04-09`: Updated the config scope to reflect that it will later normalize workflow registry settings while leaving detailed workflow manifests outside the root config.
- `2026-04-09`: Added the initial `config` scope doc as part of the self-hosting package map.

## Current Responsibilities

The `config` package currently owns:

1. root config contract and validation
2. config normalization
3. config load and write flows
4. future workflow registry settings in the root config
