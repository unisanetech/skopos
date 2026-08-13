import type { AgentLogoName } from "@/features/homepage/components/agent-logo";

export type SupportState = "Codex certified" | "Projection available" | "Manual workflow" | "Not supported";

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
  "Codex certified": "Shipped and backed by current real-host Codex proof for the behavior described.",
  "Projection available": "The adapter, hook, or instruction projection exists, but this is not a first-release real-host certification claim.",
  "Manual workflow": "Usable through explicit Skopos commands or a reviewed copy-and-paste handoff, without native host certification.",
  "Not supported": "No native host automation for this capability today.",
};

export const supportedHosts = [
  {
    id: "codex",
    name: "OpenAI Codex",
    shortName: "Codex",
    headlineState: "Codex certified",
    summary:
      "The first-release certified host: real child-Task delivery, returned-thread Session binding, reviewer continuity, and a recorded fresh-session cohort.",
    proofDate: "2026-08-11",
    proofLabel: "Codex continuation proof",
    proofHref:
      "https://github.com/unisanetech/skopos/blob/main/docs/operations/fresh-session-continuation-metric.md",
    setupHref: "/docs",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    shortName: "Claude Code",
    headlineState: "Projection available",
    summary:
      "A generated hook adapter covers Session start, prompts, edits, pre-compaction, and stop checks. Real Claude Code verification is planned, so the first release does not claim certified host behavior.",
    proofDate: "2026-08-05",
    proofLabel: "Adapter scope and limits",
    proofHref:
      "https://github.com/unisanetech/skopos/blob/main/docs/decisions/005-tool-native-enforcement-strategy.md",
    setupHref: "/docs",
  },
  {
    id: "cursor",
    name: "Cursor",
    shortName: "Cursor",
    headlineState: "Projection available",
    summary:
      "A generated project-instruction mirror is available. Session context, handoffs, and closure remain an explicit portable workflow, and real-host certification is not claimed.",
    proofDate: "2026-08-05",
    proofLabel: "Instruction projection contract",
    proofHref:
      "https://github.com/unisanetech/skopos/blob/main/docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
    setupHref: "/docs",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    shortName: "Copilot",
    headlineState: "Projection available",
    summary:
      "A generated repository instruction file carries the project contract. Sessions, handoffs, and closure remain explicit CLI steps, without a first-release real-host certification claim.",
    proofDate: "2026-08-05",
    proofLabel: "Instruction projection contract",
    proofHref:
      "https://github.com/unisanetech/skopos/blob/main/docs/decisions/026-multi-agent-discussion-memory-adapter-lifecycle-contract.md",
    setupHref: "/docs",
  },
] as const satisfies readonly SupportedHost[];

export const agentCapabilities = [
  {
    id: "instructions",
    label: "Project instruction adapter",
    description: "The agent receives the repository's canonical operating contract.",
    support: {
      codex: { state: "Codex certified", detail: "Canonical AGENTS.md" },
      "claude-code": { state: "Projection available", detail: "Generated CLAUDE.md; host proof planned" },
      cursor: { state: "Projection available", detail: "Generated Cursor rule; host proof planned" },
      "github-copilot": { state: "Projection available", detail: "Generated Copilot instructions; host proof planned" },
    },
  },
  {
    id: "session-context",
    label: "Session context delivery",
    description: "Current work and relevant project truth are loaded when a Session starts.",
    support: {
      codex: { state: "Codex certified", detail: "Wrapper-mediated" },
      "claude-code": { state: "Projection available", detail: "SessionStart hook; host proof planned" },
      cursor: { state: "Manual workflow", detail: "Run session context" },
      "github-copilot": { state: "Manual workflow", detail: "Run session context" },
    },
  },
  {
    id: "fresh-handoff",
    label: "Fresh-Session handoff",
    description: "A bounded, current handoff can move active work into a genuinely fresh Session.",
    support: {
      codex: { state: "Codex certified", detail: "Host task API delivery" },
      "claude-code": { state: "Manual workflow", detail: "Use the reviewed handoff" },
      cursor: { state: "Manual workflow", detail: "Reviewed prompt copy" },
      "github-copilot": { state: "Manual workflow", detail: "Reviewed prompt copy" },
    },
  },
  {
    id: "child-task-delivery",
    label: "Child-Task delivery",
    description: "Approved bounded work is created in a separate host Task with its assignment intact.",
    support: {
      codex: { state: "Codex certified", detail: "Create, inject, bind, wait" },
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
      codex: { state: "Codex certified", detail: "Result returns to origin" },
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
      codex: { state: "Projection available", detail: "Wrapper event available" },
      "claude-code": { state: "Projection available", detail: "PreCompact hook; host proof planned" },
      cursor: { state: "Not supported", detail: "Use a manual checkpoint" },
      "github-copilot": { state: "Not supported", detail: "Use a manual checkpoint" },
    },
  },
  {
    id: "completion-hook",
    label: "Completion hook support",
    description: "The host can report completion and check close Readiness at its lifecycle boundary.",
    support: {
      codex: { state: "Projection available", detail: "Wrapper stop event" },
      "claude-code": { state: "Projection available", detail: "Stop hook; host proof planned" },
      cursor: { state: "Not supported", detail: "Run readiness manually" },
      "github-copilot": { state: "Not supported", detail: "Run readiness manually" },
    },
  },
  {
    id: "coordination",
    label: "Coordination mediation",
    description: "Claims, ownership, and child results stay connected to the shared Task authority.",
    support: {
      codex: { state: "Codex certified", detail: "Host delivery + Skopos authority" },
      "claude-code": { state: "Projection available", detail: "Hooks + Skopos authority; host proof planned" },
      cursor: { state: "Manual workflow", detail: "CLI + Skopos authority" },
      "github-copilot": { state: "Manual workflow", detail: "CLI + Skopos authority" },
    },
  },
] as const satisfies readonly AgentCapability[];

export const agentSupportCopy = {
  title: "Codex is certified. Your project truth stays portable.",
  description:
    "Skopos keeps the project model host-neutral. The first release certifies Codex in a real host; other adapters and instruction projections are shown without pretending their host behavior is certified.",
  summary: ["Codex certified for first release", "One repository-owned truth", "Other host verification planned"],
} as const;
