export type UseCase = {
  id: string;
  number: string;
  category: string;
  title: string;
  problem: string;
  outcome: string;
  prompt: string;
  guideLabel: string;
  guideHref: string;
  note?: string;
};

export const useCasesCopy = {
  title: "Use coding agents on real projects without rebuilding context every time.",
  description:
    "Start with the project problem you recognize. Each workflow shows what to ask your agent, what Skopos maintains, and what you should review.",
  summary: ["Existing codebases", "Everyday agent work", "Solo builders and teams"],
  cases: [
    {
      id: "set-up-existing-project",
      number: "01",
      category: "Start",
      title: "Bring an existing repository into Skopos.",
      problem:
        "Your project already has code, docs, conventions, and commands. A tool that rewrites them before understanding the repository can destroy useful truth.",
      outcome:
        "Skopos discovers what exists, proposes how it should fit the Memory standard, and waits for approval before material documentation changes.",
      prompt:
        "Set up Skopos in this existing repository. Preserve its current docs and commands as project truth. Explain what you find, show me one consolidated recommendation, and ask before applying material changes.",
      guideLabel: "Set up an existing project",
      guideHref: "/docs",
    },
    {
      id: "plan-build-feature",
      number: "02",
      category: "Build",
      title: "Plan and build one feature without losing the intent.",
      problem:
        "A productive conversation can still drift into extra work, miss a constraint, or leave the next session unable to explain why the implementation looks this way.",
      outcome:
        "The agreed result becomes a bounded Task with relevant Memory, acceptance, ownership, constraints, and the checks that matter.",
      prompt:
        "Help me plan and build [feature]. First recover the relevant project context, clarify decisions that change scope, then create a bounded Task with acceptance criteria and owned paths before implementation.",
      guideLabel: "Plan and finish a feature",
      guideHref: "/docs",
    },
    {
      id: "return-after-time-away",
      number: "03",
      category: "Return",
      title: "Come back after days or weeks.",
      problem:
        "You remember the project, but not every open decision, unfinished Task, failed check, or reason a piece of work stopped.",
      outcome:
        "Skopos gives the agent a compact view of live work and material project truth instead of forcing you to replay old chats.",
      prompt:
        "Bring me back up to speed on this project. Show active Tasks, material decisions, recent Evidence, and what needs attention next—without dumping the whole repository.",
      guideLabel: "Return to ongoing work",
      guideHref: "/docs",
    },
    {
      id: "continue-fresh-session",
      number: "04",
      category: "Continue",
      title: "Continue in a fresh coding-agent session.",
      problem:
        "A new chat has no reliable understanding of the work in progress, even when the previous session was excellent.",
      outcome:
        "The fresh session recovers the current Task, relevant Scope Memory, owned paths, Evidence, and remaining blockers from the project.",
      prompt:
        "Continue the active [task] in this fresh session. Recover its Scope, relevant Project Memory, acceptance, ownership, Evidence, and remaining blockers before making changes.",
      guideLabel: "Continue in a fresh session",
      guideHref: "/docs",
    },
    {
      id: "split-independent-work",
      number: "05",
      category: "Coordinate",
      title: "Split independent work without losing the reviewer.",
      problem:
        "Parallel agents move quickly, but overlapping paths, hidden dependencies, and disconnected conclusions can make the final integration harder than the original work.",
      outcome:
        "Independent child Tasks receive explicit acceptance and ownership while the originating conversation remains responsible for reviewing the combined result.",
      prompt:
        "Split this work only where the parts are genuinely independent. Give each child Task explicit acceptance criteria and owned paths, and keep this conversation as reviewer for the combined result.",
      guideLabel: "Coordinate bounded child work",
      guideHref: "/docs",
      note: "Automated delivery is host-dependent; Skopos keeps a manual fallback when native delivery is not verified.",
    },
    {
      id: "require-project-checks",
      number: "06",
      category: "Prove",
      title: "Require the right checks before calling work done.",
      problem:
        "A generic green check can miss the requirement that actually matters, and an old passing result can silently outlive the source it proved.",
      outcome:
        "Project-approved checks produce source-bound Evidence, and Readiness explains exactly what still prevents closure.",
      prompt:
        "Before calling this Task complete, select the focused project-approved checks for its changed paths, run them, and explain any missing or stale Evidence.",
      guideLabel: "Verify and finish work",
      guideHref: "/docs",
    },
    {
      id: "keep-memory-current",
      number: "07",
      category: "Remember",
      title: "Keep project knowledge current as the code grows.",
      problem:
        "Architecture, decisions, and operating rules gradually fall behind when documentation updates depend on someone remembering to do them later.",
      outcome:
        "Before closure, durable impact is reviewed. Canonical Memory is updated when truth changed—or explicitly left alone when it did not.",
      prompt:
        "Before closing, review whether this work changed architecture, decisions, patterns, or operating rules. Update canonical Project Memory if needed; otherwise record why no change is required.",
      guideLabel: "Maintain Project Memory",
      guideHref: "/project-memory",
    },
  ] satisfies readonly UseCase[],
} as const;
