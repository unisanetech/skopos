import type { AgentLogoName } from "@/features/homepage/components/agent-logo";

export type SupportState = "Verified" | "Beta" | "Manual workflow" | "Not supported";

export type SupportedHost = {
  id: AgentLogoName;
  name: string;
  shortName: string;
  headlineState: SupportState;
  summary: string;
  proofDate: string;
  proofLabel: string;
  proofHref: string;
  setupHref: string;
};

export type CapabilitySupport = {
  state: SupportState;
  detail: string;
};

export type AgentCapability = {
  id: string;
  label: string;
  description: string;
  support: Record<AgentLogoName, CapabilitySupport>;
};

export const supportStateDescriptions: Record<SupportState, string> = {
  Verified: "Shipped and backed by current proof for the behavior described.",
  Beta: "Implemented, with limited real-host coverage or a narrower automation boundary.",
  "Manual workflow": "Usable through explicit Skopos commands or a reviewed copy-and-paste handoff.",
  "Not supported": "No native host automation for this capability today.",
};

export const supportedHosts = [
  {
    id: "codex",
    name: "OpenAI Codex",
    shortName: "Codex",
    headlineState: "Verified",
    summary:
      "The deepest integration today: real child-Task delivery, returned-thread Session binding, reviewer continuity, and a recorded fresh-session cohort.",
    proofDate: "2026-08-11",
    proofLabel: "Codex continuation proof",
    proofHref:
      "https://github.com/Croodo/skopos/blob/main/docs/operations/fresh-session-continuation-metric.md",
    setupHref: "/docs",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    shortName: "Claude Code",
    headlineState: "Beta",
    summary:
      "A generated native hook adapter covers Session start, prompts, edits, pre-compaction, and stop checks. Automated child delivery is not claimed as Codex-equivalent.",
    proofDate: "2026-08-05",
    proofLabel: "Native-hook scope and limits",
    proofHref:
      "https://github.com/Croodo/skopos/blob/main/docs/decisions/005-tool-native-enforcement-strategy.md",
    setupHref: "/docs",
  },
  {
    id: "cursor",
    name: "Cursor",
    shortName: "Cursor",
    headlineState: "Manual workflow",
    summary:
      "Skopos keeps Cursor aligned through a generated project-instruction mirror and the portable CLI workflow. Native lifecycle automation is not claimed.",
    proofDate: "2026-08-05",
    proofLabel: "Manual-host contract",
    proofHref:
      "https://github.com/Croodo/skopos/blob/main/docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
    setupHref: "/docs",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    shortName: "Copilot",
    headlineState: "Manual workflow",
    summary:
      "A generated repository instruction file carries the project contract. Sessions, handoffs, and closure checks remain explicit CLI steps.",
    proofDate: "2026-08-05",
    proofLabel: "Manual-host contract",
    proofHref:
      "https://github.com/Croodo/skopos/blob/main/docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
    setupHref: "/docs",
  },
] as const satisfies readonly SupportedHost[];

export const agentCapabilities = [
  {
    id: "instructions",
    label: "Project instruction adapter",
    description: "The agent receives the repository's canonical operating contract.",
    support: {
      codex: { state: "Verified", detail: "Canonical AGENTS.md" },
      "claude-code": { state: "Verified", detail: "Generated CLAUDE.md" },
      cursor: { state: "Verified", detail: "Generated Cursor rule" },
      "github-copilot": { state: "Verified", detail: "Generated Copilot instructions" },
    },
  },
  {
    id: "session-context",
    label: "Session context delivery",
    description: "Current work and relevant project truth are loaded when a Session starts.",
    support: {
      codex: { state: "Verified", detail: "Wrapper-mediated" },
      "claude-code": { state: "Beta", detail: "Native SessionStart hook" },
      cursor: { state: "Manual workflow", detail: "Run session context" },
      "github-copilot": { state: "Manual workflow", detail: "Run session context" },
    },
  },
  {
    id: "fresh-handoff",
    label: "Fresh-Session handoff",
    description: "A bounded, current handoff can move active work into a genuinely fresh Session.",
    support: {
      codex: { state: "Verified", detail: "Host task API delivery" },
      "claude-code": { state: "Beta", detail: "Interactive launch" },
      cursor: { state: "Manual workflow", detail: "Reviewed prompt copy" },
      "github-copilot": { state: "Manual workflow", detail: "Reviewed prompt copy" },
    },
  },
  {
    id: "child-task-delivery",
    label: "Child-Task delivery",
    description: "Approved bounded work is created in a separate host Task with its assignment intact.",
    support: {
      codex: { state: "Verified", detail: "Create, inject, bind, wait" },
      "claude-code": { state: "Manual workflow", detail: "Copy exact assignment" },
      cursor: { state: "Manual workflow", detail: "Copy exact assignment" },
      "github-copilot": { state: "Manual workflow", detail: "Copy exact assignment" },
    },
  },
  {
    id: "origin-reviewer",
    label: "Origin reviewer continuity",
    description: "The conversation that split the work stays responsible for reviewing the result.",
    support: {
      codex: { state: "Verified", detail: "Result returns to origin" },
      "claude-code": { state: "Manual workflow", detail: "Review from Task state" },
      cursor: { state: "Manual workflow", detail: "Review from Task state" },
      "github-copilot": { state: "Manual workflow", detail: "Review from Task state" },
    },
  },
  {
    id: "pre-compaction",
    label: "Pre-compaction support",
    description: "The host can refresh a semantic Task handoff before conversation compaction.",
    support: {
      codex: { state: "Beta", detail: "Wrapper event available" },
      "claude-code": { state: "Beta", detail: "Native PreCompact hook" },
      cursor: { state: "Not supported", detail: "Use a manual checkpoint" },
      "github-copilot": { state: "Not supported", detail: "Use a manual checkpoint" },
    },
  },
  {
    id: "completion-hook",
    label: "Completion hook support",
    description: "The host can report completion and check close Readiness at its lifecycle boundary.",
    support: {
      codex: { state: "Beta", detail: "Wrapper stop event" },
      "claude-code": { state: "Beta", detail: "Native Stop hook" },
      cursor: { state: "Not supported", detail: "Run readiness manually" },
      "github-copilot": { state: "Not supported", detail: "Run readiness manually" },
    },
  },
  {
    id: "coordination",
    label: "Coordination mediation",
    description: "Claims, ownership, and child results stay connected to the shared Task authority.",
    support: {
      codex: { state: "Verified", detail: "Host delivery + Skopos authority" },
      "claude-code": { state: "Beta", detail: "Hooks + Skopos authority" },
      cursor: { state: "Manual workflow", detail: "CLI + Skopos authority" },
      "github-copilot": { state: "Manual workflow", detail: "CLI + Skopos authority" },
    },
  },
] as const satisfies readonly AgentCapability[];

export const agentSupportCopy = {
  title: "One project memory. Honest support for the agents you use.",
  description:
    "Skopos keeps the project model portable. What changes by host is how much of the workflow can happen automatically. This page shows that difference plainly.",
  summary: ["One repository-owned truth", "Different integration depths", "A safe manual path everywhere"],
} as const;
