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
lastUpdated: 2026-08-05
relatedDocs:
  - ../architecture/agent-native-operating-model.md
  - ../architecture/evidence-and-readiness-model.md
  - ../standards/validation.md
  - ../decisions/021-discussion-memory-checkpoints-and-handoff-contract.md
  - ../decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md
  - ../work/archive/P-20260805-conversation-aware-session-continuation-plan.md
reviewCycle: when CLI behavior changes
---

# Developer Workflows

## Changelog

- `2026-08-05`: Documented the accepted fresh-session continuation direction: enrich
  the exact Task handoff with bounded agent-authored conversation context, validate it
  against live state, and use truthful host delivery or the manual prompt fallback.
- `2026-08-04`: Documented explicit Task-closure versus Project-integration proof
  subjects, required overlay-safe Action declarations, and command-specific help.
- `2026-07-31`: Replaced the manual verification-state/Readiness sequence with
  `skopos finish`, made hot-path JSON compact by default with explicit `--full`
  inspection, and documented precise Action source exclusions.
- `2026-07-31`: Corrected the canonical Evidence, compact inspection, coordination,
  verification, and two-command closure examples to match the public CLI.
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
skopos work next . --actor <id> --json
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

The default proof subject is `task-closure`: only the admitted Task-owned boundary is
eligible for closure proof. When the requested result is explicitly an integration or
release baseline, start a separate integration Task:

```bash
skopos start "<integration goal>" . \
  --proof-subject project-integration \
  --own <integration-path> \
  --actor <id>
```

`project-integration` requires at least one owned path and is always detailed and
high-impact. It is not a dirty-worktree escape hatch: pre-existing, other-Task, and
unattributed paths remain classified separately. Inspect `skopos start --help` before
choosing the wider proof subject.

Material decisions are resolved with:

```bash
skopos decide <question-id> <option-id> . --actor <id>
```

## Continue Work

```bash
skopos task show <task-id> . --json
skopos work next . --actor <id> --json
```

Task state, open questions, and recommendations are Task-owned. Tracked standard and
high-impact Tasks reconstruct local state after a clean clone. Hot-path JSON is compact
by default; add `--full` only when complete portable state is required.

## Continue In A Fresh Session

Use fresh continuation when the current coding-agent conversation is large enough to
slow work or obscure the current objective. Native host resume keeps the old
conversation and is not the same operation.

The implemented workflow is:

1. refresh the current Task checkpoint
2. let the current agent contribute a bounded summary of user intent, accumulated
   constraints, Session progress, rejected approaches, stopping position, exclusions,
   and next action
3. write the classified capsule to a temporary reviewed JSON file and create the exact Task-scoped handoff:

   ```bash
   skopos discuss handoff create . --task <task-id> --context <capsule.json> --json
   skopos discuss handoff show . --task <task-id> --json
   ```
4. validate source, Task, Evidence, policy, Skill selection, privacy, budget, and coordination freshness:

   ```bash
   skopos discuss handoff verify . --task <task-id> --json
   skopos discuss handoff render . --task <task-id> --json
   ```
5. transfer writing ownership through the existing Session and Task lifecycle
6. create a fresh host Session when supported, or copy the rendered manual prompt
7. open the receiving Skopos writer Session, accept the current handoff, then run `skopos session context` before continuing:

   ```bash
   skopos discuss handoff accept . --task <task-id> --actor <id> --receiving-session <id> --host <host> --json
   skopos session context . --actor <id> --session-id <id> --host <host> --json
   ```

`refresh` recompiles live truth around the preserved capsule; it never derives semantic
conversation judgment from a transcript. `current` may be accepted, `refreshable`
must be rebuilt, `stale` requires owned-state inspection, `conflicted` requires Action,
mutation, claim, or contamination reconciliation, and `invalid` is rejected. Sensitive
values are redacted before persistence. Over-budget prompts fail explicitly and are
not silently truncated.

Codex reports host-API creation, injection, origin identity/messaging, pre-compaction,
and completion capabilities. Claude Code currently provides origin identity,
pre-compaction, and completion hooks but not proven fresh-process creation or prompt
injection. Manual hosts provide no automation: review and copy the rendered prompt.
In every case, generated or rendered is not delivered, native resume is not a fresh
Session, and the originating Session is never archived or deleted implicitly.

## Run Project Capabilities

```bash
skopos actions list .
skopos actions run <action-id> . --task <task-id> --actor <id>
```

Actions are selected from Task-owned paths, Scope, phase, risk, and deterministic
Guards. A root script catalog is discovery input, not a mandatory checklist.
Accepted policy packs name stable Guard capabilities, while each project explicitly
declares the Guard and its Action or observation provider.

Action `inputs` should name the narrowest durable source families the command actually
proves. When a necessary directory input contains unrelated generated or volatile
content, declare `sourceExcludes` explicitly rather than hashing the whole noisy tree.
Skopos always keeps its current Task projection outside Task-bound Action Evidence.
Every Action executed against the live workspace must explicitly declare
`workspaceMode: overlay-safe`; omission is invalid rather than an inferred default.

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
skopos evidence record-observation <task-id> . \
  --requirement <requirement-id> \
  --statement "<observed fact>" \
  --actor <id> \
  --compact \
  --json
```

Then inspect coverage and close through the canonical state transition:

```bash
skopos verify <task-id> . --phase closure --json
skopos finish <task-id> . --actor <id> --json
```

Verify never runs Actions implicitly. `finish` verifies the stable current state,
advances an admitted Task only when it is ready, archives its tracked projection, and
rechecks final Readiness. If anything blocks closure, the Task does not advance.
High-impact snapshot and coordination requirements remain mandatory.

## Parallel Sessions In One Checkout

Each host tab uses a stable Session id. Before writing:

```bash
skopos coordination session open . --session <id> --actor <actor> --host <host>
skopos coordination task reserve <task-id> . --session <id>
skopos coordination claim add exact-path <path> . --task <task-id> --session <id>
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
