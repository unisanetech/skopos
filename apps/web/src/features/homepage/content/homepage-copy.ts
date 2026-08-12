export const releaseStatusCopy = "Available on npm";

export const homepageDeepLinks = {
  workflow: "/how-it-works",
  projectMemory: "/project-memory",
} as const;

export const heroCopy = {
  title: "Your agents write the code. Skopos keeps the work coherent.",
  titleLines: ["Your agents write the code.", "Skopos keeps the work coherent."],
  description:
    "Project context, intent, rules, and proof stay in the repository—so any coding agent can continue.",
} as const;

export const heroOnboarding = {
  source: {
    tabLabel: "Install with npm",
    label: "Install in your project",
    commands: [
      "npm install --save-dev @skopos/cli",
      "npx skopos init . --mode existing --actor <id>",
      "npx skopos session context . --actor <id> --json",
    ],
    copyLabel: "Copy installation commands",
  },
  agent: {
    tabLabel: "Give to your agent",
    label: "Agent setup brief",
    visibleBrief:
      "Initialize Skopos without overwriting project truth. Build understanding, assess gaps, and review the proposal before anything changes.",
    brief:
      "Install and adopt Skopos in this existing repository. Preserve its current docs and commands as project truth. Initialize Skopos, build project understanding, then assess adoption gaps. Show me any documentation proposal before applying it.",
    steps: [
      { number: "01", label: "Initialize" },
      { number: "02", label: "Understand" },
      { number: "03", label: "Assess" },
    ],
    commands: [
      "npx skopos init . --mode existing --actor <id>",
      "npx skopos understand . --actor <id> --json",
      "npx skopos adopt assess . --actor <id> --json",
    ],
    copyLabel: "Copy agent brief",
  },
  packageLabel: "npm · @skopos/cli",
} as const;

export const agentCompatibilityCopy = {
  eyebrow: "Agent-compatible",
  title: "Works with the coding agents you already use.",
  agents: [
    { name: "Codex", icon: "codex" },
    { name: "Claude Code", icon: "claude-code" },
    { name: "Cursor", icon: "cursor" },
    { name: "GitHub Copilot", icon: "github-copilot" },
  ],
} as const;

export const promiseCopy = [
  {
    id: "remember",
    number: "02",
    eyebrow: "Remember",
    title: "Continue the work, not the conversation.",
    description:
      "Skopos restores the decision, Task intent, and tracked project context so a new agent can continue precisely where the last one stopped.",
    linkLabel: "Explore Project Memory",
    linkHref: homepageDeepLinks.projectMemory,
    icon: "fact_check",
    tone: "light",
  },
  {
    id: "coordinate",
    number: "03",
    eyebrow: "Coordinate",
    title: "Use your project’s rules. Share one view of the work.",
    description:
      "Skopos exposes project-approved Actions, applies Guards, and gives cooperating Sessions one auditable view of ownership, checks, and changes.",
    supporting: "Actions do. Guards decide. Evidence proves.",
    linkLabel: "See the working loop",
    linkHref: `${homepageDeepLinks.workflow}#bound`,
    icon: "groups",
    tone: "dark",
  },
  {
    id: "prove",
    number: "04",
    eyebrow: "Prove",
    title: "Done needs evidence.",
    description:
      "Skopos checks a Task’s acceptance criteria against fresh, source-bound Evidence, then explains what still blocks closure.",
    linkLabel: "See how proof works",
    linkHref: `${homepageDeepLinks.workflow}#prove`,
    icon: "verified_user",
    tone: "light",
  },
] as const;

export const boundaryCopy = {
  eyebrow: "Boundary",
  number: "05",
  title: "The agent works. Skopos keeps the work coherent.",
  description:
    "Repository-native infrastructure that changes code, not memory—so knowledge, rules, Task intent, and proof stay with the project.",
  is: [
    "Repository-native infrastructure",
    "Code- and Scope-aware for real work",
    "Keeps knowledge, rules, and proof with the project",
  ],
  isNot: [
    "A general-purpose chat",
    "A black box that hides actions",
    "A memory silo outside your repository",
  ],
} as const;
