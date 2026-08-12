export const projectMemoryCopy = {
  title: "The project memory your coding agents can actually work from.",
  description:
    "Skopos keeps architecture, decisions, plans, patterns, active work, and important lessons in a predictable, repository-owned structure. Each agent receives the truth relevant to the work—not the entire history of the project.",
  memoryTypes: ["Architecture", "Decisions", "Plans", "Patterns", "Active work", "Evidence"],
  memoryFiles: [
    { label: "Architecture", path: "docs/architecture/" },
    { label: "Decisions", path: "docs/decisions/" },
    { label: "Current Task", path: "docs/work/tasks/" },
    { label: "Patterns", path: "docs/patterns/" },
  ],
  alternatives: [
    {
      label: "Chat history",
      strength: "Remembers the conversation",
      limit: "The context stays tied to that chat and becomes noisy or incomplete over time.",
    },
    {
      label: "Agent instructions",
      strength: "Guides how an agent should behave",
      limit: "It does not own active Tasks, scoped retrieval, Evidence, or Memory lifecycle by itself.",
    },
    {
      label: "Private agent memory",
      strength: "Can personalize one host",
      limit: "The project cannot reliably review, version, or carry that memory to another agent.",
    },
    {
      label: "Project documentation",
      strength: "Explains durable project knowledge",
      limit: "Documentation alone does not connect that knowledge to work state, checks, or closure.",
    },
  ],
  comparison: [
    { capability: "Owned and versioned by the project", chat: "No", instructions: "Yes", privateMemory: "No", docs: "Yes", skopos: "Yes" },
    { capability: "Retrieves context for the current Scope and Task", chat: "No", instructions: "Limited", privateMemory: "Host-defined", docs: "No", skopos: "Yes" },
    { capability: "Carries active work and acceptance", chat: "Informally", instructions: "No", privateMemory: "No", docs: "Sometimes", skopos: "Yes" },
    { capability: "Connects completion to fresh Evidence", chat: "No", instructions: "No", privateMemory: "No", docs: "No", skopos: "Yes" },
    { capability: "Portable across supported agents", chat: "No", instructions: "Partial", privateMemory: "No", docs: "Yes", skopos: "Yes" },
  ],
  adoptionOperations: ["Keep", "Move", "Merge", "Split", "Rewrite", "Archive", "Delete"],
} as const;
