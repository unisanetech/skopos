# Skopos Glossary

Use stable terms so docs, code, and agent prompts keep the same meaning.

## Metadata

- Doc ID: `SKOPOS-PROJECT-GLOSSARY`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-04-09`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `../architecture/artifact-model.md`

## Changelog

- `2026-04-09`: Added the initial glossary to stabilize product vocabulary before deeper implementation begins.

## Terms

- `project brain`: the repo-local machine-readable and human-readable knowledge system Skopos maintains
- `scope`: a bounded project area Skopos can resolve and load independently
- `artifact`: any generated or authored knowledge surface used by Skopos
- `trust report`: the evidence-backed summary of why a result should or should not be trusted
- `decision escalation`: the ask-back protocol used when an agent must defer a choice to a human
- `finding`: a structural problem, risk, or inconsistency worth tracking explicitly
