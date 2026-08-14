import { publicSetup, publicSetupPrompts, publicSkoposCommand } from "../../lib/public-setup";

export const docsLandingCopy = {
  title: "Set up Skopos once. Then talk to your coding agent normally.",
  description:
    "Start with a conversation, use commands when you need precision, and inspect every important decision before it becomes project truth.",
  summary: ["Choose how you are starting", "Prompt by outcome", "Use commands for precision"],
  startRoutes: [
    {
      number: "01",
      title: "Add Skopos to an existing project",
      description: "Preserve current code, docs, commands, and conventions before proposing a clearer Project Memory structure.",
      href: "/docs/quickstart#existing-project",
      action: "Start carefully",
    },
    {
      number: "02",
      title: "Start a new project",
      description: "Create a clean repository-owned foundation for purpose, Scope, decisions, work, and project checks.",
      href: "/docs/quickstart#new-project",
      action: "Start clean",
    },
    {
      number: "03",
      title: "Continue current work",
      description: "Recover the active Task, relevant project knowledge, remaining checks, and the next safe action.",
      href: "/docs/quickstart#continue-work",
      action: "Continue work",
    },
    {
      number: "04",
      title: "Understand the product model",
      description: "See how discussion, Project Memory, bounded work, Actions, Evidence, and Readiness form one loop.",
      href: "/how-it-works",
      action: "Follow the loop",
    },
  ],
  workflows: [
    { title: "Ask questions about the project", href: "/use-cases#return-after-time-away", icon: "question_answer" },
    { title: "Plan and build a feature", href: "/docs/workflows/plan-and-finish-feature", icon: "edit_note" },
    { title: "Continue in a fresh Session", href: "/docs/workflows/continue-fresh-session", icon: "move_up" },
    { title: "Split independent work", href: "/use-cases#split-independent-work", icon: "account_tree" },
    { title: "Verify and finish work", href: "/use-cases#require-project-checks", icon: "fact_check" },
    { title: "Keep Project Memory current", href: "/use-cases#keep-memory-current", icon: "history_edu" },
  ],
  library: [
    {
      label: "Start",
      description: "Installation, guided setup, host context, and first verification.",
      links: [
        { label: "Quickstart", href: "/docs/quickstart" },
        { label: "Work with your coding agent", href: "/docs/work-with-your-agent" },
        { label: "Plan and finish a feature", href: "/docs/workflows/plan-and-finish-feature" },
        { label: "Continue in a fresh Session", href: "/docs/workflows/continue-fresh-session" },
        { label: "Existing project", href: "/docs/quickstart#existing-project" },
        { label: "New project", href: "/docs/quickstart#new-project" },
        { label: "Agent support status", href: "/agents" },
      ],
    },
    {
      label: "Concepts",
      description: "Understand why the product behaves this way.",
      links: [
        { label: "Project Memory", href: "/project-memory" },
        { label: "The complete loop", href: "/how-it-works" },
        { label: "Actions, Guards, and proof", href: "/trust" },
        { label: "Canonical architecture", href: "https://github.com/unisanetech/skopos/blob/main/docs/architecture/00-architecture.md" },
      ],
    },
    {
      label: "Configure",
      description: "Connect the tools, rules, expertise, and agent environments your project already uses.",
      links: [
        { label: "Customize Skopos", href: "/docs/customize" },
        { label: "Connect project tools", href: "/docs/customize/connect-tools" },
        { label: "Set project rules", href: "/docs/customize/project-rules" },
        { label: "Add expert guidance", href: "/docs/customize/expert-guidance" },
        { label: "Connect agents and services", href: "/docs/customize/coding-agents" },
      ],
    },
    {
      label: "Reference",
      description: "Use the canonical source when exact commands and contracts matter.",
      links: [
        { label: "Developer workflows", href: "https://github.com/unisanetech/skopos/blob/main/docs/guides/developer-workflows.md" },
        { label: "CLI source and help", href: "https://github.com/unisanetech/skopos/tree/main/packages/cli" },
        { label: "Artifact model", href: "https://github.com/unisanetech/skopos/blob/main/docs/architecture/artifact-model.md" },
        { label: "Start-here router", href: "https://github.com/unisanetech/skopos/blob/main/docs/00-start-here.md" },
      ],
    },
    {
      label: "Help",
      description: "Recover safely when setup, work, checks, or coordination do not behave as expected.",
      links: [
        { label: "Storage and privacy", href: "https://github.com/unisanetech/skopos/blob/main/docs/guides/storage-and-privacy.md" },
        { label: "Developer workflows", href: "https://github.com/unisanetech/skopos/blob/main/docs/guides/developer-workflows.md" },
        { label: "Security policy", href: "https://github.com/unisanetech/skopos/blob/main/SECURITY.md" },
        { label: "Open an issue", href: "https://github.com/unisanetech/skopos/issues" },
      ],
    },
  ],
} as const;

export const quickstartModes = {
  existing: {
    id: "existing-project",
    tabLabel: "Existing project",
    title: "Bring the project you already have.",
    description: "Skopos first learns the repository boundary and preserves current truth. Material documentation changes stay inside one review before anything is applied.",
    prompt: publicSetupPrompts.existing,
    commands: [publicSetup.command],
    review: [
      "The repository root and inferred project boundary",
      "Generated project instructions, config, and ignore rules, plus any docs-router change proposed for your approval",
      "Observed facts versus assumptions and contradictions",
      "Any proposed material documentation change before approval",
    ],
  },
  greenfield: {
    id: "new-project",
    tabLabel: "New project",
    title: "Start with project truth from day one.",
    description: "Skopos can establish the initial repository-owned structure because there is less existing truth to reconcile.",
    prompt: publicSetupPrompts.newProject,
    commands: [publicSetup.command],
    review: [
      "The project purpose and initial repository boundary",
      "The first Scopes and their Memory roots",
      "The commands and checks the project will treat as authoritative",
      "Generated tracked files before the first commit",
    ],
  },
} as const;

export const continueWorkPrompt =
  "Continue the current Skopos Task. Load the latest intent, decisions, relevant Project Memory, remaining checks, and handoff. Before editing, tell me what is already done, what remains, and the next safe action.";

export const continueWorkCommands = [
  publicSkoposCommand("session context . --actor <stable-id> --json"),
  publicSkoposCommand("work next . --actor <stable-id> --json"),
] as const;

export const quickstartDoneWhen = [
  "The generated tracked files match the repository you intend to govern.",
  "Local .skopos/** state is excluded from source control.",
  "Setup reports either setup-ready status or one specific question, recommendation, or verification step.",
  "Your coding agent can explain the current project boundary and next safe action without replaying the setup conversation.",
] as const;

export const quickstartProblems = [
  {
    title: "Skopos selected the wrong boundary",
    recovery: "Stop and rerun from the actual repository root. A nested package should be a separate Skopos project only when it has its own explicit configuration and Memory root.",
  },
  {
    title: "Existing documentation conflicts",
    recovery: "Do not overwrite it. Run setup review, compare the conflicting sources, and approve only the exact material changes you want.",
  },
  {
    title: "The host did not load context automatically",
    recovery: "Run session context manually and give its compact result to the agent. Host automation depth is documented separately from core support.",
  },
  {
    title: "The CLI is not available globally",
    recovery: "Use npm exec with @unisane/skopos@latest, as shown in this guide.",
  },
] as const;
