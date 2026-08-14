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
    tabLabel: "npm · 0.1.0",
    label: "Public npm install",
    commands: [
      "npm install --save-dev @unisane/skopos@0.1.0",
      "npx skopos setup . --actor <id> --json",
      "npx skopos session context . --actor <id> --json",
    ],
    copyLabel: "Copy installation commands",
  },
  agent: {
    tabLabel: "Give to your agent",
    label: "Agent setup brief",
    visibleBrief:
      "Use the public Skopos release. Follow its current setup question, ask one decision at a time, and wait before review or changes.",
    brief:
      "Set up Skopos in this repository using only the public npm release @unisane/skopos@0.1.0 from https://www.npmjs.com/package/@unisane/skopos/v/0.1.0. Do not use a local Skopos checkout, workspace link, or unpublished build. Run `npm exec --package @unisane/skopos@0.1.0 -- skopos setup . --actor <stable-id> --json`, then treat the returned `state.conversation` and generated `agentPacketPath` as the setup authority. If the mode is `ask-and-wait` or the stage is `questions-open`, ask exactly `currentQuestion`, explain its recommended default and alternatives in simple language, and stop for my answer. Do not infer answers, batch later questions, run broad project checks, present the consolidated plan, or request blanket approval. After each answer, record it with the returned answer command through the same pinned package launcher and refresh setup. If the mode is `inspect-and-submit`, inspect only the authorized project evidence, write the required analysis to `submissionPath`, and run `submissionCommand`; do not leave Scope or document proposals only in chat prose. Only when `finalPlanAllowed` is true and the stage is `plan-ready` should you show one consolidated review, with every recommendation independently available to accept, edit, defer, or reject. Apply only accepted recommendations, verify the required lanes, and report setup as ready only when Skopos does.",
    steps: [
      { number: "01", label: "Understand" },
      { number: "02", label: "Clarify" },
      { number: "03", label: "Review" },
      { number: "04", label: "Apply" },
      { number: "05", label: "Verify" },
    ],
    commands: [
      "npm exec --package @unisane/skopos@0.1.0 -- skopos setup . --actor <stable-id> --json",
      "Follow the returned question, submission, and continuation commands in order.",
    ],
    copyLabel: "Copy agent brief",
  },
  packageLabel: "public · @unisane/skopos@0.1.0",
} as const;

export const agentCompatibilityCopy = {
  eyebrow: "First-release host support",
  title: "Codex certified. Portable project truth everywhere else.",
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
