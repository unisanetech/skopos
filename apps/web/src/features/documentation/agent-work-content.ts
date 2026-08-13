export type AgentWorkItem = {
  number: string;
  title: string;
  description: string;
  prompt: string;
  handles: string;
  href: string;
  action: string;
};

export const agentWorkItems: readonly AgentWorkItem[] = [
  {
    number: "01",
    title: "Ask what is happening in the project",
    description: "Return after time away without replaying old conversations or loading the whole repository.",
    prompt: "Bring me up to speed. Show active work, material decisions, recent proof, and the next safe action.",
    handles: "Skopos selects the current Task and the Project Memory relevant to it.",
    href: "/use-cases#return-after-time-away",
    action: "See the return workflow",
  },
  {
    number: "02",
    title: "Plan and build one feature",
    description: "Carry one outcome from the first discussion through bounded implementation, proof, and Memory review.",
    prompt: "Help me build this feature. Recover relevant project truth, clarify meaningful decisions, and bound the work before editing.",
    handles: "Skopos keeps intent, ownership, checks, Evidence, and closure connected.",
    href: "/docs/workflows/plan-and-finish-feature",
    action: "Follow the complete feature guide",
  },
  {
    number: "03",
    title: "Record a decision that should last",
    description: "Keep a product or architecture choice available after the conversation ends.",
    prompt: "Record this accepted decision in its canonical project owner. Keep the reasoning and consequences, and do not duplicate existing truth.",
    handles: "Skopos distinguishes durable Project Memory from temporary Task state and agent inference.",
    href: "/docs/workflows/plan-and-finish-feature#understand",
    action: "See how project truth is used",
  },
  {
    number: "04",
    title: "Start work with a real boundary",
    description: "Turn an agreed outcome into observable acceptance, owned paths, constraints, and non-goals.",
    prompt: "Create one bounded Task. Show me its acceptance criteria, narrowest owned paths, constraints, and non-goals before implementation.",
    handles: "Skopos protects the Task boundary and reports work that falls outside it.",
    href: "/docs/workflows/plan-and-finish-feature#bound",
    action: "See a bounded Task",
  },
  {
    number: "05",
    title: "Continue in a fresh Session",
    description: "Move current work into a clean coding-agent conversation without pretending the handoff was delivered.",
    prompt: "Prepare this active Task for a fresh Session. Preserve current intent and live project state, then show me the exact handoff before delivery.",
    handles: "Skopos verifies, renders, delivers or exposes a manual fallback, then binds the receiving Session.",
    href: "/docs/workflows/continue-fresh-session",
    action: "Follow the fresh-Session guide",
  },
  {
    number: "06",
    title: "Split genuinely independent work",
    description: "Give separate agents explicit child outcomes while the original conversation remains the reviewer.",
    prompt: "Split only independent parts. Give each child acceptance and owned paths, and keep this conversation responsible for combined review.",
    handles: "Skopos coordinates child authority, path claims, dependencies, and parent closure.",
    href: "/use-cases#split-independent-work",
    action: "See the coordination workflow",
  },
  {
    number: "07",
    title: "Prove the work before calling it done",
    description: "Select the checks that match the changed paths and connect fresh Evidence to each promise.",
    prompt: "Prepare this Task for closure. Run the required project checks and explain every missing, stale, or failed piece of Evidence.",
    handles: "Skopos attaches proof to source and reports Readiness without optimistic guessing.",
    href: "/docs/workflows/plan-and-finish-feature#prove",
    action: "See proof and Readiness",
  },
  {
    number: "08",
    title: "Keep Project Memory current",
    description: "Review durable impact before finishing so the next agent learns the accepted result, not the old plan.",
    prompt: "Review whether this work changed architecture, decisions, patterns, or operating rules. Update only the canonical owner when needed.",
    handles: "Skopos requires an attributed Memory review before Task closure.",
    href: "/docs/workflows/plan-and-finish-feature#remember",
    action: "See the Memory review",
  },
] as const;

export type FreshSessionStageId = "prepare" | "capture" | "verify" | "deliver" | "accept" | "continue";

export type FreshSessionStage = {
  id: FreshSessionStageId;
  number: string;
  verb: string;
  title: string;
  description: string;
  prompt: string;
  commands: readonly string[];
  truth: string;
};

