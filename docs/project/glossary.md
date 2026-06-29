# Skopos Glossary

Use stable terms so docs, code, and agent prompts keep the same meaning.

## Metadata

- Doc ID: `SKOPOS-PROJECT-GLOSSARY`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/project`
- Canonical: `yes`
- Last Updated: `2026-06-29`
- Review Cycle: `per workpack`
- Related Docs:
  - `overview.md`
  - `../architecture/artifact-model.md`

## Changelog

- `2026-06-29`: Added project mode, clean-refactor, greenfield-in-existing-repo, and command-guided agent brief terms.

- `2026-04-09`: Added the initial glossary to stabilize product vocabulary before deeper implementation begins.

## Terms

- `project brain`: the repo-local machine-readable and human-readable knowledge system Skopos maintains
- `scope`: a bounded project area Skopos can resolve and load independently
- `artifact`: any generated or authored knowledge surface used by Skopos
- `trust report`: the evidence-backed summary of why a result should or should not be trusted
- `decision escalation`: the ask-back protocol used when an agent must defer a choice to a human
- `finding`: a structural problem, risk, or inconsistency worth tracking explicitly
- `project mode`: the confirmed operating mode that tells agents whether to preserve existing behavior, cleanly refactor, reset toward a clean architecture, or treat the repo as new
- `brownfield`: an existing project mode where current behavior and structure should be respected unless the user approves a change
- `clean-refactor`: an existing project mode where agents should improve the current project and remove duplicate or legacy paths when touched
- `greenfield-in-existing-repo`: a mode where the repo exists but the current structure is not treated as canonical, so agents can build toward a clean target architecture
- `new-project`: a mode for empty or fresh projects where Skopos can recommend clean defaults from the start
- `command-guided agent brief`: a command output section that tells the coding agent what to read, what to ask, what to edit, what to avoid, what to check, and how to close
