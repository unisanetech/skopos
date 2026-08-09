# Security Policy

Skopos is pre-release software. We still want security reports to be handled privately,
quickly, and without exposing an adopter's repository data.

## Supported Versions

Before the first public release, only the current release candidate is eligible for a
security fix. After `0.1.0` is published under `next`, the newest `0.1.x` pre-release
will be supported. Older pre-release builds may be replaced by a patched version rather
than maintained in parallel.

The supported runtime families are Node.js `^22.13.0` and `^24.0.0` on the operating
systems listed in [release security and runtime certification](docs/operations/release-security.md).

## Report A Vulnerability

Use [GitHub's private vulnerability reporting](https://github.com/Croodo/skopos/security/advisories/new).
Do not open a public issue for a suspected vulnerability.

Include only what is needed to reproduce and assess the problem:

- the affected Skopos version and installation method
- operating system and Node.js version
- the affected command or workflow
- impact and a minimal reproduction
- whether credentials, private source, or `.skopos/**` data may have been exposed

Do not attach a real repository, secret, access token, complete `.skopos/**` directory,
or unredacted evidence bundle. Create the smallest synthetic reproduction you can. If
sensitive material is essential, say so in the private report before transferring it.

## What To Expect

Reports are handled on a best-effort basis; there is no paid-support SLA. The
maintainer will aim to acknowledge a report within seven calendar days, assess
severity and affected versions, and keep the reporter informed when it is safe to do
so. Complex reports may take longer to reproduce or remediate.

For a confirmed issue, the response may include stopping a release, removing a dist
tag, deprecating a version, publishing a patched version, rotating publisher trust, or
issuing a public advisory. Published versions are never silently overwritten.

## Security Boundary

Skopos stores rebuildable local indexes, coordination data, command output, and
evidence under `.skopos/**`. That data may contain project paths, snippets, commands,
or provider receipts. Keep it local, do not commit it, and do not upload it wholesale
in a bug report. See [storage and privacy](docs/guides/storage-and-privacy.md).

Skopos coordination is cooperative rather than a filesystem sandbox. It can detect and
report participating sessions and overlapping claims, but it cannot prevent an
uncoordinated process from changing files.
