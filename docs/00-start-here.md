# Skopos Start Here

Use this file as the minimum deterministic entrypoint for contributors and coding agents working on Skopos itself.

## Metadata

- Doc ID: `SKOPOS-START-HERE`
- Status: `active`
- Owner: `skopos-core`
- Scope: `skopos/docs`
- Canonical: `yes`
- Last Updated: `2026-07-25`
- Review Cycle: `per workpack`
- Related Docs:
  - `project/overview.md`
  - `project/vision.md`
  - `project/positioning.md`
  - `project/agentic-coding-research.md`
  - `project/agentic-operating-plan.md`
  - `project/missing-decisions-checklist.md`
  - `project/proof-phase-plan.md`
  - `project/system-ui-plan.md`
  - `project/policy-pack-and-stack-intelligence-plan.md`
  - `project/implementation-checklist.md`
  - `architecture/00-architecture.md`
  - `architecture/agent-native-operating-model.md`
  - `architecture/package-boundaries.md`
  - `architecture/runtime-model.md`
  - `architecture/retrieval-and-query-strategy.md`
  - `architecture/trust-and-closure-model.md`
  - `architecture/decision-escalation-model.md`
  - `architecture/config-model.md`
  - `architecture/artifact-model.md`
  - `architecture/workflow-extension-model.md`
  - `decisions/018-self-hosting-workflow-contract.md`
  - `decisions/019-compiled-reference-layer-and-agent-memory-baseline.md`
  - `decisions/020-workflow-router-questions-recommendations-and-eval-contract.md`
  - `decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
  - `decisions/022-program-router-sequencing-and-obligation-contract.md`
  - `decisions/029-policy-pack-stack-intelligence-and-memory-contract.md`
  - `decisions/033-memory-map-and-agent-workflow-intelligence-contract.md`
  - `decisions/034-post-init-setup-review-and-confirmed-understanding-contract.md`
  - `decisions/035-agent-guided-project-understanding-contract.md`
  - `decisions/036-project-modes-and-command-guided-agent-briefs.md`
  - `decisions/037-role-based-memory-and-agent-operating-layer.md`
  - `decisions/038-skopos-self-hosting-mode-and-compatibility-boundaries.md`
  - `decisions/039-agent-native-single-control-plane-and-project-adoption-contract.md`
  - `decisions/040-project-adapted-skill-packs-as-capability-projections.md`

## Changelog

- `2026-07-25`: Added Decision 040 and P1-W12 for project-adapted, task-selective
  skill packs that compile into the existing context/action/guard model.

- `2026-07-25`: Added the agent-native single-control-plane decision and operating
  model. P1-W11 now owns convergence toward context/actions/guards, compact task intent,
  progressive context, phase-separated proof, receipts, worktree-safe state, and full
  downstream-project adoption without parallel LLM workflows.

- `2026-06-30`: Added the command-discovery rule and common command surface so agents check docs/help before grepping source for Skopos command usage.

- `2026-06-29`: Added the Skopos self-hosting mode and compatibility-boundary decision so internal work follows clean-refactor behavior while public surfaces keep explicit compatibility discipline.

- `2026-06-29`: Added agentic coding research notes to the read path so Skopos implementation stays grounded in current coding-agent instruction, workflow, and memory behavior.

- `2026-06-29`: Added the role-based memory and agent operating layer decision to the canonical read path so Skopos maps required memory roles instead of forcing one docs tree.

- `2026-06-29`: Expanded the agentic operating plan into the concrete implementation sequence and made proof/readiness correctness the first active priority before broader project-mode and command-brief implementation.

- `2026-06-29`: Added the agentic operating plan and project-mode/command-brief decision to the canonical read path so Skopos treats brownfield, clean-refactor, greenfield-in-existing-repo, and new-project behavior as first-class product direction.

- `2026-06-29`: Added the agent-guided project understanding contract to correct scanner-only onboarding before broad agent work.

- `2026-06-29`: Added the post-init setup review contract to the canonical read path so Skopos separates facts, inferences, assumptions, and user confirmation questions before treating project understanding as trusted memory.
- `2026-06-27`: Clarified UI runtime modes: `skopos ui dev` is the live auto-refreshing workspace console, while `skopos ui serve` is a static snapshot preview that must be restarted after state changes.
- `2026-06-27`: Added item-level mission progress recording through `skopos mission item complete`, so agents can keep UI checklists current without hand-editing generated mission JSON.
- `2026-06-27`: Added bounded foreground eval checks with `--check-timeout-ms`, so long validation commands produce timed-out partial-proof artifacts instead of silently hanging.
- `2026-06-27`: Split the broad CLI e2e suite onto `pnpm --filter @skopos/cli test:e2e`, keeping default `pnpm test` bounded for normal eval and release validation.
- `2026-06-27`: Updated the workflow contract so `skopos start` and `skopos next` return a compact project-knowledge block before implementation guidance.
- `2026-06-27`: Added `skopos knowledge . --compact` to the self-hosting workflow so agents can load the short project-knowledge summary before deciding which docs or source files to inspect.
- `2026-06-27`: Added the Memory Map and Agent Workflow Intelligence contract to the canonical read path so Skopos maps existing project truth before scaffolding docs and guides agent communication across the full workflow.
- `2026-06-24`: Added the accepted policy-pack, stack-intelligence, and memory contract decision to the Skopos read path before implementation of the new product-intelligence artifacts.
- `2026-06-24`: Added the policy-pack and stack-intelligence plan to the canonical read path so Skopos can mature from project-state tooling into accepted project policy, stack recommendation, drift detection, and agent bootstrap intelligence without shipping placeholder packs.
- `2026-04-12`: Updated the start router again to add the program-router contract, so the next structural control-plane slice now sits above the implemented mission router: Skopos should sequence accepted work, docs obligations, and UI obligations through one compiled program state instead of leaving that ordering to user memory.
- `2026-04-12`: Updated the start router again so `start`, `next`, `decide`, and `eval` now also report execution-surface guidance, defaulting self-hosted batches to `artifact-only` and only escalating to `artifact-plus-workpack-doc` when coordination signals are broad enough to justify a temporary second planning surface.
- `2026-04-12`: Updated the start router after the discussion-memory contract landed, so the next structural increment is now cross-chat continuity through checkpoints and handoffs plus adapter and UI adoption of the router, not more trust-and-done closure work.
- `2026-04-12`: Updated the start router after `skopos eval` landed, so the canonical self-hosting loop now uses `start`, `next`, `decide`, and `eval` as real runtime commands and the remaining open slice is stricter `trust` plus `done` integration.
- `2026-04-12`: Updated the start router after `skopos next` landed, so the canonical self-hosting loop now uses `start`, `next`, and `decide` as real runtime commands while the remaining open slice is `eval` plus closure integration.
- `2026-04-11`: Updated the start router again after `skopos decide` landed, so bounded decision answers are now durable runtime state and the remaining open workflow-router slices are `next` plus `eval` rather than the full post-start control plane.
- `2026-04-11`: Updated the start router after the first workflow-router slice landed, so `skopos start` is now the canonical post-discussion entrypoint for new work while `next`, `decide`, and `eval` remain the open follow-on slices.
- `2026-04-11`: Added the next workflow-router direction to the default read path, so the next structural increment is no longer implicit: Skopos should route new work through `start`, `next`, `decide`, and `eval` instead of leaving post-discussion execution sequencing to chat discipline.
- `2026-04-11`: Tightened the self-hosting rule for structural changes again, so new durable artifact families or retrieval/trust contract changes now require a decision doc before broad code edits instead of relying on plan and mission runtime state alone.
- `2026-04-11`: Updated the start router again to record the new active-mission trust rule, so local source or workflow work without a claimed mission now surfaces immediately in Skopos trust instead of only through secondary drift symptoms.
- `2026-04-11`: Updated the start router to make Skopos-native plan-plus-mission execution the canonical self-hosting path for feature and structural work, replacing the older hybrid-governance wording and routing the remaining execution gap into an active finding.
- `2026-04-10`: Updated the start router to add the system UI plan after proof-phase planning, so the next major batch is routed through one durable UI plan instead of ad hoc portal requests.
- `2026-04-10`: Updated the start router to reflect linked mission slicing as the canonical self-hosting batch-decomposition path after a workspace batch plan recommends `narrow-scope-first`.
- `2026-04-10`: Updated the start router to require plan-plus-mission execution for proof-phase batches and to route self-hosting structural friction into the findings registry.
- `2026-06-24`: Updated the start router after moving Skopos to its standalone workspace and removing the Unisane adapter from the active package model.
- `2026-04-09`: Updated the start router to reflect the first self-hosting root pack before standalone extraction.
- `2026-04-09`: Added the proof-phase plan and resolved blocker decisions to the default Skopos read path.
- `2026-04-09`: Updated the start router to reflect the compiled project knowledge loop and brownfield-first proof direction.
- `2026-04-09`: Added the missing-decisions checklist to the default read path so blocker decisions gate further feature expansion.
- `2026-04-09`: Added the first Skopos read router so the incubated product can use its own knowledge governance from the start.

## Read Order

1. `project/overview.md`
2. `project/vision.md`
3. `project/positioning.md`
4. `project/agentic-coding-research.md`
5. `project/agentic-operating-plan.md`
6. `project/missing-decisions-checklist.md`
7. `project/proof-phase-plan.md`
8. `project/system-ui-plan.md`
9. `project/policy-pack-and-stack-intelligence-plan.md`
10. `project/implementation-checklist.md`
11. `runbooks/local-development.md`
12. `architecture/00-architecture.md`
13. `architecture/agent-native-operating-model.md`
14. `architecture/package-boundaries.md`
15. `architecture/runtime-model.md`
16. `architecture/docs-governance.md`
17. `architecture/retrieval-and-query-strategy.md`
18. `architecture/trust-and-closure-model.md`
19. `architecture/decision-escalation-model.md`
20. `architecture/config-model.md`
21. `architecture/artifact-model.md`
22. `architecture/workflow-extension-model.md`
23. `decisions/018-self-hosting-workflow-contract.md`
24. `decisions/019-compiled-reference-layer-and-agent-memory-baseline.md`
25. `decisions/020-workflow-router-questions-recommendations-and-eval-contract.md`
26. `decisions/021-discussion-memory-checkpoints-and-handoff-contract.md`
27. `decisions/022-program-router-sequencing-and-obligation-contract.md`
28. `decisions/029-policy-pack-stack-intelligence-and-memory-contract.md`
29. `decisions/033-memory-map-and-agent-workflow-intelligence-contract.md`
30. `decisions/034-post-init-setup-review-and-confirmed-understanding-contract.md`
31. `decisions/035-agent-guided-project-understanding-contract.md`
32. `decisions/036-project-modes-and-command-guided-agent-briefs.md`
33. `decisions/037-role-based-memory-and-agent-operating-layer.md`
34. `decisions/038-skopos-self-hosting-mode-and-compatibility-boundaries.md`
35. `decisions/039-agent-native-single-control-plane-and-project-adoption-contract.md`
36. `decisions/040-project-adapted-skill-packs-as-capability-projections.md`
37. `findings/registry.md`

## Self-Hosting Mode

1. Treat this repository root as the Skopos workspace root for local dogfooding.
2. Use the subtree-local `package.json`, `pnpm-workspace.yaml`, `skopos.config.yaml`, `AGENTS.md`, and `tools/skopos/workflows/*.yaml` as the canonical self-hosting surfaces.
3. For Skopos feature, functionality, and structural batches, use `skopos start "<goal>" . --actor <id>` as the canonical post-discussion entrypoint so execution state lives inside Skopos itself from the beginning.
4. For new durable artifact families or changes to retrieval, trust, or workflow contracts, add the decision doc before broad code edits; plan and mission artifacts do not replace that design record.
5. `skopos plan` and direct `mission` commands still exist as lower-level workflow surfaces, but they are no longer the preferred first step for new real work.
6. If the batch mission recommends `narrow-scope-first`, use `skopos mission slice` to spawn a linked narrower child mission instead of decomposing in ad hoc notes.
7. Local source or workflow work without an active claimed mission should now show up as a trust warning, not only as later workflow drift.
8. When self-hosting exposes structural friction, route it into `findings/registry.md` instead of keeping it only in chat context.
9. Repository-level safety and validation rules still apply, but they do not replace Skopos workflow artifacts as the execution router for Skopos work.
10. Use `skopos next . --actor <id>` during ongoing work so the current mission, recommendation state, and next bounded action stay synchronized without re-reading broad docs.
11. Use `skopos knowledge . --compact` when an agent needs a short project-knowledge summary before choosing what to read next.
12. Treat the `projectKnowledge` block from `skopos start` and `skopos next` as the first context hint before loading broader docs.
13. Use `skopos mission item complete <mission-id> <item-id> . --actor <id>` when a checklist item is genuinely done, so the UI, mission JSON, and next-step router stay aligned.
14. Use `skopos decide <question-id> <option-id>` whenever `skopos start` or `skopos next` returns a blocking workflow question instead of clearing the blocker only in chat context.
15. Use the existing eval authority by phase: `--phase iteration` for changed-scope
    feedback, `--phase stabilization` to review owner-generator evidence, and
    `--phase closure` once for final checks and proof. Omitting `--phase` remains
    backward-compatible closure behavior.
16. Use `skopos ui dev .` while actively changing project state; use `skopos ui serve .` only when a static snapshot preview is enough.
17. Treat the router `executionSurface` guidance as advisory workflow hygiene: stay `artifact-only` by default and only add a temporary workpack doc when the reported coordination signals justify it.
18. The first low-noise program-router slice now exists through `.skopos/program/state.json`, `skopos program sync`, and `skopos program next`.
19. That slice currently sequences active mission state plus active findings, derives typed obligations, and returns compact continue-versus-interrupt guidance without creating a second heavy planning system.
20. Discussion continuity remains the adjacent memory slice: checkpoints and handoffs still need to feed the program router so accepted direction survives compaction and new-thread continuation without replaying raw chat.
21. Routed UI adoption is still pending, so `overview`, `mission detail`, `trust`, and the search dock do not yet surface the full program-state guidance directly.

## Command Discovery

Agents should not need to search source files to learn normal Skopos commands. Check these surfaces first:

1. `AGENTS.md`
2. this file
3. `project/workflows.md`
4. `skopos --help`
5. subcommand help, for example `skopos ui --help` or `skopos ui dev --help`

Source search is a fallback when the documented surface is missing, stale, or unclear.

Common commands:

1. `skopos knowledge . --compact`
2. `skopos setup review .`
3. `skopos understand . --actor <id>`
4. `skopos program next . --compact --json`
5. `skopos start "<goal>" . --actor <id>`
6. `skopos next . --actor <id>`
7. `skopos trust . --actor <id> --compact`
8. `skopos ui dev . --host 127.0.0.1 --port <port>`
9. `skopos ui serve . --host 127.0.0.1 --port <port>`
10. `skopos ui render .`
11. `skopos instructions sync . --actor <id>`
12. `skopos workflows list .`
13. `skopos workflows run <workflow-id> . --actor <id>`
14. `skopos eval . --mission <mission-id> --actor <id> --phase iteration`
15. `skopos eval . --mission <mission-id> --actor <id> --phase stabilization`
16. `skopos eval . --mission <mission-id> --actor <id> --phase closure`

## Immediate Build Priorities

1. Execute P1-W11 before broader control-plane expansion: converge on one Skopos
   authority, context/actions/guards, compact task intent, phase-separated proof,
   receipts, worktree-safe state, and portable downstream-project adoption.
2. Fix proof/readiness correctness so scanner-only understanding cannot pass as agent-ready.
3. Keep Skopos core generic and project-agnostic.
4. Implement durable project modes: `brownfield`, `clean-refactor`, `greenfield-in-existing-repo`, and `new-project`.
5. Add a no-legacy cleanup policy for cleanup/refactor modes.
6. Make Skopos self-hosting use clean-refactor behavior internally while public CLI/package/schema surfaces keep compatibility discipline.
7. Make memory roles first-class so existing docs are mapped before Skopos suggests new docs.
8. Upgrade `skopos understand` into agent-led project analysis that produces reviewed project memory.
9. Make `skopos next` and related commands return practical agent prompt briefs.
10. Show project mode, memory readiness, open assumptions, findings, cleanup obligations, current lane, and next action in the UI.
11. Prove the full flow through new-project, brownfield-preserve, clean-refactor, and Skopos-on-Skopos pilots.
12. Use instruction mirror sync rather than hand-editing tool-specific instruction files.
13. Run Skopos against the Skopos subtree itself through Skopos-native plan, mission, workflow, trust, and finding state.
14. Use `skopos start` to route self-hosted feature and proof-phase batch execution, including linked slice missions when the generated mission proves too broad.
15. Keep the first program-router slice stable while discussion-memory inputs and routed UI adoption land on top of it.
16. Turn structural friction into findings or benchmark gaps.
17. Build policy-pack and stack-intelligence work from real schemas, proof fixtures, accepted decisions, and drift gates rather than placeholder pack content.
18. Keep docs concise and archive-aware from day one.
