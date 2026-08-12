export type CustomizeGuideSlug =
  | "connect-tools"
  | "project-rules"
  | "expert-guidance"
  | "coding-agents"
  | "external-services";

export interface CustomizeGuide {
  slug: CustomizeGuideSlug;
  number: string;
  label: string;
  title: string;
  description: string;
  promise: string;
  prompt: string;
  steps: readonly { title: string; description: string }[];
  examples: readonly string[];
  terms: readonly { term: string; meaning: string }[];
  boundary: string;
  next: { label: string; href: string };
}

export const customizeGuides: readonly CustomizeGuide[] = [
  {
    slug: "connect-tools",
    number: "01",
    label: "Connect your tools",
    title: "Use the commands your project already trusts.",
    description:
      "Show Skopos how your project tests, builds, generates, previews, and verifies work so coding agents do not have to guess.",
    promise: "Your existing workflow becomes available to agents without becoming automatic or unrestricted.",
    prompt:
      "Inspect this repository for working test, typecheck, build, browser, generation, and validation commands. Show me which ones could become Skopos project capabilities, what each command reads or changes, and which Tasks should require it. Do not activate anything until I review the proposal.",
    steps: [
      { title: "Discover", description: "Skopos finds configured commands and package scripts as local candidates." },
      { title: "Review", description: "You inspect the exact command, working directory, effects, applicability, and required approval." },
      { title: "Activate", description: "An approved declaration becomes a project capability only after its provider validates." },
    ],
    examples: ["Typecheck the affected package", "Run checkout recovery tests", "Generate an API client", "Capture a browser accessibility check"],
    terms: [
      { term: "Capability", meaning: "Something the project knows how to do safely." },
      { term: "Action", meaning: "The exact approved operation that performs it." },
      { term: "Evidence", meaning: "The source-bound result produced by a successful run." },
    ],
    boundary: "A discovered command is only a proposal. It cannot run, satisfy a rule, or count as proof until the reviewed Action and its provider are active.",
    next: { label: "Set the rules around those tools", href: "/docs/customize/project-rules" },
  },
  {
    slug: "project-rules",
    number: "02",
    label: "Set project rules",
    title: "Make important checks hard to forget.",
    description:
      "Describe which checks apply, what agents may change, and when work must stop for approval instead of relying on every conversation to remember.",
    promise: "The project—not the current agent—decides what safe completion requires.",
    prompt:
      "Review this project's existing engineering rules and checks. Propose which rules should become deterministic Skopos Guards, which accepted standards belong in Policies, and which exact project Actions or observations can prove them. Keep advice separate from enforceable requirements.",
    steps: [
      { title: "State the rule", description: "Start with the real project expectation, such as requiring payment recovery proof after checkout changes." },
      { title: "Bind it to work", description: "Match the rule by changed paths, Scope, Task phase, risk, and dependency impact." },
      { title: "Explain the result", description: "Skopos reports why a rule and its check were selected, skipped, blocked, or approval-sensitive." },
    ],
    examples: ["Require migration checks after schema changes", "Block deployment without approval", "Require design proof for rendered UI", "Skip unrelated tests for docs-only changes"],
    terms: [
      { term: "Guard", meaning: "A deterministic decision about when an Action or proof is required, allowed, or blocked." },
      { term: "Policy", meaning: "A project-accepted standard that names the protection expected." },
      { term: "Readiness", meaning: "The explanation of whether the bounded Task has enough fresh proof to finish." },
    ],
    boundary: "Policies do not guess shell commands, and Actions do not decide their own necessity. The project owns the Guard that connects a standard to its real provider.",
    next: { label: "Add specialist guidance", href: "/docs/customize/expert-guidance" },
  },
  {
    slug: "expert-guidance",
    number: "03",
    label: "Add expert guidance",
    title: "Give agents specialist help only when it fits the Task.",
    description:
      "Add focused guidance for design, architecture, security, or another domain without turning every prompt into a giant permanent instruction file.",
    promise: "The agent receives relevant expertise while your project remains the higher authority.",
    prompt:
      "Review the Skills available to this project. Recommend only the guidance that matches the current Scope and Task, explain what project context it needs, and show any missing Actions or Guards as gaps. Do not accept or bind a Skill automatically.",
    steps: [
      { title: "Recommend", description: "Skopos compares versioned Skill packs with observable project and Task needs." },
      { title: "Accept and bind", description: "A user explicitly reviews the pack, version, project binding, and reason before adoption." },
      { title: "Select narrowly", description: "Only applicable modules enter the current Task context within a controlled budget." },
    ],
    examples: ["Product interface structure and behavior", "Accessibility review guidance", "Architecture-specific review criteria", "Domain-aware implementation practices"],
    terms: [
      { term: "Skill", meaning: "Versioned expert guidance selected for a relevant Task." },
      { term: "Binding", meaning: "The reviewed relationship between a Skill and this project." },
      { term: "Task context", meaning: "The bounded project truth and guidance supplied for the current work." },
    ],
    boundary: "A Skill helps the agent reason. It cannot create or finish Tasks, bypass Guards, run undeclared operations, or replace project components, conventions, and decisions.",
    next: { label: "Connect a coding agent", href: "/docs/customize/coding-agents" },
  },
  {
    slug: "coding-agents",
    number: "04",
    label: "Connect coding agents",
    title: "Keep one project truth across different agent hosts.",
    description:
      "Connect Codex, Claude Code, or a manual workflow to the same Project Memory, Task lifecycle, and completion rules.",
    promise: "Changing agents or starting a fresh conversation does not reset the project.",
    prompt:
      "Set up this coding-agent host to load compact Skopos Session context at the start of work. Show me which context, handoff, child-Task, compaction, and completion capabilities the host can actually provide, and use the documented manual fallback for anything unsupported.",
    steps: [
      { title: "Load context", description: "The host receives a compact view of relevant Memory, current work, questions, and next safe action." },
      { title: "Project the lifecycle", description: "Host-native features may open Sessions, deliver child work, or return completion without inventing new Task semantics." },
      { title: "Fall back honestly", description: "Unsupported automation returns an exact reviewed prompt or command instead of pretending delivery happened." },
    ],
    examples: ["Start a fresh Codex Task with bounded work", "Resume after conversation compaction", "Use Claude Code hooks for context", "Copy a reviewed assignment into another host"],
    terms: [
      { term: "Host adapter", meaning: "A bridge that projects the Skopos lifecycle into a coding-agent environment." },
      { term: "MCP", meaning: "Structured access to the same Skopos runtime authorities used by the CLI." },
      { term: "Session", meaning: "One participant's recoverable view and role in the current project work." },
    ],
    boundary: "A host adapter never creates a separate work model. Support must be described capability by capability, and generated assignments are not reported as delivered unless the host operation succeeds.",
    next: { label: "Review supported coding agents", href: "/agents" },
  },
  {
    slug: "external-services",
    number: "05",
    label: "Connect external services",
    title: "Use outside services without giving agents a blank check.",
    description:
      "Represent an approved provider operation as a governed project Action with explicit network, secret, service, approval, and effect boundaries.",
    promise: "External operations stay attributable, reviewable, and attached to the work that required them.",
    prompt:
      "Help me model this external service operation as a Skopos Action. Declare the exact service and operation, required network and secret capabilities, expected external effect, approval rule, safe inputs, and normalized provider receipt. Do not claim Skopos can reverse or sandbox effects the provider controls.",
    steps: [
      { title: "Declare access", description: "Name the required service, tool, network, browser, secret, and approval capabilities explicitly." },
      { title: "Run within the boundary", description: "Skopos preflights the declared capability and refuses unavailable or unapproved execution." },
      { title: "Keep the receipt", description: "A successful provider response is normalized and linked to the Task as external-effect Evidence." },
    ],
    examples: ["Create a deployment preview", "Run a remote compatibility check", "Request an approved provider operation", "Call a project-owned internal service"],
    terms: [
      { term: "External effect", meaning: "A declared change outside the local repository." },
      { term: "Provider receipt", meaning: "Allowlisted provider-reported confirmation of one operation and request." },
      { term: "Approval", meaning: "An explicit requirement that fails closed when missing." },
    ],
    boundary: "Skopos governs the declared request and records the provider response. It does not promise universal provider support, operating-system isolation, or reversal of an external mutation.",
    next: { label: "Read the trust model", href: "/trust" },
  },
] as const;

export const customizeGuideBySlug = Object.fromEntries(
  customizeGuides.map((guide) => [guide.slug, guide]),
) as Record<CustomizeGuideSlug, CustomizeGuide>;

export const checkoutCustomizeExample = [
  { label: "Remember", value: "Load the checkout architecture and earlier payment decisions." },
  { label: "Bound", value: "Limit the Task to recovery behavior and the files that own it." },
  { label: "Equip", value: "Make the approved checkout test and typecheck Actions available." },
  { label: "Require", value: "Apply the recovery and payment-safety Guards." },
  { label: "Prove", value: "Attach fresh results to the Task as Evidence." },
  { label: "Continue", value: "Keep the decision, progress, and next action for a fresh Session." },
] as const;