export const freshSessionStages: readonly FreshSessionStage[] = [
  {
    id: "prepare", number: "01", verb: "Prepare", title: "Confirm that a fresh Session is the right move.",
    description: "Use a fresh Session when the current conversation is large enough to obscure the objective. A native resume keeps the same conversation and is a different operation.",
    prompt: "Review the active Task and tell me whether we should continue here, resume this same chat later, or prepare a fresh Session. Explain the reason before changing ownership.",
    commands: ["npx skopos task show <task-id> . --json", "npx skopos session context . --actor <id> --session-id <origin-session-id> --host <host> --json"],
    truth: "Nothing moves yet. The current Task and origin Session remain authoritative.",
  },
  {
    id: "capture", number: "02", verb: "Capture", title: "Preserve judgment in a bounded capsule.",
    description: "The current agent contributes user intent, constraints, progress, rejected approaches, stopping position, exclusions, and the next action. It does not dump or reinterpret the transcript.",
    prompt: "Create a bounded handoff capsule for this Task. Preserve intent, constraints, progress, rejected approaches, stopping position, exclusions, and the next action. Show it for review.",
    commands: ["npx skopos discuss handoff create . --task <task-id> --context <capsule.json> --json", "npx skopos discuss handoff show . --task <task-id> --json"],
    truth: "The capsule carries human and agent judgment; Skopos recompiles live project truth around it.",
  },
  {
    id: "verify", number: "03", verb: "Verify", title: "Check that the handoff is current and safe.",
    description: "Validate the Task, source state, Evidence, policy, selected skills, privacy, budget, and coordination state before a receiving agent sees the prompt.",
    prompt: "Verify this handoff against current project state. Stop if it is stale, conflicted, invalid, unsafe, or over budget. Then render the exact receiving prompt.",
    commands: ["npx skopos discuss handoff verify . --task <task-id> --json", "npx skopos discuss handoff render . --task <task-id> --json"],
    truth: "Rendered means ready for delivery. It does not mean a host conversation was created.",
  },
  {
    id: "deliver", number: "04", verb: "Deliver", title: "Use verified host delivery—or the exact manual fallback.",
    description: "A capable host adapter can create and inject the fresh Session. Otherwise you review and copy the rendered prompt. Delivery outcome is recorded explicitly.",
    prompt: "Deliver this verified handoff through the current host if fresh-Session creation and prompt injection are supported. Otherwise give me the exact manual prompt and say that delivery is still pending.",
    commands: ["npx skopos discuss handoff render . --task <task-id> --json", "npx skopos discuss handoff deliver . --task <task-id> --actor <id> --result <pass|fail> --origin-message <succeeded|failed|unsupported> --detail \"<delivery result>\" --destination-ref <host-session-id> --json"],
    truth: "The deliver command records the real host outcome; it must not turn an unsupported delivery into a success.",
  },
  {
    id: "accept", number: "05", verb: "Accept", title: "Bind the receiving Session to the Task.",
    description: "The receiving writer accepts the current handoff with its real host and Session identity, then loads current context before editing.",
    prompt: "Accept this handoff in the receiving Session. Load current Skopos context and tell me what is already done, what remains, and the next safe action before editing.",
    commands: ["npx skopos discuss handoff accept . --task <task-id> --actor <id> --receiving-session <id> --host <host> --json", "npx skopos session context . --actor <id> --session-id <id> --host <host> --json"],
    truth: "The receiving Session becomes the writer through the same Task authority—not through an informal chat summary.",
  },
  {
    id: "continue", number: "06", verb: "Continue", title: "Continue from live project truth.",
    description: "The fresh agent uses the accepted capsule plus current Task, Memory, policy, coordination, and Evidence state. The origin conversation is not silently deleted or archived.",
    prompt: "Continue the accepted Task from current project truth. Preserve its acceptance, ownership, constraints, and non-goals; call out anything that changed since the handoff was created.",
    commands: ["npx skopos task show <task-id> . --json", "npx skopos work next . --actor <id> --json"],
    truth: "The project remains the authority. The handoff is a controlled bridge, not a new source of truth.",
  },
] as const;

export const hostDeliveryTruth = [
  { label: "Codex", status: "Certified for first release", detail: "Real-host proof covers fresh Task creation, prompt injection, Session binding, and return to the originating reviewer." },
  { label: "Claude Code", status: "Adapter available; verification planned", detail: "Generated lifecycle hooks exist, but the first release does not claim real-host Claude Code certification." },
  { label: "Any manual host", status: "Exact fallback", detail: "Review and copy the rendered prompt, then accept it with the real receiving Session identity." },
] as const;
