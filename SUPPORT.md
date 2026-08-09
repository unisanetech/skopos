# Support

Skopos `0.1.x` is a pre-release line. Community support is provided on a best-effort
basis and does not include an uptime or response-time guarantee.

## Before Asking For Help

1. Confirm the installed version with `skopos --version`.
2. Confirm Node.js is `^22.13.0` or `^24.0.0`.
3. Read the [package quick start](packages/cli/README.md) and run `skopos --help`.
4. Run `skopos session context . --actor <id> --json` and read any warning or next
   action it reports.
5. Reduce the problem to a small project or synthetic fixture when possible.

## Where To Ask

Use [GitHub Issues](https://github.com/Croodo/skopos/issues) for reproducible bugs,
documentation gaps, compatibility problems, and focused feature requests. Search open
and closed issues first.

Include:

- Skopos, Node.js, package-manager, and operating-system versions
- the exact command and a redacted error
- the smallest safe reproduction
- whether the problem occurs in a clean project

Do not include secrets, private repository contents, full command histories, or a
complete `.skopos/**` directory. For suspected vulnerabilities, follow
[SECURITY.md](SECURITY.md) instead of opening a public issue.

## Current Support Boundary

- The first public package is only `@skopos/cli`.
- The supported Node.js range is `^22.13.0 || ^24.0.0`.
- Internal SDK packages and `@skopos/ui` are not separately supported public packages.
- Prototype-state migration and backward compatibility are not promised before a
  stable release.
- Coding-agent host integrations depend on the capabilities exposed by each host;
  manual use of the CLI remains the portable fallback.
