---
title: Developer Workflows
status: active
owner: skopos-core
id: SKOPOS-DEVELOPER-WORKFLOWS
scope: skopos
role: guide
lifecycle: durable
authority: canonical
provenance: declared
view: current
lastUpdated: 2026-07-30
relatedDocs:
  - ../architecture/agent-native-operating-model.md
  - ../architecture/evidence-and-readiness-model.md
  - ../standards/validation.md
reviewCycle: when CLI behavior changes
---

# Developer Workflows

## Changelog

- `2026-07-30`: Added `--action-manifest` and `--guard-manifest` review inputs so
  project-specific candidate commands can enter the same digest-bound approval flow
  without adding project rules to Skopos core.
- `2026-07-30`: Added the reviewed project capability-integration workflow. Detection
  and approval remain local and non-authoritative; only applying an exact approval
  writes tracked declarations and activation validates Guard providers.
- `2026-07-30`: Clarified that `actions run --task` creates the Task-owned Evidence
  Link required by Verify; unlinked project-level Action runs are not Task proof.
- `2026-07-29`: Replaced prototype commands with the canonical Session, Task, Work
  Queue, Action, Evidence, Verify, and Readiness flow.

## Start A Session

```bash
skopos session context . --actor <id> --host <host> --session-id <session-id> --json
```

Use the returned current Task when one is unambiguous. Otherwise inspect:

```bash
skopos work next . --actor <id>
```

## Start Work

For a bounded Task:

```bash
skopos start "<goal>" . \
  --actor <id> \
  --accept "<observable acceptance criterion>" \
  --own <path>
```

Add more `--accept`, `--own`, `--constraint`, and `--non-goal` values as needed. Use
standard or high-impact risk when work crosses Sessions, changes architecture or public
behavior, or needs durable coordination.

Material decisions are resolved with:

```bash
skopos decide <question-id> <option-id> . --actor <id>
```

## Continue Work

```bash
skopos task show <task-id> . --actor <id>
skopos work next . --actor <id>
```

Task state, open questions, and recommendations are Task-owned. Tracked standard and
high-impact Tasks reconstruct local state after a clean clone.

## Run Project Capabilities

```bash
skopos actions list .
skopos actions run <action-id> . --task <task-id> --actor <id>
```

Actions are selected from Task-owned paths, Scope, phase, risk, and deterministic
Guards. A root script catalog is discovery input, not a mandatory checklist.
Accepted policy packs name stable Guard capabilities, while each project explicitly
declares the Guard and its Action or observation provider.

To integrate existing project commands without guessing authority:

```bash
skopos integrations propose .
skopos integrations approve . \
  --proposal <proposal-digest> \
  --accept <candidate-id> \
  --actor <id> \
  --reason "<why this command is the correct project capability>"
skopos integrations apply . --approval <approval-digest> --actor <id>
```

Review the proposed command, working directory, Scope, paths, phase, risk, safety, and
approval fields before approval. Proposal and approval write only local
`.skopos/integrations/**` artifacts. Apply writes the reviewed Action/Guard pair,
refuses collisions, and activates it only after the Guard's explicit provider loads.
An unrecognized project-specific command remains a candidate; author its declaration
instead of forcing a generic suggestion:

```bash
skopos integrations approve . \
  --proposal <proposal-digest> \
  --accept <one-candidate-id> \
  --action-manifest .skopos/integrations/review/<action>.yaml \
  --guard-manifest .skopos/integrations/review/<guard>.yaml \
  --actor <id> \
  --reason "<why these exact declarations are correct>"
```

The reviewed Action must preserve the candidate's exact command and working directory,
and the reviewed Guard must require that Action. Skopos copies the approved declarations
to their canonical tracked paths only during apply.

## Record And Check Proof

Action execution records reusable Evidence and links it to the named Task. Explicit
acceptance or Guard observations can be recorded with:

```bash
skopos evidence record <task-id> . --acceptance <id> --actor <id> ...
```

Then evaluate coverage:

```bash
skopos verify <task-id> . --phase closure --actor <id>
skopos readiness <task-id> . --for close --actor <id>
```

Verify never runs Actions implicitly. Readiness explains missing Evidence, stale
inputs, Guard blockers, coordination contamination, and the next safe action.

## Parallel Sessions In One Checkout

Each host tab uses a stable Session id. Before writing:

```bash
skopos coordination session open . --session-id <id> --actor <actor> --host <host>
skopos coordination task reserve . --session-id <id> --task <task-id>
skopos coordination claim add . --session-id <id> --task <task-id> --resource <path>
```

Use mutation begin/complete around cooperative edits and audit before integration.
Stale ownership uses audited takeover. High-impact work creates an immutable Task
snapshot before closure. Because direct writes can bypass the broker, current
enforcement remains cooperative unless the host reports hooked or mediated operation.

## Adopt An Existing Project

```bash
skopos init . --mode existing --actor <id>
skopos adopt assess . --actor <id>
```

The coding agent reviews the intake and creates analysis input separating facts,
inferences, assumptions, contradictions, material questions, and complete document
dispositions. Then:

```bash
skopos adopt propose . --analysis <path> --actor <id>
skopos adopt approve . --proposal <digest> --actor <id> --reason "<reason>"
```

Execute only the approved restructuring brief, repair links/instructions/config/Scope
roots, complete its execution evidence, then:

```bash
skopos adopt verify . --execution <path> --actor <id>
skopos adopt activate . --actor <id> --reason "<reason>"
```

Assessment-only mode is valid, but it is not agent-ready adoption.

## Validation Economy

1. edit a coherent slice
2. run the narrowest reliable affected-package check
3. fix one failure class before continuing
4. reuse fresh source-bound Evidence
5. run broad release proof once at the end
