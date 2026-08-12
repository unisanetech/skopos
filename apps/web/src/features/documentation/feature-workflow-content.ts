export type FeatureWorkflowStageId =
  | "discuss"
  | "understand"
  | "bound"
  | "work"
  | "prove"
  | "remember"
  | "continue";

export interface FeatureWorkflowStage {
  id: FeatureWorkflowStageId;
  number: string;
  verb: string;
  title: string;
  description: string;
  prompt: string;
  commands: readonly string[];
  handles: readonly string[];
  review: readonly string[];
  result: string;
}

export const featureRequest = "Make checkout recover safely when the connection drops.";

export const featureWorkflowStages: readonly FeatureWorkflowStage[] = [
  {
    id: "discuss",
    number: "01",
    verb: "Discuss",
    title: "Start with the outcome, not a command sequence.",
    description: "Describe the behavior you want in ordinary language. Let the agent ask only the questions that change direction, risk, or public behavior.",
    prompt:
      "Make checkout recover safely when the connection drops. Before proposing code, inspect the current checkout flow and tell me what decisions, constraints, and unanswered questions materially affect the approach.",
    commands: [
      "npx skopos session context . --actor <id> --session-id <session-id> --host <host> --json",
    ],
    handles: [
      "Recovers current project and Session state",
      "Surfaces an existing Task when one already owns the outcome",
      "Keeps questions tied to meaningful product or engineering choices",
    ],
    review: [
      "Does the agent understand the user-visible outcome?",
      "Are important payment or recovery choices still assumptions?",
      "Is this one feature or several independently ownable outcomes?",
    ],
    result: "A shared understanding of the requested behavior and the decisions that still matter.",
  },
  {
    id: "understand",
    number: "02",
    verb: "Understand",
    title: "Load the project truth that applies to checkout.",
    description: "The agent should recover relevant architecture, payment decisions, conventions, active work, and known risks without loading every project document.",
    prompt:
      "Load the Project Memory relevant to checkout recovery, payment finalization, retries, and order confirmation. Separate accepted project truth from observations, inferences, and anything that still needs a decision.",
    commands: [
      "npx skopos session context . --actor <id> --session-id <session-id> --host <host> --json",
      "npx skopos knowledge . --compact --json",
    ],
    handles: [
      "Selects context by project Scope and current work",
      "Keeps canonical decisions distinct from generated state",
      "Reports missing, stale, or conflicting knowledge instead of silently guessing",
    ],
    review: [
      "Did the agent find the real checkout and payment owners?",
      "Are cited decisions still current and repository-owned?",
      "Is any critical behavior based only on chat memory or inference?",
    ],
    result: "A bounded set of current project facts the implementation can safely rely on.",
  },
  {
    id: "bound",
    number: "03",
    verb: "Bound",
    title: "Turn the outcome into one reviewable Task.",
    description: "Make success observable, name the files the Task may own, and record constraints and non-goals before edits spread across the repository.",
    prompt:
      "Create one bounded Skopos Task for checkout recovery. Propose observable acceptance criteria, the narrowest owned paths, important constraints, and explicit non-goals. Show me the boundary before implementation begins.",
    commands: [
      "npx skopos start \"Make checkout recover safely after connection loss\" . --accept \"A pending payment can resume without duplicate finalization\" --accept \"The customer sees one confirmed order\" --own <checkout-path> --own <checkout-tests-path> --constraint \"Preserve current payment provider semantics\" --non-goal \"Redesign checkout pricing or tax behavior\" --actor <id> --json",
      "npx skopos task show <task-id> . --json",
    ],
    handles: [
      "Recommends proportional Task risk and detail",
      "Binds acceptance, ownership, constraints, and non-goals",
      "Shows changed paths outside ownership instead of absorbing them silently",
    ],
    review: [
      "Can each acceptance criterion be observed or proven?",
      "Are the owned paths narrow enough to protect parallel work?",
      "Do the non-goals prevent an accidental checkout redesign?",
    ],
    result: "One admitted Task with a clear success condition and an explicit change boundary.",
  },
  {
    id: "work",
    number: "04",
    verb: "Work",
    title: "Let the agent implement inside the project boundary.",
    description: "The coding agent owns reasoning and code changes. Skopos keeps the Task intent stable and makes the project-approved tools available when they apply.",
    prompt:
      "Implement the bounded checkout-recovery Task. Preserve its acceptance criteria and non-goals. Before running a project command, explain why it applies to the changed paths and use the approved Skopos Action when one exists.",
    commands: [
      "npx skopos task show <task-id> . --json",
      "npx skopos impact <changed-path> --phase iteration --risk standard --why",
      "npx skopos actions list . --json",
      "npx skopos actions run <action-id> . --task <task-id> --actor <id> --json",
    ],
    handles: [
      "Explains which Guards and Actions match the current impact",
      "Reuses valid source-bound Action Evidence when inputs are unchanged",
      "Keeps project commands, effects, approvals, and concurrency explicit",
    ],
    review: [
      "Do the edits stay inside the accepted outcome and ownership boundary?",
      "Did the agent preserve existing payment-provider behavior?",
      "Are project commands selected for a stated reason rather than run as a blanket checklist?",
    ],
    result: "A focused implementation whose operations remain attributable to the bounded Task.",
  },
  {
    id: "prove",
    number: "05",
    verb: "Prove",
    title: "Attach fresh proof to what the Task promised.",
    description: "Run the checks your project requires, link their Evidence to this Task, and inspect closure coverage without treating a passing build as proof of every acceptance criterion.",
    prompt:
      "Prepare this Task for closure. Run only the required project Actions, connect each result to the acceptance criterion or Guard it proves, and explain every remaining blocker. Do not call the feature done because one general check passed.",
    commands: [
      "npx skopos impact <changed-path> --phase closure --risk standard --why",
      "npx skopos actions run <required-action-id> . --task <task-id> --actor <id> --json",
      "npx skopos evidence record-observation <task-id> . --requirement <requirement-id> --statement \"<observed acceptance fact>\" --actor <id> --json",
      "npx skopos verify <task-id> . --phase closure --json",
    ],
    handles: [
      "Binds Action results to source, configuration, command, and Task",
      "Checks acceptance coverage and required Guard Evidence",
      "Rejects missing, stale, failed, or mismatched proof",
    ],
    review: [
      "Does every acceptance criterion have relevant Evidence?",
      "Were recovery and duplicate-finalization paths actually checked?",
      "Does Readiness describe blockers honestly rather than summarize optimistically?",
    ],
    result: "An explainable closure report showing exactly what passed and what still blocks completion.",
  },
  {
    id: "remember",
    number: "06",
    verb: "Remember",
    title: "Review what the project should remember before finishing.",
    description: "If the feature changed durable project truth, update its canonical owner. If it did not, record that the Memory impact was reviewed rather than silently skipping it.",
    prompt:
      "Review the completed checkout-recovery work for durable project impact. Tell me which architecture, decision, pattern, or operational documentation should change. Update only the canonical owner, or record reviewed-no-change with a concrete reason.",
    commands: [
      "npx skopos task show <task-id> . --json",
      "npx skopos task memory resolve <task-id> <obligation-id> --resolution memory-updated --reason \"Documented the accepted recovery behavior\" --target <canonical-doc> --actor <id> --cwd . --json",
      "npx skopos finish <task-id> . --actor <id> --json",
    ],
    handles: [
      "Creates explicit Memory-review obligations when durable truth may have changed",
      "Requires memory-updated or reviewed-no-change with attribution",
      "Finishes only after current Evidence, Task state, and Readiness all pass",
    ],
    review: [
      "Did the implementation establish a durable recovery rule or pattern?",
      "Was the canonical document updated instead of adding duplicate truth?",
      "If no change was needed, is the reviewed-no-change reason credible?",
    ],
    result: "A completed Task whose durable lessons remain available beyond the implementation conversation.",
  },
  {
    id: "continue",
    number: "07",
    verb: "Continue",
    title: "Let the next Session begin from the project, not the old chat.",
    description: "A fresh agent can load the accepted checkout decision, completed work, current repository state, and the next recommended work without replaying the conversation.",
    prompt:
      "Load the latest Skopos project and Session context. Explain what changed in checkout recovery, what Evidence closed the work, what durable project truth was updated, and the next safe Task. Do not rely on the previous conversation.",
    commands: [
      "npx skopos session context . --actor <next-agent-id> --session-id <new-session-id> --host <host> --json",
      "npx skopos work next . --actor <next-agent-id> --json",
    ],
    handles: [
      "Reconstructs tracked Task history and current Project Memory",
      "Provides compact relevant context instead of a transcript dump",
      "Keeps host automation separate from the canonical project lifecycle",
    ],
    review: [
      "Can the fresh agent explain the accepted recovery behavior correctly?",
      "Can it distinguish completed work from the next Task?",
      "Is it using current repository truth rather than an old handoff or chat summary?",
    ],
    result: "A project that remains understandable and actionable after the original conversation ends.",
  },
] as const;

export const featureWorkflowOutcome = [
  "Interrupted checkout resumes through one recovery path",
  "Payment finalization remains idempotent",
  "The customer receives one confirmed order",
  "Fresh project checks cover the new behavior",
  "The accepted recovery rule remains in Project Memory",
] as const;
