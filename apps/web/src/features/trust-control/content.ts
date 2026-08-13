export const trustControlCopy = {
  title: "Project truth stays with the project.",
  description:
    "Skopos keeps durable knowledge in tracked, human-readable sources; compiles local working state separately; and explains approvals, checks, proof, and coordination limits instead of hiding them behind an agent summary.",
  summary: ["Tracked and reviewable", "Approval before material change", "Readiness with reasons"],
  trackedTruth: [
    { path: "docs/architecture/", label: "How the system is shaped" },
    { path: "docs/decisions/", label: "Why durable choices were made" },
    { path: "tools/skopos/", label: "Project-approved Actions and Guards" },
    { path: "AGENTS.md", label: "Canonical agent operating contract" },
  ],
  localState: [
    { path: ".skopos/index/", label: "Rebuildable project projections" },
    { path: ".skopos/cache/", label: "Generated host adapters and caches" },
    { path: ".skopos/coordination.sqlite", label: "Live claims and Session state" },
    { path: ".skopos/runs/", label: "Action output and Evidence envelopes" },
  ],
  lifecycle: [
    {
      number: "01",
      label: "Understand",
      title: "Learn the project before changing it.",
      description:
        "Skopos inventories the repository and gives the coding agent a bounded brief for understanding current code, documentation, commands, and project truth.",
      review: "Observed facts stay separate from assumptions.",
    },
    {
      number: "02",
      label: "Review",
      title: "Approve one coherent setup plan.",
      description:
        "Skopos groups Memory, Scope, checks, rules, Skills, instructions, and host context into one review. Material changes wait for an explicit decision.",
      review: "Accept, edit, defer, or reject each recommendation.",
    },
    {
      number: "03",
      label: "Work",
      title: "Keep intent and proof attached.",
      description:
        "Skopos records Task state, decisions, claims, Actions, and Evidence. The coding agent still owns reasoning, implementation, and human-authored documentation changes.",
      review: "Sensitive Actions can require approval.",
    },
    {
      number: "04",
      label: "Close",
      title: "Review durable impact before finishing.",
      description:
        "A Task closes only after its acceptance has fresh proof and its Memory impact is explicitly resolved as updated or reviewed with no change.",
      review: "No silent documentation rewrite.",
    },
  ],
  controls: [
    {
      label: "Instructions",
      kind: "Advisory",
      description: "Tell a participating agent how the project expects work to happen.",
    },
    {
      label: "Guards",
      kind: "Deterministic",
      description: "Require, prohibit, or demand approval and proof for a transition.",
    },
    {
      label: "Actions",
      kind: "Governed execution",
      description: "Expose exact project commands and integrations with declared inputs, effects, and safety.",
    },
    {
      label: "Readiness",
      kind: "Explainable result",
      description: "Reports ready, needs review, or blocked—with the exact reason and next safe step.",
    },
  ],
  capabilities: [
    {
      icon: "folder_open",
      label: "Local files",
      description: "Current core state lives with the repository through the CLI and MCP runtime.",
    },
    {
      icon: "language",
      label: "Network and browsers",
      description: "An Action must declare these capabilities, and unavailable hosts stop before execution.",
    },
    {
      icon: "key",
      label: "Secrets",
      description: "Required secret names take part in preflight. Secret values never enter Action runs or Evidence.",
    },
    {
      icon: "cloud_sync",
      label: "External services",
      description: "Mutations require declared external effects and a provider receipt. The receipt is not a universal sandbox or rollback guarantee.",
    },
  ],
  limits: [
    "Skopos does not replace the coding agent or make implementation decisions for it.",
    "Advisory instructions are not hard security boundaries.",
    "Cooperative claims cannot prevent an unmediated process from writing files.",
    "A passing Task does not automatically prove project integration or release readiness.",
    "Local .skopos data can contain project paths, snippets, prompts, screenshots, and receipts; keep it out of source control and do not upload it wholesale.",
  ],
} as const;
