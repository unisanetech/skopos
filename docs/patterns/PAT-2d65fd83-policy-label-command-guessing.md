---
title: "Failure Pattern: Policy Labels Guess Project Commands"
status: active
owner: skopos-core
id: PAT-2d65fd83
scope: skopos
role: pattern
kind: failure-pattern
lifecycle: durable
authority: canonical
provenance: accepted
view: current
appliesTo:
  - policies
  - guards
  - actions
  - validation
  - project-adoption
lastUpdated: 2026-07-30
relatedDocs:
  - ../architecture/action-extension-model.md
  - ../architecture/evidence-and-readiness-model.md
  - ../decisions/D-8d32a27b-canonical-project-memory-task-and-coordination-contract.md
reviewCycle: when Policy, Guard, or Action binding changes
---

# Failure Pattern: Policy Labels Guess Project Commands

## Changelog

- `2026-07-30`: Added the safe recovery path through local capability proposals,
  digest-bound approval, tracked declaration writes, and provider validation.
- `2026-07-30`: Recorded the failure and replaced label/script inference with stable
  policy Guard ids, explicit project Guard manifests, and explicit Action providers.

## Failure Shape

A generic policy says “typecheck,” “test,” or “build.” The workflow engine searches
the adopter's package scripts for similar names and promotes the first match into a
required command. The generated result appears convenient, but it silently mixes
policy intent, project capability discovery, and executable authority.

## Why It Fails

1. script names do not prove semantic equivalence
2. different languages and teams use unrelated command systems
3. the policy layer becomes a hidden project-specific integration
4. agents cannot tell whether a command was declared or guessed
5. a renamed script can change closure behavior without changing policy or Guard truth
6. policy-generated checks compete with project Actions and Task verification

## Prevention

1. Policies reference stable semantic Guard ids only.
2. Projects explicitly declare Guards under `tools/skopos/guards/**`.
3. Guards reference exact project Action ids or agent-observation Evidence.
4. Actions own exact commands, inputs, outputs, safety, and freshness.
5. Missing Guard or Action providers fail visibly.
6. Script detection may propose an integration, but reviewed tracked declarations must
   exist before activation.

## Recovery

Delete label normalization, package-script candidate search, raw recommended command
lists, and validation mode switches. Convert accepted policy requirements to stable
Guard ids, add explicit adopter Guard/Action declarations, and make Verify consume only
Task-linked Evidence from the canonical model. If a project has existing scripts,
detect them with `skopos integrations propose`, review the exact suggestion, approve
its digest, and apply it. Never use candidate detection directly during Task selection
or Verify.
