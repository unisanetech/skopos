import { publicSetup, publicSetupPrompts } from "../../../lib/public-setup";

export const releaseStatusCopy = "Available on npm";

export const homepageDeepLinks = {
  workflow: "/how-it-works",
  projectMemory: "/project-memory",
} as const;

export const heroCopy = {
  title: "Your agents write the code. Skopos keeps the work coherent.",
  titleLines: ["Your agents write the code.", "Skopos keeps the work coherent."],
  description:
    "Project context, intent, rules, and proof stay in the repository—so work can continue without depending on one coding agent or conversation.",
} as const;

export const heroOnboarding = {
  source: {
    tabLabel: "npm · latest",
    label: "npm install",
    commands: [
      "npm install --save-dev @unisane/skopos@latest",
      "npx skopos setup . --actor <id> --json",
      "npx skopos session context . --actor <id> --json",
    ],
    copyLabel: "Copy installation commands",
  },
  agent: {
    tabLabel: "Give to your agent",
    label: "Agent setup brief",
    visibleBrief:
      "Set up Skopos from the npm package @unisane/skopos@latest. Follow Skopos’s guidance one decision at a time, and stop whenever it asks for my input.",
    brief: publicSetupPrompts.generic,
    steps: [
      { number: "01", label: "Understand" },
      { number: "02", label: "Clarify" },
      { number: "03", label: "Review" },
      { number: "04", label: "Apply" },
      { number: "05", label: "Verify" },
    ],
    commands: [
      publicSetup.command,
      "Follow the returned setup guidance in order.",
    ],
    copyLabel: "Copy agent brief",
  },
  packageLabel: "npm · @unisane/skopos@latest",
} as const;

export const agentCompatibilityCopy = {
  eyebrow: "Coding agents",
  title: "Give every coding agent the same project context.",
  agents: [
    { name: "Codex", icon: "codex", status: "Certified" },
    { name: "Claude Code", icon: "claude-code", status: "Adapter available · verification planned" },
    { name: "Cursor", icon: "cursor", status: "Instructions available · manual workflow" },
    { name: "GitHub Copilot", icon: "github-copilot", status: "Instructions available · manual workflow" },
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
